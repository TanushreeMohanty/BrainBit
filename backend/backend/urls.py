from django.contrib import admin
from django.urls import path, include

# backend/backend/urls.py
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')), # Make sure 'api/' is here!
]