from django.urls import path

from .views import (
    JobListView,
    JobDetailView,
    RecruiterJobListView,
    RecruiterApplicationListView,
    ApplicationListView,
    ApplicationDetailView,
    ApplicationWithdrawView,
    RecruiterApplicationStatusUpdateView,
)

from .talent_views import (
    TalentListView,
    TalentDetailView,
)

from .invitation_views import (
    SendJobInvitationView,
    RecruiterInvitationListView,
    CandidateInvitationListView,
    CandidateInvitationStatusView,
)


urlpatterns = [
    # ==================================================
    # INVITATIONS
    # ==================================================

    path(
        "invitations/",
        SendJobInvitationView.as_view(),
        name="send-invitation",
    ),

    path(
        "recruiter/invitations/",
        RecruiterInvitationListView.as_view(),
        name="recruiter-invitations",
    ),

    path(
        "invitations/received/",
        CandidateInvitationListView.as_view(),
        name="received-invitations",
    ),

    path(
        "invitations/<int:pk>/status/",
        CandidateInvitationStatusView.as_view(),
        name="invitation-status",
    ),

    # ==================================================
    # TALENT
    # ==================================================

    path(
        "talent/<int:pk>/",
        TalentDetailView.as_view(),
        name="talent-detail",
    ),

    path(
        "talent/",
        TalentListView.as_view(),
        name="talent-list",
    ),

    # ==================================================
    # JOBS
    # ==================================================

    path(
        "jobs/",
        JobListView.as_view(),
        name="job-list",
    ),

    path(
        "jobs/<int:pk>/",
        JobDetailView.as_view(),
        name="job-detail",
    ),

    path(
        "recruiter/jobs/",
        RecruiterJobListView.as_view(),
        name="recruiter-job-list",
    ),

    # ==================================================
    # APPLICATIONS
    # ==================================================

    path(
        "applications/",
        ApplicationListView.as_view(),
        name="application-list",
    ),

    path(
        "applications/<int:pk>/",
        ApplicationDetailView.as_view(),
        name="application-detail",
    ),

    path(
        "applications/<int:pk>/withdraw/",
        ApplicationWithdrawView.as_view(),
        name="application-withdraw",
    ),

    # ==================================================
    # RECRUITER APPLICATIONS
    # ==================================================

    path(
        "recruiter/applications/",
        RecruiterApplicationListView.as_view(),
        name="recruiter-application-list",
    ),

    path(
        "recruiter/applications/<int:pk>/",
        RecruiterApplicationStatusUpdateView.as_view(),
        name="recruiter-application-status-update",
    ),
]