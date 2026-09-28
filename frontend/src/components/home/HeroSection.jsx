
import { Link } from "react-router-dom"

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-slate-50">
      {/* Background decoration */}
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-emerald-100/60 blur-3xl" />

      <div className="absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-emerald-50 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
        <div className="grid items-center gap-14 lg:grid-cols-2">

          {/* Left Content */}
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />

              <span className="text-sm font-medium text-slate-700">
                Your career. Your opportunities.
              </span>
            </div>

            <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Find the right
              <span className="text-emerald-600"> opportunity </span>
              to grow your career.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              CareerSync connects students, professionals, and recruiters
              through one intelligent platform for discovering jobs,
              showcasing skills, and building meaningful careers.
            </p>

            {/* Search */}
            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg shadow-slate-200/50">
              <div className="flex flex-col gap-2 md:flex-row">

                <div className="flex flex-1 items-center gap-3 rounded-xl px-4 py-3">
                  <svg
                    className="h-5 w-5 shrink-0 text-slate-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path
                      strokeLinecap="round"
                      d="m20 20-4-4"
                    />
                  </svg>

                  <input
                    type="text"
                    placeholder="Search jobs, skills, or keywords"
                    className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>

                <div className="hidden h-10 w-px self-center bg-slate-200 md:block" />

                <div className="flex flex-1 items-center gap-3 rounded-xl px-4 py-3">
                  <svg
                    className="h-5 w-5 shrink-0 text-slate-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"
                    />

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8v4l2.5 1.5"
                    />
                  </svg>

                  <input
                    type="text"
                    placeholder="Location or remote"
                    className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>

                <button
                  type="button"
                  className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                >
                  Search
                </button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/jobs"
                className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Explore Jobs
              </Link>

              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
              >
                Create Your Profile
              </Link>
            </div>
          </div>

          {/* Right Content */}
          <div className="relative hidden lg:block">

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Recommended opportunity
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-slate-900">
                    Full Stack Developer
                  </h2>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-xl">
                  💻
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {["React", "Django", "PostgreSQL"].map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">
                    Experience
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    0–2 years
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">
                    Job Type
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    Full-time
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">
                    Location
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    Remote
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                <div>
                  <p className="text-xs text-slate-500">
                    Salary
                  </p>

                  <p className="text-lg font-bold text-slate-900">
                    ₹6L – ₹10L
                  </p>
                </div>

                <button
                  type="button"
                  className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  View Job
                </button>
              </div>
            </div>

            {/* Floating profile card */}
            <div className="absolute -bottom-8 -left-10 w-64 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">
                  AK
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Aditi Kulkarni
                  </p>

                  <p className="text-xs text-slate-500">
                    Frontend Developer
                  </p>
                </div>

                <span className="ml-auto h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </div>

              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  ⭐ 4.9
                </span>

                <span className="font-semibold text-slate-700">
                  ₹850/hr
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Platform stats */}
        <div className="mt-16 grid grid-cols-2 gap-6 border-t border-slate-200 pt-8 sm:grid-cols-4">
          <div>
            <p className="text-2xl font-bold text-slate-900">
              10K+
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Job Opportunities
            </p>
          </div>

          <div>
            <p className="text-2xl font-bold text-slate-900">
              5K+
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Skilled Professionals
            </p>
          </div>

          <div>
            <p className="text-2xl font-bold text-slate-900">
              2K+
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Recruiters
            </p>
          </div>

          <div>
            <p className="text-2xl font-bold text-slate-900">
              95%
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Profile Match Rate
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection

