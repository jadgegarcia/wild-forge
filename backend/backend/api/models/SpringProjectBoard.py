from django.db import models


class SpringProjectBoard(models.Model):
    board_id = models.IntegerField(default=0)
    title = models.CharField(max_length=50)
    template_id = models.IntegerField(default=0)
    content = models.TextField()
    novelty = models.IntegerField()
    capability = models.IntegerField()
    technical_feasibility = models.IntegerField()
    feedback = models.TextField(default='')
    recommendation = models.TextField(default='')
    references = models.TextField(default='')
    project_id = models.ForeignKey("SpringProject", on_delete=models.CASCADE, default=None)
    date_created = models.DateTimeField(auto_now=True)
