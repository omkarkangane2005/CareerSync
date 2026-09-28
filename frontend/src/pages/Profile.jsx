import {
    useEffect,
    useState,
} from "react";

import {
    Link,
} from "react-router-dom";

import {
    AlertCircle,
    ArrowLeft,
    BriefcaseBusiness,
    CheckCircle2,
    Code2,
    ExternalLink,
    FileText,
    Globe2,
    Link2,
    MapPin,
    Pencil,
    Save,
    Sparkles,
    UploadCloud,
    UserRound,
} from "lucide-react";

import {
    apiFetch,
    API_ROOT_URL,
} from "../api";

import EducationSection from "../components/profile/EducationSection";
import ExperienceSection from "../components/profile/ExperienceSection";
import ProfileCompletion from "../components/profile/ProfileCompletion";
import ProfilePhoto from "../components/profile/ProfilePhoto";




function Profile() {
    const [
        profile,
        setProfile,
    ] = useState(null);

    const [
        skillsInput,
        setSkillsInput,
    ] = useState("");

    const [
        bioInput,
        setBioInput,
    ] = useState("");

    const [
        editingBio,
        setEditingBio,
    ] = useState(false);

    const [
        educationCount,
        setEducationCount,
    ] = useState(0);

    const [
        experienceCount,
        setExperienceCount,
    ] = useState(0);

    const [
        professionalLinks,
        setProfessionalLinks,
    ] = useState({
        github_url: "",
        linkedin_url: "",
        
    });

    const [
        resumeFile,
        setResumeFile,
    ] = useState(null);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        saving,
        setSaving,
    ] = useState(false);

    const [
        uploadingResume,
        setUploadingResume,
    ] = useState(false);

    const [
        message,
        setMessage,
    ] = useState("");

    const [
        error,
        setError,
    ] = useState("");


    /* ======================================================
       FETCH PROFILE
       ====================================================== */

    const fetchProfile =
        async () => {

            try {
                setLoading(true);
                setError("");

                const response =
                    await apiFetch(
                        "/auth/profile/"
                    );

                const data =
                    await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.detail ||
                        "Unable to load profile."
                    );
                }

                setProfile(data);

                setBioInput(
                    data.bio || ""
                );

                setSkillsInput(
                    (
                        data.skills || []
                    ).join(", ")
                );

                setProfessionalLinks({
                    github_url:
                        data.github_url ||
                        "",

                    linkedin_url:
                        data.linkedin_url ||
                        "",

                    portfolio_url:
                        data.portfolio_url ||
                        "",
                });

            } catch (error) {
                console.error(
                    "Profile fetch error:",
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
                        "Unable to load profile."
                    );
                }

            } finally {
                setLoading(false);
            }
        };


    /* ======================================================
       EDUCATION / EXPERIENCE COUNTS
       ====================================================== */

    const fetchProfileCounts =
        async () => {

            try {
                const [
                    educationResponse,
                    experienceResponse,
                ] =
                    await Promise.all([
                        apiFetch(
                            "/auth/education/"
                        ),

                        apiFetch(
                            "/auth/experience/"
                        ),
                    ]);


                if (
                    educationResponse.ok
                ) {
                    const educationData =
                        await educationResponse.json();

                    setEducationCount(
                        Array.isArray(
                            educationData
                        )
                            ? educationData.length
                            : educationData
                                  .results
                                  ?.length || 0
                    );
                }


                if (
                    experienceResponse.ok
                ) {
                    const experienceData =
                        await experienceResponse.json();

                    setExperienceCount(
                        Array.isArray(
                            experienceData
                        )
                            ? experienceData.length
                            : experienceData
                                  .results
                                  ?.length || 0
                    );
                }

            } catch (error) {
                console.error(
                    "Profile count fetch error:",
                    error
                );
            }
        };


    useEffect(() => {
        fetchProfile();
        fetchProfileCounts();
    }, []);


    /* ======================================================
       SAVE ABOUT
       ====================================================== */

    const handleSaveBio =
        async () => {

            try {
                setSaving(true);
                setMessage("");
                setError("");

                const response =
                    await apiFetch(
                        "/auth/profile/",
                        {
                            method: "PATCH",

                            headers: {
                                "Content-Type":
                                    "application/json",
                            },

                            body:
                                JSON.stringify({
                                    bio: bioInput,
                                }),
                        }
                    );

                const data =
                    await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.detail ||
                        "Unable to save About Me."
                    );
                }

                setProfile(data);

                setBioInput(
                    data.bio || ""
                );

                setEditingBio(false);

                setMessage(
                    "About Me updated successfully."
                );

            } catch (error) {
                console.error(
                    "Bio update error:",
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
                        "Unable to save About Me."
                    );
                }

            } finally {
                setSaving(false);
            }
        };


    /* ======================================================
       SAVE SKILLS
       ====================================================== */

    const handleSaveSkills =
        async () => {

            try {
                setSaving(true);
                setMessage("");
                setError("");

                const skills =
                    skillsInput
                        .split(",")
                        .map(
                            (skill) =>
                                skill.trim()
                        )
                        .filter(
                            (skill) =>
                                skill.length >
                                0
                        );

                const uniqueSkills = [
                    ...new Set(skills),
                ];

                const response =
                    await apiFetch(
                        "/auth/profile/",
                        {
                            method: "PATCH",

                            headers: {
                                "Content-Type":
                                    "application/json",
                            },

                            body:
                                JSON.stringify({
                                    skills:
                                        uniqueSkills,
                                }),
                        }
                    );

                const data =
                    await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.detail ||
                        "Unable to save skills."
                    );
                }

                setProfile(data);

                setSkillsInput(
                    (
                        data.skills || []
                    ).join(", ")
                );

                setMessage(
                    "Skills updated successfully."
                );

            } catch (error) {
                console.error(
                    "Skills update error:",
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
                        "Unable to save skills."
                    );
                }

            } finally {
                setSaving(false);
            }
        };


    /* ======================================================
       PROFESSIONAL LINKS
       ====================================================== */

    const handleProfessionalLinkChange =
        (event) => {

            const {
                name,
                value,
            } = event.target;

            setProfessionalLinks(
                (previousLinks) => ({
                    ...previousLinks,
                    [name]: value,
                })
            );
        };


    const handleSaveProfessionalLinks =
        async () => {

            try {
                setSaving(true);
                setMessage("");
                setError("");

                const response =
                    await apiFetch(
                        "/auth/profile/",
                        {
                            method: "PATCH",

                            headers: {
                                "Content-Type":
                                    "application/json",
                            },

                            body:
                                JSON.stringify(
                                    professionalLinks
                                ),
                        }
                    );

                const data =
                    await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.detail ||
                        "Unable to save professional links."
                    );
                }

                setProfile(data);

