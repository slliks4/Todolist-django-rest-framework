from django.db import models

class Task(models.Model):
    title = models.CharField(max_length=200)
    completed = models.BooleanField(default=False, blank=True, null=True)

    class Meta:
        verbose_name_plural = " Task "
        ordering = ('-id',)

    def __str__(self) -> str:
        return f"{self.title}  ||  {self.completed}"