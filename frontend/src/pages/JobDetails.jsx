import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Link,
    useParams,
} from "react-router-dom";

import {
    ArrowLeft,
    ArrowRight,
    Bookmark,
    BookmarkCheck,
    BriefcaseBusiness,
    Building2,
    CalendarDays,
    CheckCircle2,
    Clock3,
    GraduationCap,
    IndianRupee,
    LogIn,
    MapPin,
    Pencil,
    SearchX,
    ShieldCheck,
    Users,
} from "lucide-react";

import { apiFetch } from "../api";


/* =========================================================
   HELPERS
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
                "border-[#D8E8E1] " +
                "bg-[#F2F9F6] " +
                "text-[#4F7567]"
            );
    }
}


/* =========================================================
   JOB DETAILS
   ========================================================= */

function JobDetails() {
    const { id } =
        useParams();


    const [
        job,
        setJob,
    ] = useState(null);


    const [
        loading,
        setLoading,
    ] = useState(true);


    const [
        error,
        setError,
    ] = useState("");


    const [
        isOwnJob,
        setIsOwnJob,
    ] = useState(false);


    const [
        alreadyApplied,
        setAlreadyApplied,
    ] = useState(false);


    const [
        savedJobIds,
        setSavedJobIds,
    ] = useState(
        getStoredSavedJobs
    );


    const accessToken =
        localStorage.getItem(
            "accessToken"
        );


    const userRole =
        localStorage.getItem(
            "userRole"
        );


    const isRecruiter =
        userRole === "recruiter";


    const isStudent =
        userRole === "student";


    /* =====================================================
       SAVE JOBS
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
       LOAD DATA
       ===================================================== */

    useEffect(() => {
        let cancelled = false;


        const loadJobDetails =
            async () => {

                try {
                    setLoading(true);
                    setError("");

                    setIsOwnJob(false);
                    setAlreadyApplied(false);


                    /* ---------------------------------
                       PUBLIC JOB
                    --------------------------------- */

                    const response =
                        await apiFetch(
                            `/jobs/${id}/`
                        );


                    const data =
                        await response.json();


                    if (!response.ok) {
                        throw new Error(
                            data.detail ||
                            "Job not found."
                        );
                    }


                    if (cancelled) {
                        return;
                    }


                    setJob(data);


                    /* ---------------------------------
                       RECRUITER OWNERSHIP
                    --------------------------------- */

                    if (
                        accessToken &&
                        isRecruiter
                    ) {
                        const recruiterResponse =
                            await apiFetch(
                                "/recruiter/jobs/"
                            );


                        if (
                            recruiterResponse.ok
                        ) {
                            const recruiterData =
                                await recruiterResponse.json();


                            const recruiterJobs =
                                Array.isArray(
                                    recruiterData
                                )
                                    ? recruiterData
                                    : recruiterData.results ||
                                      [];


                            const ownsJob =
                                recruiterJobs.some(
                                    (
                                        recruiterJob
                                    ) =>
                                        Number(
                                            recruiterJob.id
                                        ) ===
                                        Number(id)
                                );


                            if (!cancelled) {
                                setIsOwnJob(
                                    ownsJob
                                );
                            }
                        }
                    }


                    /* ---------------------------------
                       STUDENT APPLICATION STATE
                    --------------------------------- */

                    if (
                        accessToken &&
                        isStudent
                    ) {
                        const applicationResponse =
                            await apiFetch(
                                "/applications/"
                            );


                        if (
                            applicationResponse.ok
                        ) {
                            const applicationData =
                                await applicationResponse.json();


                            const applications =
                                Array.isArray(
                                    applicationData
                                )
                                    ? applicationData
                                    : applicationData.results ||
                                      [];


                            const hasApplied =
                                applications.some(
                                    (
                                        application
                                    ) =>
                                        Number(
                                            application.job
                                        ) ===
                                            Number(id) &&
                                        application.status !==
                                            "Withdrawn"
                                );


                            if (!cancelled) {
                                setAlreadyApplied(
                                    hasApplied
                                );
                            }
                        }
                    }

                } catch (error) {
                    console.error(
                        "Job details error:",
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
                            "Unable to load job details."
                        );
                    }

                } finally {
                    if (!cancelled) {
                        setLoading(false);
                    }
                }
            };


        loadJobDetails();


        return () => {
            cancelled = true;
        };

    }, [
        id,
        accessToken,
        isRecruiter,
        isStudent,
    ]);


    /* =====================================================
       SAVE / UNSAVE
       ===================================================== */

    const toggleSaveJob = () => {
        if (!job) {
            return;
        }


        const jobId =
            Number(job.id);


        setSavedJobIds(
            (currentSavedJobs) => {

                if (
                    currentSavedJobs.includes(
                        jobId
                    )
                ) {
                    return currentSavedJobs.filter(
                        (savedId) =>
                            savedId !==
                            jobId
                    );
                }


                return [
                    ...currentSavedJobs,
                    jobId,
                ];
            }
        );
    };


    const isSaved =
        useMemo(
            () =>
                job
                    ? savedJobIds.includes(
                          Number(
                              job.id
                          )
                      )
                    : false,
            [
                savedJobIds,
                job,
            ]
        );


    /* =====================================================
       LOADING
       ===================================================== */

    if (loading) {
        return (
            <div
                className="
                    relative
                    min-h-screen
                    overflow-hidden
                    bg-linear-to-br
                    from-[#ECFCF7]
                    via-[#FBFFFD]
                    to-[#F1FFF5]
                    px-4
                    py-12
                    sm:px-6
                "
            >

                <AnimatedBackground />


                <div
                    className="
                        relative
                        z-10
                        mx-auto
                        max-w-6xl
                    "
                >

                    <div
                        className="
                            animate-pulse
                            rounded-[22px]
                            border
                            border-[#DDE9E3]
                            bg-white/95
                            p-8
                            shadow-[0_10px_28px_rgba(25,75,55,0.04)]
                        "
                    >

                        <div
                            className="
                                flex
                                gap-5
                            "
                        >

                            <div
                                className="
                                    h-20
                                    w-20
                                    shrink-0
                                    rounded-full
                                    bg-[#EBF2EF]
                                "
                            />


                            <div
                                className="
                                    flex-1
                                "
                            >

                                <div
                                    className="
                                        h-4
                                        w-28
                                        rounded
                                        bg-[#E6ECE9]
                                    "
                                />


                                <div
                                    className="
                                        mt-4
                                        h-9
                                        w-2/3
                                        rounded
                                        bg-[#E6ECE9]
                                    "
                                />


                                <div
                                    className="
                                        mt-4
                                        h-4
                                        w-1/3
                                        rounded
                                        bg-[#EEF3F0]
                                    "
                                />

                            </div>

                        </div>

                    </div>

                </div>

            </div>
        );
    }


    /* =====================================================
       ERROR
       ===================================================== */

    if (
        error ||
        !job
    ) {
        return (
            <div
                className="
                    relative
                    flex
                    min-h-screen
                    items-center
                    justify-center
                    overflow-hidden
                    bg-linear-to-br
                    from-[#ECFCF7]
                    via-[#FBFFFD]
                    to-[#F1FFF5]
                    px-4
                    py-16
                "
            >

                <AnimatedBackground />


                <div
                    className="
                        relative
                        z-10
                        w-full
                        max-w-lg
                        rounded-[22px]
                        border
                        border-[#DDE8E2]
                        bg-white/95
                        px-7
                        py-12
                        text-center
                        shadow-[0_14px_36px_rgba(25,75,55,0.06)]
                        backdrop-blur-xl
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
                            bg-[#ECF8F2]
                            text-[#22805D]
                        "
                    >

                        <SearchX
                            className="
                                h-6
                                w-6
                            "
                        />

                    </div>


                    <h1
                        className="
                            mt-6
                            font-sans
                            text-2xl
                            font-semibold
                            tracking-tight
                            text-[#20242B]
                        "
                    >
                        Job not found
                    </h1>


                    <p
                        className="
                            mt-3
                            text-sm
                            leading-6
                            text-[#747B85]
                        "
                    >
                        {error ||
                            "This job could not be found."}
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
                            transition-all
                            duration-300
                            hover:-translate-y-0.5
                            hover:bg-[#009944]
                            active:translate-y-0
                            active:scale-[0.98]
                        "
                    >

                        <ArrowLeft
                            className="
                                h-4
                                w-4
                            "
                        />

                        Back to jobs

                    </Link>

                </div>

            </div>
        );
    }


    const skills =
        Array.isArray(
            job.skills
        )
            ? job.skills
            : [];


    /* =====================================================
       MAIN UI
       ===================================================== */

    return (
        <div
            className="
                relative
                min-h-screen
                overflow-x-hidden
                bg-linear-to-br
                from-[#ECFCF7]
                via-[#FBFFFD]
                to-[#F1FFF5]
                text-[#292D35]
            "
        >

            <AnimatedBackground />


            {/* =================================================
                JOB HEADER
            ================================================= */}

            <section
                className="
                    relative
                    z-10
                    overflow-hidden
                    border-b
                    border-[#DDEBE4]
                    bg-white/35
                    backdrop-blur-[2px]
                "
            >

                <div
                    className="
                        pointer-events-none
                        absolute
                        left-1/2
                        top-6
                        h-72
                        w-[75%]
                        -translate-x-1/2
                        rounded-full
                        bg-[#D8FAEA]/45
                        blur-[105px]
                        animate-[pulse_8s_ease-in-out_infinite]
                    "
                />


                <div
                    className="
                        relative
                        mx-auto
                        max-w-7xl
                        px-4
                        pb-11
                        pt-8
                        sm:px-6
                        lg:px-8
                    "
                >

                    <Link
                        to="/jobs"
                        className="
                            inline-flex
                            items-center
                            gap-2
                            text-sm
                            font-medium
                            text-[#66736D]
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

                        Back to jobs

                    </Link>


                    <div
                        className="
                            mt-8
                            flex
                            flex-col
                            gap-6
                            lg:flex-row
                            lg:items-start
                            lg:justify-between
                        "
                    >

                        <div
                            className="
                                flex
                                min-w-0
                                items-start
                                gap-5
                            "
                        >

                            {/* COMPANY LOGO */}

                            {job.company_logo ? (

                                <div
                                    className="
                                        h-16
                                        w-16
                                        shrink-0
                                        overflow-hidden
                                        rounded-full
                                        border
                                        border-[#DCE8E2]
                                        bg-white
                                        shadow-sm
                                        sm:h-20
                                        sm:w-20
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
                                        h-16
                                        w-16
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-2xl
                                        bg-[#EAF7F1]
                                        text-[#278260]
                                        sm:h-20
                                        sm:w-20
                                    "
                                >

                                    <Building2
                                        className="
                                            h-7
                                            w-7
                                        "
                                    />

                                </div>

                            )}


                            <div
                                className="
                                    min-w-0
                                "
                            >

                                <div
                                    className="
                                        flex
                                        flex-wrap
                                        items-center
                                        gap-2.5
                                    "
                                >

                                    <p
                                        className="
                                            text-sm
                                            font-medium
                                            text-[#257D5D]
                                        "
                                    >
                                        {job.company}
                                    </p>


                                    <span
                                        className={`
                                            rounded-full
                                            border
                                            px-3
                                            py-1
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


                                <h1
                                    className="
                                        mt-2
                                        max-w-4xl
                                        font-sans
                                        text-[34px]
                                        font-semibold
                                        leading-[1.12]
                                        tracking-[-0.035em]
                                        text-[#171A1F]
                                        sm:text-[42px]
                                        lg:text-[46px]
                                    "
                                >
                                    {job.title}
                                </h1>


                                <div
                                    className="
                                        mt-4
                                        flex
                                        flex-wrap
                                        gap-x-5
                                        gap-y-2
                                        text-sm
                                        text-[#6D7973]
                                    "
                                >

                                    <span
                                        className="
                                            inline-flex
                                            items-center
                                            gap-1.5
                                        "
                                    >

                                        <MapPin
                                            className="
                                                h-4
                                                w-4
                                                text-[#278C69]
                                            "
                                        />

                                        {job.location}

                                    </span>


                                    <span
                                        className="
                                            inline-flex
                                            items-center
                                            gap-1.5
                                        "
                                    >

                                        <Clock3
                                            className="
                                                h-4
                                                w-4
                                                text-[#718079]
                                            "
                                        />

                                        {formatPostedDate(
                                            job.created_at
                                        )}

                                    </span>

                                </div>

                            </div>

                        </div>


                        {/* SAVE BUTTON */}

                        {isStudent && (

                            <button
                                type="button"
                                onClick={
                                    toggleSaveJob
                                }
                                className={`
                                    inline-flex
                                    min-h-11
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    border
                                    px-4
                                    text-sm
                                    font-medium
                                    transition-all
                                    duration-250
                                    ${
                                        isSaved
                                            ? "border-[#B9DEC9] bg-[#EAF7F0] text-[#087C40]"
                                            : "border-[#D8E5DF] bg-white/90 text-[#626D67] hover:border-[#A7D7C0] hover:bg-[#EFF9F4] hover:text-[#009944]"
                                    }
                                `}
                            >

                                {isSaved ? (
                                    <BookmarkCheck
                                        className="
                                            h-4
                                            w-4
                                        "
                                    />
                                ) : (
                                    <Bookmark
                                        className="
                                            h-4
                                            w-4
                                        "
                                    />
                                )}


                                {isSaved
                                    ? "Saved"
                                    : "Save job"}

                            </button>

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
                    lg:px-8
                "
            >

                <div
                    className="
                        grid
                        gap-8
                        lg:grid-cols-[minmax(0,1fr)_350px]
                    "
                >

                    {/* =================================================
                        LEFT
                    ================================================= */}

                    <div
                        className="
                            min-w-0
                            space-y-6
                        "
                    >

                        {/* SUMMARY */}

                        <div
                            className="
                                grid
                                gap-4
                                sm:grid-cols-2
                                xl:grid-cols-4
                            "
                        >

                            <InfoCard
                                icon={
                                    BriefcaseBusiness
                                }
                                label="Job type"
                                value={
                                    job.job_type
                                }
                                tone="blue"
                            />


                            <InfoCard
                                icon={
                                    GraduationCap
                                }
                                label="Experience"
                                value={
                                    job.experience
                                }
                                tone="purple"
                            />


                            <InfoCard
                                icon={
                                    MapPin
                                }
                                label="Location"
                                value={
                                    job.location
                                }
                                tone="green"
                            />


                            <InfoCard
                                icon={
                                    IndianRupee
                                }
                                label="Salary"
                                value={
                                    job.salary
                                }
                                tone="yellow"
                            />

                        </div>


                        {/* =================================================
                            DESCRIPTION
                        ================================================= */}

                        <section
                            className="
                                rounded-[22px]
                                border
                                border-[#DCE9E3]
                                bg-white/95
                                p-6
                                shadow-[0_8px_24px_rgba(25,70,52,0.04)]
                                backdrop-blur-sm
                                sm:p-8
                            "
                        >

                            <p
                                className="
                                    text-xs
                                    font-medium
                                    uppercase
                                    tracking-[0.13em]
                                    text-[#22815F]
                                "
                            >
                                Opportunity
                            </p>


                            <h2
                                className="
                                    mt-2
                                    font-sans
                                    text-[24px]
                                    font-semibold
                                    tracking-[-0.02em]
                                    text-[#252930]
                                "
                            >
                                Job Description
                            </h2>


                            <p
                                className="
                                    mt-5
                                    whitespace-pre-line
                                    border-t
                                    border-[#E9F0EC]
                                    pt-5
                                    text-[15px]
                                    leading-8
                                    text-[#626E68]
                                "
                            >
                                {job.description}
                            </p>

                        </section>


                        {/* =================================================
                            SKILLS
                        ================================================= */}

                        <section
                            className="
                                rounded-[22px]
                                border
                                border-[#DCE9E3]
                                bg-white/95
                                p-6
                                shadow-[0_8px_24px_rgba(25,70,52,0.04)]
                                backdrop-blur-sm
                                sm:p-8
                            "
                        >

                            <p
                                className="
                                    text-xs
                                    font-medium
                                    uppercase
                                    tracking-[0.13em]
                                    text-[#22815F]
                                "
                            >
                                Skills
                            </p>


                            <h2
                                className="
                                    mt-2
                                    font-sans
                                    text-[24px]
                                    font-semibold
                                    tracking-[-0.02em]
                                    text-[#252930]
                                "
                            >
                                Required Skills
                            </h2>


                            <p
                                className="
                                    mt-2
                                    text-sm
                                    text-[#78837D]
                                "
                            >
                                Skills and technologies
                                relevant to this role.
                            </p>


                            {skills.length >
                            0 ? (

                                <div
                                    className="
                                        mt-6
                                        flex
                                        flex-wrap
                                        gap-2
                                    "
                                >

                                    {skills.map(
                                        (
                                            skill,
                                            index
                                        ) => (

                                        <span
                                            key={`${job.id}-${skill}-${index}`}
                                            className="
                                                rounded-full
                                                border
                                                border-[#D8E8E1]
                                                bg-[#F3FAF6]
                                                px-3.5
                                                py-1.5
                                                text-sm
                                                font-normal
                                                text-[#5F6D66]
                                            "
                                        >
                                            {skill}
                                        </span>

                                        )
                                    )}

                                </div>

                            ) : (

                                <p
                                    className="
                                        mt-5
                                        text-sm
                                        text-[#858F89]
                                    "
                                >
                                    No specific skills
                                    listed.
                                </p>

                            )}

                        </section>


                        {/* =================================================
                            COMPANY
                        ================================================= */}

                        <section
                            className="
                                rounded-[22px]
                                border
                                border-[#DCE9E3]
                                bg-white/90
                                p-6
                                shadow-[0_8px_24px_rgba(25,70,52,0.035)]
                                backdrop-blur-sm
                                sm:p-8
                            "
                        >

                            <div
                                className="
                                    flex
                                    flex-col
                                    gap-5
                                    sm:flex-row
                                    sm:items-center
                                "
                            >

                                {job.company_logo ? (

                                    <div
                                        className="
                                            h-16
                                            w-16
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
                                            h-16
                                            w-16
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-2xl
                                            bg-[#EAF7F1]
                                            text-[#278260]
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


                                <div>

                                    <p
                                        className="
                                            text-xs
                                            uppercase
                                            tracking-[0.12em]
                                            text-[#7C8A83]
                                        "
                                    >
                                        Hiring company
                                    </p>


                                    <h3
                                        className="
                                            mt-1.5
                                            text-xl
                                            font-semibold
                                            text-[#292D35]
                                        "
                                    >
                                        {job.company}
                                    </h3>


                                    <p
                                        className="
                                            mt-2
                                            text-sm
                                            leading-6
                                            text-[#747F79]
                                        "
                                    >
                                        Review the role
                                        details carefully
                                        before applying.
                                    </p>

                                </div>

                            </div>

                        </section>

                    </div>


                    {/* =================================================
                        SIDEBAR
                    ================================================= */}

                    <aside
                        className="
                            lg:self-start
                        "
                    >

                        <div
                            className="
                                space-y-5
                                lg:sticky
                                lg:top-24
                            "
                        >

                            {/* ACTION CARD */}

                            <div
                                className="
                                    overflow-hidden
                                    rounded-[22px]
                                    border
                                    border-[#DCE8E2]
                                    bg-white/95
                                    shadow-[0_10px_28px_rgba(25,70,52,0.05)]
                                    backdrop-blur-xl
                                "
                            >

                                <div
                                    className="
                                        border-b
                                        border-[#E4EFE9]
                                        bg-linear-to-br
                                        from-[#F1FBF6]
                                        via-[#FBFEFC]
                                        to-[#F4FFF8]
                                        px-6
                                        py-5
                                    "
                                >

                                    <p
                                        className="
                                            text-xs
                                            uppercase
                                            tracking-[0.12em]
                                            text-[#26805F]
                                        "
                                    >
                                        Career opportunity
                                    </p>


                                    <h2
                                        className="
                                            mt-2
                                            text-xl
                                            font-semibold
                                            tracking-[-0.01em]
                                            text-[#292D34]
                                        "
                                    >
                                        Interested in
                                        this role?
                                    </h2>


                                    <p
                                        className="
                                            mt-2
                                            text-sm
                                            leading-6
                                            text-[#727D77]
                                        "
                                    >
                                        Review the role
                                        details and take
                                        the next step when
                                        you're ready.
                                    </p>

                                </div>


                                <div
                                    className="
                                        p-5
                                        sm:p-6
                                    "
                                >

                                    {/* =================================
                                        GUEST
                                    ================================= */}

                                    {!accessToken && (

                                        <Link
                                            to="/login"
                                            className="
                                                inline-flex
                                                min-h-12
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

                                            <LogIn
                                                className="
                                                    h-4
                                                    w-4
                                                "
                                            />

                                            Sign in to Apply

                                        </Link>

                                    )}


                                    {/* =================================
                                        STUDENT CAN APPLY
                                    ================================= */}

                                    {accessToken &&
                                        isStudent &&
                                        !alreadyApplied && (

                                        <div
                                            className="
                                                space-y-3
                                            "
                                        >

                                            <Link
                                                to={`/jobs/${job.id}/apply`}
                                                className="
                                                    inline-flex
                                                    min-h-12
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

                                                Apply Now

                                                <ArrowRight
                                                    className="
                                                        h-4
                                                        w-4
                                                    "
                                                />

                                            </Link>


                                            <button
                                                type="button"
                                                onClick={
                                                    toggleSaveJob
                                                }
                                                className="
                                                    inline-flex
                                                    min-h-11
                                                    w-full
                                                    items-center
                                                    justify-center
                                                    gap-2
                                                    rounded-xl
                                                    border
                                                    border-[#D9E7E0]
                                                    bg-white
                                                    px-5
                                                    text-sm
                                                    font-medium
                                                    text-[#626E68]
                                                    transition-all
                                                    duration-200
                                                    hover:border-[#A6D8BF]
                                                    hover:bg-[#EFF9F4]
                                                    hover:text-[#009944]
                                                "
                                            >

                                                {isSaved ? (
                                                    <BookmarkCheck
                                                        className="
                                                            h-4
                                                            w-4
                                                        "
                                                    />
                                                ) : (
                                                    <Bookmark
                                                        className="
                                                            h-4
                                                            w-4
                                                        "
                                                    />
                                                )}


                                                {isSaved
                                                    ? "Remove from saved"
                                                    : "Save for later"}

                                            </button>

                                        </div>

                                    )}


                                    {/* =================================
                                        ALREADY APPLIED
                                    ================================= */}

                                    {accessToken &&
                                        isStudent &&
                                        alreadyApplied && (

                                        <div>

                                            <div
                                                className="
                                                    rounded-xl
                                                    border
                                                    border-[#CAE4D7]
                                                    bg-[#EDF8F2]
                                                    p-4
                                                "
                                            >

                                                <div
                                                    className="
                                                        flex
                                                        gap-3
                                                    "
                                                >

                                                    <CheckCircle2
                                                        className="
                                                            mt-0.5
                                                            h-5
                                                            w-5
                                                            shrink-0
                                                            text-[#009944]
                                                        "
                                                    />


                                                    <div>

                                                        <p
                                                            className="
                                                                text-sm
                                                                font-medium
                                                                text-[#347053]
                                                            "
                                                        >
                                                            Application submitted
                                                        </p>


                                                        <p
                                                            className="
                                                                mt-1
                                                                text-xs
                                                                leading-5
                                                                text-[#6A8377]
                                                            "
                                                        >
                                                            Track the
                                                            application
                                                            from your
                                                            dashboard.
                                                        </p>

                                                    </div>

                                                </div>

                                            </div>


                                            <Link
                                                to="/dashboard"
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
                                                    transition-all
                                                    duration-300
                                                    hover:bg-[#009944]
                                                    active:scale-[0.98]
                                                "
                                            >

                                                View Application

                                                <ArrowRight
                                                    className="
                                                        h-4
                                                        w-4
                                                    "
                                                />

                                            </Link>

                                        </div>

                                    )}


                                    {/* =================================
                                        OWN RECRUITER JOB
                                    ================================= */}

                                    {accessToken &&
                                        isRecruiter &&
                                        isOwnJob && (

                                        <div
                                            className="
                                                space-y-3
                                            "
                                        >

                                            <div
                                                className="
                                                    rounded-xl
                                                    border
                                                    border-[#DCE8E2]
                                                    bg-[#F2F8F5]
                                                    p-4
                                                "
                                            >

                                                <div
                                                    className="
                                                        flex
                                                        gap-3
                                                    "
                                                >

                                                    <ShieldCheck
                                                        className="
                                                            mt-0.5
                                                            h-5
                                                            w-5
                                                            text-[#25805F]
                                                        "
                                                    />


                                                    <div>

                                                        <p
                                                            className="
                                                                text-sm
                                                                font-medium
                                                                text-[#466A5B]
                                                            "
                                                        >
                                                            Your Job Posting
                                                        </p>


                                                        <p
                                                            className="
                                                                mt-1
                                                                text-xs
                                                                leading-5
                                                                text-[#77877F]
                                                            "
                                                        >
                                                            You created
                                                            this role.
                                                        </p>

                                                    </div>

                                                </div>

                                            </div>


                                            <Link
                                                to={`/recruiter/jobs/${job.id}/edit`}
                                                className="
                                                    inline-flex
                                                    min-h-12
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
                                                    transition-all
                                                    duration-300
                                                    hover:bg-[#009944]
                                                    active:scale-[0.98]
                                                "
                                            >

                                                <Pencil
                                                    className="
                                                        h-4
                                                        w-4
                                                    "
                                                />

                                                Edit Job

                                            </Link>

                                        </div>

                                    )}


                                    {/* =================================
                                        OTHER RECRUITER
                                    ================================= */}

                                    {accessToken &&
                                        isRecruiter &&
                                        !isOwnJob && (

                                        <div
                                            className="
                                                rounded-xl
                                                border
                                                border-[#DCE8E2]
                                                bg-[#F5F9F7]
                                                p-4
                                            "
                                        >

                                            <div
                                                className="
                                                    flex
                                                    gap-3
                                                "
                                            >

                                                <ShieldCheck
                                                    className="
                                                        mt-0.5
                                                        h-5
                                                        w-5
                                                        text-[#708078]
                                                    "
                                                />


                                                <div>

                                                    <p
                                                        className="
                                                            text-sm
                                                            font-medium
                                                            text-[#5F6C66]
                                                        "
                                                    >
                                                        Recruiter View
                                                    </p>


                                                    <p
                                                        className="
                                                            mt-1
                                                            text-xs
                                                            leading-5
                                                            text-[#818C87]
                                                        "
                                                    >
                                                        Only the owner
                                                        can edit this job.
                                                    </p>

                                                </div>

                                            </div>

                                        </div>

                                    )}


                                    {/* BROWSE */}

                                    <Link
                                        to="/jobs"
                                        className="
                                            mt-4
                                            inline-flex
                                            min-h-11
                                            w-full
                                            items-center
                                            justify-center
                                            gap-2
                                            rounded-xl
                                            border
                                            border-[#D9E6DF]
                                            bg-white
                                            px-5
                                            text-sm
                                            font-medium
                                            text-[#626E68]
                                            transition-all
                                            duration-200
                                            hover:border-[#A9D9C1]
                                            hover:bg-[#EFF9F4]
                                            hover:text-[#009944]
                                        "
                                    >

                                        <ArrowLeft
                                            className="
                                                h-4
                                                w-4
                                            "
                                        />

                                        Browse More Jobs

                                    </Link>

                                </div>

                            </div>


                            {/* =================================================
                                OVERVIEW
                            ================================================= */}

                            <div
                                className="
                                    rounded-[22px]
                                    border
                                    border-[#DCE8E2]
                                    bg-white/95
                                    p-5
                                    shadow-[0_8px_24px_rgba(25,70,52,0.035)]
                                    backdrop-blur-sm
                                "
                            >

                                <h3
                                    className="
                                        text-base
                                        font-semibold
                                        text-[#30343B]
                                    "
                                >
                                    Job Overview
                                </h3>


                                <div
                                    className="
                                        mt-5
                                        space-y-5
                                    "
                                >

                                    <OverviewRow
                                        icon={
                                            CalendarDays
                                        }
                                        label="Posted"
                                        value={
                                            formatPostedDate(
                                                job.created_at
                                            )
                                        }
                                    />


                                    {typeof job.application_count ===
                                        "number" && (

                                        <OverviewRow
                                            icon={
                                                Users
                                            }
                                            label="Applications"
                                            value={`${job.application_count} received`}
                                        />

                                    )}


                                    <OverviewRow
                                        icon={
                                            Building2
                                        }
                                        label="Company"
                                        value={
                                            job.company
                                        }
                                    />

                                </div>

                            </div>

                        </div>

                    </aside>

                </div>

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
                    -left-24
                    top-20
                    h-96
                    w-96
                    rounded-full
                    bg-emerald-200
                    opacity-30
                    blur-3xl
                    animate-pulse
                "
            />

            <div
                className="
                    absolute
                    -right-24
                    top-1/3
                    h-96
                    w-96
                    rounded-full
                    bg-green-200
                    opacity-30
                    blur-3xl
                    animate-pulse
                "
            />

            <div
                className="
                    absolute
                    bottom-24
                    left-1/3
                    h-80
                    w-80
                    rounded-full
                    bg-teal-100
                    opacity-40
                    blur-3xl
                    animate-pulse
                "
            />
        </div>
    );
}

/* =========================================================
   INFO CARD
   ========================================================= */

function InfoCard({
    icon: Icon,
    label,
    value,
    tone,
}) {
    const styles = {
        blue: {
            bg:
                "bg-[#EEF7FB]",

            icon:
                "text-[#3684A5]",
        },

        purple: {
            bg:
                "bg-[#F5F3F7]",

            icon:
                "text-[#776F85]",
        },

        green: {
            bg:
                "bg-[#EAF8F1]",

            icon:
                "text-[#009944]",
        },

        yellow: {
            bg:
                "bg-[#FFF7E8]",

            icon:
                "text-[#9C7A48]",
        },
    };


    const style =
        styles[tone] ||
        styles.blue;


    return (
        <div
            className="
                rounded-[18px]
                border
                border-[#DCE8E2]
                bg-white/95
                p-5
                shadow-[0_6px_20px_rgba(25,70,52,0.03)]
                backdrop-blur-sm
            "
        >

            <div
                className={`
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-xl
                    ${style.bg}
                    ${style.icon}
                `}
            >

                <Icon
                    className="
                        h-4.5
                        w-4.5
                    "
                />

            </div>


            <p
                className="
                    mt-4
                    text-xs
                    uppercase
                    tracking-[0.09em]
                    text-[#858F8A]
                "
            >
                {label}
            </p>


            <p
                className="
                    mt-1.5
                    wrap-break-word
                    text-[15px]
                    font-medium
                    text-[#3C4149]
                "
            >
                {value ||
                    "Not specified"}
            </p>

        </div>
    );
}


/* =========================================================
   OVERVIEW ROW
   ========================================================= */

function OverviewRow({
    icon: Icon,
    label,
    value,
}) {
    return (
        <div
            className="
                flex
                items-start
                gap-3
            "
        >

            <div
                className="
                    mt-0.5
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-[#EEF7F2]
                    text-[#27805F]
                "
            >

                <Icon
                    className="
                        h-4
                        w-4
                    "
                />

            </div>


            <div
                className="
                    min-w-0
                "
            >

                <p
                    className="
                        text-xs
                        text-[#8B958F]
                    "
                >
                    {label}
                </p>


                <p
                    className="
                        mt-0.5
                        wrap-break-word
                        text-sm
                        font-medium
                        text-[#555F5A]
                    "
                >
                    {value}
                </p>

            </div>

        </div>
    );
}


export default JobDetails;