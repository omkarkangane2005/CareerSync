
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api";

function Talent() {
    const [talent, setTalent] = useState([]);
    const [search, setSearch] = useState("");
    const [location, setLocation] = useState("");
    const [skill, setSkill] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchTalent = async () => {
        try {
            setLoading(true);
            setError("");

            const params = new URLSearchParams();

            if (search.trim()) {
                params.append("search", search.trim());
            }

            if (location.trim()) {
                params.append("location", location.trim());
            }

            if (skill.trim()) {
                params.append("skill", skill.trim());
            }

            const queryString = params.toString();

            const endpoint = queryString
                ? `/talent/?${queryString}`
                : "/talent/";

            const response = await apiFetch(endpoint);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.detail ||
                    "Unable to load talent."
                );
            }

            setTalent(data);
        } catch (error) {
            console.error(
                "Talent fetch error:",
                error
            );

            if (error.message === "SESSION_EXPIRED") {
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

    const handleSearch = (event) => {
        event.preventDefault();
        fetchTalent();
    };

    return (
        <div className="min-h-screen bg-slate-50 py-10 px-6">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <Link
                        to="/recruiter/dashboard"
                        className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                        ← Back to Dashboard
                    </Link>

                    <h1 className="text-3xl font-bold text-slate-900 mt-5">
                        Find Talent
                    </h1>

                    <p className="text-slate-600 mt-2">
                        Discover skilled candidates for your
                        job opportunities.
                    </p>
                </div>

                {/* Search */}
                <form
                    onSubmit={handleSearch}
                    className="bg-white border rounded-xl shadow-sm p-6 mb-8"
                >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                        <input
                            type="text"
                            placeholder="Search candidates..."
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            className="border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <input
                            type="text"
                            placeholder="Location"
                            value={location}
                            onChange={(event) =>
                                setLocation(event.target.value)
                            }
                            className="border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <input
                            type="text"
                            placeholder="Skill e.g. React"
                            value={skill}
                            onChange={(event) =>
                                setSkill(event.target.value)
                            }
                            className="border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <button
                            type="submit"
                            className="bg-blue-600 text-white rounded-lg px-5 py-3 font-medium hover:bg-blue-700 transition"
                        >
                            Search Talent
                        </button>

                    </div>
                </form>

                {/* Error */}
                {error && (
                    <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                        {error}
                    </div>
                )}

                {/* Results */}
                <div className="mb-4">
                    <h2 className="text-xl font-semibold text-slate-900">
                        Available Candidates
                    </h2>

                    <p className="text-sm text-slate-500 mt-1">
                        {talent.length} candidate
                        {talent.length !== 1
                            ? "s"
                            : ""}
                    </p>
                </div>

                {loading ? (
                    <div className="bg-white border rounded-xl p-10 text-center">
                        <p className="text-slate-500">
                            Loading candidates...
                        </p>
                    </div>
                ) : talent.length === 0 ? (
                    <div className="bg-white border rounded-xl p-10 text-center">
                        <h3 className="text-lg font-semibold text-slate-900">
                            No candidates found
                        </h3>

                        <p className="text-slate-500 mt-2">
                            Try a different search or filter.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {talent.map((candidate) => (
                            <div
                                key={candidate.id}
                                className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition"
                            >

                                {/* Profile */}
                                <div className="flex items-center gap-4">

                                    {candidate.profile_image ? (
                                        <img
                                            src={
                                                candidate.profile_image
                                            }
                                            alt={
                                                candidate.full_name
                                            }
                                            className="w-14 h-14 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xl font-bold">
                                            {candidate.full_name
                                                ?.charAt(0)
                                                ?.toUpperCase() || "U"}
                                        </div>
                                    )}

                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900">
                                            {candidate.full_name}
                                        </h3>

                                        <p className="text-sm text-slate-500">
                                            {candidate.headline ||
                                                "Software Developer"}
                                        </p>
                                    </div>

                                </div>

                                {/* Location */}
                                {candidate.location && (
                                    <p className="text-sm text-slate-600 mt-5">
                                        📍 {candidate.location}
                                    </p>
                                )}

                                {/* Hourly Rate */}
                                {candidate.hourly_rate && (
                                    <p className="text-sm text-slate-600 mt-2">
                                        💰 ₹
                                        {candidate.hourly_rate}
                                        / hour
                                    </p>
                                )}

                                {/* Bio */}
                                <p className="text-sm text-slate-600 mt-4 line-clamp-3">
                                    {candidate.bio ||
                                        "No biography added yet."}
                                </p>

                                {/* Skills */}
                                <div className="flex flex-wrap gap-2 mt-5">
                                    {candidate.skills?.length > 0 ? (
                                        candidate.skills.map(
                                            (candidateSkill) => (
                                                <span
                                                    key={
                                                        candidateSkill
                                                    }
                                                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                                                >
                                                    {
                                                        candidateSkill
                                                    }
                                                </span>
                                            )
                                        )
                                    ) : (
                                        <span className="text-xs text-slate-400">
                                            No skills added
                                        </span>
                                    )}
                                </div>

                                {/* Action */}
<Link
    to={`/recruiter/talent/${candidate.id}`}
    className="block w-full mt-6 text-center border border-blue-600 text-blue-600 rounded-lg py-2.5 font-medium hover:bg-blue-600 hover:text-white transition"
>
    View Profile
</Link>

                            </div>
                        ))}

                    </div>
                )}

            </div>
        </div>
    );
}

export default Talent;

