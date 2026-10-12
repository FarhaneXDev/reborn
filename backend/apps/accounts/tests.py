from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

User = get_user_model()

class AccountsAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_register_and_login(self):
        # Inscription
        register_data = {
            'email': 'test@reborn.app',
            'username': 'reborn_user',
            'password': 'StrongPassword123!',
            'timezone': 'Africa/Porto-Novo',
            'no_contact_start_date': '2026-10-01'
        }
        res = self.client.post('/api/v1/auth/register/', register_data)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertIn('tokens', res.data)
        access_token = res.data['tokens']['access']

        # Profil créé automatiquement
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        me_res = self.client.get('/api/v1/auth/me/')
        self.assertEqual(me_res.status_code, status.HTTP_200_OK)
        self.assertEqual(me_res.data['email'], 'test@reborn.app')
        self.assertEqual(me_res.data['profile']['timezone'], 'Africa/Porto-Novo')
        self.assertEqual(me_res.data['profile']['no_contact_start_date'], '2026-10-01')
