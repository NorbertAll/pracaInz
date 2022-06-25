from multiprocessing import Value
import string
from django.db import models
import random



class Quiz(models.Model):
    name = models.CharField(max_length=120)
    topic = models.CharField(max_length=120)
    number_of_questions = models.IntegerField()
    time = models.IntegerField(help_text="duration of the quiz in minutes")
    required_score_to_pass = models.IntegerField(help_text="required score in %")
    #code=models.CharField(max_length=20, unique=True, )

    def __str__(self):
        return str(self.name)

    def generat(self):
        self.code = ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(10))
        self.save()

    def get_questions(self):
        questions = list(self.question_set.all())
        random.shuffle(questions)
        return questions[:self.number_of_questions]

    class Meta:
        verbose_name_plural = 'Quizes'

#''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(N))