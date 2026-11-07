from unittest.mock import patch

import requests
from rest_framework.test import APITestCase

from users.models import User


class CountryInfoApiTests(APITestCase):
    url = '/api/v1/soap/country/MX/'

    def setUp(self):
        self.user = User.objects.create_user(
            username='cliente',
            email='cliente@example.com',
            password='Seguro123!abc',
        )
        self.client.force_authenticate(self.user)

    def test_country_endpoint_requires_authentication(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, 401)

    @patch('soap.services._get_client')
    def test_country_endpoint_returns_country_info(self, get_client):
        get_client.return_value.service.FullCountryInfo.return_value = {
            'sISOCode': 'MX',
            'sName': 'Mexico',
            'sCapitalCity': 'Mexico City',
            'sPhoneCode': '52',
            'sContinentCode': 'NA',
            'sCurrencyISOCode': 'MXN',
            'sCountryFlag': 'https://example.com/mx.svg',
        }
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['servicio'], 'SOAP - CountryInfoService (zeep)')
        self.assertEqual(response.data['nombre'], 'Mexico')
        self.assertEqual(response.data['capital'], 'Mexico City')
        self.assertEqual(response.data['moneda'], 'MXN')
        get_client.return_value.service.FullCountryInfo.assert_called_once_with(
            sCountryISOCode='MX',
        )

    @patch('soap.services._get_client')
    def test_country_endpoint_returns_bad_gateway_on_network_error(self, get_client):
        get_client.side_effect = requests.ConnectionError('connection failed')
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, 502)
        self.assertIn('detail', response.data)

    def test_country_endpoint_rejects_invalid_iso(self):
        response = self.client.get('/api/v1/soap/country/MEX/')

        self.assertEqual(response.status_code, 400)

    @patch('soap.services._get_client')
    def test_country_endpoint_returns_not_found_for_unknown_country(self, get_client):
        get_client.return_value.service.FullCountryInfo.return_value = None

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, 404)
