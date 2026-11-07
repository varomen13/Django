from rest_framework.test import APITestCase

from users.models import User


class RegisterApiTests(APITestCase):
    url = '/api/v1/auth/register/'

    def registration_data(self, **overrides):
        data = {
            'username': 'ana',
            'email': 'ana@example.com',
            'first_name': 'Ana',
            'last_name': 'Lopez',
            'telefono': '6621234567',
            'password': 'Seguro123!abc',
            'password2': 'Seguro123!abc',
        }
        data.update(overrides)
        return data

    def test_registration_creates_user_without_returning_password(self):
        response = self.client.post(self.url, self.registration_data(), format='json')

        self.assertEqual(response.status_code, 201)
        self.assertNotIn('password', response.data)
        self.assertNotIn('password2', response.data)
        user = User.objects.get(email='ana@example.com')
        self.assertFalse(user.is_staff)
        self.assertTrue(user.check_password('Seguro123!abc'))

    def test_registration_cannot_escalate_privileges(self):
        response = self.client.post(
            self.url,
            self.registration_data(is_staff=True, is_superuser=True),
            format='json',
        )

        self.assertEqual(response.status_code, 201)
        user = User.objects.get(email='ana@example.com')
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)

    def test_registration_rejects_mismatched_passwords(self):
        response = self.client.post(
            self.url,
            self.registration_data(password2='OtraPassword123!'),
            format='json',
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn('password2', response.data)

    def test_registration_rejects_weak_password(self):
        response = self.client.post(
            self.url,
            self.registration_data(password='12345678', password2='12345678'),
            format='json',
        )

        self.assertEqual(response.status_code, 400)

    def test_registration_rejects_duplicate_email(self):
        User.objects.create_user(
            username='existing',
            email='ana@example.com',
            password='ExistingPassword123!',
        )
        response = self.client.post(self.url, self.registration_data(), format='json')

        self.assertEqual(response.status_code, 400)

    def test_registered_user_can_log_in(self):
        self.client.post(self.url, self.registration_data(), format='json')

        response = self.client.post(
            '/api/v1/auth/token/',
            {'email': 'ana@example.com', 'password': 'Seguro123!abc'},
            format='json',
        )

        self.assertEqual(response.status_code, 200)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
