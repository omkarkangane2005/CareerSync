import { useState } from "react";

import {
    Link,
    useNavigate,
} from "react-router-dom";

import {
    ArrowRight,
    BadgeCheck,
    BriefcaseBusiness,
    Building2,
    CheckCircle2,
    FileSearch,
    MapPin,
    Search,
    Send,
    Users,
    UserSearch,
} from "lucide-react";

import FeaturedJobsSection
    from "../components/home/FeaturedJobsSection";


/* =========================================================
   POPULAR EMPLOYERS
   ========================================================= */

const popularCompanies = [
    {
        id: "google",
        name: "Google",
        domain: "google.com",
    },
    {
        id: "microsoft",
        name: "Microsoft",
        domain: "microsoft.com",
    },
    {
        id: "amazon",
        name: "Amazon",
        domain: "amazon.com",
    },
    {
        id: "aws",
        name: "AWS",
        domain: "aws.amazon.com",
    },
    {
        id: "meta",
        name: "Meta",
        domain: "meta.com",
    },
    {
        id: "deloitte",
        name: "Deloitte",
        domain: "deloitte.com",
    },
    {
        id: "jio",
        name: "Jio",
        domain: "jio.com",
    },
    {
        id: "kotak",
        name: "Kotak Bank",
        domain: "kotak.com",
    },
    {
        id: "phonepe",
        name: "PhonePe",
        domain: "phonepe.com",
    },
    {
        id: "google-pay",
        name: "Google Pay",
        domain: "pay.google.com",
    },
    {
        id: "infosys",
        name: "Infosys",
        domain: "infosys.com",
    },
    {
        id: "tcs",
        name: "TCS",
        domain: "tcs.com",
    },
    {
        id: "wipro",
        name: "Wipro",
        domain: "wipro.com",
    },
    {
        id: "accenture",
        name: "Accenture",
        domain: "accenture.com",
    },
    {
        id: "ibm",
        name: "IBM",
        domain: "ibm.com",
    },
];


function getCompanyLogo(
    domain
) {
    return (
        "https://www.google.com/s2/favicons" +
        `?domain=${encodeURIComponent(domain)}` +
        "&sz=128"
    );
}


/* =========================================================
   COMPANY CARD
   ========================================================= */

function CompanyCard({
    company,
}) {
    const [
        imageFailed,
        setImageFailed,
    ] = useState(false);


    return (
        <div
            className="
                group
                flex
                h-[92px]
                w-[210px]
                shrink-0
                items-center
                justify-center
                gap-4
                rounded-[20px]
                border
                border-white
                bg-white
                px-5
                shadow-[0_10px_30px_rgba(88,70,20,0.09)]
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-[0_18px_38px_rgba(88,70,20,0.15)]
                sm:w-[230px]
            "
        >

            {!imageFailed ? (
                <div
                    className="
                        flex
                        h-12
                        w-12
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-slate-100
                        bg-white
                        p-1
                        shadow-sm
                    "
                >

                    <img
                        src={getCompanyLogo(
                            company.domain
                        )}
                        alt={`${company.name} logo`}
                        loading="lazy"
                        onError={() =>
                            setImageFailed(
                                true
                            )
                        }
                        className="
                            h-full
                            w-full
                            object-contain
                        "
                    />

                </div>
            ) : (
                <div
                    className="
                        flex
                        h-12
                        w-12
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-gradient-to-br
                        from-indigo-50
                        via-violet-50
                        to-teal-50
                        text-indigo-600
                    "
                >
                    <Building2
                        className="h-5 w-5"
                    />
                </div>
            )}


            <span
                className="
                    min-w-0
                    text-[15px]
                    font-extrabold
                    leading-5
                    tracking-[-0.01em]
                    text-slate-700
                    transition
                    group-hover:text-indigo-700
                "
            >
                {company.name}
            </span>

        </div>
    );
}



