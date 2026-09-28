import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Link,
} from "react-router-dom";

import {
    ArrowLeft,
    ArrowRight,
    Bookmark,
    BookmarkCheck,
    BriefcaseBusiness,
    Building2,
    Clock3,
    IndianRupee,
    Info,
    MapPin,
    Search,
    Trash2,
} from "lucide-react";

import { apiFetch } from "../api";


/* =========================================================
   SAVED JOB IDS
   ========================================================= */

function getStoredSavedJobs() {
    try {
        const stored =
            localStorage.getItem(
                "savedJobs"
            );

        if (!stored) {
            return [];
        }

        const parsed =
            JSON.parse(stored);

        if (!Array.isArray(parsed)) {
            return [];
        }

        return [
            ...new Set(
                parsed
                    .map(Number)
                    .filter(
                        (id) =>
                            Number.isInteger(id) &&
                            id > 0
                    )
            ),
        ];

    } catch {
        return [];
    }
}


/* =========================================================
   DATE
   ========================================================= */

function formatPostedDate(value) {
    if (!value) {
        return "Recently posted";
    }

    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "Recently posted";
    }

    const now =
        new Date();

    const difference =
        now.getTime() -
        date.getTime();

    const days =
        Math.floor(
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


/* =========================================================
   JOB TYPE
   ========================================================= */

function getJobTypeClasses(
    jobType
) {
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
                "border-[#D6E8DF] " +
                "bg-[#F1F9F5] " +
                "text-[#4E7768]"
            );
    }
}


/* =========================================================
   SAVED JOBS
   ========================================================= */

