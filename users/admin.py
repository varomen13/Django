from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from users.models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    # Muestra el campo extra "telefono" en la lista y en el formulario de edición/alta
    list_display = ('email', 'username', 'telefono', 'is_staff', 'is_active')
    fieldsets = UserAdmin.fieldsets + (
        ('Información adicional', {'fields': ('telefono',)}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Información adicional', {'fields': ('email', 'telefono')}),
    )
    ordering = ('email',)
