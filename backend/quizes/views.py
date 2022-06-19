from django.shortcuts import render
from .models import Quiz
from django.views.generic import ListView
from django.http import JsonResponse
from questions.models import Question, Answer
from results.models import Result
from .serializers import AnswerSerializer, QestionSerializer, QuizSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
# Create your views here.


@api_view(['GET', 'POST'])
def quiz_list(request):
    if request.method=='GET':
        quizlist =Quiz.objects.all()
        serializer= QuizSerializer(quizlist, many=True)
        return Response(serializer.data)

    elif request.method =='POST':
        serializer = QuizSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def quiz_view(request, pk):
    pies="nie"
    quiz=Quiz.objects.get(pk=pk)
    print(quiz)
    #serializer = AnswerSerializer(quiz, many=True)
    #return Response(serializer.data)
    return Response(pies)

@api_view(['GET'])
def quiz_data_view(request, pk):
    quiz=Quiz.objects.get(pk=pk)
    questions = []
    for q in quiz.get_questions():
        answers=[]
        for a in q.get_answers():
            answers.append(a.text)
        questions.append({str(q): answers})
    return Response({
        'data': questions,
        'time': quiz.time,
    })
@api_view(['PUT'])
def save_quiz_view(request, pk):
    questions = []
    data = request.POST
    data_=dict(data.lists())
    print(data_)
    for k in data_.keys():
        question= Question.objects.get(text=k)
        questions.append(question)
    user=request.user
    quiz=Quiz.objects.get(pk=pk)
    score=0
    multiplier=100/quiz.number_of_questions
    results = []
    correct_answer=None
    for q in questions:
        a_selected = request.POST.get(str(q.text))
        if a_selected!="":
            question_answer = Answer.objects.filter(question=q)
            for a in question_answer:
                if a_selected==a.text:
                    if a.correct:
                        score+=1
                        correct_answer= a.text
                else:
                    if a.correct:
                        correct_answer= a.text
            results.append({str(q):{'correct_answer':correct_answer,'answerd':a_selected}})
        else:
            results.append({str(q): "not answerd"})
    score_=score*multiplier
    Result.objects.create(quiz=quiz, user=user, score=score_)
    if score_ >quiz.required_score_to_pass:
        return JsonResponse({'passed': 'true', 'score': score_,'results':results})
    else:
        
        return JsonResponse({'passed': 'false', 'score': score_,'results':results})
