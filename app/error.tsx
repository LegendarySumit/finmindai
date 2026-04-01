"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to external service
    console.error("Application error:", error);

    // TODO: Send to error tracking service (Sentry, etc.)
    // captureException(error);
  }, [error]);

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-4">
      <div className="max-w-2xl space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-5xl font-bold text-white">Oops!</h1>
          <p className="text-xl text-slate-400">Something went wrong</p>
        </div>

        <div className="rounded-lg bg-slate-800/50 p-4">
          <p className="text-sm font-mono text-slate-300">{error.message}</p>
          {error.digest && (
            <p className="mt-2 text-xs text-slate-500">Error ID: {error.digest}</p>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => reset()}
            className="rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white transition hover:bg-blue-700"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-lg border border-slate-600 px-6 py-2.5 font-medium text-slate-300 transition hover:border-slate-500 hover:text-white"
          >
            Go home
          </Link>
        </div>

        <p className="text-xs text-slate-500">
          If this problem persists, please contact support at{" "}
          <a href="mailto:support@finmindai.com" className="text-blue-400 hover:underline">
            support@finmindai.com
          </a>
        </p>
      </div>
    </div>
  );
}
