import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Link,
    useSearchParams,
} from "react-router-dom";

import {
    ArrowRight,
    BriefcaseBusiness,
    Building2,
    Clock3,
    IndianRupee,
    MapPin,
    RefreshCw,
    Search,
    SearchX,
    SlidersHorizontal,
    X,
} from "lucide-react";

import { apiFetch } from "../api";


/* =========================================================
   HELPERS
   ========================================================= */

function formatPostedDate(dateValue) {
    if (!dateValue) {
        return "Recently posted";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "Recently posted";
    }

    const now = new Date();

    const difference =
        now.getTime() -
        date.getTime();

    const days = Math.floor(
        difference /
            (
                1000 *
                60 *
                60 *
                24
            )
    );

    if (days <= 0) {
        return "Posted today";
    }

    if (days === 1) {
        return "Posted yesterday";
    }

    if (days < 7) {
        return `Posted ${days} days ago`;
    }

    return date.toLocaleDateString(
        undefined,
        {
            day: "numeric",
            month: "short",
            year: "numeric",
        }
    );
}


function getJobTypeClasses(jobType) {
    switch (jobType) {
        case "Internship":
            return (
                "border-[#E7E1F5] " +
                "bg-[#F6F3FB] " +
                "text-[#75658D]"
            );

        case "Part Time":
            return (
                "border-[#F2E6C9] " +
                "bg-[#FFF9ED] " +
                "text-[#98733D]"
            );

        case "Full Time":
        default:
            return (
                "border-[#DDE4F1] " +
                "bg-[#F2F5FA] " +
                "text-[#596A91]"
            );
    }
}


/* =========================================================
   JOBS
   ========================================================= */

