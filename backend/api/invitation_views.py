from django.contrib.auth import (
    get_user_model,
)

from django.db import (
    IntegrityError,
    transaction,
)

from rest_framework import (
    generics,
    status,
)

from rest_framework.permissions import (
    IsAuthenticated,
)

from rest_framework.response import Response

from .models import JobInvitation

from .permissions import IsRecruiter

from .serializers import (
    JobInvitationSerializer,
)


User = get_user_model()


# ==================================================
# SEND JOB INVITATION
# ==================================================

class SendJobInvitationView(
    generics.CreateAPIView
):
    serializer_class = (
        JobInvitationSerializer
    )

    permission_classes = [
        IsAuthenticated,
        IsRecruiter,
    ]

    def create(
        self,
        request,
        *args,
        **kwargs,
    ):
        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        job = serializer.validated_data[
            "job"
        ]

        candidate_id = (
            request.data.get(
                "candidate"
            )
        )

        message = (
            serializer.validated_data
            .get(
                "message",
                "",
            )
        )

        # ------------------------------------------
        # Recruiter can invite only to own job
        # ------------------------------------------

        if (
            job.recruiter_id
            != request.user.id
        ):
            return Response(
                {
                    "detail": (
                        "You can only invite "
                        "candidates to your own jobs."
                    )
                },
                status=(
                    status.HTTP_403_FORBIDDEN
                ),
            )

        # ------------------------------------------
        # Candidate required
        # ------------------------------------------

        if not candidate_id:
            return Response(
                {
                    "detail": (
                        "Candidate is required."
                    )
                },
                status=(
                    status.HTTP_400_BAD_REQUEST
                ),
            )

        # ------------------------------------------
        # Candidate must exist
        # and must be student
        # ------------------------------------------

        candidate = (
            User.objects
            .filter(
                id=candidate_id
            )
            .first()
        )

        if not candidate:
            return Response(
                {
                    "detail": (
                        "Candidate does not exist."
                    )
                },
                status=(
                    status.HTTP_400_BAD_REQUEST
                ),
            )

        if getattr(
            candidate,
            "role",
            None,
        ) != "student":
            return Response(
                {
                    "detail": (
                        "Only student accounts "
                        "can receive job invitations."
                    )
                },
                status=(
                    status.HTTP_400_BAD_REQUEST
                ),
            )

        # ------------------------------------------
        # Prevent duplicate invitation
        # ------------------------------------------

        already_invited = (
            JobInvitation.objects
            .filter(
                job=job,
                candidate=candidate,
            )
            .exists()
        )

        if already_invited:
            return Response(
                {
                    "detail": (
                        "This candidate has already "
                        "been invited to this job."
                    )
                },
                status=(
                    status.HTTP_400_BAD_REQUEST
                ),
            )

        # ------------------------------------------
        # Create invitation
        # ------------------------------------------

        try:
            with transaction.atomic():

                invitation = (
                    JobInvitation.objects
                    .create(
                        job=job,
                        recruiter=request.user,
                        candidate=candidate,
                        message=message,
                    )
                )

        except IntegrityError:
            return Response(
                {
                    "detail": (
                        "This candidate has already "
                        "been invited to this job."
                    )
                },
                status=(
                    status.HTTP_400_BAD_REQUEST
                ),
            )

        response_serializer = (
            self.get_serializer(
                invitation
            )
        )

        return Response(
            response_serializer.data,
            status=status.HTTP_201_CREATED,
        )


# ==================================================
# RECRUITER INVITATIONS
# ==================================================

class RecruiterInvitationListView(
    generics.ListAPIView
):
    serializer_class = (
        JobInvitationSerializer
    )

    permission_classes = [
        IsAuthenticated,
        IsRecruiter,
    ]

    def get_queryset(self):
        return (
            JobInvitation.objects
            .filter(
                recruiter=self.request.user
            )
            .select_related(
                "job",
                "recruiter",
                "candidate",
            )
            .order_by(
                "-created_at"
            )
        )


# ==================================================
# STUDENT RECEIVED INVITATIONS
# ==================================================

class CandidateInvitationListView(
    generics.ListAPIView
):
    serializer_class = (
        JobInvitationSerializer
    )

    permission_classes = [
        IsAuthenticated,
    ]

    def get_queryset(self):
        return (
            JobInvitation.objects
            .filter(
                candidate=self.request.user
            )
            .select_related(
                "job",
                "recruiter",
                "candidate",
            )
            .order_by(
                "-created_at"
            )
        )


# ==================================================
# ACCEPT / REJECT INVITATION
# ==================================================

class CandidateInvitationStatusView(
    generics.UpdateAPIView
):
    serializer_class = (
        JobInvitationSerializer
    )

    permission_classes = [
        IsAuthenticated,
    ]

    http_method_names = [
        "patch",
    ]

    def get_queryset(self):
        return (
            JobInvitation.objects
            .filter(
                candidate=self.request.user
            )
            .select_related(
                "job",
                "recruiter",
                "candidate",
            )
        )

    def update(
        self,
        request,
        *args,
        **kwargs,
    ):
        # Only student accounts should
        # respond to invitations.

        if getattr(
            request.user,
            "role",
            None,
        ) != "student":
            return Response(
                {
                    "detail": (
                        "Only students can respond "
                        "to job invitations."
                    )
                },
                status=(
                    status.HTTP_403_FORBIDDEN
                ),
            )

        invitation = self.get_object()

        # ------------------------------------------
        # Decision is final
        # ------------------------------------------

        if (
            invitation.status
            != "Pending"
        ):
            return Response(
                {
                    "detail": (
                        "This invitation has "
                        "already been responded to."
                    )
                },
                status=(
                    status.HTTP_400_BAD_REQUEST
                ),
            )

        new_status = (
            request.data.get(
                "status"
            )
        )

        allowed_statuses = [
            "Accepted",
            "Rejected",
        ]

        if (
            new_status
            not in allowed_statuses
        ):
            return Response(
                {
                    "detail": (
                        "Invalid invitation status."
                    )
                },
                status=(
                    status.HTTP_400_BAD_REQUEST
                ),
            )

        invitation.status = new_status

        invitation.save(
            update_fields=[
                "status"
            ]
        )

        serializer = (
            self.get_serializer(
                invitation
            )
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )