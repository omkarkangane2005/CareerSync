
const categories = [
  {
    title: "Development & IT",
    description:
      "Software development, web, mobile, cloud, and IT opportunities.",
    jobs: "1,240 jobs",
    icon: "💻",
  },
  {
    title: "Design & Creative",
    description:
      "UI/UX, graphic design, product design, branding, and creative work.",
    jobs: "860 jobs",
    icon: "🎨",
  },
  {
    title: "Data & AI",
    description:
      "Data science, analytics, machine learning, AI, and automation roles.",
    jobs: "730 jobs",
    icon: "🤖",
  },
  {
    title: "Marketing",
    description:
      "Digital marketing, SEO, content, growth, and social media roles.",
    jobs: "640 jobs",
    icon: "📈",
  },
  {
    title: "Engineering",
    description:
      "Core engineering, electronics, embedded systems, and technical roles.",
    jobs: "510 jobs",
    icon: "⚙️",
  },
  {
    title: "Business & Finance",
    description:
      "Business analysis, finance, consulting, operations, and management.",
    jobs: "430 jobs",
    icon: "💼",
  },
  {
    title: "Sales & Customer Success",
    description:
      "Sales, business development, support, and customer success roles.",
    jobs: "390 jobs",
    icon: "🤝",
  },
  {
    title: "Writing & Content",
    description:
      "Technical writing, content creation, editing, and communication roles.",
    jobs: "320 jobs",
    icon: "✍️",
  },
];

function CategoriesSection() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">
              Explore Opportunities
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Browse popular categories
            </h2>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Discover opportunities based on the skills and career paths that
              match your interests.
            </p>
          </div>

          <button
            type="button"
            className="self-start text-sm font-semibold text-emerald-600 transition hover:text-emerald-700 sm:self-auto"
          >
            View all categories →
          </button>
        </div>

        {/* Category Cards */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <article
              key={category.title}
              className="group rounded-2xl border border-slate-200 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg hover:shadow-slate-200/50"
            >
              {/* Icon */}
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-2xl transition group-hover:bg-emerald-100">
                {category.icon}
              </div>

              {/* Title */}
              <h3 className="mt-5 text-lg font-semibold text-slate-900">
                {category.title}
              </h3>

              {/* Description */}
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {category.description}
              </p>

              {/* Jobs */}
              <div className="mt-5 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">
                  {category.jobs}
                </span>

                <span className="text-lg text-slate-400 transition group-hover:translate-x-1 group-hover:text-emerald-600">
                  →
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategoriesSection;