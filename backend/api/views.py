from rest_framework import generics
from .models import Quiz
from .serializers import QuizSerializer

# Handles GET (List) and POST (Create)
class QuizListCreateView(generics.ListCreateAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer

# Handles GET (Detail), PUT (Update), and DELETE
class QuizDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer