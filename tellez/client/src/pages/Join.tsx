import { api } from "@/lib/api";
import { Icon } from "@/lib/icon";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

export function Join() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    try {
      await api.join(name);
      navigate("/", { replace: true });
    } catch {
      setError("That name did not take. Try another.");
      setBusy(false);
    }
  }

  return (
    <div className="wallpaper flex h-full items-center justify-center p-6">
      <form onSubmit={submit} className="pane w-full max-w-md p-7">
        <p className="text-[11px] uppercase tracking-[0.2em] text-husky-faint">
          NUSEC · Digital forensics exercise
        </p>
        <h1 className="mt-1 text-[22px] font-semibold tracking-tight">The Tellez Incident</h1>

        <p className="mt-4 text-[13px] leading-relaxed text-husky-dim">
          Two point four million dollars left the club's accounts over two
          years. This is the laptop of the person who signed every one of those
          payments off.
        </p>
        <p className="mt-2.5 text-[13px] leading-relaxed text-husky-dim">
          Investigate what is on the device. Follow the money, find out who
          ended up with it, and work out where they went.
        </p>

        <label htmlFor="name" className="mt-6 block text-[11px] font-medium text-husky-dim">
          Your name, so we can see how far you get
        </label>
        <input
          id="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Name"
          autoComplete="off"
          autoFocus
          maxLength={40}
          className="field mt-1.5"
        />

        <button type="submit" disabled={busy || name.trim().length < 2} className="btn btn-primary mt-4 w-full">
          {busy ? "Starting…" : "Start the investigation"}
        </button>

        {error && <p className="mt-3 text-[12px] text-husky-bad">{error}</p>}

        <p className="mt-6 flex items-start gap-2 border-t border-husky-edge pt-4 text-[11px] leading-relaxed text-husky-faint">
          <Icon name="Info" size={13} className="mt-px shrink-0" />
          <span>
            A work of fiction. Alec Tellez is a real former NUSEC president who
            agreed to play the villain; everything the machine says he did is
            invented for this exercise.
          </span>
        </p>
      </form>
    </div>
  );
}
