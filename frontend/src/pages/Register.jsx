import { useState } from "react";

import {
    Link,
    useNavigate,
} from "react-router-dom";

import {
    API_BASE_URL,
} from "../api";


function Register() {
    const navigate = useNavigate();


    const [formData, setFormData] =
        useState({
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
            role: "",
        });


    const [errors, setErrors] =
        useState({});


    const [
        serverMessage,
        setServerMessage,
    ] = useState("");


    const [
        isLoading,
        setIsLoading,
    ] = useState(false);


    /* =========================================
       INPUT CHANGE
       ========================================= */

    const handleChange = (event) => {
        const {
            name,
            value,
        } = event.target;


        setFormData(
            (previousData) => ({
                ...previousData,
                [name]: value,
            })
        );


        setErrors(
            (previousErrors) => ({
                ...previousErrors,
                [name]: "",
            })
        );


        setServerMessage("");
    };


    /* =========================================
       VALIDATION
       ========================================= */

    const validateForm = () => {
        const newErrors = {};


        if (!formData.fullName.trim()) {
            newErrors.fullName =
                "Full name is required";

        } else if (
            formData.fullName.trim()
                .length < 3
        ) {
            newErrors.fullName =
                "Name must be at least 3 characters";
        }


        if (!formData.email.trim()) {
            newErrors.email =
                "Email is required";

        } else if (
            !/\S+@\S+\.\S+/.test(
                formData.email
            )
        ) {
            newErrors.email =
                "Enter a valid email address";
        }


        if (!formData.role) {
            newErrors.role =
                "Please select your role";
        }


        if (!formData.password) {
            newErrors.password =
                "Password is required";

        } else if (
            formData.password.length < 6
        ) {
            newErrors.password =
                "Password must be at least 6 characters";
        }


        if (
            !formData.confirmPassword
        ) {
            newErrors.confirmPassword =
                "Please confirm your password";

        } else if (
            formData.password !==
            formData.confirmPassword
        ) {
            newErrors.confirmPassword =
                "Passwords do not match";
        }


        return newErrors;
    };


    /* =========================================
       REGISTER
       ========================================= */

    const handleSubmit =
        async (event) => {

            event.preventDefault();


            const validationErrors =
                validateForm();


            if (
                Object.keys(
                    validationErrors
                ).length > 0
            ) {
                setErrors(
                    validationErrors
                );

                return;
            }


            setIsLoading(true);
            setServerMessage("");
            setErrors({});


            try {
                 const response =
    await fetch(
        `${API_BASE_URL}/auth/register/`,
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
                        full_name:
                            formData.fullName
                                .trim(),

                        email:
                            formData.email
                                .trim()
                                .toLowerCase(),

                        password:
                            formData.password,

                        role:
                            formData.role,
                    }
                ),
        }
    );


                const data =
                    await response.json();


                if (!response.ok) {

                    const apiErrors =
                        {};


                    if (data.full_name) {
                        apiErrors.fullName =
                            Array.isArray(
                                data.full_name
                            )
                                ? data.full_name[0]
                                : data.full_name;
                    }


                    if (data.email) {
                        apiErrors.email =
                            Array.isArray(
                                data.email
                            )
                                ? data.email[0]
                                : data.email;
                    }


                    if (data.password) {
                        apiErrors.password =
                            Array.isArray(
                                data.password
                            )
                                ? data.password[0]
                                : data.password;
                    }


                    if (data.role) {
                        apiErrors.role =
                            Array.isArray(
                                data.role
                            )
                                ? data.role[0]
                                : data.role;
                    }


                    setErrors(apiErrors);


                    setServerMessage(
                        data.detail ||
                            data.message ||
                            "Registration failed. Please check your information."
                    );


                    return;
                }


                /* =================================
                   SAVE LOGIN INFORMATION
                   ================================= */

                localStorage.setItem(
                    "accessToken",
                    data.tokens.access
                );


                localStorage.setItem(
                    "refreshToken",
                    data.tokens.refresh
                );


                localStorage.setItem(
                    "userRole",
                    data.user.role
                );


                localStorage.setItem(
                    "user",
                    JSON.stringify(
                        data.user
                    )
                );


                /* =================================
                   REDIRECT BASED ON ROLE
                   ================================= */

                if (
                    data.user.role ===
                    "recruiter"
                ) {
                    navigate(
                        "/recruiter/dashboard"
                    );

                } else {
                    navigate(
                        "/dashboard"
                    );
                }

            } catch (error) {
                console.error(
                    "Registration error:",
                    error
                );


                setServerMessage(
                    "Unable to connect to the server. Please make sure Django is running."
                );

            } finally {
                setIsLoading(false);
            }
        };


    return (
        <div
            className="
                relative
                min-h-screen
                overflow-hidden
                bg-linear-to-br
                from-emerald-50
                via-white
                to-green-50
                px-4
                py-12
                sm:px-6
            "
        >

            {/* Background glow */}

            <div
                className="
                    pointer-events-none
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
                    pointer-events-none
                    absolute
                    -right-24
                    bottom-10
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
                    relative
                    z-10
                    flex
                    min-h-screen
                    items-center
                    justify-center
                "
            >

                <div
                    className="
                        w-full
                        max-w-lg
                    "
                >

                    {/* Brand */}

                    <div
                        className="
                            mb-7
                            text-center
                        "
                    >

                        <Link
                            to="/"
                            className="
                                inline-flex
                                items-center
                                gap-2
                                text-xl
                                font-semibold
                                tracking-tight
                                text-gray-900
                            "
                        >

                            <span
                                className="
                                    flex
                                    h-10
                                    w-10
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-[#0D99FF]
                                    text-lg
                                    font-bold
                                    text-white
                                "
                            >
                                C
                            </span>

                            CareerSync

                        </Link>

                    </div>


                    {/* Register Card */}

                    <div
                        className="
                            rounded-3xl
                            border
                            border-emerald-100
                            bg-white
                            p-6
                            shadow-lg
                            sm:p-8
                        "
                    >

                        {/* Header */}

                        <div
                            className="
                                text-center
                            "
                        >

                            <p
                                className="
                                    text-xs
                                    font-medium
                                    uppercase
                                    tracking-widest
                                    text-emerald-600
                                "
                            >
                                Join CareerSync
                            </p>


                            <h1
                                className="
                                    mt-3
                                    text-3xl
                                    font-semibold
                                    leading-tight
                                    tracking-tight
                                    text-gray-900
                                "
                            >
                                Create Your Account
                            </h1>


                            <p
                                className="
                                    mt-3
                                    text-sm
                                    leading-6
                                    text-gray-500
                                "
                            >
                                Create your account
                                and start building your
                                CareerSync journey.
                            </p>

                        </div>


                        {/* Server Message */}

                        {serverMessage && (
                            <div
                                className="
                                    mt-6
                                    rounded-xl
                                    border
                                    border-red-200
                                    bg-red-50
                                    px-4
                                    py-3
                                    text-sm
                                    text-red-700
                                "
                            >
                                {serverMessage}
                            </div>
                        )}


                        {/* Form */}

                        <form
                            onSubmit={
                                handleSubmit
                            }
                            className="
                                mt-7
                                space-y-5
                            "
                        >

                            {/* Full Name */}

                            <FormField
                                label="Full Name"
                                error={
                                    errors.fullName
                                }
                            >
                                <input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    value={
                                        formData.fullName
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter your full name"
                                    autoComplete="name"
                                    className={
                                        inputClasses
                                    }
                                />
                            </FormField>


                            {/* Email */}

                            <FormField
                                label="Email Address"
                                error={
                                    errors.email
                                }
                            >
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={
                                        formData.email
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    className={
                                        inputClasses
                                    }
                                />
                            </FormField>


                            {/* Role */}

                            <FormField
                                label="I am a"
                                error={
                                    errors.role
                                }
                            >

                                <select
                                    id="role"
                                    name="role"
                                    value={
                                        formData.role
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    className={
                                        inputClasses
                                    }
                                >

                                    <option value="">
                                        Select your role
                                    </option>

                                    <option value="student">
                                        Student / Job Seeker
                                    </option>

                                    <option value="recruiter">
                                        Recruiter
                                    </option>

                                </select>

                            </FormField>


                            {/* Password */}

                            <FormField
                                label="Password"
                                error={
                                    errors.password
                                }
                            >
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={
                                        formData.password
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Create a password"
                                    autoComplete="new-password"
                                    className={
                                        inputClasses
                                    }
                                />
                            </FormField>


                            {/* Confirm Password */}

                            <FormField
                                label="Confirm Password"
                                error={
                                    errors.confirmPassword
                                }
                            >
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    value={
                                        formData.confirmPassword
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter your password again"
                                    autoComplete="new-password"
                                    className={
                                        inputClasses
                                    }
                                />
                            </FormField>


                            {/* Submit */}

                            <button
                                type="submit"
                                disabled={
                                    isLoading
                                }
                                className="
                                    flex
                                    h-12
                                    w-full
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-[#0D99FF]
                                    px-5
                                    text-sm
                                    font-semibold
                                    text-white
                                    transition-all
                                    duration-300
                                    hover:bg-[#009944]
                                    active:scale-95
                                    disabled:cursor-not-allowed
                                    disabled:opacity-60
                                "
                            >
                                {isLoading
                                    ? "Creating Account..."
                                    : "Create Account"}
                            </button>

                        </form>


                        {/* Login */}

                        <p
                            className="
                                mt-6
                                text-center
                                text-sm
                                text-gray-600
                            "
                        >
                            Already have an
                            account?{" "}

                            <Link
                                to="/login"
                                className="
                                    font-semibold
                                    text-[#0D99FF]
                                    transition-colors
                                    hover:text-[#009944]
                                "
                            >
                                Login
                            </Link>
                        </p>

                    </div>


                    {/* Home */}

                    <div
                        className="
                            mt-5
                            text-center
                        "
                    >
                        <Link
                            to="/"
                            className="
                                text-sm
                                font-medium
                                text-gray-500
                                transition-colors
                                hover:text-[#009944]
                            "
                        >
                            ← Back to CareerSync
                        </Link>
                    </div>

                </div>

            </div>

        </div>
    );
}


/* =========================================
   FORM FIELD
   ========================================= */

function FormField({
    label,
    error,
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
                    text-gray-700
                "
            >
                {label}
            </label>


            {children}


            {error && (
                <p
                    className="
                        mt-1
                        text-sm
                        text-red-600
                    "
                >
                    {error}
                </p>
            )}

        </div>
    );
}


/* =========================================
   INPUT STYLE
   ========================================= */

const inputClasses = `
    h-12
    w-full
    rounded-xl
    border
    border-gray-300
    bg-white
    px-4
    text-sm
    text-gray-900
    outline-none
    transition
    placeholder:text-gray-400
    focus:border-[#0D99FF]
    focus:ring-4
    focus:ring-blue-100
`;


export default Register;