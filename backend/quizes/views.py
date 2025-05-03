import code
import random
import string
from urllib import response
from django.shortcuts import render
from .models import Quiz
from questions.models import Question, Answer
from results.models import Result
from django.views.generic import ListView
from django.http import JsonResponse
from rest_framework.parsers import JSONParser
from questions.models import Question, Answer
from results.models import Result
from .serializers import AnswerSerializer, QuestionSerializer, QuizSerializer, ResultSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
# Create your views here.
from rest_framework import viewsets
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
import json
from django.core.serializers import serialize
from rest_framework.decorators import action

class QuizViewSet(viewsets.ViewSet):
    def list(self, request):
        quizes = Quiz.objects.all()
        serializer=QuizSerializer(quizes, many=True)
        return Response(serializer.data)

    def create(self, request):
        request.data["code"]=''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(10))
        
       
        serializer=QuizSerializer(data=request.data)
       
        if serializer.is_valid():   
            print(request.data["code"])
            serializer.save()
            print(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        queryset= Quiz.objects.all()
        quiz=get_object_or_404(queryset, pk=pk)
        serializer=QuizSerializer(quiz)
        return Response(serializer.data)
    def update(self, request, pk=None):
        try:
            quiz = Quiz.objects.get(pk=pk)
        except Quiz.DoesNotExist:
            return Response({'error': 'Quiz nie istnieje.'}, status=status.HTTP_404_NOT_FOUND)
        serializer =QuizSerializer(quiz, data=request.data, partial=True)
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
        print("❌ Błędy walidacji pytania:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        queryset= Question.objects.all()
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
    def partial_update(self, request, pk=None):
        question = get_object_or_404(Question, pk=pk)
        serializer = QuestionSerializer(question, data=request.data,    partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.   HTTP_400_BAD_REQUEST)
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
    def partial_update(self, request, pk=None):
        answer = get_object_or_404(Answer, pk=pk)
        serializer = AnswerSerializer(answer, data=request.data,    partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.   HTTP_400_BAD_REQUEST)
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
class QuizView(APIView):
    def get (self, request, code=None):
        quiz=Quiz.objects.get(code=code)
        questions = []
        for q in quiz.get_questions():
            answers=[]
            for a in q.get_answers():
                answers.append(a.text)
            questions.append({str(q): answers})
        title=str(quiz)
        data=questions
        time=quiz.time
        return Response({"data":data, "time":time, "title":title})

class QuestionViewSelect(APIView):
    def get(self, request, id=None):
        questions = Question.objects.filter(quiz=id)
        all_questions_data = []
        for question in questions:
            answers = Answer.objects.filter(question=question)
            serialized_answers = AnswerSerializer(answers,many=True).   data
            question_data = {
                "id": question.id,
                "text": question.text,
                "answers": serialized_answers
            }
            all_questions_data.append(question_data)
        return Response({"questions": all_questions_data})


@api_view(['POST'])
def check(request, code=None):
    result =0
    answers=Answer.objects.all()
    quiz=Quiz.objects.get(code=code)
    required_score_to_pass=float(quiz.required_score_to_pass)/100
    c=int(quiz.number_of_questions)
    question={}
    for q in quiz.get_all_questions():
        question[str(q)] = []
    allanswer=Quiz.objects.get(code=code).id#pobranie id quizu
    for ans in answers:
        print(ans)
        if(str(ans.question) in question.keys()):
            if(ans.correct==True):
                question[str(ans.question)].append(ans.text)
    print(question)   
    print(request.data)  
    for x in request.data:
        if(x in question.keys()):
            request.data[x].sort()
            question[x].sort()
            if(request.data[x]==question[x]):
                result=result+1
    r=result/c
    passE=False
    resultE=r*100
    if(r>=required_score_to_pass):
        passE=True

 
    return Response({"data":{
        "resultBool": passE,
        "numberResult": resultE
    }})

@api_view(['POST'])
def check_with_feedback(request, code=None):
    quiz = get_object_or_404(Quiz, code=code)
    answers = Answer.objects.filter(question__quiz=quiz)

    # Mapowanie pytań do odpowiedzi
    correct_answers_map = {}
    all_answers_map = {}
    for answer in answers:
        q_text = str(answer.question)
        all_answers_map.setdefault(q_text, []).append(answer.text)
        if answer.correct:
            correct_answers_map.setdefault(q_text, []).append(answer.text)

    # Odpowiedzi użytkownika
    user_data = request.data

    # Obliczanie wyniku
    correct_count = 0
    total_questions = quiz.number_of_questions

    questions_result = []
    for question_text, all_options in all_answers_map.items():
        correct = sorted(correct_answers_map.get(question_text, []))
        user = sorted(user_data.get(question_text, [])) if question_text in user_data else []

        is_correct = user == correct
        if is_correct:
            correct_count += 1

        questions_result.append({
            "question": question_text,
            "answers": all_options,
            "correct_answers": correct,
            "user_answers": user,
            "is_correct": is_correct
        })

    score = int((correct_count / total_questions) * 100)
    passed = score >= quiz.required_score_to_pass

    return Response({
        "result": {
            "score": score,
            "passed": passed
        },
        "questions": questions_result
    })