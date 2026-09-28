import {
    Link,
} from "react-router-dom";

import {
    BriefcaseBusiness,
    Mail,
    Network,
} from "lucide-react";


function Footer() {
    const currentYear =
        new Date().getFullYear();

    const userRole =
        localStorage.getItem(
            "userRole"
        );


    return (
        <footer className="border-t border-indigo-900/30 bg-[#172554] text-indigo-100">

            {/* Main Footer */}

            <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">

                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">

                    {/* Brand */}

                    <div>

                        <Link
                            to="/"
                            className="inline-flex items-center gap-2.5"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-linear-to-br from-indigo-400 via-violet-400 to-teal-400 text-white shadow-lg">
                                <Network className="h-5 w-5" />
                            </div>

                            <span className="text-xl font-black tracking-tight text-white">
                                Career
                                <span className="text-violet-300">
                                    Sync
                                </span>
                            </span>
                        </Link>


                        <p className="mt-5 max-w-sm text-sm leading-7 text-indigo-100/65">
                            CareerSync connects
                            ambitious candidates with
                            meaningful opportunities
                            while helping recruiters
                            discover and hire the right
                            talent through one focused
                            recruitment platform.
                        </p>


                        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-indigo-300/15 bg-white/5 px-3 py-2 text-xs font-semibold text-indigo-100/70">

                            <BriefcaseBusiness className="h-4 w-4 text-teal-300" />

                            Built for modern hiring

                        </div>

                    </div>


                    {/* Explore */}

                    <div>

                        <h3 className="text-sm font-black uppercase tracking-[0.14em] text-white">
                            Explore
                        </h3>

                        <ul className="mt-5 space-y-3.5">

                            <li>
                                <Link
                                    to="/jobs"
                                    className="text-sm text-indigo-100/65 transition hover:text-white"
                                >
                                    Find Jobs
                                </Link>
                            </li>

                            <li>
                                <a
                                    href="/#featured-jobs"
                                    className="text-sm text-indigo-100/65 transition hover:text-white"
                                >
                                    Featured Jobs
                                </a>
                            </li>

                            <li>
                                <a
                                    href="/#companies"
                                    className="text-sm text-indigo-100/65 transition hover:text-white"
                                >
                                    Companies
                                </a>
                            </li>

                            <li>
                                <a
                                    href="/#how-it-works"
                                    className="text-sm text-indigo-100/65 transition hover:text-white"
                                >
                                    How It Works
                                </a>
                            </li>

                        </ul>

                    </div>


                    {/* Job seekers */}

                    <div>

                        <h3 className="text-sm font-black uppercase tracking-[0.14em] text-white">
                            Job Seekers
                        </h3>

                        <ul className="mt-5 space-y-3.5">

                            <li>
                                <Link
                                    to="/profile"
                                    className="text-sm text-indigo-100/65 transition hover:text-white"
                                >
                                    Build Profile
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/saved-jobs"
                                    className="text-sm text-indigo-100/65 transition hover:text-white"
                                >
                                    Saved Jobs
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/dashboard"
                                    className="text-sm text-indigo-100/65 transition hover:text-white"
                                >
                                    Candidate Dashboard
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/jobs"
                                    className="text-sm text-indigo-100/65 transition hover:text-white"
                                >
                                    Browse Opportunities
                                </Link>
                            </li>

                        </ul>

                    </div>


                    {/* Recruiters */}

                    <div>

                        <h3 className="text-sm font-black uppercase tracking-[0.14em] text-white">
                            Recruiters
                        </h3>

                        <ul className="mt-5 space-y-3.5">

                            <li>
                                <Link
                                    to={
                                        userRole ===
                                        "recruiter"
                                            ? "/recruiter/talent"
                                            : "/register"
                                    }
                                    className="text-sm text-indigo-100/65 transition hover:text-white"
                                >
                                    Find Talent
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to={
                                        userRole ===
                                        "recruiter"
                                            ? "/recruiter/jobs/new"
                                            : "/register"
                                    }
                                    className="text-sm text-indigo-100/65 transition hover:text-white"
                                >
                                    Post a Job
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to={
                                        userRole ===
                                        "recruiter"
                                            ? "/recruiter/dashboard"
                                            : "/login"
                                    }
                                    className="text-sm text-indigo-100/65 transition hover:text-white"
                                >
                                    Recruiter Dashboard
                                </Link>
                            </li>

                        </ul>

                    </div>


                    {/* CareerSync */}

                    <div>

                        <h3 className="text-sm font-black uppercase tracking-[0.14em] text-white">
                            CareerSync
                        </h3>

                        <ul className="mt-5 space-y-3.5">

                            <li>
                                <a
                                    href="/#about"
                                    className="text-sm text-indigo-100/65 transition hover:text-white"
                                >
                                    About CareerSync
                                </a>
                            </li>

                            <li>
                                <a
                                    href="/#how-it-works"
                                    className="text-sm text-indigo-100/65 transition hover:text-white"
                                >
                                    Platform Features
                                </a>
                            </li>

                            <li>
                                <a
                                    href="mailto:support@careersync.com"
                                    className="inline-flex items-center gap-2 text-sm text-indigo-100/65 transition hover:text-white"
                                >
                                    <Mail className="h-3.5 w-3.5" />

                                    Contact
                                </a>
                            </li>

                        </ul>

                    </div>

                </div>

            </div>


            {/* Bottom */}

            <div className="border-t border-white/10 bg-[#132049]">

                <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-xs text-indigo-100/50 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">

                    <p>
                        © {currentYear} CareerSync.
                        All rights reserved.
                    </p>


                    <div className="flex flex-wrap gap-x-5 gap-y-2">

                        <span>
                            Recruitment Platform
                        </span>

                        <span>
                            React + Django
                        </span>

                        <span>
                            PostgreSQL
                        </span>

                    </div>

                </div>

            </div>

        </footer>
    );
}


export default Footer;