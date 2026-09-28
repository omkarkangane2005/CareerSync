import {
    useEffect,
    useState,
} from "react";

import {
    Link,
    NavLink,
    useLocation,
    useNavigate,
} from "react-router-dom";

import {
    LogOut,
    Menu,
    Network,
    X,
} from "lucide-react";


function Navbar() {
    const navigate =
        useNavigate();

    const location =
        useLocation();


    const [
        mobileMenuOpen,
        setMobileMenuOpen,
    ] = useState(false);


    const accessToken =
        localStorage.getItem(
            "accessToken"
        );


    const userRole =
        localStorage.getItem(
            "userRole"
        );


    /* =========================================
       CLOSE MOBILE MENU AFTER ROUTE CHANGE
       ========================================= */

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);


    /* =========================================
       LOGOUT
       ========================================= */

    const handleLogout = () => {
        localStorage.removeItem(
            "accessToken"
        );

        localStorage.removeItem(
            "refreshToken"
        );

        localStorage.removeItem(
            "userRole"
        );

        localStorage.removeItem(
            "user"
        );

        setMobileMenuOpen(false);

        navigate("/login");
    };


    /* =========================================
       NAVIGATION STYLES
       ========================================= */

    const navClass = ({
        isActive,
    }) => {
        const base =
            "rounded-xl px-3 py-2 text-sm font-semibold transition";

        const active =
            "bg-emerald-50 text-[#009944]";

        const inactive =
            "text-gray-600 hover:bg-gray-50 hover:text-gray-900";

        return `${base} ${
            isActive
                ? active
                : inactive
        }`;
    };


    const mobileNavClass = ({
        isActive,
    }) => {
        const base =
            "flex min-h-11 items-center rounded-xl px-4 py-3 text-sm font-semibold transition";

        const active =
            "bg-emerald-50 text-[#009944]";

        const inactive =
            "text-gray-700 hover:bg-gray-50 hover:text-gray-900";

        return `${base} ${
            isActive
                ? active
                : inactive
        }`;
    };


    return (
        <header
            className="
                sticky
                top-0
                z-50
                border-b
                border-gray-200
                bg-white
                shadow-sm
            "
        >

            <nav
                className="
                    mx-auto
                    max-w-7xl
                    px-4
                    sm:px-6
                    lg:px-8
                "
            >

                {/* =====================================
                    TOP NAVBAR
                ====================================== */}

                <div
                    className="
                        flex
                        h-16
                        items-center
                        justify-between
                        lg:h-20
                    "
                >

                    {/* =================================
                        BRAND
                    ================================== */}

                    <Link
                        to="/"
                        className="
                            flex
                            shrink-0
                            items-center
                            gap-2
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
                                bg-[#0D99FF]
                                text-white
                                shadow-sm
                                transition
                                hover:bg-[#009944]
                            "
                        >
                            <Network
                                className="
                                    h-5
                                    w-5
                                "
                            />
                        </div>


                        <span
                            className="
                                text-xl
                                font-bold
                                text-gray-900
                            "
                        >
                            Career
                            <span
                                className="
                                    text-[#0D99FF]
                                "
                            >
                                Sync
                            </span>
                        </span>

                    </Link>


                    {/* =================================
                        DESKTOP NAVIGATION
                    ================================== */}

                    <div
                        className="
                            hidden
                            items-center
                            gap-1
                            lg:flex
                        "
                    >

                        <NavLink
                            to="/"
                            end
                            className={
                                navClass
                            }
                        >
                            Home
                        </NavLink>


                        {userRole !==
                            "recruiter" && (

                            <NavLink
                                to="/jobs"
                                className={
                                    navClass
                                }
                            >
                                Find Jobs
                            </NavLink>

                        )}


                        {!accessToken && (
                            <>
                                <a
                                    href="/#how-it-works"
                                    className="
                                        rounded-xl
                                        px-3
                                        py-2
                                        text-sm
                                        font-semibold
                                        text-gray-600
                                        transition
                                        hover:bg-gray-50
                                        hover:text-gray-900
                                    "
                                >
                                    How It Works
                                </a>


                                <a
                                    href="/#about"
                                    className="
                                        rounded-xl
                                        px-3
                                        py-2
                                        text-sm
                                        font-semibold
                                        text-gray-600
                                        transition
                                        hover:bg-gray-50
                                        hover:text-gray-900
                                    "
                                >
                                    About
                                </a>
                            </>
                        )}


                        {/* STUDENT */}

                        {userRole ===
                            "student" && (
                            <>
                                <NavLink
                                    to="/dashboard"
                                    className={
                                        navClass
                                    }
                                >
                                    Dashboard
                                </NavLink>


                                <NavLink
                                    to="/saved-jobs"
                                    className={
                                        navClass
                                    }
                                >
                                    Saved Jobs
                                </NavLink>


                                <NavLink
                                    to="/profile"
                                    className={
                                        navClass
                                    }
                                >
                                    Profile
                                </NavLink>
                            </>
                        )}


                        {/* RECRUITER */}

                        {userRole ===
                            "recruiter" && (
                            <>
                                <NavLink
                                    to="/recruiter/talent"
                                    className={
                                        navClass
                                    }
                                >
                                    Find Talent
                                </NavLink>


                                <NavLink
                                    to="/recruiter/jobs/new"
                                    className={
                                        navClass
                                    }
                                >
                                    Post a Job
                                </NavLink>


                                <NavLink
                                    to="/recruiter/dashboard"
                                    className={
                                        navClass
                                    }
                                >
                                    Dashboard
                                </NavLink>
                            </>
                        )}

                    </div>


                    {/* =================================
                        DESKTOP ACTIONS
                    ================================== */}

                    <div
                        className="
                            hidden
                            items-center
                            gap-3
                            lg:flex
                        "
                    >

                        {!accessToken ? (
                            <>
                                <Link
                                    to="/login"
                                    className="
                                        inline-flex
                                        min-h-10
                                        items-center
                                        justify-center
                                        rounded-xl
                                        border
                                        border-gray-300
                                        bg-white
                                        px-4
                                        text-sm
                                        font-semibold
                                        text-gray-700
                                        transition
                                        hover:border-emerald-300
                                        hover:bg-emerald-50
                                        hover:text-[#009944]
                                    "
                                >
                                    Login
                                </Link>


                                <Link
                                    to="/register"
                                    className="
                                        inline-flex
                                        min-h-10
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
                                    "
                                >
                                    Register
                                </Link>
                            </>

                        ) : (

                            <button
                                type="button"
                                onClick={
                                    handleLogout
                                }
                                className="
                                    inline-flex
                                    min-h-10
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    border
                                    border-red-200
                                    bg-white
                                    px-4
                                    text-sm
                                    font-semibold
                                    text-gray-700
                                    transition
                                    hover:bg-red-50
                                    hover:text-red-600
                                "
                            >
                                <LogOut
                                    className="
                                        h-4
                                        w-4
                                    "
                                />

                                Logout
                            </button>

                        )}

                    </div>


                    {/* =================================
                        MOBILE BUTTON
                    ================================== */}

                    <button
                        type="button"
                        aria-label={
                            mobileMenuOpen
                                ? "Close navigation"
                                : "Open navigation"
                        }
                        aria-expanded={
                            mobileMenuOpen
                        }
                        onClick={() =>
                            setMobileMenuOpen(
                                (current) =>
                                    !current
                            )
                        }
                        className="
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-gray-200
                            bg-white
                            text-gray-700
                            shadow-sm
                            transition
                            hover:bg-emerald-50
                            hover:text-[#009944]
                            lg:hidden
                        "
                    >

                        {mobileMenuOpen ? (
                            <X
                                className="
                                    h-5
                                    w-5
                                "
                            />
                        ) : (
                            <Menu
                                className="
                                    h-5
                                    w-5
                                "
                            />
                        )}

                    </button>

                </div>


                {/* =====================================
                    MOBILE NAVIGATION
                ====================================== */}

                {mobileMenuOpen && (

                    <div
                        className="
                            max-h-screen
                            overflow-y-auto
                            border-t
                            border-gray-200
                            py-4
                            lg:hidden
                        "
                    >

                        <div
                            className="
                                space-y-1
                            "
                        >

                            <NavLink
                                to="/"
                                end
                                className={
                                    mobileNavClass
                                }
                            >
                                Home
                            </NavLink>


                            {userRole !==
                                "recruiter" && (

                                <NavLink
                                    to="/jobs"
                                    className={
                                        mobileNavClass
                                    }
                                >
                                    Find Jobs
                                </NavLink>

                            )}


                            {!accessToken && (
                                <>
                                    <a
                                        href="/#how-it-works"
                                        onClick={() =>
                                            setMobileMenuOpen(
                                                false
                                            )
                                        }
                                        className="
                                            flex
                                            min-h-11
                                            items-center
                                            rounded-xl
                                            px-4
                                            py-3
                                            text-sm
                                            font-semibold
                                            text-gray-700
                                            transition
                                            hover:bg-gray-50
                                        "
                                    >
                                        How It Works
                                    </a>


                                    <a
                                        href="/#about"
                                        onClick={() =>
                                            setMobileMenuOpen(
                                                false
                                            )
                                        }
                                        className="
                                            flex
                                            min-h-11
                                            items-center
                                            rounded-xl
                                            px-4
                                            py-3
                                            text-sm
                                            font-semibold
                                            text-gray-700
                                            transition
                                            hover:bg-gray-50
                                        "
                                    >
                                        About
                                    </a>
                                </>
                            )}


                            {/* STUDENT MOBILE */}

                            {userRole ===
                                "student" && (
                                <>
                                    <NavLink
                                        to="/dashboard"
                                        className={
                                            mobileNavClass
                                        }
                                    >
                                        Dashboard
                                    </NavLink>


                                    <NavLink
                                        to="/saved-jobs"
                                        className={
                                            mobileNavClass
                                        }
                                    >
                                        Saved Jobs
                                    </NavLink>


                                    <NavLink
                                        to="/profile"
                                        className={
                                            mobileNavClass
                                        }
                                    >
                                        Profile
                                    </NavLink>
                                </>
                            )}


                            {/* RECRUITER MOBILE */}

                            {userRole ===
                                "recruiter" && (
                                <>
                                    <NavLink
                                        to="/recruiter/talent"
                                        className={
                                            mobileNavClass
                                        }
                                    >
                                        Find Talent
                                    </NavLink>


                                    <NavLink
                                        to="/recruiter/jobs/new"
                                        className={
                                            mobileNavClass
                                        }
                                    >
                                        Post a Job
                                    </NavLink>


                                    <NavLink
                                        to="/recruiter/dashboard"
                                        className={
                                            mobileNavClass
                                        }
                                    >
                                        Dashboard
                                    </NavLink>
                                </>
                            )}

                        </div>


                        {/* =================================
                            MOBILE ACCOUNT ACTIONS
                        ================================== */}

                        <div
                            className="
                                mt-4
                                border-t
                                border-gray-200
                                pt-4
                            "
                        >

                            {!accessToken ? (

                                <div
                                    className="
                                        grid
                                        grid-cols-2
                                        gap-3
                                    "
                                >

                                    <Link
                                        to="/login"
                                        className="
                                            inline-flex
                                            min-h-11
                                            items-center
                                            justify-center
                                            rounded-xl
                                            border
                                            border-gray-300
                                            bg-white
                                            px-4
                                            text-sm
                                            font-semibold
                                            text-gray-700
                                            transition
                                            hover:bg-emerald-50
                                            hover:text-[#009944]
                                        "
                                    >
                                        Login
                                    </Link>


                                    <Link
                                        to="/register"
                                        className="
                                            inline-flex
                                            min-h-11
                                            items-center
                                            justify-center
                                            rounded-xl
                                            bg-[#0D99FF]
                                            px-4
                                            text-sm
                                            font-semibold
                                            text-white
                                            transition-all
                                            duration-300
                                            hover:bg-[#009944]
                                            active:scale-95
                                        "
                                    >
                                        Register
                                    </Link>

                                </div>

                            ) : (

                                <button
                                    type="button"
                                    onClick={
                                        handleLogout
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
                                        border-red-200
                                        bg-red-50
                                        px-4
                                        text-sm
                                        font-semibold
                                        text-red-600
                                        transition
                                        hover:bg-red-100
                                    "
                                >

                                    <LogOut
                                        className="
                                            h-4
                                            w-4
                                        "
                                    />

                                    Logout

                                </button>

                            )}

                        </div>

                    </div>

                )}

            </nav>

        </header>
    );
}


export default Navbar;