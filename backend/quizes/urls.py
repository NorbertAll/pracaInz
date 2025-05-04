from django.db import router
from django.urls import path, include
from .views import QuizViewSet, QuestionViewSet, AnswerViewSet, ResultViewSet
from rest_framework.routers import DefaultRouter # type: ignore
from .views import QuizView, QuestionViewSelect, check_with_feedback, SendMailAPIView
from rest_framework import routers # type: ignore
from quizes import views 


router=DefaultRouter()
router.register('quizes', QuizViewSet, basename='quizes')
router.register('questions', QuestionViewSet, basename='questions')
router.register('answers', AnswerViewSet, basename='answers')
router.register('results', ResultViewSet, basename='results')
urlpatterns = [
    path('', include(router.urls)),
    path('quiz/<str:code>/', QuizView.as_view()),
    
    path('check/<str:code>/', views.check, name="quiz-done"),
    path('questions_select/<str:id>/', QuestionViewSelect.as_view()),
    path('check_feedback/<str:code>/', check_with_feedback, name='check_feedback'),
    path('send-mails/', SendMailAPIView.as_view(), name='send-mails'),
]
