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
    BriefcaseBusiness,
    Building2,
    CalendarDays,
    CheckCircle2,
    Code2,
    ExternalLink,
    FileText,
    Globe2,
    GraduationCap,
    Link2,
    Mail,
    MapPin,
    Send,
    Sparkles,
    UserRound,
    X,
} from "lucide-react";

import { apiFetch } from "../api";


/* =========================================================
   HELPERS
   ========================================================= */

function formatDate(value) {
    if (!value) {
        return "Not specified";
    }

    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return value;
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


function formatExperienceDate(
    startDate,
    endDate,
    isCurrent
) {
    const start =
        startDate
            ? formatDate(startDate)
            : "Not specified";

    const end =
        isCurrent
            ? "Present"
            : endDate
            ? formatDate(endDate)
            : "Not specified";

    return `${start} - ${end}`;
}


function extractApiError(
    data,
    fallback
) {
    if (!data) {
        return fallback;
    }

    if (
        typeof data ===
        "string"
    ) {
        return data;
    }

    if (
        typeof data.detail ===
        "string"
    ) {
        return data.detail;
    }

    const messages = [];

    Object.values(data).forEach(
        (value) => {

            if (
                Array.isArray(value)
            ) {
                value.forEach(
                    (item) => {
                        if (
                            typeof item ===
                            "string"
                        ) {
                            messages.push(
                                item
                            );
                        }
                    }
                );

            } else if (
                typeof value ===
                "string"
            ) {
                messages.push(
                    value
                );
            }
        }
    );

    return (
        messages.join(" ") ||
        fallback
    );
}


/* =========================================================
   TALENT PROFILE
   ========================================================= */

function TalentProfile() {
    const { id } =
        useParams();


    const [
        candidate,
        setCandidate,
    ] = useState(null);


    const [
        recruiterJobs,
        setRecruiterJobs,
    ] = useState([]);


    const [
        loading,
        setLoading,
    ] = useState(true);


    const [
        jobsLoading,
        setJobsLoading,
    ] = useState(false);


    const [
        error,
        setError,
    ] = useState("");


    const [
        inviteOpen,
        setInviteOpen,
    ] = useState(false);


    const [
        selectedJob,
        setSelectedJob,
    ] = useState("");


    const [
        inviteMessage,
        setInviteMessage,
    ] = useState("");


    const [
        inviting,
        setInviting,
    ] = useState(false);


    const [
        inviteError,
        setInviteError,
    ] = useState("");


    const [
        inviteSuccess,
        setInviteSuccess,
    ] = useState("");


    /* =====================================================
       LOAD CANDIDATE
       ===================================================== */

    useEffect(() => {
        let cancelled = false;


        const fetchCandidate =
            async () => {

                try {
                    setLoading(true);
                    setError("");


                    const response =
                        await apiFetch(
                            `/talent/${id}/`
                        );


                    const data =
                        await response.json();


                    if (!response.ok) {
                        throw new Error(
                            extractApiError(
                                data,
                                "Unable to load candidate profile."
                            )
                        );
                    }


                    if (
                        !cancelled
                    ) {
                        setCandidate(
                            data
                        );
                    }

                } catch (error) {
                    console.error(
                        "Talent profile error:",
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
                            "Unable to load candidate profile."
                        );
                    }

                } finally {
                    if (!cancelled) {
                        setLoading(false);
                    }
                }
            };


        fetchCandidate();


        return () => {
            cancelled = true;
        };

    }, [id]);


    /* =====================================================
       CANDIDATE DATA
       ===================================================== */

    const skills =
        useMemo(
            () =>
                Array.isArray(
                    candidate?.skills
                )
                    ? candidate.skills
                    : [],
            [candidate]
        );


    const education =
        useMemo(
            () =>
                Array.isArray(
                    candidate?.education
                )
                    ? candidate.education
                    : [],
            [candidate]
        );


    const experience =
        useMemo(
            () =>
                Array.isArray(
                    candidate?.experience
                )
                    ? candidate.experience
                    : [],
            [candidate]
        );


    /* =====================================================
       LOAD JOBS FOR INVITATION
       ===================================================== */

    const openInvitationModal =
        async () => {

            setInviteOpen(true);
            setInviteError("");
            setInviteSuccess("");


            if (
                recruiterJobs.length >
                0
            ) {
                return;
            }


            try {
                setJobsLoading(
                    true
                );


                const response =
                    await apiFetch(
                        "/recruiter/jobs/"
                    );


                const data =
                    await response.json();


                if (!response.ok) {
                    throw new Error(
                        extractApiError(
                            data,
                            "Unable to load your jobs."
                        )
                    );
                }


                setRecruiterJobs(
                    Array.isArray(data)
                        ? data
                        : data.results ||
                          []
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
                    setInviteError(
                        "Your session has expired. Please login again."
                    );

                } else {
                    setInviteError(
                        error.message ||
                        "Unable to load your jobs."
                    );
                }

            } finally {
                setJobsLoading(
                    false
                );
            }
        };


    /* =====================================================
       SEND INVITATION
       ===================================================== */

    const sendInvitation =
        async (event) => {

            event.preventDefault();


            if (!selectedJob) {
                setInviteError(
                    "Please select a job."
                );

                return;
            }


            try {
                setInviting(true);
                setInviteError("");
                setInviteSuccess("");


                const response =
                    await apiFetch(
                        "/invitations/",
                        {
                            method:
                                "POST",

                            headers: {
                                "Content-Type":
                                    "application/json",
                            },

                            body:
                                JSON.stringify(
                                    {
                                        job:
                                            Number(
                                                selectedJob
                                            ),

                                        candidate:
                                            Number(
                                                id
                                            ),

                                        message:
                                            inviteMessage.trim(),
                                    }
                                ),
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {
                    throw new Error(
                        extractApiError(
                            data,
                            "Unable to send invitation."
                        )
                    );
                }


                setInviteSuccess(
                    "Invitation sent successfully."
                );

                setSelectedJob("");
                setInviteMessage("");


                setTimeout(
                    () => {
                        setInviteOpen(
                            false
                        );

                        setInviteSuccess(
                            ""
                        );
                    },
                    900
                );

            } catch (error) {
                console.error(
                    "Invitation error:",
                    error
                );


                if (
                    error.message ===
                    "SESSION_EXPIRED"
                ) {
                    setInviteError(
                        "Your session has expired. Please login again."
                    );

                } else {
                    setInviteError(
                        error.message ||
                        "Unable to send invitation."
                    );
                }

            } finally {
                setInviting(false);
            }
        };


    /* =====================================================
       CONTACT
       ===================================================== */

    const contactCandidate =
        () => {

            if (
                !candidate?.email
            ) {
                return;
            }


            const subject =
                "CareerSync - Career Opportunity";


            const body =
                `Hello ${candidate.full_name || "Candidate"},\n\n` +
                "I came across your profile on CareerSync and would like to discuss a career opportunity with you.\n\n" +
                "Please let me know when you are available to connect.\n\nThank you.";


            const url =
                `https://mail.google.com/mail/?view=cm&fs=1` +
                `&to=${encodeURIComponent(
                    candidate.email
                )}` +
                `&su=${encodeURIComponent(
                    subject
                )}` +
                `&body=${encodeURIComponent(
                    body
                )}`;


            window.open(
                url,
                "_blank",
                "noopener,noreferrer"
            );
        };


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
                    sm:px-6
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
                                flex
                                items-center
                                gap-5
                            "
                        >

                            <div
                                className="
                                    h-24
                                    w-24
                                    rounded-full
                                    bg-[#E8F0EC]
                                "
                            />


                            <div
                                className="
                                    flex-1
                                "
                            >

                                <div
                                    className="
                                        h-7
                                        w-48
                                        rounded
                                        bg-[#E4ECE8]
                                    "
                                />


                                <div
                                    className="
                                        mt-3
                                        h-4
                                        w-72
                                        max-w-full
                                        rounded
                                        bg-[#EDF3F0]
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
        !candidate
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
                    bg-gradient-to-br
                    from-[#ECFCF7]
                    via-[#FBFFFD]
                    to-[#F1FFF5]
                    px-4
                "
            >

                <AnimatedBackground />


                <div
                    className="
                        relative
                        z-10
                        w-full
                        max-w-lg
                        rounded-[24px]
                        border
                        border-[#DCE8E2]
                        bg-white/95
                        px-7
                        py-12
                        text-center
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

                        <UserRound
                            className="
                                h-6
                                w-6
                            "
                        />

                    </div>


                    <h1
                        className="
                            mt-5
                            text-2xl
                            font-semibold
                            text-[#292D35]
                        "
                    >
                        Candidate unavailable
                    </h1>


                    <p
                        className="
                            mt-3
                            text-sm
                            leading-6
                            text-[#737E78]
                        "
                    >
                        {error ||
                            "This candidate profile could not be loaded."}
                    </p>


                    <Link
                        to="/recruiter/talent"
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

                        <ArrowLeft
                            className="
                                h-4
                                w-4
                            "
                        />

                        Back to Talent

                    </Link>

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
                        pb-11
                        pt-8
                        sm:px-6
                        lg:px-8
                    "
                >

                    <Link
                        to="/recruiter/talent"
                        className="
                            inline-flex
                            items-center
                            gap-2
                            text-sm
                            font-medium
                            text-[#65726C]
                            transition
                            hover:text-[#009944]
                        "
                    >

                        <ArrowLeft
                            className="
                                h-4
                                w-4
                            "
                        />

                        Back to talent

                    </Link>


                    <div
                        className="
                            mt-8
                            flex
                            flex-col
                            gap-7
                            lg:flex-row
                            lg:items-start
                            lg:justify-between
                        "
                    >

                        {/* PROFILE */}

                        <div
                            className="
                                flex
                                min-w-0
                                flex-col
                                gap-5
                                sm:flex-row
                                sm:items-start
                            "
                        >

                            {candidate.profile_image ? (

                                <div
                                    className="
                                        h-24
                                        w-24
                                        shrink-0
                                        overflow-hidden
                                        rounded-full
                                        border-4
                                        border-white
                                        bg-white
                                        shadow-[0_8px_22px_rgba(25,70,52,0.08)]
                                    "
                                >

                                    <img
                                        src={
                                            candidate.profile_image
                                        }
                                        alt={
                                            candidate.full_name ||
                                            "Candidate"
                                        }
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
                                        h-24
                                        w-24
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-full
                                        border-4
                                        border-white
                                        bg-[#E4F5EC]
                                        text-[#27815F]
                                        shadow-[0_8px_22px_rgba(25,70,52,0.08)]
                                    "
                                >

                                    <UserRound
                                        className="
                                            h-10
                                            w-10
                                        "
                                    />

                                </div>

                            )}


                            <div
                                className="
                                    min-w-0
                                    max-w-3xl
                                "
                            >

                                <p
                                    className="
                                        text-xs
                                        font-medium
                                        uppercase
                                        tracking-[0.14em]
                                        text-[#16825D]
                                    "
                                >
                                    Candidate Profile
                                </p>


                                <h1
                                    className="
                                        mt-2
                                        font-sans
                                        text-[34px]
                                        font-semibold
                                        leading-[1.12]
                                        tracking-[-0.035em]
                                        text-[#171A1F]
                                        sm:text-[42px]
                                    "
                                >
                                    {candidate.full_name}
                                </h1>


                                <p
                                    className="
                                        mt-2
                                        text-[16px]
                                        leading-7
                                        text-[#5F6D66]
                                    "
                                >
                                    {candidate.headline ||
                                        "CareerSync Candidate"}
                                </p>


                                <div
                                    className="
                                        mt-4
                                        flex
                                        flex-wrap
                                        gap-x-5
                                        gap-y-2
                                        text-sm
                                        text-[#707C76]
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
                                                text-[#27815F]
                                            "
                                        />

                                        {candidate.location ||
                                            "Location not added"}

                                    </span>


                                    <span
                                        className="
                                            inline-flex
                                            items-center
                                            gap-1.5
                                        "
                                    >

                                        <Mail
                                            className="
                                                h-4
                                                w-4
                                                text-[#3B82A0]
                                            "
                                        />

                                        {candidate.email}

                                    </span>

                                </div>

                            </div>

                        </div>


                        {/* ACTIONS */}

                        <div
                            className="
                                flex
                                w-full
                                flex-col
                                gap-3
                                sm:w-auto
                                sm:flex-row
                            "
                        >

                            <button
                                type="button"
                                onClick={
                                    contactCandidate
                                }
                                disabled={
                                    !candidate.email
                                }
                                className="
                                    inline-flex
                                    min-h-11
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    border
                                    border-[#D5E5DD]
                                    bg-white/95
                                    px-5
                                    text-sm
                                    font-medium
                                    text-[#606D66]
                                    transition-all
                                    duration-200
                                    hover:border-[#AAD8C1]
                                    hover:bg-[#F0FAF5]
                                    hover:text-[#009944]
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
                            >

                                <Mail
                                    className="
                                        h-4
                                        w-4
                                    "
                                />

                                Contact

                            </button>


                            <button
                                type="button"
                                onClick={
                                    openInvitationModal
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

                                <Send
                                    className="
                                        h-4
                                        w-4
                                    "
                                />

                                Invite to Job

                            </button>

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

                <div
                    className="
                        grid
                        gap-8
                        lg:grid-cols-[minmax(0,1fr)_330px]
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

                        {/* ABOUT */}

                        <ProfileSection
                            icon={
                                UserRound
                            }
                            eyebrow="Introduction"
                            title="About"
                        >

                            {candidate.bio ? (

                                <p
                                    className="
                                        whitespace-pre-line
                                        text-[15px]
                                        leading-8
                                        text-[#626E68]
                                    "
                                >
                                    {candidate.bio}
                                </p>

                            ) : (

                                <EmptyText>
                                    Candidate has not
                                    added an About
                                    section yet.
                                </EmptyText>

                            )}

                        </ProfileSection>


                        {/* SKILLS */}

                        <ProfileSection
                            icon={
                                Sparkles
                            }
                            eyebrow="Expertise"
                            title="Skills"
                        >

                            {skills.length >
                            0 ? (

                                <div
                                    className="
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
                                            key={`${skill}-${index}`}
                                            className="
                                                rounded-full
                                                border
                                                border-[#D6E7DF]
                                                bg-[#F2FAF6]
                                                px-3.5
                                                py-1.5
                                                text-sm
                                                text-[#586B62]
                                            "
                                        >
                                            {skill}
                                        </span>

                                        )
                                    )}

                                </div>

                            ) : (

                                <EmptyText>
                                    No skills added.
                                </EmptyText>

                            )}

                        </ProfileSection>


                        {/* EXPERIENCE */}

                        <ProfileSection
                            icon={
                                BriefcaseBusiness
                            }
                            eyebrow="Career History"
                            title="Experience"
                        >

                            {experience.length >
                            0 ? (

                                <div
                                    className="
                                        space-y-5
                                    "
                                >

                                    {experience.map(
                                        (
                                            item,
                                            index
                                        ) => (

                                        <TimelineCard
                                            key={
                                                item.id ||
                                                index
                                            }
                                            icon={
                                                BriefcaseBusiness
                                            }
                                            title={
                                                item.job_title
                                            }
                                            subtitle={
                                                item.company
                                            }
                                            meta={formatExperienceDate(
                                                item.start_date,
                                                item.end_date,
                                                item.is_current
                                            )}
                                            location={
                                                item.location
                                            }
                                            description={
                                                item.description
                                            }
                                        />

                                        )
                                    )}

                                </div>

                            ) : (

                                <EmptyText>
                                    No experience added.
                                </EmptyText>

                            )}

                        </ProfileSection>


                        {/* EDUCATION */}

                        <ProfileSection
                            icon={
                                GraduationCap
                            }
                            eyebrow="Academic Background"
                            title="Education"
                        >

                            {education.length >
                            0 ? (

                                <div
                                    className="
                                        space-y-5
                                    "
                                >

                                    {education.map(
                                        (
                                            item,
                                            index
                                        ) => (

                                        <TimelineCard
                                            key={
                                                item.id ||
                                                index
                                            }
                                            icon={
                                                GraduationCap
                                            }
                                            title={
                                                item.degree
                                            }
                                            subtitle={
                                                item.field_of_study
                                            }
                                            meta={
                                                [
                                                    item.start_year,
                                                    item.end_year,
                                                ]
                                                    .filter(
                                                        Boolean
                                                    )
                                                    .join(
                                                        " - "
                                                    ) ||
                                                "Dates not added"
                                            }
                                            organization={
                                                item.institution
                                            }
                                            description={
                                                item.description
                                            }
                                        />

                                        )
                                    )}

                                </div>

                            ) : (

                                <EmptyText>
                                    No education added.
                                </EmptyText>

                            )}

                        </ProfileSection>

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

                            {/* QUICK SUMMARY */}

                            <div
                                className="
                                    rounded-[22px]
                                    border
                                    border-[#DCE8E2]
                                    bg-white/95
                                    p-5
                                    shadow-[0_8px_24px_rgba(25,70,52,0.04)]
                                    backdrop-blur-sm
                                "
                            >

                                <p
                                    className="
                                        text-xs
                                        font-medium
                                        uppercase
                                        tracking-[0.12em]
                                        text-[#27815F]
                                    "
                                >
                                    Candidate Overview
                                </p>


                                <div
                                    className="
                                        mt-5
                                        grid
                                        grid-cols-3
                                        gap-2
                                    "
                                >

                                    <MiniStat
                                        value={
                                            skills.length
                                        }
                                        label="Skills"
                                    />


                                    <MiniStat
                                        value={
                                            experience.length
                                        }
                                        label="Experience"
                                    />


                                    <MiniStat
                                        value={
                                            education.length
                                        }
                                        label="Education"
                                    />

                                </div>

                            </div>


{/* PROFESSIONAL LINKS */}

<div
    className="
        rounded-[22px]
        border
        border-[#DCE8E2]
        bg-white/95
        p-5
        shadow-[0_8px_24px_rgba(25,70,52,0.04)]
    "
>

    <h3
        className="
            text-base
            font-semibold
            text-[#30343B]
        "
    >
        Professional Links
    </h3>


    <div
        className="
            mt-4
            space-y-2
        "
    >

        {candidate.github_url && (

            <SidebarLink
                href={
                    candidate.github_url
                }
                icon={
                    Code2
                }
                label="GitHub"
            />

        )}


        {candidate.linkedin_url && (

            <SidebarLink
                href={
                    candidate.linkedin_url
                }
                icon={
                    Link2
                }
                label="LinkedIn"
            />

        )}


        {!candidate.github_url &&
            !candidate.linkedin_url && (

            <p
                className="
                    py-2
                    text-sm
                    leading-6
                    text-[#89938E]
                "
            >
                No professional
                links added.
            </p>

        )}

    </div>

</div>


                            {/* RESUME */}

                            <div
                                className="
                                    rounded-[22px]
                                    border
                                    border-[#DCE8E2]
                                    bg-white/95
                                    p-5
                                    shadow-[0_8px_24px_rgba(25,70,52,0.04)]
                                "
                            >

                                <div
                                    className="
                                        flex
                                        h-10
                                        w-10
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-[#EAF7F1]
                                        text-[#27815F]
                                    "
                                >

                                    <FileText
                                        className="
                                            h-[18px]
                                            w-[18px]
                                        "
                                    />

                                </div>


                                <h3
                                    className="
                                        mt-4
                                        text-base
                                        font-semibold
                                        text-[#30343B]
                                    "
                                >
                                    Resume
                                </h3>


                                <p
                                    className="
                                        mt-1
                                        text-sm
                                        leading-6
                                        text-[#78837D]
                                    "
                                >
                                    Review the candidate's
                                    uploaded resume.
                                </p>


                                {candidate.resume ? (

                                    <a
                                        href={
                                            candidate.resume
                                        }
                                        target="_blank"
                                        rel="noreferrer"
                                        className="
                                            mt-4
                                            inline-flex
                                            min-h-10
                                            w-full
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
                                            text-[#0D99FF]
                                            transition-all
                                            duration-200
                                            hover:border-[#AAD8C1]
                                            hover:bg-[#F0FAF5]
                                            hover:text-[#009944]
                                        "
                                    >

                                        View Resume

                                        <ExternalLink
                                            className="
                                                h-4
                                                w-4
                                            "
                                        />

                                    </a>

                                ) : (

                                    <p
                                        className="
                                            mt-4
                                            rounded-xl
                                            bg-[#F5F7F6]
                                            px-4
                                            py-3
                                            text-sm
                                            text-[#828C87]
                                        "
                                    >
                                        Resume not uploaded.
                                    </p>

                                )}

                            </div>


                            {/* CONTACT */}

                            <div
                                className="
                                    rounded-[18px]
                                    border
                                    border-[#CDE7DA]
                                    bg-[#F0FAF5]/95
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
                                            rounded-xl
                                            bg-[#DDF4E8]
                                            text-[#009944]
                                        "
                                    >

                                        <Mail
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
                                                text-sm
                                                font-medium
                                                text-[#486359]
                                            "
                                        >
                                            Contact Candidate
                                        </p>


                                        <p
                                            className="
                                                mt-1
                                                break-all
                                                text-xs
                                                leading-5
                                                text-[#72847B]
                                            "
                                        >
                                            {candidate.email}
                                        </p>

                                    </div>

                                </div>


                                <button
                                    type="button"
                                    onClick={
                                        contactCandidate
                                    }
                                    className="
                                        mt-4
                                        inline-flex
                                        min-h-10
                                        w-full
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

                                    <Mail
                                        className="
                                            h-4
                                            w-4
                                        "
                                    />

                                    Send Email

                                </button>

                            </div>

                        </div>

                    </aside>

                </div>

            </main>


            {/* =================================================
                INVITATION MODAL
            ================================================= */}

            {inviteOpen && (

                <div
                    className="
                        fixed
                        inset-0
                        z-50
                        flex
                        items-center
                        justify-center
                        bg-[#14251D]/35
                        px-4
                        py-8
                        backdrop-blur-sm
                    "
                >

                    <div
                        className="
                            max-h-[90vh]
                            w-full
                            max-w-xl
                            overflow-y-auto
                            rounded-[24px]
                            border
                            border-[#DCE8E2]
                            bg-white
                            shadow-[0_24px_70px_rgba(20,45,35,0.18)]
                        "
                    >

                        {/* MODAL HEADER */}

                        <div
                            className="
                                flex
                                items-start
                                justify-between
                                gap-4
                                border-b
                                border-[#E7EFEB]
                                bg-[#F7FCF9]
                                px-6
                                py-5
                            "
                        >

                            <div>

                                <p
                                    className="
                                        text-xs
                                        font-medium
                                        uppercase
                                        tracking-[0.12em]
                                        text-[#27815F]
                                    "
                                >
                                    Recruit Candidate
                                </p>


                                <h2
                                    className="
                                        mt-1
                                        text-[22px]
                                        font-semibold
                                        tracking-[-0.02em]
                                        text-[#282C34]
                                    "
                                >
                                    Invite to Job
                                </h2>


                                <p
                                    className="
                                        mt-1.5
                                        text-sm
                                        text-[#737E78]
                                    "
                                >
                                    Send an opportunity
                                    to{" "}
                                    <span
                                        className="
                                            font-medium
                                            text-[#48544E]
                                        "
                                    >
                                        {candidate.full_name}
                                    </span>
                                    .
                                </p>

                            </div>


                            <button
                                type="button"
                                onClick={() =>
                                    setInviteOpen(
                                        false
                                    )
                                }
                                className="
                                    flex
                                    h-9
                                    w-9
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    text-[#75817B]
                                    transition
                                    hover:bg-[#EAF5EF]
                                    hover:text-[#009944]
                                "
                            >

                                <X
                                    className="
                                        h-5
                                        w-5
                                    "
                                />

                            </button>

                        </div>


                        <form
                            onSubmit={
                                sendInvitation
                            }
                            className="
                                p-6
                            "
                        >

                            {inviteError && (

                                <div
                                    className="
                                        mb-5
                                        rounded-xl
                                        border
                                        border-[#EFDADA]
                                        bg-[#FFF7F7]
                                        px-4
                                        py-3
                                        text-sm
                                        text-[#A25555]
                                    "
                                >
                                    {inviteError}
                                </div>

                            )}


                            {inviteSuccess && (

                                <div
                                    className="
                                        mb-5
                                        flex
                                        items-center
                                        gap-2
                                        rounded-xl
                                        border
                                        border-[#CAE6D8]
                                        bg-[#EFF9F4]
                                        px-4
                                        py-3
                                        text-sm
                                        text-[#347457]
                                    "
                                >

                                    <CheckCircle2
                                        className="
                                            h-4
                                            w-4
                                            text-[#009944]
                                        "
                                    />

                                    {inviteSuccess}

                                </div>

                            )}


                            {/* JOB */}

                            <div>

                                <label
                                    className="
                                        mb-2
                                        block
                                        text-sm
                                        font-medium
                                        text-[#515D57]
                                    "
                                >
                                    Select Job
                                    <span
                                        className="
                                            ml-1
                                            text-[#B65C5C]
                                        "
                                    >
                                        *
                                    </span>
                                </label>


                                {jobsLoading ? (

                                    <div
                                        className="
                                            min-h-12
                                            animate-pulse
                                            rounded-xl
                                            bg-[#EEF3F0]
                                        "
                                    />

                                ) : recruiterJobs.length ===
                                    0 ? (

                                    <div
                                        className="
                                            rounded-xl
                                            border
                                            border-[#E6EAE8]
                                            bg-[#F7F9F8]
                                            px-4
                                            py-4
                                            text-sm
                                            leading-6
                                            text-[#737D78]
                                        "
                                    >
                                        You do not have
                                        any job postings
                                        available for an
                                        invitation.

                                        <Link
                                            to="/recruiter/jobs/new"
                                            className="
                                                ml-1
                                                font-medium
                                                text-[#0D99FF]
                                                hover:text-[#009944]
                                            "
                                        >
                                            Post a job
                                        </Link>
                                    </div>

                                ) : (

                                    <select
                                        value={
                                            selectedJob
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setSelectedJob(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        className="
                                            min-h-12
                                            w-full
                                            rounded-xl
                                            border
                                            border-[#D5E3DC]
                                            bg-white
                                            px-4
                                            text-sm
                                            text-[#3E4843]
                                            outline-none
                                            transition-all
                                            focus:border-[#0D99FF]
                                            focus:ring-4
                                            focus:ring-[#0D99FF]/10
                                        "
                                    >

                                        <option value="">
                                            Select a job
                                        </option>


                                        {recruiterJobs.map(
                                            (job) => (

                                            <option
                                                key={
                                                    job.id
                                                }
                                                value={
                                                    job.id
                                                }
                                            >
                                                {job.title}
                                                {" — "}
                                                {job.company}
                                            </option>

                                            )
                                        )}

                                    </select>

                                )}

                            </div>


                            {/* MESSAGE */}

                            <div
                                className="
                                    mt-5
                                "
                            >

                                <label
                                    className="
                                        mb-2
                                        block
                                        text-sm
                                        font-medium
                                        text-[#515D57]
                                    "
                                >
                                    Message
                                </label>


                                <textarea
                                    value={
                                        inviteMessage
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setInviteMessage(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    rows="5"
                                    placeholder={`Hello ${candidate.full_name}, we'd like to invite you to consider this opportunity...`}
                                    className="
                                        w-full
                                        resize-y
                                        rounded-xl
                                        border
                                        border-[#D5E3DC]
                                        bg-[#FCFEFD]
                                        px-4
                                        py-3
                                        text-sm
                                        leading-7
                                        text-[#3E4843]
                                        outline-none
                                        transition-all
                                        placeholder:text-[#A0AAA5]
                                        focus:border-[#0D99FF]
                                        focus:ring-4
                                        focus:ring-[#0D99FF]/10
                                    "
                                />

                            </div>


                            {/* ACTIONS */}

                            <div
                                className="
                                    mt-6
                                    flex
                                    flex-col-reverse
                                    gap-3
                                    sm:flex-row
                                    sm:justify-end
                                "
                            >

                                <button
                                    type="button"
                                    onClick={() =>
                                        setInviteOpen(
                                            false
                                        )
                                    }
                                    className="
                                        inline-flex
                                        min-h-11
                                        items-center
                                        justify-center
                                        rounded-xl
                                        border
                                        border-[#D5E5DD]
                                        bg-white
                                        px-5
                                        text-sm
                                        font-medium
                                        text-[#606D66]
                                        transition-all
                                        hover:border-[#AAD8C1]
                                        hover:bg-[#F0FAF5]
                                        hover:text-[#009944]
                                    "
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    disabled={
                                        inviting ||
                                        jobsLoading ||
                                        recruiterJobs.length ===
                                            0
                                    }
                                    className="
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
                                        hover:bg-[#009944]
                                        active:scale-[0.98]
                                        disabled:cursor-not-allowed
                                        disabled:opacity-50
                                    "
                                >

                                    <Send
                                        className="
                                            h-4
                                            w-4
                                        "
                                    />

                                    {inviting
                                        ? "Sending..."
                                        : "Send Invitation"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}


/* =========================================================
   PROFILE SECTION
   ========================================================= */

function ProfileSection({
    icon: Icon,
    eyebrow,
    title,
    children,
}) {
    return (
        <section
            className="
                rounded-[22px]
                border
                border-[#DCE8E2]
                bg-white/95
                p-5
                shadow-[0_8px_24px_rgba(25,70,52,0.04)]
                backdrop-blur-sm
                sm:p-6
                lg:p-7
            "
        >

            <div
                className="
                    mb-6
                    flex
                    items-start
                    gap-3
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
                        text-[#27815F]
                    "
                >

                    <Icon
                        className="
                            h-[18px]
                            w-[18px]
                        "
                    />

                </div>


                <div>

                    <p
                        className="
                            text-xs
                            font-medium
                            uppercase
                            tracking-[0.12em]
                            text-[#27815F]
                        "
                    >
                        {eyebrow}
                    </p>


                    <h2
                        className="
                            mt-1
                            text-[22px]
                            font-semibold
                            tracking-[-0.02em]
                            text-[#282C34]
                        "
                    >
                        {title}
                    </h2>

                </div>

            </div>


            {children}

        </section>
    );
}


/* =========================================================
   TIMELINE CARD
   ========================================================= */

function TimelineCard({
    icon: Icon,
    title,
    subtitle,
    meta,
    location,
    organization,
    description,
}) {
    return (
        <article
            className="
                rounded-[18px]
                border
                border-[#E0EBE5]
                bg-[#F9FCFA]
                p-5
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
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-[#EAF7F1]
                        text-[#27815F]
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
                        flex-1
                    "
                >

                    <h3
                        className="
                            text-[16px]
                            font-semibold
                            text-[#343B37]
                        "
                    >
                        {title ||
                            "Not specified"}
                    </h3>


                    {subtitle && (

                        <p
                            className="
                                mt-1
                                text-sm
                                font-medium
                                text-[#5C6962]
                            "
                        >
                            {subtitle}
                        </p>

                    )}


                    {organization && (

                        <div
                            className="
                                mt-1
                                flex
                                items-center
                                gap-1.5
                                text-sm
                                text-[#6F7A74]
                            "
                        >

                            <Building2
                                className="
                                    h-3.5
                                    w-3.5
                                "
                            />

                            {organization}

                        </div>

                    )}


                    <div
                        className="
                            mt-2
                            flex
                            flex-wrap
                            gap-x-4
                            gap-y-1
                            text-xs
                            text-[#85908A]
                        "
                    >

                        {meta && (

                            <span
                                className="
                                    inline-flex
                                    items-center
                                    gap-1.5
                                "
                            >

                                <CalendarDays
                                    className="
                                        h-3.5
                                        w-3.5
                                    "
                                />

                                {meta}

                            </span>

                        )}


                        {location && (

                            <span
                                className="
                                    inline-flex
                                    items-center
                                    gap-1.5
                                "
                            >

                                <MapPin
                                    className="
                                        h-3.5
                                        w-3.5
                                    "
                                />

                                {location}

                            </span>

                        )}

                    </div>


                    {description && (

                        <p
                            className="
                                mt-4
                                whitespace-pre-line
                                text-sm
                                leading-7
                                text-[#67736C]
                            "
                        >
                            {description}
                        </p>

                    )}

                </div>

            </div>

        </article>
    );
}


/* =========================================================
   SIDEBAR LINK
   ========================================================= */

function SidebarLink({
    href,
    icon: Icon,
    label,
}) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="
                group
                flex
                min-h-11
                items-center
                justify-between
                gap-3
                rounded-xl
                border
                border-[#E0EAE5]
                bg-[#F9FCFA]
                px-4
                text-sm
                font-medium
                text-[#59665F]
                transition-all
                duration-200
                hover:border-[#AAD8C1]
                hover:bg-[#F0FAF5]
                hover:text-[#009944]
            "
        >

            <span
                className="
                    flex
                    items-center
                    gap-2.5
                "
            >

                <Icon
                    className="
                        h-4
                        w-4
                    "
                />

                {label}

            </span>


            <ExternalLink
                className="
                    h-3.5
                    w-3.5
                    text-[#96A19B]
                    transition-colors
                    group-hover:text-[#009944]
                "
            />

        </a>
    );
}


/* =========================================================
   MINI STAT
   ========================================================= */

function MiniStat({
    value,
    label,
}) {
    return (
        <div
            className="
                rounded-xl
                bg-[#F6FAF8]
                px-2
                py-3
                text-center
            "
        >

            <p
                className="
                    text-xl
                    font-semibold
                    text-[#36423C]
                "
            >
                {value}
            </p>


            <p
                className="
                    mt-1
                    text-[10px]
                    leading-4
                    text-[#89948E]
                "
            >
                {label}
            </p>

        </div>
    );
}


/* =========================================================
   EMPTY TEXT
   ========================================================= */

function EmptyText({
    children,
}) {
    return (
        <div
            className="
                rounded-xl
                border
                border-dashed
                border-[#D5E5DD]
                bg-[#F7FBF9]
                px-5
                py-6
                text-sm
                leading-6
                text-[#828D87]
            "
        >
            {children}
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
                    h-135
                    w-162.5
                    rounded-full
                    bg-[#9AF2B4]/15
                    blur-[125px]
                    animate-[pulse_10s_ease-in-out_infinite]
                "
            />

        </div>
    );
}


export default TalentProfile;