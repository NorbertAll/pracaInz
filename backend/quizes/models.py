from multiprocessing import Value
import string
from django.db import models
import random
from accounts.models import CustomUser



class Quiz(models.Model):
    name = models.CharField(max_length=120)
    topic = models.CharField(max_length=120)
    number_of_questions = models.IntegerField()
    time = models.IntegerField(help_text="duration of the quiz in minutes")
    required_score_to_pass = models.IntegerField(help_text="required score in %")
    code=models.CharField(max_length=20, unique=True, auto_created=True)
    creator=models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    is_public=models.BooleanField(default=False)
    def __str__(self):
        self.code = ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(10))
        return str(self.name)



    def get_questions(self):
        questions = list(self.question_set.all())
        random.shuffle(questions)
        return questions[:self.number_of_questions]

    def get_all_questions(self):
        questions = list(self.question_set.all())
        return questions

    class Meta:
        verbose_name_plural = 'Quizes'

#''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(N))