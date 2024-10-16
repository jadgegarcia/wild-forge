from rest_framework import serializers

from api.models import ActivityCriteriaRelation

class ActivityCriteriaRelationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityCriteriaRelation
        fields = '__all__'