function Jobs() {
    const [
        searchParams,
        setSearchParams,
    ] = useSearchParams();


    const [
        search,
        setSearch,
    ] = useState(
        () =>
            searchParams.get(
                "search"
            ) || ""
    );


    const [
        location,
        setLocation,
    ] = useState(
        () =>
            searchParams.get(
                "location"
            ) || ""
    );


    const [
        jobType,
        setJobType,
    ] = useState(
        () =>
            searchParams.get(
                "job_type"
            ) || ""
    );


    const [
        experience,
        setExperience,
    ] = useState(
        () =>
            searchParams.get(
                "experience"
            ) || ""
    );


    const [
        jobs,
        setJobs,
    ] = useState([]);


    const [
        loading,
        setLoading,
    ] = useState(true);


    const [
        error,
        setError,
    ] = useState("");


    /* =====================================================
       FETCH JOBS
       ===================================================== */

    const fetchJobs = async () => {
        try {
            setLoading(true);
            setError("");


            const response =
                await apiFetch(
                    "/jobs/"
                );


            const data =
                await response.json();


            if (!response.ok) {
                throw new Error(
                    data.detail ||
                    "Unable to load jobs."
                );
            }


            setJobs(
                Array.isArray(data)
                    ? data
                    : data.results || []
            );

        } catch (error) {
            console.error(
                "Fetch jobs error:",
                error
            );


            if (
                error.message ===
                "SESSION_EXPIRED"
            ) {
                setError(
                    "Your session has expired. Please login again."
                );

            } else {
                setError(
                    error.message ||
                    "Unable to load jobs."
                );
            }

        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchJobs();
    }, []);


    /* =====================================================
       FILTER JOBS
       ===================================================== */

    const filteredJobs =
        useMemo(
            () => {

                const searchText =
                    search
                        .toLowerCase()
                        .trim();


                const locationText =
                    location
                        .toLowerCase()
                        .trim();


                const experienceText =
                    experience
                        .toLowerCase()
                        .trim();


                return jobs.filter(
                    (job) => {

                        const skills =
                            Array.isArray(
                                job.skills
                            )
                                ? job.skills
                                : [];


                        const matchesSearch =
                            !searchText ||
                            job.title
                                ?.toLowerCase()
                                .includes(
                                    searchText
                                ) ||
                            job.company
                                ?.toLowerCase()
                                .includes(
                                    searchText
                                ) ||
                            skills.some(
                                (skill) =>
                                    String(skill)
                                        .toLowerCase()
                                        .includes(
                                            searchText
                                        )
                            );


                        const matchesLocation =
                            !locationText ||
                            job.location
                                ?.toLowerCase()
                                .includes(
                                    locationText
                                );


                        const matchesJobType =
                            !jobType ||
                            job.job_type ===
                                jobType;


                        const matchesExperience =
                            !experienceText ||
                            job.experience
                                ?.toLowerCase()
                                .includes(
                                    experienceText
                                );


                        return (
                            matchesSearch &&
                            matchesLocation &&
                            matchesJobType &&
                            matchesExperience
                        );
                    }
                );

            },
            [
                jobs,
                search,
                location,
                jobType,
                experience,
            ]
        );


    /* =====================================================
       SEARCH
       ===================================================== */

    const handleFilterSubmit = (
        event
    ) => {
        event.preventDefault();


        const params =
            new URLSearchParams();


        if (search.trim()) {
            params.set(
                "search",
                search.trim()
            );
        }


        if (location.trim()) {
            params.set(
                "location",
                location.trim()
            );
        }


        if (jobType) {
            params.set(
                "job_type",
                jobType
            );
        }


        if (experience) {
            params.set(
                "experience",
                experience
            );
        }


        setSearchParams(params);
    };


    const clearFilters = () => {
        setSearch("");
        setLocation("");
        setJobType("");
        setExperience("");

        setSearchParams({});
    };


    const hasFilters =
        search.trim() ||
        location.trim() ||
        jobType ||
        experience;


    /* =====================================================
       UI
       ===================================================== */

    return (
        <div
            className="
                relative
                min-h-screen
                overflow-x-hidden
                bg-gradient-to-br
                from-[#ECFCF7]
                via-[#FBFFFD]
                to-[#F2FFF6]
                text-[#292D35]
            "
        >

            {/* =================================================
                ANIMATED BACKGROUND
            ================================================= */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    fixed
                    inset-0
                    z-0
                    overflow-hidden
                "
            >

                {/* Mint Glow */}

                <div
                    className="
                        absolute
                        -left-32
                        top-20
                        h-[420px]
                        w-[520px]
                        rounded-[42%]
                        bg-[#5EE6C1]/16
                        blur-[95px]
                        animate-[spin_32s_linear_infinite]
                    "
                />


                {/* Green Glow */}

                <div
                    className="
                        absolute
                        -right-40
                        top-[34%]
                        h-[500px]
                        w-[580px]
                        rounded-[45%]
                        bg-[#7EEA9D]/16
                        blur-[110px]
                        animate-[spin_38s_linear_infinite_reverse]
                    "
                />


                {/* Soft Blue / Teal Glow */}

                <div
                    className="
                        absolute
                        left-[32%]
                        top-[58%]
                        h-[360px]
                        w-[520px]
                        rounded-[48%]
                        bg-[#8BE7DA]/12
                        blur-[110px]
                        animate-[pulse_8s_ease-in-out_infinite]
                    "
                />


                {/* Bottom Green Glow */}

                <div
                    className="
                        absolute
                        -bottom-48
                        right-[18%]
                        h-[520px]
                        w-[620px]
                        rounded-full
                        bg-[#A5F3BA]/14
                        blur-[120px]
                        animate-[pulse_10s_ease-in-out_infinite]
                    "
                />

            </div>


            {/* =================================================
                HERO
            ================================================= */}

            <section
                className="
                    relative
                    z-10
                    overflow-hidden
                    border-b
                    border-[#DDEDE6]
                    bg-white/35
                    backdrop-blur-[2px]
                "
            >

                {/* Hero mint glow */}

                <div
                    className="
                        pointer-events-none
                        absolute
                        left-1/2
                        top-24
                        h-64
                        w-[72%]
                        -translate-x-1/2
                        rounded-full
                        bg-[#D8FAEA]/55
                        blur-[100px]
                        animate-[pulse_7s_ease-in-out_infinite]
                    "
                />


                <div
                    className="
                        relative
                        mx-auto
                        max-w-7xl
                        px-4
                        py-16
                        sm:px-6
                        sm:py-20
                        lg:px-8
                    "
                >

                    {/* Heading */}

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
                                font-medium
                                uppercase
                                tracking-[0.18em]
                                text-[#14835B]
                            "
                        >
                            CareerSync Jobs
                        </p>


                        <h1
                            className="
                                mt-4
                                font-sans
                                text-[38px]
                                font-semibold
                                leading-[1.12]
                                tracking-[-0.035em]
                                text-[#171A1F]
                                sm:text-[46px]
                                lg:text-[50px]
                            "
                        >
                            Find Your Next
                            Opportunity
                        </h1>


                        <p
                            className="
                                mx-auto
                                mt-4
                                max-w-2xl
                                text-[15px]
                                leading-7
                                text-[#686F70]
                                sm:text-base
                            "
                        >
                            Discover jobs that match
                            your skills, experience
                            and career goals.
                        </p>

                    </div>


                    {/* =================================================
                        SEARCH BOX
                    ================================================= */}

                    <form
                        onSubmit={
                            handleFilterSubmit
                        }
                        className="
                            mx-auto
                            mt-9
                            max-w-6xl
                            rounded-[22px]
                            border
                            border-[#DDE7E2]
                            bg-white/95
                            p-2.5
                            shadow-[0_18px_45px_rgba(25,65,52,0.07)]
                            backdrop-blur-xl
                        "
                    >

                        <div
                            className="
                                grid
                                grid-cols-1
                                gap-1
                                md:grid-cols-2
                                xl:grid-cols-[1.35fr_1fr_0.9fr_0.9fr_auto]
                            "
                        >

                            {/* Search */}

                            <div
                                className="
                                    flex
                                    min-h-14
                                    items-center
                                    gap-3
                                    rounded-xl
                                    px-4
                                    transition
                                    focus-within:bg-[#F6FCF9]
                                "
                            >

                                <Search
                                    className="
                                        h-5
                                        w-5
                                        shrink-0
                                        text-[#60766D]
                                    "
                                />


                                <input
                                    type="text"
                                    value={search}
                                    onChange={(
                                        event
                                    ) =>
                                        setSearch(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Job title, company or skill"
                                    className="
                                        min-w-0
                                        flex-1
                                        bg-transparent
                                        text-sm
                                        font-normal
                                        text-[#30343C]
                                        outline-none
                                        placeholder:text-[#A0A8A4]
                                    "
                                />

                            </div>


                            {/* Location */}

                            <div
                                className="
                                    flex
                                    min-h-14
                                    items-center
                                    gap-3
                                    border-t
                                    border-[#EEF2EF]
                                    px-4
                                    md:border-l
                                    md:border-t-0
                                "
                            >

                                <MapPin
                                    className="
                                        h-5
                                        w-5
                                        shrink-0
                                        text-[#28936F]
                                    "
                                />


                                <input
                                    type="text"
                                    value={location}
                                    onChange={(
                                        event
                                    ) =>
                                        setLocation(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Location"
                                    className="
                                        min-w-0
                                        flex-1
                                        bg-transparent
                                        text-sm
                                        font-normal
                                        text-[#30343C]
                                        outline-none
                                        placeholder:text-[#A0A8A4]
                                    "
                                />

                            </div>


                            {/* Job Type */}

                            <div
                                className="
                                    flex
                                    min-h-14
                                    items-center
                                    gap-3
                                    border-t
                                    border-[#EEF2EF]
                                    px-4
                                    xl:border-l
                                    xl:border-t-0
                                "
                            >

                                <BriefcaseBusiness
                                    className="
                                        h-5
                                        w-5
                                        shrink-0
                                        text-[#74817B]
                                    "
                                />


                                <select
                                    value={jobType}
                                    onChange={(
                                        event
                                    ) =>
                                        setJobType(
                                            event.target.value
                                        )
                                    }
                                    className="
                                        w-full
                                        cursor-pointer
                                        bg-transparent
                                        text-sm
                                        font-normal
                                        text-[#60646B]
                                        outline-none
                                    "
                                >

                                    <option value="">
                                        Job Type
                                    </option>


                                    <option value="Full Time">
                                        Full Time
                                    </option>


                                    <option value="Part Time">
                                        Part Time
                                    </option>


                                    <option value="Internship">
                                        Internship
                                    </option>

                                </select>

                            </div>


                            {/* Experience */}

                            <div
                                className="
                                    flex
                                    min-h-14
                                    items-center
                                    gap-3
                                    border-t
                                    border-[#EEF2EF]
                                    px-4
                                    md:border-l
                                    md:border-t-0
                                "
                            >

                                <Clock3
                                    className="
                                        h-5
                                        w-5
                                        shrink-0
                                        text-[#8D8066]
                                    "
                                />


                                <select
                                    value={experience}
                                    onChange={(
                                        event
                                    ) =>
                                        setExperience(
                                            event.target.value
                                        )
                                    }
                                    className="
                                        w-full
                                        cursor-pointer
                                        bg-transparent
                                        text-sm
                                        font-normal
                                        text-[#60646B]
                                        outline-none
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


                            {/* PRIMARY SEARCH BUTTON */}

                            <button
                                type="submit"
                                className="
                                    inline-flex
                                    min-h-14
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    bg-[#0D99FF]
                                    px-7
                                    text-sm
                                    font-medium
                                    text-white
                                    shadow-[0_5px_16px_rgba(13,153,255,0.18)]
                                    transition-all
                                    duration-300
                                    ease-out
                                    hover:-translate-y-0.5
                                    hover:bg-[#009944]
                                    hover:shadow-[0_8px_20px_rgba(0,153,68,0.22)]
                                    active:translate-y-0
                                    active:scale-[0.98]
                                "
                            >

                                <Search
                                    className="
                                        h-4
                                        w-4
                                    "
                                />

                                Search

                            </button>

                        </div>

                    </form>


                    {/* =================================================
                        ACTIVE FILTERS
                    ================================================= */}

                    {hasFilters && (

                        <div
                            className="
                                mx-auto
                                mt-5
                                flex
                                max-w-6xl
                                flex-wrap
                                items-center
                                justify-center
                                gap-2
                            "
                        >

                            <span
                                className="
                                    mr-1
                                    inline-flex
                                    items-center
                                    gap-1.5
                                    text-xs
                                    font-medium
                                    text-[#7C8983]
                                "
                            >

                                <SlidersHorizontal
                                    className="
                                        h-3.5
                                        w-3.5
                                    "
                                />

                                Filters

                            </span>


                            {search.trim() && (
                                <FilterTag>
                                    {search}
                                </FilterTag>
                            )}


                            {location.trim() && (
                                <FilterTag>
                                    {location}
                                </FilterTag>
                            )}


                            {jobType && (
                                <FilterTag>
                                    {jobType}
                                </FilterTag>
                            )}


                            {experience && (
                                <FilterTag>
                                    {experience}
                                </FilterTag>
                            )}


                            <button
                                type="button"
                                onClick={clearFilters}
                                className="
                                    inline-flex
                                    items-center
                                    gap-1
                                    px-2
                                    py-1.5
                                    text-xs
                                    font-medium
                                    text-[#747D78]
                                    transition
                                    hover:text-[#009944]
                                "
                            >

                                <X
                                    className="
                                        h-3.5
                                        w-3.5
                                    "
                                />

                                Clear

                            </button>

                        </div>

                    )}

                </div>

            </section>


            {/* =================================================
                RESULTS
            ================================================= */}

            <main
                className="
                    relative
                    z-10
                    mx-auto
                    max-w-7xl
                    px-4
                    py-12
                    sm:px-6
                    sm:py-14
                    lg:px-8
                "
            >

                <div
                    className="
                        mb-8
                        flex
                        flex-col
                        gap-4
                        sm:flex-row
                        sm:items-end
                        sm:justify-between
                    "
                >

                    <div>

                        <p
                            className="
                                text-xs
                                font-medium
                                uppercase
                                tracking-[0.15em]
                                text-[#218360]
                            "
                        >
                            Career Opportunities
                        </p>


                        <h2
                            className="
                                mt-2
                                font-sans
                                text-[28px]
                                font-semibold
                                tracking-tight
                                text-[#22262D]
                                sm:text-[32px]
                            "
                        >
                            Available Jobs
                        </h2>


                        <p
                            className="
                                mt-2
                                text-sm
                                text-[#707A75]
                            "
                        >
                            {loading
                                ? "Loading opportunities..."
                                : `${filteredJobs.length} ${
                                      filteredJobs.length ===
                                      1
                                          ? "job"
                                          : "jobs"
                                  } found`}
                        </p>

                    </div>


                    {hasFilters && (

                        <button
                            type="button"
                            onClick={clearFilters}
                            className="
                                inline-flex
                                min-h-10
                                items-center
                                justify-center
                                gap-2
                                self-start
                                rounded-xl
                                border
                                border-[#D9E6DF]
                                bg-white/90
                                px-4
                                text-sm
                                font-medium
                                text-[#606C66]
                                transition-all
                                duration-200
                                hover:border-[#A9D6C1]
                                hover:bg-[#F1FAF6]
                                hover:text-[#008940]
                                sm:self-auto
                            "
                        >

                            <RefreshCw
                                className="
                                    h-4
                                    w-4
                                "
                            />

                            Reset filters

                        </button>

                    )}

                </div>


                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (

                    <div
                        className="
                            mb-8
                            rounded-xl
                            border
                            border-[#F0DADA]
                            bg-[#FFF6F6]
                            px-5
                            py-4
                            text-sm
                            text-[#A35454]
                        "
                    >
                        {error}
                    </div>

                )}


                {/* =================================================
                    LOADING
                ================================================= */}

                {loading && (

                    <div
                        className="
                            grid
                            grid-cols-1
                            gap-6
                            md:grid-cols-2
                            xl:grid-cols-3
                        "
                    >

                        {[1, 2, 3, 4, 5, 6].map(
                            (item) => (

                            <div
                                key={item}
                                className="
                                    animate-pulse
                                    rounded-[22px]
                                    border
                                    border-[#DDE9E3]
                                    bg-white/95
                                    p-6
                                    shadow-[0_8px_24px_rgba(30,80,60,0.035)]
                                "
                            >

                                <div className="flex gap-4">

                                    <div
                                        className="
                                            h-14
                                            w-14
                                            rounded-full
                                            bg-[#EEF3F0]
                                        "
                                    />


                                    <div className="flex-1">

                                        <div
                                            className="
                                                h-5
                                                w-2/3
                                                rounded
                                                bg-[#E6ECE9]
                                            "
                                        />


                                        <div
                                            className="
                                                mt-3
                                                h-4
                                                w-1/3
                                                rounded
                                                bg-[#EEF2F0]
                                            "
                                        />

                                    </div>

                                </div>


                                <div
                                    className="
                                        mt-6
                                        h-28
                                        rounded-xl
                                        bg-[#F2F6F4]
                                    "
                                />

                            </div>

                            )
                        )}

                    </div>

                )}


                {/* =================================================
                    JOB CARDS
                ================================================= */}

                {!loading &&
                    filteredJobs.length >
                        0 && (

                    <div
                        className="
                            grid
                            grid-cols-1
                            gap-6
                            md:grid-cols-2
                            xl:grid-cols-3
                        "
                    >

                        {filteredJobs.map(
                            (job) => {

                                const skills =
                                    Array.isArray(
                                        job.skills
                                    )
                                        ? job.skills
                                        : [];


                                return (

                                    <article
                                        key={job.id}
                                        className="
                                            group
                                            flex
                                            h-full
                                            flex-col
                                            rounded-[22px]
                                            border
                                            border-[#DDE8E2]
                                            bg-white/95
                                            p-6
                                            shadow-[0_8px_24px_rgba(28,72,55,0.04)]
                                            backdrop-blur-sm
                                            transition-all
                                            duration-300
                                            hover:-translate-y-1
                                            hover:border-[#BFD9CC]
                                            hover:shadow-[0_16px_34px_rgba(21,74,51,0.08)]
                                        "
                                    >

                                        {/* Company */}

                                        <div
                                            className="
                                                flex
                                                items-start
                                                gap-4
                                            "
                                        >

                                            {job.company_logo ? (

                                                <div
                                                    className="
                                                        h-14
                                                        w-14
                                                        shrink-0
                                                        overflow-hidden
                                                        rounded-full
                                                        border
                                                        border-[#DFE8E3]
                                                        bg-white
                                                    "
                                                >

                                                    <img
                                                        src={
                                                            job.company_logo
                                                        }
                                                        alt={`${job.company} logo`}
                                                        className="
                                                            h-full
                                                            w-full
                                                            object-cover
                                                        "
                                                    />

                                                </div>

                                            ) : (

                                                <div
                                                    className="
                                                        flex
                                                        h-14
                                                        w-14
                                                        shrink-0
                                                        items-center
                                                        justify-center
                                                        rounded-2xl
                                                        bg-[#EFF7F3]
                                                        text-[#2A8062]
                                                    "
                                                >

                                                    <Building2
                                                        className="
                                                            h-6
                                                            w-6
                                                        "
                                                    />

                                                </div>

                                            )}


                                            <div
                                                className="
                                                    min-w-0
                                                "
                                            >

                                                <h3
                                                    className="
                                                        line-clamp-2
                                                        text-[19px]
                                                        font-semibold
                                                        leading-6
                                                        tracking-[-0.015em]
                                                        text-[#282C34]
                                                    "
                                                >
                                                    {job.title}
                                                </h3>


                                                <p
                                                    className="
                                                        mt-1
                                                        truncate
                                                        text-sm
                                                        font-medium
                                                        text-[#696F79]
                                                    "
                                                >
                                                    {job.company}
                                                </p>

                                            </div>

                                        </div>


                                        {/* Job Type */}

                                        <span
                                            className={`
                                                mt-5
                                                self-start
                                                rounded-full
                                                border
                                                px-3
                                                py-1.5
                                                text-xs
                                                font-medium
                                                ${getJobTypeClasses(
                                                    job.job_type
                                                )}
                                            `}
                                        >
                                            {job.job_type}
                                        </span>


                                        {/* Details */}

                                        <div
                                            className="
                                                mt-5
                                                grid
                                                gap-3
                                                rounded-xl
                                                border
                                                border-[#EBF1EE]
                                                bg-[#F8FCFA]
                                                p-4
                                            "
                                        >

                                            <JobMeta
                                                icon={MapPin}
                                                value={job.location}
                                                color="text-[#26936D]"
                                            />


                                            <JobMeta
                                                icon={BriefcaseBusiness}
                                                value={job.experience}
                                                color="text-[#6F7A76]"
                                            />


                                            <JobMeta
                                                icon={IndianRupee}
                                                value={job.salary}
                                                color="text-[#8D8065]"
                                            />

                                        </div>


                                        {/* Skills */}

                                        {skills.length >
                                            0 && (

                                            <div
                                                className="
                                                    mt-5
                                                    flex
                                                    flex-wrap
                                                    gap-2
                                                "
                                            >

                                                {skills
                                                    .slice(
                                                        0,
                                                        5
                                                    )
                                                    .map(
                                                        (
                                                            skill,
                                                            index
                                                        ) => (

                                                        <span
                                                            key={`${job.id}-${skill}-${index}`}
                                                            className="
                                                                rounded-full
                                                                border
                                                                border-[#DCEAE3]
                                                                bg-[#F5FAF7]
                                                                px-3
                                                                py-1
                                                                text-xs
                                                                text-[#5F6D66]
                                                            "
                                                        >
                                                            {skill}
                                                        </span>

                                                        )
                                                    )}

                                            </div>

                                        )}


                                        {/* Description */}

                                        {job.description && (

                                            <p
                                                className="
                                                    mt-5
                                                    line-clamp-3
                                                    text-sm
                                                    leading-6
                                                    text-[#737D78]
                                                "
                                            >
                                                {job.description}
                                            </p>

                                        )}


                                        {/* Bottom */}

                                        <div
                                            className="
                                                mt-auto
                                                pt-6
                                            "
                                        >

                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    gap-1.5
                                                    border-t
                                                    border-[#E9EFEC]
                                                    pt-5
                                                    text-xs
                                                    text-[#8E9994]
                                                "
                                            >

                                                <Clock3
                                                    className="
                                                        h-3.5
                                                        w-3.5
                                                    "
                                                />

                                                {formatPostedDate(
                                                    job.created_at
                                                )}

                                            </div>


                                            {/* PRIMARY BUTTON */}

                                            <Link
                                                to={`/jobs/${job.id}`}
                                                className="
                                                    mt-4
                                                    inline-flex
                                                    min-h-11
                                                    w-full
                                                    items-center
                                                    justify-center
                                                    gap-2
                                                    rounded-xl
                                                    bg-[#0D99FF]
                                                    px-5
                                                    text-sm
                                                    font-medium
                                                    text-white
                                                    shadow-[0_5px_16px_rgba(13,153,255,0.16)]
                                                    transition-all
                                                    duration-300
                                                    ease-out
                                                    hover:-translate-y-0.5
                                                    hover:bg-[#009944]
                                                    hover:shadow-[0_8px_20px_rgba(0,153,68,0.22)]
                                                    active:translate-y-0
                                                    active:scale-[0.98]
                                                "
                                            >

                                                View Job

                                                <ArrowRight
                                                    className="
                                                        h-4
                                                        w-4
                                                        transition-transform
                                                        duration-300
                                                        group-hover:translate-x-0.5
                                                    "
                                                />

                                            </Link>

                                        </div>

                                    </article>

                                );
                            }
                        )}

                    </div>

                )}


                {/* =================================================
                    EMPTY
                ================================================= */}

                {!loading &&
                    filteredJobs.length ===
                        0 && (

                    <div
                        className="
                            mx-auto
                            max-w-xl
                            rounded-[22px]
                            border
                            border-[#DDE8E2]
                            bg-white/95
                            px-6
                            py-14
                            text-center
                            shadow-[0_10px_30px_rgba(28,72,55,0.045)]
                        "
                    >

                        <div
                            className="
                                mx-auto
                                flex
                                h-14
                                w-14
                                items-center
                                justify-center
                                rounded-2xl
                                bg-[#EEF7F2]
                                text-[#25825F]
                            "
                        >

                            <SearchX
                                className="
                                    h-6
                                    w-6
                                "
                            />

                        </div>


                        <h3
                            className="
                                mt-5
                                text-xl
                                font-semibold
                                text-[#292D35]
                            "
                        >
                            No matching jobs found
                        </h3>


                        <p
                            className="
                                mx-auto
                                mt-2
                                max-w-md
                                text-sm
                                leading-6
                                text-[#747F79]
                            "
                        >
                            Try changing your
                            search, location or
                            filters.
                        </p>


                        <button
                            type="button"
                            onClick={clearFilters}
                            className="
                                mt-6
                                inline-flex
                                min-h-11
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                bg-[#0D99FF]
                                px-6
                                text-sm
                                font-medium
                                text-white
                                transition-all
                                duration-300
                                ease-out
                                hover:-translate-y-0.5
                                hover:bg-[#009944]
                                active:translate-y-0
                                active:scale-[0.98]
                            "
                        >

                            <RefreshCw
                                className="
                                    h-4
                                    w-4
                                "
                            />

                            Reset filters

                        </button>

                    </div>

                )}

            </main>

        </div>
    );
}


/* =========================================================
   FILTER TAG
   ========================================================= */

function FilterTag({
    children,
}) {
    return (
        <span
            className="
                rounded-full
                border
                border-[#DCE9E3]
                bg-white/90
                px-3
                py-1.5
                text-xs
                text-[#596761]
            "
        >
            {children}
        </span>
    );
}


/* =========================================================
   JOB META
   ========================================================= */

function JobMeta({
    icon: Icon,
    value,
    color,
}) {
    return (
        <div
            className="
                flex
                items-center
                gap-2.5
                text-sm
                text-[#646F69]
            "
        >

            <Icon
                className={`
                    h-4
                    w-4
                    shrink-0
                    ${color}
                `}
            />


            <span>
                {value}
            </span>

        </div>
    );
}


export default Jobs;