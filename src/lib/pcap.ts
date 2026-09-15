/**
 * Minimal capture-file parser for the in-browser analyzer.
 *
 * Handles classic pcap and pcapng, plus the link layers our challenges
 * actually ship: loopback/NULL (what nusec-login.pcapng uses), Ethernet, raw
 * IP, and Linux cooked. Packets are decoded just far enough to list them and
 * reassemble a TCP conversation — this is a teaching aid, not Wireshark.
 */

/** Refuse absurd inputs rather than locking up a member's laptop mid-meeting. */
export const MAX_FILE_BYTES = 25 * 1024 * 1024;
const MAX_PACKETS = 20000;

export interface Packet {
  /** 1-based, matching the numbering Wireshark shows. */
  index: number;
  /** Epoch milliseconds. */
  timestamp: number;
  src: string;
  dst: string;
  srcPort?: number;
  dstPort?: number;
  protocol: string;
  /** Original on-wire length, which can exceed the captured bytes. */
  length: number;
  /** Captured frame, link-layer header included. */
  frame: Uint8Array;
  /** Transport payload — the part carrying credentials, HTML, and so on. */
  payload: Uint8Array;
  info: string;
  /** Key shared by both directions of one conversation, for Follow Stream. */
  stream?: string;
  /** 0-based conversation number, in the order conversations first appear. */
  streamIndex?: number;
}

export interface Capture {
  format: "pcap" | "pcapng";
  linkType: number;
  linkTypeName: string;
  packets: Packet[];
  /** Non-fatal problems, e.g. a truncated trailing block. */
  warnings: string[];
}

const linkTypeNames: Record<number, string> = {
  0: "NULL / Loopback",
  1: "Ethernet",
  101: "Raw IP",
  113: "Linux cooked (SLL)",
  228: "Raw IPv4",
  229: "Raw IPv6",
  276: "Linux cooked v2",
};

export function linkTypeName(linkType: number): string {
  return linkTypeNames[linkType] ?? `Link type ${linkType}`;
}

const ipProtocolNames: Record<number, string> = {
  1: "ICMP",
  2: "IGMP",
  6: "TCP",
  17: "UDP",
  47: "GRE",
  58: "ICMPv6",
  89: "OSPF",
  132: "SCTP",
};

const tcpFlagBits: [number, string][] = [
  [0x01, "FIN"],
  [0x02, "SYN"],
  [0x04, "RST"],
  [0x08, "PSH"],
  [0x10, "ACK"],
  [0x20, "URG"],
  [0x40, "ECE"],
  [0x80, "CWR"],
];

const httpPrefixes = [
  "GET ",
  "POST ",
  "PUT ",
  "HEAD ",
  "DELETE ",
  "PATCH ",
  "OPTIONS ",
  "TRACE ",
  "CONNECT ",
  "HTTP/",
];

/* ------------------------------------------------------------------ bytes */

/** Printable ASCII, with everything else shown as a dot — like a hex editor. */
export function asciiOf(bytes: Uint8Array): string {
  let out = "";
  for (const byte of bytes) {
    out += byte >= 0x20 && byte <= 0x7e ? String.fromCharCode(byte) : ".";
  }
  return out;
}

/** Same, but keeps newlines and tabs so HTTP headers stay readable. */
export function textOf(bytes: Uint8Array): string {
  let out = "";
  for (const byte of bytes) {
    if (byte === 0x0a || byte === 0x0d || byte === 0x09) {
      out += String.fromCharCode(byte);
    } else {
      out += byte >= 0x20 && byte <= 0x7e ? String.fromCharCode(byte) : ".";
    }
  }
  return out;
}

