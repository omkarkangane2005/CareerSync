import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { apiFetch } from "../api";


function getApiErrorMessage(data) {
    if (!data) {
        return "Unable to submit application.";
    }

    if (typeof data.detail === "string") {
        return data.detail;
    }

    const fieldOrder = [
        "job",
        "full_name",
        "email",
        "phone",
        "cover_letter",
        "non_field_errors",
    ];

    for (const field of fieldOrder) {
        const value = data[field];

        if (!value) {
            continue;
        }

        if (Array.isArray(value)) {
            return value.join(" ");
        }

        if (typeof value === "string") {
            return value;
        }
    }

    return "Unable to submit application.";
}


function ApplyJob() {
    const { id } = useParams();

    const [job, setJob] = useState(null);

    const [loading, setLoading] = useState(true);

    const [submitting, setSubmitting] =
        useState(false);

    const [alreadyApplied, setAlreadyApplied] =
        useState(false);

    const [submitted, setSubmitted] =
        useState(false);

    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        coverLetter: "",
    });


    useEffect(() => {
        const loadPage = async () => {
            try {
                setLoading(true);
                setError("");

                // ---------------------------------
                // Load job
                // ---------------------------------

                const jobResponse = await apiFetch(
                    `/jobs/${id}/`
                );

                const jobData =
                    await jobResponse.json();

                if (!jobResponse.ok) {
                    throw new Error(
                        jobData.detail ||
                        "Job not found."
                    );
                }

                setJob(jobData);


                // ---------------------------------
                // Check existing applications
                // ---------------------------------

                const applicationResponse =
                    await apiFetch(
                        "/applications/"
                    );

                const applicationData =
                    await applicationResponse.json();

                if (!applicationResponse.ok) {
                    throw new Error(
                        applicationData.detail ||
                        "Unable to verify application status."
                    );
                }

                const applications =
                    Array.isArray(applicationData)
                        ? applicationData
                        : applicationData.results || [];

const hasApplied =
    applications.some(
        (application) =>
            Number(application.job) ===
                Number(id) &&
            application.status !==
                "Withdrawn"
    );
                setAlreadyApplied(hasApplied);

            } catch (error) {
                console.error(
                    "Apply page loading error:",
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
                        "Unable to load this job."
                    );
                }
            } finally {
                setLoading(false);
            }
        };

        loadPage();

    }, [id]);


    const handleChange = (event) => {
        const {
            name,
            value,
        } = event.target;

        setFormData(
            (previousData) => ({
                ...previousData,
                [name]: value,
            })
        );
    };


    const handleSubmit = async (event) => {
        event.preventDefault();

        if (alreadyApplied) {
            setError(
                "You have already applied for this job."
            );

            return;
        }

        try {
            setSubmitting(true);
            setError("");

            const response = await apiFetch(
                "/applications/",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        job: Number(id),

                        full_name:
                            formData.fullName,

                        email:
                            formData.email,

                        phone:
                            formData.phone,

                        cover_letter:
                            formData.coverLetter,
                    }),
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                const message =
                    getApiErrorMessage(data);

                // Backend is the source of truth.
                // If it says duplicate application,
                // update the local UI as well.
                if (
                    message
                        .toLowerCase()
                        .includes(
                            "already applied"
                        )
                ) {
                    setAlreadyApplied(true);
                }

                throw new Error(message);
            }

            setSubmitted(true);
            setAlreadyApplied(true);

        } catch (error) {
            console.error(
                "Application error:",
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
                    "Unable to submit application."
                );
            }
        } finally {
            setSubmitting(false);
        }
    };


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-gray-600">
                    Loading application...
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
                        {error ||
                            "Unable to load this job."}
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

                        at {job.company} has been
                        submitted successfully.
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


    if (alreadyApplied) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">

                <div className="bg-white rounded-xl border shadow-sm p-10 max-w-lg w-full text-center">

                    <div className="text-5xl mb-5">
                        ✓
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900">
                        Already Applied
                    </h1>

                    <p className="text-gray-600 mt-3">
                        You have already applied for{" "}

                        <span className="font-semibold">
                            {job.title}
                        </span>{" "}

                        at {job.company}.
                    </p>

                    <p className="text-gray-500 mt-2">
                        You can track the application
                        from your dashboard.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">

                        <Link
                            to="/dashboard"
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
                        >
                            View Application
                        </Link>

                        <Link
                            to={`/jobs/${job.id}`}
                            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition"
                        >
                            Back to Job
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
                            {job.company} •{" "}
                            {job.location}
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
                                value={
                                    formData.fullName
                                }
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
                                value={
                                    formData.email
                                }
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
                                value={
                                    formData.phone
                                }
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
                                value={
                                    formData.coverLetter
                                }
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