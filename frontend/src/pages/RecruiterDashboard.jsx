import {
    useEffect,
    useState,
} from "react";

import {
    Link,
} from "react-router-dom";

import {
    ArrowRight,
    BriefcaseBusiness,
    Building2,
    CalendarDays,
    CheckCircle2,
    Clock3,
    FileText,
    Mail,
    MapPin,
    Pencil,
    Search,
    Trash2,
    UserRoundSearch,
    Users,
} from "lucide-react";

import { apiFetch } from "../api";


/* =========================================================
   HELPERS
   ========================================================= */

function formatDate(value) {
    if (!value) {
        return "Not available";
    }

    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "Not available";
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


function getStatusClasses(status) {
    switch (status) {
        case "Accepted":
            return (
                "border-[#CAE6D7] " +
                "bg-[#EFF9F4] " +
                "text-[#27704F]"
            );

        case "Rejected":
            return (
                "border-[#EAD7D7] " +
                "bg-[#FFF5F5] " +
                "text-[#975D5D]"
            );

        case "Shortlisted":
            return (
                "border-[#D8E7DF] " +
                "bg-[#F0F8F4] " +
                "text-[#337458]"
            );

        case "On Hold":
            return (
                "border-[#EFE0C6] " +
                "bg-[#FFF8EC] " +
                "text-[#946C37]"
            );

        case "Under Review":
            return (
                "border-[#EEE1BF] " +
                "bg-[#FFF9EB] " +
                "text-[#96723C]"
            );

        case "Withdrawn":
            return (
                "border-[#E0E3E1] " +
                "bg-[#F5F6F5] " +
                "text-[#737B77]"
            );

        case "Applied":
        default:
            return (
                "border-[#D8E5EF] " +
                "bg-[#F2F7FA] " +
                "text-[#55718A]"
            );
    }
}


/* =========================================================
   RECRUITER DASHBOARD
   ========================================================= */

function RecruiterDashboard() {
    const [
        jobs,
        setJobs,
    ] = useState([]);

    const [
        applications,
        setApplications,
    ] = useState([]);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        applicationsLoading,
        setApplicationsLoading,
    ] = useState(true);

    const [
        error,
        setError,
    ] = useState("");

    const [
        applicationError,
        setApplicationError,
    ] = useState("");

    const [
        updatingApplication,
        setUpdatingApplication,
    ] = useState(null);


    useEffect(() => {
        fetchJobs();
        fetchApplications();
    }, []);


    /* =====================================================
       FETCH JOBS
       ===================================================== */

    const fetchJobs =
        async () => {

            try {
                setLoading(true);
                setError("");

                const response =
                    await apiFetch(
                        "/recruiter/jobs/"
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
                    "Recruiter jobs error:",
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


    /* =====================================================
       FETCH APPLICATIONS
       ===================================================== */

    const fetchApplications =
        async () => {

            try {
                setApplicationsLoading(
                    true
                );

                setApplicationError("");

                const response =
                    await apiFetch(
                        "/recruiter/applications/"
                    );

                const data =
                    await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.detail ||
                        "Unable to load applications."
                    );
                }

                setApplications(
                    Array.isArray(data)
                        ? data
                        : data.results || []
                );

            } catch (error) {
                console.error(
                    "Recruiter applications error:",
                    error
                );

                if (
                    error.message ===
                    "SESSION_EXPIRED"
                ) {
                    setApplicationError(
                        "Your session has expired. Please login again."
                    );

                } else {
                    setApplicationError(
                        error.message ||
                        "Unable to load applications."
                    );
                }

            } finally {
                setApplicationsLoading(
                    false
                );
            }
        };


    /* =====================================================
       DELETE JOB
       ===================================================== */

    const handleDeleteJob =
        async (jobId) => {

            const confirmed =
                window.confirm(
                    "Are you sure you want to delete this job?"
                );

            if (!confirmed) {
                return;
            }


            try {
                setError("");

                const response =
                    await apiFetch(
                        `/jobs/${jobId}/`,
                        {
                            method:
                                "DELETE",
                        }
                    );


                if (!response.ok) {
                    const data =
                        await response.json();

                    throw new Error(
                        data.detail ||
                        "Unable to delete job."
                    );
                }


                setJobs(
                    (currentJobs) =>
                        currentJobs.filter(
                            (job) =>
                                Number(
                                    job.id
                                ) !==
                                Number(
                                    jobId
                                )
                        )
                );


                setApplications(
                    (
                        currentApplications
                    ) =>
                        currentApplications.filter(
                            (
                                application
                            ) =>
                                Number(
                                    application.job
                                ) !==
                                Number(
                                    jobId
                                )
                        )
                );

            } catch (error) {
                console.error(
                    "Delete job error:",
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
                        "Unable to delete job."
                    );
                }
            }
        };


    /* =====================================================
       APPLICATION STATUS
       ===================================================== */

    const handleApplicationStatus =
        async (
            applicationId,
            newStatus
        ) => {

            if (
                newStatus ===
                "Withdrawn"
            ) {
                return;
            }


            try {
                setUpdatingApplication(
                    applicationId
                );

                setApplicationError("");


                const response =
                    await apiFetch(
                        `/recruiter/applications/${applicationId}/`,
                        {
                            method:
                                "PATCH",

                            headers: {
                                "Content-Type":
                                    "application/json",
                            },

                            body:
                                JSON.stringify(
                                    {
                                        status:
                                            newStatus,
                                    }
                                ),
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {
                    throw new Error(
                        data.detail ||
                        "Unable to update application status."
                    );
                }


                setApplications(
                    (
                        currentApplications
                    ) =>
                        currentApplications.map(
                            (
                                application
                            ) =>
                                application.id ===
                                applicationId
                                    ? {
                                          ...application,
                                          status:
                                              data.status,
                                      }
                                    : application
                        )
                );

            } catch (error) {
                console.error(
                    "Application status error:",
                    error
                );

                if (
                    error.message ===
                    "SESSION_EXPIRED"
                ) {
                    setApplicationError(
                        "Your session has expired. Please login again."
                    );

                } else {
                    setApplicationError(
                        error.message ||
                        "Unable to update application status."
                    );
                }

            } finally {
                setUpdatingApplication(
                    null
                );
            }
        };


    /* =====================================================
       STATISTICS
       ===================================================== */

    const totalApplicants =
        applications.length;


    const pendingApplicants =
        applications.filter(
            (application) =>
                application.status ===
                    "Applied" ||
                application.status ===
                    "Under Review"
        ).length;


    const shortlistedApplicants =
        applications.filter(
            (application) =>
                application.status ===
                "Shortlisted"
        ).length;


    const acceptedApplicants =
        applications.filter(
            (application) =>
                application.status ===
                "Accepted"
        ).length;


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
                    bg-gradient-to-br
                    from-[#ECFCF7]
                    via-[#FBFFFD]
                    to-[#F1FFF5]
                    px-4
                    py-12
                "
            >

                <AnimatedBackground />


                <div
                    className="
                        relative
                        z-10
                        mx-auto
                        max-w-7xl
                    "
                >

                    <div
                        className="
                            animate-pulse
                            rounded-[24px]
                            border
                            border-[#DCE8E2]
                            bg-white/95
                            p-7
                        "
                    >

                        <div
                            className="
                                h-8
                                w-64
                                rounded
                                bg-[#E3ECE8]
                            "
                        />

                        <div
                            className="
                                mt-4
                                h-4
                                w-96
                                max-w-full
                                rounded
                                bg-[#EDF3F0]
                            "
                        />

                    </div>


                    <div
                        className="
                            mt-7
                            grid
                            gap-4
                            sm:grid-cols-2
                            xl:grid-cols-5
                        "
                    >

                        {[1, 2, 3, 4, 5].map(
                            (item) => (

                            <div
                                key={item}
                                className="
                                    h-32
                                    animate-pulse
                                    rounded-[20px]
                                    border
                                    border-[#DCE8E2]
                                    bg-white/95
                                "
                            />

                            )
                        )}

                    </div>

                </div>

            </div>
        );
    }


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
                        w-[72%]
                        -translate-x-1/2
                        rounded-full
                        bg-[#D5F9E8]/50
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

                    <div
                        className="
                            flex
                            flex-col
                            gap-6
                            lg:flex-row
                            lg:items-end
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
                                    font-medium
                                    uppercase
                                    tracking-[0.16em]
                                    text-[#16825D]
                                "
                            >
                                Recruiter Workspace
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
                                    sm:text-[44px]
                                "
                            >
                                Recruiter Dashboard
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
                                Manage your job
                                postings, review
                                applicants and move
                                candidates through your
                                hiring process.
                            </p>

                        </div>


                        <div
                            className="
                                flex
                                flex-wrap
                                gap-3
                            "
                        >

                            <Link
                                to="/recruiter/talent"
                                className="
                                    inline-flex
                                    min-h-11
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    border
                                    border-[#D4E5DC]
                                    bg-white/90
                                    px-5
                                    text-sm
                                    font-medium
                                    text-[#606D66]
                                    transition-all
                                    duration-200
                                    hover:border-[#A8D8C0]
                                    hover:bg-[#F0FAF5]
                                    hover:text-[#009944]
                                "
                            >

                                <Search
                                    className="
                                        h-4
                                        w-4
                                    "
                                />

                                Find Talent

                            </Link>


                            <Link
                                to="/recruiter/jobs/new"
                                className="
                                    inline-flex
                                    min-h-11
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
                                    hover:-translate-y-0.5
                                    hover:bg-[#009944]
                                    hover:shadow-[0_8px_20px_rgba(0,153,68,0.18)]
                                    active:translate-y-0
                                    active:scale-[0.98]
                                "
                            >

                                <BriefcaseBusiness
                                    className="
                                        h-4
                                        w-4
                                    "
                                />

                                Post a Job

                            </Link>

                        </div>

                    </div>

                </div>

            </section>


            {/* =================================================
                MAIN
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

                {/* ERROR */}

                {error && (

                    <div
                        className="
                            mb-6
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
                    STATISTICS
                ================================================= */}

                <section
                    className="
                        grid
                        gap-4
                        sm:grid-cols-2
                        lg:grid-cols-3
                        xl:grid-cols-5
                    "
                >

                    <StatCard
                        icon={
                            BriefcaseBusiness
                        }
                        label="Total Jobs"
                        value={
                            jobs.length
                        }
                        tone="blue"
                    />


                    <StatCard
                        icon={
                            Users
                        }
                        label="Applicants"
                        value={
                            totalApplicants
                        }
                        tone="green"
                    />


                    <StatCard
                        icon={
                            Clock3
                        }
                        label="Pending Review"
                        value={
                            pendingApplicants
                        }
                        tone="cream"
                    />


                    <StatCard
                        icon={
                            UserRoundSearch
                        }
                        label="Shortlisted"
                        value={
                            shortlistedApplicants
                        }
                        tone="purple"
                    />


                    <StatCard
                        icon={
                            CheckCircle2
                        }
                        label="Accepted"
                        value={
                            acceptedApplicants
                        }
                        tone="emerald"
                    />

                </section>


                {/* =================================================
                    JOB POSTINGS
                ================================================= */}

                <section
                    className="
                        mt-10
                    "
                >

                    <SectionHeader
                        eyebrow="Job Management"
                        title="My Job Postings"
                        description="Manage opportunities published from your recruiter account."
                        count={
                            jobs.length
                        }
                    />


                    {jobs.length ===
                    0 ? (

                        <EmptyState
                            icon={
                                BriefcaseBusiness
                            }
                            title="No jobs posted yet"
                            description="Create your first job posting and start receiving applications."
                            buttonText="Post a Job"
                            buttonTo="/recruiter/jobs/new"
                        />

                    ) : (

                        <div
                            className="
                                mt-6
                                grid
                                gap-5
                                lg:grid-cols-2
                            "
                        >

                            {jobs.map(
                                (job) => (

                                <JobCard
                                    key={
                                        job.id
                                    }
                                    job={
                                        job
                                    }
                                    onDelete={() =>
                                        handleDeleteJob(
                                            job.id
                                        )
                                    }
                                />

                                )
                            )}

                        </div>

                    )}

                </section>


                {/* =================================================
                    APPLICATIONS
                ================================================= */}

                <section
                    className="
                        mt-14
                    "
                >

                    <SectionHeader
                        eyebrow="Hiring Pipeline"
                        title="Candidate Applications"
                        description="Review candidates and update each application's hiring status."
                        count={
                            applications.length
                        }
                    />


                    {applicationError && (

                        <div
                            className="
                                mt-5
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
                            {applicationError}
                        </div>

                    )}


                    {applicationsLoading ? (

                        <div
                            className="
                                mt-6
                                space-y-5
                            "
                        >

                            {[1, 2, 3].map(
                                (item) => (

                                <div
                                    key={item}
                                    className="
                                        h-64
                                        animate-pulse
                                        rounded-[22px]
                                        border
                                        border-[#DCE8E2]
                                        bg-white/95
                                    "
                                />

                                )
                            )}

                        </div>


                    ) : applications.length ===
                        0 ? (

                        <EmptyState
                            icon={
                                FileText
                            }
                            title="No applications yet"
                            description="Candidate applications for your posted jobs will appear here."
                        />


                    ) : (

                        <div
                            className="
                                mt-6
                                space-y-5
                            "
                        >

                            {applications.map(
                                (
                                    application
                                ) => (

                                <ApplicationCard
                                    key={
                                        application.id
                                    }
                                    application={
                                        application
                                    }
                                    updating={
                                        updatingApplication ===
                                        application.id
                                    }
                                    onStatusChange={(
                                        status
                                    ) =>
                                        handleApplicationStatus(
                                            application.id,
                                            status
                                        )
                                    }
                                />

                                )
                            )}

                        </div>

                    )}

                </section>

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
   STAT CARD
   ========================================================= */

function StatCard({
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
                "text-[#3384A7]",
        },

        green: {
            bg:
                "bg-[#EAF8F1]",

            icon:
                "text-[#16845C]",
        },

        cream: {
            bg:
                "bg-[#FFF7E8]",

            icon:
                "text-[#9B7947]",
        },

        purple: {
            bg:
                "bg-[#F5F3F7]",

            icon:
                "text-[#776F86]",
        },

        emerald: {
            bg:
                "bg-[#E9F8F0]",

            icon:
                "text-[#009944]",
        },
    };


    const style =
        styles[tone] ||
        styles.blue;


    return (
        <div
            className="
                rounded-[20px]
                border
                border-[#DCE8E2]
                bg-white/95
                p-5
                shadow-[0_7px_22px_rgba(25,70,52,0.035)]
                backdrop-blur-sm
                transition-all
                duration-250
                hover:-translate-y-0.5
                hover:border-[#B9DAC9]
                hover:shadow-[0_12px_28px_rgba(25,70,52,0.07)]
            "
        >

            <div
                className={`
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    ${style.bg}
                    ${style.icon}
                `}
            >

                <Icon
                    className="
                        h-[19px]
                        w-[19px]
                    "
                />

            </div>


            <p
                className="
                    mt-5
                    text-sm
                    text-[#707C76]
                "
            >
                {label}
            </p>


            <p
                className="
                    mt-1
                    text-[30px]
                    font-semibold
                    tracking-[-0.03em]
                    text-[#282C34]
                "
            >
                {value}
            </p>

        </div>
    );
}


/* =========================================================
   SECTION HEADER
   ========================================================= */

function SectionHeader({
    eyebrow,
    title,
    description,
    count,
}) {
    return (
        <div
            className="
                flex
                flex-col
                gap-3
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
                        tracking-[0.14em]
                        text-[#27825F]
                    "
                >
                    {eyebrow}
                </p>


                <h2
                    className="
                        mt-2
                        text-[27px]
                        font-semibold
                        tracking-[-0.025em]
                        text-[#24282F]
                    "
                >
                    {title}
                </h2>


                <p
                    className="
                        mt-2
                        text-sm
                        leading-6
                        text-[#717D77]
                    "
                >
                    {description}
                </p>

            </div>


            <span
                className="
                    self-start
                    rounded-full
                    border
                    border-[#D4E5DC]
                    bg-white/90
                    px-3
                    py-1.5
                    text-xs
                    text-[#626F68]
                    sm:self-auto
                "
            >
                {count}{" "}
                {count === 1
                    ? "item"
                    : "items"}
            </span>

        </div>
    );
}


/* =========================================================
   JOB CARD
   ========================================================= */

function JobCard({
    job,
    onDelete,
}) {
    return (
        <article
            className="
                rounded-[22px]
                border
                border-[#DCE8E2]
                bg-white/95
                p-5
                shadow-[0_8px_24px_rgba(25,70,52,0.04)]
                backdrop-blur-sm
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:border-[#B9DAC9]
                hover:shadow-[0_14px_30px_rgba(25,70,52,0.07)]
                sm:p-6
            "
        >

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
                        flex-1
                    "
                >

                    <h3
                        className="
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
                            text-sm
                            font-medium
                            text-[#606D66]
                        "
                    >
                        {job.company}
                    </p>

                </div>

            </div>


            <div
                className="
                    mt-5
                    grid
                    gap-3
                    rounded-xl
                    border
                    border-[#E7F0EB]
                    bg-[#F7FCF9]
                    p-4
                    sm:grid-cols-2
                "
            >

                <Meta
                    icon={
                        MapPin
                    }
                    value={
                        job.location
                    }
                />


                <Meta
                    icon={
                        BriefcaseBusiness
                    }
                    value={
                        job.job_type
                    }
                />


                <Meta
                    icon={
                        Clock3
                    }
                    value={
                        job.experience
                    }
                />


                <Meta
                    icon={
                        Users
                    }
                    value={`${job.application_count || 0} ${
                        job.application_count ===
                        1
                            ? "applicant"
                            : "applicants"
                    }`}
                />

            </div>


            <div
                className="
                    mt-5
                    flex
                    flex-wrap
                    gap-3
                    border-t
                    border-[#E7EFEB]
                    pt-5
                "
            >

                <Link
                    to={`/jobs/${job.id}`}
                    className="
                        inline-flex
                        min-h-10
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        border
                        border-[#D5E5DD]
                        bg-white
                        px-4
                        text-sm
                        font-medium
                        text-[#606D66]
                        transition-all
                        duration-200
                        hover:border-[#A8D8C0]
                        hover:bg-[#F0FAF5]
                        hover:text-[#009944]
                    "
                >
                    View
                </Link>


                <Link
                    to={`/recruiter/jobs/${job.id}/edit`}
                    className="
                        inline-flex
                        min-h-10
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-[#0D99FF]
                        px-4
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

                    Edit

                </Link>


                <button
                    type="button"
                    onClick={
                        onDelete
                    }
                    className="
                        inline-flex
                        min-h-10
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        border
                        border-[#E8DADA]
                        bg-white
                        px-4
                        text-sm
                        font-medium
                        text-[#9A5D5D]
                        transition-all
                        duration-200
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

                    Delete

                </button>

            </div>

        </article>
    );
}


/* =========================================================
   APPLICATION CARD
   ========================================================= */

function ApplicationCard({
    application,
    updating,
    onStatusChange,
}) {
    return (
        <article
            className="
                rounded-[22px]
                border
                border-[#DCE8E2]
                bg-white/95
                p-5
                shadow-[0_8px_24px_rgba(25,70,52,0.04)]
                backdrop-blur-sm
                sm:p-6
            "
        >

            <div
                className="
                    flex
                    flex-col
                    gap-6
                    xl:flex-row
                    xl:items-start
                    xl:justify-between
                "
            >

                {/* Candidate */}

                <div
                    className="
                        min-w-0
                        flex-1
                    "
                >

                    <div
                        className="
                            flex
                            flex-col
                            gap-4
                            sm:flex-row
                            sm:items-start
                            sm:justify-between
                        "
                    >

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
                                    gap-3
                                "
                            >

                                <h3
                                    className="
                                        text-[19px]
                                        font-semibold
                                        tracking-[-0.015em]
                                        text-[#282C34]
                                    "
                                >
                                    {application.full_name}
                                </h3>


                                <StatusBadge
                                    status={
                                        application.status
                                    }
                                />

                            </div>


                            <p
                                className="
                                    mt-1
                                    break-all
                                    text-sm
                                    text-[#65716B]
                                "
                            >
                                {application.email}
                            </p>


                            {application.phone && (

                                <p
                                    className="
                                        mt-2
                                        text-sm
                                        text-[#78837D]
                                    "
                                >
                                    {application.phone}
                                </p>

                            )}


                            <p
                                className="
                                    mt-3
                                    text-sm
                                    text-[#78837D]
                                "
                            >
                                Applied for{" "}

                                <span
                                    className="
                                        font-medium
                                        text-[#44514B]
                                    "
                                >
                                    {application.job_title}
                                </span>
                            </p>


                            <p
                                className="
                                    mt-1
                                    inline-flex
                                    items-center
                                    gap-1.5
                                    text-xs
                                    text-[#8A958F]
                                "
                            >

                                <CalendarDays
                                    className="
                                        h-3.5
                                        w-3.5
                                    "
                                />

                                {formatDate(
                                    application.applied_at
                                )}

                            </p>

                        </div>


                        {application.applicant_profile_id ? (

                            <Link
                                to={`/recruiter/talent/${application.applicant_profile_id}`}
                                className="
                                    inline-flex
                                    min-h-10
                                    shrink-0
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    bg-[#0D99FF]
                                    px-4
                                    text-sm
                                    font-medium
                                    text-white
                                    transition-all
                                    duration-300
                                    hover:bg-[#009944]
                                    active:scale-[0.98]
                                "
                            >

                                View Profile

                                <ArrowRight
                                    className="
                                        h-4
                                        w-4
                                    "
                                />

                            </Link>

                        ) : (

                            <span
                                className="
                                    inline-flex
                                    min-h-10
                                    shrink-0
                                    items-center
                                    rounded-xl
                                    bg-[#F2F5F3]
                                    px-4
                                    text-sm
                                    text-[#7C8781]
                                "
                            >
                                Profile unavailable
                            </span>

                        )}

                    </div>

                </div>


                {/* Status control */}

                <div
                    className="
                        flex
                        w-full
                        flex-col
                        gap-2
                        sm:w-auto
                        xl:min-w-[190px]
                    "
                >

                    {application.status !==
                    "Withdrawn" ? (

                        <>
                            <label
                                className="
                                    text-xs
                                    font-medium
                                    uppercase
                                    tracking-[0.09em]
                                    text-[#7C8781]
                                "
                            >
                                Update status
                            </label>


                            <select
                                value={
                                    application.status
                                }
                                disabled={
                                    updating
                                }
                                onChange={(
                                    event
                                ) =>
                                    onStatusChange(
                                        event
                                            .target
                                            .value
                                    )
                                }
                                className="
                                    min-h-11
                                    w-full
                                    rounded-xl
                                    border
                                    border-[#D5E3DC]
                                    bg-white
                                    px-3
                                    text-sm
                                    font-medium
                                    text-[#56625C]
                                    outline-none
                                    transition-all
                                    focus:border-[#0D99FF]
                                    focus:ring-4
                                    focus:ring-[#0D99FF]/10
                                    disabled:cursor-not-allowed
                                    disabled:bg-[#F3F5F4]
                                "
                            >

                                <option value="Applied">
                                    Applied
                                </option>

                                <option value="Under Review">
                                    Under Review
                                </option>

                                <option value="Shortlisted">
                                    Shortlisted
                                </option>

                                <option value="On Hold">
                                    On Hold
                                </option>

                                <option value="Accepted">
                                    Accepted
                                </option>

                                <option value="Rejected">
                                    Rejected
                                </option>

                            </select>


                            {updating && (

                                <span
                                    className="
                                        text-xs
                                        font-medium
                                        text-[#0D99FF]
                                    "
                                >
                                    Updating...
                                </span>

                            )}

                        </>

                    ) : (

                        <div
                            className="
                                rounded-xl
                                border
                                border-[#E0E4E2]
                                bg-[#F5F6F5]
                                px-4
                                py-3
                                text-sm
                                text-[#737D78]
                            "
                        >
                            Withdrawn by candidate
                        </div>

                    )}

                </div>

            </div>


            {/* =================================================
                DETAILS
            ================================================= */}

            <div
                className="
                    mt-6
                    grid
                    gap-4
                    md:grid-cols-3
                "
            >

                <DetailCard
                    label="Candidate"
                    icon={
                        Mail
                    }
                >
                    <p
                        className="
                            text-sm
                            font-medium
                            text-[#414B46]
                        "
                    >
                        {application.full_name}
                    </p>

                    <p
                        className="
                            mt-1
                            break-all
                            text-sm
                            text-[#727E78]
                        "
                    >
                        {application.email}
                    </p>
                </DetailCard>


                <DetailCard
                    label="Position"
                    icon={
                        BriefcaseBusiness
                    }
                >
                    <p
                        className="
                            text-sm
                            font-medium
                            text-[#414B46]
                        "
                    >
                        {application.job_title}
                    </p>

                    <p
                        className="
                            mt-1
                            text-sm
                            text-[#727E78]
                        "
                    >
                        {application.company}
                    </p>
                </DetailCard>


                <DetailCard
                    label="Application"
                    icon={
                        Clock3
                    }
                >
                    <StatusBadge
                        status={
                            application.status
                        }
                    />

                    <p
                        className="
                            mt-2
                            text-sm
                            text-[#727E78]
                        "
                    >
                        Submitted{" "}
                        {formatDate(
                            application.applied_at
                        )}
                    </p>
                </DetailCard>

            </div>


            {/* COVER LETTER */}

            {application.cover_letter && (

                <div
                    className="
                        mt-5
                        rounded-xl
                        border
                        border-[#DFEBE5]
                        bg-[#F7FBF9]
                        p-4
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                            text-xs
                            font-medium
                            uppercase
                            tracking-[0.1em]
                            text-[#26805F]
                        "
                    >

                        <FileText
                            className="
                                h-4
                                w-4
                            "
                        />

                        Cover Letter

                    </div>


                    <p
                        className="
                            mt-3
                            whitespace-pre-line
                            text-sm
                            leading-7
                            text-[#5F6B65]
                        "
                    >
                        {application.cover_letter}
                    </p>

                </div>

            )}

        </article>
    );
}


/* =========================================================
   STATUS
   ========================================================= */

function StatusBadge({
    status,
}) {
    return (
        <span
            className={`
                inline-flex
                rounded-full
                border
                px-3
                py-1
                text-xs
                font-medium
                ${getStatusClasses(
                    status
                )}
            `}
        >
            {status}
        </span>
    );
}


/* =========================================================
   DETAIL CARD
   ========================================================= */

function DetailCard({
    icon: Icon,
    label,
    children,
}) {
    return (
        <div
            className="
                rounded-xl
                border
                border-[#E2ECE7]
                bg-[#F8FCFA]
                p-4
            "
        >

            <div
                className="
                    mb-3
                    flex
                    items-center
                    gap-2
                "
            >

                <Icon
                    className="
                        h-4
                        w-4
                        text-[#27815F]
                    "
                />

                <p
                    className="
                        text-xs
                        font-medium
                        uppercase
                        tracking-[0.09em]
                        text-[#7F8984]
                    "
                >
                    {label}
                </p>

            </div>


            {children}

        </div>
    );
}


/* =========================================================
   META
   ========================================================= */

function Meta({
    icon: Icon,
    value,
}) {
    return (
        <div
            className="
                flex
                min-w-0
                items-center
                gap-2
                text-sm
                text-[#64716A]
            "
        >

            <Icon
                className="
                    h-4
                    w-4
                    shrink-0
                    text-[#27815F]
                "
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


/* =========================================================
   EMPTY STATE
   ========================================================= */

function EmptyState({
    icon: Icon,
    title,
    description,
    buttonText,
    buttonTo,
}) {
    return (
        <div
            className="
                mt-6
                rounded-[22px]
                border
                border-[#DCE8E2]
                bg-white/95
                px-6
                py-12
                text-center
                shadow-[0_8px_24px_rgba(25,70,52,0.035)]
                backdrop-blur-sm
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
                    bg-[#EAF7F1]
                    text-[#27815F]
                "
            >

                <Icon
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
                {title}
            </h3>


            <p
                className="
                    mx-auto
                    mt-2
                    max-w-md
                    text-sm
                    leading-6
                    text-[#737E78]
                "
            >
                {description}
            </p>


            {buttonText &&
                buttonTo && (

                <Link
                    to={
                        buttonTo
                    }
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
                        hover:bg-[#009944]
                        active:scale-[0.98]
                    "
                >

                    {buttonText}

                    <ArrowRight
                        className="
                            h-4
                            w-4
                        "
                    />

                </Link>

            )}

        </div>
    );
}


export default RecruiterDashboard;