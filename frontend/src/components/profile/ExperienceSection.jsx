
import { useEffect, useState } from "react";
import { apiFetch } from "../../api";

function ExperienceSection({ onCountChange }) {
    const [experience, setExperience] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [error, setError] = useState("");

    const [form, setForm] = useState({
        job_title: "",
        company: "",
        location: "",
        start_date: "",
        end_date: "",
        is_current: false,
        description: "",
    });

    const fetchExperience = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await apiFetch(
                "/auth/experience/"
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.detail ||
                        "Unable to load experience."
                );
            }

            const experienceData = Array.isArray(data)
                ? data
                : data.results || [];

            setExperience(experienceData);

            // Send current count to Profile.jsx
            if (onCountChange) {
                onCountChange(
                    experienceData.length
                );
            }
        } catch (error) {
            console.error(
                "Experience fetch error:",
                error
            );

            setError(
                error.message ||
                    "Unable to load experience."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExperience();
    }, []);

    const handleChange = (event) => {
        const { name, value, type, checked } =
            event.target;

        setForm((previousForm) => ({
            ...previousForm,
            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));
    };

    const resetForm = () => {
        setForm({
            job_title: "",
            company: "",
            location: "",
            start_date: "",
            end_date: "",
            is_current: false,
            description: "",
        });

        setEditingId(null);
        setShowForm(false);
    };

    const handleAddClick = () => {
        setForm({
            job_title: "",
            company: "",
            location: "",
            start_date: "",
            end_date: "",
            is_current: false,
            description: "",
        });

        setEditingId(null);
        setError("");
        setShowForm(true);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setSaving(true);
            setError("");

            const payload = {
                job_title: form.job_title,
                company: form.company,
                location: form.location,
                start_date: form.start_date,
                end_date: form.is_current
                    ? null
                    : form.end_date || null,
                is_current: form.is_current,
                description: form.description,
            };

            const endpoint = editingId
                ? `/auth/experience/${editingId}/`
                : "/auth/experience/";

            const method = editingId
                ? "PATCH"
                : "POST";

            const response = await apiFetch(
                endpoint,
                {
                    method,
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.detail ||
                        "Unable to save experience."
                );
            }

            await fetchExperience();

            resetForm();
        } catch (error) {
            console.error(
                "Experience save error:",
                error
            );

            setError(
                error.message ||
                    "Unable to save experience."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (item) => {
        setEditingId(item.id);

        setForm({
            job_title: item.job_title || "",
            company: item.company || "",
            location: item.location || "",
            start_date:
                item.start_date || "",
            end_date: item.end_date || "",
            is_current:
                item.is_current || false,
            description:
                item.description || "",
        });

        setError("");
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this experience record?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");

            const response = await apiFetch(
                `/auth/experience/${id}/`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
                const data =
                    await response.json();

                throw new Error(
                    data.detail ||
                        "Unable to delete experience."
                );
            }

            await fetchExperience();

            setShowForm(false);
            setEditingId(null);
        } catch (error) {
            console.error(
                "Experience delete error:",
                error
            );

            setError(
                error.message ||
                    "Unable to delete experience."
            );
        }
    };

    return (
        <div className="bg-white rounded-xl border shadow-sm p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">
                        Experience
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        Add your professional experience.
                    </p>
                </div>

                {!showForm && (
                    <button
                        type="button"
                        onClick={handleAddClick}
                        className="text-blue-600 font-medium text-sm hover:text-blue-700"
                    >
                        + Add Experience
                    </button>
                )}
            </div>

            {error && (
                <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                    {error}
                </div>
            )}

            {/* Form */}
            {showForm && (
                <form
                    onSubmit={handleSubmit}
                    className="mt-6 border border-gray-200 rounded-xl p-5 bg-gray-50 space-y-4"
                >
                    <h3 className="font-semibold text-gray-900">
                        {editingId
                            ? "Edit Experience"
                            : "Add Experience"}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            name="job_title"
                            value={form.job_title}
                            onChange={handleChange}
                            placeholder="Job Title"
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <input
                            type="text"
                            name="company"
                            value={form.company}
                            onChange={handleChange}
                            placeholder="Company"
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <input
                            type="text"
                            name="location"
                            value={form.location}
                            onChange={handleChange}
                            placeholder="Location"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Start Date
                            </label>

                            <input
                                type="date"
                                name="start_date"
                                value={
                                    form.start_date
                                }
                                onChange={
                                    handleChange
                                }
                                required
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                End Date
                            </label>

                            <input
                                type="date"
                                name="end_date"
                                value={
                                    form.end_date
                                }
                                onChange={
                                    handleChange
                                }
                                disabled={
                                    form.is_current
                                }
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white disabled:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <label className="flex items-center gap-3 text-sm text-gray-700">
                        <input
                            type="checkbox"
                            name="is_current"
                            checked={
                                form.is_current
                            }
                            onChange={
                                handleChange
                            }
                            className="w-4 h-4"
                        />

                        I currently work here
                    </label>

                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Describe your responsibilities, achievements and work..."
                        rows="4"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                        >
                            {saving
                                ? "Saving..."
                                : editingId
                                  ? "Update Experience"
                                  : "Save Experience"}
                        </button>

                        <button
                            type="button"
                            onClick={resetForm}
                            className="border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {/* Experience List */}
            <div className="mt-6">
                {loading ? (
                    <p className="text-gray-500">
                        Loading experience...
                    </p>
                ) : experience.length === 0 ? (
                    <div className="border border-dashed border-gray-300 rounded-xl p-8 text-center">
                        <p className="text-gray-500">
                            No experience added yet.
                        </p>

                        {!showForm && (
                            <button
                                type="button"
                                onClick={handleAddClick}
                                className="mt-3 text-blue-600 text-sm font-medium hover:text-blue-700"
                            >
                                + Add your experience
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {experience.map((item) => (
                            <div
                                key={item.id}
                                className="border border-gray-200 rounded-xl p-5"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {
                                                item.job_title
                                            }
                                        </h3>

                                        <p className="text-gray-600 mt-1">
                                            {
                                                item.company
                                            }
                                        </p>

                                        {item.location && (
                                            <p className="text-sm text-gray-500 mt-1">
                                                {
                                                    item.location
                                                }
                                            </p>
                                        )}

                                        <p className="text-sm text-gray-500 mt-2">
                                            {
                                                item.start_date
                                            }
                                            {" - "}
                                            {item.is_current
                                                ? "Present"
                                                : item.end_date ||
                                                  "Present"}
                                        </p>

                                        {item.description && (
                                            <p className="text-sm text-gray-600 mt-3 whitespace-pre-line">
                                                {
                                                    item.description
                                                }
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleEdit(
                                                    item
                                                )
                                            }
                                            className="text-blue-600 text-sm font-medium hover:text-blue-700"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDelete(
                                                    item.id
                                                )
                                            }
                                            className="text-red-600 text-sm font-medium hover:text-red-700"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ExperienceSection;

