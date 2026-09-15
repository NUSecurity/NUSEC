import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FileUp, Loader2, Search } from "lucide-react";
import CtfLayout from "@/components/ctf/CtfLayout";
import { Button } from "@/components/ui/button";
import {
  Capture,
  MAX_FILE_BYTES,
  followStream,
  hexDump,
  parseCapture,
  textOf,
} from "@/lib/pcap";
import { cn } from "@/lib/utils";

/** The capture that ships with the Leaked Login challenge. */
const bundledCapture = {
  name: "nusec-login.pcapng",
  href: "/ctf/hands-on-practice/nusec-login.pcapng",
};

/** Only the first chunk of each payload is searchable, to bound the index. */
const SEARCH_BYTES = 2048;

function formatBytes(total: number): string {
  if (total < 1024) return `${total} B`;
  if (total < 1024 * 1024) return `${(total / 1024).toFixed(1)} KB`;
  return `${(total / 1024 / 1024).toFixed(1)} MB`;
}

function endpoint(host: string, port?: number): string {
  return port === undefined ? host : `${host}:${port}`;
}

/** Wraps every case-insensitive hit in `query` so matches are easy to spot. */
function highlight(text: string, query: string) {
  if (!query) return text;

  const needle = query.toLowerCase();
  const haystack = text.toLowerCase();
  const parts: React.ReactNode[] = [];
  let at = 0;

  for (;;) {
    const found = haystack.indexOf(needle, at);
    if (found < 0) break;

    if (found > at) parts.push(text.slice(at, found));
    parts.push(
      <mark
        key={found}
        className="rounded bg-primary/40 px-0.5 text-foreground"
      >
        {text.slice(found, found + query.length)}
      </mark>,
    );
    at = found + query.length;
  }

  if (parts.length === 0) return text;
  if (at < text.length) parts.push(text.slice(at));
  return parts;
}

/**
 * /tools/pcap — a stripped-down packet viewer so members can work the network
 * challenges without installing Wireshark. Parsing happens entirely in the
 * browser: the capture is never uploaded anywhere.
 */
