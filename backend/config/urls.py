from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/auth/', include('apps.accounts.urls')),
    path('api/v1/journeys/', include('apps.journeys.urls')),
    path('api/v1/journal/', include('apps.journal.urls')),
    path('api/v1/goals/', include('apps.goals.urls')),
    path('api/v1/analytics/', include('apps.analytics.urls')),
]