function SavedJobs() {
    const [
        jobs,
        setJobs,
    ] = useState([]);


    const [
        savedJobIds,
        setSavedJobIds,
    ] = useState(
        getStoredSavedJobs
    );


    const [
        loading,
        setLoading,
    ] = useState(true);


    const [
        error,
        setError,
    ] = useState("");


    /* =====================================================
       PERSIST LOCAL STORAGE
       ===================================================== */

    useEffect(() => {
        localStorage.setItem(
            "savedJobs",
            JSON.stringify(
                savedJobIds
            )
        );
    }, [savedJobIds]);


    /* =====================================================
       FETCH JOBS
       ===================================================== */

    useEffect(() => {
        let cancelled = false;


        const fetchJobs =
            async () => {

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
                            "Unable to load saved jobs."
                        );
                    }


                    const jobList =
                        Array.isArray(data)
                            ? data
                            : data.results ||
                              [];


                    if (cancelled) {
                        return;
                    }


                    setJobs(jobList);


                    /* ------------------------------------------
                       REMOVE STALE SAVED IDS
                       ------------------------------------------ */

                    const existingJobIds =
                        new Set(
                            jobList.map(
                                (job) =>
                                    Number(
                                        job.id
                                    )
                            )
                        );


                    setSavedJobIds(
                        (
                            currentIds
                        ) => {

                            const validIds =
                                currentIds.filter(
                                    (
                                        jobId
                                    ) =>
                                        existingJobIds.has(
                                            Number(
                                                jobId
                                            )
                                        )
                                );


                            const unchanged =
                                validIds.length ===
                                    currentIds.length &&
                                validIds.every(
                                    (
                                        savedId,
                                        index
                                    ) =>
                                        savedId ===
                                        currentIds[
                                            index
                                        ]
                                );


                            return unchanged
                                ? currentIds
                                : validIds;
                        }
                    );

                } catch (error) {
                    console.error(
                        "Saved jobs fetch error:",
                        error
                    );


                    if (cancelled) {
                        return;
                    }


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
                            "Unable to load saved jobs."
                        );
                    }

                } finally {
                    if (!cancelled) {
                        setLoading(false);
                    }
                }
            };


        fetchJobs();


        return () => {
            cancelled = true;
        };

    }, []);


    /* =====================================================
       SAVED JOB OBJECTS
       ===================================================== */

    const savedJobs =
        useMemo(
            () =>
                jobs.filter(
                    (job) =>
                        savedJobIds.includes(
                            Number(
                                job.id
                            )
                        )
                ),
            [
                jobs,
                savedJobIds,
            ]
        );


    /* =====================================================
       REMOVE SAVED JOB
       ===================================================== */

    const removeSavedJob = (
        jobId
    ) => {

        setSavedJobIds(
            (
                currentIds
            ) =>
                currentIds.filter(
                    (savedId) =>
                        Number(
                            savedId
                        ) !==
                        Number(
                            jobId
                        )
                )
        );
    };


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
                to-[#F1FFF5]
                text-[#292D35]
            "
        >

            <AnimatedBackground />


            {/* =================================================
                HEADER
            ================================================= */}

            <section
                className="
                    relative
                    z-10
                    overflow-hidden
                    border-b
                    border-[#DCEBE4]
                    bg-white/35
                    backdrop-blur-[2px]
                "
            >

                <div
                    className="
                        pointer-events-none
                        absolute
                        left-1/2
                        top-8
                        h-60
                        w-[70%]
                        -translate-x-1/2
                        rounded-full
                        bg-[#D4F8E7]/50
                        blur-[100px]
                        animate-[pulse_8s_ease-in-out_infinite]
                    "
                />


                <div
                    className="
                        relative
                        mx-auto
                        max-w-7xl
                        px-4
                        py-12
                        sm:px-6
                        sm:py-14
                        lg:px-8
                    "
                >

                    <Link
                        to="/dashboard"
                        className="
                            inline-flex
                            items-center
                            gap-2
                            text-sm
                            font-medium
                            text-[#65726C]
                            transition-colors
                            duration-200
                            hover:text-[#009944]
                        "
                    >

                        <ArrowLeft
                            className="
                                h-4
                                w-4
                            "
                        />

                        Back to dashboard

                    </Link>


                    <div
                        className="
                            mt-7
                            flex
                            flex-col
                            gap-5
                            sm:flex-row
                            sm:items-end
                            sm:justify-between
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
                                    font-medium
                                    uppercase
                                    tracking-[0.16em]
                                    text-[#16825D]
                                "
                            >
                                Your Career Shortlist
                            </p>


                            <h1
                                className="
                                    mt-3
                                    font-sans
                                    text-[36px]
                                    font-semibold
                                    leading-[1.12]
                                    tracking-[-0.035em]
                                    text-[#171A1F]
                                    sm:text-[42px]
                                "
                            >
                                Saved Jobs
                            </h1>


                            <p
                                className="
                                    mt-3
                                    max-w-xl
                                    text-[15px]
                                    leading-7
                                    text-[#68746E]
                                "
                            >
                                Keep promising
                                opportunities in one
                                place so you can review
                                them and apply when
                                you're ready.
                            </p>

                        </div>


                        {!loading &&
                            savedJobs.length >
                                0 && (

                            <div
                                className="
                                    inline-flex
                                    items-center
                                    gap-2
                                    self-start
                                    rounded-full
                                    border
                                    border-[#D4E5DC]
                                    bg-white/90
                                    px-4
                                    py-2
                                    text-sm
                                    text-[#5F6B65]
                                    shadow-[0_5px_18px_rgba(25,70,52,0.035)]
                                    backdrop-blur-sm
                                    sm:self-auto
                                "
                            >

                                <BookmarkCheck
                                    className="
                                        h-4
                                        w-4
                                        text-[#009944]
                                    "
                                />


                                {savedJobs.length}{" "}

                                {savedJobs.length ===
                                1
                                    ? "saved job"
                                    : "saved jobs"}

                            </div>

                        )}

                    </div>

                </div>

            </section>


            {/* =================================================
                CONTENT
            ================================================= */}

            <main
                className="
                    relative
                    z-10
                    mx-auto
                    max-w-7xl
                    px-4
                    py-10
                    sm:px-6
                    sm:py-12
                    lg:px-8
                "
            >

                {/* Browser-local note */}

                {!loading &&
                    savedJobs.length >
                        0 && (

                    <div
                        className="
                            mb-7
                            flex
                            items-start
                            gap-3
                            rounded-xl
                            border
                            border-[#D7E8E0]
                            bg-white/70
                            px-4
                            py-3.5
                            text-sm
                            text-[#69766F]
                            backdrop-blur-sm
                        "
                    >

                        <Info
                            className="
                                mt-0.5
                                h-4
                                w-4
                                shrink-0
                                text-[#26916B]
                            "
                        />

                        <p
                            className="
                                leading-6
                            "
                        >
                            Saved jobs are currently
                            stored in this browser.
                        </p>

                    </div>

                )}


                {/* ERROR */}

                {error && (

                    <div
                        role="alert"
                        className="
                            mb-7
                            rounded-xl
                            border
                            border-[#EFDADA]
                            bg-[#FFF7F7]
                            px-5
                            py-4
                            text-sm
                            text-[#A25555]
                        "
                    >
                        {error}
                    </div>

                )}


                {/* =================================================
                    LOADING
                ================================================= */}

                {loading ? (

                    <div
                        className="
                            grid
                            gap-5
                            lg:grid-cols-2
                        "
                    >

                        {[1, 2, 3, 4].map(
                            (item) => (

                            <div
                                key={item}
                                className="
                                    animate-pulse
                                    rounded-[22px]
                                    border
                                    border-[#DCE8E2]
                                    bg-white/95
                                    p-6
                                    shadow-[0_8px_24px_rgba(25,70,52,0.035)]
                                "
                            >

                                <div
                                    className="
                                        flex
                                        items-start
                                        gap-4
                                    "
                                >

                                    <div
                                        className="
                                            h-14
                                            w-14
                                            shrink-0
                                            rounded-full
                                            bg-[#EAF2EE]
                                        "
                                    />


                                    <div
                                        className="
                                            flex-1
                                        "
                                    >

                                        <div
                                            className="
                                                h-5
                                                w-2/3
                                                rounded
                                                bg-[#E4ECE8]
                                            "
                                        />


                                        <div
                                            className="
                                                mt-3
                                                h-4
                                                w-1/3
                                                rounded
                                                bg-[#EEF3F0]
                                            "
                                        />

                                    </div>

                                </div>


                                <div
                                    className="
                                        mt-6
                                        h-24
                                        rounded-xl
                                        bg-[#F0F6F3]
                                    "
                                />


                                <div
                                    className="
                                        mt-6
                                        flex
                                        gap-3
                                    "
                                >

                                    <div
                                        className="
                                            h-11
                                            flex-1
                                            rounded-xl
                                            bg-[#E8EFEC]
                                        "
                                    />


                                    <div
                                        className="
                                            h-11
                                            w-28
                                            rounded-xl
                                            bg-[#F0F3F1]
                                        "
                                    />

                                </div>

                            </div>

                            )
                        )}

                    </div>


                ) : savedJobs.length ===
                    0 ? (

                    /* =================================================
                       EMPTY
                    ================================================= */

                    <div
                        className="
                            mx-auto
                            max-w-2xl
                            rounded-[24px]
                            border
                            border-[#DCE8E2]
                            bg-white/95
                            px-6
                            py-14
                            text-center
                            shadow-[0_10px_30px_rgba(25,70,52,0.045)]
                            backdrop-blur-xl
                            sm:px-10
                            sm:py-16
                        "
                    >

                        <div
                            className="
                                mx-auto
                                flex
                                h-16
                                w-16
                                items-center
                                justify-center
                                rounded-2xl
                                bg-[#EAF7F1]
                                text-[#25805F]
                            "
                        >

                            <Bookmark
                                className="
                                    h-7
                                    w-7
                                "
                            />

                        </div>


                        <h2
                            className="
                                mt-6
                                font-sans
                                text-[24px]
                                font-semibold
                                tracking-[-0.02em]
                                text-[#262A31]
                            "
                        >
                            No saved jobs yet
                        </h2>


                        <p
                            className="
                                mx-auto
                                mt-3
                                max-w-md
                                text-sm
                                leading-7
                                text-[#737E78]
                            "
                        >
                            When you find an
                            opportunity you'd like to
                            revisit, save it and it
                            will appear here.
                        </p>


                        <Link
                            to="/jobs"
                            className="
                                mt-7
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
                                shadow-[0_5px_16px_rgba(13,153,255,0.15)]
                                transition-all
                                duration-300
                                hover:-translate-y-0.5
                                hover:bg-[#009944]
                                hover:shadow-[0_8px_20px_rgba(0,153,68,0.2)]
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

                            Browse jobs

                        </Link>

                    </div>


                ) : (

                    /* =================================================
                       SAVED JOBS
                    ================================================= */

                    <div
                        className="
                            grid
                            gap-5
                            lg:grid-cols-2
                        "
                    >

                        {savedJobs.map(
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
                                            border-[#DCE8E2]
                                            bg-white/95
                                            p-5
                                            shadow-[0_8px_24px_rgba(25,70,52,0.04)]
                                            backdrop-blur-sm
                                            transition-all
                                            duration-300
                                            hover:-translate-y-1
                                            hover:border-[#B9D9C9]
                                            hover:shadow-[0_16px_34px_rgba(25,70,52,0.08)]
                                            sm:p-6
                                        "
                                    >

                                        {/* HEADER */}

                                        <div
                                            className="
                                                flex
                                                items-start
                                                justify-between
                                                gap-4
                                            "
                                        >

                                            <div
                                                className="
                                                    flex
                                                    min-w-0
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
                                                            border-[#DCE7E2]
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
                                                            bg-[#EAF7F1]
                                                            text-[#27815F]
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

                                                    <h2
                                                        className="
                                                            line-clamp-2
                                                            font-sans
                                                            text-[19px]
                                                            font-semibold
                                                            leading-6
                                                            tracking-[-0.015em]
                                                            text-[#282C34]
                                                        "
                                                    >
                                                        {job.title}
                                                    </h2>


                                                    <p
                                                        className="
                                                            mt-1
                                                            truncate
                                                            text-sm
                                                            font-medium
                                                            text-[#626E68]
                                                        "
                                                    >
                                                        {job.company}
                                                    </p>

                                                </div>

                                            </div>


                                            <BookmarkCheck
                                                className="
                                                    h-5
                                                    w-5
                                                    shrink-0
                                                    text-[#009944]
                                                "
                                            />

                                        </div>


                                        {/* JOB TYPE */}

                                        <div
                                            className="
                                                mt-5
                                            "
                                        >

                                            <span
                                                className={`
                                                    inline-flex
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

                                        </div>


                                        {/* INFORMATION */}

                                        <div
                                            className="
                                                mt-5
                                                grid
                                                gap-3
                                                rounded-xl
                                                border
                                                border-[#E8F0EC]
                                                bg-[#F7FCF9]
                                                p-4
                                                sm:grid-cols-2
                                            "
                                        >

                                            <JobMeta
                                                icon={
                                                    MapPin
                                                }
                                                value={
                                                    job.location
                                                }
                                                color="text-[#26916B]"
                                            />


                                            <JobMeta
                                                icon={
                                                    BriefcaseBusiness
                                                }
                                                value={
                                                    job.experience ||
                                                    job.job_type
                                                }
                                                color="text-[#6E7A74]"
                                            />


                                            <JobMeta
                                                icon={
                                                    IndianRupee
                                                }
                                                value={
                                                    job.salary
                                                }
                                                color="text-[#8E8065]"
                                            />


                                            <JobMeta
                                                icon={
                                                    Clock3
                                                }
                                                value={
                                                    formatPostedDate(
                                                        job.created_at
                                                    )
                                                }
                                                color="text-[#77847E]"
                                            />

                                        </div>


                                        {/* SKILLS */}

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
                                                                border-[#DCE9E3]
                                                                bg-[#F4FAF7]
                                                                px-3
                                                                py-1
                                                                text-xs
                                                                text-[#5E6C65]
                                                            "
                                                        >
                                                            {skill}
                                                        </span>

                                                        )
                                                    )}

                                            </div>

                                        )}


                                        {/* DESCRIPTION */}

                                        {job.description && (

                                            <p
                                                className="
                                                    mt-5
                                                    line-clamp-2
                                                    text-sm
                                                    leading-6
                                                    text-[#737E78]
                                                "
                                            >
                                                {job.description}
                                            </p>

                                        )}


                                        {/* ACTIONS */}

                                        <div
                                            className="
                                                mt-auto
                                                flex
                                                flex-col
                                                gap-3
                                                border-t
                                                border-[#E8EFEB]
                                                pt-5
                                                sm:flex-row
                                            "
                                        >

                                            <Link
                                                to={`/jobs/${job.id}`}
                                                className="
                                                    inline-flex
                                                    min-h-11
                                                    flex-1
                                                    items-center
                                                    justify-center
                                                    gap-2
                                                    rounded-xl
                                                    bg-[#0D99FF]
                                                    px-5
                                                    text-sm
                                                    font-medium
                                                    text-white
                                                    shadow-[0_5px_16px_rgba(13,153,255,0.14)]
                                                    transition-all
                                                    duration-300
                                                    hover:-translate-y-0.5
                                                    hover:bg-[#009944]
                                                    hover:shadow-[0_8px_20px_rgba(0,153,68,0.18)]
                                                    active:translate-y-0
                                                    active:scale-[0.98]
                                                "
                                            >

                                                View Job

                                                <ArrowRight
                                                    className="
                                                        h-4
                                                        w-4
                                                    "
                                                />

                                            </Link>


                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeSavedJob(
                                                        job.id
                                                    )
                                                }
                                                className="
                                                    inline-flex
                                                    min-h-11
                                                    items-center
                                                    justify-center
                                                    gap-2
                                                    rounded-xl
                                                    border
                                                    border-[#E8DADA]
                                                    bg-white
                                                    px-5
                                                    text-sm
                                                    font-medium
                                                    text-[#A05D5D]
                                                    transition-all
                                                    duration-200
                                                    hover:border-[#E2CACA]
                                                    hover:bg-[#FFF7F7]
                                                    active:scale-[0.98]
                                                "
                                            >

                                                <Trash2
                                                    className="
                                                        h-4
                                                        w-4
                                                    "
                                                />

                                                Remove

                                            </button>

                                        </div>

                                    </article>

                                );
                            }
                        )}

                    </div>

                )}

            </main>

        </div>
    );
}


/* =========================================================
   ANIMATED BACKGROUND
   ========================================================= */

function AnimatedBackground() {
    return (
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

            <div
                className="
                    absolute
                    -left-36
                    top-16
                    h-[430px]
                    w-[520px]
                    rounded-[44%]
                    bg-[#58DEBA]/16
                    blur-[100px]
                    animate-[spin_34s_linear_infinite]
                "
            />


            <div
                className="
                    absolute
                    -right-44
                    top-[30%]
                    h-[520px]
                    w-[600px]
                    rounded-[46%]
                    bg-[#73E99A]/15
                    blur-[115px]
                    animate-[spin_40s_linear_infinite_reverse]
                "
            />


            <div
                className="
                    absolute
                    left-[28%]
                    top-[57%]
                    h-[390px]
                    w-[540px]
                    rounded-[46%]
                    bg-[#7EE7D3]/12
                    blur-[110px]
                    animate-[pulse_8s_ease-in-out_infinite]
                "
            />


            <div
                className="
                    absolute
                    -bottom-52
                    right-[12%]
                    h-[540px]
                    w-[650px]
                    rounded-full
                    bg-[#9AF2B4]/15
                    blur-[125px]
                    animate-[pulse_10s_ease-in-out_infinite]
                "
            />

        </div>
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
                min-w-0
                items-center
                gap-2.5
                text-sm
                text-[#626E68]
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


            <span
                className="
                    truncate
                "
            >
                {value ||
                    "Not specified"}
            </span>

        </div>
    );
}


export default SavedJobs;