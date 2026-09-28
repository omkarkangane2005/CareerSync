
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../api";

function EditJob() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        company: "",
        location: "",
        job_type: "Full Time",
        salary: "",
        experience: "",
        description: "",
        skills: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const response = await apiFetch(
                    `/jobs/${id}/`
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.detail ||
                        "Unable to load job."
                    );
                }

                setFormData({
                    title: data.title || "",
                    company: data.company || "",
                    location: data.location || "",
                    job_type: data.job_type || "Full Time",
                    salary: data.salary || "",
                    experience: data.experience || "",
                    description: data.description || "",
                    skills: Array.isArray(data.skills)
                        ? data.skills.join(", ")
                        : "",
                });
            } catch (error) {
                console.error(
                    "Fetch job error:",
                    error
                );

                if (error.message === "SESSION_EXPIRED") {
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
                setLoading(false);
            }
        };

        fetchJob();
    }, [id]);

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setSaving(true);
            setError("");

            const skillsArray = formData.skills
                .split(",")
                .map((skill) => skill.trim())
                .filter((skill) => skill !== "");

            const response = await apiFetch(
                `/jobs/${id}/`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        title: formData.title,
                        company: formData.company,
                        location: formData.location,
                        job_type: formData.job_type,
                        salary: formData.salary,
                        experience: formData.experience,
                        description: formData.description,
                        skills: skillsArray,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.detail ||
                    "Unable to update job."
                );
            }

            navigate("/recruiter/dashboard");
        } catch (error) {
            console.error(
                "Update job error:",
                error
            );

            if (error.message === "SESSION_EXPIRED") {
                setError(
                    "Your session has expired. Please login again."
                );
            } else {
                setError(
                    error.message ||
                    "Unable to update job."
                );
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <p className="text-slate-500">
                    Loading job...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-10 px-6">
            <div className="max-w-3xl mx-auto">

                <Link
                    to="/recruiter/dashboard"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                >
                    ← Back to Dashboard
                </Link>

                <div className="bg-white border rounded-xl shadow-sm p-8 mt-6">

                    <h1 className="text-3xl font-bold text-slate-900">
                        Edit Job
                    </h1>

                    <p className="text-slate-500 mt-2 mb-8">
                        Update your job posting information.
                    </p>

                    {error && (
                        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                            {error}
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >

                        {/* Job Title */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Job Title
                            </label>

                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Company */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Company
                            </label>

                            <input
                                type="text"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                required
                                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Location
                            </label>

                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Job Type */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Job Type
                            </label>

                            <select
                                name="job_type"
                                value={formData.job_type}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        </div>

                        {/* Salary */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Salary
                            </label>

                            <input
                                type="text"
                                name="salary"
                                value={formData.salary}
                                onChange={handleChange}
                                required
                                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Experience */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Experience
                            </label>

                            <input
                                type="text"
                                name="experience"
                                value={formData.experience}
                                onChange={handleChange}
                                required
                                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Skills */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Skills
                            </label>

                            <input
                                type="text"
                                name="skills"
                                value={formData.skills}
                                onChange={handleChange}
                                placeholder="React, JavaScript, HTML, CSS"
                                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            <p className="text-xs text-slate-500 mt-1">
                                Separate skills with commas.
                            </p>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows="6"
                                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4 pt-4">

                            <button
                                type="submit"
                                disabled={saving}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                            >
                                {saving
                                    ? "Saving..."
                                    : "Save Changes"}
                            </button>

                            <Link
                                to="/recruiter/dashboard"
                                className="border border-slate-300 px-6 py-3 rounded-lg font-medium text-slate-700 hover:bg-slate-50"
                            >
                                Cancel
                            </Link>

                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditJob;

