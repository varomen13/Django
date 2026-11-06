from rest_framework import serializers

from users.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name',
                  'telefono', 'password', 'is_active', 'is_staff']
        # CORRECCIÓN 1: el hash de la contraseña NUNCA se devuelve en las respuestas
        extra_kwargs = {
            'password': {'write_only': True, 'required': False},
        }
