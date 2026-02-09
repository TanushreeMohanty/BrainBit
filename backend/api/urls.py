from django.urls import path
from .views import (
    QuizListCreateView, 
    QuizDetailView, 
    QuestionListCreateView,  # Add this
    ChoiceListCreateView,    # Add this
    RegisterView, 
    MyTokenObtainPairView
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # --- Quiz Endpoints ---
    path('quizzes/', QuizListCreateView.as_view(), name='quiz-list'),
    path('quizzes/<int:pk>/', QuizDetailView.as_view(), name='quiz-detail'),
    
    # --- Question & Choice Endpoints (Required for Question Builder) ---
    path('questions/', QuestionListCreateView.as_view(), name='question-list'),
    path('choices/', ChoiceListCreateView.as_view(), name='choice-list'),
    
    # --- Authentication Endpoints ---
    path('register/', RegisterView.as_view(), name='register'),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]