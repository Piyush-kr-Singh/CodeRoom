"use client";

import { useState } from "react";
import { siteConfig } from "@/lib/site";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) return;

    setStatus("submitting");
    setErrorMsg("");

    try {
      const response = await fetch(`${siteConfig.apiUrl}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, subject, message })
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Failed to send message. Please try again.");
      }

      setStatus("success");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message || "An unexpected error occurred.");
    }
  };

  if (status === "success") {
    return (
      <div className="glass-panel rounded-[1.5rem] p-8 text-center sm:p-12">
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[color:var(--accent)]/10 text-[color:var(--accent)]">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>
        <h3 className="section-title text-2xl">Message sent!</h3>
        <p className="body-copy mt-3">
          Thank you for reaching out. We have received your message and will get back to you as soon as possible.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="button-secondary mt-8"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-[1.5rem] p-6 sm:p-8">
      <h2 className="section-title text-2xl mb-6">Send us a message</h2>
      <form onSubmit={handleSubmit} className="grid gap-5">
        <div className="grid gap-2">
          <label htmlFor="name" className="text-sm font-medium text-[color:var(--foreground)]">
            Name
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            disabled={status === "submitting"}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-[color:var(--accent)] disabled:opacity-50"
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="email" className="text-sm font-medium text-[color:var(--foreground)]">
            Email address
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            disabled={status === "submitting"}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-[color:var(--accent)] disabled:opacity-50"
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="subject" className="text-sm font-medium text-[color:var(--foreground)]">
            Subject
          </label>
          <input
            id="subject"
            type="text"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="How can we help?"
            disabled={status === "submitting"}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-[color:var(--accent)] disabled:opacity-50"
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="message" className="text-sm font-medium text-[color:var(--foreground)]">
            Message
          </label>
          <textarea
            id="message"
            required
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            disabled={status === "submitting"}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-[color:var(--accent)] disabled:opacity-50 resize-none"
          />
        </div>

        {errorMsg ? (
          <p className="text-sm text-[color:var(--coral)]">{errorMsg}</p>
        ) : null}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="button-primary mt-2 justify-center"
        >
          {status === "submitting" ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}
