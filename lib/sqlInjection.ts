/**
 * The deliberately vulnerable login behind the "Members Only" challenge.
 *
 * WARNING — this file builds SQL by string concatenation on purpose. That is
 * the whole challenge. Nothing here is a pattern to copy into real code; the
 * fix is parameterised queries.
 *
 * Rather than pattern-matching on known payloads, the injected string is
 * genuinely tokenised and evaluated, so `' OR '1'='1' --`, `admin' --`, and
 * quoting mistakes all behave the way they would against a real database —
 * including AND binding tighter than OR, which is why a bare `' OR '1'='1`
 * in the username alone is not enough.
 */

export class SqlError extends Error {}

export interface Member {
  id: number;
  username: string;
  password: string;
  role: "admin" | "member";
}

/** The admin password is unguessable on purpose: injection is the only way in. */
export const members: Member[] = [
  { id: 1, username: "admin", password: "Xv7$qP2mLd9!zR4tWn6", role: "admin" },
  { id: 2, username: "j.reyes", password: "hunter2", role: "member" },
  { id: 3, username: "dave", password: "correcthorse", role: "member" },
];

const columns: Record<string, (member: Member) => Value> = {
  id: (member) => member.id,
  username: (member) => member.username,
  password: (member) => member.password,
  role: (member) => member.role,
};

type Value = string | number | boolean | null;
type Node = (member: Member) => Value;

/* --------------------------------------------------------------- tokenizer */

type TokenKind = "str" | "num" | "word" | "op" | "lparen" | "rparen" | "punct";
interface Token {
  kind: TokenKind;
  value: string;
}

function tokenize(sql: string): Token[] {
  const tokens: Token[] = [];
  let at = 0;

  while (at < sql.length) {
    const char = sql[at];

    if (/\s/.test(char)) {
      at += 1;
      continue;
    }

    // Line comment — the reason `admin' --` swallows the password check.
    if (char === "-" && sql[at + 1] === "-") {
      while (at < sql.length && sql[at] !== "\n") at += 1;
      continue;
    }

    if (char === "/" && sql[at + 1] === "*") {
      const end = sql.indexOf("*/", at + 2);
      if (end < 0) throw new SqlError("unterminated block comment");
      at = end + 2;
      continue;
    }

    if (char === "'") {
      let value = "";
      at += 1;

      for (;;) {
        if (at >= sql.length) throw new SqlError('unrecognized token: "\'"');
        if (sql[at] === "'") {
          // '' is an escaped quote inside a literal.
          if (sql[at + 1] === "'") {
            value += "'";
            at += 2;
            continue;
          }
          at += 1;
          break;
        }
        value += sql[at];
        at += 1;
      }

      tokens.push({ kind: "str", value });
      continue;
    }

    if (/[0-9]/.test(char)) {
      let value = "";
      while (at < sql.length && /[0-9.]/.test(sql[at])) value += sql[at++];
      tokens.push({ kind: "num", value });
      continue;
    }

    if (/[A-Za-z_]/.test(char)) {
      let value = "";
      while (at < sql.length && /[A-Za-z0-9_.]/.test(sql[at])) value += sql[at++];
      tokens.push({ kind: "word", value });
      continue;
    }

    if (char === "(") {
      tokens.push({ kind: "lparen", value: char });
      at += 1;
      continue;
    }

    if (char === ")") {
      tokens.push({ kind: "rparen", value: char });
      at += 1;
      continue;
    }

    if (char === ";") {
      at += 1;
      continue;
    }

    // Punctuation from the SELECT list. It never appears in the WHERE clause we
    // evaluate, so reaching one means the injected text put it there — and the
    // parser reports that as a syntax error, which is what SQL would do too.
    if (char === "," || char === "*") {
      tokens.push({ kind: "punct", value: char });
      at += 1;
      continue;
    }

    const pair = sql.slice(at, at + 2);
    if (pair === "<>" || pair === "!=" || pair === "<=" || pair === ">=") {
      tokens.push({ kind: "op", value: pair });
      at += 2;
      continue;
    }

    if (char === "=" || char === "<" || char === ">") {
      tokens.push({ kind: "op", value: char });
      at += 1;
      continue;
    }

    throw new SqlError(`unrecognized token: "${char}"`);
  }

  return tokens;
}

/* ------------------------------------------------------------- evaluation */

function truthy(value: Value): boolean {
  if (value === null) return false;
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  // SQLite coerces a bare string in a boolean position to a number.
  const asNumber = Number(value);
  return Number.isNaN(asNumber) ? false : asNumber !== 0;
}

function compare(left: Value, operator: string, right: Value): Value {
  if (left === null || right === null) return null;

  let result: number;
  if (typeof left === "number" && typeof right === "number") {
    result = left === right ? 0 : left < right ? -1 : 1;
  } else {
    const a = String(left);
    const b = String(right);
    result = a === b ? 0 : a < b ? -1 : 1;
  }

  switch (operator) {
    case "=":
      return result === 0;
    case "!=":
    case "<>":
      return result !== 0;
    case "<":
      return result < 0;
    case ">":
      return result > 0;
    case "<=":
      return result <= 0;
    case ">=":
      return result >= 0;
    default:
      throw new SqlError(`unsupported operator "${operator}"`);
  }
}

