import uuid
from datetime import date
from django.db import models
from django.conf import settings


class JournalEntry(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='journal_entries')
    title = models.CharField(max_length=255, blank=True)
    content = models.TextField()
    mood = models.CharField(max_length=32, blank=True)
    tags = models.JSONField(default=list, blank=True)
    entry_date = models.DateField(default=date.today)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-entry_date', '-created_at']

    def __str__(self):
        return f"{self.title or 'Sans titre'} ({self.entry_date})"