/** `offset  hex bytes  |ascii|`, 16 bytes per line. */
export function hexDump(bytes: Uint8Array, limit = 4096): string {
  const shown = bytes.subarray(0, limit);
  const lines: string[] = [];

  for (let at = 0; at < shown.length; at += 16) {
    const row = shown.subarray(at, at + 16);
    const hex = [...row]
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join(" ")
      .padEnd(47, " ");
    lines.push(`${at.toString(16).padStart(8, "0")}  ${hex}  |${asciiOf(row)}|`);
  }

  if (bytes.length > shown.length) {
    lines.push(`… ${bytes.length - shown.length} more bytes not shown`);
  }
  return lines.join("\n");
}

function formatIPv4(bytes: Uint8Array, at: number): string {
  return `${bytes[at]}.${bytes[at + 1]}.${bytes[at + 2]}.${bytes[at + 3]}`;
}

/** Groups in hex with the longest zero run collapsed to `::`. */
function formatIPv6(bytes: Uint8Array, at: number): string {
  const groups: number[] = [];
  for (let i = 0; i < 8; i += 1) {
    groups.push((bytes[at + i * 2] << 8) | bytes[at + i * 2 + 1]);
  }

  let bestStart = -1;
  let bestLength = 0;
  let runStart = -1;

  for (let i = 0; i <= groups.length; i += 1) {
    if (i < groups.length && groups[i] === 0) {
      if (runStart < 0) runStart = i;
    } else if (runStart >= 0) {
      if (i - runStart > bestLength) {
        bestLength = i - runStart;
        bestStart = runStart;
      }
      runStart = -1;
    }
  }

  const text = groups.map((group) => group.toString(16));
  if (bestLength < 2) return text.join(":");

  return `${text.slice(0, bestStart).join(":")}::${text
    .slice(bestStart + bestLength)
    .join(":")}`;
}

/* ---------------------------------------------------------------- decoding */

type Decoded = Pick<
  Packet,
  "src" | "dst" | "srcPort" | "dstPort" | "protocol" | "payload" | "info" | "stream"
>;

const empty = new Uint8Array(0);

/** One end of a conversation, formatted so both directions sort identically. */
function endpoint(host: string, port?: number) {
  return port === undefined ? host : `${host}:${port}`;
}

function streamKey(a: string, b: string, protocol: string) {
  return `${protocol} ${[a, b].sort().join(" <-> ")}`;
}

function decodeTransport(
  frame: Uint8Array,
  at: number,
  protocolNumber: number,
  src: string,
  dst: string,
): Decoded {
  const protocol = ipProtocolNames[protocolNumber] ?? `IP proto ${protocolNumber}`;
  const base: Decoded = { src, dst, protocol, payload: empty, info: protocol };

  if (protocolNumber === 6) {
    if (at + 20 > frame.length) return { ...base, info: "TCP (truncated header)" };

    const srcPort = (frame[at] << 8) | frame[at + 1];
    const dstPort = (frame[at + 2] << 8) | frame[at + 3];
    const headerLength = (frame[at + 12] >> 4) * 4;
    const flags = frame[at + 13];
    const payload = frame.subarray(Math.min(at + headerLength, frame.length));

    const flagText = tcpFlagBits
      .filter(([bit]) => flags & bit)
      .map(([, name]) => name)
      .join(", ");

    return {
      src,
      dst,
      srcPort,
      dstPort,
      protocol: "TCP",
      payload,
      info: describeTcp(srcPort, dstPort, flagText, payload),
      stream: streamKey(endpoint(src, srcPort), endpoint(dst, dstPort), "TCP"),
    };
  }

  if (protocolNumber === 17) {
    if (at + 8 > frame.length) return { ...base, info: "UDP (truncated header)" };

    const srcPort = (frame[at] << 8) | frame[at + 1];
    const dstPort = (frame[at + 2] << 8) | frame[at + 3];
    const payload = frame.subarray(Math.min(at + 8, frame.length));

    return {
      src,
      dst,
      srcPort,
      dstPort,
      protocol: "UDP",
      payload,
      info: `${srcPort} → ${dstPort}  Len=${payload.length}`,
      stream: streamKey(endpoint(src, srcPort), endpoint(dst, dstPort), "UDP"),
    };
  }

  if (protocolNumber === 1 && at < frame.length) {
    return { ...base, info: `ICMP type ${frame[at]} code ${frame[at + 1] ?? 0}` };
  }

  return base;
}