setProfessionalLinks({
    github_url:
        data.github_url || "",

    linkedin_url:
        data.linkedin_url || "",
});

                setMessage(
                    "Professional links updated successfully."
                );

            } catch (error) {
                console.error(
                    "Professional links update error:",
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
                        "Unable to save professional links."
                    );
                }

            } finally {
                setSaving(false);
            }
        };


    /* ======================================================
       RESUME
       ====================================================== */

    const handleResumeUpload =
        async () => {

            if (!resumeFile) {
                setError(
                    "Please select a resume file first."
                );

                return;
            }


            try {
                setUploadingResume(
                    true
                );

                setMessage("");
                setError("");

                const formData =
                    new FormData();

                formData.append(
                    "resume",
                    resumeFile
                );

                const response =
                    await apiFetch(
                        "/auth/profile/",
                        {
                            method: "PATCH",
                            body: formData,
                        }
                    );

                const data =
                    await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.detail ||
                        "Unable to upload resume."
                    );
                }

                setProfile(data);

                setResumeFile(null);

                setMessage(
                    "Resume uploaded successfully."
                );

            } catch (error) {
                console.error(
                    "Resume upload error:",
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
                        "Unable to upload resume."
                    );
                }

            } finally {
                setUploadingResume(
                    false
                );
            }
        };


    const getResumeUrl = () => {

        if (!profile?.resume) {
            return null;
        }

        if (
            profile.resume.startsWith(
                "http"
            )
        ) {
            return profile.resume;
        }

        return `${API_ROOT_URL}${profile.resume}`;
    };


    /* ======================================================
       LOADING
       ====================================================== */

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
                                h-8
                                w-48
                                rounded
                                bg-[#E3ECE8]
                            "
                        />


                        <div
                            className="
                                mt-4
                                h-4
                                w-80
                                max-w-full
                                rounded
                                bg-[#EDF3F0]
                            "
                        />

                    </div>


                    <div
                        className="
                            mt-8
                            grid
                            gap-8
                            lg:grid-cols-[320px_minmax(0,1fr)]
                        "
                    >

                        <div
                            className="
                                h-[430px]
                                animate-pulse
                                rounded-[22px]
                                border
                                border-[#DCE8E2]
                                bg-white/95
                            "
                        />


                        <div
                            className="
                                space-y-6
                            "
                        >

                            {[1, 2, 3].map(
                                (item) => (

                                <div
                                    key={
                                        item
                                    }
                                    className="
                                        h-52
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

                    </div>

                </div>

            </div>
        );
    }


    /* ======================================================
       UI
       ====================================================== */

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
                        h-56
                        w-[70%]
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
                            md:flex-row
                            md:items-end
                            md:justify-between
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
                                CareerSync Profile
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
                                My Profile
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
                                Build a clear and
                                complete professional
                                profile that helps
                                recruiters understand
                                your skills and
                                experience.
                            </p>

                        </div>


                        <Link
                            to="/dashboard"
                            className="
                                inline-flex
                                min-h-11
                                items-center
                                justify-center
                                gap-2
                                self-start
                                rounded-xl
                                border
                                border-[#D5E5DD]
                                bg-white/90
                                px-5
                                text-sm
                                font-medium
                                text-[#616E68]
                                transition-all
                                duration-200
                                hover:border-[#AAD8C1]
                                hover:bg-[#F0FAF5]
                                hover:text-[#009944]
                                md:self-auto
                            "
                        >

                            <ArrowLeft
                                className="
                                    h-4
                                    w-4
                                "
                            />

                            Back to Dashboard

                        </Link>

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

                {/* ALERTS */}

                {error && (

                    <div
                        role="alert"
                        className="
                            mb-6
                            flex
                            items-start
                            gap-3
                            rounded-xl
                            border
                            border-[#EFDADA]
                            bg-[#FFF7F7]
                            px-5
                            py-4
                            text-sm
                            text-[#985858]
                        "
                    >

                        <AlertCircle
                            className="
                                mt-0.5
                                h-4
                                w-4
                                shrink-0
                            "
                        />

                        <span>
                            {error}
                        </span>

                    </div>

                )}


                {message && (

                    <div
                        className="
                            mb-6
                            flex
                            items-start
                            gap-3
                            rounded-xl
                            border
                            border-[#CAE6D8]
                            bg-[#EFF9F4]
                            px-5
                            py-4
                            text-sm
                            text-[#347457]
                        "
                    >

                        <CheckCircle2
                            className="
                                mt-0.5
                                h-4
                                w-4
                                shrink-0
                                text-[#009944]
                            "
                        />

                        <span>
                            {message}
                        </span>

                    </div>

                )}


                <div
                    className="
                        grid
                        gap-8
                        lg:grid-cols-[320px_minmax(0,1fr)]
                    "
                >

                    {/* =================================================
                        LEFT
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

                            {/* PROFILE CARD */}

                            <div
                                className="
                                    rounded-[22px]
                                    border
                                    border-[#DCE8E2]
                                    bg-white/95
                                    p-6
                                    shadow-[0_8px_24px_rgba(25,70,52,0.04)]
                                    backdrop-blur-sm
                                "
                            >

                                <ProfilePhoto
                                    profile={
                                        profile
                                    }
                                    onPhotoUpdated={
                                        setProfile
                                    }
                                />


                                <div
                                    className="
                                        mt-5
                                        text-center
                                    "
                                >

                                    <h2
                                        className="
                                            font-sans
                                            text-[22px]
                                            font-semibold
                                            tracking-[-0.02em]
                                            text-[#282C34]
                                        "
                                    >
                                        {profile
                                            ?.full_name ||
                                            "User"}
                                    </h2>


                                    <p
                                        className="
                                            mt-1.5
                                            text-sm
                                            leading-6
                                            text-[#65716B]
                                        "
                                    >
                                        {profile
                                            ?.headline ||
                                            "Add your professional headline"}
                                    </p>


                                    <div
                                        className="
                                            mt-3
                                            flex
                                            items-center
                                            justify-center
                                            gap-1.5
                                            text-sm
                                            text-[#87928C]
                                        "
                                    >

                                        <MapPin
                                            className="
                                                h-4
                                                w-4
                                                text-[#26916B]
                                            "
                                        />

                                        <span>
                                            {profile
                                                ?.location ||
                                                "Location not added"}
                                        </span>

                                    </div>

                                </div>


                                <div
                                    className="
                                        mt-6
                                        grid
                                        grid-cols-3
                                        gap-2
                                        border-y
                                        border-[#E7EFEB]
                                        py-5
                                    "
                                >

                                    <MiniStat
                                        value={
                                            profile
                                                ?.skills
                                                ?.length ||
                                            0
                                        }
                                        label="Skills"
                                    />


                                    <MiniStat
                                        value={
                                            educationCount
                                        }
                                        label="Education"
                                    />


                                    <MiniStat
                                        value={
                                            experienceCount
                                        }
                                        label="Experience"
                                    />

                                </div>


                                <div
                                    className="
                                        mt-6
                                    "
                                >

                                    <ProfileCompletion
                                        profile={
                                            profile
                                        }
                                        educationCount={
                                            educationCount
                                        }
                                        experienceCount={
                                            experienceCount
                                        }
                                    />

                                </div>

                            </div>


                            {/* PROFILE TIP */}

                            <div
                                className="
                                    rounded-[18px]
                                    border
                                    border-[#CEE8DB]
                                    bg-[#F1FBF6]/95
                                    p-5
                                    shadow-[0_6px_18px_rgba(25,70,52,0.025)]
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
                                            text-[#008C42]
                                        "
                                    >

                                        <Sparkles
                                            className="
                                                h-4
                                                w-4
                                            "
                                        />

                                    </div>


                                    <div>

                                        <p
                                            className="
                                                text-sm
                                                font-medium
                                                text-[#486359]
                                            "
                                        >
                                            Profile tip
                                        </p>


                                        <p
                                            className="
                                                mt-1
                                                text-xs
                                                leading-5
                                                text-[#72847B]
                                            "
                                        >
                                            Keep your skills,
                                            resume, education and
                                            experience updated so
                                            recruiters see current
                                            information.
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </aside>


                    {/* =================================================
                        RIGHT
                    ================================================= */}

                    <div
                        className="
                            min-w-0
                            space-y-6
                        "
                    >

                        {/* =================================================
                            ABOUT
                        ================================================= */}

                        <ProfileCard>

                            <CardHeader
                                icon={
                                    UserRound
                                }
                                eyebrow="Introduction"
                                title="About Me"
                                description="Tell recruiters about your background, strengths and career goals."
                            >

                                {!editingBio && (

                                    <SecondaryButton
                                        onClick={() => {
                                            setBioInput(
                                                profile
                                                    ?.bio ||
                                                ""
                                            );

                                            setEditingBio(
                                                true
                                            );

                                            setMessage(
                                                ""
                                            );

                                            setError(
                                                ""
                                            );
                                        }}
                                        icon={
                                            Pencil
                                        }
                                    >
                                        Edit
                                    </SecondaryButton>

                                )}

                            </CardHeader>


                            {editingBio ? (

                                <div
                                    className="
                                        mt-6
                                    "
                                >

                                    <textarea
                                        value={
                                            bioInput
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setBioInput(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        rows="6"
                                        maxLength="1000"
                                        placeholder="Write a short professional introduction about your experience, strengths and career goals..."
                                        className="
                                            w-full
                                            resize-y
                                            rounded-xl
                                            border
                                            border-[#D7E4DE]
                                            bg-[#FCFEFD]
                                            px-4
                                            py-3
                                            text-[15px]
                                            leading-7
                                            text-[#3E444D]
                                            outline-none
                                            transition-all
                                            placeholder:text-[#A0AAA5]
                                            focus:border-[#0D99FF]
                                            focus:ring-4
                                            focus:ring-[#0D99FF]/10
                                        "
                                    />


                                    <div
                                        className="
                                            mt-2
                                            flex
                                            justify-end
                                        "
                                    >

                                        <span
                                            className="
                                                text-xs
                                                text-[#909A95]
                                            "
                                        >
                                            {
                                                bioInput.length
                                            }
                                            /1000
                                        </span>

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

                                        <PrimaryButton
                                            onClick={
                                                handleSaveBio
                                            }
                                            disabled={
                                                saving
                                            }
                                            icon={
                                                Save
                                            }
                                        >
                                            {saving
                                                ? "Saving..."
                                                : "Save About Me"}
                                        </PrimaryButton>


                                        <button
                                            type="button"
                                            onClick={() => {
                                                setBioInput(
                                                    profile
                                                        ?.bio ||
                                                    ""
                                                );

                                                setEditingBio(
                                                    false
                                                );
                                            }}
                                            className="
                                                min-h-11
                                                rounded-xl
                                                border
                                                border-[#D8E5DF]
                                                bg-white
                                                px-5
                                                text-sm
                                                font-medium
                                                text-[#646F69]
                                                transition-all
                                                duration-200
                                                hover:border-[#ABD8C1]
                                                hover:bg-[#F0FAF5]
                                                hover:text-[#009944]
                                            "
                                        >
                                            Cancel
                                        </button>

                                    </div>

                                </div>


                            ) : profile?.bio ? (

                                <p
                                    className="
                                        mt-6
                                        whitespace-pre-line
                                        text-[15px]
                                        leading-8
                                        text-[#626E68]
                                    "
                                >
                                    {profile.bio}
                                </p>


                            ) : (

                                <EmptyProfileField
                                    text="Your professional introduction has not been added yet."
                                    buttonText="Add About Me"
                                    onClick={() => {
                                        setBioInput(
                                            ""
                                        );

                                        setEditingBio(
                                            true
                                        );
                                    }}
                                />

                            )}

                        </ProfileCard>


                        {/* =================================================
                            SKILLS
                        ================================================= */}

                        <ProfileCard>

                            <CardHeader
                                icon={
                                    BriefcaseBusiness
                                }
                                eyebrow="Expertise"
                                title="Skills"
                                description="Add the main technologies and professional skills recruiters should notice."
                            >

                                <PrimaryButton
                                    onClick={
                                        handleSaveSkills
                                    }
                                    disabled={
                                        saving
                                    }
                                    icon={
                                        Save
                                    }
                                    small
                                >
                                    {saving
                                        ? "Saving..."
                                        : "Save Skills"}
                                </PrimaryButton>

                            </CardHeader>


                            <div
                                className="
                                    mt-6
                                "
                            >

                                <label
                                    htmlFor="profile-skills"
                                    className="
                                        mb-2
                                        block
                                        text-sm
                                        font-medium
                                        text-[#535F59]
                                    "
                                >
                                    Skills separated by commas
                                </label>


                                <input
                                    id="profile-skills"
                                    type="text"
                                    value={
                                        skillsInput
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setSkillsInput(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    placeholder="React, JavaScript, Python, Django, PostgreSQL"
                                    className="
                                        min-h-12
                                        w-full
                                        rounded-xl
                                        border
                                        border-[#D7E4DE]
                                        bg-[#FCFEFD]
                                        px-4
                                        text-sm
                                        text-[#3E444D]
                                        outline-none
                                        transition-all
                                        placeholder:text-[#A0AAA5]
                                        focus:border-[#0D99FF]
                                        focus:ring-4
                                        focus:ring-[#0D99FF]/10
                                    "
                                />


                                <div
                                    className="
                                        mt-5
                                        flex
                                        flex-wrap
                                        gap-2
                                    "
                                >

                                    {profile
                                        ?.skills
                                        ?.length >
                                    0 ? (

                                        profile.skills.map(
                                            (
                                                skill,
                                                index
                                            ) => (

                                            <span
                                                key={`${skill}-${index}`}
                                                className="
                                                    rounded-full
                                                    border
                                                    border-[#D8E8E1]
                                                    bg-[#F3FAF6]
                                                    px-3.5
                                                    py-1.5
                                                    text-sm
                                                    font-medium
                                                    text-[#5A6962]
                                                "
                                            >
                                                {
                                                    skill
                                                }
                                            </span>

                                            )
                                        )

                                    ) : (

                                        <p
                                            className="
                                                text-sm
                                                text-[#8B958F]
                                            "
                                        >
                                            No skills added yet.
                                        </p>

                                    )}

                                </div>

                            </div>

                        </ProfileCard>


{/* =================================================
    PROFESSIONAL LINKS
================================================= */}

<ProfileCard>

    <CardHeader
        icon={
            Globe2
        }
        eyebrow="Online Presence"
        title="Professional Links"
        description="Share profiles recruiters can use to learn more about you."
    >

        <PrimaryButton
            onClick={
                handleSaveProfessionalLinks
            }
            disabled={
                saving
            }
            icon={
                Save
            }
            small
        >
            {saving
                ? "Saving..."
                : "Save Links"}
        </PrimaryButton>

    </CardHeader>


    <div
        className="
            mt-6
            space-y-4
        "
    >

        <LinkInput
            icon={
                Code2
            }
            label="GitHub"
            name="github_url"
            value={
                professionalLinks.github_url
            }
            placeholder="https://github.com/username"
            onChange={
                handleProfessionalLinkChange
            }
        />


        <LinkInput
            icon={
                Link2
            }
            label="LinkedIn"
            name="linkedin_url"
            value={
                professionalLinks.linkedin_url
            }
            placeholder="https://linkedin.com/in/username"
            onChange={
                handleProfessionalLinkChange
            }
        />

    </div>


    {(
        profile?.github_url ||
        profile?.linkedin_url
    ) && (

        <div
            className="
                mt-6
                flex
                flex-wrap
                gap-2
                border-t
                border-[#E6EFEA]
                pt-5
            "
        >

            {profile?.github_url && (

                <ExternalProfileLink
                    href={
                        profile.github_url
                    }
                    icon={
                        Code2
                    }
                    label="GitHub"
                />

            )}


            {profile?.linkedin_url && (

                <ExternalProfileLink
                    href={
                        profile.linkedin_url
                    }
                    icon={
                        Link2
                    }
                    label="LinkedIn"
                />

            )}

        </div>

    )}

</ProfileCard>


                        {/* =================================================
                            EDUCATION
                        ================================================= */}

                        <div>
                            <EducationSection
                                onCountChange={
                                    setEducationCount
                                }
                            />
                        </div>


                        {/* =================================================
                            EXPERIENCE
                        ================================================= */}

                        <div>
                            <ExperienceSection
                                onCountChange={
                                    setExperienceCount
                                }
                            />
                        </div>


                        {/* =================================================
                            RESUME
                        ================================================= */}

                        <ProfileCard>

                            <CardHeader
                                icon={
                                    FileText
                                }
                                eyebrow="Career Document"
                                title="Resume"
                                description="Keep your latest resume ready for applications and recruiters."
                            />


                            <div
                                className="
                                    mt-6
                                    rounded-[18px]
                                    border
                                    border-[#DDE9E3]
                                    bg-[#F7FCF9]
                                    p-5
                                "
                            >

                                <div
                                    className="
                                        flex
                                        flex-col
                                        gap-5
                                        sm:flex-row
                                        sm:items-center
                                        sm:justify-between
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

                                        <div
                                            className="
                                                flex
                                                h-11
                                                w-11
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-xl
                                                bg-[#EAF7F1]
                                                text-[#26815F]
                                            "
                                        >

                                            <FileText
                                                className="
                                                    h-5
                                                    w-5
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
                                                    text-[#414A45]
                                                "
                                            >
                                                {profile
                                                    ?.resume
                                                    ? "Resume uploaded"
                                                    : "No resume uploaded"}
                                            </p>


                                            <p
                                                className="
                                                    mt-1
                                                    text-xs
                                                    leading-5
                                                    text-[#808C86]
                                                "
                                            >
                                                PDF, DOC or DOCX
                                                format.
                                            </p>


                                            {profile
                                                ?.resume && (

                                                <a
                                                    href={
                                                        getResumeUrl()
                                                    }
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="
                                                        mt-2
                                                        inline-flex
                                                        items-center
                                                        gap-1.5
                                                        text-sm
                                                        font-medium
                                                        text-[#0D99FF]
                                                        transition-colors
                                                        hover:text-[#009944]
                                                    "
                                                >

                                                    View Resume

                                                    <ExternalLink
                                                        className="
                                                            h-3.5
                                                            w-3.5
                                                        "
                                                    />

                                                </a>

                                            )}

                                        </div>

                                    </div>


                                    <label
                                        htmlFor="resume-upload"
                                        className="
                                            inline-flex
                                            min-h-11
                                            cursor-pointer
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
                                            text-[#606C66]
                                            transition-all
                                            duration-200
                                            hover:border-[#AAD8C1]
                                            hover:bg-[#F0FAF5]
                                            hover:text-[#009944]
                                        "
                                    >

                                        <UploadCloud
                                            className="
                                                h-4
                                                w-4
                                            "
                                        />

                                        Choose File

                                    </label>


                                    <input
                                        id="resume-upload"
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={(
                                            event
                                        ) =>
                                            setResumeFile(
                                                event
                                                    .target
                                                    .files?.[0] ||
                                                null
                                            )
                                        }
                                        className="
                                            hidden
                                        "
                                    />

                                </div>


                                {resumeFile && (

                                    <div
                                        className="
                                            mt-5
                                            flex
                                            flex-col
                                            gap-4
                                            border-t
                                            border-[#DFEAE5]
                                            pt-5
                                            sm:flex-row
                                            sm:items-center
                                            sm:justify-between
                                        "
                                    >

                                        <div
                                            className="
                                                min-w-0
                                            "
                                        >

                                            <p
                                                className="
                                                    text-xs
                                                    text-[#87938D]
                                                "
                                            >
                                                Selected file
                                            </p>


                                            <p
                                                className="
                                                    mt-1
                                                    truncate
                                                    text-sm
                                                    font-medium
                                                    text-[#48524D]
                                                "
                                            >
                                                {
                                                    resumeFile.name
                                                }
                                            </p>

                                        </div>


                                        <PrimaryButton
                                            onClick={
                                                handleResumeUpload
                                            }
                                            disabled={
                                                uploadingResume ||
                                                !resumeFile
                                            }
                                            icon={
                                                UploadCloud
                                            }
                                        >
                                            {uploadingResume
                                                ? "Uploading..."
                                                : "Upload Resume"}
                                        </PrimaryButton>

                                    </div>

                                )}

                            </div>

                        </ProfileCard>

                    </div>

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
   PRIMARY BUTTON
   ========================================================= */

function PrimaryButton({
    children,
    onClick,
    disabled,
    icon: Icon,
    small = false,
}) {
    return (
        <button
            type="button"
            onClick={
                onClick
            }
            disabled={
                disabled
            }
            className={`
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#0D99FF]
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
                disabled:cursor-not-allowed
                disabled:opacity-50
                disabled:hover:translate-y-0
                ${
                    small
                        ? "min-h-10 px-4"
                        : "min-h-11 px-5"
                }
            `}
        >

            {Icon && (
                <Icon
                    className="
                        h-4
                        w-4
                    "
                />
            )}

            {children}

        </button>
    );
}


/* =========================================================
   SECONDARY BUTTON
   ========================================================= */

function SecondaryButton({
    children,
    onClick,
    icon: Icon,
}) {
    return (
        <button
            type="button"
            onClick={
                onClick
            }
            className="
                inline-flex
                min-h-10
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-[#D6E5DE]
                bg-white
                px-4
                text-sm
                font-medium
                text-[#606C66]
                transition-all
                duration-200
                hover:border-[#AAD8C1]
                hover:bg-[#F0FAF5]
                hover:text-[#009944]
            "
        >

            {Icon && (
                <Icon
                    className="
                        h-4
                        w-4
                    "
                />
            )}

            {children}

        </button>
    );
}


/* =========================================================
   PROFILE CARD
   ========================================================= */

function ProfileCard({
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
                transition-all
                duration-300
                hover:border-[#C7DED3]
                hover:shadow-[0_12px_28px_rgba(25,70,52,0.055)]
                sm:p-6
                lg:p-7
            "
        >
            {children}
        </section>
    );
}


/* =========================================================
   CARD HEADER
   ========================================================= */

function CardHeader({
    icon: Icon,
    eyebrow,
    title,
    description,
    children,
}) {
    return (
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
                    flex
                    min-w-0
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
                            font-sans
                            text-[22px]
                            font-semibold
                            tracking-[-0.02em]
                            text-[#282C34]
                        "
                    >
                        {title}
                    </h2>


                    <p
                        className="
                            mt-1.5
                            max-w-xl
                            text-sm
                            leading-6
                            text-[#737F79]
                        "
                    >
                        {description}
                    </p>

                </div>

            </div>


            {children && (

                <div
                    className="
                        shrink-0
                        sm:pt-1
                    "
                >
                    {children}
                </div>

            )}

        </div>
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
                text-center
            "
        >

            <p
                className="
                    text-lg
                    font-semibold
                    text-[#36413B]
                "
            >
                {value}
            </p>


            <p
                className="
                    mt-0.5
                    text-[11px]
                    text-[#88938D]
                "
            >
                {label}
            </p>

        </div>
    );
}


/* =========================================================
   EMPTY PROFILE FIELD
   ========================================================= */

function EmptyProfileField({
    text,
    buttonText,
    onClick,
}) {
    return (
        <div
            className="
                mt-6
                rounded-[16px]
                border
                border-dashed
                border-[#CFE1D8]
                bg-[#F6FBF8]
                p-6
                text-center
            "
        >

            <p
                className="
                    text-sm
                    leading-6
                    text-[#7A8680]
                "
            >
                {text}
            </p>


            <button
                type="button"
                onClick={
                    onClick
                }
                className="
                    mt-3
                    inline-flex
                    items-center
                    gap-1.5
                    text-sm
                    font-medium
                    text-[#0D99FF]
                    transition-colors
                    hover:text-[#009944]
                "
            >

                <Pencil
                    className="
                        h-3.5
                        w-3.5
                    "
                />

                {buttonText}

            </button>

        </div>
    );
}


/* =========================================================
   LINK INPUT
   ========================================================= */

function LinkInput({
    icon: Icon,
    label,
    name,
    value,
    placeholder,
    onChange,
}) {
    return (
        <div>

            <label
                className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-[#535F59]
                "
            >
                {label}
            </label>


            <div
                className="
                    flex
                    min-h-12
                    items-center
                    gap-3
                    rounded-xl
                    border
                    border-[#D7E4DE]
                    bg-[#FCFEFD]
                    px-4
                    transition-all
                    focus-within:border-[#0D99FF]
                    focus-within:ring-4
                    focus-within:ring-[#0D99FF]/10
                "
            >

                <Icon
                    className="
                        h-[18px]
                        w-[18px]
                        shrink-0
                        text-[#26815F]
                    "
                />


                <input
                    type="url"
                    name={
                        name
                    }
                    value={
                        value
                    }
                    onChange={
                        onChange
                    }
                    placeholder={
                        placeholder
                    }
                    className="
                        min-w-0
                        flex-1
                        bg-transparent
                        text-sm
                        text-[#3E444D]
                        outline-none
                        placeholder:text-[#A0AAA5]
                    "
                />

            </div>

        </div>
    );
}


/* =========================================================
   EXTERNAL PROFILE LINK
   ========================================================= */

function ExternalProfileLink({
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
                inline-flex
                min-h-9
                items-center
                gap-2
                rounded-xl
                border
                border-[#D5E5DD]
                bg-white
                px-3.5
                text-sm
                font-medium
                text-[#606C66]
                transition-all
                duration-200
                hover:border-[#AAD8C1]
                hover:bg-[#F0FAF5]
                hover:text-[#009944]
            "
        >

            <Icon
                className="
                    h-4
                    w-4
                "
            />

            {label}

            <ExternalLink
                className="
                    h-3
                    w-3
                    text-[#96A19B]
                "
            />

        </a>
    );
}


export default Profile;