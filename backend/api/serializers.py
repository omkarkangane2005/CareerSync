from rest_framework import serializers

from .models import (
    Job,
    Application,
    JobInvitation,
)

from accounts.models import StudentProfile

from accounts.education_experience_serializers import (
    EducationSerializer,
    ExperienceSerializer,
)


# ==================================================
# JOB
# ==================================================

class JobSerializer(serializers.ModelSerializer):
    application_count = serializers.IntegerField(
        read_only=True,
    )

    company_logo = serializers.ImageField(
        required=False,
        allow_null=True,
    )

    class Meta:
        model = Job

        fields = [
            "id",
            "recruiter",
            "title",
            "company",
            "company_logo",
            "location",
            "job_type",
            "salary",
            "experience",
            "description",
            "skills",
            "created_at",
            "application_count",
        ]

        read_only_fields = [
            "id",
            "recruiter",
            "created_at",
            "application_count",
        ]

    def validate_title(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Job title is required."
            )

        return value

    def validate_company(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Company name is required."
            )

        return value

    def validate_location(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Location is required."
            )

        return value

    def validate_skills(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError(
                "Skills must be a list."
            )

        cleaned_skills = []

        for skill in value:
            if not isinstance(skill, str):
                continue

            skill = skill.strip()

            if (
                skill
                and skill not in cleaned_skills
            ):
                cleaned_skills.append(skill)

        if not cleaned_skills:
            raise serializers.ValidationError(
                "Add at least one required skill."
            )

        return cleaned_skills

    def validate(self, attrs):
        if self.instance:
            immutable_fields = [
                "title",
                "company",
                "location",
            ]

            errors = {}

            for field in immutable_fields:
                if field not in attrs:
                    continue

                current_value = getattr(
                    self.instance,
                    field,
                )

                if attrs[field] != current_value:
                    errors[field] = (
                        "This field cannot be "
                        "changed after the job "
                        "has been published."
                    )

            if errors:
                raise serializers.ValidationError(
                    errors
                )

        return attrs

    def to_representation(self, instance):
        data = super().to_representation(
            instance
        )

        if instance.company_logo:
            request = self.context.get(
                "request"
            )

            logo_url = (
                instance.company_logo.url
            )

            if request:
                logo_url = (
                    request.build_absolute_uri(
                        logo_url
                    )
                )

            data["company_logo"] = logo_url

        else:
            data["company_logo"] = None

        return data


# ==================================================
# APPLICATION
# ==================================================

class ApplicationSerializer(
    serializers.ModelSerializer
):
    job_title = serializers.CharField(
        source="job.title",
        read_only=True,
    )

    company = serializers.CharField(
        source="job.company",
        read_only=True,
    )

    applicant_profile_id = (
        serializers.SerializerMethodField()
    )

    class Meta:
        model = Application

        fields = [
            "id",
            "job",
            "job_title",
            "company",
            "applicant",
            "applicant_profile_id",
            "full_name",
            "email",
            "phone",
            "cover_letter",
            "status",
            "applied_at",
        ]

        read_only_fields = [
            "id",
            "applicant",
            "applicant_profile_id",
            "status",
            "applied_at",
            "job_title",
            "company",
        ]

    def get_applicant_profile_id(
        self,
        obj,
    ):
        if not obj.applicant:
            return None

        profile = (
            StudentProfile.objects
            .filter(
                user=obj.applicant
            )
            .first()
        )

        if not profile:
            return None

        return profile.id

    def validate_full_name(
        self,
        value,
    ):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Full name is required."
            )

        return value

    def validate_email(
        self,
        value,
    ):
        value = value.strip().lower()

        if not value:
            raise serializers.ValidationError(
                "Email is required."
            )

        return value

    def validate_phone(
        self,
        value,
    ):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Phone number is required."
            )

        cleaned_phone = (
            value
            .replace("+", "")
            .replace(" ", "")
            .replace("-", "")
            .replace("(", "")
            .replace(")", "")
        )

        if not cleaned_phone.isdigit():
            raise serializers.ValidationError(
                "Please enter a valid phone number."
            )

        if len(cleaned_phone) < 10:
            raise serializers.ValidationError(
                "Phone number must contain at least 10 digits."
            )

        return value

    def validate_cover_letter(
        self,
        value,
    ):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Cover letter is required."
            )

        return value

    def validate(self, data):
        request = self.context.get(
            "request"
        )

        if (
            not request
            or not request.user.is_authenticated
        ):
            raise serializers.ValidationError(
                {
                    "detail": (
                        "Authentication is required "
                        "to apply for a job."
                    )
                }
            )

        user = request.user
        job = data.get("job")

        if getattr(
            user,
            "role",
            None,
        ) != "student":
            raise serializers.ValidationError(
                {
                    "detail": (
                        "Only students can apply "
                        "for jobs."
                    )
                }
            )

        if not job:
            raise serializers.ValidationError(
                {
                    "job": (
                        "A job is required."
                    )
                }
            )

        already_applied = (
            Application.objects
            .filter(
                job=job,
                applicant=user,
            )
            .exclude(
                status="Withdrawn"
            )
            .exists()
        )

        if already_applied:
            raise serializers.ValidationError(
                {
                    "job": (
                        "You have already applied "
                        "for this job."
                    )
                }
            )

        return data


