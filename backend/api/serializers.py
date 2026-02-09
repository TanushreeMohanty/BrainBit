from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Quiz, Question, Choice

# --- AUTH SERIALIZERS ---

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    role = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ('username', 'password', 'email', 'first_name', 'last_name', 'role')

    def create(self, validated_data):
        role = validated_data.pop('role', 'player')
        
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        
        # This is the critical part for access
        if role.lower() == 'admin':
            user.is_staff = True
            user.is_superuser = True # Optional: gives access to Django Admin panel
            user.save()
            
        return user

# In backend/serializers.py
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        # This MUST match what App.jsx is looking for
        token['is_admin'] = user.is_staff 
        return token

# --- QUIZ SERIALIZERS ---

class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ['id', 'question', 'text', 'is_correct']

class QuestionSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ['id', 'quiz', 'text', 'choices']
class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    question_count = serializers.SerializerMethodField()

    class Meta:
        model = Quiz
        fields = ['id', 'title', 'description', 'questions', 'question_count']

    def get_question_count(self, obj):
        return obj.questions.count()