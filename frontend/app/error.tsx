"use client";

export default function ErrorPage({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="container-shell flex justify-center">
        <div className="glass-panel w-full max-w-lg rounded-2xl p-8 text-center sm:p-12">
          {/* Warning Icon */}
          <div className="mb-6 flex justify-center">
            <svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M29.072 8.464a3.36 3.36 0 0 1 5.856 0l22.4 39.2A3.36 3.36 0 0 1 54.4 52.8H9.6a3.36 3.36 0 0 1-2.928-5.136l22.4-39.2Z"
                stroke="var(--coral)"
                strokeWidth="2.5"
                fill="none"
              />
              <line
                x1="32"
                y1="24"
                x2="32"
                y2="36"
                stroke="var(--coral)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="32" cy="43" r="1.75" fill="var(--coral)" />
            </svg>
          </div>

          {/* Title */}
          <h1 className="section-title mb-3">Something went wrong</h1>

          {/* Error Message */}
          <p className="body-copy mb-8">{error.message}</p>

          {/* Actions */}
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <button onClick={reset} className="button-primary">
              Try again
            </button>
            <a href="/" className="button-secondary">
              Go home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
