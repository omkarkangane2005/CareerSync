function ProfileCompletion({
    profile,
    educationCount = 0,
    experienceCount = 0,
}) {
    const checks = [
        {
            label: "Professional Headline",
            completed: Boolean(
                profile?.headline?.trim()
            ),
        },
        {
            label: "About Me",
            completed: Boolean(
                profile?.bio?.trim()
            ),
        },
        {
            label: "Location",
            completed: Boolean(
                profile?.location?.trim()
            ),
        },
        {
            label: "Skills",
            completed:
                Array.isArray(profile?.skills) &&
                profile.skills.length > 0,
        },
        {
            label: "Education",
            completed:
                educationCount > 0,
        },
        {
            label: "Experience",
            completed:
                experienceCount > 0,
        },
        {
            label: "Resume",
            completed:
                Boolean(profile?.resume),
        },
        {
            label: "GitHub",
            completed: Boolean(
                profile?.github_url?.trim()
            ),
        },
        {
            label: "LinkedIn",
            completed: Boolean(
                profile?.linkedin_url?.trim()
            ),
        },
    ];

    const completedCount =
        checks.filter(
            (item) => item.completed
        ).length;

    const completionPercentage =
        Math.round(
            (
                completedCount /
                checks.length
            ) * 100
        );

    const missingItems =
        checks.filter(
            (item) => !item.completed
        );

    return (
        <div
            className="
                rounded-2xl
                border
                border-gray-200
                bg-white
                p-6
                shadow-sm
            "
        >
            <div
                className="
                    mb-5
                    flex
                    flex-col
                    gap-4
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                "
            >
                <div>
                    <h2
                        className="
                            text-xl
                            font-bold
                            text-gray-900
                        "
                    >
                        Profile Readiness
                    </h2>

                    <p
                        className="
                            mt-1
                            text-sm
                            text-gray-500
                        "
                    >
                        Complete your profile to
                        improve your professional
                        presence.
                    </p>
                </div>

                <div
                    className="
                        text-3xl
                        font-bold
                        text-blue-600
                    "
                >
                    {completionPercentage}%
                </div>
            </div>


            {/* Progress Bar */}

            <div
                className="
                    mb-6
                    h-3
                    w-full
                    overflow-hidden
                    rounded-full
                    bg-gray-200
                "
            >
                <div
                    className="
                        h-full
                        rounded-full
                        bg-blue-600
                        transition-all
                        duration-500
                    "
                    style={{
                        width:
                            `${completionPercentage}%`,
                    }}
                />
            </div>


            {/* Status */}

            {completionPercentage ===
            100 ? (

                <div
                    className="
                        rounded-xl
                        border
                        border-green-200
                        bg-green-50
                        p-4
                    "
                >
                    <p
                        className="
                            font-semibold
                            text-green-700
                        "
                    >
                        Your profile is complete!
                    </p>

                    <p
                        className="
                            mt-1
                            text-sm
                            text-green-600
                        "
                    >
                        Your profile is ready to be
                        viewed by recruiters.
                    </p>
                </div>

            ) : (

                <div>
                    <h3
                        className="
                            mb-3
                            font-semibold
                            text-gray-800
                        "
                    >
                        Complete these sections:
                    </h3>

                    <div
                        className="
                            grid
                            grid-cols-1
                            gap-3
                            sm:grid-cols-2
                        "
                    >
                        {missingItems.map(
                            (item) => (

                            <div
                                key={
                                    item.label
                                }
                                className="
                                    flex
                                    items-center
                                    gap-3
                                    text-sm
                                    text-gray-600
                                "
                            >
                                <span
                                    className="
                                        flex
                                        h-6
                                        w-6
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-red-100
                                        text-red-500
                                    "
                                >
                                    !
                                </span>

                                <span>
                                    {item.label}
                                </span>
                            </div>

                            )
                        )}
                    </div>
                </div>

            )}
        </div>
    );
}

export default ProfileCompletion;