import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Link,
    useNavigate,
} from "react-router-dom";

import {
    ArrowLeft,
    BriefcaseBusiness,
    Building2,
    CheckCircle2,
    FileText,
    IndianRupee,
    MapPin,
    Sparkles,
    UploadCloud,
    X,
} from "lucide-react";

import { apiFetch } from "../api";


/* =========================================================
   API ERROR
   ========================================================= */

function extractApiError(
    data,
    fallback = "Unable to post job."
) {
    if (!data) {
        return fallback;
    }

    if (typeof data === "string") {
        return data;
    }

    if (data.detail) {
        if (
            typeof data.detail ===
            "string"
        ) {
            return data.detail;
        }
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


function formatFieldName(field) {
    return field
        .replaceAll("_", " ")
        .replace(
            /\b\w/g,
            (letter) =>
                letter.toUpperCase()
        );
}


/* =========================================================
   POST JOB
   ========================================================= */

function PostJob() {
    const navigate =
        useNavigate();


    const [
        formData,
        setFormData,
    ] = useState({
        title: "",
        company: "",
        location: "",
        job_type: "Full Time",
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
        submitting,
        setSubmitting,
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
       LOGO PREVIEW CLEANUP
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
                    ...new Set(values),
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
    };


    /* =====================================================
       COMPANY LOGO
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


        const maxSize =
            2 *
            1024 *
            1024;


        if (
            file.size >
            maxSize
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


    const removeLogo = () => {
        if (logoPreview) {
            URL.revokeObjectURL(
                logoPreview
            );
        }

        setCompanyLogo(null);
        setLogoPreview("");
    };


    /* =====================================================
       VALIDATE
       ===================================================== */

    const validateForm = () => {

        if (
            !formData.title.trim()
        ) {
            return "Job title is required.";
        }


        if (
            !formData.company.trim()
        ) {
            return "Company name is required.";
        }


        if (
            !formData.location.trim()
        ) {
            return "Location is required.";
        }


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
       SUBMIT
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
                setSubmitting(true);
                setError("");
                setSuccess("");


                /*
                 * Create the job using JSON first.
                 * This keeps skills as a real array.
                 */

                const response =
                    await apiFetch(
                        "/jobs/",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json",
                            },

                            body:
                                JSON.stringify(
                                    {
                                        title:
                                            formData.title.trim(),

                                        company:
                                            formData.company.trim(),

                                        location:
                                            formData.location.trim(),

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


                /*
                 * Company logo is uploaded separately
                 * because the main request uses JSON
                 * for the skills array.
                 */

                if (
                    companyLogo &&
                    data.id
                ) {
                    const logoFormData =
                        new FormData();

                    logoFormData.append(
                        "company_logo",
                        companyLogo
                    );


                    const logoResponse =
                        await apiFetch(
                            `/jobs/${data.id}/`,
                            {
                                method:
                                    "PATCH",

                                body:
                                    logoFormData,
                            }
                        );


                    if (
                        !logoResponse.ok
                    ) {
                        let logoData = null;

                        try {
                            logoData =
                                await logoResponse.json();
                        } catch {
                            logoData = null;
                        }


                        window.alert(
                            `Job posted successfully, but the company logo could not be uploaded. ${
                                extractApiError(
                                    logoData,
                                    "You can upload the logo later from Edit Job."
                                )
                            }`
                        );
                    }
                }


                setSuccess(
                    "Job posted successfully."
                );


                navigate(
                    "/recruiter/dashboard"
                );

            } catch (error) {
                console.error(
                    "Post job error:",
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
                        "Unable to post job."
                    );
                }


                window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                });

            } finally {
                setSubmitting(false);
            }
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
                            Post a New Job
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
                            Create a clear job
                            listing with the role,
                            requirements and skills
                            candidates need to know.
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
                            BASIC INFORMATION
                        ============================================= */}

                        <FormCard
                            icon={
                                BriefcaseBusiness
                            }
                            eyebrow="Role Information"
                            title="Job Details"
                            description="Add the basic information candidates will see first."
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
                                    label="Job Title"
                                    required
                                >

                                    <input
                                        type="text"
                                        name="title"
                                        value={
                                            formData.title
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="e.g. Backend Developer"
                                        className={
                                            inputClasses
                                        }
                                    />

                                </FormField>


                                <FormField
                                    label="Company Name"
                                    required
                                >

                                    <input
                                        type="text"
                                        name="company"
                                        value={
                                            formData.company
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="e.g. CareerSync Technologies"
                                        className={
                                            inputClasses
                                        }
                                    />

                                </FormField>


                                <FormField
                                    label="Location"
                                    required
                                >

                                    <div
                                        className="
                                            relative
                                        "
                                    >

                                        <MapPin
                                            className="
                                                pointer-events-none
                                                absolute
                                                left-4
                                                top-1/2
                                                h-4
                                                w-4
                                                -translate-y-1/2
                                                text-[#26815F]
                                            "
                                        />


                                        <input
                                            type="text"
                                            name="location"
                                            value={
                                                formData.location
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="e.g. Pune, Maharashtra"
                                            className={`${inputClasses} pl-11`}
                                        />

                                    </div>

                                </FormField>


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

                            </div>

                        </FormCard>


                        {/* =============================================
                            COMPENSATION
                        ============================================= */}

                        <FormCard
                            icon={
                                IndianRupee
                            }
                            eyebrow="Role Requirements"
                            title="Compensation & Experience"
                            description="Help candidates quickly understand the expected level and compensation."
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
                                    label="Salary"
                                    required
                                    help="You can enter a range or descriptive value."
                                >

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
                                        className={
                                            inputClasses
                                        }
                                    />

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
                                        placeholder="e.g. 0-2 years"
                                        className={
                                            inputClasses
                                        }
                                    />

                                </FormField>

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
                            description="Describe the responsibilities, expectations and what the candidate will work on."
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
                                        placeholder="Describe the role, responsibilities, requirements and what makes this opportunity valuable..."
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
                            description="Add the main skills candidates should have for this position."
                        >

                            <div
                                className="
                                    mt-6
                                "
                            >

                                <FormField
                                    label="Skills"
                                    required
                                    help="Separate each skill with a comma."
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
                            COMPANY LOGO
                        ============================================= */}

                        <FormCard
                            icon={
                                Building2
                            }
                            eyebrow="Company Identity"
                            title="Company Logo"
                            description="Optional. Add a company logo to make your job listing easier to recognize."
                        >

                            <div
                                className="
                                    mt-6
                                "
                            >

                                {!companyLogo ? (

                                    <label
                                        htmlFor="company-logo"
                                        className="
                                            flex
                                            min-h-40
                                            cursor-pointer
                                            flex-col
                                            items-center
                                            justify-center
                                            rounded-[18px]
                                            border
                                            border-dashed
                                            border-[#C8DED3]
                                            bg-[#F7FCF9]
                                            px-6
                                            py-8
                                            text-center
                                            transition-all
                                            duration-200
                                            hover:border-[#8FC8AC]
                                            hover:bg-[#F0FAF5]
                                        "
                                    >

                                        <div
                                            className="
                                                flex
                                                h-11
                                                w-11
                                                items-center
                                                justify-center
                                                rounded-xl
                                                bg-[#E4F5EC]
                                                text-[#16815B]
                                            "
                                        >

                                            <UploadCloud
                                                className="
                                                    h-5
                                                    w-5
                                                "
                                            />

                                        </div>


                                        <p
                                            className="
                                                mt-4
                                                text-sm
                                                font-medium
                                                text-[#48544E]
                                            "
                                        >
                                            Choose company logo
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
                                            up to 2 MB
                                        </p>

                                    </label>

                                ) : (

                                    <div
                                        className="
                                            flex
                                            flex-col
                                            gap-5
                                            rounded-[18px]
                                            border
                                            border-[#D6E7DF]
                                            bg-[#F7FCF9]
                                            p-5
                                            sm:flex-row
                                            sm:items-center
                                        "
                                    >

                                        <div
                                            className="
                                                h-20
                                                w-20
                                                shrink-0
                                                overflow-hidden
                                                rounded-2xl
                                                border
                                                border-[#D7E5DE]
                                                bg-white
                                            "
                                        >

                                            <img
                                                src={
                                                    logoPreview
                                                }
                                                alt="Company logo preview"
                                                className="
                                                    h-full
                                                    w-full
                                                    object-cover
                                                "
                                            />

                                        </div>


                                        <div
                                            className="
                                                min-w-0
                                                flex-1
                                            "
                                        >

                                            <p
                                                className="
                                                    truncate
                                                    text-sm
                                                    font-medium
                                                    text-[#414C46]
                                                "
                                            >
                                                {
                                                    companyLogo.name
                                                }
                                            </p>


                                            <p
                                                className="
                                                    mt-1
                                                    text-xs
                                                    text-[#7F8B85]
                                                "
                                            >
                                                {(
                                                    companyLogo.size /
                                                    1024 /
                                                    1024
                                                ).toFixed(
                                                    2
                                                )}{" "}
                                                MB
                                            </p>

                                        </div>


                                        <button
                                            type="button"
                                            onClick={
                                                removeLogo
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

                                            Remove

                                        </button>

                                    </div>

                                )}


                                <input
                                    id="company-logo"
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
                                to="/recruiter/dashboard"
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
                                    submitting
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

                                <BriefcaseBusiness
                                    className="
                                        h-4
                                        w-4
                                    "
                                />

                                {submitting
                                    ? "Publishing..."
                                    : "Publish Job"}

                            </button>

                        </div>

                    </form>


                    {/* =================================================
                        SIDEBAR PREVIEW
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
                                    Listing Preview
                                </p>


                                <div
                                    className="
                                        mt-5
                                        flex
                                        items-start
                                        gap-4
                                    "
                                >

                                    {logoPreview ? (

                                        <div
                                            className="
                                                h-14
                                                w-14
                                                shrink-0
                                                overflow-hidden
                                                rounded-2xl
                                                border
                                                border-[#DCE7E2]
                                                bg-white
                                            "
                                        >

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

                                        <h3
                                            className="
                                                wrap-break-word
                                                text-[18px]
                                                font-semibold
                                                leading-6
                                                text-[#292D35]
                                            "
                                        >
                                            {formData.title.trim() ||
                                                "Your job title"}
                                        </h3>


                                        <p
                                            className="
                                                mt-1
                                                wrap-break-word
                                                text-sm
                                                text-[#68746E]
                                            "
                                        >
                                            {formData.company.trim() ||
                                                "Company name"}
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
                                            formData.location ||
                                            "Location"
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
                                            "Salary"
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
                                            Posting tip
                                        </p>


                                        <p
                                            className="
                                                mt-1
                                                text-xs
                                                leading-5
                                                text-[#72847B]
                                            "
                                        >
                                            Use a clear
                                            title, realistic
                                            experience level
                                            and focused skill
                                            list so candidates
                                            can quickly judge
                                            whether the role
                                            fits them.
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
                    h-107.5
                    w-130
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
                    h-130
                    w-150
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
                    h-97.5
                    w-135
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
   FORM FIELD
   ========================================================= */

function FormField({
    label,
    help,
    required,
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

            <span
                className="
                    break-words
                "
            >
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


export default PostJob;