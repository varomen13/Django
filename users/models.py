from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    # Login con email en lugar de username
    email = models.EmailField(unique=True)
    # Campo extra de la práctica
    telefono = models.CharField(max_length=15, blank=True, default='')

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']  # username sigue existiendo, se pide al crear superuser
