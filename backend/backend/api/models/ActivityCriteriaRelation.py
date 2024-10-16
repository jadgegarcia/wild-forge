from django.db import models

class ActivityCriteriaRelation(models.Model):
    activity = models.ForeignKey('Activity', on_delete=models.CASCADE)
    activity_criteria = models.ForeignKey('ActivityCriteria', on_delete=models.CASCADE)
    strictness = models.IntegerField()  # Your additional field
    activity_criteria_status = models.IntegerField()
    activity_criteria_feedback = models.CharField(max_length=8000, default='', blank=True, null=True)
    
    class Meta:
        unique_together = ('activity', 'activity_criteria')
