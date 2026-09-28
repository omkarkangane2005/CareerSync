
from rest_framework import serializers

from .models import StudentProfile


class StudentProfileSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(
        source="user.full_name",
        read_only=True,
    )

    email = serializers.EmailField(
        source="user.email",
        read_only=True,
    )

    class Meta:
        model = StudentProfile

        fields = [
            "id",
            "full_name",
            "email",
            "headline",
            "bio",
            "location",
            "hourly_rate",
            "skills",
            "profile_image",
            "resume",
            "github_url",
            "linkedin_url",
            "portfolio_url",
        ]

        read_only_fields = [
            "id",
            "full_name",
            "email",
        ]

