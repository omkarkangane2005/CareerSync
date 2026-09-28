import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Link,
} from "react-router-dom";

import {
    ArrowRight,
    Bookmark,
    BriefcaseBusiness,
    Building2,
    CalendarDays,
    Check,
    CheckCircle2,
    Clock3,
    ExternalLink,
    FileText,
    Mail,
    MessageSquareText,
    Search,
    Sparkles,
    Trash2,
    UserRoundSearch,
    X,
} from "lucide-react";

import { apiFetch } from "../api";


/* =========================================================
   SAVED JOB COUNT
   ========================================================= */

function getSavedJobsCount() {
    try {
        const stored =
            localStorage.getItem(
                "savedJobs"
            );

        if (!stored) {
            return 0;
        }

        const parsed =
            JSON.parse(stored);

        if (!Array.isArray(parsed)) {
            return 0;
        }

        return new Set(
            parsed
                .map(Number)
                .filter(
                    (id) =>
                        Number.isInteger(id) &&
                        id > 0
                )
        ).size;

    } catch {
        return 0;
    }
}


/* =========================================================
   DATE
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


/* =========================================================
   DASHBOARD
   ========================================================= */

function Dashboard() {
    const [
        applications,
        setApplications,
    ] = useState([]);

    const [
        invitations,
        setInvitations,
    ] = useState([]);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        invitationLoading,
        setInvitationLoading,
    ] = useState(true);

    const [
        error,
        setError,
    ] = useState("");

    const [
        invitationError,
        setInvitationError,
    ] = useState("");

    const [
        statusUpdating,
        setStatusUpdating,
    ] = useState(null);

    const [
        withdrawing,
        setWithdrawing,
    ] = useState(null);


    const savedJobsCount =
        getSavedJobsCount();


    /* =====================================================
       INITIAL LOAD
       ===================================================== */

    useEffect(() => {
        fetchApplications();
        fetchInvitations();
    }, []);


    /* =====================================================
       APPLICATIONS
       ===================================================== */

    const fetchApplications =
        async () => {

            try {
                setLoading(true);
                setError("");


                const response =
                    await apiFetch(
                        "/applications/"
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
                    "Applications fetch error:",
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
                        "Unable to load applications."
                    );
                }

            } finally {
                setLoading(false);
            }
        };


    /* =====================================================
       INVITATIONS
       ===================================================== */

    const fetchInvitations =
        async () => {

            try {
                setInvitationLoading(
                    true
                );

                setInvitationError("");


                const response =
                    await apiFetch(
                        "/invitations/received/"
                    );


                const data =
                    await response.json();


                if (!response.ok) {
                    throw new Error(
                        data.detail ||
                        "Unable to load invitations."
                    );
                }


                setInvitations(
                    Array.isArray(data)
                        ? data
                        : data.results || []
                );

            } catch (error) {
                console.error(
                    "Invitations fetch error:",
                    error
                );


                if (
                    error.message ===
                    "SESSION_EXPIRED"
                ) {
                    setInvitationError(
                        "Your session has expired. Please login again."
                    );

                } else {
                    setInvitationError(
                        error.message ||
                        "Unable to load invitations."
                    );
                }

            } finally {
                setInvitationLoading(
                    false
                );
            }
        };


    /* =====================================================
       ACCEPT / REJECT INVITATION
       ===================================================== */

    const updateInvitationStatus =
        async (
            invitationId,
            newStatus
        ) => {

            try {
                setStatusUpdating(
                    invitationId
                );

                setInvitationError("");


                const response =
                    await apiFetch(
                        `/invitations/${invitationId}/status/`,
                        {
                            method: "PATCH",

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
                        "Unable to update invitation."
                    );
                }


                setInvitations(
                    (current) =>
                        current.map(
                            (
                                invitation
                            ) =>
                                invitation.id ===
                                invitationId
                                    ? data
                                    : invitation
                        )
                );

            } catch (error) {
                console.error(
                    "Invitation status error:",
                    error
                );


                if (
                    error.message ===
                    "SESSION_EXPIRED"
                ) {
                    setInvitationError(
                        "Your session has expired. Please login again."
                    );

                } else {
                    setInvitationError(
                        error.message ||
                        "Unable to update invitation."
                    );
                }

            } finally {
                setStatusUpdating(null);
            }
        };


    /* =====================================================
       WITHDRAW APPLICATION
       ===================================================== */

    const withdrawApplication =
        async (
            applicationId
        ) => {

            const confirmed =
                window.confirm(
                    "Are you sure you want to withdraw this application?"
                );


            if (!confirmed) {
                return;
            }


            try {
                setWithdrawing(
                    applicationId
                );

                setError("");


                const response =
                    await apiFetch(
                        `/applications/${applicationId}/withdraw/`,
                        {
                            method: "PATCH",

                            headers: {
                                "Content-Type":
                                    "application/json",
                            },
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {
                    throw new Error(
                        data.detail ||
                        "Unable to withdraw application."
                    );
                }


                setApplications(
                    (current) =>
                        current.map(
                            (
                                application
                            ) =>
                                application.id ===
                                applicationId
                                    ? data
                                    : application
                        )
                );

            } catch (error) {
                console.error(
                    "Withdraw application error:",
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
                        "Unable to withdraw application."
                    );
                }

            } finally {
                setWithdrawing(null);
            }
        };


    /* =====================================================
       COUNTS
       ===================================================== */

    const pendingInvitations =
        useMemo(
            () =>
                invitations.filter(
                    (invitation) =>
                        invitation.status ===
                        "Pending"
                ).length,
            [invitations]
        );


    const shortlistedApplications =
        useMemo(
            () =>
                applications.filter(
                    (application) =>
                        application.status ===
                        "Shortlisted"
                ).length,
            [applications]
        );


    const activeApplications =
        useMemo(
            () =>
                applications.filter(
                    (application) =>
                        application.status !==
                        "Withdrawn"
                ).length,
            [applications]
        );


    const canWithdraw = (
        status
    ) => {
        return ![
            "Accepted",
            "Rejected",
            "Withdrawn",
        ].includes(status);
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
                        top-10
                        h-64
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
                                    text-[#14835B]
                                "
                            >
                                Student Workspace
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
                                Candidate Dashboard
                            </h1>


                            <p
                                className="
                                    mt-3
                                    max-w-xl
                                    text-[15px]
                                    leading-7
                                    text-[#68736E]
                                "
                            >
                                Keep track of your
                                applications,
                                recruiter invitations
                                and saved career
                                opportunities.
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
                                to="/jobs"
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

                                <Search
                                    className="
                                        h-4
                                        w-4
                                    "
                                />

                                Find Jobs

                            </Link>


                            <Link
                                to="/profile"
                                className="
                                    inline-flex
                                    min-h-11
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    border
                                    border-[#D6E6DE]
                                    bg-white/90
                                    px-5
                                    text-sm
                                    font-medium
                                    text-[#626F69]
                                    transition-all
                                    duration-200
                                    hover:border-[#AAD8C1]
                                    hover:bg-[#F0FAF5]
                                    hover:text-[#009944]
                                "
                            >

                                <UserRoundSearch
                                    className="
                                        h-4
                                        w-4
                                    "
                                />

                                My Profile

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

                {/* =================================================
                    STATS
                ================================================= */}

                <section
                    className="
                        grid
                        gap-4
                        sm:grid-cols-2
                        xl:grid-cols-4
                    "
                >

                    <StatCard
                        icon={
                            FileText
                        }
                        label="Applications"
                        value={
                            applications.length
                        }
                        description={`${activeApplications} active`}
                        tone="blue"
                    />


                    <StatCard
                        icon={
                            Mail
                        }
                        label="Pending Invitations"
                        value={
                            pendingInvitations
                        }
                        description="Recruiter requests"
                        tone="cream"
                    />


                    <StatCard
                        icon={
                            Bookmark
                        }
                        label="Saved Jobs"
                        value={
                            savedJobsCount
                        }
                        description="Your shortlist"
                        tone="green"
                        to="/saved-jobs"
                    />


                    <StatCard
                        icon={
                            Sparkles
                        }
                        label="Shortlisted"
                        value={
                            shortlistedApplications
                        }
                        description="Applications progressing"
                        tone="purple"
                    />

                </section>


                {/* =================================================
                    QUICK LINKS
                ================================================= */}

                <section
                    className="
                        mt-8
                        grid
                        gap-4
                        md:grid-cols-3
                    "
                >

                    <QuickAction
                        icon={
                            Search
                        }
                        title="Explore Jobs"
                        description="Discover new opportunities that match your skills."
                        to="/jobs"
                    />


                    <QuickAction
                        icon={
                            Bookmark
                        }
                        title="Saved Opportunities"
                        description="Review jobs you've shortlisted for later."
                        to="/saved-jobs"
                    />


                    <QuickAction
                        icon={
                            UserRoundSearch
                        }
                        title="Update Profile"
                        description="Keep your candidate profile current for recruiters."
                        to="/profile"
                    />

                </section>


                {/* =================================================
                    INVITATIONS
                ================================================= */}

                <section
                    className="
                        mt-12
                    "
                >

                    <SectionHeading
                        eyebrow="Recruiter Outreach"
                        title="Job Invitations"
                        description="Opportunities sent directly to you by recruiters."
                        count={
                            invitations.length
                        }
                    />


                    {invitationError && (

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
                            {invitationError}
                        </div>

                    )}


                    {invitationLoading ? (

                        <div
                            className="
                                mt-6
                                grid
                                gap-5
                                lg:grid-cols-2
                            "
                        >

                            {[1, 2].map(
                                (item) => (

                                <div
                                    key={item}
                                    className="
                                        animate-pulse
                                        rounded-[22px]
                                        border
                                        border-[#DCE9E3]
                                        bg-white/95
                                        p-6
                                        shadow-[0_8px_24px_rgba(25,70,52,0.035)]
                                    "
                                >

                                    <div
                                        className="
                                            flex
                                            gap-4
                                        "
                                    >

                                        <div
                                            className="
                                                h-14
                                                w-14
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
                                            h-20
                                            rounded-xl
                                            bg-[#F0F6F3]
                                        "
                                    />

                                </div>

                                )
                            )}

                        </div>


                    ) : invitations.length ===
                        0 ? (

                        <EmptyState
                            icon={
                                Mail
                            }
                            title="No invitations yet"
                            description="Recruiters can invite you directly when your profile matches their opportunities."
                            buttonText="Browse Jobs"
                            buttonTo="/jobs"
                        />


                    ) : (

                        <div
                            className="
                                mt-6
                                space-y-5
                            "
                        >

                            {invitations.map(
                                (
                                    invitation
                                ) => (

                                <InvitationCard
                                    key={
                                        invitation.id
                                    }
                                    invitation={
                                        invitation
                                    }
                                    updating={
                                        statusUpdating ===
                                        invitation.id
                                    }
                                    onAccept={() =>
                                        updateInvitationStatus(
                                            invitation.id,
                                            "Accepted"
                                        )
                                    }
                                    onReject={() =>
                                        updateInvitationStatus(
                                            invitation.id,
                                            "Rejected"
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

                    <SectionHeading
                        eyebrow="Application Activity"
                        title="My Applications"
                        description="Follow the current status of every role you've applied for."
                        count={
                            applications.length
                        }
                    />


                    {error && (

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
                            {error}
                        </div>

                    )}


                    {loading ? (

                        <div
                            className="
                                mt-6
                                space-y-4
                            "
                        >

                            {[1, 2, 3].map(
                                (item) => (

                                <div
                                    key={item}
                                    className="
                                        animate-pulse
                                        rounded-[20px]
                                        border
                                        border-[#DCE9E3]
                                        bg-white/95
                                        p-6
                                    "
                                >

                                    <div
                                        className="
                                            h-5
                                            w-1/3
                                            rounded
                                            bg-[#E5ECE9]
                                        "
                                    />


                                    <div
                                        className="
                                            mt-3
                                            h-4
                                            w-1/5
                                            rounded
                                            bg-[#EEF3F0]
                                        "
                                    />


                                    <div
                                        className="
                                            mt-6
                                            h-12
                                            rounded-xl
                                            bg-[#F0F6F3]
                                        "
                                    />

                                </div>

                                )
                            )}

                        </div>


                    ) : applications.length ===
                        0 ? (

                        <EmptyState
                            icon={
                                BriefcaseBusiness
                            }
                            title="No applications yet"
                            description="Start exploring CareerSync and apply to opportunities that match your skills and goals."
                            buttonText="Find Jobs"
                            buttonTo="/jobs"
                        />


                    ) : (

                        <div
                            className="
                                mt-6
                                space-y-4
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
                                    canWithdraw={
                                        canWithdraw(
                                            application.status
                                        )
                                    }
                                    withdrawing={
                                        withdrawing ===
                                        application.id
                                    }
                                    onWithdraw={() =>
                                        withdrawApplication(
                                            application.id
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
   BACKGROUND
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
    description,
    tone,
    to,
}) {
    const styles = {
        blue: {
            bg:
                "bg-[#EEF7FB]",

            icon:
                "text-[#3384A7]",
        },

        cream: {
            bg:
                "bg-[#FFF7E8]",

            icon:
                "text-[#9B7947]",
        },

        green: {
            bg:
                "bg-[#EAF8F1]",

            icon:
                "text-[#009944]",
        },

        purple: {
            bg:
                "bg-[#F5F3F7]",

            icon:
                "text-[#776F86]",
        },
    };


    const style =
        styles[tone] ||
        styles.blue;


    const content = (
        <div
            className="
                group
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
                hover:border-[#B8DAC9]
                hover:shadow-[0_12px_28px_rgba(25,70,52,0.07)]
            "
        >

            <div
                className="
                    flex
                    items-start
                    justify-between
                    gap-4
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


                {to && (

                    <ArrowRight
                        className="
                            h-4
                            w-4
                            text-[#9AA59F]
                            transition-all
                            duration-200
                            group-hover:translate-x-0.5
                            group-hover:text-[#009944]
                        "
                    />

                )}

            </div>


            <p
                className="
                    mt-5
                    text-sm
                    text-[#737E78]
                "
            >
                {label}
            </p>


            <p
                className="
                    mt-1
                    font-sans
                    text-[30px]
                    font-semibold
                    tracking-[-0.03em]
                    text-[#282C34]
                "
            >
                {value}
            </p>


            <p
                className="
                    mt-1
                    text-xs
                    text-[#919B96]
                "
            >
                {description}
            </p>

        </div>
    );


    if (to) {
        return (
            <Link to={to}>
                {content}
            </Link>
        );
    }


    return content;
}


/* =========================================================
   QUICK ACTION
   ========================================================= */

function QuickAction({
    icon: Icon,
    title,
    description,
    to,
}) {
    return (
        <Link
            to={to}
            className="
                group
                flex
                items-start
                gap-4
                rounded-[18px]
                border
                border-[#DCE8E2]
                bg-white/80
                p-5
                shadow-[0_5px_18px_rgba(25,70,52,0.025)]
                backdrop-blur-sm
                transition-all
                duration-250
                hover:-translate-y-0.5
                hover:border-[#ADD7C0]
                hover:bg-white
                hover:shadow-[0_10px_25px_rgba(25,70,52,0.06)]
            "
        >

            <div
                className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-[#EAF7F1]
                    text-[#25805F]
                "
            >

                <Icon
                    className="
                        h-[18px]
                        w-[18px]
                    "
                />

            </div>


            <div
                className="
                    min-w-0
                    flex-1
                "
            >

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        gap-3
                    "
                >

                    <h3
                        className="
                            text-[15px]
                            font-medium
                            text-[#353A43]
                            transition-colors
                            group-hover:text-[#008D42]
                        "
                    >
                        {title}
                    </h3>


                    <ArrowRight
                        className="
                            h-4
                            w-4
                            shrink-0
                            text-[#9AA49F]
                            transition-all
                            group-hover:translate-x-0.5
                            group-hover:text-[#009944]
                        "
                    />

                </div>


                <p
                    className="
                        mt-1
                        text-sm
                        leading-6
                        text-[#7A8580]
                    "
                >
                    {description}
                </p>

            </div>

        </Link>
    );
}


/* =========================================================
   SECTION HEADING
   ========================================================= */

function SectionHeading({
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
                        font-sans
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


            <div
                className="
                    self-start
                    rounded-full
                    border
                    border-[#D6E6DE]
                    bg-white/90
                    px-3
                    py-1.5
                    text-xs
                    text-[#65716B]
                    sm:self-auto
                "
            >
                {count}{" "}
                {count === 1
                    ? "item"
                    : "items"}
            </div>

        </div>
    );
}


/* =========================================================
   INVITATION CARD
   ========================================================= */

function InvitationCard({
    invitation,
    updating,
    onAccept,
    onReject,
}) {
    return (
        <article
            className="
                overflow-hidden
                rounded-[22px]
                border
                border-[#DCE8E2]
                bg-white/95
                shadow-[0_8px_24px_rgba(25,70,52,0.04)]
                backdrop-blur-sm
            "
        >

            <div
                className="
                    p-5
                    sm:p-6
                "
            >

                <div
                    className="
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
                            min-w-0
                            flex-1
                        "
                    >

                        <div
                            className="
                                flex
                                items-start
                                gap-4
                            "
                        >

                            {invitation.company_logo ? (

                                <div
                                    className="
                                        h-14
                                        w-14
                                        shrink-0
                                        overflow-hidden
                                        rounded-full
                                        border
                                        border-[#DBE7E1]
                                        bg-white
                                    "
                                >

                                    <img
                                        src={
                                            invitation.company_logo
                                        }
                                        alt={`${invitation.company} logo`}
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

                                <div
                                    className="
                                        flex
                                        flex-wrap
                                        items-center
                                        gap-2.5
                                    "
                                >

                                    <h3
                                        className="
                                            font-sans
                                            text-[19px]
                                            font-semibold
                                            leading-6
                                            tracking-[-0.015em]
                                            text-[#282C34]
                                        "
                                    >
                                        {invitation.job_title}
                                    </h3>


                                    <InvitationStatus
                                        status={
                                            invitation.status
                                        }
                                    />

                                </div>


                                {invitation.company && (

                                    <p
                                        className="
                                            mt-1
                                            text-sm
                                            font-medium
                                            text-[#626E68]
                                        "
                                    >
                                        {invitation.company}
                                    </p>

                                )}


                                <p
                                    className="
                                        mt-3
                                        text-sm
                                        text-[#747F79]
                                    "
                                >
                                    Invited by{" "}

                                    <span
                                        className="
                                            font-medium
                                            text-[#46524C]
                                        "
                                    >
                                        {invitation.recruiter_name}
                                    </span>
                                </p>


                                <div
                                    className="
                                        mt-2
                                        flex
                                        items-center
                                        gap-1.5
                                        text-xs
                                        text-[#8D9892]
                                    "
                                >

                                    <CalendarDays
                                        className="
                                            h-3.5
                                            w-3.5
                                        "
                                    />

                                    {formatDate(
                                        invitation.created_at
                                    )}

                                </div>

                            </div>

                        </div>


                        {invitation.message && (

                            <div
                                className="
                                    mt-5
                                    rounded-xl
                                    border
                                    border-[#DFEBE5]
                                    bg-[#F6FBF8]
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

                                    <MessageSquareText
                                        className="
                                            h-4
                                            w-4
                                        "
                                    />

                                    Recruiter Message

                                </div>


                                <p
                                    className="
                                        mt-2
                                        whitespace-pre-line
                                        text-sm
                                        leading-6
                                        text-[#5F6B65]
                                    "
                                >
                                    {invitation.message}
                                </p>

                            </div>

                        )}

                    </div>


                    {/* PENDING */}

                    {invitation.status ===
                        "Pending" && (

                        <div
                            className="
                                flex
                                w-full
                                flex-col
                                gap-3
                                sm:w-auto
                                sm:flex-row
                                lg:flex-col
                                xl:flex-row
                            "
                        >

                            <button
                                type="button"
                                disabled={
                                    updating
                                }
                                onClick={
                                    onReject
                                }
                                className="
                                    inline-flex
                                    min-h-11
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    border
                                    border-[#E7D7D7]
                                    bg-white
                                    px-5
                                    text-sm
                                    font-medium
                                    text-[#985D5D]
                                    transition-all
                                    duration-200
                                    hover:bg-[#FFF6F6]
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
                            >

                                <X
                                    className="
                                        h-4
                                        w-4
                                    "
                                />

                                Reject

                            </button>


                            <button
                                type="button"
                                disabled={
                                    updating
                                }
                                onClick={
                                    onAccept
                                }
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
                                    transition-all
                                    duration-300
                                    hover:-translate-y-0.5
                                    hover:bg-[#009944]
                                    active:translate-y-0
                                    active:scale-[0.98]
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
                            >

                                <Check
                                    className="
                                        h-4
                                        w-4
                                    "
                                />

                                {updating
                                    ? "Updating..."
                                    : "Accept"}

                            </button>

                        </div>

                    )}

                </div>


                {/* ACCEPTED */}

                {invitation.status ===
                    "Accepted" && (

                    <div
                        className="
                            mt-6
                            rounded-[18px]
                            border
                            border-[#CDE7DA]
                            bg-[#EFF9F4]
                            p-5
                        "
                    >

                        <div
                            className="
                                flex
                                items-start
                                gap-3
                            "
                        >

                            <div
                                className="
                                    flex
                                    h-9
                                    w-9
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-[#DDF2E7]
                                    text-[#009944]
                                "
                            >

                                <CheckCircle2
                                    className="
                                        h-5
                                        w-5
                                    "
                                />

                            </div>


                            <div
                                className="
                                    min-w-0
                                    flex-1
                                "
                            >

                                <h4
                                    className="
                                        text-[15px]
                                        font-medium
                                        text-[#326E52]
                                    "
                                >
                                    Invitation Accepted
                                </h4>


                                <p
                                    className="
                                        mt-1
                                        text-sm
                                        leading-6
                                        text-[#658178]
                                    "
                                >
                                    Recruiter contact
                                    details are now
                                    available. You can
                                    discuss the next
                                    steps directly.
                                </p>


                                <div
                                    className="
                                        mt-4
                                        rounded-xl
                                        border
                                        border-[#D4E8DE]
                                        bg-white
                                        p-4
                                    "
                                >

                                    <p
                                        className="
                                            text-xs
                                            uppercase
                                            tracking-[0.1em]
                                            text-[#87928C]
                                        "
                                    >
                                        Recruiter Contact
                                    </p>


                                    <p
                                        className="
                                            mt-2
                                            text-sm
                                            font-medium
                                            text-[#3E4843]
                                        "
                                    >
                                        {invitation.recruiter_name}
                                    </p>


                                    {invitation.recruiter_email && (

                                        <p
                                            className="
                                                mt-1
                                                break-all
                                                text-sm
                                                text-[#6D7872]
                                            "
                                        >
                                            {invitation.recruiter_email}
                                        </p>

                                    )}

                                </div>


                                <div
                                    className="
                                        mt-4
                                        flex
                                        flex-col
                                        gap-3
                                        sm:flex-row
                                    "
                                >

                                    {invitation.recruiter_email && (

                                        <a
                                            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                                                invitation.recruiter_email
                                            )}&su=${encodeURIComponent(
                                                `CareerSync - ${invitation.job_title}`
                                            )}&body=${encodeURIComponent(
                                                `Hello ${invitation.recruiter_name},\n\nI accepted your invitation for the ${invitation.job_title} position at ${invitation.company} through CareerSync.\n\nI would like to discuss the next steps regarding this opportunity.\n\nThank you.`
                                            )}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
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
                                                transition-all
                                                duration-300
                                                hover:bg-[#009944]
                                                active:scale-[0.98]
                                            "
                                        >

                                            <Mail
                                                className="
                                                    h-4
                                                    w-4
                                                "
                                            />

                                            Contact Recruiter

                                        </a>

                                    )}


                                    <Link
                                        to={`/jobs/${invitation.job}`}
                                        className="
                                            inline-flex
                                            min-h-11
                                            items-center
                                            justify-center
                                            gap-2
                                            rounded-xl
                                            border
                                            border-[#D4E5DC]
                                            bg-white
                                            px-5
                                            text-sm
                                            font-medium
                                            text-[#606D66]
                                            transition-all
                                            duration-200
                                            hover:border-[#A9D8C0]
                                            hover:bg-[#F0FAF5]
                                            hover:text-[#009944]
                                        "
                                    >

                                        View Job

                                        <ExternalLink
                                            className="
                                                h-4
                                                w-4
                                            "
                                        />

                                    </Link>

                                </div>

                            </div>

                        </div>

                    </div>

                )}


                {/* REJECTED */}

                {invitation.status ===
                    "Rejected" && (

                    <div
                        className="
                            mt-5
                            flex
                            items-center
                            gap-3
                            rounded-xl
                            border
                            border-[#E6DEDE]
                            bg-[#FAF7F7]
                            px-4
                            py-3
                        "
                    >

                        <X
                            className="
                                h-4
                                w-4
                                shrink-0
                                text-[#8A7070]
                            "
                        />

                        <p
                            className="
                                text-sm
                                text-[#766E6E]
                            "
                        >
                            You declined this job
                            invitation.
                        </p>

                    </div>

                )}

            </div>

        </article>
    );
}


/* =========================================================
   INVITATION STATUS
   ========================================================= */

function InvitationStatus({
    status,
}) {
    const styles = {
        Pending:
            "border-[#EEE1BF] bg-[#FFF9EB] text-[#96723C]",

        Accepted:
            "border-[#CDE7DA] bg-[#EFF9F4] text-[#23704F]",

        Rejected:
            "border-[#E9DDDD] bg-[#FAF5F5] text-[#8A6464]",
    };


    return (
        <span
            className={`
                rounded-full
                border
                px-3
                py-1
                text-xs
                font-medium
                ${
                    styles[
                        status
                    ] ||
                    "border-[#DCE7E2] bg-[#F6F9F7] text-[#6D7872]"
                }
            `}
        >
            {status}
        </span>
    );
}


/* =========================================================
   APPLICATION CARD
   ========================================================= */

function ApplicationCard({
    application,
    canWithdraw,
    withdrawing,
    onWithdraw,
}) {
    return (
        <article
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
                hover:border-[#BEDBCC]
                hover:shadow-[0_11px_27px_rgba(25,70,52,0.06)]
                sm:p-6
            "
        >

            <div
                className="
                    flex
                    flex-col
                    gap-5
                    lg:flex-row
                    lg:items-center
                    lg:justify-between
                "
            >

                <div
                    className="
                        min-w-0
                        flex-1
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

                        <h3
                            className="
                                font-sans
                                text-[18px]
                                font-semibold
                                tracking-[-0.015em]
                                text-[#292D35]
                            "
                        >
                            {application.job_title}
                        </h3>


                        <ApplicationStatus
                            status={
                                application.status
                            }
                        />

                    </div>


                    <div
                        className="
                            mt-2
                            flex
                            flex-wrap
                            items-center
                            gap-x-4
                            gap-y-2
                            text-sm
                            text-[#6F7A74]
                        "
                    >

                        <span
                            className="
                                inline-flex
                                items-center
                                gap-1.5
                            "
                        >

                            <Building2
                                className="
                                    h-4
                                    w-4
                                    text-[#27815F]
                                "
                            />

                            {application.company}

                        </span>


                        <span
                            className="
                                inline-flex
                                items-center
                                gap-1.5
                            "
                        >

                            <CalendarDays
                                className="
                                    h-4
                                    w-4
                                    text-[#857B66]
                                "
                            />

                            Applied{" "}
                            {formatDate(
                                application.applied_at
                            )}

                        </span>

                    </div>


                    <div
                        className="
                            mt-4
                            flex
                            flex-wrap
                            items-center
                            gap-3
                        "
                    >

                        <Link
                            to={`/jobs/${application.job}`}
                            className="
                                inline-flex
                                items-center
                                gap-1.5
                                text-sm
                                font-medium
                                text-[#0D99FF]
                                transition-colors
                                duration-200
                                hover:text-[#009944]
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


                        <StatusMessage
                            status={
                                application.status
                            }
                        />

                    </div>

                </div>


                {canWithdraw && (

                    <button
                        type="button"
                        disabled={
                            withdrawing
                        }
                        onClick={
                            onWithdraw
                        }
                        className="
                            inline-flex
                            min-h-10
                            w-full
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
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                            lg:w-auto
                        "
                    >

                        <Trash2
                            className="
                                h-4
                                w-4
                            "
                        />

                        {withdrawing
                            ? "Withdrawing..."
                            : "Withdraw"}

                    </button>

                )}

            </div>

        </article>
    );
}


/* =========================================================
   APPLICATION STATUS
   ========================================================= */

function ApplicationStatus({
    status,
}) {
    const styles = {
        Applied:
            "border-[#DDE4EF] bg-[#F2F5F9] text-[#5D6E91]",

        "Under Review":
            "border-[#EEE1BF] bg-[#FFF9EB] text-[#96723C]",

        Shortlisted:
            "border-[#D7E9DF] bg-[#EFF9F4] text-[#287252]",

        "On Hold":
            "border-[#F0E2CA] bg-[#FFF8EC] text-[#966F3D]",

        Accepted:
            "border-[#CDE7DA] bg-[#EFF9F4] text-[#23704F]",

        Rejected:
            "border-[#EADADA] bg-[#FAF4F4] text-[#946060]",

        Withdrawn:
            "border-[#E4E4E0] bg-[#F5F5F3] text-[#787D84]",
    };


    return (
        <span
            className={`
                rounded-full
                border
                px-3
                py-1
                text-xs
                font-medium
                ${
                    styles[
                        status
                    ] ||
                    "border-[#DCE7E2] bg-[#F6F9F7] text-[#6D7872]"
                }
            `}
        >
            {status}
        </span>
    );
}


/* =========================================================
   STATUS MESSAGE
   ========================================================= */

function StatusMessage({
    status,
}) {
    const messages = {
        Applied:
            "Application received",

        "Under Review":
            "Recruiter is reviewing your application",

        Shortlisted:
            "Your profile has been shortlisted",

        "On Hold":
            "Application is currently on hold",

        Accepted:
            "Application accepted",

        Rejected:
            "Application closed",

        Withdrawn:
            "You withdrew this application",
    };


    return (
        <span
            className="
                inline-flex
                items-center
                gap-1.5
                text-xs
                text-[#87928C]
            "
        >

            <Clock3
                className="
                    h-3.5
                    w-3.5
                "
            />

            {messages[status] ||
                "Application updated"}

        </span>
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


            <Link
                to={buttonTo}
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
                    hover:-translate-y-0.5
                    hover:bg-[#009944]
                    active:translate-y-0
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

        </div>
    );
}


export default Dashboard;