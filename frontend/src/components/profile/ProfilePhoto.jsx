
import { useEffect, useState } from "react";
import { apiFetch } from "../../api";

function ProfilePhoto({ profile, onPhotoUpdated }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState("");
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (profile?.profile_image) {
            setPreview(profile.profile_image);
        }
    }, [profile]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {
            setError("Please select a valid image file.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError("Image size must be less than 5 MB.");
            return;
        }

        setError("");
        setMessage("");
        setSelectedFile(file);

        const imagePreview = URL.createObjectURL(file);
        setPreview(imagePreview);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setError("Please select an image first.");
            return;
        }

        try {
            setUploading(true);
            setError("");
            setMessage("");

            const formData = new FormData();

            formData.append(
                "profile_image",
                selectedFile
            );

            const response = await apiFetch(
                "/auth/profile/",
                {
                    method: "PATCH",
                    body: formData,
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.detail ||
                    "Unable to upload profile photo."
                );
            }

            setSelectedFile(null);
            setMessage(
                "Profile photo updated successfully."
            );

            if (onPhotoUpdated) {
                onPhotoUpdated(data);
            }
        } catch (error) {
            console.error(
                "Profile photo upload error:",
                error
            );

            if (error.message === "SESSION_EXPIRED") {
                setError(
                    "Your session has expired. Please login again."
                );
            } else {
                setError(
                    error.message ||
                    "Unable to upload profile photo."
                );
            }
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col items-center">

            <div className="relative">

                {preview ? (
                    <img
                        src={preview}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                    />
                ) : (
                    <div className="w-32 h-32 rounded-full bg-slate-200 border-4 border-white shadow-md flex items-center justify-center">
                        <span className="text-4xl text-slate-500">
                            👤
                        </span>
                    </div>
                )}

                <label
                    htmlFor="profile-photo"
                    className="absolute bottom-1 right-1 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center cursor-pointer hover:bg-blue-700 shadow-md"
                    title="Change profile photo"
                >
                    📷
                </label>

                <input
                    id="profile-photo"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                />

            </div>

            <h3 className="text-lg font-semibold text-slate-900 mt-4">
                Profile Photo
            </h3>

            <p className="text-sm text-slate-500 mt-1 text-center">
                JPG, PNG or WEBP · Maximum 5 MB
            </p>

            {selectedFile && (
                <button
                    type="button"
                    onClick={handleUpload}
                    disabled={uploading}
                    className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                    {uploading
                        ? "Uploading..."
                        : "Save Photo"}
                </button>
            )}

            {message && (
                <p className="text-sm text-green-600 mt-3">
                    {message}
                </p>
            )}

            {error && (
                <p className="text-sm text-red-600 mt-3 text-center">
                    {error}
                </p>
            )}

        </div>
    );
}

export default ProfilePhoto;

