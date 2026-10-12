from datetime import date
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.accounts.models import UserProfile

User = get_user_model()


class Command(BaseCommand):
    help = "Initialise ou met à jour le compte utilisateur initial Farhane"

    def handle(self, *args, **options):
        email = "farhane@mail.com"
        username = "Farhane"
        password = "Bl4ckM4f!4667#"
        no_contact_date = date(2026, 10, 10)
        journey_date = date(2026, 10, 10)

        user = User.objects.filter(email=email).first()
        if not user:
            user = User.objects.create_user(
                email=email,
                username=username,
                password=password
            )
            self.stdout.write(self.style.SUCCESS(f"Utilisateur {email} créé."))
        else:
            user.username = username
            user.set_password(password)
            user.save()
            self.stdout.write(self.style.SUCCESS(f"Utilisateur {email} mis à jour."))

        # Mise à jour ou création du profil
        profile, created = UserProfile.objects.get_or_create(user=user)
        profile.no_contact_start_date = no_contact_date
        profile.journey_start_date = journey_date
        profile.timezone = "Africa/Porto-Novo"
        profile.save()

        self.stdout.write(self.style.SUCCESS(
            f"Profil configuré avec succès : No-Contact = {profile.no_contact_start_date}, Début parcours = {profile.journey_start_date}"
        ))
