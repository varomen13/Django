import re

import requests
from zeep.exceptions import Error as ZeepError
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from soap.services import get_country_info


class CountryInfoView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_summary='Consultar información de un país mediante SOAP',
        manual_parameters=[
            openapi.Parameter(
                'iso',
                openapi.IN_PATH,
                description='Código ISO de dos letras del país, por ejemplo MX.',
                type=openapi.TYPE_STRING,
            ),
        ],
        responses={
            200: 'Información del país.',
            400: 'El código ISO no es válido.',
            401: 'Autenticación requerida.',
            404: 'País no encontrado.',
            502: 'El servicio SOAP no está disponible.',
        },
    )
    def get(self, request, iso):
        if re.fullmatch(r'[A-Za-z]{2}', iso) is None:
            return Response(
                {'detail': 'El código ISO debe tener exactamente dos letras.'},
                status=400,
            )

        try:
            country = get_country_info(iso)
        except (requests.RequestException, ZeepError):
            return Response(
                {'detail': 'No fue posible conectar con el servicio SOAP.'},
                status=502,
            )

        if country is None:
            return Response({'detail': 'País no encontrado.'}, status=404)

        return Response({
            'servicio': 'SOAP - CountryInfoService (zeep)',
            **country,
        })
