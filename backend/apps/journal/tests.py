from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from apps.journal.models import JournalEntry

User = get_user_model()

class JournalIsolationTest(TestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(email='user1@reborn.app', username='user1', password='Password123!')
        self.user2 = User.objects.create_user(email='user2@reborn.app', username='user2', password='Password123!')
        self.client1 = APIClient()
        self.client1.force_authenticate(user=self.user1)

        self.client2 = APIClient()
        self.client2.force_authenticate(user=self.user2)

    def test_journal_isolation(self):
        # User 1 crée une entrée
        entry = JournalEntry.objects.create(
            user=self.user1,
            title='Mon secret intime',
            content='Un écrit confidentiel',
            tags=['reconstruction']
        )

        # User 1 peut la lire
        res1 = self.client1.get(f'/api/v1/journal/{entry.id}/')
        self.assertEqual(res1.status_code, status.HTTP_200_OK)

        # User 2 ne doit pas la trouver (404)
        res2 = self.client2.get(f'/api/v1/journal/{entry.id}/')
        self.assertEqual(res2.status_code, status.HTTP_404_NOT_FOUND)

        # User 2 dans sa liste ne doit pas la voir
        res_list = self.client2.get('/api/v1/journal/')
        self.assertEqual(len(res_list.data['results'] if 'results' in res_list.data else res_list.data), 0)
