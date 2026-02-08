from django.urls import path
# Update the import to match the updated views we'll use
from .views import QuizListCreateView, QuizDetailView

urlpatterns = [
    # Path for Listing all quizzes and Creating a new one
    path('quizzes/', QuizListCreateView.as_view(), name='quiz-list'),
    
    # Path for Getting, Updating, or Deleting a specific quiz
    path('quizzes/<int:pk>/', QuizDetailView.as_view(), name='quiz-detail'),
]