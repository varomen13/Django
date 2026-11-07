from django.urls import path

from soap.views import CountryInfoView


urlpatterns = [
    path('soap/country/<str:iso>/', CountryInfoView.as_view(), name='soap_country'),
]
