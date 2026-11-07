import requests
from zeep import Client
from zeep.helpers import serialize_object
from zeep.transports import Transport


WSDL_URL = (
    'http://webservices.oorsprong.org/websamples.countryinfo/'
    'CountryInfoService.wso?WSDL'
)
_client = None


def _get_client():
    global _client
    if _client is None:
        session = requests.Session()
        transport = Transport(
            session=session,
            timeout=10,
            operation_timeout=10,
        )
        _client = Client(WSDL_URL, transport=transport)
    return _client


def get_country_info(iso):
    country = _get_client().service.FullCountryInfo(sCountryISOCode=iso.upper())
    if country is None:
        return None

    data = serialize_object(country, target_cls=dict)
    if not data or not data.get('sISOCode'):
        return None

    return {
        'iso': data.get('sISOCode'),
        'nombre': data.get('sName'),
        'capital': data.get('sCapitalCity'),
        'codigo_telefonico': data.get('sPhoneCode'),
        'continente': data.get('sContinentCode'),
        'moneda': data.get('sCurrencyISOCode'),
        'bandera': data.get('sCountryFlag'),
    }
