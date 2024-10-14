from django.db import models

class ActivityCriteriaRelation(models.Model):
    activity = models.ForeignKey('Activity', on_delete=models.CASCADE)
    activity_criteria = models.ForeignKey('ActivityCriteria', on_delete=models.CASCADE)
    strictness = models.IntegerField()  # Your additional field

    class Meta:
        unique_together = ('activity', 'activity_criteria')
