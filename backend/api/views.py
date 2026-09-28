from django.db import (
    IntegrityError,
    transaction,
)

from django.db.models import Count

from rest_framework import (
    generics,
    serializers,
    status,
)

from rest_framework.permissions import (
    AllowAny,
    IsAuthenticated,
)

from rest_framework.response import Response

from .models import (
    Job,
    Application,
)

from .serializers import (
    JobSerializer,
    ApplicationSerializer,
)

from .permissions import IsRecruiter


# ==================================================
# JOB LIST + CREATE
# ==================================================

class JobListView(
    generics.ListCreateAPIView
):
    serializer_class = JobSerializer

    def get_queryset(self):
        return (
            Job.objects
            .annotate(
                application_count=Count(
                    "applications"
                )
            )
            .select_related(
                "recruiter"
            )
            .order_by(
                "-created_at"
            )
        )

    def get_permissions(self):
        if self.request.method == "POST":
            return [
                IsAuthenticated(),
                IsRecruiter(),
            ]

        return [
            AllowAny()
        ]

    def perform_create(
        self,
        serializer,
    ):
        """
        Never trust the frontend to supply
        recruiter ownership.

        Ownership comes from request.user.
        """

        serializer.save(
            recruiter=self.request.user
        )


# ==================================================
# JOB DETAIL
# ==================================================

class JobDetailView(
    generics.RetrieveUpdateDestroyAPIView
):
    serializer_class = JobSerializer

    def get_queryset(self):
        queryset = (
            Job.objects
            .annotate(
                application_count=Count(
                    "applications"
                )
            )
            .select_related(
                "recruiter"
            )
        )

        if self.request.method in [
            "PUT",
            "PATCH",
            "DELETE",
        ]:
            return queryset.filter(
                recruiter=self.request.user
            )

        return queryset

    def get_permissions(self):
        if self.request.method in [
            "PUT",
            "PATCH",
            "DELETE",
        ]:
            return [
                IsAuthenticated(),
                IsRecruiter(),
            ]

        return [
            AllowAny()
        ]


# ==================================================
# RECRUITER JOBS
# ==================================================

class RecruiterJobListView(
    generics.ListAPIView
):
    serializer_class = JobSerializer

    permission_classes = [
        IsAuthenticated,
        IsRecruiter,
    ]

    def get_queryset(self):
        return (
            Job.objects
            .filter(
                recruiter=self.request.user
            )
            .annotate(
                application_count=Count(
                    "applications"
                )
            )
            .order_by(
                "-created_at"
            )
        )


# ==================================================
# RECRUITER APPLICATIONS
# ==================================================

class RecruiterApplicationListView(
    generics.ListAPIView
):
    serializer_class = (
        ApplicationSerializer
    )

    permission_classes = [
        IsAuthenticated,
        IsRecruiter,
    ]

    def get_queryset(self):
        return (
            Application.objects
            .filter(
                job__recruiter=(
                    self.request.user
                )
            )
            .select_related(
                "job",
                "applicant",
            )
            .order_by(
                "-applied_at"
            )
        )


# ==================================================
# RECRUITER APPLICATION STATUS
# ==================================================

class RecruiterApplicationStatusUpdateView(
    generics.UpdateAPIView
):
    serializer_class = (
        ApplicationSerializer
    )

    permission_classes = [
        IsAuthenticated,
        IsRecruiter,
    ]

    http_method_names = [
        "patch",
    ]

    def get_queryset(self):
        return (
            Application.objects
            .filter(
                job__recruiter=(
                    self.request.user
                )
            )
        )

    def update(
        self,
        request,
        *args,
        **kwargs,
    ):
        application = self.get_object()

        new_status = request.data.get(
            "status"
        )

        allowed_statuses = [
            choice[0]
            for choice
            in Application.STATUS_CHOICES
            if choice[0] != "Withdrawn"
        ]

        if (
            new_status
            not in allowed_statuses
        ):
            return Response(
                {
                    "detail": (
                        "Invalid application "
                        "status."
                    ),
                    "allowed_statuses": (
                        allowed_statuses
                    ),
                },
                status=(
                    status
                    .HTTP_400_BAD_REQUEST
                ),
            )

        if (
            application.status
            == "Withdrawn"
        ):
            return Response(
                {
                    "detail": (
                        "A withdrawn application "
                        "cannot be changed."
                    )
                },
                status=(
                    status
                    .HTTP_400_BAD_REQUEST
                ),
            )

        application.status = new_status

        application.save(
            update_fields=[
                "status"
            ]
        )

        serializer = (
            self.get_serializer(
                application
            )
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )


