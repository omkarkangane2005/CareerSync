from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.validators import FileExtensionValidator
from django.db import models
from django.db.models import Q


def validate_company_logo_size(file):
    """
    Limit company logo uploads to 2 MB.
    """

    max_size = 2 * 1024 * 1024

    if file.size > max_size:
        raise ValidationError(
            "Company logo must be smaller than 2 MB."
        )


class Job(models.Model):
    JOB_TYPES = [
        ("Full Time", "Full Time"),
        ("Part Time", "Part Time"),
        ("Internship", "Internship"),
    ]

    recruiter = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="posted_jobs",
        null=True,
        blank=True,
    )

    title = models.CharField(
        max_length=200
    )

    company = models.CharField(
        max_length=200
    )

    # Optional company logo
    company_logo = models.ImageField(
        upload_to="company_logos/",
        null=True,
        blank=True,
        validators=[
            FileExtensionValidator(
                allowed_extensions=[
                    "jpg",
                    "jpeg",
                    "png",
                    "webp",
                ]
            ),
            validate_company_logo_size,
        ],
    )

    location = models.CharField(
        max_length=200
    )

    job_type = models.CharField(
        max_length=50,
        choices=JOB_TYPES,
    )

    salary = models.CharField(
        max_length=100
    )

    experience = models.CharField(
        max_length=100
    )

    description = models.TextField()

    skills = models.JSONField(
        default=list
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return (
            f"{self.title} - "
            f"{self.company}"
        )


class Application(models.Model):
    STATUS_CHOICES = [
        ("Applied", "Applied"),
        ("Under Review", "Under Review"),
        ("Shortlisted", "Shortlisted"),
        ("On Hold", "On Hold"),
        ("Accepted", "Accepted"),
        ("Rejected", "Rejected"),
        ("Withdrawn", "Withdrawn"),
    ]

    job = models.ForeignKey(
        Job,
        on_delete=models.CASCADE,
        related_name="applications",
    )

    applicant = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="applications",
        null=True,
        blank=True,
    )

    full_name = models.CharField(
        max_length=200
    )

    email = models.EmailField()

    phone = models.CharField(
        max_length=20
    )

    cover_letter = models.TextField()

    status = models.CharField(
        max_length=50,
        choices=STATUS_CHOICES,
        default="Applied",
    )

    applied_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=[
                    "job",
                    "applicant",
                ],
                condition=~Q(
                    status="Withdrawn"
                ),
                name=(
                    "unique_active_"
                    "job_applicant"
                ),
            )
        ]

    def __str__(self):
        if self.applicant:
            return (
                f"{self.applicant.username} - "
                f"{self.job.title}"
            )

        return (
            f"{self.full_name} - "
            f"{self.job.title}"
        )


class JobInvitation(models.Model):
    STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Accepted", "Accepted"),
        ("Rejected", "Rejected"),
    ]

    job = models.ForeignKey(
        Job,
        on_delete=models.CASCADE,
        related_name="invitations",
    )

    recruiter = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="sent_invitations",
    )

    candidate = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="received_invitations",
    )

    message = models.TextField(
        blank=True
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="Pending",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=[
                    "job",
                    "candidate",
                ],
                name=(
                    "unique_job_"
                    "candidate_invitation"
                ),
            )
        ]

    def __str__(self):
        return (
            f"{self.recruiter.email} → "
            f"{self.candidate.email} "
            f"({self.job.title})"
        )