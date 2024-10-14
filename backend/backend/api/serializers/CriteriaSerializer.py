from rest_framework import serializers

from api.models import ActivityCriteria

class CriteriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityCriteria
        fields = '__all__'