from django.db import router
from django.urls import path, include
from .views import QuizViewSet, QuestionViewSet, AnswerViewSet, ResultViewSet
from rest_framework.routers import DefaultRouter
from .views import QuizView
#article_details, article_list
router=DefaultRouter()
router.register('quizes', QuizViewSet, basename='quizes')
router.register('questions', QuestionViewSet, basename='questions')
router.register('answers', AnswerViewSet, basename='answers')
router.register('results', ResultViewSet, basename='results')
urlpatterns = [
    path('', include(router.urls)),
    path('quiz/<str:code>', QuizView.as_view()),
    #path('articles/', ArticleList.as_view()),
    #path('articles/<int:id>/', ArticleDetails.as_view()),
    
    #path('articles/', article_list),
    #path('articles/<int:pk>/', article_details),
]