/** Wireshark-style: show the request line for HTTP, otherwise flags and size. */
function describeTcp(
  srcPort: number,
  dstPort: number,
  flagText: string,
  payload: Uint8Array,
): string {
  if (payload.length > 0) {
    const head = asciiOf(payload.subarray(0, 12));
    if (httpPrefixes.some((prefix) => head.startsWith(prefix))) {
      const firstLine = textOf(payload.subarray(0, 200)).split(/\r?\n/)[0];
      return `${srcPort} → ${dstPort}  ${firstLine}`;
    }
  }

  const suffix = payload.length > 0 ? `  Len=${payload.length}` : "";
  return `${srcPort} → ${dstPort}  [${flagText || "none"}]${suffix}`;
}

function decodeIp(frame: Uint8Array, at: number): Decoded | undefined {
  if (at >= frame.length) return undefined;
  const version = frame[at] >> 4;

  if (version === 4) {
    if (at + 20 > frame.length) return undefined;
    const headerLength = (frame[at] & 0x0f) * 4;
    return decodeTransport(
      frame,
      at + headerLength,
      frame[at + 9],
      formatIPv4(frame, at + 12),
      formatIPv4(frame, at + 16),
    );
  }

  if (version === 6) {
    if (at + 40 > frame.length) return undefined;
    return decodeTransport(
      frame,
      at + 40,
      frame[at + 6],
      formatIPv6(frame, at + 8),
      formatIPv6(frame, at + 24),
    );
  }

  return undefined;
}

