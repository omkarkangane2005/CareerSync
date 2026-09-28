
import { useEffect, useState } from "react";
import { apiFetch } from "../../api";

function EducationSection({ onCountChange }) {
    const [education, setEducation] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [error, setError] = useState("");

    const [form, setForm] = useState({
        degree: "",
        field_of_study: "",
        institution: "",
        start_year: "",
        end_year: "",
        description: "",
    });

    const fetchEducation = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await apiFetch(
                "/auth/education/"
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.detail ||
                        "Unable to load education."
                );
            }

            const educationData = Array.isArray(data)
                ? data
                : data.results || [];

            setEducation(educationData);

            if (onCountChange) {
                onCountChange(educationData.length);
            }
        } catch (error) {
            console.error(
                "Education fetch error:",
                error
            );

            setError(
                error.message ||
                    "Unable to load education."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEducation();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previousForm) => ({
            ...previousForm,
            [name]: value,
        }));
    };

    const resetForm = () => {
        setForm({
            degree: "",
            field_of_study: "",
            institution: "",
            start_year: "",
            end_year: "",
            description: "",
        });

        setEditingId(null);
        setShowForm(false);
    };

    const handleAddClick = () => {
        setForm({
            degree: "",
            field_of_study: "",
            institution: "",
            start_year: "",
            end_year: "",
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
                degree: form.degree,
                field_of_study: form.field_of_study,
                institution: form.institution,
                start_year: Number(form.start_year),
                end_year: form.end_year
                    ? Number(form.end_year)
                    : null,
                description: form.description,
            };

            const endpoint = editingId
                ? `/auth/education/${editingId}/`
                : "/auth/education/";

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
                        "Unable to save education."
                );
            }

            await fetchEducation();

            resetForm();
        } catch (error) {
            console.error(
                "Education save error:",
                error
            );

            setError(
                error.message ||
                    "Unable to save education."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (item) => {
        setEditingId(item.id);

        setForm({
            degree: item.degree || "",
            field_of_study:
                item.field_of_study || "",
            institution:
                item.institution || "",
            start_year:
                item.start_year || "",
            end_year:
                item.end_year || "",
            description:
                item.description || "",
        });

        setError("");
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this education record?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");

            const response = await apiFetch(
                `/auth/education/${id}/`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
                const data =
                    await response.json();

                throw new Error(
                    data.detail ||
                        "Unable to delete education."
                );
            }

            await fetchEducation();

            setShowForm(false);
            setEditingId(null);
        } catch (error) {
            console.error(
                "Education delete error:",
                error
            );

            setError(
                error.message ||
                    "Unable to delete education."
            );
        }
    };

    return (
        <div className="bg-white rounded-xl border shadow-sm p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">
                        Education
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        Add your academic background.
                    </p>
                </div>

                {!showForm && (
                    <button
                        type="button"
                        onClick={handleAddClick}
                        className="text-blue-600 font-medium text-sm hover:text-blue-700"
                    >
                        + Add Education
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
                            ? "Edit Education"
                            : "Add Education"}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            name="degree"
                            value={form.degree}
                            onChange={handleChange}
                            placeholder="Degree"
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <input
                            type="text"
                            name="field_of_study"
                            value={
                                form.field_of_study
                            }
                            onChange={handleChange}
                            placeholder="Field of Study"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <input
                            type="text"
                            name="institution"
                            value={
                                form.institution
                            }
                            onChange={handleChange}
                            placeholder="Institution"
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <input
                            type="number"
                            name="start_year"
                            value={form.start_year}
                            onChange={handleChange}
                            placeholder="Start Year"
                            required
                            min="1900"
                            max="2100"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <input
                            type="number"
                            name="end_year"
                            value={form.end_year}
                            onChange={handleChange}
                            placeholder="End Year"
                            min="1900"
                            max="2100"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Describe your education..."
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
                                  ? "Update Education"
                                  : "Save Education"}
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

            {/* Education List */}
            <div className="mt-6">
                {loading ? (
                    <p className="text-gray-500">
                        Loading education...
                    </p>
                ) : education.length === 0 ? (
                    <div className="border border-dashed border-gray-300 rounded-xl p-8 text-center">
                        <p className="text-gray-500">
                            No education added yet.
                        </p>

                        {!showForm && (
                            <button
                                type="button"
                                onClick={handleAddClick}
                                className="mt-3 text-blue-600 text-sm font-medium hover:text-blue-700"
                            >
                                + Add your education
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {education.map((item) => (
                            <div
                                key={item.id}
                                className="border border-gray-200 rounded-xl p-5"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {item.degree}
                                        </h3>

                                        {item.field_of_study && (
                                            <p className="text-gray-600 mt-1">
                                                {
                                                    item.field_of_study
                                                }
                                            </p>
                                        )}

                                        <p className="text-gray-600 mt-1">
                                            {
                                                item.institution
                                            }
                                        </p>

                                        <p className="text-sm text-gray-500 mt-2">
                                            {
                                                item.start_year
                                            }
                                            {" - "}
                                            {item.end_year ||
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

export default EducationSection;

