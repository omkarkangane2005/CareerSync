import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Link,
} from "react-router-dom";

import {
    ArrowLeft,
    ArrowRight,
    BriefcaseBusiness,
    GraduationCap,
    MapPin,
    RefreshCw,
    Search,
    SearchX,
    SlidersHorizontal,
    Sparkles,
    UserRoundSearch,
    X,
} from "lucide-react";

import { apiFetch } from "../api";


/* =========================================================
   TALENT
   ========================================================= */

function Talent() {
    const [
        candidates,
        setCandidates,
    ] = useState([]);


    const [
        search,
        setSearch,
    ] = useState("");


    const [
        location,
        setLocation,
    ] = useState("");


    const [
        skill,
        setSkill,
    ] = useState("");


    const [
        loading,
        setLoading,
    ] = useState(true);


    const [
        error,
        setError,
    ] = useState("");


    /* =====================================================
       LOAD TALENT
       ===================================================== */

    const fetchTalent =
        async () => {

            try {
                setLoading(true);
                setError("");


                const response =
                    await apiFetch(
                        "/talent/"
                    );


                const data =
                    await response.json();


                if (!response.ok) {
                    throw new Error(
                        data.detail ||
                        "Unable to load talent."
                    );
                }


                setCandidates(
                    Array.isArray(data)
                        ? data
                        : data.results || []
                );

            } catch (error) {
                console.error(
                    "Talent fetch error:",
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
                        "Unable to load talent."
                    );
                }

            } finally {
                setLoading(false);
            }
        };


    useEffect(() => {
        fetchTalent();
    }, []);


    /* =====================================================
       FILTERING
       ===================================================== */

    const filteredCandidates =
        useMemo(
            () => {

                const searchText =
                    search
                        .trim()
                        .toLowerCase();


                const locationText =
                    location
                        .trim()
                        .toLowerCase();


                const skillText =
                    skill
                        .trim()
                        .toLowerCase();


                return candidates.filter(
                    (candidate) => {

                        const skills =
                            Array.isArray(
                                candidate.skills
                            )
                                ? candidate.skills
                                : [];


                        const matchesSearch =
                            !searchText ||
                            candidate.full_name
                                ?.toLowerCase()
                                .includes(
                                    searchText
                                ) ||
                            candidate.headline
                                ?.toLowerCase()
                                .includes(
                                    searchText
                                ) ||
                            skills.some(
                                (
                                    candidateSkill
                                ) =>
                                    String(
                                        candidateSkill
                                    )
                                        .toLowerCase()
                                        .includes(
                                            searchText
                                        )
                            );


                        const matchesLocation =
                            !locationText ||
                            candidate.location
                                ?.toLowerCase()
                                .includes(
                                    locationText
                                );


                        const matchesSkill =
                            !skillText ||
                            skills.some(
                                (
                                    candidateSkill
                                ) =>
                                    String(
                                        candidateSkill
                                    )
                                        .toLowerCase()
                                        .includes(
                                            skillText
                                        )
                            );


                        return (
                            matchesSearch &&
                            matchesLocation &&
                            matchesSkill
                        );
                    }
                );

            },
            [
                candidates,
                search,
                location,
                skill,
            ]
        );


    const hasFilters =
        search.trim() ||
        location.trim() ||
        skill.trim();


    const clearFilters = () => {
        setSearch("");
        setLocation("");
        setSkill("");
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
                            Recruiter Talent Search
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
                            Find Talent
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
                            Discover candidates by
                            their skills, location and
                            professional background.
                        </p>

                    </div>


                    {/* =================================================
                        SEARCH
                    ================================================= */}

                    <div
                        className="
                            mt-8
                            rounded-[22px]
                            border
                            border-[#D8E7DF]
                            bg-white/95
                            p-2.5
                            shadow-[0_15px_38px_rgba(25,70,52,0.06)]
                            backdrop-blur-xl
                        "
                    >

                        <div
                            className="
                                grid
                                gap-1
                                md:grid-cols-2
                                xl:grid-cols-[1.3fr_1fr_1fr_auto]
                            "
                        >

                            {/* SEARCH */}

                            <div
                                className="
                                    flex
                                    min-h-14
                                    items-center
                                    gap-3
                                    rounded-xl
                                    px-4
                                    focus-within:bg-[#F7FCF9]
                                "
                            >

                                <Search
                                    className="
                                        h-5
                                        w-5
                                        shrink-0
                                        text-[#27815F]
                                    "
                                />


                                <input
                                    type="text"
                                    value={
                                        search
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setSearch(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    placeholder="Name, headline or skill"
                                    className="
                                        min-w-0
                                        flex-1
                                        bg-transparent
                                        text-sm
                                        text-[#30343C]
                                        outline-none
                                        placeholder:text-[#9EA7A2]
                                    "
                                />

                            </div>


                            {/* LOCATION */}

                            <div
                                className="
                                    flex
                                    min-h-14
                                    items-center
                                    gap-3
                                    border-t
                                    border-[#EDF2EF]
                                    px-4
                                    md:border-l
                                    md:border-t-0
                                "
                            >

                                <MapPin
                                    className="
                                        h-5
                                        w-5
                                        shrink-0
                                        text-[#26916B]
                                    "
                                />


                                <input
                                    type="text"
                                    value={
                                        location
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setLocation(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    placeholder="Location"
                                    className="
                                        min-w-0
                                        flex-1
                                        bg-transparent
                                        text-sm
                                        text-[#30343C]
                                        outline-none
                                        placeholder:text-[#9EA7A2]
                                    "
                                />

                            </div>


                            {/* SKILL */}

                            <div
                                className="
                                    flex
                                    min-h-14
                                    items-center
                                    gap-3
                                    border-t
                                    border-[#EDF2EF]
                                    px-4
                                    xl:border-l
                                    xl:border-t-0
                                "
                            >

                                <Sparkles
                                    className="
                                        h-5
                                        w-5
                                        shrink-0
                                        text-[#7E8067]
                                    "
                                />


                                <input
                                    type="text"
                                    value={
                                        skill
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setSkill(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    placeholder="Skill"
                                    className="
                                        min-w-0
                                        flex-1
                                        bg-transparent
                                        text-sm
                                        text-[#30343C]
                                        outline-none
                                        placeholder:text-[#9EA7A2]
                                    "
                                />

                            </div>


                            {/* RESET */}

                            <button
                                type="button"
                                onClick={
                                    clearFilters
                                }
                                disabled={
                                    !hasFilters
                                }
                                className="
                                    inline-flex
                                    min-h-14
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    bg-[#0D99FF]
                                    px-6
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
                                    disabled:opacity-45
                                    disabled:hover:translate-y-0
                                "
                            >

                                <RefreshCw
                                    className="
                                        h-4
                                        w-4
                                    "
                                />

                                Reset

                            </button>

                        </div>

                    </div>


                    {/* FILTER TAGS */}

                    {hasFilters && (

                        <div
                            className="
                                mt-4
                                flex
                                flex-wrap
                                items-center
                                gap-2
                            "
                        >

                            <span
                                className="
                                    inline-flex
                                    items-center
                                    gap-1.5
                                    text-xs
                                    font-medium
                                    text-[#76827C]
                                "
                            >

                                <SlidersHorizontal
                                    className="
                                        h-3.5
                                        w-3.5
                                    "
                                />

                                Active filters

                            </span>


                            {search.trim() && (
                                <FilterTag>
                                    {search}
                                </FilterTag>
                            )}


                            {location.trim() && (
                                <FilterTag>
                                    {location}
                                </FilterTag>
                            )}


                            {skill.trim() && (
                                <FilterTag>
                                    {skill}
                                </FilterTag>
                            )}


                            <button
                                type="button"
                                onClick={
                                    clearFilters
                                }
                                className="
                                    inline-flex
                                    items-center
                                    gap-1
                                    px-2
                                    py-1.5
                                    text-xs
                                    font-medium
                                    text-[#69756F]
                                    transition
                                    hover:text-[#009944]
                                "
                            >

                                <X
                                    className="
                                        h-3.5
                                        w-3.5
                                    "
                                />

                                Clear

                            </button>

                        </div>

                    )}

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

                {/* HEADING */}

                <div
                    className="
                        mb-8
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
                            Candidate Directory
                        </p>


                        <h2
                            className="
                                mt-2
                                text-[28px]
                                font-semibold
                                tracking-[-0.025em]
                                text-[#24282F]
                            "
                        >
                            Available Talent
                        </h2>


                        <p
                            className="
                                mt-2
                                text-sm
                                text-[#717D77]
                            "
                        >
                            {loading
                                ? "Loading candidates..."
                                : `${filteredCandidates.length} ${
                                      filteredCandidates.length ===
                                      1
                                          ? "candidate"
                                          : "candidates"
                                  } found`}
                        </p>

                    </div>

                </div>


                {/* ERROR */}

                {error && (

                    <div
                        className="
                            mb-7
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


                {/* =================================================
                    LOADING
                ================================================= */}

                {loading ? (

                    <div
                        className="
                            grid
                            gap-5
                            md:grid-cols-2
                            xl:grid-cols-3
                        "
                    >

                        {[1, 2, 3, 4, 5, 6].map(
                            (item) => (

                            <div
                                key={item}
                                className="
                                    animate-pulse
                                    rounded-[22px]
                                    border
                                    border-[#DCE8E2]
                                    bg-white/95
                                    p-6
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
                                            h-16
                                            w-16
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
                                                h-5
                                                w-2/3
                                                rounded
                                                bg-[#E5ECE8]
                                            "
                                        />


                                        <div
                                            className="
                                                mt-3
                                                h-4
                                                w-1/2
                                                rounded
                                                bg-[#EDF3F0]
                                            "
                                        />

                                    </div>

                                </div>


                                <div
                                    className="
                                        mt-6
                                        h-24
                                        rounded-xl
                                        bg-[#F1F6F3]
                                    "
                                />

                            </div>

                            )
                        )}

                    </div>


                ) : filteredCandidates.length ===
                    0 ? (

                    /* =================================================
                       EMPTY
                    ================================================= */

                    <div
                        className="
                            mx-auto
                            max-w-xl
                            rounded-[24px]
                            border
                            border-[#DCE8E2]
                            bg-white/95
                            px-6
                            py-14
                            text-center
                            shadow-[0_10px_30px_rgba(25,70,52,0.045)]
                        "
                    >

                        <div
                            className="
                                mx-auto
                                flex
                                h-16
                                w-16
                                items-center
                                justify-center
                                rounded-2xl
                                bg-[#EAF7F1]
                                text-[#27815F]
                            "
                        >

                            <SearchX
                                className="
                                    h-7
                                    w-7
                                "
                            />

                        </div>


                        <h3
                            className="
                                mt-6
                                text-xl
                                font-semibold
                                text-[#292D35]
                            "
                        >
                            No matching candidates
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
                            Try changing the name,
                            location or skill filter.
                        </p>


                        {hasFilters && (

                            <button
                                type="button"
                                onClick={
                                    clearFilters
                                }
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

                                <RefreshCw
                                    className="
                                        h-4
                                        w-4
                                    "
                                />

                                Reset filters

                            </button>

                        )}

                    </div>


                ) : (

                    /* =================================================
                       TALENT CARDS
                    ================================================= */

                    <div
                        className="
                            grid
                            gap-5
                            md:grid-cols-2
                            xl:grid-cols-3
                        "
                    >

                        {filteredCandidates.map(
                            (
                                candidate
                            ) => (

                            <TalentCard
                                key={
                                    candidate.id
                                }
                                candidate={
                                    candidate
                                }
                            />

                            )
                        )}

                    </div>

                )}

            </main>

        </div>
    );
}


/* =========================================================
   TALENT CARD
   ========================================================= */

function TalentCard({
    candidate,
}) {
    const skills =
        Array.isArray(
            candidate.skills
        )
            ? candidate.skills
            : [];


    const education =
        Array.isArray(
            candidate.education
        )
            ? candidate.education
            : [];


    const experience =
        Array.isArray(
            candidate.experience
        )
            ? candidate.experience
            : [];


    return (
        <article
            className="
                group
                flex
                h-full
                flex-col
                rounded-[22px]
                border
                border-[#DCE8E2]
                bg-white/95
                p-6
                shadow-[0_8px_24px_rgba(25,70,52,0.04)]
                backdrop-blur-sm
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-[#B8D9C8]
                hover:shadow-[0_16px_34px_rgba(25,70,52,0.08)]
            "
        >

            {/* PROFILE */}

            <div
                className="
                    flex
                    items-start
                    gap-4
                "
            >

                {candidate.profile_image ? (

                    <div
                        className="
                            h-16
                            w-16
                            shrink-0
                            overflow-hidden
                            rounded-full
                            border
                            border-[#DCE7E2]
                            bg-white
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
                            h-16
                            w-16
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-[#EAF7F1]
                            text-[#27815F]
                        "
                    >

                        <UserRoundSearch
                            className="
                                h-7
                                w-7
                            "
                        />

                    </div>

                )}


                <div
                    className="
                        min-w-0
                        flex-1
                    "
                >

                    <h3
                        className="
                            truncate
                            text-[19px]
                            font-semibold
                            tracking-[-0.015em]
                            text-[#282C34]
                        "
                    >
                        {candidate.full_name ||
                            "Candidate"}
                    </h3>


                    <p
                        className="
                            mt-1
                            line-clamp-2
                            text-sm
                            leading-6
                            text-[#68746E]
                        "
                    >
                        {candidate.headline ||
                            "CareerSync Candidate"}
                    </p>

                </div>

            </div>


            {/* LOCATION */}

            <div
                className="
                    mt-5
                    flex
                    items-center
                    gap-2
                    text-sm
                    text-[#6B7771]
                "
            >

                <MapPin
                    className="
                        h-4
                        w-4
                        shrink-0
                        text-[#27815F]
                    "
                />


                <span
                    className="
                        truncate
                    "
                >
                    {candidate.location ||
                        "Location not added"}
                </span>

            </div>


            {/* PROFILE INFO */}

            <div
                className="
                    mt-5
                    grid
                    grid-cols-2
                    gap-3
                "
            >

                <MiniInfo
                    icon={
                        GraduationCap
                    }
                    label="Education"
                    value={
                        education.length
                    }
                />


                <MiniInfo
                    icon={
                        BriefcaseBusiness
                    }
                    label="Experience"
                    value={
                        experience.length
                    }
                />

            </div>


            {/* SKILLS */}

            <div
                className="
                    mt-5
                "
            >

                <p
                    className="
                        text-xs
                        font-medium
                        uppercase
                        tracking-[0.09em]
                        text-[#7B8781]
                    "
                >
                    Skills
                </p>


                {skills.length >
                0 ? (

                    <div
                        className="
                            mt-3
                            flex
                            flex-wrap
                            gap-2
                        "
                    >

                        {skills
                            .slice(
                                0,
                                5
                            )
                            .map(
                                (
                                    candidateSkill,
                                    index
                                ) => (

                            <span
                                key={`${candidate.id}-${candidateSkill}-${index}`}
                                className="
                                    rounded-full
                                    border
                                    border-[#D8E8E1]
                                    bg-[#F3FAF6]
                                    px-3
                                    py-1
                                    text-xs
                                    text-[#5E6D66]
                                "
                            >
                                {
                                    candidateSkill
                                }
                            </span>

                                )
                            )}


                        {skills.length >
                            5 && (

                            <span
                                className="
                                    rounded-full
                                    border
                                    border-[#DFE7E3]
                                    bg-[#F8FAF9]
                                    px-3
                                    py-1
                                    text-xs
                                    text-[#77817C]
                                "
                            >
                                +
                                {skills.length -
                                    5}{" "}
                                more
                            </span>

                        )}

                    </div>

                ) : (

                    <p
                        className="
                            mt-3
                            text-sm
                            text-[#8B958F]
                        "
                    >
                        No skills added.
                    </p>

                )}

            </div>


            {/* BIO */}

            {candidate.bio && (

                <p
                    className="
                        mt-5
                        line-clamp-3
                        text-sm
                        leading-6
                        text-[#737E78]
                    "
                >
                    {candidate.bio}
                </p>

            )}


            {/* BUTTON */}

            <div
                className="
                    mt-auto
                    border-t
                    border-[#E7EFEB]
                    pt-5
                "
            >

                <Link
                    to={`/recruiter/talent/${candidate.id}`}
                    className="
                        inline-flex
                        min-h-11
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-[#0D99FF]
                        px-5
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
                    "
                >

                    View Profile

                    <ArrowRight
                        className="
                            h-4
                            w-4
                            transition-transform
                            duration-300
                            group-hover:translate-x-0.5
                        "
                    />

                </Link>

            </div>

        </article>
    );
}


/* =========================================================
   MINI INFO
   ========================================================= */

function MiniInfo({
    icon: Icon,
    label,
    value,
}) {
    return (
        <div
            className="
                rounded-xl
                border
                border-[#E3ECE7]
                bg-[#F8FCFA]
                p-3.5
            "
        >

            <Icon
                className="
                    h-4
                    w-4
                    text-[#27815F]
                "
            />


            <p
                className="
                    mt-2
                    text-lg
                    font-semibold
                    text-[#3A443F]
                "
            >
                {value}
            </p>


            <p
                className="
                    mt-0.5
                    text-[11px]
                    text-[#89938E]
                "
            >
                {label}
            </p>

        </div>
    );
}


/* =========================================================
   FILTER TAG
   ========================================================= */

function FilterTag({
    children,
}) {
    return (
        <span
            className="
                rounded-full
                border
                border-[#D7E7DF]
                bg-white/90
                px-3
                py-1.5
                text-xs
                text-[#596761]
            "
        >
            {children}
        </span>
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


export default Talent;