function macAt(frame: Uint8Array, at: number): string {
  return [...frame.subarray(at, at + 6)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join(":");
}

function decodeEthernet(frame: Uint8Array): Decoded {
  if (frame.length < 14) {
    return { src: "?", dst: "?", protocol: "Ethernet", payload: empty, info: "Truncated frame" };
  }

  let at = 12;
  let etherType = (frame[at] << 8) | frame[at + 1];
  at += 2;

  // 802.1Q / QinQ: step over each tag to reach the real EtherType.
  while ((etherType === 0x8100 || etherType === 0x88a8) && at + 4 <= frame.length) {
    etherType = (frame[at + 2] << 8) | frame[at + 3];
    at += 4;
  }

  if (etherType === 0x0800 || etherType === 0x86dd) {
    const decoded = decodeIp(frame, at);
    if (decoded) return decoded;
  }

  if (etherType === 0x0806) {
    return {
      src: macAt(frame, 6),
      dst: macAt(frame, 0),
      protocol: "ARP",
      payload: empty,
      info: "Address Resolution Protocol",
    };
  }

  return {
    src: macAt(frame, 6),
    dst: macAt(frame, 0),
    protocol: `0x${etherType.toString(16).padStart(4, "0")}`,
    payload: empty,
    info: "Unhandled EtherType",
  };
}

const unknownFrame: Decoded = {
  src: "?",
  dst: "?",
  protocol: "Unknown",
  payload: empty,
  info: "Link layer not decoded",
};

function decodeFrame(frame: Uint8Array, linkType: number): Decoded {
  switch (linkType) {
    case 1:
      return decodeEthernet(frame);

    // NULL/Loopback prefixes a 4-byte address family whose byte order follows
    // the capturing host, so read the IP version nibble instead of the family.
    case 0:
      return decodeIp(frame, 4) ?? unknownFrame;

    case 101:
    case 228:
    case 229:
      return decodeIp(frame, 0) ?? unknownFrame;

    case 113:
      return decodeIp(frame, 16) ?? unknownFrame;

    case 276:
      return decodeIp(frame, 20) ?? unknownFrame;

    default:
      return decodeIp(frame, 0) ?? unknownFrame;
  }
}

/* ----------------------------------------------------------------- parsing */

function buildPacket(
  index: number,
  timestamp: number,
  frame: Uint8Array,
  originalLength: number,
  linkType: number,
): Packet {
  return {
    index,
    timestamp,
    length: originalLength,
    frame,
    ...decodeFrame(frame, linkType),
  };
}

function parsePcap(buffer: ArrayBuffer, littleEndian: boolean, nano: boolean): Capture {
  const view = new DataView(buffer);
  const bytes = new Uint8Array(buffer);
  const warnings: string[] = [];

  if (buffer.byteLength < 24) throw new Error("Truncated pcap header.");

  const linkType = view.getUint32(20, littleEndian);
  const packets: Packet[] = [];
  const divisor = nano ? 1e6 : 1e3;
  let at = 24;

  while (at + 16 <= buffer.byteLength) {
    const seconds = view.getUint32(at, littleEndian);
    const fraction = view.getUint32(at + 4, littleEndian);
    const captured = view.getUint32(at + 8, littleEndian);
    const original = view.getUint32(at + 12, littleEndian);

    if (at + 16 + captured > buffer.byteLength) {
      warnings.push("The last packet record is truncated and was skipped.");
      break;
    }

    packets.push(
      buildPacket(
        packets.length + 1,
        seconds * 1000 + fraction / divisor,
        bytes.subarray(at + 16, at + 16 + captured),
        original,
        linkType,
      ),
    );

    at += 16 + captured;

    if (packets.length >= MAX_PACKETS) {
      warnings.push(`Stopped after ${MAX_PACKETS} packets.`);
      break;
    }
  }

  numberStreams(packets);

  return {
    format: "pcap",
    linkType,
    linkTypeName: linkTypeName(linkType),
    packets,
    warnings,
  };
}

interface Interface {
  linkType: number;
  /** Timestamp units per second, from if_tsresol. */
  resolution: number;
}

/** if_tsresol (option code 9): a power of ten, or of two when the MSB is set. */
function readInterface(
  view: DataView,
  blockAt: number,
  blockLength: number,
  littleEndian: boolean,
): Interface {
  const linkType = view.getUint16(blockAt + 8, littleEndian);
  let resolution = 1e6;

  let at = blockAt + 16;
  const end = blockAt + blockLength - 4;

  while (at + 4 <= end) {
    const code = view.getUint16(at, littleEndian);
    const length = view.getUint16(at + 2, littleEndian);
    if (code === 0) break;

    if (code === 9 && length >= 1) {
      const raw = view.getUint8(at + 4);
      resolution = raw & 0x80 ? 2 ** (raw & 0x7f) : 10 ** raw;
    }

    at += 4 + length + ((4 - (length % 4)) % 4);
  }

  return { linkType, resolution };
}

function parsePcapng(buffer: ArrayBuffer): Capture {
  const view = new DataView(buffer);
  const bytes = new Uint8Array(buffer);
  const warnings: string[] = [];
  const interfaces: Interface[] = [];
  const packets: Packet[] = [];

  // The byte-order magic in the first Section Header Block sets the endianness
  // for every block that follows it.
  let littleEndian = view.getUint32(8, false) !== 0x1a2b3c4d;
  let at = 0;

  while (at + 12 <= buffer.byteLength) {
    const type = view.getUint32(at, littleEndian);
    const length = view.getUint32(at + 4, littleEndian);

    if (length < 12 || at + length > buffer.byteLength) {
      warnings.push("Stopped at a malformed or truncated block.");
      break;
    }

    if (type === 0x0a0d0d0a) {
      littleEndian = view.getUint32(at + 8, false) !== 0x1a2b3c4d;
    } else if (type === 0x00000001) {
      interfaces.push(readInterface(view, at, length, littleEndian));
    } else if (type === 0x00000006 && at + 28 <= buffer.byteLength) {
      // Enhanced Packet Block.
      const interfaceId = view.getUint32(at + 8, littleEndian);
      const high = view.getUint32(at + 12, littleEndian);
      const low = view.getUint32(at + 16, littleEndian);
      const captured = view.getUint32(at + 20, littleEndian);
      const original = view.getUint32(at + 24, littleEndian);
      const source = interfaces[interfaceId] ?? interfaces[0];

      if (source && at + 28 + captured <= buffer.byteLength) {
        const ticks = high * 4294967296 + low;
        packets.push(
          buildPacket(
            packets.length + 1,
            (ticks / source.resolution) * 1000,
            bytes.subarray(at + 28, at + 28 + captured),
            original,
            source.linkType,
          ),
        );
      }
    } else if (type === 0x00000003 && at + 12 <= buffer.byteLength) {
      // Simple Packet Block: no timestamp, and length comes from the block.
      const original = view.getUint32(at + 8, littleEndian);
      const source = interfaces[0];
      const captured = Math.min(original, length - 16);

      if (source && captured > 0) {
        packets.push(
          buildPacket(
            packets.length + 1,
            0,
            bytes.subarray(at + 12, at + 12 + captured),
            original,
            source.linkType,
          ),
        );
      }
    }

    at += length;

    if (packets.length >= MAX_PACKETS) {
      warnings.push(`Stopped after ${MAX_PACKETS} packets.`);
      break;
    }
  }

  numberStreams(packets);

  const linkType = interfaces[0]?.linkType ?? -1;
  return {
    format: "pcapng",
    linkType,
    linkTypeName: linkTypeName(linkType),
    packets,
    warnings,
  };
}

/** Sniffs the file magic and parses accordingly. Throws if it is neither. */
export function parseCapture(buffer: ArrayBuffer): Capture {
  if (buffer.byteLength < 24) throw new Error("That file is too small to be a capture.");

  switch (new DataView(buffer).getUint32(0, false)) {
    case 0x0a0d0d0a:
      return parsePcapng(buffer);
    case 0xa1b2c3d4:
      return parsePcap(buffer, false, false);
    case 0xa1b23c4d:
      return parsePcap(buffer, false, true);
    case 0xd4c3b2a1:
      return parsePcap(buffer, true, false);
    case 0x4d3cb2a1:
      return parsePcap(buffer, true, true);
    default:
      throw new Error("Not a pcap or pcapng file — the magic number didn't match.");
  }
}

/** Numbers conversations the way Wireshark's tcp.stream does. */
function numberStreams(packets: Packet[]) {
  const indexes = new Map<string, number>();

  for (const packet of packets) {
    if (!packet.stream) continue;

    let index = indexes.get(packet.stream);
    if (index === undefined) {
      index = indexes.size;
      indexes.set(packet.stream, index);
    }
    packet.streamIndex = index;
  }
}

/** Every payload byte of one conversation, in capture order, per direction. */
export interface StreamChunk {
  from: string;
  to: string;
  /** True for the side that opened the conversation. */
  fromClient: boolean;
  text: string;
}

export function followStream(packets: Packet[], selected: Packet): StreamChunk[] {
  if (!selected.stream) return [];

  const conversation = packets.filter((packet) => packet.stream === selected.stream);
  const opener = conversation[0];
  if (!opener) return [];

  // Attribution is anchored to whoever sent the conversation's first packet —
  // not to the packet that happens to be selected — so the client stays the
  // client whichever row the player clicked.
  const client = endpoint(opener.src, opener.srcPort);

  return conversation
    .filter((packet) => packet.payload.length > 0)
    .map((packet) => ({
      from: endpoint(packet.src, packet.srcPort),
      to: endpoint(packet.dst, packet.dstPort),
      fromClient: endpoint(packet.src, packet.srcPort) === client,
      text: textOf(packet.payload),
    }));
}
