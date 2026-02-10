from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Quiz, Question, Choice, Attempt # Added Attempt import

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
        fields = ['id', 'question', 'text', 'is_correct']

class QuestionSerializer(serializers.ModelSerializer):
    # This allows the frontend to see choices nested within questions
    choices = ChoiceSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ['id', 'quiz', 'text', 'choices']

class QuizSerializer(serializers.ModelSerializer):
    # This nesting is critical for the "Focus Mode" session logic
    questions = QuestionSerializer(many=True, read_only=True)
    question_count = serializers.SerializerMethodField()

    class Meta:
        model = Quiz
        fields = ['id', 'title', 'description', 'questions', 'question_count']

    def get_question_count(self, obj):
        return obj.questions.count()

# --- LOGIC & SCORING: Attempt Serializer ---

class AttemptSerializer(serializers.ModelSerializer):
    """
    Detailed Result Analytics: Transforms scoring data into a readable API response.
    """
    username = serializers.ReadOnlyField(source='user.username')
    quiz_title = serializers.ReadOnlyField(source='quiz.title')

    class Meta:
        model = Attempt
        fields = ['id', 'user', 'username', 'quiz', 'quiz_title', 'score', 'total_questions', 'completed_at']
        read_only_fields = ['user'] # Automatically set to the current user in views