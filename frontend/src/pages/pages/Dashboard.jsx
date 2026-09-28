
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { apiFetch } from "../api";

function Dashboard() {
    const [applications, setApplications] = useState([]);
    const [invitations, setInvitations] = useState([]);

    const [loading, setLoading] = useState(true);
    const [invitationLoading, setInvitationLoading] =
        useState(true);

    const [error, setError] = useState("");
    const [invitationError, setInvitationError] =
        useState("");

    const [statusUpdating, setStatusUpdating] =
        useState(null);

    const savedJobs = JSON.parse(
        localStorage.getItem("savedJobs") || "[]"
    );

    useEffect(() => {
        fetchApplications();
        fetchInvitations();
    }, []);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await apiFetch(
                "/applications/"
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.detail ||
                        "Unable to load applications."
                );
            }

            setApplications(data);
        } catch (error) {
            console.error(
                "Applications fetch error:",
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
                        "Unable to load applications."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchInvitations = async () => {
        try {
            setInvitationLoading(true);
            setInvitationError("");

            const response = await apiFetch(
                "/invitations/received/"
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.detail ||
                        "Unable to load invitations."
                );
            }

            setInvitations(data);
        } catch (error) {
            console.error(
                "Invitations fetch error:",
                error
            );

            if (
                error.message ===
                "SESSION_EXPIRED"
            ) {
                setInvitationError(
                    "Your session has expired. Please login again."
                );
            } else {
                setInvitationError(
                    error.message ||
                        "Unable to load invitations."
                );
            }
        } finally {
            setInvitationLoading(false);
        }
    };

    const updateInvitationStatus = async (
        invitationId,
        status
    ) => {
        try {
            setStatusUpdating(invitationId);
            setInvitationError("");

            const response = await apiFetch(
                `/invitations/${invitationId}/status/`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        status,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.detail ||
                        "Unable to update invitation."
                );
            }

            setInvitations((current) =>
                current.map((invitation) =>
                    invitation.id === invitationId
                        ? data
                        : invitation
                )
            );
        } catch (error) {
            console.error(
                "Invitation status error:",
                error
            );

            if (
                error.message ===
                "SESSION_EXPIRED"
            ) {
                setInvitationError(
                    "Your session has expired. Please login again."
                );
            } else {
                setInvitationError(
                    error.message ||
                        "Unable to update invitation."
                );
            }
        } finally {
            setStatusUpdating(null);
        }
    };

    const pendingInvitations =
        invitations.filter(
            (invitation) =>
                invitation.status === "Pending"
        ).length;

    const interviews = applications.filter(
        (application) =>
            application.status === "Interview"
    ).length;

    return (
        <div className="min-h-screen bg-slate-50 px-6 py-10">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">
                        Candidate Dashboard
                    </h1>

                    <p className="text-slate-500 mt-2">
                        Track your applications,
                        invitations, and career activity.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

                    <div className="bg-white border border-slate-200 rounded-xl p-6">
                        <p className="text-sm text-slate-500">
                            Applications
                        </p>

                        <p className="text-3xl font-bold text-slate-900 mt-2">
                            {applications.length}
                        </p>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-6">
                        <p className="text-sm text-slate-500">
                            Pending Invitations
                        </p>

                        <p className="text-3xl font-bold text-blue-600 mt-2">
                            {pendingInvitations}
                        </p>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-6">
                        <p className="text-sm text-slate-500">
                            Saved Jobs
                        </p>

                        <p className="text-3xl font-bold text-slate-900 mt-2">
                            {savedJobs.length}
                        </p>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-6">
                        <p className="text-sm text-slate-500">
                            Interviews
                        </p>

                        <p className="text-3xl font-bold text-slate-900 mt-2">
                            {interviews}
                        </p>
                    </div>
                </div>

                {/* Job Invitations */}
                <section className="mt-10">

                    <div className="mb-5">
                        <h2 className="text-2xl font-bold text-slate-900">
                            Job Invitations
                        </h2>

                        <p className="text-slate-500 mt-1">
                            Opportunities sent by recruiters.
                        </p>
                    </div>

                    {invitationError && (
                        <div className="mb-5 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                            {invitationError}
                        </div>
                    )}

                    {invitationLoading ? (
                        <div className="bg-white border border-slate-200 rounded-xl p-8">
                            <p className="text-slate-500">
                                Loading invitations...
                            </p>
                        </div>
                    ) : invitations.length === 0 ? (
                        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">

                            <p className="text-slate-500">
                                You don't have any job
                                invitations yet.
                            </p>

                            <Link
                                to="/jobs"
                                className="inline-block mt-4 text-blue-600 font-medium hover:text-blue-700"
                            >
                                Browse Jobs →
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">

                            {invitations.map(
                                (invitation) => (
                                    <div
                                        key={
                                            invitation.id
                                        }
                                        className="bg-white border border-slate-200 rounded-xl p-6"
                                    >
                                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">

                                            <div className="flex-1">

                                                <div className="flex flex-wrap items-center gap-3">

                                                    <h3 className="text-lg font-semibold text-slate-900">
                                                        {
                                                            invitation.job_title
                                                        }
                                                    </h3>

                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                            invitation.status ===
                                                            "Pending"
                                                                ? "bg-yellow-50 text-yellow-700"
                                                                : invitation.status ===
                                                                  "Accepted"
                                                                ? "bg-green-50 text-green-700"
                                                                : "bg-red-50 text-red-700"
                                                        }`}
                                                    >
                                                        {
                                                            invitation.status
                                                        }
                                                    </span>
                                                </div>

                                                <p className="text-slate-600 mt-2">
                                                    Invited by{" "}
                                                    <span className="font-medium">
                                                        {
                                                            invitation.recruiter_name
                                                        }
                                                    </span>
                                                </p>

                                                <p className="text-sm text-slate-500 mt-1">
                                                    {new Date(
                                                        invitation.created_at
                                                    ).toLocaleDateString()}
                                                </p>

                                                {invitation.message && (
                                                    <div className="mt-4 bg-slate-50 rounded-lg p-4">

                                                        <p className="text-sm text-slate-600 leading-6">
                                                            {
                                                                invitation.message
                                                            }
                                                        </p>

                                                    </div>
                                                )}
                                            </div>

                                            {invitation.status ===
                                                "Pending" && (
                                                <div className="flex gap-3">

                                                    <button
                                                        type="button"
                                                        disabled={
                                                            statusUpdating ===
                                                            invitation.id
                                                        }
                                                        onClick={() =>
                                                            updateInvitationStatus(
                                                                invitation.id,
                                                                "Rejected"
                                                            )
                                                        }
                                                        className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 disabled:opacity-50"
                                                    >
                                                        Reject
                                                    </button>

                                                    <button
                                                        type="button"
                                                        disabled={
                                                            statusUpdating ===
                                                            invitation.id
                                                        }
                                                        onClick={() =>
                                                            updateInvitationStatus(
                                                                invitation.id,
                                                                "Accepted"
                                                            )
                                                        }
                                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
                                                    >
                                                        Accept
                                                    </button>

                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )
                            )}

                        </div>
                    )}
                </section>

                {/* My Applications */}
                <section className="mt-10">

                    <h2 className="text-2xl font-bold text-slate-900">
                        My Applications
                    </h2>

                    <p className="text-slate-500 mt-1 mb-5">
                        Track the jobs you have applied for.
                    </p>

                    {error && (
                        <div className="mb-5 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="bg-white border border-slate-200 rounded-xl p-8">
                            <p className="text-slate-500">
                                Loading applications...
                            </p>
                        </div>
                    ) : applications.length === 0 ? (
                        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">

                            <p className="text-slate-500">
                                You haven't applied to any
                                jobs yet.
                            </p>

                            <Link
                                to="/jobs"
                                className="inline-block mt-4 text-blue-600 font-medium hover:text-blue-700"
                            >
                                Find Jobs →
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">

                            {applications.map(
                                (application) => (
                                    <div
                                        key={
                                            application.id
                                        }
                                        className="bg-white border border-slate-200 rounded-xl p-6"
                                    >

                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

                                            <div>

                                                <h3 className="text-lg font-semibold text-slate-900">
                                                    {
                                                        application.job_title
                                                    }
                                                </h3>

                                                <p className="text-slate-600 mt-1">
                                                    {
                                                        application.company
                                                    }
                                                </p>

                                                <p className="text-sm text-slate-500 mt-2">
                                                    Applied on{" "}
                                                    {new Date(
                                                        application.applied_at
                                                    ).toLocaleDateString()}
                                                </p>

                                            </div>

                                            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                                                {
                                                    application.status
                                                }
                                            </span>

                                        </div>
                                    </div>
                                )
                            )}

                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

export default Dashboard;

