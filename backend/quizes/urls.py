from django.urls import path
from .views import (
    #QuizListView,
    quiz_list,
    quiz_view,
    quiz_data_view,
    save_quiz_view,
)



urlpatterns= [
    path('', quiz_list,),
    path('<int:pk>/', quiz_view),
    path('<pk>/save/', save_quiz_view, name='save-view'),
    path('<pk>/data/', quiz_data_view, name='quiz-data-view'),
]