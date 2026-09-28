
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api";

import EducationSection from "../components/profile/EducationSection";
import ExperienceSection from "../components/profile/ExperienceSection";
import ProfileCompletion from "../components/profile/ProfileCompletion";
import ProfilePhoto from "../components/profile/ProfilePhoto";

const API_BASE_URL = "http://127.0.0.1:8000";

function Profile() {
    const [profile, setProfile] = useState(null);

    const [skillsInput, setSkillsInput] = useState("");
    const [bioInput, setBioInput] = useState("");
    const [editingBio, setEditingBio] = useState(false);

    const [educationCount, setEducationCount] = useState(0);
    const [experienceCount, setExperienceCount] = useState(0);

    const [professionalLinks, setProfessionalLinks] = useState({
        github_url: "",
        linkedin_url: "",
        portfolio_url: "",
    });

    const [resumeFile, setResumeFile] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingResume, setUploadingResume] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // Fetch profile
    const fetchProfile = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await apiFetch(
                "/auth/profile/"
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.detail ||
                        "Unable to load profile."
                );
            }

            setProfile(data);

            setBioInput(data.bio || "");

            setSkillsInput(
                (data.skills || []).join(", ")
            );

            setProfessionalLinks({
                github_url: data.github_url || "",
                linkedin_url: data.linkedin_url || "",
                portfolio_url: data.portfolio_url || "",
            });
        } catch (error) {
            console.error(
                "Profile fetch error:",
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
                        "Unable to load profile."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    // Fetch education and experience counts
    const fetchProfileCounts = async () => {
        try {
            const [
                educationResponse,
                experienceResponse,
            ] = await Promise.all([
                apiFetch("/auth/education/"),
                apiFetch("/auth/experience/"),
            ]);

            if (educationResponse.ok) {
                const educationData =
                    await educationResponse.json();

                setEducationCount(
                    Array.isArray(educationData)
                        ? educationData.length
                        : educationData.results?.length ||
                              0
                );
            }

            if (experienceResponse.ok) {
                const experienceData =
                    await experienceResponse.json();

                setExperienceCount(
                    Array.isArray(experienceData)
                        ? experienceData.length
                        : experienceData.results?.length ||
                              0
                );
            }
        } catch (error) {
            console.error(
                "Profile count fetch error:",
                error
            );
        }
    };

    useEffect(() => {
        fetchProfile();
        fetchProfileCounts();
    }, []);

    // Save About Me
    const handleSaveBio = async () => {
        try {
            setSaving(true);
            setMessage("");
            setError("");

            const response = await apiFetch(
                "/auth/profile/",
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        bio: bioInput,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.detail ||
                        "Unable to save About Me."
                );
            }

            setProfile(data);
            setBioInput(data.bio || "");
            setEditingBio(false);

            setMessage(
                "About Me updated successfully."
            );
        } catch (error) {
            console.error(
                "Bio update error:",
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
                        "Unable to save About Me."
                );
            }
        } finally {
            setSaving(false);
        }
    };

    // Save skills
    const handleSaveSkills = async () => {
        try {
            setSaving(true);
            setMessage("");
            setError("");

            const skills = skillsInput
                .split(",")
                .map((skill) => skill.trim())
                .filter(
                    (skill) => skill.length > 0
                );

            const uniqueSkills = [
                ...new Set(skills),
            ];

            const response = await apiFetch(
                "/auth/profile/",
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        skills: uniqueSkills,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.detail ||
                        "Unable to save skills."
                );
            }

            setProfile(data);

            setSkillsInput(
                (data.skills || []).join(", ")
            );

            setMessage(
                "Skills updated successfully."
            );
        } catch (error) {
            console.error(
                "Skills update error:",
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
                        "Unable to save skills."
                );
            }
        } finally {
            setSaving(false);
        }
    };

    // Professional link input change
    const handleProfessionalLinkChange = (
        event
    ) => {
        const { name, value } = event.target;

        setProfessionalLinks(
            (previousLinks) => ({
                ...previousLinks,
                [name]: value,
            })
        );
    };

    // Save professional links
    const handleSaveProfessionalLinks =
        async () => {
            try {
                setSaving(true);
                setMessage("");
                setError("");

                const response = await apiFetch(
                    "/auth/profile/",
                    {
                        method: "PATCH",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify(
                            professionalLinks
                        ),
                    }
                );

                const data =
                    await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.detail ||
                            "Unable to save professional links."
                    );
                }

                setProfile(data);

                setProfessionalLinks({
                    github_url:
                        data.github_url || "",
                    linkedin_url:
                        data.linkedin_url || "",
                    portfolio_url:
                        data.portfolio_url || "",
                });

                setMessage(
                    "Professional links updated successfully."
                );
            } catch (error) {
                console.error(
                    "Professional links update error:",
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
                            "Unable to save professional links."
                    );
                }
            } finally {
                setSaving(false);
            }
        };

    // Resume upload
    const handleResumeUpload = async () => {
        if (!resumeFile) {
            setError(
                "Please select a resume file first."
            );
            return;
        }

        try {
            setUploadingResume(true);
            setMessage("");
            setError("");

            const formData = new FormData();

            formData.append(
                "resume",
                resumeFile
            );

            const response = await apiFetch(
                "/auth/profile/",
                {
                    method: "PATCH",
                    body: formData,
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.detail ||
                        "Unable to upload resume."
                );
            }

            setProfile(data);
            setResumeFile(null);

            setMessage(
                "Resume uploaded successfully."
            );
        } catch (error) {
            console.error(
                "Resume upload error:",
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
                        "Unable to upload resume."
                );
            }
        } finally {
            setUploadingResume(false);
        }
    };

    // Resume URL
    const getResumeUrl = () => {
        if (!profile?.resume) {
            return null;
        }

        if (
            profile.resume.startsWith("http")
        ) {
            return profile.resume;
        }

        return `${API_BASE_URL}${profile.resume}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-500">
                    Loading profile...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Header */}
            <section className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-6 py-8">

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                        <div>
                            <p className="text-blue-600 font-medium mb-1">
                                CareerSync Profile
                            </p>

                            <h1 className="text-3xl font-bold text-gray-900">
                                My Profile
                            </h1>

                            <p className="text-gray-600 mt-2">
                                Manage your professional information and skills.
                            </p>
                        </div>

                        <Link
                            to="/dashboard"
                            className="text-blue-600 font-medium hover:text-blue-700"
                        >
                            ← Back to Dashboard
                        </Link>

                    </div>

                </div>
            </section>

            {/* Profile Content */}
            <section className="max-w-7xl mx-auto px-6 py-10">

                {error && (
                    <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700">
                        {message}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Profile Card */}
                    <div className="bg-white rounded-xl border shadow-sm p-6 h-fit">

                        {/* Profile Photo */}
                        <ProfilePhoto
                            profile={profile}
                            onPhotoUpdated={setProfile}
                        />

                        {/* Profile Information */}
                        <div className="flex flex-col items-center text-center mt-5">

                            <h2 className="text-xl font-bold text-gray-900">
                                {profile?.full_name ||
                                    "User"}
                            </h2>

                            <p className="text-gray-500 mt-1">
                                {profile?.headline ||
                                    "Software Developer"}
                            </p>

                            <p className="text-sm text-gray-400 mt-2">
                                {profile?.location ||
                                    "Location not added"}
                            </p>

                        </div>

                        {/* Dynamic Profile Completion */}
                        <div className="mt-8">
                            <ProfileCompletion
                                profile={profile}
                                educationCount={
                                    educationCount
                                }
                                experienceCount={
                                    experienceCount
                                }
                            />
                        </div>

                    </div>

                    {/* Right Content */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* About Me */}
                        <div className="bg-white rounded-xl border shadow-sm p-6">

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">
                                        About Me
                                    </h2>

                                    <p className="text-sm text-gray-500 mt-1">
                                        Tell recruiters about your background,
                                        strengths and career goals.
                                    </p>
                                </div>

                                {!editingBio && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setBioInput(
                                                profile?.bio ||
                                                    ""
                                            );
                                            setEditingBio(
                                                true
                                            );
                                            setMessage("");
                                            setError("");
                                        }}
                                        className="text-blue-600 text-sm font-medium hover:text-blue-700"
                                    >
                                        Edit
                                    </button>
                                )}

                            </div>

                            {editingBio ? (
                                <div className="mt-5">

                                    <textarea
                                        value={bioInput}
                                        onChange={(event) =>
                                            setBioInput(
                                                event.target
                                                    .value
                                            )
                                        }
                                        rows="6"
                                        maxLength="1000"
                                        placeholder="Example: I am an Electronics & Telecommunication Engineering student transitioning into software development..."
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                                    />

                                    <div className="flex justify-between items-center mt-2">
                                        <p className="text-xs text-gray-400">
                                            {
                                                bioInput.length
                                            }
                                            /1000
                                        </p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3 mt-4">

                                        <button
                                            type="button"
                                            onClick={
                                                handleSaveBio
                                            }
                                            disabled={
                                                saving
                                            }
                                            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                                        >
                                            {saving
                                                ? "Saving..."
                                                : "Save About Me"}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setBioInput(
                                                    profile?.bio ||
                                                        ""
                                                );
                                                setEditingBio(
                                                    false
                                                );
                                            }}
                                            className="border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-100"
                                        >
                                            Cancel
                                        </button>

                                    </div>
                                </div>
                            ) : (
                                <div className="mt-5">

                                    {profile?.bio ? (
                                        <p className="text-gray-600 leading-7 whitespace-pre-line">
                                            {
                                                profile.bio
                                            }
                                        </p>
                                    ) : (
                                        <div className="border border-dashed rounded-lg p-6 text-center">

                                            <p className="text-gray-500">
                                                Your professional bio has not
                                                been added yet.
                                            </p>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setBioInput(
                                                        ""
                                                    );
                                                    setEditingBio(
                                                        true
                                                    );
                                                }}
                                                className="mt-3 text-blue-600 text-sm font-medium hover:text-blue-700"
                                            >
                                                + Add About Me
                                            </button>

                                        </div>
                                    )}

                                </div>
                            )}

                        </div>

                        {/* Skills */}
                        <div className="bg-white rounded-xl border shadow-sm p-6">

                            <div className="flex items-center justify-between">

                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">
                                        Skills
                                    </h2>

                                    <p className="text-sm text-gray-500 mt-1">
                                        Add skills separated by commas.
                                    </p>
                                </div>

                                <button
                                    onClick={
                                        handleSaveSkills
                                    }
                                    disabled={
                                        saving
                                    }
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition"
                                >
                                    {saving
                                        ? "Saving..."
                                        : "Save Skills"}
                                </button>

                            </div>

                            <input
                                type="text"
                                value={skillsInput}
                                onChange={(event) =>
                                    setSkillsInput(
                                        event.target
                                            .value
                                    )
                                }
                                placeholder="Java, React, Python, Django, SQL"
                                className="w-full mt-5 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            <div className="flex flex-wrap gap-3 mt-5">

                                {profile?.skills?.length > 0 ? (
                                    profile.skills.map(
                                        (skill) => (
                                            <span
                                                key={skill}
                                                className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium"
                                            >
                                                {skill}
                                            </span>
                                        )
                                    )
                                ) : (
                                    <p className="text-sm text-gray-400">
                                        No skills added yet.
                                    </p>
                                )}

                            </div>

                        </div>

                        {/* Professional Links */}
                        <div className="bg-white rounded-xl border shadow-sm p-6">

                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">
                                        Professional Links
                                    </h2>

                                    <p className="text-sm text-gray-500 mt-1">
                                        Add links recruiters can use to learn more about you.
                                    </p>
                                </div>

                                <button
                                    onClick={
                                        handleSaveProfessionalLinks
                                    }
                                    disabled={
                                        saving
                                    }
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition"
                                >
                                    {saving
                                        ? "Saving..."
                                        : "Save Links"}
                                </button>

                            </div>

                            <div className="space-y-4 mt-5">

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        GitHub
                                    </label>

                                    <input
                                        type="url"
                                        name="github_url"
                                        value={
                                            professionalLinks.github_url
                                        }
                                        onChange={
                                            handleProfessionalLinkChange
                                        }
                                        placeholder="https://github.com/username"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        LinkedIn
                                    </label>

                                    <input
                                        type="url"
                                        name="linkedin_url"
                                        value={
                                            professionalLinks.linkedin_url
                                        }
                                        onChange={
                                            handleProfessionalLinkChange
                                        }
                                        placeholder="https://linkedin.com/in/username"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Portfolio
                                    </label>

                                    <input
                                        type="url"
                                        name="portfolio_url"
                                        value={
                                            professionalLinks.portfolio_url
                                        }
                                        onChange={
                                            handleProfessionalLinkChange
                                        }
                                        placeholder="https://yourportfolio.com"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                            </div>
                        </div>

                        {/* Education */}
                        <EducationSection
                            onCountChange={
                                setEducationCount
                            }
                        />

                        {/* Experience */}
                        <ExperienceSection
                            onCountChange={
                                setExperienceCount
                            }
                        />

                        {/* Resume */}
                        <div className="bg-white rounded-xl border shadow-sm p-6">

                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">
                                        Resume
                                    </h2>

                                    <p className="text-gray-500 text-sm mt-1">
                                        Upload your latest resume.
                                    </p>
                                </div>

                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={(event) =>
                                        setResumeFile(
                                            event
                                                .target
                                                .files?.[0] ||
                                                null
                                        )
                                    }
                                    className="text-sm"
                                />

                            </div>

                            <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                                <div>
                                    {profile?.resume ? (
                                        <>
                                            <p className="font-medium text-gray-900">
                                                Resume uploaded
                                            </p>

                                            <a
                                                href={getResumeUrl()}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-blue-600 text-sm font-medium hover:text-blue-700"
                                            >
                                                View Resume
                                            </a>
                                        </>
                                    ) : (
                                        <p className="text-sm text-gray-400">
                                            No resume uploaded yet.
                                        </p>
                                    )}
                                </div>

                                <button
                                    onClick={
                                        handleResumeUpload
                                    }
                                    disabled={
                                        uploadingResume ||
                                        !resumeFile
                                    }
                                    className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition"
                                >
                                    {uploadingResume
                                        ? "Uploading..."
                                        : "Upload Resume"}
                                </button>

                            </div>

                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
}

export default Profile;

