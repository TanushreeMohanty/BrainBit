from rest_framework import generics, permissions
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import User
# Add Question and Choice to your imports
from .models import Quiz, Question, Choice 
from .serializers import (
    QuizSerializer, 
    QuestionSerializer, # Ensure this exists in serializers.py
    ChoiceSerializer,   # Ensure this exists in serializers.py
    RegisterSerializer, 
    MyTokenObtainPairSerializer
)

# --- AUTH VIEWS ---
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

# In backend/views.py
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

    def perform_create(self, serializer):
        user = serializer.save()
        # Double check if the role was sent as 'admin'
        role = self.request.data.get('role', 'player')
        if role.lower() == 'admin':
            user.is_staff = True
            user.save()

# --- QUIZ VIEWS ---
class QuizListCreateView(generics.ListCreateAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    
    def get_permissions(self):
        # IsAdminUser checks the is_staff flag we set in the serializer
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

# --- QUESTION & CHOICE VIEWS (Add these now) ---

class QuestionListCreateView(generics.ListCreateAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer

    def get_permissions(self):
        # Only Admins can POST new questions
        if self.request.method == 'POST':
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]

class ChoiceListCreateView(generics.ListCreateAPIView):
    queryset = Choice.objects.all()
    serializer_class = ChoiceSerializer

    def get_permissions(self):
        # Only Admins can POST choices for questions
        if self.request.method == 'POST':
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]