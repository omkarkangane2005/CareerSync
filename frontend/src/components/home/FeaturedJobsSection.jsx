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
    Clock3,
    IndianRupee,
    MapPin,
} from "lucide-react";

import {
    apiFetch,
} from "../../api";


function FeaturedJobsSection() {
    const [
        jobs,
        setJobs,
    ] = useState([]);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        error,
        setError,
    ] = useState("");


    useEffect(() => {
        let cancelled = false;

        const fetchJobs =
            async () => {

            try {
                setLoading(true);
                setError("");

                const response =
                    await apiFetch(
                        "/jobs/"
                    );

                const data =
                    await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.detail ||
                        "Unable to load jobs."
                    );
                }

                const jobList =
                    Array.isArray(data)
                        ? data
                        : data.results || [];

                if (!cancelled) {
                    setJobs(
                        jobList.slice(
                            0,
                            3
                        )
                    );
                }

            } catch (error) {
                console.error(
                    "Featured jobs error:",
                    error
                );

                if (!cancelled) {
                    setError(
                        error.message ||
                        "Unable to load featured jobs."
                    );
                }

            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };


        fetchJobs();


        return () => {
            cancelled = true;
        };

    }, []);


    return (
        <section
            className="
                relative
                overflow-hidden
                bg-[#f8faff]
                py-20
                sm:py-24
            "
        >

            {/* Background decoration */}

            <div
                className="
                    pointer-events-none
                    absolute
                    -left-32
                    top-20
                    h-72
                    w-72
                    rounded-full
                    bg-indigo-100/50
                    blur-[100px]
                "
            />

            <div
                className="
                    pointer-events-none
                    absolute
                    -right-32
                    bottom-10
                    h-72
                    w-72
                    rounded-full
                    bg-teal-100/50
                    blur-[100px]
                "
            />


            <div
                className="
                    relative
                    mx-auto
                    max-w-7xl
                    px-4
                    sm:px-6
                    lg:px-8
                "
            >

                {/* =====================================
                    HEADING
                ===================================== */}

                <div
                    className="
                        mx-auto
                        max-w-3xl
                        text-center
                    "
                >

                    <div
                        className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-full
                            border
                            border-indigo-100
                            bg-indigo-50/80
                            px-4
                            py-2
                        "
                    >

                        <BriefcaseBusiness
                            className="
                                h-4
                                w-4
                                text-indigo-600
                            "
                        />

                        <span
                            className="
                                text-xs
                                font-black
                                uppercase
                                tracking-[0.18em]
                                text-indigo-600
                            "
                        >
                            Career Opportunities
                        </span>

                    </div>


                    <h2
                        className="
                            mt-5
                            text-3xl
                            font-black
                            tracking-[-0.035em]
                            text-slate-950
                            sm:text-4xl
                            lg:text-[42px]
                        "
                    >
                        Featured{" "}

                        <span
                            className="
                                cs-gradient-text
                            "
                        >
                            Jobs
                        </span>
                    </h2>


                    <p
                        className="
                            mx-auto
                            mt-4
                            max-w-2xl
                            text-base
                            leading-7
                            text-slate-600
                        "
                    >
                        Discover fresh opportunities
                        that align with your skills,
                        experience and long-term
                        career goals.
                    </p>

                </div>


                {/* =====================================
                    LOADING
                ===================================== */}

                {loading && (

                    <div
                        className="
                            mt-12
                            grid
                            gap-6
                            md:grid-cols-2
                            lg:grid-cols-3
                        "
                    >

                        {[1, 2, 3].map(
                            (item) => (

                            <div
                                key={
                                    item
                                }
                                className="
                                    animate-pulse
                                    rounded-3xl
                                    border
                                    border-slate-200
                                    bg-white
                                    p-6
                                "
                            >

                                <div
                                    className="
                                        h-14
                                        w-14
                                        rounded-2xl
                                        bg-slate-100
                                    "
                                />

                                <div
                                    className="
                                        mt-6
                                        h-5
                                        w-2/3
                                        rounded
                                        bg-slate-200
                                    "
                                />

                                <div
                                    className="
                                        mt-3
                                        h-4
                                        w-1/3
                                        rounded
                                        bg-slate-100
                                    "
                                />

                                <div
                                    className="
                                        mt-6
                                        h-16
                                        rounded-xl
                                        bg-slate-100
                                    "
                                />

                            </div>

                            )
                        )}

                    </div>

                )}


                {/* =====================================
                    ERROR
                ===================================== */}

                {!loading && error && (

                    <div
                        className="
                            mx-auto
                            mt-10
                            max-w-xl
                            rounded-2xl
                            border
                            border-red-100
                            bg-red-50
                            px-5
                            py-4
                            text-center
                            text-sm
                            font-medium
                            text-red-600
                        "
                    >
                        {error}
                    </div>

                )}


                {/* =====================================
                    JOB CARDS
                ===================================== */}

                {!loading &&
                    !error &&
                    jobs.length > 0 && (

                    <div
                        className="
                            mt-12
                            grid
                            gap-6
                            md:grid-cols-2
                            lg:grid-cols-3
                        "
                    >

                        {jobs.map(
                            (job) => {

                            const skills =
                                Array.isArray(
                                    job.skills
                                )
                                    ? job.skills
                                    : [];


                            return (

                                <article
                                    key={
                                        job.id
                                    }
                                    className="
                                        group
                                        relative
                                        flex
                                        min-h-full
                                        flex-col
                                        overflow-hidden
                                        rounded-3xl
                                        border
                                        border-slate-200/90
                                        bg-white
                                        p-6
                                        shadow-[0_8px_30px_rgba(15,23,42,0.045)]
                                        transition-all
                                        duration-300
                                        hover:-translate-y-1
                                        hover:border-indigo-200
                                        hover:shadow-[0_22px_45px_rgba(79,70,229,0.10)]
                                    "
                                >

                                    {/* Accent line */}

                                    <div
                                        className="
                                            absolute
                                            inset-x-0
                                            top-0
                                            h-1
                                            bg-linear-to-r
                                            from-indigo-500
                                            via-violet-500
                                            to-teal-400
                                            opacity-0
                                            transition
                                            duration-300
                                            group-hover:opacity-100
                                        "
                                    />


                                    {/* Top */}

                                    <div
                                        className="
                                            flex
                                            items-start
                                            justify-between
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
                                                    border-slate-200
                                                    bg-white
                                                    shadow-sm
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
                                                    bg-linear-to-br
                                                    from-indigo-50
                                                    via-violet-50
                                                    to-teal-50
                                                    text-indigo-600
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


                                        <span
                                            className="
                                                rounded-full
                                                border
                                                border-indigo-100
                                                bg-indigo-50
                                                px-3
                                                py-1.5
                                                text-xs
                                                font-bold
                                                text-indigo-700
                                            "
                                        >
                                            {
                                                job.job_type
                                            }
                                        </span>

                                    </div>


                                    {/* Title */}

                                    <div
                                        className="
                                            mt-6
                                        "
                                    >

                                        <h3
                                            className="
                                                line-clamp-2
                                                text-xl
                                                font-black
                                                tracking-[-0.02em]
                                                text-slate-950
                                                transition
                                                group-hover:text-indigo-700
                                            "
                                        >
                                            {
                                                job.title
                                            }
                                        </h3>


                                        <p
                                            className="
                                                mt-1.5
                                                text-sm
                                                font-bold
                                                text-slate-600
                                            "
                                        >
                                            {
                                                job.company
                                            }
                                        </p>

                                    </div>


                                    {/* Details */}

                                    <div
                                        className="
                                            mt-5
                                            grid
                                            gap-3
                                            rounded-2xl
                                            border
                                            border-slate-100
                                            bg-slate-50/80
                                            p-4
                                        "
                                    >

                                        <div
                                            className="
                                                flex
                                                items-center
                                                gap-2.5
                                                text-sm
                                                text-slate-600
                                            "
                                        >

                                            <MapPin
                                                className="
                                                    h-4
                                                    w-4
                                                    shrink-0
                                                    text-teal-600
                                                "
                                            />

                                            <span
                                                className="
                                                    truncate
                                                "
                                            >
                                                {
                                                    job.location
                                                }
                                            </span>

                                        </div>


                                        <div
                                            className="
                                                flex
                                                items-center
                                                gap-2.5
                                                text-sm
                                                text-slate-600
                                            "
                                        >

                                            <BriefcaseBusiness
                                                className="
                                                    h-4
                                                    w-4
                                                    shrink-0
                                                    text-violet-600
                                                "
                                            />

                                            <span>
                                                {
                                                    job.experience
                                                }
                                            </span>

                                        </div>


                                        <div
                                            className="
                                                flex
                                                items-center
                                                gap-2.5
                                                text-sm
                                                text-slate-600
                                            "
                                        >

                                            <IndianRupee
                                                className="
                                                    h-4
                                                    w-4
                                                    shrink-0
                                                    text-amber-600
                                                "
                                            />

                                            <span
                                                className="
                                                    font-semibold
                                                    text-slate-700
                                                "
                                            >
                                                {
                                                    job.salary
                                                }
                                            </span>

                                        </div>

                                    </div>


                                    {/* Skills */}

                                    {skills.length >
                                        0 && (

                                        <div
                                            className="
                                                mt-5
                                                flex
                                                flex-wrap
                                                gap-2
                                            "
                                        >

                                            {skills
                                                .slice(
                                                    0,
                                                    4
                                                )
                                                .map(
                                                    (
                                                        skill,
                                                        index
                                                    ) => (

                                                    <span
                                                        key={`${job.id}-${skill}-${index}`}
                                                        className="
                                                            rounded-lg
                                                            border
                                                            border-slate-200
                                                            bg-white
                                                            px-2.5
                                                            py-1
                                                            text-xs
                                                            font-semibold
                                                            text-slate-600
                                                        "
                                                    >
                                                        {
                                                            skill
                                                        }
                                                    </span>

                                                    )
                                                )}

                                        </div>

                                    )}


                                    {/* Bottom */}

                                    <div
                                        className="
                                            mt-auto
                                            flex
                                            items-center
                                            justify-between
                                            gap-4
                                            border-t
                                            border-slate-100
                                            pt-5
                                        "
                                    >

                                        <div
                                            className="
                                                flex
                                                items-center
                                                gap-1.5
                                                text-xs
                                                font-medium
                                                text-slate-400
                                            "
                                        >

                                            <Clock3
                                                className="
                                                    h-3.5
                                                    w-3.5
                                                "
                                            />

                                            Recently posted

                                        </div>


                                        <Link
                                            to={`/jobs/${job.id}`}
                                            className="
                                                inline-flex
                                                items-center
                                                gap-1.5
                                                text-sm
                                                font-black
                                                text-indigo-600
                                                transition
                                                hover:text-violet-700
                                            "
                                        >
                                            View Job

                                            <ArrowRight
                                                className="
                                                    h-4
                                                    w-4
                                                    transition
                                                    group-hover:translate-x-1
                                                "
                                            />

                                        </Link>

                                    </div>

                                </article>

                            );

                        }
                        )}

                    </div>

                )}


                {/* =====================================
                    EMPTY
                ===================================== */}

                {!loading &&
                    !error &&
                    jobs.length === 0 && (

                    <div
                        className="
                            mx-auto
                            mt-12
                            max-w-xl
                            rounded-3xl
                            border
                            border-slate-200
                            bg-white
                            p-10
                            text-center
                            shadow-sm
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
                                bg-indigo-50
                                text-indigo-600
                            "
                        >

                            <BriefcaseBusiness
                                className="
                                    h-6
                                    w-6
                                "
                            />

                        </div>

                        <h3
                            className="
                                mt-5
                                text-lg
                                font-black
                                text-slate-900
                            "
                        >
                            No jobs available yet
                        </h3>

                        <p
                            className="
                                mt-2
                                text-sm
                                leading-6
                                text-slate-500
                            "
                        >
                            New opportunities will
                            appear here as recruiters
                            publish jobs.
                        </p>

                    </div>

                )}


                {/* =====================================
                    VIEW ALL
                ===================================== */}

                <div
                    className="
                        mt-10
                        text-center
                    "
                >

                    <Link
                        to="/jobs"
                        className="
                            inline-flex
                            min-h-12
                            items-center
                            justify-center
                            gap-2
                            rounded-2xl
                            border
                            border-indigo-200
                            bg-white
                            px-6
                            text-sm
                            font-black
                            text-indigo-700
                            shadow-sm
                            transition
                            hover:-translate-y-0.5
                            hover:border-indigo-300
                            hover:bg-indigo-50
                            hover:shadow-md
                        "
                    >
                        View All Jobs

                        <ArrowRight
                            className="
                                h-4
                                w-4
                            "
                        />

                    </Link>

                </div>

            </div>

        </section>
    );
}


export default FeaturedJobsSection;