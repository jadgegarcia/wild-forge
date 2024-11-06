from rest_framework import viewsets, mixins, permissions, status
from rest_framework.decorators import action
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from django.db import transaction

from api.custom_permissions import IsTeacher, IsModerator

from api.models import Activity
from api.models import ActivityTemplate
from api.models import ClassRoom
from api.models import Team
from api.models import ActivityWorkAttachment

from api.serializers import ActivityWorkAttachmentSerializer
from api.serializers import ActivitySerializer
from api.serializers import ActivityTemplateSerializer
from api.serializers import ActivityCreateFromTemplateSerializer
from api.serializers import ClassRoomSerializer
from api.serializers import TeamSerializer

class ActivityController(viewsets.GenericViewSet,
                      mixins.CreateModelMixin,
                      mixins.RetrieveModelMixin,
                      mixins.UpdateModelMixin,
                      mixins.DestroyModelMixin):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
    authentication_classes = [JWTAuthentication]

    def get_permissions(self):
        if self.action in ['create', 'create_from_template', 
                           'destroy', 'add_evaluation', 'delete_evaluation',
                           ]:
            return [permissions.IsAuthenticated(), IsTeacher(), IsModerator()]
        else:
            return [permissions.IsAuthenticated()]

    @swagger_auto_schema(
        operation_summary="Creates a new activity",
        operation_description="POST /activities",
        request_body=ActivitySerializer,
        responses={
            status.HTTP_201_CREATED: openapi.Response('Created', ActivitySerializer),
            status.HTTP_400_BAD_REQUEST: openapi.Response('Bad Request', message='Bad Request. Invalid or missing data in the request.'),
            status.HTTP_401_UNAUTHORIZED: openapi.Response('Unauthorized', message='Unauthorized. Authentication required.'),
            status.HTTP_404_NOT_FOUND: openapi.Response('Not Found', message='Not Found. One or more teams not found.'),
            status.HTTP_403_FORBIDDEN: openapi.Response('Forbidden', message='Forbidden. You do not have permission to access this resource.'),
            status.HTTP_500_INTERNAL_SERVER_ERROR: openapi.Response('Internal Server Error', message='Internal Server Error. An unexpected error occurred.'),
        }
    )
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            activity_data = serializer.validated_data
            team_ids = request.data.get('team_id', [])

            if team_ids:
                try:
                    teams = Team.objects.filter(pk__in=team_ids)

                    # Use transaction.atomic to ensure all or nothing behavior
                    with transaction.atomic():
                        activity_instances = []
                        for team in teams:
                            # Create a new activity instance for each team
                            new_activity = Activity.objects.create(
                                classroom_id=activity_data.get('classroom_id'),
                                title=activity_data.get('title'),
                                description=activity_data.get('description'),
                                submission_status=activity_data.get('submission_status', False),
                                due_date=activity_data.get('due_date'),
                                evaluation=activity_data.get('evaluation'),
                                total_score=activity_data.get('total_score', 100)
                            )
                            new_activity.team_id.add(team)
                            activity_instances.append(new_activity)

                    activity_serializer = self.get_serializer(activity_instances, many=True)
                    return Response(activity_serializer.data, status=status.HTTP_201_CREATED)
                except Team.DoesNotExist:
                    return Response({'error': 'One or more teams not found'}, status=status.HTTP_404_NOT_FOUND)
            else:
                return Response({'error': 'Invalid or empty Team IDs provided'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        operation_summary="Lists all activities of a class",
        operation_description="GET /classes/{class_pk}/activities",
       responses={
            status.HTTP_200_OK: openapi.Response('OK', ActivitySerializer(many=True)),
            status.HTTP_400_BAD_REQUEST: openapi.Response('Bad Request', message='Bad Request. Class ID not provided.'),
            status.HTTP_401_UNAUTHORIZED: openapi.Response('Unauthorized', message='Unauthorized. Authentication required.'),
            status.HTTP_403_FORBIDDEN: openapi.Response('Forbidden', message='Forbidden. You do not have permission to access this resource.'),
            status.HTTP_500_INTERNAL_SERVER_ERROR: openapi.Response('Internal Server Error', message='Internal Server Error. An unexpected error occurred.'),
        }
    )
    def list(self, request, *args, **kwargs):
        class_id = kwargs.get('class_pk', None)

        if class_id:
            try:
                activities = Activity.objects.filter(classroom_id=class_id)
                serializer = self.get_serializer(activities, many=True)
                return Response(serializer.data)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({'error': 'Class ID not provided'}, status=status.HTTP_400_BAD_REQUEST)
    
    @swagger_auto_schema(
    operation_summary="Create activity from template",
    operation_description="POST /classes/{class_pk}/activities/from_template",
    request_body=ActivityCreateFromTemplateSerializer,
    responses={
        status.HTTP_201_CREATED: openapi.Response('Created', ActivitySerializer),
        status.HTTP_400_BAD_REQUEST: openapi.Response('Bad Request', message='Bad Request. Invalid or missing data in the request.'),
        status.HTTP_401_UNAUTHORIZED: openapi.Response('Unauthorized', message='Unauthorized. Authentication required.'),
        status.HTTP_404_NOT_FOUND: openapi.Response('Not Found', message='Not Found. Template or Class not found.'),
        status.HTTP_500_INTERNAL_SERVER_ERROR: openapi.Response('Internal Server Error', message='Internal Server Error. An unexpected error occurred.'),
    }
    )
    @action(detail=False, methods=['POST'])
    def create_from_template(self, request, class_pk=None, pk=None):
        template_id = request.data.get('template_id', None)
        team_ids = request.data.get('team_ids', [])
        due_date = request.data.get('due_date', None)
        evaluation = request.data.get('evaluation', None)
        total_score = request.data.get('total_score', None)

        if template_id is not None and class_pk is not None:
            try:
                class_obj = ClassRoom.objects.get(pk=class_pk)
                template = ActivityTemplate.objects.get(pk=template_id)

                with transaction.atomic():
                    activity_instances = []
                    for team_id in team_ids:
                        try:
                            team = Team.objects.get(pk=team_id)
                            new_activity = Activity.create_activity_from_template(template)

                            # Update due_date, evaluation, and total_score
                            if due_date:
                                new_activity.due_date = due_date
                            if evaluation:
                                new_activity.evaluation = evaluation
                            if total_score:
                                new_activity.total_score = total_score

                            # Set the class and team for the new activity
                            new_activity.classroom_id = class_obj
                            new_activity.team_id.add(team)

                            new_activity.save()
                            activity_instances.append(new_activity)
                        except Team.DoesNotExist:
                            return Response({"error": f"Team with ID {team_id} not found"}, status=status.HTTP_404_NOT_FOUND)

                activity_serializer = self.get_serializer(activity_instances, many=True)
                return Response(activity_serializer.data, status=status.HTTP_201_CREATED)
            except (ActivityTemplate.DoesNotExist, ClassRoom.DoesNotExist) as e:
                return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"error": "Template ID or Class ID not provided"}, status=status.HTTP_400_BAD_REQUEST)
            
