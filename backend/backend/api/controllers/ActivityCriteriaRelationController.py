from rest_framework import viewsets, mixins, permissions, status
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.decorators import action
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework.response import Response

from api.models import ActivityCriteriaRelation
from api.serializers import ActivityCriteriaRelationSerializer  # Make sure to create this serializer

class ActivityCriteriaRelationController(viewsets.GenericViewSet,
                                         mixins.ListModelMixin,
                                         mixins.CreateModelMixin,
                                         mixins.RetrieveModelMixin,
                                         mixins.UpdateModelMixin,
                                         mixins.DestroyModelMixin):
    
    queryset = ActivityCriteriaRelation.objects.all()
    serializer_class = ActivityCriteriaRelationSerializer
    authentication_classes = [JWTAuthentication]

    def get_permissions(self):
        if self.action in ['create', 'destroy', 'update', 'partial_update']:
            return [permissions.IsAuthenticated()]
        elif self.action in ['retrieve', 'list']:
            return [permissions.IsAuthenticated()]

        return super().get_permissions()

    @action(detail=False, methods=['get'])
    def activityRelations(self, request):
        queryset = ActivityCriteriaRelation.objects.all()
        serializer = ActivityCriteriaRelationSerializer(queryset, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(
        operation_summary="Get a specific activity criteria relation by ID",
        operation_description="GET /activity-criteria-relations/{pk}",
        responses={
            status.HTTP_200_OK: ActivityCriteriaRelationSerializer,
            status.HTTP_404_NOT_FOUND: "Not Found",
            status.HTTP_401_UNAUTHORIZED: "Unauthorized",
            status.HTTP_500_INTERNAL_SERVER_ERROR: "Internal Server Error",
        }
    )
    
    def retrieve(self, request, pk=None):
        try:
            activity_relation = ActivityCriteriaRelation.objects.get(pk=pk)
            serializer = self.get_serializer(activity_relation)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ActivityCriteriaRelation.DoesNotExist:
            return Response({"error": "Activity criteria relation not found"}, status=status.HTTP_404_NOT_FOUND)
