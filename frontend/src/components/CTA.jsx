function CTA() {
  return (
    <>
      <section id="about" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="rounded-3xl bg-slate-900 px-6 py-12 text-center sm:px-12 lg:px-20">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">
              Your career, organized
            </p>

            <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Stop managing your career across multiple platforms.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-300">
              Build your profile, discover relevant opportunities, manage
              applications, and stay prepared for your next career move.
            </p>

            <button className="mt-8 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700">
              Create Your Profile
            </button>
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="border-t border-slate-200 bg-slate-50 py-16"
      >
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Ready to build your career?
          </h2>

          <p className="mt-4 text-slate-600">
            Join CareerSync and take control of your placement journey.
          </p>

          <button className="mt-7 rounded-lg bg-blue-600 px-7 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700">
            Get Started Today
          </button>
        </div>
      </section>
    </>
  )
}

export default CTA
