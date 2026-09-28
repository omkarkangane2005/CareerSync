
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function ApplyJob() {
    const { id } = useParams();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        coverLetter: "",
    });

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/jobs/${id}/`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Job not found");
                }

                return response.json();
            })
            .then((data) => {
                setJob(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError("Unable to load job.");
                setLoading(false);
            });
    }, [id]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((currentData) => ({
            ...currentData,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setSubmitting(true);
        setError("");

        const applicationData = {
            job: Number(id),
            full_name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            cover_letter: formData.coverLetter,
        };

        try {
            const response = await fetch(
                "http://127.0.0.1:8000/api/applications/",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(applicationData),
                }
            );

            if (!response.ok) {
                const data = await response.json();
                console.error(data);

                throw new Error("Application submission failed");
            }

            await response.json();

            setSuccess(true);
        } catch (err) {
            console.error(err);
            setError(
                "Unable to submit application. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600 text-xl">
                    Loading application...
                </p>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold">
                    Job not found
                </h1>

                <Link
                    to="/jobs"
                    className="text-blue-600 mt-4"
                >
                    Back to Jobs
                </Link>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
                <div className="bg-white max-w-lg w-full rounded-2xl shadow-sm border p-10 text-center">
                    <div className="text-5xl mb-5">
                        ✅
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900">
                        Application Submitted!
                    </h1>

                    <p className="text-gray-600 mt-3">
                        Your application for{" "}
                        <strong>{job.title}</strong> at{" "}
                        <strong>{job.company}</strong> has been
                        submitted successfully.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
                        <Link
                            to="/dashboard"
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium"
                        >
                            View Dashboard
                        </Link>

                        <Link
                            to="/jobs"
                            className="border px-6 py-3 rounded-lg font-medium"
                        >
                            Browse More Jobs
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="max-w-3xl mx-auto px-6">
                <div className="bg-white rounded-2xl shadow-sm border p-8">
                    <div className="mb-8">
                        <p className="text-blue-600 font-medium">
                            {job.company}
                        </p>

                        <h1 className="text-3xl font-bold text-gray-900 mt-2">
                            Apply for {job.title}
                        </h1>

                        <p className="text-gray-500 mt-2">
                            {job.location} • {job.job_type}
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >
                        <div>
                            <label className="block font-medium text-gray-700 mb-2">
                                Full Name
                            </label>

                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div>
                            <label className="block font-medium text-gray-700 mb-2">
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your email"
                            />
                        </div>

                        <div>
                            <label className="block font-medium text-gray-700 mb-2">
                                Phone
                            </label>

                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your phone number"
                            />
                        </div>

                        <div>
                            <label className="block font-medium text-gray-700 mb-2">
                                Cover Letter
                            </label>

                            <textarea
                                name="coverLetter"
                                value={formData.coverLetter}
                                onChange={handleChange}
                                required
                                rows="6"
                                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Tell the recruiter why you are suitable for this role..."
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-400"
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

