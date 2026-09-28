from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import RecruiterProfile, StudentProfile, User


@receiver(post_save, sender=User)
def create_role_profile(
    sender: type[User],
    instance: User,
    created: bool,
    **kwargs: object,
) -> None:
    if not created:
        return

    if instance.role == User.Role.STUDENT:
        StudentProfile.objects.create(user=instance)

    elif instance.role == User.Role.RECRUITER:
        RecruiterProfile.objects.create(user=instance)