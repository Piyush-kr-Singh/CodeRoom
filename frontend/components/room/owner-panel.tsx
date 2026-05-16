"use client";

import { SUPPORTED_LANGUAGES, type RoomSnapshot, type SupportedLanguage } from "@codeshare/shared";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { estimateHoursRemaining } from "@/lib/format";

type OwnerPanelProps = {
  open: boolean;
  room: RoomSnapshot;
  busy: boolean;
  onClose: () => void;
  onSave: (input: {
    visibility: "public" | "private";
    password?: string;
    expiryHours: number;
    language: SupportedLanguage;
  }) => Promise<void>;
  onDelete: () => Promise<void>;
};

function getLanguageLabel(language: SupportedLanguage) {
  return language === "plaintext" ? "Plain text" : language;
}

export function OwnerPanel({ open, room, busy, onClose, onSave, onDelete }: OwnerPanelProps) {
  const [visibility, setVisibility] = useState<"public" | "private">(room.visibility);
  const [password, setPassword] = useState("");
  const [expiryHours, setExpiryHours] = useState(String(estimateHoursRemaining(room.expiresAt)));
  const [language, setLanguage] = useState<SupportedLanguage>(room.language);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (visibility === "private" && password.length < 8) {
      setError("Use at least 8 characters when saving a private room.");
      return;
    }

    await onSave({
      visibility,
      password: visibility === "private" ? password : undefined,
      expiryHours: Number(expiryHours),
      language
    });
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[65] flex justify-end bg-[rgba(2,7,12,0.6)] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="glass-panel h-full w-full max-w-md p-6 shadow-panel"
            initial={{ x: 32 }}
            animate={{ x: 0 }}
            exit={{ x: 32 }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.28em] text-[color:var(--accent)]">Owner panel</p>
                <h2 className="mt-3 text-2xl font-semibold">Manage `{room.slug}`</h2>
              </div>
              <button type="button" onClick={onClose} className="button-secondary px-4 py-2">
                Close
              </button>
            </div>
            <form className="mt-8 grid gap-5" onSubmit={handleSubmit}>
              <label className="grid gap-2 text-sm">
                <span>Visibility</span>
                <select
                  value={visibility}
                  onChange={(event) => setVisibility(event.target.value as "public" | "private")}
                  className="form-select rounded-2xl border px-4 py-3 outline-none"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </label>
              <label className="grid gap-2 text-sm">
                <span>Expiry hours from now</span>
                <input
                  type="number"
                  min={1}
                  max={168}
                  value={expiryHours}
                  onChange={(event) => setExpiryHours(event.target.value)}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
                />
              </label>
              <label className="grid gap-2 text-sm">
                <span>Language</span>
                <select
                  value={language}
                  onChange={(event) => setLanguage(event.target.value as SupportedLanguage)}
                  className="form-select rounded-2xl border px-4 py-3 outline-none"
                >
                  {SUPPORTED_LANGUAGES.map((item) => (
                    <option key={item} value={item}>
                      {getLanguageLabel(item)}
                    </option>
                  ))}
                </select>
              </label>
              {visibility === "private" ? (
                <label className="grid gap-2 text-sm">
                  <span>Set new password</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
                  />
                </label>
              ) : null}
              {error ? <p className="text-sm text-[#ff9b71]">{error}</p> : null}
              <button type="submit" className="button-primary" disabled={busy}>
                {busy ? "Saving..." : "Save room settings"}
              </button>
            </form>
            <div className="mt-8 rounded-[1.5rem] border border-[#ff9b71]/40 bg-[#ff9b71]/10 p-5">
              <h3 className="text-lg font-semibold">Delete room</h3>
              <p className="mt-2 text-sm text-[color:var(--muted)]">
                This removes the room and its stored code immediately.
              </p>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Delete this room permanently?")) {
                    void onDelete();
                  }
                }}
                className="mt-4 rounded-full border border-[#ff9b71]/50 px-5 py-3 text-sm font-medium text-[#ff9b71]"
              >
                Delete room
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
