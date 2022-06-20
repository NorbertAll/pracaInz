from django.shortcuts import render
from .models import Quiz
from questions.models import Question, Answer
from results.models import Result
from django.views.generic import ListView
from django.http import JsonResponse
from questions.models import Question, Answer
from results.models import Result
from .serializers import AnswerSerializer, QuestionSerializer, QuizSerializer, ResultSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
# Create your views here.
from rest_framework import viewsets
from django.shortcuts import get_object_or_404

class QuizViewSet(viewsets.ViewSet):
    def list(self, request):
        quizes = Quiz.objects.all()
        serializer=QuizSerializer(quizes, many=True)
        return Response(serializer.data)

    def create(self, request):
        serializer =QuizSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        queryset= Quiz.objects.all()
        quiz=get_object_or_404(queryset, pk=pk)
        serializer=QuizSerializer(quiz)
        return Response(serializer.data)
    def update(self, request, pk=None):
        quiz= Quiz.objects.get(pk)
        serializer =QuizSerializer(quiz, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def destroy(self, request, pk=None):
        quiz= Quiz.objects.get(pk=pk)
        quiz.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
class QuestionViewSet(viewsets.ViewSet):
    def list(self, request):
        qestions = Question.objects.all()
        serializer=QuestionSerializer(qestions, many=True)
        return Response(serializer.data)

    def create(self, request):
        serializer =QuestionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        queryset= Quiz.objects.all()
        qestion=get_object_or_404(queryset, pk=pk)
        serializer=QuestionSerializer(qestion)
        return Response(serializer.data)
    def update(self, request, pk=None):
        qestion= Quiz.objects.get(pk)
        serializer =QuestionSerializer(qestion, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def destroy(self, request, pk=None):
        qestion= Question.objects.get(pk=pk)
        qestion.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
class AnswerViewSet(viewsets.ViewSet):
    def list(self, request):
        answers = Answer.objects.all()
        serializer=AnswerSerializer(answers, many=True)
        return Response(serializer.data)

    def create(self, request):
        serializer =AnswerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        queryset= Answer.objects.all()
        answer=get_object_or_404(queryset, pk=pk)
        serializer=AnswerSerializer(answer)
        return Response(serializer.data)
    def update(self, request, pk=None):
        answer= Answer.objects.get(pk)
        serializer =AnswerSerializer(answer, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def destroy(self, request, pk=None):
        answer= Answer.objects.get(pk=pk)
        answer.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
class ResultViewSet(viewsets.ViewSet):
    def list(self, request):
        results = Result.objects.all()
        serializer=ResultSerializer(results, many=True)
        return Response(serializer.data)

    def create(self, request):
        serializer =ResultSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        queryset= Result.objects.all()
        result=get_object_or_404(queryset, pk=pk)
        serializer=ResultSerializer(result)
        return Response(serializer.data)
    def update(self, request, pk=None):
        result= Result.objects.get(pk)
        serializer =ResultSerializer(result, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def destroy(self, request, pk=None):
        result= Result.objects.get(pk=pk)
        result.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)       