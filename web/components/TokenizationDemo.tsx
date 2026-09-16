"use client";

import { useMemo, useState } from "react";

// Simple deterministic string hash (djb2) — enough for an illustrative demo.
// This is NOT cryptographically secure and mirrors nothing about the real
// Datavant tokenization logic; it exists purely to show the shape of a
// "PHI in, token out" exchange without touching any real data or vendor.
function fakeToken(value: string, salt: string): string {
  let hash = 5381;
  const input = salt + ":" + value;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 33) ^ input.charCodeAt(i);
  }
  const hex = (hash >>> 0).toString(16).padStart(8, "0");
  return `TKN-${hex.toUpperCase()}`;
}

const FIELDS = [
  { key: "name", label: "Patient Name", placeholder: "Jane Doe" },
  { key: "ssn", label: "SSN (fake)", placeholder: "123-45-6789" },
  { key: "mrn", label: "MRN (fake)", placeholder: "MRN-00219384" },
] as const;

export default function TokenizationDemo() {
  const [values, setValues] = useState<Record<string, string>>({
    name: "",
    ssn: "",
    mrn: "",
  });

  const tokens = useMemo(
    () =>
      FIELDS.reduce<Record<string, string>>((acc, field) => {
        acc[field.key] = values[field.key] ? fakeToken(values[field.key], field.key) : "";
        return acc;
      }, {}),
    [values]
  );

  return (
    <div className="not-prose mt-10 rounded-sm border border-line bg-panel p-6">
      <h3 className="text-lg font-semibold text-paper">Try a synthetic tokenization</h3>
      <p className="mt-2 text-sm text-paper-dim">
        Type fake data below — nothing leaves your browser. This client-side hash only
        illustrates the shape of the real exchange (PHI in, opaque token out); it is not the
        actual Datavant tokenization logic, which runs inside a controlled internal boundary as
        described above.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {FIELDS.map((field) => (
          <div key={field.key}>
            <label className="mb-1.5 block font-mono text-xs text-paper-dim" htmlFor={field.key}>
              {field.label}
            </label>
            <input
              id={field.key}
              type="text"
              placeholder={field.placeholder}
              value={values[field.key]}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, [field.key]: e.target.value }))
              }
              className="w-full rounded-sm border border-line bg-ink px-3 py-2 text-sm text-paper outline-none focus:border-signal"
            />
          </div>
        ))}
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full border-collapse font-mono text-xs">
          <thead>
            <tr className="border-b border-line text-left text-paper-dim">
              <th className="pb-2 pr-4 font-normal">Field</th>
              <th className="pb-2 pr-4 font-normal">Raw (synthetic PHI)</th>
              <th className="pb-2 font-normal">Tokenized</th>
            </tr>
          </thead>
          <tbody>
            {FIELDS.map((field) => (
              <tr key={field.key} className="border-b border-line/60">
                <td className="py-2 pr-4 text-paper-dim">{field.label}</td>
                <td className="py-2 pr-4 text-paper">{values[field.key] || "—"}</td>
                <td className="py-2 text-signal">{tokens[field.key] || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
