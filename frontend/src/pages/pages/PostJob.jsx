
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../api";

function PostJob() {
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

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSubmitting(true);

        const skillsArray = formData.skills
            .split(",")
            .map((skill) => skill.trim())
            .filter((skill) => skill !== "");

        try {
            const response = await apiFetch("/jobs/", {
                method: "POST",
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
            });

            const data = await response.json();

            console.log(
                "Create job status:",
                response.status
            );

            console.log(
                "Create job response:",
                data
            );

            if (!response.ok) {
                throw new Error(
                    data.detail ||
                    "Unable to create job."
                );
            }

            navigate("/recruiter/dashboard");

        } catch (error) {
            console.error(
                "Create job error:",
                error
            );

            if (error.message === "SESSION_EXPIRED") {
                setError(
                    "Your session has expired. Please login again."
                );
            } else {
                setError(
                    error.message ||
                    "Unable to create job."
                );
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-6">

            <div className="max-w-4xl mx-auto">

                <Link
                    to="/recruiter/dashboard"
                    className="text-blue-600 font-medium hover:text-blue-700"
                >
                    ← Back to Dashboard
                </Link>

                <div className="bg-white border rounded-xl shadow-sm mt-6">

                    <div className="p-8 border-b">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Post a Job
                        </h1>

                        <p className="text-gray-600 mt-2">
                            Create a new opportunity for talented candidates.
                        </p>
                    </div>

                    {error && (
                        <div className="mx-8 mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="p-8 space-y-6"
                    >
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Job Title
                            </label>

                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                placeholder="e.g. Frontend Developer"
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Company
                                </label>

                                <input
                                    type="text"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. TechNova Solutions"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Location
                                </label>

                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. Pune, Maharashtra"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Job Type
                                </label>

                                <select
                                    name="job_type"
                                    value={formData.job_type}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Experience
                                </label>

                                <input
                                    type="text"
                                    name="experience"
                                    value={formData.experience}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. 0 - 2 Years"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Salary
                            </label>

                            <input
                                type="text"
                                name="salary"
                                value={formData.salary}
                                onChange={handleChange}
                                required
                                placeholder="e.g. ₹5 - ₹8 LPA"
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Skills
                            </label>

                            <input
                                type="text"
                                name="skills"
                                value={formData.skills}
                                onChange={handleChange}
                                required
                                placeholder="e.g. React, JavaScript, HTML, CSS"
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            <p className="text-sm text-gray-500 mt-2">
                                Separate skills with commas.
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Job Description
                            </label>

                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows="7"
                                placeholder="Describe the role, responsibilities, and requirements..."
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 pt-4">

                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {submitting
                                    ? "Publishing..."
                                    : "Publish Job"}
                            </button>

                            <Link
                                to="/recruiter/dashboard"
                                className="flex-1 text-center border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
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

export default PostJob;

