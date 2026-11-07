from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password

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


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 'telefono',
            'password', 'password2',
        ]
        read_only_fields = ['id']

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {'password2': 'Las contraseñas no coinciden.'}
            )

        user_attrs = {key: value for key, value in attrs.items() if key != 'password2'}
        validate_password(attrs['password'], user=User(**user_attrs))
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        return User.objects.create_user(**validated_data)
