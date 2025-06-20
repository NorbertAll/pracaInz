from dataclasses import fields
from rest_framework import serializers
from .models import Quiz
from questions.models import Question, Answer
from results.models import Result

class QuizSerializer(serializers.ModelSerializer):
    class Meta:
        model=Quiz
        fields= '__all__'

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model=Question
        fields= '__all__'
class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model=Answer
        fields= '__all__'

class ResultSerializer(serializers.ModelSerializer):
    quiz = QuizSerializer(read_only=True)
    class Meta:
        model=Result
        fields= '__all__'

