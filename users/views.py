from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password

from users.models import User
from users.serializers import UserSerializer


class UserApiViewSet(ModelViewSet):
    permission_classes = [IsAdminUser]
    serializer_class = UserSerializer
    queryset = User.objects.all()

    def create(self, request, *args, **kwargs):
        data = request.data.copy()  # request.data puede ser inmutable
        if 'password' in data:
            data['password'] = make_password(data['password'])
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=201)

    def update(self, request, *args, **kwargs):
        # PUT y PATCH comparten esta lógica (partial_update llama a update)
        data = request.data.copy()
        # CORRECCIÓN 2: solo se cambia la contraseña si viene en la petición.
        # Si no viene, se quita y el serializer no la toca.
        if 'password' in data:
            data['password'] = make_password(data['password'])
        else:
            data.pop('password', None)

        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)


class UserView(APIView):
    """Datos personales del usuario autenticado (sin contraseña)."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
