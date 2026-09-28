import { Link } from "react-router-dom";


function NotFound() {
    return (
        <div
            className="
                relative
                min-h-screen
                overflow-hidden
                bg-gradient-to-br
                from-emerald-50
                via-white
                to-green-50
                px-4
                py-12
                sm:px-6
            "
        >

            {/* Soft background */}

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


            {/* Content */}

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
                        max-w-xl
                        rounded-3xl
                        border
                        border-emerald-100
                        bg-white
                        p-8
                        text-center
                        shadow-lg
                        sm:p-10
                    "
                >

                    <p
                        className="
                            text-sm
                            font-semibold
                            uppercase
                            tracking-widest
                            text-emerald-600
                        "
                    >
                        Error 404
                    </p>


                    <h1
                        className="
                            mt-4
                            text-4xl
                            font-semibold
                            tracking-tight
                            text-gray-900
                            sm:text-5xl
                        "
                    >
                        Page Not Found
                    </h1>


                    <p
                        className="
                            mx-auto
                            mt-4
                            max-w-md
                            text-sm
                            leading-7
                            text-gray-500
                            sm:text-base
                        "
                    >
                        The page you are looking for
                        does not exist or may have
                        been moved.
                    </p>


                    <div
                        className="
                            mt-8
                            flex
                            flex-col
                            gap-3
                            sm:flex-row
                            sm:justify-center
                        "
                    >

                        <Link
                            to="/"
                            className="
                                inline-flex
                                h-12
                                items-center
                                justify-center
                                rounded-xl
                                bg-[#0D99FF]
                                px-6
                                text-sm
                                font-semibold
                                text-white
                                transition-all
                                duration-300
                                hover:bg-[#009944]
                                active:scale-95
                            "
                        >
                            Go to Home
                        </Link>


                        <Link
                            to="/jobs"
                            className="
                                inline-flex
                                h-12
                                items-center
                                justify-center
                                rounded-xl
                                border
                                border-gray-300
                                bg-white
                                px-6
                                text-sm
                                font-semibold
                                text-gray-700
                                transition
                                hover:border-emerald-300
                                hover:bg-emerald-50
                                hover:text-[#009944]
                            "
                        >
                            Browse Jobs
                        </Link>

                    </div>

                </div>

            </div>

        </div>
    );
}


export default NotFound;