# ==================================================
# STUDENT APPLICATIONS
# ==================================================

class ApplicationListView(
    generics.ListCreateAPIView
):
    serializer_class = (
        ApplicationSerializer
    )

    permission_classes = [
        IsAuthenticated,
    ]

    def get_queryset(self):
        return (
            Application.objects
            .filter(
                applicant=self.request.user
            )
            .select_related(
                "job"
            )
            .order_by(
                "-applied_at"
            )
        )

    def create(
        self,
        request,
        *args,
        **kwargs,
    ):
        if getattr(
            request.user,
            "role",
            None,
        ) != "student":
            return Response(
                {
                    "detail": (
                        "Only students can apply "
                        "for jobs."
                    )
                },
                status=(
                    status.HTTP_403_FORBIDDEN
                ),
            )

        return super().create(
            request,
            *args,
            **kwargs,
        )

    def perform_create(
        self,
        serializer,
    ):
        try:
            with transaction.atomic():
                serializer.save(
                    applicant=(
                        self.request.user
                    )
                )

        except IntegrityError:
            raise serializers.ValidationError(
                {
                    "job": (
                        "You have already applied "
                        "for this job."
                    )
                }
            )


# ==================================================
# STUDENT APPLICATION DETAIL
# ==================================================

class ApplicationDetailView(
    generics.RetrieveUpdateDestroyAPIView
):
    serializer_class = (
        ApplicationSerializer
    )

    permission_classes = [
        IsAuthenticated,
    ]

    def get_queryset(self):
        return (
            Application.objects
            .filter(
                applicant=self.request.user
            )
        )

    def update(
        self,
        request,
        *args,
        **kwargs,
    ):
        return Response(
            {
                "detail": (
                    "Applications cannot be "
                    "edited. Use the withdraw "
                    "action instead."
                )
            },
            status=(
                status
                .HTTP_405_METHOD_NOT_ALLOWED
            ),
        )

    def destroy(
        self,
        request,
        *args,
        **kwargs,
    ):
        return Response(
            {
                "detail": (
                    "Applications cannot be "
                    "deleted. Use the withdraw "
                    "action instead."
                )
            },
            status=(
                status
                .HTTP_405_METHOD_NOT_ALLOWED
            ),
        )


# ==================================================
# STUDENT WITHDRAW
# ==================================================

class ApplicationWithdrawView(
    generics.UpdateAPIView
):
    serializer_class = (
        ApplicationSerializer
    )

    permission_classes = [
        IsAuthenticated,
    ]

    http_method_names = [
        "patch",
    ]

    def get_queryset(self):
        return (
            Application.objects
            .filter(
                applicant=self.request.user
            )
        )

    def update(
        self,
        request,
        *args,
        **kwargs,
    ):
        application = self.get_object()

        if application.status in [
            "Accepted",
            "Rejected",
            "Withdrawn",
        ]:
            return Response(
                {
                    "detail": (
                        "This application "
                        "cannot be withdrawn."
                    )
                },
                status=(
                    status
                    .HTTP_400_BAD_REQUEST
                ),
            )

        application.status = "Withdrawn"

        application.save(
            update_fields=[
                "status"
            ]
        )

        serializer = (
            self.get_serializer(
                application
            )
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )