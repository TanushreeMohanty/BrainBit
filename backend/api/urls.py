from django.urls import path
from .views import (
    QuizListCreateView, 
    QuizDetailView, 
    QuestionListCreateView, 
    QuestionDetailView,      # Added for CRUD support
    ChoiceListCreateView,    
    RegisterView, 
    MyTokenObtainPairView,
    AttemptListCreateView    # Added for Leaderboard & Scoring
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # --- Quiz Endpoints ---
    path('quizzes/', QuizListCreateView.as_view(), name='quiz-list'),
    path('quizzes/<int:pk>/', QuizDetailView.as_view(), name='quiz-detail'),
    
    # --- Question & Choice Endpoints ---
    path('questions/', QuestionListCreateView.as_view(), name='question-list'),
    path('questions/<int:pk>/', QuestionDetailView.as_view(), name='question-detail'),
    path('choices/', ChoiceListCreateView.as_view(), name='choice-list'),
    
    # --- Logic & Scoring: Leaderboard Endpoint ---
    # This fixes the "Page not found (404)" error for /api/attempts/
    path('attempts/', AttemptListCreateView.as_view(), name='attempt-list'),
    
    # --- Authentication Endpoints ---
    path('register/', RegisterView.as_view(), name='register'),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]