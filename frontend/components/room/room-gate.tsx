"use client";

import {
  DEFAULT_EXPIRY_HOURS,
  EXPIRY_PRESETS_HOURS,
  SUPPORTED_LANGUAGES,
  isReservedRoomSlug,
  type SupportedLanguage
} from "@codeshare/shared";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

type RoomGateProps = {
  mode: "create" | "password" | null;
  slug: string;
  busy: boolean;
  error: string;
  defaultLanguage: SupportedLanguage;
  onCreate: (input: {
    visibility: "public" | "private";
    password?: string;
    expiryHours: number;
    language: SupportedLanguage;
  }) => Promise<void>;
  onPasswordAccess: (password: string) => Promise<void>;
};

function getLanguageLabel(language: SupportedLanguage) {
  return language === "plaintext" ? "Plain text" : language;
}

export function RoomGate({ mode, slug, busy, error, defaultLanguage, onCreate, onPasswordAccess }: RoomGateProps) {
  const isLauncherSlug = isReservedRoomSlug(slug);
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [expiryPreset, setExpiryPreset] = useState<string>(String(DEFAULT_EXPIRY_HOURS));
  const [customHours, setCustomHours] = useState("24");
  const [language, setLanguage] = useState<SupportedLanguage>(defaultLanguage);
  const [localError, setLocalError] = useState("");
  const [accessPassword, setAccessPassword] = useState("");

  async function handleCreateSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLocalError("");

    if (visibility === "private") {
      if (password.length < 8) {
        setLocalError("Use at least 8 characters for private room passwords.");
        return;
      }

      if (password !== confirmPassword) {
        setLocalError("Password confirmation does not match.");
        return;
      }
    }

    const expiryHours = expiryPreset === "custom" ? Number(customHours) : Number(expiryPreset);

    await onCreate({
      visibility,
      password: visibility === "private" ? password : undefined,
      expiryHours,
      language
    });
  }

  async function handlePasswordSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLocalError("");

    if (!accessPassword.trim()) {
      setLocalError("Enter the room password to continue.");
      return;
    }

    await onPasswordAccess(accessPassword);
  }

  const combinedError = localError || error;

  return (
    <AnimatePresence>
      {mode ? (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-[rgba(2,7,12,0.72)] p-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="glass-panel w-full max-w-xl rounded-[2rem] p-6 shadow-panel sm:p-8"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24 }}
          >
            {mode === "create" ? (
              <>
                <p className="font-mono text-xs uppercase tracking-[0.28em] text-[color:var(--accent)]">
                  Create room
                </p>
                <h2 className="mt-3 text-2xl font-semibold">
                  {isLauncherSlug ? "Configure a new room" : `Configure \`${slug}\``}
                </h2>
                <p className="body-copy mt-3">
                  {isLauncherSlug
                    ? "Choose privacy, expiry, and language first. We will generate a fresh shareable room URL when you continue."
                    : "This room does not exist yet. Choose privacy, expiry, and language before entering the editor."}
                </p>
                {isLauncherSlug ? (
                  <p className="body-copy mt-2 text-sm">
                    Want a custom private URL instead? Replace `/room/new` in the address bar with your own room name before creating it.
                  </p>
                ) : null}
                <form className="mt-6 grid gap-5" onSubmit={handleCreateSubmit}>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setVisibility("public")}
                      className={`rounded-2xl border p-4 text-left ${visibility === "public" ? "border-[color:var(--accent)] bg-white/10" : "border-white/10 bg-white/5"}`}
                    >
                      <span className="block text-sm font-semibold">Public</span>
                      <span className="mt-1 block text-sm text-[color:var(--muted)]">Anyone with the URL can join.</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setVisibility("private")}
                      className={`rounded-2xl border p-4 text-left ${visibility === "private" ? "border-[color:var(--accent)] bg-white/10" : "border-white/10 bg-white/5"}`}
                    >
                      <span className="block text-sm font-semibold">Private</span>
                      <span className="mt-1 block text-sm text-[color:var(--muted)]">Require a password before entry.</span>
                    </button>
                  </div>
                  <label className="grid gap-2 text-sm">
                    <span>Room expiry</span>
                    <select
                      value={expiryPreset}
                      onChange={(event) => setExpiryPreset(event.target.value)}
                      className="form-select rounded-2xl border px-4 py-3 outline-none"
                    >
                      {EXPIRY_PRESETS_HOURS.map((hours) => (
                        <option key={hours} value={hours}>
                          {hours} hour{hours === 1 ? "" : "s"}
                        </option>
                      ))}
                      <option value="custom">Custom</option>
                    </select>
                  </label>
                  {expiryPreset === "custom" ? (
                    <label className="grid gap-2 text-sm">
                      <span>Custom hours</span>
                      <input
                        type="number"
                        min={1}
                        max={168}
                        value={customHours}
                        onChange={(event) => setCustomHours(event.target.value)}
                        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
                      />
                    </label>
                  ) : null}
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
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="grid gap-2 text-sm">
                        <span>Password</span>
                        <input
                          type="password"
                          value={password}
                          onChange={(event) => setPassword(event.target.value)}
                          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
                        />
                      </label>
                      <label className="grid gap-2 text-sm">
                        <span>Confirm password</span>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(event) => setConfirmPassword(event.target.value)}
                          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
                        />
                      </label>
                    </div>
                  ) : null}
                  {combinedError ? <p className="text-sm text-[#ff9b71]">{combinedError}</p> : null}
                  <button type="submit" className="button-primary" disabled={busy}>
                    {busy ? "Creating room..." : "Enter editor"}
                  </button>
                </form>
              </>
            ) : (
              <>
                <p className="font-mono text-xs uppercase tracking-[0.28em] text-[color:var(--accent)]">
                  Private room
                </p>
                <h2 className="mt-3 text-2xl font-semibold">Password required for `{slug}`</h2>
                <p className="body-copy mt-3">
                  This room is protected. Enter the password to unlock the live editor.
                </p>
                <form className="mt-6 grid gap-5" onSubmit={handlePasswordSubmit}>
                  <label className="grid gap-2 text-sm">
                    <span>Password</span>
                    <input
                      type="password"
                      value={accessPassword}
                      onChange={(event) => setAccessPassword(event.target.value)}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
                    />
                  </label>
                  {combinedError ? <p className="text-sm text-[#ff9b71]">{combinedError}</p> : null}
                  <button type="submit" className="button-primary" disabled={busy}>
                    {busy ? "Unlocking..." : "Enter private room"}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
