function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
        <div>
          <div className="mb-6 inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
            Built for students &amp; recruiters
          </div>

          <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Connect your
            <span className="text-blue-600"> skills </span>
            with the right
            <span className="text-blue-600"> career.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            CareerSync brings students, recruiters, jobs, applications,
            resumes, and career insights together in one simple platform.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <button className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-blue-700">
              Explore Opportunities
            </button>

            <button className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50">
              Learn More
            </button>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 text-sm text-slate-500">
            <div>
              <span className="font-bold text-slate-900">500+</span> Jobs
            </div>

            <div>
              <span className="font-bold text-slate-900">1,000+</span> Students
            </div>

            <div>
              <span className="font-bold text-slate-900">100+</span> Recruiters
            </div>
          </div>
        </div>

        <div className="lg:pl-8">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-xl">
            <div className="rounded-xl bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <p className="text-sm text-slate-500">Career Dashboard</p>

                  <h2 className="mt-1 text-xl font-bold text-slate-900">
                    Welcome back 👋
                  </h2>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">
                  CS
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-blue-50 p-4">
                  <p className="text-sm text-slate-500">Applications</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    12
                  </p>
                </div>

                <div className="rounded-xl bg-emerald-50 p-4">
                  <p className="text-sm text-slate-500">Interviews</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    4
                  </p>
                </div>

                <div className="rounded-xl bg-amber-50 p-4">
                  <p className="text-sm text-slate-500">Profile Score</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    86%
                  </p>
                </div>

                <div className="rounded-xl bg-purple-50 p-4">
                  <p className="text-sm text-slate-500">Job Matches</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    28
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Profile Progress
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Complete your profile to improve job matches.
                    </p>
                  </div>

                  <span className="text-sm font-bold text-blue-600">
                    86%
                  </span>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full w-[86%] rounded-full bg-blue-600"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero