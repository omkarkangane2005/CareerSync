
from rest_framework import serializers

from .models import Education, Experience


class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education

        fields = [
            "id",
            "degree",
            "field_of_study",
            "institution",
            "start_year",
            "end_year",
            "description",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
        ]


class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience

        fields = [
            "id",
            "job_title",
            "company",
            "location",
            "start_date",
            "end_date",
            "is_current",
            "description",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
        ]

