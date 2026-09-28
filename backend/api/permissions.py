
from rest_framework.permissions import BasePermission


class IsRecruiter(BasePermission):
    """
    Allows access only to authenticated users
    whose role is recruiter.
    """

    message = "Only recruiters can perform this action."

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == "recruiter"
        )

