from rest_framework import serializers

from api.models import SpringProjectBoard


class SpringProjectBoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpringProjectBoard
        fields = ('id', 'board_id', 'title', 'template_id', 'content', 'novelty', 'capability', 'technical_feasibility',
                  'feedback', 'recommendation', 'references', 'project_id', 'date_created')
        labels = {
            'board_id': 'Board ID',
            'template_id': 'Template ID',
            'content': 'Content',
            'novelty': 'Novelty Score',
            'capability': 'Capability Score',
            'technical_feasibility': 'Technical Feasibility Score',
            'feedback': 'Feedback',
            'recommendation': 'Recommendation',
            'references': 'References',
            'project_id': 'Project Id',
            'date_created': 'Date Created',
        }
