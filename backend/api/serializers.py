from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Quiz, Question, Choice

# --- AUTH SERIALIZERS ---

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    # Define a write-only field for role selection
    role = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        # Added first_name and last_name to match your User list requirements
        fields = ('username', 'password', 'email', 'first_name', 'last_name', 'role')

    def create(self, validated_data):
        # Extract role from data, default to 'player' if not provided
        role = validated_data.pop('role', 'player')
        
        # Use create_user to ensure password hashing
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        
        # If the user chose 'admin', set is_staff to True
        if role.lower() == 'admin':
            user.is_staff = True
            user.save()
            
        return user

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['is_admin'] = user.is_staff
        return token

# --- QUIZ SERIALIZERS ---

class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ['id', 'text', 'is_correct']

class QuestionSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ['id', 'text', 'choices']

class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    question_count = serializers.SerializerMethodField()

    class Meta:
        model = Quiz
        fields = ['id', 'title', 'description', 'questions', 'question_count']

    def get_question_count(self, obj):
        return obj.questions.count() if hasattr(obj, 'questions') else 0