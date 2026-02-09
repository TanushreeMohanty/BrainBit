from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Core API endpoints (Quizzes, Questions, etc.)
    path('api/', include('api.urls')), 
    
    # Authentication Endpoints
    # This is for Login (returns access & refresh tokens)
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    
    # This is for Refreshing the token when it expires
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]