const PcapAnalyzer = () => {
  const [capture, setCapture] = useState<Capture | null>(null);
  const [sourceName, setSourceName] = useState("");
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"stream" | "hex">("stream");
  const [onlyThisStream, setOnlyThisStream] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const load = useCallback((buffer: ArrayBuffer, name: string) => {
    try {
      const parsed = parseCapture(buffer);

      if (parsed.packets.length === 0) {
        throw new Error("Parsed the file, but it contains no packets.");
      }

      setCapture(parsed);
      setSourceName(name);
      setStatus("ready");
      // Land on the first packet that actually carries data — for these
      // challenges that is nearly always the interesting one.
      const firstWithPayload = parsed.packets.find(
        (packet) => packet.payload.length > 0,
      );
      setSelectedIndex((firstWithPayload ?? parsed.packets[0]).index);
    } catch (error) {
      setCapture(null);
      setErrorMessage(
        error instanceof Error ? error.message : "Couldn't parse that file.",
      );
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    fetch(bundledCapture.href)
      .then((response) => {
        if (!response.ok) throw new Error(`Fetch returned ${response.status}.`);
        return response.arrayBuffer();
      })
      .then((buffer) => {
        if (!cancelled) load(buffer, bundledCapture.name);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setErrorMessage(
          error instanceof Error
            ? `Couldn't load ${bundledCapture.name}: ${error.message}`
            : `Couldn't load ${bundledCapture.name}.`,
        );
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [load]);

  const handleFile = async (file: File) => {
    if (file.size > MAX_FILE_BYTES) {
      setCapture(null);
      setErrorMessage(
        `That file is ${formatBytes(file.size)}; the limit is ${formatBytes(MAX_FILE_BYTES)}.`,
      );
      setStatus("error");
      return;
    }

    setStatus("loading");
    load(await file.arrayBuffer(), file.name);
  };

  // Lowercased payload text per packet, so typing in the box stays cheap.
  const searchIndex = useMemo(
    () =>
      capture?.packets.map((packet) =>
        `${packet.info} ${textOf(packet.payload.subarray(0, SEARCH_BYTES))}`.toLowerCase(),
      ) ?? [],
    [capture],
  );

  // Memoised so the empty-capture fallback keeps a stable identity.
  const packets = useMemo(() => capture?.packets ?? [], [capture]);
  const trimmedQuery = query.trim();

  const selected = packets.find((packet) => packet.index === selectedIndex) ?? null;

  const visible = useMemo(() => {
    let list = packets;

    // Captures like nusec-login.pcapng repeat the same exchange several times,
    // so isolating one conversation is the quickest way to cut the noise.
    if (onlyThisStream && selected?.stream) {
      list = list.filter((packet) => packet.stream === selected.stream);
    }

    if (trimmedQuery) {
      const needle = trimmedQuery.toLowerCase();
      list = list.filter((packet) => searchIndex[packet.index - 1]?.includes(needle));
    }

    return list;
  }, [packets, searchIndex, trimmedQuery, onlyThisStream, selected]);
  const stream = useMemo(
    () => (selected && capture ? followStream(capture.packets, selected) : []),
    [capture, selected],
  );

  const streamCount = useMemo(
    () => new Set(packets.map((packet) => packet.stream).filter(Boolean)).size,
    [packets],
  );

  const startedAt = packets[0]?.timestamp ?? 0;
  const duration =
    packets.length > 1
      ? (packets[packets.length - 1].timestamp - startedAt) / 1000
      : 0;

  return (
    <CtfLayout wide>
      <header className="mb-8">
        <h1 className="mb-3 text-3xl font-bold text-foreground md:text-4xl">
          <span className="bg-gradient-primary bg-clip-text text-transparent">
            Packet Analyzer
          </span>
        </h1>
        <p className="leading-relaxed text-muted-foreground">
          A minimal in-browser stand-in for Wireshark. Pick a packet to read its
          bytes, or follow the whole conversation it belongs to. Nothing leaves
          your machine — the capture is parsed locally.
        </p>
      </header>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            aria-label="Search packet contents"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search packet contents, e.g. password"
            autoComplete="off"
            spellCheck={false}
            className="w-full rounded-md border border-input bg-secondary py-2 pl-9 pr-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <input
          ref={fileInput}
          type="file"
          accept=".pcap,.pcapng,.cap"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void handleFile(file);
            event.target.value = "";
          }}
        />
        <Button
          variant="outline"
          onClick={() => fileInput.current?.click()}
          className="shrink-0"
        >
          <FileUp />
          Open a capture
        </Button>
      </div>

      {status === "loading" && (
        <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/40 px-4 py-3 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Parsing capture…
        </div>
      )}

      {status === "error" && (
        <div className="rounded-lg border border-destructive/60 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {errorMessage}
        </div>
      )}

      {capture && status === "ready" && (
        <>
          <dl className="mb-6 grid grid-cols-2 gap-3 rounded-lg border border-border bg-secondary/40 px-4 py-3 text-sm sm:grid-cols-4">
            {[
              ["Capture", sourceName],
              ["Format", `${capture.format} · ${capture.linkTypeName}`],
              ["Packets", String(capture.packets.length)],
              ["Duration", `${duration.toFixed(3)} s`],
            ].map(([label, value]) => (
              <div key={label} className="min-w-0">
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                  {label}
                </dt>
                <dd className="truncate font-mono text-foreground" title={value}>
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          {capture.warnings.map((warning) => (
            <p key={warning} className="mb-4 text-sm text-yellow-500">
              {warning}
            </p>
          ))}

          <div className="overflow-hidden rounded-lg border border-border">
            <div className="max-h-[22rem] overflow-auto">
              <table className="w-full min-w-[52rem] border-collapse text-left font-mono text-xs">
                <thead className="sticky top-0 z-10 bg-secondary text-muted-foreground">
                  <tr>
                    {["#", "Time", "Stream", "Source", "Destination", "Proto", "Len", "Info"].map(
                      (heading) => (
                        <th
                          key={heading}
                          scope="col"
                          className="whitespace-nowrap px-3 py-2 font-medium uppercase tracking-wider"
                        >
                          {heading}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {visible.map((packet) => (
                    <tr
                      key={packet.index}
                      onClick={() => setSelectedIndex(packet.index)}
                      className={cn(
                        "cursor-pointer border-t border-border/60 transition-colors",
                        packet.index === selectedIndex
                          ? "bg-primary/20 text-foreground"
                          : "hover:bg-secondary/60",
                        packet.payload.length === 0 && "text-muted-foreground",
                      )}
                    >
                      <td className="px-3 py-1.5">{packet.index}</td>
                      <td className="whitespace-nowrap px-3 py-1.5">
                        {((packet.timestamp - startedAt) / 1000).toFixed(6)}
                      </td>
                      <td className="px-3 py-1.5">{packet.streamIndex ?? "—"}</td>
                      <td className="whitespace-nowrap px-3 py-1.5">
                        {endpoint(packet.src, packet.srcPort)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-1.5">
                        {endpoint(packet.dst, packet.dstPort)}
                      </td>
                      <td className="px-3 py-1.5 text-primary">{packet.protocol}</td>
                      <td className="px-3 py-1.5">{packet.length}</td>
                      <td className="max-w-[24rem] truncate px-3 py-1.5" title={packet.info}>
                        {packet.info}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {visible.length === 0 && (
              <p className="border-t border-border px-4 py-3 text-sm text-muted-foreground">
                No packet contains “{trimmedQuery}”.
              </p>
            )}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <p>
              {visible.length === packets.length
                ? `${packets.length} packets in ${streamCount} conversation${streamCount === 1 ? "" : "s"}. Dimmed rows carry no payload.`
                : `Showing ${visible.length} of ${packets.length} packets.`}
            </p>

            <label className="flex cursor-pointer items-center gap-2 select-none">
              <input
                type="checkbox"
                checked={onlyThisStream}
                disabled={!selected?.stream}
                onChange={(event) => setOnlyThisStream(event.target.checked)}
                className="h-3.5 w-3.5 accent-primary"
              />
              Only this conversation
            </label>
          </div>

          {selected && (
            <section className="mt-6">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                {(
                  [
                    ["stream", "Follow stream"],
                    ["hex", "Packet bytes"],
                  ] as const
                ).map(([value, label]) => (
                  <Button
                    key={value}
                    size="sm"
                    variant={tab === value ? "default" : "outline"}
                    onClick={() => setTab(value)}
                    className={cn(tab === value && "bg-gradient-primary text-white")}
                  >
                    {label}
                  </Button>
                ))}
                <span className="ml-auto font-mono text-xs text-muted-foreground">
                  Packet {selected.index} · {selected.protocol} ·{" "}
                  {formatBytes(selected.payload.length)} payload
                </span>
              </div>

              {tab === "hex" && (
                <pre className="overflow-auto rounded-lg border border-border bg-cyber-darker px-4 py-3 font-mono text-xs leading-relaxed text-foreground">
                  {hexDump(selected.frame)}
                </pre>
              )}

              {tab === "stream" &&
                (stream.length > 0 ? (
                  <div className="space-y-3">
                    <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <span className="inline-block h-2.5 w-2.5 rounded-sm bg-primary" />
                        client → server
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="inline-block h-2.5 w-2.5 rounded-sm bg-green-500" />
                        server → client
                      </span>
                    </p>

                    {stream.map((chunk, position) => (
                      <div
                        key={position}
                        className={cn(
                          "overflow-auto rounded-lg border px-4 py-3",
                          chunk.fromClient
                            ? "border-primary/40 bg-primary/5"
                            : "border-green-500/30 bg-green-500/5",
                        )}
                      >
                        <p
                          className={cn(
                            "mb-2 font-mono text-xs",
                            chunk.fromClient ? "text-primary" : "text-green-400",
                          )}
                        >
                          {chunk.fromClient ? "client → server" : "server → client"}
                          {"  ·  "}
                          {chunk.from} → {chunk.to}
                        </p>
                        <pre className="whitespace-pre-wrap break-all font-mono text-xs leading-relaxed text-foreground">
                          {highlight(chunk.text, trimmedQuery)}
                        </pre>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="rounded-lg border border-border bg-secondary/40 px-4 py-3 text-sm text-muted-foreground">
                    This packet carries no data — it is part of the TCP handshake
                    or an acknowledgement. Pick a row that is not dimmed.
                  </p>
                ))}
            </section>
          )}
        </>
      )}
    </CtfLayout>
  );
};

export default PcapAnalyzer;
