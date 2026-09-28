import { useState } from "react";
import {
    Link,
    useNavigate,
} from "react-router-dom";
import {
    API_BASE_URL,
} from "../api";


function Login() {
    const navigate =
        useNavigate();


    const [
        formData,
        setFormData,
    ] = useState({
        email: "",
        password: "",
    });


    const [
        error,
        setError,
    ] = useState("");


    const [
        loading,
        setLoading,
    ] = useState(false);


    /* =========================================
       INPUT CHANGE
       ========================================= */

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]:
                e.target.value,
        });

        if (error) {
            setError("");
        }
    };


    /* =========================================
       LOGIN
       ========================================= */

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);


        try {
const response =
    await fetch(
        `${API_BASE_URL}/auth/login/`,
        {
            method: "POST",

            headers: {
                "Content-Type":
                    "application/json",
            },

            body: JSON.stringify({
                email:
                    formData.email,

                password:
                    formData.password,
            }),
        }
    );


            const data =
                await response.json();


            if (!response.ok) {
                throw new Error(
                    data.detail ||
                        data.non_field_errors?.[0] ||
                        "Invalid email or password."
                );
            }


            /* Save JWT tokens */

            localStorage.setItem(
                "accessToken",
                data.tokens.access
            );


            localStorage.setItem(
                "refreshToken",
                data.tokens.refresh
            );


            /* Save role */

            localStorage.setItem(
                "userRole",
                data.user.role
            );


            /* Redirect */

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
                "Login error:",
                error
            );


            setError(
                error.message ||
                    "Unable to connect to the server."
            );

        } finally {
            setLoading(false);
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

            {/* =====================================
                SOFT BACKGROUND
            ====================================== */}

            <div
                className="
                    pointer-events-none
                    absolute
                    -left-24
                    top-20
                    h-72
                    w-72
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
                    h-80
                    w-80
                    rounded-full
                    bg-green-200
                    opacity-30
                    blur-3xl
                    animate-pulse
                "
            />


            {/* =====================================
                CONTENT
            ====================================== */}

            <div
                className="
                    relative
                    z-10
                    flex
                    min-h-[calc(100vh-6rem)]
                    items-center
                    justify-center
                "
            >

                <div
                    className="
                        w-full
                        max-w-md
                    "
                >

                    {/* BRAND */}

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
                                text-[#171A1F]
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


                    {/* =================================
                        LOGIN CARD
                    ================================== */}

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

                        {/* HEADER */}

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
                                Welcome Back
                            </p>


                            <h1
                                className="
                                    mt-3
                                    font-sans
                                    text-3xl
                                    font-semibold
                                    leading-tight
                                    tracking-tight
                                    text-[#171A1F]
                                "
                            >
                                Login to CareerSync
                            </h1>


                            <p
                                className="
                                    mt-3
                                    text-sm
                                    leading-6
                                    text-gray-500
                                "
                            >
                                Access your jobs,
                                applications and
                                CareerSync dashboard.
                            </p>

                        </div>


                        {/* ERROR */}

                        {error && (
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
                                {error}
                            </div>
                        )}


                        {/* =================================
                            FORM
                        ================================== */}

                        <form
                            onSubmit={
                                handleSubmit
                            }
                            className="
                                mt-7
                                space-y-5
                            "
                        >

                            {/* EMAIL */}

                            <div>

                                <label
                                    htmlFor="email"
                                    className="
                                        mb-2
                                        block
                                        text-sm
                                        font-medium
                                        text-gray-700
                                    "
                                >
                                    Email Address
                                </label>


                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={
                                        formData.email
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter your email"
                                    autoComplete="email"
                                    required
                                    className="
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
                                    "
                                />

                            </div>


                            {/* PASSWORD */}

                            <div>

                                <label
                                    htmlFor="password"
                                    className="
                                        mb-2
                                        block
                                        text-sm
                                        font-medium
                                        text-gray-700
                                    "
                                >
                                    Password
                                </label>


                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={
                                        formData.password
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    required
                                    className="
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
                                    "
                                />

                            </div>


                            {/* LOGIN BUTTON */}

                            <button
                                type="submit"
                                disabled={
                                    loading
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
                                    active:scale-[0.98]
                                    disabled:cursor-not-allowed
                                    disabled:opacity-60
                                "
                            >
                                {loading
                                    ? "Logging in..."
                                    : "Login"}
                            </button>

                        </form>


                        {/* REGISTER */}

                        <p
                            className="
                                mt-6
                                text-center
                                text-sm
                                text-gray-600
                            "
                        >
                            Don't have an account?{" "}

                            <Link
                                to="/register"
                                className="
                                    font-semibold
                                    text-[#0D99FF]
                                    transition-colors
                                    hover:text-[#009944]
                                "
                            >
                                Create Account
                            </Link>
                        </p>

                    </div>


                    {/* BACK HOME */}

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


export default Login;