# ==================================================
# JOB INVITATION
# ==================================================

class JobInvitationSerializer(
    serializers.ModelSerializer
):
    job_title = serializers.CharField(
        source="job.title",
        read_only=True,
    )

    company = serializers.CharField(
        source="job.company",
        read_only=True,
    )

    company_logo = (
        serializers.SerializerMethodField()
    )

    recruiter_name = serializers.CharField(
        source="recruiter.full_name",
        read_only=True,
    )

    recruiter_email = (
        serializers.SerializerMethodField()
    )

    candidate_name = serializers.CharField(
        source="candidate.full_name",
        read_only=True,
    )

    class Meta:
        model = JobInvitation

        fields = [
            "id",

            "job",
            "job_title",
            "company",
            "company_logo",

            "recruiter",
            "recruiter_name",
            "recruiter_email",

            "candidate",
            "candidate_name",

            "message",
            "status",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "recruiter",
            "candidate",
            "status",
            "created_at",
        ]

    def get_recruiter_email(
        self,
        obj,
    ):
        """
        Candidate receives recruiter email
        only after accepting the invitation.

        Recruiter can always see their own
        email in their invitation response.
        """

        request = self.context.get(
            "request"
        )

        if (
            not request
            or not request.user.is_authenticated
        ):
            return None

        # Recruiter viewing their own invitation.
        if request.user == obj.recruiter:
            return obj.recruiter.email

        # Candidate gets contact only after accept.
        if (
            request.user == obj.candidate
            and obj.status == "Accepted"
        ):
            return obj.recruiter.email

        return None

    def get_company_logo(
        self,
        obj,
    ):
        if not obj.job.company_logo:
            return None

        request = self.context.get(
            "request"
        )

        url = obj.job.company_logo.url

        if request:
            return (
                request.build_absolute_uri(
                    url
                )
            )

        return url


# ==================================================
# TALENT PROFILE
# ==================================================

class TalentProfileSerializer(
    serializers.ModelSerializer
):
    full_name = serializers.CharField(
        source="user.full_name",
        read_only=True,
    )

    email = serializers.EmailField(
        source="user.email",
        read_only=True,
    )

    profile_image = (
        serializers.SerializerMethodField()
    )

    resume = (
        serializers.SerializerMethodField()
    )

    education = EducationSerializer(
        many=True,
        read_only=True,
    )

    experience = ExperienceSerializer(
        many=True,
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
            "education",
            "experience",
        ]

    def get_profile_image(
        self,
        obj,
    ):
        if not obj.profile_image:
            return None

        request = self.context.get(
            "request"
        )

        if request:
            return (
                request.build_absolute_uri(
                    obj.profile_image.url
                )
            )

        return obj.profile_image.url

    def get_resume(
        self,
        obj,
    ):
        if not obj.resume:
            return None

        request = self.context.get(
            "request"
        )

        if request:
            return (
                request.build_absolute_uri(
                    obj.resume.url
                )
            )

        return obj.resume.url