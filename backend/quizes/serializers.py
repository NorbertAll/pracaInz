from dataclasses import fields
from rest_framework import serializers
from .models import Quiz
from questions.models import Question, Answer


class QuizSerializer(serializers.ModelSerializer):
    class Meta:
        model=Quiz
        fields= '__all__'

class QestionSerializer(serializers.ModelSerializer):
    class Meta:
        model=Question
        fields= '__all__'

class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model=Answer
        fields= '__all__'