from rest_framework import serializers

from api.models import SpringProjectBoard, ActivityComment
from api.serializers.ActivityCommentSerializer import ActivityCommentSerializer

class SpringProjectBoardSerializer(serializers.ModelSerializer):
    activity_comment = ActivityCommentSerializer(read_only=True)

    class Meta:
        model = SpringProjectBoard
        fields = ('id', 'board_id', 'title', 'template_id', 'feedback', 'recommendation', 'references', 
                  'project_id', 'activity_comment', 'date_created', 'score')
        labels = {
            'board_id': 'Board ID',
            'template_id': 'Template ID',
            'feedback': 'Feedback',
            'recommendation': 'Recommendation',
            'references': 'References',
            'project_id': 'Project ID',
            'activity_comment': 'Activity Comment',
            'date_created': 'Date Created',
            'score': 'Score',
        }