function Home() {
    const navigate =
        useNavigate();

    const [
        searchTerm,
        setSearchTerm,
    ] = useState("");

    const [
        experience,
        setExperience,
    ] = useState("");

    const [
        location,
        setLocation,
    ] = useState("");


    const marqueeCompanies = [
        ...popularCompanies,
        ...popularCompanies,
    ];


    /* =====================================================
       SEARCH
       ===================================================== */

    const handleSearch = (
        event
    ) => {
        event.preventDefault();

        const params =
            new URLSearchParams();

        if (
            searchTerm.trim()
        ) {
            params.set(
                "search",
                searchTerm.trim()
            );
        }

        if (experience) {
            params.set(
                "experience",
                experience
            );
        }

        if (
            location.trim()
        ) {
            params.set(
                "location",
                location.trim()
            );
        }

        const query =
            params.toString();

        navigate(
            query
                ? `/jobs?${query}`
                : "/jobs"
        );
    };


    const accessToken =
        localStorage.getItem(
            "accessToken"
        );

    const userRole =
        localStorage.getItem(
            "userRole"
        );


    const profileDestination =
        !accessToken
            ? "/register"
            : userRole ===
              "recruiter"
            ? "/recruiter/dashboard"
            : "/profile";


    return (
        <div className="careersync-page">

            {/* =================================================
                HERO
            ================================================= */}

            <section
                className="
                    relative
                    overflow-hidden
                    border-b
                    border-slate-200/70
                    bg-gradient-to-b
                    from-[#fffefb]
                    via-[#fffdf4]
                    to-white
                "
            >

                <div
                    className="hero-orb hero-orb-one"
                />

                <div
                    className="hero-orb hero-orb-two"
                />

                <div
                    className="hero-orb hero-orb-three"
                />


                <div
                    className="
                        careersync-soft-grid
                        relative
                        mx-auto
                        max-w-7xl
                        px-4
                        pb-16
                        pt-16
                        sm:px-6
                        sm:pb-20
                        sm:pt-20
                        lg:px-8
                        lg:pb-24
                        lg:pt-24
                    "
                >

                    <div
                        className="
                            mx-auto
                            max-w-5xl
                            text-center
                        "
                    >

                        <div
                            className="
                                cs-fade-up
                                inline-flex
                                items-center
                                gap-2
                                rounded-full
                                border
                                border-indigo-100
                                bg-white/80
                                px-4
                                py-2
                                text-xs
                                font-bold
                                uppercase
                                tracking-[0.16em]
                                text-indigo-700
                                shadow-sm
                                backdrop-blur
                            "
                        >

                            <BriefcaseBusiness
                                className="h-4 w-4"
                            />

                            Career opportunities
                            made simpler

                        </div>


                        <h1
                            className="
                                cs-fade-up
                                cs-delay-1
                                mt-6
                                text-4xl
                                font-black
                                tracking-[-0.04em]
                                text-slate-950
                                sm:text-5xl
                                lg:text-6xl
                            "
                        >

                            Search Your{" "}

                            <span
                                className="
                                    cs-gradient-text
                                "
                            >
                                Dream Job
                            </span>

                        </h1>


                        <p
                            className="
                                cs-fade-up
                                cs-delay-2
                                mx-auto
                                mt-5
                                max-w-2xl
                                text-base
                                leading-7
                                text-slate-600
                                sm:text-lg
                            "
                        >
                            Discover jobs that
                            match your skills,
                            experience and location
                            — and manage your
                            complete career journey
                            with CareerSync.
                        </p>


                        {/* SEARCH */}

                        <form
                            onSubmit={
                                handleSearch
                            }
                            className="
                                cs-fade-up
                                cs-delay-3
                                mx-auto
                                mt-9
                                max-w-5xl
                                rounded-[24px]
                                border
                                border-slate-200/90
                                bg-white
                                p-2.5
                                shadow-[0_22px_70px_rgba(60,54,120,0.13)]
                            "
                        >

                            <div
                                className="
                                    grid
                                    grid-cols-1
                                    gap-2
                                    lg:grid-cols-[1.25fr_0.85fr_1fr_auto]
                                "
                            >

                                <div
                                    className="
                                        flex
                                        min-h-14
                                        items-center
                                        gap-3
                                        rounded-2xl
                                        px-4
                                        transition
                                        focus-within:bg-slate-50
                                    "
                                >

                                    <Search
                                        className="
                                            h-5
                                            w-5
                                            shrink-0
                                            text-indigo-500
                                        "
                                    />

                                    <input
                                        type="text"
                                        value={
                                            searchTerm
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setSearchTerm(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        placeholder="Skills, role or company"
                                        className="
                                            min-w-0
                                            flex-1
                                            bg-transparent
                                            text-sm
                                            font-medium
                                            text-slate-800
                                            outline-none
                                            placeholder:font-normal
                                            placeholder:text-slate-400
                                            sm:text-base
                                        "
                                    />

                                </div>


                                <div
                                    className="
                                        flex
                                        min-h-14
                                        items-center
                                        gap-3
                                        border-t
                                        border-slate-100
                                        px-4
                                        lg:border-l
                                        lg:border-t-0
                                    "
                                >

                                    <BriefcaseBusiness
                                        className="
                                            h-5
                                            w-5
                                            shrink-0
                                            text-violet-500
                                        "
                                    />

                                    <select
                                        value={
                                            experience
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setExperience(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        className="
                                            w-full
                                            cursor-pointer
                                            bg-transparent
                                            text-sm
                                            font-medium
                                            text-slate-600
                                            outline-none
                                            sm:text-base
                                        "
                                    >

                                        <option value="">
                                            Experience
                                        </option>

                                        <option value="Fresher">
                                            Fresher
                                        </option>

                                        <option value="0-2">
                                            0–2 years
                                        </option>

                                        <option value="2-5">
                                            2–5 years
                                        </option>

                                        <option value="5+">
                                            5+ years
                                        </option>

                                    </select>

                                </div>


                                <div
                                    className="
                                        flex
                                        min-h-14
                                        items-center
                                        gap-3
                                        border-t
                                        border-slate-100
                                        px-4
                                        lg:border-l
                                        lg:border-t-0
                                    "
                                >

                                    <MapPin
                                        className="
                                            h-5
                                            w-5
                                            shrink-0
                                            text-teal-600
                                        "
                                    />

                                    <input
                                        type="text"
                                        value={
                                            location
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setLocation(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        placeholder="Location"
                                        className="
                                            min-w-0
                                            flex-1
                                            bg-transparent
                                            text-sm
                                            font-medium
                                            text-slate-800
                                            outline-none
                                            placeholder:font-normal
                                            placeholder:text-slate-400
                                            sm:text-base
                                        "
                                    />

                                </div>


                                <button
                                    type="submit"
                                    className="
                                        inline-flex
                                        min-h-14
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-2xl
                                        bg-gradient-to-r
                                        from-indigo-600
                                        via-violet-600
                                        to-indigo-600
                                        px-7
                                        font-bold
                                        text-white
                                        shadow-lg
                                        shadow-indigo-600/20
                                        transition
                                        hover:-translate-y-0.5
                                        hover:shadow-xl
                                        hover:shadow-indigo-600/25
                                        active:translate-y-0
                                    "
                                >

                                    <Search
                                        className="h-4 w-4"
                                    />

                                    Search

                                </button>

                            </div>

                        </form>


                        {/* POPULAR SEARCHES */}

                        <div
                            className="
                                mt-5
                                flex
                                flex-wrap
                                items-center
                                justify-center
                                gap-2
                                text-sm
                            "
                        >

                            <span
                                className="
                                    mr-1
                                    font-semibold
                                    text-slate-500
                                "
                            >
                                Popular:
                            </span>


                            {[
                                "Python",
                                "React",
                                "Java",
                                "Data Analyst",
                                "Internship",
                            ].map(
                                (item) => (

                                <button
                                    key={
                                        item
                                    }
                                    type="button"
                                    onClick={() => {

                                        setSearchTerm(
                                            item
                                        );

                                        navigate(
                                            `/jobs?search=${encodeURIComponent(
                                                item
                                            )}`
                                        );

                                    }}
                                    className="
                                        rounded-full
                                        border
                                        border-slate-200
                                        bg-white/80
                                        px-3
                                        py-1.5
                                        font-medium
                                        text-slate-600
                                        shadow-sm
                                        transition
                                        hover:border-indigo-200
                                        hover:bg-indigo-50
                                        hover:text-indigo-700
                                    "
                                >
                                    {item}
                                </button>

                                )
                            )}

                        </div>


                        <div
                            className="
                                mt-7
                                flex
                                flex-col
                                items-center
                                justify-center
                                gap-3
                                sm:flex-row
                            "
                        >

                            <Link
                                to="/jobs"
                                className="
                                    inline-flex
                                    min-h-11
                                    items-center
                                    justify-center
                                    gap-2
                                    text-sm
                                    font-bold
                                    text-indigo-700
                                    transition
                                    hover:text-indigo-900
                                "
                            >

                                Explore all jobs

                                <ArrowRight
                                    className="h-4 w-4"
                                />

                            </Link>


                            <span
                                className="
                                    hidden
                                    h-4
                                    w-px
                                    bg-slate-300
                                    sm:block
                                "
                            />


                            <Link
                                to={
                                    profileDestination
                                }
                                className="
                                    inline-flex
                                    min-h-11
                                    items-center
                                    justify-center
                                    gap-2
                                    text-sm
                                    font-bold
                                    text-slate-600
                                    transition
                                    hover:text-slate-900
                                "
                            >

                                <UserSearch
                                    className="h-4 w-4"
                                />

                                {userRole ===
                                "recruiter"
                                    ? "Recruiter workspace"
                                    : "Build your profile"}

                            </Link>

                        </div>

                    </div>

                </div>

            </section>


            {/* =================================================
                POPULAR EMPLOYERS
            ================================================= */}

            <section
                id="companies"
                className="
                    relative
                    overflow-hidden
                    bg-gradient-to-b
                    from-white
                    via-[#fffdf3]
                    to-[#fff7d7]
                    py-14
                    sm:py-16
                "
            >

                <div
                    className="
                        pointer-events-none
                        absolute
                        left-1/2
                        top-1/2
                        h-[250px]
                        w-[75%]
                        -translate-x-1/2
                        -translate-y-1/2
                        rounded-full
                        bg-amber-100/50
                        blur-[95px]
                    "
                />


                <div
                    className="
                        relative
                        mx-auto
                        max-w-7xl
                        px-4
                        sm:px-6
                        lg:px-8
                    "
                >

                    <div
                        className="
                            text-center
                        "
                    >

                        <p
                            className="
                                text-xs
                                font-black
                                uppercase
                                tracking-[0.22em]
                                text-amber-700/70
                            "
                        >
                            Popular employers
                        </p>


                        <h2
                            className="
                                mt-2
                                text-2xl
                                font-black
                                tracking-[-0.025em]
                                text-slate-950
                                sm:text-3xl
                            "
                        >
                            Explore careers at{" "}

                            <span
                                className="
                                    cs-gradient-text
                                "
                            >
                                leading companies
                            </span>
                        </h2>


                        <p
                            className="
                                mx-auto
                                mt-3
                                max-w-2xl
                                text-sm
                                leading-6
                                text-slate-500
                            "
                        >
                            Discover well-known
                            employers across
                            technology, finance,
                            consulting, telecom and
                            digital services.
                        </p>

                    </div>


                    {/* MARQUEE */}

                    <div
                        className="
                            company-marquee
                            mt-10
                        "
                    >

                        <div
                            className="
                                company-marquee-track
                            "
                        >

                            {marqueeCompanies.map(
                                (
                                    company,
                                    index
                                ) => (

                                <CompanyCard
                                    key={`${company.id}-${index}`}
                                    company={
                                        company
                                    }
                                />

                                )
                            )}

                        </div>

                    </div>


                    <p
                        className="
                            mx-auto
                            mt-7
                            max-w-3xl
                            text-center
                            text-[11px]
                            leading-5
                            text-slate-400
                        "
                    >
                        Employer names and
                        trademarks are displayed
                        for career exploration
                        purposes and do not imply
                        partnership or endorsement
                        of CareerSync.
                    </p>

                </div>

            </section>


            {/* =================================================
                FEATURED JOBS
            ================================================= */}

            <div id="featured-jobs">

                <FeaturedJobsSection />

            </div>


            {/* =================================================
                HOW IT WORKS
            ================================================= */}

            <section
                id="how-it-works"
                className="
                    overflow-hidden
                    bg-white
                    py-20
                    sm:py-24
                "
            >

                <div
                    className="
                        mx-auto
                        max-w-7xl
                        px-4
                        sm:px-6
                        lg:px-8
                    "
                >

                    <div
                        className="
                            mx-auto
                            max-w-3xl
                            text-center
                        "
                    >

                        <p
                            className="
                                text-xs
                                font-black
                                uppercase
                                tracking-[0.2em]
                                text-indigo-600
                            "
                        >
                            A simpler hiring journey
                        </p>


                        <h2
                            className="
                                mt-3
                                text-3xl
                                font-black
                                tracking-tight
                                text-slate-950
                                sm:text-4xl
                            "
                        >
                            How CareerSync works
                        </h2>


                        <p
                            className="
                                mx-auto
                                mt-4
                                max-w-2xl
                                text-base
                                leading-7
                                text-slate-600
                            "
                        >
                            One platform for
                            discovering opportunities,
                            managing applications and
                            connecting candidates with
                            recruiters.
                        </p>

                    </div>


                    <div
                        className="
                            relative
                            mt-12
                            grid
                            gap-5
                            md:grid-cols-2
                            lg:grid-cols-4
                        "
                    >

                        {[
                            {
                                number:
                                    "01",
                                icon:
                                    Search,
                                title:
                                    "Discover",
                                text:
                                    "Search jobs by skills, role, location and experience.",
                                tone:
                                    "from-indigo-500 to-violet-500",
                            },
                            {
                                number:
                                    "02",
                                icon:
                                    FileSearch,
                                title:
                                    "Apply",
                                text:
                                    "Create your profile and submit applications to relevant roles.",
                                tone:
                                    "from-violet-500 to-fuchsia-500",
                            },
                            {
                                number:
                                    "03",
                                icon:
                                    BadgeCheck,
                                title:
                                    "Track",
                                text:
                                    "Follow every application from Applied to Shortlisted and Accepted.",
                                tone:
                                    "from-teal-500 to-emerald-500",
                            },
                            {
                                number:
                                    "04",
                                icon:
                                    Send,
                                title:
                                    "Connect",
                                text:
                                    "Receive recruiter invitations and connect directly after acceptance.",
                                tone:
                                    "from-amber-500 to-orange-500",
                            },
                        ].map(
                            (
                                item
                            ) => {

                                const Icon =
                                    item.icon;

                                return (

                                    <div
                                        key={
                                            item.number
                                        }
                                        className="
                                            cs-card
                                            group
                                            relative
                                            overflow-hidden
                                            p-6
                                            sm:p-7
                                        "
                                    >

                                        <span
                                            className="
                                                absolute
                                                right-5
                                                top-4
                                                text-5xl
                                                font-black
                                                tracking-tighter
                                                text-slate-100
                                            "
                                        >
                                            {
                                                item.number
                                            }
                                        </span>


                                        <div
                                            className={`
                                                relative
                                                flex
                                                h-12
                                                w-12
                                                items-center
                                                justify-center
                                                rounded-2xl
                                                bg-gradient-to-br
                                                ${item.tone}
                                                text-white
                                                shadow-lg
                                            `}
                                        >

                                            <Icon
                                                className="h-5 w-5"
                                            />

                                        </div>


                                        <h3
                                            className="
                                                relative
                                                mt-6
                                                text-lg
                                                font-black
                                                text-slate-900
                                            "
                                        >
                                            {
                                                item.title
                                            }
                                        </h3>


                                        <p
                                            className="
                                                relative
                                                mt-2
                                                text-sm
                                                leading-6
                                                text-slate-600
                                            "
                                        >
                                            {
                                                item.text
                                            }
                                        </p>

                                    </div>

                                );

                            }
                        )}

                    </div>

                </div>

            </section>


            {/* =================================================
                CANDIDATE / RECRUITER
            ================================================= */}

            <section
                className="
                    bg-[#f8f9ff]
                    py-20
                    sm:py-24
                "
            >

                <div
                    className="
                        mx-auto
                        max-w-7xl
                        px-4
                        sm:px-6
                        lg:px-8
                    "
                >

                    <div
                        className="
                            grid
                            gap-6
                            lg:grid-cols-2
                        "
                    >

                        {/* Candidate */}

                        <div
                            className="
                                relative
                                overflow-hidden
                                rounded-[28px]
                                border
                                border-indigo-100
                                bg-gradient-to-br
                                from-indigo-50
                                via-white
                                to-violet-50
                                p-7
                                shadow-sm
                                sm:p-9
                            "
                        >

                            <div
                                className="
                                    absolute
                                    -right-20
                                    -top-20
                                    h-48
                                    w-48
                                    rounded-full
                                    bg-indigo-200/40
                                    blur-3xl
                                "
                            />


                            <div
                                className="
                                    relative
                                "
                            >

                                <div
                                    className="
                                        flex
                                        h-12
                                        w-12
                                        items-center
                                        justify-center
                                        rounded-2xl
                                        bg-indigo-600
                                        text-white
                                        shadow-lg
                                        shadow-indigo-600/20
                                    "
                                >

                                    <Users
                                        className="h-5 w-5"
                                    />

                                </div>


                                <p
                                    className="
                                        mt-6
                                        text-xs
                                        font-black
                                        uppercase
                                        tracking-[0.18em]
                                        text-indigo-600
                                    "
                                >
                                    For Candidates
                                </p>


                                <h2
                                    className="
                                        mt-2
                                        text-2xl
                                        font-black
                                        tracking-tight
                                        text-slate-950
                                        sm:text-3xl
                                    "
                                >
                                    Build your career
                                    with clarity.
                                </h2>


                                <p
                                    className="
                                        mt-3
                                        max-w-lg
                                        leading-7
                                        text-slate-600
                                    "
                                >
                                    Discover relevant
                                    jobs, create a
                                    professional
                                    profile and keep
                                    your complete
                                    application journey
                                    organised.
                                </p>


                                <div
                                    className="
                                        mt-7
                                        grid
                                        gap-3
                                        sm:grid-cols-2
                                    "
                                >

                                    {[
                                        "Search relevant jobs",
                                        "Create your profile",
                                        "Save opportunities",
                                        "Track applications",
                                        "Receive invitations",
                                        "Contact recruiters",
                                    ].map(
                                        (
                                            item
                                        ) => (

                                        <div
                                            key={
                                                item
                                            }
                                            className="
                                                flex
                                                items-center
                                                gap-2.5
                                                text-sm
                                                font-semibold
                                                text-slate-700
                                            "
                                        >

                                            <CheckCircle2
                                                className="
                                                    h-4
                                                    w-4
                                                    shrink-0
                                                    text-indigo-600
                                                "
                                            />

                                            {
                                                item
                                            }

                                        </div>

                                        )
                                    )}

                                </div>


                                <Link
                                    to="/jobs"
                                    className="
                                        mt-8
                                        inline-flex
                                        items-center
                                        gap-2
                                        rounded-xl
                                        bg-indigo-600
                                        px-5
                                        py-3
                                        text-sm
                                        font-bold
                                        text-white
                                        shadow-md
                                        shadow-indigo-600/15
                                        transition
                                        hover:-translate-y-0.5
                                        hover:bg-indigo-700
                                    "
                                >

                                    Explore Jobs

                                    <ArrowRight
                                        className="h-4 w-4"
                                    />

                                </Link>

                            </div>

                        </div>


                        {/* Recruiter */}

                        <div
                            className="
                                relative
                                overflow-hidden
                                rounded-[28px]
                                border
                                border-teal-100
                                bg-gradient-to-br
                                from-teal-50
                                via-white
                                to-amber-50
                                p-7
                                shadow-sm
                                sm:p-9
                            "
                        >

                            <div
                                className="
                                    absolute
                                    -bottom-20
                                    -right-20
                                    h-48
                                    w-48
                                    rounded-full
                                    bg-teal-200/40
                                    blur-3xl
                                "
                            />


                            <div
                                className="
                                    relative
                                "
                            >

                                <div
                                    className="
                                        flex
                                        h-12
                                        w-12
                                        items-center
                                        justify-center
                                        rounded-2xl
                                        bg-teal-600
                                        text-white
                                        shadow-lg
                                        shadow-teal-600/20
                                    "
                                >

                                    <Building2
                                        className="h-5 w-5"
                                    />

                                </div>


                                <p
                                    className="
                                        mt-6
                                        text-xs
                                        font-black
                                        uppercase
                                        tracking-[0.18em]
                                        text-teal-700
                                    "
                                >
                                    For Recruiters
                                </p>


                                <h2
                                    className="
                                        mt-2
                                        text-2xl
                                        font-black
                                        tracking-tight
                                        text-slate-950
                                        sm:text-3xl
                                    "
                                >
                                    Hire with more
                                    confidence.
                                </h2>


                                <p
                                    className="
                                        mt-3
                                        max-w-lg
                                        leading-7
                                        text-slate-600
                                    "
                                >
                                    Publish openings,
                                    discover candidates
                                    and manage the
                                    hiring process from
                                    one recruiter
                                    workspace.
                                </p>


                                <div
                                    className="
                                        mt-7
                                        grid
                                        gap-3
                                        sm:grid-cols-2
                                    "
                                >

                                    {[
                                        "Publish job openings",
                                        "Discover talent",
                                        "Review applications",
                                        "Manage hiring status",
                                        "Invite candidates",
                                        "Connect directly",
                                    ].map(
                                        (
                                            item
                                        ) => (

                                        <div
                                            key={
                                                item
                                            }
                                            className="
                                                flex
                                                items-center
                                                gap-2.5
                                                text-sm
                                                font-semibold
                                                text-slate-700
                                            "
                                        >

                                            <CheckCircle2
                                                className="
                                                    h-4
                                                    w-4
                                                    shrink-0
                                                    text-teal-600
                                                "
                                            />

                                            {
                                                item
                                            }

                                        </div>

                                        )
                                    )}

                                </div>


                                <Link
                                    to={
                                        userRole ===
                                        "recruiter"
                                            ? "/recruiter/dashboard"
                                            : "/register"
                                    }
                                    className="
                                        mt-8
                                        inline-flex
                                        items-center
                                        gap-2
                                        rounded-xl
                                        bg-teal-600
                                        px-5
                                        py-3
                                        text-sm
                                        font-bold
                                        text-white
                                        shadow-md
                                        shadow-teal-600/15
                                        transition
                                        hover:-translate-y-0.5
                                        hover:bg-teal-700
                                    "
                                >

                                    {userRole ===
                                    "recruiter"
                                        ? "Recruiter Dashboard"
                                        : "Start Hiring"}

                                    <ArrowRight
                                        className="h-4 w-4"
                                    />

                                </Link>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* =================================================
                ABOUT
            ================================================= */}

            <section
                id="about"
                className="
                    bg-white
                    py-20
                    sm:py-24
                "
            >

                <div
                    className="
                        mx-auto
                        max-w-7xl
                        px-4
                        sm:px-6
                        lg:px-8
                    "
                >

                    <div
                        className="
                            grid
                            items-center
                            gap-12
                            lg:grid-cols-[0.9fr_1.1fr]
                        "
                    >

                        <div>

                            <p
                                className="
                                    text-xs
                                    font-black
                                    uppercase
                                    tracking-[0.2em]
                                    text-violet-600
                                "
                            >
                                About CareerSync
                            </p>


                            <h2
                                className="
                                    mt-3
                                    text-3xl
                                    font-black
                                    leading-tight
                                    tracking-tight
                                    text-slate-950
                                    sm:text-4xl
                                "
                            >
                                Helping talent and
                                opportunity find
                                each other.
                            </h2>

                        </div>


                        <div>

                            <p
                                className="
                                    text-base
                                    leading-8
                                    text-slate-600
                                "
                            >
                                CareerSync is a
                                recruitment and
                                career platform
                                designed to make
                                hiring simpler for
                                candidates and
                                recruiters. Candidates
                                can discover
                                opportunities, build
                                professional profiles,
                                save jobs, apply,
                                track progress and
                                receive direct
                                invitations from
                                recruiters.
                            </p>


                            <p
                                className="
                                    mt-5
                                    text-base
                                    leading-8
                                    text-slate-600
                                "
                            >
                                Recruiters can
                                publish openings,
                                discover talent,
                                review applications,
                                manage candidate
                                status and connect
                                with suitable
                                candidates through a
                                clear, focused hiring
                                workflow.
                            </p>

                        </div>

                    </div>


                    <div
                        className="
                            mt-12
                            grid
                            gap-5
                            md:grid-cols-3
                        "
                    >

                        {[
                            {
                                icon:
                                    UserSearch,
                                title:
                                    "Candidate-first discovery",
                                text:
                                    "Search, save and manage opportunities without losing track of your career activity.",
                            },
                            {
                                icon:
                                    Building2,
                                title:
                                    "Focused recruiter tools",
                                text:
                                    "Manage job postings, candidate discovery and applications from one hiring workspace.",
                            },
                            {
                                icon:
                                    BriefcaseBusiness,
                                title:
                                    "One connected workflow",
                                text:
                                    "From discovering a job to recruiter invitation and contact, each step stays connected.",
                            },
                        ].map(
                            (
                                item
                            ) => {

                                const Icon =
                                    item.icon;

                                return (

                                    <div
                                        key={
                                            item.title
                                        }
                                        className="
                                            rounded-2xl
                                            border
                                            border-slate-200
                                            bg-slate-50/70
                                            p-6
                                        "
                                    >

                                        <Icon
                                            className="
                                                h-6
                                                w-6
                                                text-indigo-600
                                            "
                                        />


                                        <h3
                                            className="
                                                mt-5
                                                font-black
                                                text-slate-900
                                            "
                                        >
                                            {
                                                item.title
                                            }
                                        </h3>


                                        <p
                                            className="
                                                mt-2
                                                text-sm
                                                leading-6
                                                text-slate-600
                                            "
                                        >
                                            {
                                                item.text
                                            }
                                        </p>

                                    </div>

                                );

                            }
                        )}

                    </div>

                </div>

            </section>


            {/* =================================================
                FINAL CTA
            ================================================= */}

            <section
                className="
                    px-4
                    pb-20
                    sm:px-6
                    sm:pb-24
                    lg:px-8
                "
            >

                <div
                    className="
                        relative
                        mx-auto
                        max-w-7xl
                        overflow-hidden
                        rounded-[30px]
                        bg-gradient-to-r
                        from-indigo-950
                        via-indigo-900
                        to-violet-900
                        px-6
                        py-12
                        text-white
                        shadow-2xl
                        shadow-indigo-950/15
                        sm:px-10
                        lg:px-14
                        lg:py-14
                    "
                >

                    <div
                        className="
                            absolute
                            -right-16
                            -top-20
                            h-64
                            w-64
                            rounded-full
                            bg-violet-500/25
                            blur-3xl
                        "
                    />


                    <div
                        className="
                            absolute
                            -bottom-24
                            left-1/3
                            h-60
                            w-60
                            rounded-full
                            bg-teal-400/15
                            blur-3xl
                        "
                    />


                    <div
                        className="
                            relative
                            flex
                            flex-col
                            gap-8
                            lg:flex-row
                            lg:items-center
                            lg:justify-between
                        "
                    >

                        <div
                            className="
                                max-w-2xl
                            "
                        >

                            <p
                                className="
                                    text-xs
                                    font-black
                                    uppercase
                                    tracking-[0.2em]
                                    text-indigo-200
                                "
                            >
                                Your next step
                                starts here
                            </p>


                            <h2
                                className="
                                    mt-3
                                    text-3xl
                                    font-black
                                    tracking-tight
                                    sm:text-4xl
                                "
                            >
                                Find the opportunity
                                that moves your
                                career forward.
                            </h2>


                            <p
                                className="
                                    mt-4
                                    max-w-xl
                                    leading-7
                                    text-indigo-100/80
                                "
                            >
                                Explore
                                opportunities,
                                create your profile
                                and keep every
                                application organised
                                with CareerSync.
                            </p>

                        </div>


                        <Link
                            to="/jobs"
                            className="
                                inline-flex
                                min-h-12
                                shrink-0
                                items-center
                                justify-center
                                gap-2
                                rounded-2xl
                                bg-white
                                px-6
                                font-bold
                                text-indigo-900
                                shadow-lg
                                transition
                                hover:-translate-y-0.5
                                hover:bg-indigo-50
                            "
                        >

                            Find Jobs

                            <ArrowRight
                                className="h-4 w-4"
                            />

                        </Link>

                    </div>

                </div>

            </section>

        </div>
    );
}


export default Home;