class TeamActivitiesController(viewsets.GenericViewSet,
                      mixins.CreateModelMixin,
                      mixins.RetrieveModelMixin,
                      mixins.UpdateModelMixin,
                      mixins.DestroyModelMixin):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
    authentication_classes = [JWTAuthentication]

    def get_permissions(self):
        if self.action in ['add_evaluation', 'delete_evaluation',
                           ]:
            return [permissions.IsAuthenticated(), IsTeacher()]
        else:
            return [permissions.IsAuthenticated()]

    @swagger_auto_schema(
        operation_summary="Lists all activities of a team",
        operation_description="GET /classes/{class_pk}/teams/{team_pk}/activities",
        responses={
            status.HTTP_200_OK: openapi.Response('OK', ActivitySerializer(many=True)),
            status.HTTP_400_BAD_REQUEST: openapi.Response('Bad Request'),
            status.HTTP_401_UNAUTHORIZED: openapi.Response('Unauthorized'),
            status.HTTP_403_FORBIDDEN: openapi.Response('Forbidden'),
            status.HTTP_404_NOT_FOUND: openapi.Response('Not Found'),
            status.HTTP_500_INTERNAL_SERVER_ERROR: openapi.Response('Internal Server Error'),
        }
    )
    def list(self, request, class_pk=None, team_pk=None):
        try:
            if class_pk is not None and team_pk is not None:
                if not ClassRoom.objects.filter(pk=class_pk).exists():
                    return Response({'error': 'Class not found'}, status=status.HTTP_404_NOT_FOUND)
                
                if not Team.objects.filter(pk=team_pk).exists():
                    return Response({'error': 'Team not found'}, status=status.HTTP_404_NOT_FOUND)

                activities = Activity.objects.filter(classroom_id=class_pk, team_id=team_pk)
                serializer = self.get_serializer(activities, many=True)
                return Response(serializer.data)

            elif team_pk is None:
                return Response({'error': 'Team ID not provided'}, status=status.HTTP_400_BAD_REQUEST)

            elif class_pk is None:
                return Response({'error': 'Class ID not provided'}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    # @swagger_auto_schema(
    #     operation_summary="Lists all submitted activities of a team",
    #     operation_description="GET /classes/{class_pk}/teams/{team_pk}/submitted_activities",
    #     responses={
    #         status.HTTP_200_OK: openapi.Response('OK', ActivitySerializer(many=True)),
    #         status.HTTP_400_BAD_REQUEST: openapi.Response('Bad Request', message='Bad Request. Either class ID or team ID is missing or invalid.'),
    #         status.HTTP_401_UNAUTHORIZED: openapi.Response('Unauthorized', message='Unauthorized. Authentication required.'),
    #         status.HTTP_403_FORBIDDEN: openapi.Response('Forbidden', message='Forbidden. You do not have permission to access this resource.'),
    #         status.HTTP_404_NOT_FOUND: openapi.Response('Not Found', message='Not Found. Either class or team not found.'),
    #         status.HTTP_500_INTERNAL_SERVER_ERROR: openapi.Response('Internal Server Error', message='Internal Server Error. An unexpected error occurred.'),
    #     }
    # )
    # @action(detail=True, methods=['GET'])
    # def submitted_activities(self, request, class_pk=None, team_pk=None):
    #     try:
    #         # Check if both class_id and team_id are provided
    #         if class_pk is not None and team_pk is not None:
    #             # Check if the specified class_id and team_id exist
    #             if not ClassRoom.objects.filter(pk=class_pk).exists():
    #                 return Response({'error': 'Class not found'}, status=status.HTTP_404_NOT_FOUND)
                
    #             if not Team.objects.filter(pk=team_pk).exists():
    #                 return Response({'error': 'Team not found'}, status=status.HTTP_404_NOT_FOUND)

    #             # Retrieve submitted activities for the specified class_id and team_id
    #             submitted_activities = Activity.objects.filter(classroom_id=class_pk, team_id=team_pk, submission_status=True)
    #             serializer = self.get_serializer(submitted_activities, many=True)
    #             return Response(serializer.data, status=status.HTTP_200_OK)

    #         # Check if team_id is not provided
    #         elif team_pk is None:
    #             return Response({'error': 'Team ID not provided'}, status=status.HTTP_400_BAD_REQUEST)

    #         # Check if class_id is not provided
    #         elif class_pk is None:
    #             return Response({'error': 'Class ID not provided'}, status=status.HTTP_400_BAD_REQUEST)

    #     except Exception as e:
    #         return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    @swagger_auto_schema(
    operation_summary="Submit or unsubmit an activity",
    operation_description="POST /classes/{class_pk}/teams/{team_pk}/activities/{activity_pk}/submit",
    request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'submission_status': openapi.Schema(type=openapi.TYPE_BOOLEAN, description='Submissin status. True for submit, False for unsubmit'),
            },
            required=['evaluation'],
        ),
    responses={
        status.HTTP_200_OK: openapi.Response('OK', ActivitySerializer),
        status.HTTP_400_BAD_REQUEST: openapi.Response('Bad Request', message='Bad Request. Activity not found or invalid action.'),
        status.HTTP_401_UNAUTHORIZED: openapi.Response('Unauthorized', message='Unauthorized. Authentication required.'),
        status.HTTP_403_FORBIDDEN: openapi.Response('Forbidden', message='Forbidden. You do not have permission to access this resource.'),
        status.HTTP_500_INTERNAL_SERVER_ERROR: openapi.Response('Internal Server Error', message='Internal Server Error. An unexpected error occurred.'),
    }
    )
    @action(detail=True, methods=['POST'])
    def submit(self, request, class_pk=None, team_pk=None, pk=None):
        try:
            activity = Activity.objects.get(classroom_id=class_pk, team_id=team_pk, pk=pk)
            activity.submission_status = not activity.submission_status
            activity.save()

            serializer = self.get_serializer(activity)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Activity.DoesNotExist:
            return Response({'error': 'Activity not found'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    @swagger_auto_schema(
        operation_summary="Add evaluation for an activity",
        operation_description="POST /classes/{class_pk}/teams/{team_pk}/activities/{activity_pk}/add-evaluation",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'evaluation': openapi.Schema(type=openapi.TYPE_INTEGER, description='Evaluation score.'),
            },
            required=['evaluation'],
        ),
        responses={
            status.HTTP_200_OK: openapi.Response('OK', ActivitySerializer),
            status.HTTP_400_BAD_REQUEST: openapi.Response('Bad Request', message='Bad Request. Activity not found, invalid data, or submission status is false.'),
            status.HTTP_401_UNAUTHORIZED: openapi.Response('Unauthorized', message='Unauthorized. Authentication required.'),
            status.HTTP_403_FORBIDDEN: openapi.Response('Forbidden', message='Forbidden. You do not have permission to access this resource.'),
            status.HTTP_500_INTERNAL_SERVER_ERROR: openapi.Response('Internal Server Error', message='Internal Server Error. An unexpected error occurred.'),
        }
    )
    @action(detail=True, methods=['POST'])
    def add_evaluation(self, request, class_pk=None, team_pk=None, pk=None):
        try:
            activity = Activity.objects.get(classroom_id=class_pk, team_id=team_pk, pk=pk)

            if not activity.submission_status:
                return Response({'error': 'Cannot add evaluation for an activity with submission status as false.'}, status=status.HTTP_400_BAD_REQUEST)

            evaluation = request.data.get('evaluation', None)

            if evaluation is not None:
                activity.evaluation = evaluation
                activity.save()
            else:
                return Response({'error': 'Evaluation score not provided'}, status=status.HTTP_400_BAD_REQUEST)

            serializer = self.get_serializer(activity)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Activity.DoesNotExist:
            return Response({'error': 'Activity not found'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    @swagger_auto_schema(
        operation_summary="Delete evaluation for an activity",
        operation_description="POST /classes/{class_pk}/teams/{team_pk}/activities/{activity_pk}/delete-evaluation",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'evaluation': openapi.Schema(type=openapi.TYPE_INTEGER, description='Evaluation score.'),
            },
            required=['evaluation'],
        ),
        responses={
            status.HTTP_200_OK: openapi.Response('OK', ActivitySerializer),
            status.HTTP_400_BAD_REQUEST: openapi.Response('Bad Request', message='Bad Request. Activity not found, invalid data, or submission status is false.'),
            status.HTTP_401_UNAUTHORIZED: openapi.Response('Unauthorized', message='Unauthorized. Authentication required.'),
            status.HTTP_403_FORBIDDEN: openapi.Response('Forbidden', message='Forbidden. You do not have permission to access this resource.'),
            status.HTTP_500_INTERNAL_SERVER_ERROR: openapi.Response('Internal Server Error', message='Internal Server Error. An unexpected error occurred.'),
        }
    )
    @action(detail=True, methods=['DELETE'])
    def delete_evaluation(self, request, class_pk=None, team_pk=None, pk=None):
        try:
            activity = Activity.objects.get(classroom_id=class_pk, team_id=team_pk, pk=pk)

            if not activity.submission_status:
                return Response({'error': 'Cannot delete evaluation for an activity with submission status as false.'}, status=status.HTTP_400_BAD_REQUEST)

            activity.evaluation = None
            activity.save()

            serializer = self.get_serializer(activity)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Activity.DoesNotExist:
            return Response({'error': 'Activity not found'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

