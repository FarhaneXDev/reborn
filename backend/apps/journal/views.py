from rest_framework import generics
from django.db.models import Q
from .models import JournalEntry
from .serializers import JournalEntrySerializer


class JournalListCreateView(generics.ListCreateAPIView):
    serializer_class = JournalEntrySerializer

    def get_queryset(self):
        user = self.request.user
        qs = JournalEntry.objects.filter(user=user)

        tag = self.request.query_params.get('tag')
        if tag:
            # Recherche dans le champ JSON tags
            qs = qs.filter(tags__icontains=tag)

        search = self.request.query_params.get('search')
        if search:
            qs = qs.filter(Q(title__icontains=search) | Q(content__icontains=search))

        return qs


class JournalDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = JournalEntrySerializer

    def get_queryset(self):
        return JournalEntry.objects.filter(user=self.request.user)
