from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import User
from .models import Quiz, Question, Choice, Attempt # Ensure Attempt model exists
from .serializers import (
    QuizSerializer, 
    QuestionSerializer, 
    ChoiceSerializer, 
    RegisterSerializer, 
    MyTokenObtainPairSerializer,
    AttemptSerializer # Ensure this is in serializers.py
)

# --- AUTH VIEWS ---
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

    def perform_create(self, serializer):
        user = serializer.save()
        role = self.request.data.get('role', 'player')
        if role.lower() == 'admin':
            user.is_staff = True
            user.save()

# --- QUIZ VIEWS ---
class QuizListCreateView(generics.ListCreateAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    
    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]
    
class QuizDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]

# --- QUESTION & CHOICE VIEWS ---

class QuestionListCreateView(generics.ListCreateAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]

class QuestionDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Allows deleting or updating specific questions"""
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAdminUser]

class ChoiceListCreateView(generics.ListCreateAPIView):
    queryset = Choice.objects.all()
    serializer_class = ChoiceSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]

# --- LOGIC & SCORING: ATTEMPT VIEWS ---

# In api/views.py
# In api/views.py
class AttemptListCreateView(generics.ListCreateAPIView):
    queryset = Attempt.objects.all()
    serializer_class = AttemptSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # This is CRITICAL. It tells Django: "The 'user' field 
        # for this Attempt is whoever is currently logged in."
        serializer.save(user=self.request.user)