from django.db import models
from quizes.models import Quiz
import random
class Question(models.Model):
    text = models.CharField(max_length=200)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.text)

    def get_answers(self):
        answers = list(self.answer_set.all())
        random.shuffle(answers)
        return answers
    def __int__(self):
        return int(self.id)

   

class Answer(models.Model):
    text = models.CharField(max_length=200)
    correct = models.BooleanField(default=False)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"id_q:'{self.question.id}, question: {self.question.text}, answer: {self.text}, answer: {self.id}, correct: {self.correct}"