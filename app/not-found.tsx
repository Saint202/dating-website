import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[85vh] flex-col items-center justify-center px-4 text-center">
      <div className="stack-card px-10 py-12">
        <span className="text-5xl">💔</span>
        <h1 className="mt-4 text-3xl font-semibold text-foreground">
          Page not found
        </h1>
        <p className="mt-2 text-muted">
          Looks like this page swiped left on existing.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-coral px-6 py-2.5 font-semibold text-white shadow-md shadow-coral/25 transition hover:bg-coral-dark"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}