function likeMatch(value: Value, pattern: Value): boolean {
  if (value === null || pattern === null) return false;
  const escaped = String(pattern).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const expression = escaped.replace(/%/g, ".*").replace(/_/g, ".");
  return new RegExp(`^${expression}$`, "i").test(String(value));
}

/* ----------------------------------------------------------------- parser */

class Parser {
  private at = 0;

  constructor(private readonly tokens: Token[]) {}

  private peek(): Token | undefined {
    return this.tokens[this.at];
  }

  private isWord(word: string): boolean {
    const token = this.peek();
    return token?.kind === "word" && token.value.toUpperCase() === word;
  }

  private eatWord(word: string): boolean {
    if (!this.isWord(word)) return false;
    this.at += 1;
    return true;
  }

  expectEnd() {
    const token = this.peek();
    if (token) throw new SqlError(`near "${token.value}": syntax error`);
  }

  parseExpression(): Node {
    return this.parseOr();
  }

  private parseOr(): Node {
    let left = this.parseAnd();
    while (this.eatWord("OR")) {
      const right = this.parseAnd();
      const previous = left;
      left = (member) => truthy(previous(member)) || truthy(right(member));
    }
    return left;
  }

  // Binds tighter than OR, exactly as SQL specifies.
  private parseAnd(): Node {
    let left = this.parseNot();
    while (this.eatWord("AND")) {
      const right = this.parseNot();
      const previous = left;
      left = (member) => truthy(previous(member)) && truthy(right(member));
    }
    return left;
  }

  private parseNot(): Node {
    if (this.eatWord("NOT")) {
      const inner = this.parseNot();
      return (member) => !truthy(inner(member));
    }
    return this.parseComparison();
  }

  private parseComparison(): Node {
    const left = this.parsePrimary();
    const token = this.peek();

    if (token?.kind === "op") {
      this.at += 1;
      const right = this.parsePrimary();
      return (member) => compare(left(member), token.value, right(member));
    }

    if (this.isWord("LIKE")) {
      this.at += 1;
      const right = this.parsePrimary();
      return (member) => likeMatch(left(member), right(member));
    }

    if (this.isWord("IS")) {
      this.at += 1;
      const negated = this.eatWord("NOT");
      if (!this.eatWord("NULL")) throw new SqlError('near "IS": syntax error');
      return (member) => (left(member) === null) !== negated;
    }

    return left;
  }

  private parsePrimary(): Node {
    const token = this.tokens[this.at];
    if (!token) throw new SqlError("incomplete input");
    this.at += 1;

    if (token.kind === "lparen") {
      const inner = this.parseExpression();
      if (this.tokens[this.at]?.kind !== "rparen") {
        throw new SqlError('near ")": syntax error');
      }
      this.at += 1;
      return inner;
    }

    if (token.kind === "str") return () => token.value;
    if (token.kind === "num") return () => Number(token.value);

    if (token.kind === "word") {
      const upper = token.value.toUpperCase();
      if (upper === "TRUE") return () => true;
      if (upper === "FALSE") return () => false;
      if (upper === "NULL") return () => null;

      const column = token.value.toLowerCase().split(".").pop() ?? "";
      const read = Object.prototype.hasOwnProperty.call(columns, column)
        ? columns[column]
        : undefined;
      if (!read) throw new SqlError(`no such column: ${token.value}`);
      return read;
    }

    throw new SqlError(`near "${token.value}": syntax error`);
  }
}

/** Evaluates the WHERE clause of the generated statement against the table. */
export function runQuery(sql: string, rows: Member[]): Member[] {
  const tokens = tokenize(sql);
  const whereAt = tokens.findIndex(
    (token) => token.kind === "word" && token.value.toUpperCase() === "WHERE",
  );

  if (whereAt < 0) return rows;

  const parser = new Parser(tokens.slice(whereAt + 1));
  const predicate = parser.parseExpression();
  parser.expectEnd();

  return rows.filter((row) => truthy(predicate(row)));
}

/** The bug: user input is pasted straight into the statement. */
export function buildQuery(username: string, password: string): string {
  return `SELECT id, username, role FROM members WHERE username = '${username}' AND password = '${password}'`;
}

export interface LoginResult {
  outcome: "admin" | "member" | "denied" | "error";
  message: string;
  username?: string;
  matched?: number;
  /** Echoed back only when the statement failed to parse. */
  query?: string;
}

export function attemptLogin(username: string, password: string): LoginResult {
  const query = buildQuery(username, password);

  try {
    const matched = runQuery(query, members);

    if (matched.length === 0) {
      return { outcome: "denied", message: "Invalid username or password." };
    }

    const user = matched[0];

    if (user.role === "admin") {
      return {
        outcome: "admin",
        message: `Signed in as ${user.username}.`,
        username: user.username,
        matched: matched.length,
      };
    }

    return {
      outcome: "member",
      message: `Signed in as ${user.username} — member accounts cannot open the admin panel.`,
      username: user.username,
      matched: matched.length,
    };
  } catch (error) {
    // A leaked database error is how you learn the shape of the query.
    return {
      outcome: "error",
      message:
        error instanceof SqlError
          ? `OperationalError: ${error.message}`
          : "OperationalError: malformed statement",
      query,
    };
  }
}
