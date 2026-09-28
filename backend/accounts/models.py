from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models


class UserManager(BaseUserManager):
    """Manager for creating users and superusers with email authentication."""

    def create_user(
        self,
        email: str,
        password: str | None = None,
        **extra_fields: object,
    ) -> "User":
        if not email:
            raise ValueError("Email address is required.")

        email = self.normalize_email(email)

        user = self.model(
            email=email,
            **extra_fields,
        )

        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(
        self,
        email: str,
        password: str | None = None,
        **extra_fields: object,
    ) -> "User":
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")

        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(
            email=email,
            password=password,
            **extra_fields,
        )


class User(AbstractBaseUser, PermissionsMixin):
    class Role(models.TextChoices):
        STUDENT = "student", "Student"
        RECRUITER = "recruiter", "Recruiter"

    email = models.EmailField(
        unique=True,
        db_index=True,
    )
    full_name = models.CharField(
        max_length=150,
    )
    role = models.CharField(
        max_length=20,
        choices=Role.choices,
    )

    is_active = models.BooleanField(
        default=True,
    )
    is_staff = models.BooleanField(
        default=False,
    )

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["full_name", "role"]

    def __str__(self) -> str:
        return f"{self.email} ({self.role})"


class StudentProfile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="student_profile",
    )
    headline = models.CharField(
        max_length=200,
        blank=True,
    )
    bio = models.TextField(
        blank=True,
    )
    location = models.CharField(
        max_length=100,
        blank=True,
    )
    hourly_rate = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
    )
    profile_image = models.ImageField(
        upload_to="profiles/students/",
        null=True,
        blank=True,
    )
    skills = models.JSONField(default=list, blank=True)

    def __str__(self) -> str:
        return f"Student Profile - {self.user.full_name}"
    
    resume = models.FileField(
    upload_to="resumes/",
    blank=True,
    null=True,
    )

    portfolio_url = models.URLField(
    blank=True,
    )

    github_url = models.URLField(
    blank=True,
    )

    linkedin_url = models.URLField(
    blank=True,
    )


class RecruiterProfile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="recruiter_profile",
    )
    company_name = models.CharField(
        max_length=200,
        blank=True,
    )
    company_description = models.TextField(
        blank=True,
    )
    company_website = models.URLField(
        blank=True,
    )

    def __str__(self) -> str:
        return f"Recruiter Profile - {self.user.full_name}"
    
    
    
class Education(models.Model):
    student = models.ForeignKey(
        StudentProfile,
        on_delete=models.CASCADE,
        related_name="education",
    )

    degree = models.CharField(
        max_length=150,
    )

    field_of_study = models.CharField(
        max_length=150,
        blank=True,
    )

    institution = models.CharField(
        max_length=200,
    )

    start_year = models.PositiveIntegerField()

    end_year = models.PositiveIntegerField(
        null=True,
        blank=True,
    )

    description = models.TextField(
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:
        ordering = ["-start_year", "-id"]

    def __str__(self):
        return f"{self.degree} - {self.institution}"


class Experience(models.Model):
    student = models.ForeignKey(
        StudentProfile,
        on_delete=models.CASCADE,
        related_name="experience",
    )

    job_title = models.CharField(
        max_length=150,
    )

    company = models.CharField(
        max_length=200,
    )

    location = models.CharField(
        max_length=150,
        blank=True,
    )

    start_date = models.DateField()

    end_date = models.DateField(
        null=True,
        blank=True,
    )

    is_current = models.BooleanField(
        default=False,
    )

    description = models.TextField(
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:
        ordering = ["-start_date", "-id"]

    def __str__(self):
        return f"{self.job_title} - {self.company}"

