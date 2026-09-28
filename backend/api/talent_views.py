
from django.db.models import Q
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from accounts.models import StudentProfile
from .permissions import IsRecruiter
from .talent_serializers import TalentProfileSerializer


class TalentDetailView(generics.RetrieveAPIView):
    serializer_class = TalentProfileSerializer

    permission_classes = [
        IsAuthenticated,
        IsRecruiter,
    ]

    queryset = (
        StudentProfile.objects
        .select_related("user")
        .all()
    )

class TalentListView(generics.ListAPIView):
    serializer_class = TalentProfileSerializer

    permission_classes = [
        IsAuthenticated,
        IsRecruiter,
    ]

    def get_queryset(self):
        queryset = (
            StudentProfile.objects
            .select_related("user")
            .all()
            .order_by("-id")
        )

        search = self.request.query_params.get(
            "search",
            ""
        ).strip()

        location = self.request.query_params.get(
            "location",
            ""
        ).strip()

        skill = self.request.query_params.get(
            "skill",
            ""
        ).strip()

        if search:
            queryset = queryset.filter(
                Q(user__full_name__icontains=search)
                | Q(headline__icontains=search)
                | Q(bio__icontains=search)
                | Q(location__icontains=search)
            )

        if location:
            queryset = queryset.filter(
                location__icontains=location
            )

        if skill:
            queryset = queryset.filter(
                skills__icontains=skill
            )

        return queryset

