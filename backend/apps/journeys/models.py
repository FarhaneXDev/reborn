import uuid
from django.db import models
from django.conf import settings


class DailyMission(models.Model):
    THEME_CHOICES = [
        ('reperes', 'Accueillir et retrouver des repères'),
        ('estime', 'Reconstruire l\'estime personnelle'),
        ('souvenirs', 'Vivre avec les souvenirs'),
        ('avenir', 'Réinvestir l\'avenir'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    day_number = models.PositiveIntegerField(unique=True)
    theme = models.CharField(max_length=32, choices=THEME_CHOICES)
    title = models.CharField(max_length=255)
    introduction = models.TextField()
    reflection_prompt = models.TextField()
    exercise = models.TextField()
    main_action = models.TextField()
    gentle_version = models.TextField(blank=True)
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['day_number']

    def __str__(self):
        return f"Jour {self.day_number} : {self.title}"


class DailyProgress(models.Model):
    MOOD_CHOICES = [
        ('very_low', 'Très bas'),
        ('low', 'Bas'),
        ('neutral', 'Neutre'),
        ('good', 'Bien'),
        ('very_good', 'Très bien'),
    ]

    STATUS_CHOICES = [
        ('not_started', 'Non commencé'),
        ('in_progress', 'En cours'),
        ('completed', 'Terminé'),
        ('skipped', 'Reporté'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='progress_entries')
    mission = models.ForeignKey(DailyMission, on_delete=models.SET_NULL, null=True, blank=True, related_name='progresses')
    local_date = models.DateField()
    mood = models.CharField(max_length=20, choices=MOOD_CHOICES, null=True, blank=True)
    mood_intensity = models.PositiveSmallIntegerField(null=True, blank=True)
    reflection = models.TextField(blank=True)
    mission_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='not_started')
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-local_date']

    def __str__(self):
        return f"Progrès {self.user.email} - {self.local_date}"
