from rest_framework.test import APITestCase

from users.models import User


class UserSecurityTests(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_superuser(
            email='admin@tienda.com', username='admin', password='Admin12345')
        res = self.client.post('/api/v1/auth/token/',
                               {'email': 'admin@tienda.com', 'password': 'Admin12345'}, format='json')
        self.assertEqual(res.status_code, 200)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + res.data['access'])

    def test_me_no_expone_password_y_muestra_telefono(self):
        self.admin.telefono = '6621234567'
        self.admin.save()
        res = self.client.get('/api/v1/auth/me/')
        self.assertEqual(res.status_code, 200)
        self.assertNotIn('password', res.data)
        self.assertEqual(res.data['telefono'], '6621234567')

    def test_crear_hashea_y_no_devuelve_password(self):
        res = self.client.post('/api/v1/users/', {
            'username': 'ana', 'email': 'ana@tienda.com', 'password': 'Ana12345',
            'telefono': '6620000000'}, format='json')
        self.assertEqual(res.status_code, 201)
        self.assertNotIn('password', res.data)
        u = User.objects.get(email='ana@tienda.com')
        self.assertTrue(u.check_password('Ana12345'))

    def test_listar_no_expone_password(self):
        res = self.client.get('/api/v1/users/')
        self.assertNotIn('password', res.data[0] if isinstance(res.data, list) else res.data['results'][0])

    def test_editar_sin_password_no_cambia_password(self):
        u = User.objects.create_user(email='bob@tienda.com', username='bob', password='Bob12345')
        antes = User.objects.get(pk=u.pk).password
        for metodo in (self.client.patch, self.client.put):
            res = metodo(f'/api/v1/users/{u.pk}/', {
                'username': 'bob', 'email': 'bob@tienda.com', 'first_name': 'Roberto'}, format='json')
            self.assertEqual(res.status_code, 200, res.data)
        u.refresh_from_db()
        self.assertEqual(u.first_name, 'Roberto')
        self.assertEqual(u.password, antes)
        self.assertTrue(u.check_password('Bob12345'))
        self.assertFalse(u.check_password('Admin12345'))  # no heredó la del admin

    def test_editar_con_password_si_la_cambia(self):
        u = User.objects.create_user(email='eva@tienda.com', username='eva', password='Eva12345')
        res = self.client.patch(f'/api/v1/users/{u.pk}/', {'password': 'Nueva12345'}, format='json')
        self.assertEqual(res.status_code, 200)
        u.refresh_from_db()
        self.assertTrue(u.check_password('Nueva12345'))

    def test_swagger_titulo_y_telefono(self):
        res = self.client.get('/swagger/?format=openapi')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data['info']['title'], 'Tienda Online API')
        self.assertIn('telefono', res.data['definitions']['User']['properties'])

    def test_sin_token_no_accede(self):
        self.client.credentials()
        self.assertEqual(self.client.get('/api/v1/auth/me/').status_code, 401)
