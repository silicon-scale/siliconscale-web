import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    }
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050505] px-6 text-white">
      <div className="text-center">
        <p className="mb-3 inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/55">
          Not Found
        </p>
        <h1 className="mb-3 text-5xl font-black tracking-tight">404</h1>
        <p className="mb-7 text-base text-white/55">
          Oops! This page doesn&apos;t exist.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-full border border-white/10 bg-gradient-to-r from-[#c9a96e] via-[#fff1d6] to-[#c9a96e] px-6 py-3 text-sm font-extrabold uppercase tracking-[0.18em] text-black transition-transform duration-200 hover:-translate-y-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
