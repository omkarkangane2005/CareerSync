
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Education, Experience, StudentProfile
from .education_experience_serializers import (
    EducationSerializer,
    ExperienceSerializer,
)


class EducationListCreateView(generics.ListCreateAPIView):
    serializer_class = EducationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        profile, created = StudentProfile.objects.get_or_create(
            user=self.request.user
        )

        return Education.objects.filter(
            student=profile
        )

    def perform_create(self, serializer):
        profile, created = StudentProfile.objects.get_or_create(
            user=self.request.user
        )

        serializer.save(student=profile)


class EducationDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = EducationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        profile, created = StudentProfile.objects.get_or_create(
            user=self.request.user
        )

        return Education.objects.filter(
            student=profile
        )


class ExperienceListCreateView(generics.ListCreateAPIView):
    serializer_class = ExperienceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        profile, created = StudentProfile.objects.get_or_create(
            user=self.request.user
        )

        return Experience.objects.filter(
            student=profile
        )

    def perform_create(self, serializer):
        profile, created = StudentProfile.objects.get_or_create(
            user=self.request.user
        )

        serializer.save(student=profile)


class ExperienceDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ExperienceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        profile, created = StudentProfile.objects.get_or_create(
            user=self.request.user
        )

        return Experience.objects.filter(
            student=profile
        )

