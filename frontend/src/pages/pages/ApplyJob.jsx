
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function ApplyJob() {
    const { id } = useParams();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        coverLetter: "",
    });

    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchJob();
    }, [id]);

    const fetchJob = async () => {
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/api/jobs/${id}/`
            );

            if (!response.ok) {
                throw new Error("Job not found.");
            }

            const data = await response.json();
            setJob(data);
        } catch (error) {
            console.error("Job fetch error:", error);
            setError("Unable to load this job.");
        } finally {
            setLoading(false);
        }
    };

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

        const accessToken = localStorage.getItem("accessToken");

        console.log(
            "Access token available:",
            Boolean(accessToken)
        );

        if (!accessToken) {
            setError("Please login before applying for a job.");
            setSubmitting(false);
            return;
        }

        try {
            const response = await fetch(
                "http://127.0.0.1:8000/api/applications/",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({
                        job: Number(id),
                        full_name: formData.fullName,
                        email: formData.email,
                        phone: formData.phone,
                        cover_letter: formData.coverLetter,
                    }),
                }
            );

            const data = await response.json();

            console.log("Application response:", response.status);
            console.log("Application data:", data);

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error(
                        "Your access token is invalid or expired. Please login again."
                    );
                }

                if (response.status === 403) {
                    throw new Error(
                        data.detail ||
                        "You do not have permission to submit this application."
                    );
                }

                if (data.detail) {
                    throw new Error(data.detail);
                }

                throw new Error(
                    "Unable to submit application."
                );
            }

            setSubmitted(true);
        } catch (error) {
            console.error("Application error:", error);
            setError(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-gray-600">
                    Loading job...
                </p>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
                <div className="bg-white p-8 rounded-xl border shadow-sm text-center">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Job Not Found
                    </h1>

                    <p className="text-gray-600 mt-3">
                        {error}
                    </p>

                    <Link
                        to="/jobs"
                        className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg"
                    >
                        Browse Jobs
                    </Link>
                </div>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
                <div className="bg-white rounded-xl border shadow-sm p-10 max-w-lg w-full text-center">

                    <div className="text-5xl mb-5">
                        ✅
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900">
                        Application Submitted!
                    </h1>

                    <p className="text-gray-600 mt-3">
                        Your application for{" "}
                        <span className="font-semibold">
                            {job.title}
                        </span>{" "}
                        at {job.company} has been submitted successfully.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">

                        <Link
                            to="/dashboard"
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
                        >
                            Go to Dashboard
                        </Link>

                        <Link
                            to="/jobs"
                            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition"
                        >
                            Browse More Jobs
                        </Link>

                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-6">

            <div className="max-w-3xl mx-auto">

                <Link
                    to={`/jobs/${job.id}`}
                    className="text-blue-600 font-medium hover:text-blue-700"
                >
                    ← Back to Job
                </Link>

                <div className="bg-white rounded-xl border shadow-sm p-8 mt-6">

                    <div className="border-b pb-6">

                        <h1 className="text-3xl font-bold text-gray-900">
                            Apply for {job.title}
                        </h1>

                        <p className="text-gray-600 mt-2">
                            {job.company} • {job.location}
                        </p>

                    </div>

                    {error && (
                        <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6 mt-8"
                    >

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name
                            </label>

                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your email"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Phone
                            </label>

                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your phone number"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Cover Letter
                            </label>

                            <textarea
                                name="coverLetter"
                                value={formData.coverLetter}
                                onChange={handleChange}
                                required
                                rows="6"
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Write a short cover letter..."
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {submitting
                                ? "Submitting..."
                                : "Submit Application"}
                        </button>

                    </form>

                </div>

            </div>

        </div>
    );
}

export default ApplyJob;

