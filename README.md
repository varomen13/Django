# Tienda Online: Django + React

Proyecto de autenticación JWT y consumo de APIs para el Resultado de Aprendizaje de las Unidades 2 y 3. El backend usa Django REST Framework y MySQL; el frontend está construido con React, Vite y Semantic UI.

## Estructura

- `products/`: API existente de productos y categorías.
- `users/`: usuario personalizado, autenticación JWT y registro.
- `soap/`: endpoint autenticado que consume CountryInfoService mediante zeep.
- `tienda_online/`: configuración y rutas del proyecto Django.
- `frontend/`: aplicación React con login, registro, dashboard y widgets.

## Backend

Desde la raíz del proyecto en Windows, crea y activa el entorno virtual si aún no existe:

```powershell
if (-not (Test-Path .\venv\Scripts\python.exe)) { py -3.13 -m venv venv }
.\venv\Scripts\Activate.ps1
```

Instala dependencias y prepara la base MySQL configurada en `tienda_online/settings.py`:

```powershell
.\venv\Scripts\pip.exe install -r requirements.txt
.\venv\Scripts\python.exe manage.py migrate
.\venv\Scripts\python.exe manage.py createsuperuser
.\venv\Scripts\python.exe manage.py runserver
```

La API estará disponible en `http://localhost:8000/`. Swagger: `http://localhost:8000/swagger/`.

## Frontend

En otra terminal, desde la raíz:

```powershell
cd frontend
Copy-Item .env.example .env
npm install
npm run dev
```

Vite estará disponible en `http://localhost:5173/`. El archivo `.env` configura la URL de la API Django y el nombre del token en `localStorage`.

## Endpoints

| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| POST | `/api/v1/auth/token/` | Público | Obtener tokens JWT con email y contraseña |
| POST | `/api/v1/auth/token/refresh/` | Público | Renovar el access token |
| GET | `/api/v1/auth/me/` | JWT | Consultar el perfil autenticado |
| POST | `/api/v1/auth/register/` | Público | Registrar una cuenta |
| GET | `/api/v1/soap/country/<iso>/` | JWT | Consultar información de un país mediante SOAP |
| GET | `/api/v1/products/` | JWT | Listar productos |

El endpoint SOAP consume **CountryInfoService** (Oorsprong), en forma diferida desde el backend. El dashboard también consulta Open-Meteo para mostrar el clima actual de Hermosillo.
