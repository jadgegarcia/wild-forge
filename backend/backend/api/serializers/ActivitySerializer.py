from rest_framework import serializers
from api.models import Activity

class ActivitySerializer(serializers.ModelSerializer):

    class Meta:
        model = Activity
        fields = ('id', 'classroom_id', 'team_id', 'title', 'description', 'submission_status', 'date_created', 'due_date', 'evaluation', 'total_score')

class ActivityCreateFromTemplateSerializer(serializers.Serializer):
    template_id = serializers.IntegerField()
    team_ids = serializers.ListField(child=serializers.IntegerField())
    due_date = serializers.DateTimeField()
    evaluation = serializers.IntegerField()
    total_score = serializers.IntegerField()
    class_id = serializers.IntegerField() 