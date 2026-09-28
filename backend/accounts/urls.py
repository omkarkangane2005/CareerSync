
from django.urls import path

from .views import LoginView, RegisterView
from .profile_views import StudentProfileView

from .education_experience_views import (
    EducationListCreateView,
    EducationDetailView,
    ExperienceListCreateView,
    ExperienceDetailView,
)


urlpatterns = [
    path(
        "register/",
        RegisterView.as_view(),
        name="register",
    ),

    path(
        "login/",
        LoginView.as_view(),
        name="login",
    ),

    path(
        "profile/",
        StudentProfileView.as_view(),
        name="student-profile",
    ),

    path(
        "education/",
        EducationListCreateView.as_view(),
        name="education-list-create",
    ),

    path(
        "education/<int:pk>/",
        EducationDetailView.as_view(),
        name="education-detail",
    ),

    path(
        "experience/",
        ExperienceListCreateView.as_view(),
        name="experience-list-create",
    ),

    path(
        "experience/<int:pk>/",
        ExperienceDetailView.as_view(),
        name="experience-detail",
    ),
]

