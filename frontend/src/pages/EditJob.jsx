import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Link,
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    AlertCircle,
    ArrowLeft,
    BriefcaseBusiness,
    Building2,
    CheckCircle2,
    FileText,
    IndianRupee,
    Lock,
    MapPin,
    Save,
    Sparkles,
    UploadCloud,
    X,
} from "lucide-react";

import { apiFetch } from "../api";


/* =========================================================
   HELPERS
   ========================================================= */

function formatFieldName(field) {
    return field
        .replaceAll("_", " ")
        .replace(
            /\b\w/g,
            (letter) =>
                letter.toUpperCase()
        );
}


function extractApiError(
    data,
    fallback = "Unable to update job."
) {
    if (!data) {
        return fallback;
    }

    if (typeof data === "string") {
        return data;
    }

    if (
        typeof data.detail ===
        "string"
    ) {
        return data.detail;
    }


    const messages = [];


    Object.entries(data).forEach(
        ([field, value]) => {

            if (
                Array.isArray(value)
            ) {
                value.forEach(
                    (message) => {

                        if (
                            typeof message ===
                            "string"
                        ) {
                            messages.push(
                                `${formatFieldName(
                                    field
                                )}: ${message}`
                            );
                        }
                    }
                );

            } else if (
                typeof value ===
                "string"
            ) {
                messages.push(
                    `${formatFieldName(
                        field
                    )}: ${value}`
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
   EDIT JOB
   ========================================================= */

function EditJob() {
    const { id } =
        useParams();


    const navigate =
        useNavigate();


    const [
        job,
        setJob,
    ] = useState(null);


    const [
        formData,
        setFormData,
    ] = useState({
        job_type: "",
        salary: "",
        experience: "",
        description: "",
        skills: "",
    });


    const [
        companyLogo,
        setCompanyLogo,
    ] = useState(null);


    const [
        logoPreview,
        setLogoPreview,
    ] = useState("");


    const [
        loading,
        setLoading,
    ] = useState(true);


    const [
        saving,
        setSaving,
    ] = useState(false);


    const [
        error,
        setError,
    ] = useState("");


    const [
        success,
        setSuccess,
    ] = useState("");


    /* =====================================================
       LOAD JOB
       ===================================================== */

    useEffect(() => {
        let cancelled = false;


        const loadJob =
            async () => {

                try {
                    setLoading(true);
                    setError("");


                    const [
                        jobResponse,
                        recruiterResponse,
                    ] =
                        await Promise.all([
                            apiFetch(
                                `/jobs/${id}/`
                            ),

                            apiFetch(
                                "/recruiter/jobs/"
                            ),
                        ]);


                    const jobData =
                        await jobResponse.json();


                    if (!jobResponse.ok) {
                        throw new Error(
                            jobData.detail ||
                            "Unable to load job."
                        );
                    }


                    const recruiterData =
                        await recruiterResponse.json();


                    if (
                        !recruiterResponse.ok
                    ) {
                        throw new Error(
                            recruiterData.detail ||
                            "Unable to verify job ownership."
                        );
                    }


                    const recruiterJobs =
                        Array.isArray(
                            recruiterData
                        )
                            ? recruiterData
                            : recruiterData.results ||
                              [];


                    const ownedJob =
                        recruiterJobs.find(
                            (
                                recruiterJob
                            ) =>
                                Number(
                                    recruiterJob.id
                                ) ===
                                Number(id)
                        );


                    if (!ownedJob) {
                        throw new Error(
                            "You do not have permission to edit this job."
                        );
                    }


                    if (cancelled) {
                        return;
                    }


                    const currentJob =
                        ownedJob ||
                        jobData;


                    setJob(
                        currentJob
                    );


                    setFormData({
                        job_type:
                            currentJob.job_type ||
                            "",

                        salary:
                            currentJob.salary ||
                            "",

                        experience:
                            currentJob.experience ||
                            "",

                        description:
                            currentJob.description ||
                            "",

                        skills:
                            Array.isArray(
                                currentJob.skills
                            )
                                ? currentJob.skills.join(
                                      ", "
                                  )
                                : "",
                    });

                } catch (error) {
                    console.error(
                        "Edit job load error:",
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
                            "Unable to load job."
                        );
                    }

                } finally {
                    if (!cancelled) {
                        setLoading(false);
                    }
                }
            };


        loadJob();


        return () => {
            cancelled = true;
        };

    }, [id]);


    /* =====================================================
       LOGO CLEANUP
       ===================================================== */

    useEffect(() => {
        return () => {
            if (logoPreview) {
                URL.revokeObjectURL(
                    logoPreview
                );
            }
        };
    }, [logoPreview]);


    /* =====================================================
       SKILLS
       ===================================================== */

    const parsedSkills =
        useMemo(
            () => {

                const values =
                    formData.skills
                        .split(",")
                        .map(
                            (skill) =>
                                skill.trim()
                        )
                        .filter(Boolean);


                return [
                    ...new Set(
                        values
                    ),
                ];

            },
            [formData.skills]
        );


    /* =====================================================
       INPUT CHANGE
       ===================================================== */

    const handleChange = (
        event
    ) => {

        const {
            name,
            value,
        } = event.target;


        setFormData(
            (current) => ({
                ...current,
                [name]: value,
            })
        );


        if (error) {
            setError("");
        }


        if (success) {
            setSuccess("");
        }
    };


    /* =====================================================
       LOGO
       ===================================================== */

    const handleLogoChange = (
        event
    ) => {

        const file =
            event.target.files?.[0];


        if (!file) {
            return;
        }


        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];


        if (
            !allowedTypes.includes(
                file.type
            )
        ) {
            setError(
                "Company logo must be JPG, PNG or WEBP."
            );

            event.target.value = "";

            return;
        }


        if (
            file.size >
            2 * 1024 * 1024
        ) {
            setError(
                "Company logo must be 2 MB or smaller."
            );

            event.target.value = "";

            return;
        }


        if (logoPreview) {
            URL.revokeObjectURL(
                logoPreview
            );
        }


        setCompanyLogo(file);

        setLogoPreview(
            URL.createObjectURL(
                file
            )
        );

        setError("");
    };


    const removeSelectedLogo =
        () => {

            if (logoPreview) {
                URL.revokeObjectURL(
                    logoPreview
                );
            }


            setCompanyLogo(null);
            setLogoPreview("");
        };


    /* =====================================================
       VALIDATION
       ===================================================== */

    const validateForm = () => {

        if (!formData.job_type) {
            return "Job type is required.";
        }


        if (
            !formData.salary.trim()
        ) {
            return "Salary information is required.";
        }


        if (
            !formData.experience.trim()
        ) {
            return "Experience requirement is required.";
        }


        if (
            !formData.description.trim()
        ) {
            return "Job description is required.";
        }


        if (
            parsedSkills.length ===
            0
        ) {
            return "Add at least one required skill.";
        }


        return "";
    };


    /* =====================================================
       SAVE
       ===================================================== */

    const handleSubmit =
        async (event) => {

            event.preventDefault();


            const validationError =
                validateForm();


            if (validationError) {
                setError(
                    validationError
                );

                window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                });

                return;
            }


            try {
                setSaving(true);
                setError("");
                setSuccess("");


                /* ==========================================
                   UPDATE EDITABLE JOB FIELDS
                ========================================== */

                const response =
                    await apiFetch(
                        `/jobs/${id}/`,
                        {
                            method: "PATCH",

                            headers: {
                                "Content-Type":
                                    "application/json",
                            },

                            body:
                                JSON.stringify(
                                    {
                                        job_type:
                                            formData.job_type,

                                        salary:
                                            formData.salary.trim(),

                                        experience:
                                            formData.experience.trim(),

                                        description:
                                            formData.description.trim(),

                                        skills:
                                            parsedSkills,
                                    }
                                ),
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {
                    throw new Error(
                        extractApiError(
                            data
                        )
                    );
                }


                /* ==========================================
                   UPDATE COMPANY LOGO IF CHANGED
                ========================================== */

                if (companyLogo) {
                    const logoFormData =
                        new FormData();


                    logoFormData.append(
                        "company_logo",
                        companyLogo
                    );


                    const logoResponse =
                        await apiFetch(
                            `/jobs/${id}/`,
                            {
                                method:
                                    "PATCH",

                                body:
                                    logoFormData,
                            }
                        );


                    let logoData = null;


                    try {
                        logoData =
                            await logoResponse.json();
                    } catch {
                        logoData = null;
                    }


                    if (
                        !logoResponse.ok
                    ) {
                        throw new Error(
                            extractApiError(
                                logoData,
                                "Job details were updated, but the company logo could not be uploaded."
                            )
                        );
                    }
                }


                setSuccess(
                    "Job updated successfully."
                );


                setTimeout(
                    () => {
                        navigate(
                            `/jobs/${id}`
                        );
                    },
                    500
                );

            } catch (error) {
                console.error(
                    "Edit job error:",
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
                        "Unable to update job."
                    );
                }


                window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                });

            } finally {
                setSaving(false);
            }
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
                        max-w-6xl
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
                                w-52
                                rounded
                                bg-[#E4ECE8]
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
                            mt-7
                            h-[420px]
                            animate-pulse
                            rounded-[24px]
                            border
                            border-[#DCE8E2]
                            bg-white/95
                        "
                    />

                </div>

            </div>
        );
    }


    /* =====================================================
       ERROR / NOT FOUND
       ===================================================== */

    if (
        !job &&
        error
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
                        shadow-[0_12px_34px_rgba(25,70,52,0.055)]
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
                            bg-[#FFF3F3]
                            text-[#A75F5F]
                        "
                    >

                        <AlertCircle
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
                            tracking-[-0.02em]
                            text-[#292D35]
                        "
                    >
                        Unable to edit job
                    </h1>


                    <p
                        className="
                            mt-3
                            text-sm
                            leading-6
                            text-[#737E78]
                        "
                    >
                        {error}
                    </p>


                    <Link
                        to="/recruiter/dashboard"
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

                        Back to Dashboard

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

                    <Link
                        to="/recruiter/dashboard"
                        className="
                            inline-flex
                            items-center
                            gap-2
                            text-sm
                            font-medium
                            text-[#65726C]
                            transition-colors
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
                            max-w-3xl
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
                            Edit Job
                        </h1>


                        <p
                            className="
                                mt-3
                                max-w-2xl
                                text-[15px]
                                leading-7
                                text-[#68746E]
                            "
                        >
                            Update the active details
                            of your job posting while
                            keeping its original
                            identity unchanged.
                        </p>

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

                {/* ERROR */}

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
                            leading-6
                            text-[#A25555]
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

                        {error}

                    </div>

                )}


                {/* SUCCESS */}

                {success && (

                    <div
                        className="
                            mb-6
                            flex
                            items-center
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
                                h-4
                                w-4
                                shrink-0
                                text-[#009944]
                            "
                        />

                        {success}

                    </div>

                )}


                <div
                    className="
                        grid
                        gap-8
                        lg:grid-cols-[minmax(0,1fr)_340px]
                    "
                >

                    {/* =================================================
                        FORM
                    ================================================= */}

                    <form
                        onSubmit={
                            handleSubmit
                        }
                        className="
                            space-y-6
                        "
                    >

                        {/* =============================================
                            LOCKED INFORMATION
                        ============================================= */}

                        <FormCard
                            icon={
                                Lock
                            }
                            eyebrow="Published Identity"
                            title="Locked Information"
                            description="These details identify the original job posting and cannot be changed after publishing."
                        >

                            <div
                                className="
                                    mt-6
                                    grid
                                    gap-5
                                    md:grid-cols-2
                                "
                            >

                                <LockedField
                                    label="Job Title"
                                    value={
                                        job.title
                                    }
                                    icon={
                                        BriefcaseBusiness
                                    }
                                />


                                <LockedField
                                    label="Company"
                                    value={
                                        job.company
                                    }
                                    icon={
                                        Building2
                                    }
                                />


                                <div
                                    className="
                                        md:col-span-2
                                    "
                                >

                                    <LockedField
                                        label="Location"
                                        value={
                                            job.location
                                        }
                                        icon={
                                            MapPin
                                        }
                                    />

                                </div>

                            </div>

                        </FormCard>


                        {/* =============================================
                            JOB SETTINGS
                        ============================================= */}

                        <FormCard
                            icon={
                                BriefcaseBusiness
                            }
                            eyebrow="Role Settings"
                            title="Job Type & Compensation"
                            description="Update the current employment type, salary and experience requirements."
                        >

                            <div
                                className="
                                    mt-6
                                    grid
                                    gap-5
                                    md:grid-cols-2
                                "
                            >

                                <FormField
                                    label="Job Type"
                                    required
                                >

                                    <select
                                        name="job_type"
                                        value={
                                            formData.job_type
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className={
                                            inputClasses
                                        }
                                    >

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

                                </FormField>


                                <FormField
                                    label="Experience"
                                    required
                                >

                                    <input
                                        type="text"
                                        name="experience"
                                        value={
                                            formData.experience
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="e.g. 2-5 years"
                                        className={
                                            inputClasses
                                        }
                                    />

                                </FormField>


                                <div
                                    className="
                                        md:col-span-2
                                    "
                                >

                                    <FormField
                                        label="Salary"
                                        required
                                        help="Use a salary range or a clear descriptive value."
                                    >

                                        <div
                                            className="
                                                relative
                                            "
                                        >

                                            <IndianRupee
                                                className="
                                                    pointer-events-none
                                                    absolute
                                                    left-4
                                                    top-1/2
                                                    h-4
                                                    w-4
                                                    -translate-y-1/2
                                                    text-[#27815F]
                                                "
                                            />


                                            <input
                                                type="text"
                                                name="salary"
                                                value={
                                                    formData.salary
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                placeholder="e.g. ₹6–10 LPA"
                                                className={`${inputClasses} pl-11`}
                                            />

                                        </div>

                                    </FormField>

                                </div>

                            </div>

                        </FormCard>


                        {/* =============================================
                            DESCRIPTION
                        ============================================= */}

                        <FormCard
                            icon={
                                FileText
                            }
                            eyebrow="Opportunity"
                            title="Job Description"
                            description="Keep the role description accurate and useful for candidates."
                        >

                            <div
                                className="
                                    mt-6
                                "
                            >

                                <FormField
                                    label="Description"
                                    required
                                >

                                    <textarea
                                        name="description"
                                        value={
                                            formData.description
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        rows="9"
                                        placeholder="Describe responsibilities, requirements and expectations..."
                                        className={`
                                            ${inputClasses}
                                            resize-y
                                            py-3
                                            leading-7
                                        `}
                                    />

                                </FormField>

                            </div>

                        </FormCard>


                        {/* =============================================
                            SKILLS
                        ============================================= */}

                        <FormCard
                            icon={
                                Sparkles
                            }
                            eyebrow="Candidate Match"
                            title="Required Skills"
                            description="Update the skills candidates should have for this position."
                        >

                            <div
                                className="
                                    mt-6
                                "
                            >

                                <FormField
                                    label="Skills"
                                    required
                                    help="Separate skills with commas."
                                >

                                    <input
                                        type="text"
                                        name="skills"
                                        value={
                                            formData.skills
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Python, Django, PostgreSQL, REST APIs"
                                        className={
                                            inputClasses
                                        }
                                    />

                                </FormField>


                                {parsedSkills.length >
                                    0 && (

                                    <div
                                        className="
                                            mt-4
                                            flex
                                            flex-wrap
                                            gap-2
                                        "
                                    >

                                        {parsedSkills.map(
                                            (skill) => (

                                            <span
                                                key={
                                                    skill
                                                }
                                                className="
                                                    rounded-full
                                                    border
                                                    border-[#D5E7DE]
                                                    bg-[#F2FAF6]
                                                    px-3
                                                    py-1.5
                                                    text-xs
                                                    font-medium
                                                    text-[#557066]
                                                "
                                            >
                                                {skill}
                                            </span>

                                            )
                                        )}

                                    </div>

                                )}

                            </div>

                        </FormCard>


                        {/* =============================================
                            LOGO
                        ============================================= */}

                        <FormCard
                            icon={
                                Building2
                            }
                            eyebrow="Company Identity"
                            title="Company Logo"
                            description="Replace the existing company logo if you want to update its visual identity."
                        >

                            <div
                                className="
                                    mt-6
                                "
                            >

                                <div
                                    className="
                                        flex
                                        flex-col
                                        gap-5
                                        rounded-[18px]
                                        border
                                        border-[#D7E7DF]
                                        bg-[#F7FCF9]
                                        p-5
                                        sm:flex-row
                                        sm:items-center
                                    "
                                >

                                    {/* Preview */}

                                    <div
                                        className="
                                            flex
                                            h-20
                                            w-20
                                            shrink-0
                                            items-center
                                            justify-center
                                            overflow-hidden
                                            rounded-2xl
                                            border
                                            border-[#D7E5DE]
                                            bg-white
                                        "
                                    >

                                        {logoPreview ? (

                                            <img
                                                src={
                                                    logoPreview
                                                }
                                                alt="New company logo preview"
                                                className="
                                                    h-full
                                                    w-full
                                                    object-cover
                                                "
                                            />

                                        ) : job.company_logo ? (

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

                                        ) : (

                                            <Building2
                                                className="
                                                    h-7
                                                    w-7
                                                    text-[#27815F]
                                                "
                                            />

                                        )}

                                    </div>


                                    <div
                                        className="
                                            min-w-0
                                            flex-1
                                        "
                                    >

                                        <p
                                            className="
                                                text-sm
                                                font-medium
                                                text-[#414C46]
                                            "
                                        >
                                            {companyLogo
                                                ? companyLogo.name
                                                : job.company_logo
                                                ? "Current company logo"
                                                : "No company logo"}
                                        </p>


                                        <p
                                            className="
                                                mt-1
                                                text-xs
                                                leading-5
                                                text-[#7E8983]
                                            "
                                        >
                                            JPG, PNG or WEBP
                                            up to 2 MB.
                                        </p>

                                    </div>


                                    <div
                                        className="
                                            flex
                                            flex-wrap
                                            gap-2
                                        "
                                    >

                                        <label
                                            htmlFor="edit-company-logo"
                                            className="
                                                inline-flex
                                                min-h-10
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
                                                text-[#606D66]
                                                transition-all
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

                                            Replace

                                        </label>


                                        {companyLogo && (

                                            <button
                                                type="button"
                                                onClick={
                                                    removeSelectedLogo
                                                }
                                                className="
                                                    inline-flex
                                                    min-h-10
                                                    items-center
                                                    justify-center
                                                    gap-2
                                                    rounded-xl
                                                    border
                                                    border-[#E6D7D7]
                                                    bg-white
                                                    px-4
                                                    text-sm
                                                    font-medium
                                                    text-[#965D5D]
                                                    transition
                                                    hover:bg-[#FFF6F6]
                                                "
                                            >

                                                <X
                                                    className="
                                                        h-4
                                                        w-4
                                                    "
                                                />

                                                Cancel

                                            </button>

                                        )}

                                    </div>


                                    <input
                                        id="edit-company-logo"
                                        type="file"
                                        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                                        onChange={
                                            handleLogoChange
                                        }
                                        className="
                                            hidden
                                        "
                                    />

                                </div>

                            </div>

                        </FormCard>


                        {/* =============================================
                            ACTIONS
                        ============================================= */}

                        <div
                            className="
                                flex
                                flex-col-reverse
                                gap-3
                                rounded-[20px]
                                border
                                border-[#DCE8E2]
                                bg-white/90
                                p-5
                                shadow-[0_8px_24px_rgba(25,70,52,0.035)]
                                backdrop-blur-sm
                                sm:flex-row
                                sm:items-center
                                sm:justify-end
                            "
                        >

                            <Link
                                to={`/jobs/${id}`}
                                className="
                                    inline-flex
                                    min-h-11
                                    items-center
                                    justify-center
                                    rounded-xl
                                    border
                                    border-[#D5E5DD]
                                    bg-white
                                    px-6
                                    text-sm
                                    font-medium
                                    text-[#606D66]
                                    transition-all
                                    duration-200
                                    hover:border-[#AAD8C1]
                                    hover:bg-[#F0FAF5]
                                    hover:text-[#009944]
                                "
                            >
                                Cancel
                            </Link>


                            <button
                                type="submit"
                                disabled={
                                    saving
                                }
                                className="
                                    inline-flex
                                    min-h-11
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    bg-[#0D99FF]
                                    px-7
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
                                    disabled:cursor-not-allowed
                                    disabled:opacity-60
                                    disabled:hover:translate-y-0
                                "
                            >

                                <Save
                                    className="
                                        h-4
                                        w-4
                                    "
                                />

                                {saving
                                    ? "Saving Changes..."
                                    : "Save Changes"}

                            </button>

                        </div>

                    </form>


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

                            {/* PREVIEW */}

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
                                    Job Preview
                                </p>


                                <div
                                    className="
                                        mt-5
                                        flex
                                        items-start
                                        gap-4
                                    "
                                >

                                    <div
                                        className="
                                            flex
                                            h-14
                                            w-14
                                            shrink-0
                                            items-center
                                            justify-center
                                            overflow-hidden
                                            rounded-2xl
                                            border
                                            border-[#DCE7E2]
                                            bg-[#EAF7F1]
                                            text-[#27815F]
                                        "
                                    >

                                        {logoPreview ? (

                                            <img
                                                src={
                                                    logoPreview
                                                }
                                                alt="Preview"
                                                className="
                                                    h-full
                                                    w-full
                                                    object-cover
                                                "
                                            />

                                        ) : job.company_logo ? (

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

                                        ) : (

                                            <Building2
                                                className="
                                                    h-6
                                                    w-6
                                                "
                                            />

                                        )}

                                    </div>


                                    <div
                                        className="
                                            min-w-0
                                        "
                                    >

                                        <h3
                                            className="
                                                break-words
                                                text-[18px]
                                                font-semibold
                                                leading-6
                                                text-[#292D35]
                                            "
                                        >
                                            {job.title}
                                        </h3>


                                        <p
                                            className="
                                                mt-1
                                                break-words
                                                text-sm
                                                text-[#68746E]
                                            "
                                        >
                                            {job.company}
                                        </p>

                                    </div>

                                </div>


                                <div
                                    className="
                                        mt-5
                                        space-y-3
                                        rounded-xl
                                        border
                                        border-[#E4EFE9]
                                        bg-[#F8FCFA]
                                        p-4
                                    "
                                >

                                    <PreviewMeta
                                        icon={
                                            MapPin
                                        }
                                        value={
                                            job.location
                                        }
                                    />


                                    <PreviewMeta
                                        icon={
                                            BriefcaseBusiness
                                        }
                                        value={
                                            formData.job_type
                                        }
                                    />


                                    <PreviewMeta
                                        icon={
                                            IndianRupee
                                        }
                                        value={
                                            formData.salary ||
                                            "Salary not specified"
                                        }
                                    />

                                </div>


                                {parsedSkills.length >
                                    0 && (

                                    <div
                                        className="
                                            mt-5
                                            flex
                                            flex-wrap
                                            gap-2
                                        "
                                    >

                                        {parsedSkills
                                            .slice(
                                                0,
                                                6
                                            )
                                            .map(
                                                (
                                                    skill
                                                ) => (

                                            <span
                                                key={
                                                    skill
                                                }
                                                className="
                                                    rounded-full
                                                    border
                                                    border-[#D9E8E1]
                                                    bg-[#F3FAF6]
                                                    px-3
                                                    py-1
                                                    text-xs
                                                    text-[#5E6D66]
                                                "
                                            >
                                                {skill}
                                            </span>

                                                )
                                            )}

                                    </div>

                                )}

                            </div>


                            {/* LOCK NOTICE */}

                            <div
                                className="
                                    rounded-[18px]
                                    border
                                    border-[#D8E5DF]
                                    bg-white/85
                                    p-5
                                    backdrop-blur-sm
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
                                            bg-[#EEF4F1]
                                            text-[#60756B]
                                        "
                                    >

                                        <Lock
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
                                                text-[#48544E]
                                            "
                                        >
                                            Published details
                                        </p>


                                        <p
                                            className="
                                                mt-1
                                                text-xs
                                                leading-5
                                                text-[#78847E]
                                            "
                                        >
                                            Job title,
                                            company and
                                            location remain
                                            locked after the
                                            job is published.
                                        </p>

                                    </div>

                                </div>

                            </div>


                            {/* TIP */}

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
                                            Editing tip
                                        </p>


                                        <p
                                            className="
                                                mt-1
                                                text-xs
                                                leading-5
                                                text-[#72847B]
                                            "
                                        >
                                            Keep salary,
                                            experience,
                                            skills and the
                                            description
                                            current so
                                            candidates receive
                                            accurate
                                            information.
                                        </p>

                                    </div>

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
   FORM CARD
   ========================================================= */

function FormCard({
    icon: Icon,
    eyebrow,
    title,
    description,
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
                            h-4.5
                            w-4.5
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


                    <p
                        className="
                            mt-1.5
                            max-w-2xl
                            text-sm
                            leading-6
                            text-[#737F79]
                        "
                    >
                        {description}
                    </p>

                </div>

            </div>


            {children}

        </section>
    );
}


/* =========================================================
   FIELD
   ========================================================= */

function FormField({
    label,
    required,
    help,
    children,
}) {
    return (
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
                {label}

                {required && (
                    <span
                        className="
                            ml-1
                            text-[#B65C5C]
                        "
                    >
                        *
                    </span>
                )}

            </label>


            {children}


            {help && (

                <p
                    className="
                        mt-1.5
                        text-xs
                        leading-5
                        text-[#88938D]
                    "
                >
                    {help}
                </p>

            )}

        </div>
    );
}


/* =========================================================
   LOCKED FIELD
   ========================================================= */

function LockedField({
    label,
    value,
    icon: Icon,
}) {
    return (
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
                    border-[#DEE6E2]
                    bg-[#F5F7F6]
                    px-4
                    text-sm
                    text-[#69736E]
                "
            >

                <Icon
                    className="
                        h-4
                        w-4
                        shrink-0
                        text-[#7B8982]
                    "
                />


                <span
                    className="
                        min-w-0
                        flex-1
                        break-words
                    "
                >
                    {value}
                </span>


                <Lock
                    className="
                        h-3.5
                        w-3.5
                        shrink-0
                        text-[#929B96]
                    "
                />

            </div>

        </div>
    );
}


/* =========================================================
   PREVIEW META
   ========================================================= */

function PreviewMeta({
    icon: Icon,
    value,
}) {
    return (
        <div
            className="
                flex
                items-center
                gap-2.5
                text-sm
                text-[#626F68]
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

            <span>
                {value}
            </span>

        </div>
    );
}


/* =========================================================
   INPUT STYLE
   ========================================================= */

const inputClasses = `
    min-h-12
    w-full
    rounded-xl
    border
    border-[#D5E3DC]
    bg-[#FCFEFD]
    px-4
    text-sm
    text-[#3E4843]
    outline-none
    transition-all
    duration-200
    placeholder:text-[#A0AAA5]
    focus:border-[#0D99FF]
    focus:ring-4
    focus:ring-[#0D99FF]/10
`;


export default EditJob;