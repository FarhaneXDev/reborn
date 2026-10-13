from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from django.db import connection


def health_check(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1;")
        return JsonResponse({"status": "ok", "database": "connected"})
    except Exception as e:
        return JsonResponse({"status": "error", "database": str(e)}, status=503)


urlpatterns = [
    path('health/', health_check, name='health_root'),
    path('api/v1/health/', health_check, name='health_check'),
    path('admin/', admin.site.urls),
    path('api/v1/auth/', include('apps.accounts.urls')),
    path('api/v1/journeys/', include('apps.journeys.urls')),
    path('api/v1/journal/', include('apps.journal.urls')),
    path('api/v1/goals/', include('apps.goals.urls')),
    path('api/v1/analytics/', include('apps.analytics.urls')),
]
