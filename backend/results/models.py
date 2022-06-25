from django.db import models
from quizes.models import Quiz
from django.contrib.auth.models import User

class Result(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    score = models.FloatField()
    name= models.CharField(max_length=120)
    last_name= models.CharField(max_length=120)
    indeks= models.CharField(max_length=120)

    def __str__(self):
        return str(self.pk)