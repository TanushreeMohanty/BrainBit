from django.urls import path
from .views import (
    QuizListCreateView, 
    QuizDetailView, 
    RegisterView, 
    MyTokenObtainPairView
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # --- Quiz Endpoints ---
    path('quizzes/', QuizListCreateView.as_view(), name='quiz-list'),
    path('quizzes/<int:pk>/', QuizDetailView.as_view(), name='quiz-detail'),
    
    # --- Authentication Endpoints ---
    # Endpoint for creating a new user (Signup)
    path('register/', RegisterView.as_view(), name='register'),
    
    # Custom endpoint for Login (returns access token with is_admin flag)
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    
    # Standard endpoint to refresh the access token
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]