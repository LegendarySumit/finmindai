import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-linear-to-br from-slate-900 to-slate-800 px-4">
      <div className="space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-white">404</h1>
          <p className="text-xl text-slate-400">Page not found</p>
        </div>

        <p className="max-w-md text-slate-300">
          The page you&apos;re looking for doesn&apos;t exist. It might have been moved or deleted.
        </p>

        <Link
          href="/"
          className="inline-block rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white transition hover:bg-blue-700"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
