from rest_framework import serializers

from accounts.models import StudentProfile


class TalentProfileSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(
        source="user.full_name",
        read_only=True
    )

    email = serializers.EmailField(
        source="user.email",
        read_only=True
    )

    education = serializers.SerializerMethodField()
    experience = serializers.SerializerMethodField()

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

            # Professional links
            "github_url",
            "linkedin_url",
            "portfolio_url",

            # Resume
            "resume",

            # Education & Experience
            "education",
            "experience",
        ]

    def get_education(self, obj):
        return [
            {
                "id": education.id,
                "degree": education.degree,
                "field_of_study": education.field_of_study,
                "institution": education.institution,
                "start_year": education.start_year,
                "end_year": education.end_year,
                "description": education.description,
                "created_at": education.created_at,
            }
            for education in obj.education.all()
        ]

    def get_experience(self, obj):
        return [
            {
                "id": experience.id,
                "job_title": experience.job_title,
                "company": experience.company,
                "location": experience.location,
                "start_date": experience.start_date,
                "end_date": experience.end_date,
                "is_current": experience.is_current,
                "description": experience.description,
                "created_at": experience.created_at,
            }
            for experience in obj.experience.all()
        ]