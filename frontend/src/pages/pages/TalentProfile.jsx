
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { apiFetch } from "../api";

function TalentProfile() {
    const { id } = useParams();

    const [candidate, setCandidate] = useState(null);
    const [jobs, setJobs] = useState([]);

    const [loading, setLoading] = useState(true);
    const [jobsLoading, setJobsLoading] = useState(false);

    const [error, setError] = useState("");
    const [inviteError, setInviteError] = useState("");
    const [success, setSuccess] = useState("");

    const [showInvite, setShowInvite] = useState(false);
    const [selectedJob, setSelectedJob] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchCandidate = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await apiFetch(
                    `/talent/${id}/`
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.detail ||
                        "Unable to load candidate."
                    );
                }

                setCandidate(data);
                console.log("TALENT API RESPONSE:", data);
            } catch (error) {
                console.error(
                    "Candidate fetch error:",
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
                        "Unable to load candidate."
                    );
                }
            } finally {
                setLoading(false);
            }
        };

        fetchCandidate();
    }, [id]);

    const fetchRecruiterJobs = async () => {
        try {
            setJobsLoading(true);
            setInviteError("");

            const response = await apiFetch(
                "/recruiter/jobs/"
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.detail ||
                    "Unable to load your jobs."
                );
            }

            setJobs(data);
        } catch (error) {
            console.error(
                "Recruiter jobs error:",
                error
            );

            if (
                error.message ===
                "SESSION_EXPIRED"
            ) {
                setInviteError(
                    "Your session has expired. Please login again."
                );
            } else {
                setInviteError(
                    error.message ||
                    "Unable to load your jobs."
                );
            }
        } finally {
            setJobsLoading(false);
        }
    };

    const openInviteModal = () => {
        setSuccess("");
        setInviteError("");
        setSelectedJob("");
        setMessage("");

        setShowInvite(true);

        fetchRecruiterJobs();
    };

    const closeInviteModal = () => {
        setShowInvite(false);
        setInviteError("");
    };

    const handleSendInvitation = async (event) => {
        event.preventDefault();

        if (!selectedJob) {
            setInviteError("Please select a job.");
            return;
        }

        try {
            setInviteError("");
            setSuccess("");

            const response = await apiFetch(
                "/invitations/",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        job: Number(selectedJob),
                        candidate: Number(id),
                        message,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.detail ||
                    "Unable to send invitation."
                );
            }

            setShowInvite(false);

            setSuccess(
                "Invitation sent successfully."
            );

            setSelectedJob("");
            setMessage("");
        } catch (error) {
            console.error(
                "Invitation error:",
                error
            );

            if (
                error.message ===
                "SESSION_EXPIRED"
            ) {
                setInviteError(
                    "Your session has expired. Please login again."
                );
            } else {
                setInviteError(
                    error.message ||
                    "Unable to send invitation."
                );
            }
        }
    };

    const contactCandidate = () => {
        if (!candidate?.email) {
            return;
        }

        const url =
            `https://mail.google.com/mail/?view=cm&fs=1` +
            `&to=${encodeURIComponent(
                candidate.email
            )}` +
            `&su=${encodeURIComponent(
                "Career Opportunity - CareerSync"
            )}` +
            `&body=${encodeURIComponent(
                `Hello ${candidate.full_name},

I came across your profile on CareerSync and would like to discuss a potential career opportunity with you.

Please let me know if you would be interested in connecting.

Best regards,
Recruiter`
            )}`;

        window.open(
            url,
            "_blank",
            "noopener,noreferrer"
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <p className="text-slate-500">
                    Loading candidate...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 px-6 py-10">
                <div className="max-w-5xl mx-auto">
                    <p className="text-red-600">
                        {error}
                    </p>

                    <Link
                        to="/recruiter/talent"
                        className="inline-block mt-4 text-blue-600 font-medium hover:text-blue-700"
                    >
                        ← Back to Talent
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 px-4 sm:px-6 py-8 sm:py-10">
            <div className="max-w-5xl mx-auto">

                {/* Back */}
                <Link
                    to="/recruiter/talent"
                    className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700"
                >
                    ← Back to Talent
                </Link>

                {/* Success */}
                {success && (
                    <div className="mt-5 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                        {success}
                    </div>
                )}

                {/* Profile Header */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8 mt-6">

                    <div className="flex flex-col lg:flex-row lg:items-center gap-6">

                        {/* Profile Photo */}
                        <div className="shrink-0">
                            {candidate?.profile_image ? (
                                <img
                                    src={
                                        candidate.profile_image
                                    }
                                    alt={
                                        candidate.full_name
                                    }
                                    className="w-28 h-28 rounded-full object-cover border-4 border-blue-50 shadow-sm"
                                />
                            ) : (
                                <div className="w-28 h-28 rounded-full bg-blue-100 flex items-center justify-center">
                                    <span className="text-4xl font-bold text-blue-700">
                                        {candidate?.full_name
                                            ?.charAt(0)
                                            ?.toUpperCase() ||
                                            "U"}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Basic Information */}
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-slate-900">
                                {candidate?.full_name}
                            </h1>

                            <p className="text-lg text-slate-600 mt-1">
                                {candidate?.headline ||
                                    "Software Developer"}
                            </p>

                            {candidate?.location && (
                                <p className="text-slate-500 mt-2">
                                    📍{" "}
                                    {candidate.location}
                                </p>
                            )}

                            {candidate?.hourly_rate && (
                                <p className="text-slate-700 font-medium mt-2">
                                    ₹{candidate.hourly_rate}
                                    <span className="text-slate-500 font-normal">
                                        {" "}
                                        / hour
                                    </span>
                                </p>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3">
                            {candidate?.email && (
                                <button
                                    type="button"
                                    onClick={
                                        contactCandidate
                                    }
                                    className="px-5 py-3 border border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
                                >
                                    Contact
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={
                                    openInviteModal
                                }
                                className="px-5 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                            >
                                Invite to Job
                            </button>
                        </div>
                    </div>
                </div>

                {/* About */}
                <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8 mt-6">
                    <h2 className="text-xl font-semibold text-slate-900">
                        About
                    </h2>

                    <p className="text-slate-600 leading-7 mt-3 whitespace-pre-line">
                        {candidate?.bio ||
                            "No biography added yet."}
                    </p>
                </section>

                {/* Skills */}
                <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8 mt-6">
                    <h2 className="text-xl font-semibold text-slate-900">
                        Skills
                    </h2>

                    {candidate?.skills &&
                    candidate.skills.length > 0 ? (
                        <div className="flex flex-wrap gap-3 mt-5">
                            {candidate.skills.map(
                                (skill, index) => (
                                    <span
                                        key={`${skill}-${index}`}
                                        className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-sm font-medium"
                                    >
                                        {skill}
                                    </span>
                                )
                            )}
                        </div>
                    ) : (
                        <p className="text-slate-500 mt-3">
                            No skills added yet.
                        </p>
                    )}
                </section>

               {/* Professional Links */}
<section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
  <h2 className="text-xl font-bold text-slate-900">
    Professional Links
  </h2>

  <p className="mt-1 text-sm text-slate-500">
    Explore this candidate's professional profiles and portfolio.
  </p>

  <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {candidate?.github_url && (
      <a
        href={candidate.github_url}
        target="_blank"
        rel="noopener noreferrer"
        className="group rounded-xl border border-slate-200 p-4 transition hover:-translate-y-1 hover:border-slate-400 hover:shadow-md"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white">
            Git
          </div>

          <div>
            <p className="font-semibold text-slate-900">
              GitHub
            </p>

            <p className="text-sm text-slate-500">
              View projects & code
            </p>
          </div>
        </div>
      </a>
    )}

    {candidate?.linkedin_url && (
      <a
        href={candidate.linkedin_url}
        target="_blank"
        rel="noopener noreferrer"
        className="group rounded-xl border border-slate-200 p-4 transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">
            in
          </div>

          <div>
            <p className="font-semibold text-slate-900">
              LinkedIn
            </p>

            <p className="text-sm text-slate-500">
              View professional profile
            </p>
          </div>
        </div>
      </a>
    )}

    {candidate?.portfolio_url && (
      <a
        href={candidate.portfolio_url}
        target="_blank"
        rel="noopener noreferrer"
        className="group rounded-xl border border-slate-200 p-4 transition hover:-translate-y-1 hover:border-purple-300 hover:shadow-md"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-600 text-sm font-bold text-white">
            ↗
          </div>

          <div>
            <p className="font-semibold text-slate-900">
              Portfolio
            </p>

            <p className="text-sm text-slate-500">
              View personal portfolio
            </p>
          </div>
        </div>
      </a>
    )}
  </div>

  {!candidate?.github_url &&
    !candidate?.linkedin_url &&
    !candidate?.portfolio_url && (
      <p className="mt-5 text-sm text-slate-500">
        No professional links added yet.
      </p>
    )}
</section>

{/* Resume */}
<section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h2 className="text-xl font-bold text-slate-900">
        Resume
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        View this candidate's latest resume.
      </p>
    </div>

    {candidate?.resume ? (
      <a
        href={candidate.resume}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        View Resume ↗
      </a>
    ) : (
      <span className="text-sm text-slate-500">
        No resume uploaded
      </span>
    )}
  </div>
</section>


                {/* Education */}
                <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8 mt-6">
                    <h2 className="text-xl font-semibold text-slate-900">
                        Education
                    </h2>

                    {candidate?.education?.length > 0 ? (
                        <div className="mt-5 space-y-5">
                            {candidate.education.map(
                                (education) => (
                                    <div
                                        key={education.id}
                                        className="border-l-4 border-blue-500 pl-5"
                                    >
                                        <h3 className="font-semibold text-lg text-slate-900">
                                            {
                                                education.degree
                                            }
                                        </h3>

                                        {education.field_of_study && (
                                            <p className="text-slate-600 mt-1">
                                                {
                                                    education.field_of_study
                                                }
                                            </p>
                                        )}

                                        <p className="text-slate-700 mt-1">
                                            {
                                                education.institution
                                            }
                                        </p>

                                        <p className="text-sm text-slate-500 mt-2">
                                            {
                                                education.start_year
                                            }
                                            {" - "}
                                            {education.end_year ||
                                                "Present"}
                                        </p>

                                        {education.description && (
                                            <p className="text-slate-600 mt-3 whitespace-pre-line">
                                                {
                                                    education.description
                                                }
                                            </p>
                                        )}
                                    </div>
                                )
                            )}
                        </div>
                    ) : (
                        <p className="text-slate-500 mt-3">
                            No education details added yet.
                        </p>
                    )}
                </section>

                {/* Experience */}
                <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8 mt-6">
                    <h2 className="text-xl font-semibold text-slate-900">
                        Experience
                    </h2>

                    {candidate?.experience?.length > 0 ? (
                        <div className="mt-5 space-y-6">
                            {candidate.experience.map(
                                (experience) => (
                                    <div
                                        key={experience.id}
                                        className="border-l-4 border-blue-500 pl-5"
                                    >
                                        <h3 className="font-semibold text-lg text-slate-900">
                                            {
                                                experience.job_title
                                            }
                                        </h3>

                                        <p className="text-slate-700 mt-1">
                                            {
                                                experience.company
                                            }
                                        </p>

                                        {experience.location && (
                                            <p className="text-slate-500 mt-1">
                                                📍{" "}
                                                {
                                                    experience.location
                                                }
                                            </p>
                                        )}

                                        <p className="text-sm text-slate-500 mt-2">
                                            {experience.start_date}
                                            {" - "}
                                            {experience.is_current
                                                ? "Present"
                                                : experience.end_date ||
                                                  "Not specified"}
                                        </p>

                                        {experience.description && (
                                            <p className="text-slate-600 mt-3 whitespace-pre-line">
                                                {
                                                    experience.description
                                                }
                                            </p>
                                        )}
                                    </div>
                                )
                            )}
                        </div>
                    ) : (
                        <p className="text-slate-500 mt-3">
                            No experience details added yet.
                        </p>
                    )}
                </section>

                
                {/* Contact */}
                {candidate?.email && (
                    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8 mt-6">
                        <h2 className="text-xl font-semibold text-slate-900">
                            Contact
                        </h2>

                        <p className="text-slate-600 mt-3">
                            {candidate.email}
                        </p>
                    </section>
                )}

                {/* Invitation Modal */}
                {showInvite && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50">
                        <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto">

                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-slate-900">
                                    Invite to Job
                                </h2>

                                <button
                                    type="button"
                                    onClick={
                                        closeInviteModal
                                    }
                                    className="text-slate-400 hover:text-slate-600 text-2xl"
                                >
                                    ×
                                </button>
                            </div>

                            <p className="text-slate-500 mt-2">
                                Invite{" "}
                                <span className="font-medium text-slate-700">
                                    {candidate?.full_name}
                                </span>{" "}
                                to one of your jobs.
                            </p>

                            {inviteError && (
                                <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                                    {inviteError}
                                </div>
                            )}

                            <form
                                onSubmit={
                                    handleSendInvitation
                                }
                                className="mt-6 space-y-5"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Select Job
                                    </label>

                                    <select
                                        value={
                                            selectedJob
                                        }
                                        onChange={(event) =>
                                            setSelectedJob(
                                                event.target
                                                    .value
                                            )
                                        }
                                        className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                        disabled={
                                            jobsLoading
                                        }
                                    >
                                        <option value="">
                                            {jobsLoading
                                                ? "Loading jobs..."
                                                : "Select a job"}
                                        </option>

                                        {jobs.map(
                                            (job) => (
                                                <option
                                                    key={
                                                        job.id
                                                    }
                                                    value={
                                                        job.id
                                                    }
                                                >
                                                    {
                                                        job.title
                                                    }{" "}
                                                    —{" "}
                                                    {
                                                        job.company
                                                    }
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Message
                                    </label>

                                    <textarea
                                        value={message}
                                        onChange={(event) =>
                                            setMessage(
                                                event.target
                                                    .value
                                            )
                                        }
                                        rows="5"
                                        placeholder="Write a message to the candidate..."
                                        className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={
                                            closeInviteModal
                                        }
                                        className="px-5 py-2.5 border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={
                                            jobsLoading ||
                                            !selectedJob
                                        }
                                        className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Send Invitation
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TalentProfile;

