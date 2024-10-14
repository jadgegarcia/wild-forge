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
from api.models import ActivityCriteria
from api.models import ActivityComment
from api.models import ClassMember
from api.models import User
from api.models import ActivityCriteriaRelation
from api.models import ActivityGeminiSettings

from api.serializers import ActivityWorkAttachmentSerializer
from api.serializers import ActivitySerializer
from api.serializers import ActivityTemplateSerializer
from api.serializers import ActivityCreateFromTemplateSerializer
from api.serializers import ClassRoomSerializer
from api.serializers import TeamSerializer
from api.serializers import CriteriaSerializer



import fitz
import os
import textwrap
from PIL import Image
import re

import os
import textwrap
import fitz
from datetime import timedelta, datetime

from IPython.core.display import Markdown
from PIL import Image
import google.generativeai as genai

import json

class ActivityController(viewsets.GenericViewSet,
                      mixins.CreateModelMixin,
                      mixins.RetrieveModelMixin,
                      mixins.UpdateModelMixin,
                      mixins.DestroyModelMixin):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
    authentication_classes = [JWTAuthentication]
    #AIzaSyBzwUqIePVR3UJWhkLWkVHQunP7ZRogr0k
    #AIzaSyCN0cmESuQIO_WA6pFeYkGlE0veJVhCW94
    #AIzaSyAP5-SgR3o2jI45MQ8ZD9Y8AhEGn-_yu0A
    API_KEY = ActivityGeminiSettings.objects.first()
    genai.configure(api_key=API_KEY.api_key)
    print(API_KEY.api_key)
    

    # for m in genai.list_models():
    #     if 'generateContent' in m.supported_generation_methods:
    #         print(m.name)


    generation_config = {
        "temperature": 1,
        "top_p": 0.95,
        "top_k": 64,
        "max_output_tokens": 8192,
        "response_mime_type": "text/plain",
    }
    
    safety_settings = [
    {
        "category": "HARM_CATEGORY_HARASSMENT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE",
    },
    {
        "category": "HARM_CATEGORY_HATE_SPEECH",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE",
    },
    {
        "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE",
    },
    {
        "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE",
    },
    ]

    model = genai.GenerativeModel(
        model_name="gemini-1.5-pro-latest",
        #model_name="gemini-1.5-flash",
        safety_settings=safety_settings,
        generation_config=generation_config,
    )

    def calculate_average(self, scores, total):
        #print(scores)
        if not scores:
            return 0
        avg = 0
        for i in scores:

            avg = avg + float(i)
        return int(avg / total)


    def extract_scores(self, feedback_str):
        # Use a regular expression to find all numeric scores
        scores = re.findall(r'\d+', feedback_str)
        # Convert the list of string scores to a list of integers
        scores = list(map(int, scores))
        return scores
        
    def pdf_to_images(pdf_path, output_folder, criteria_with_strictness, activity_instance):
        doc = fitz.open('D:\\SOFTWARE ENGINEERING\\techno-systems-main\\techno-systems\\backend\\backend\\' + pdf_path)
        #print(f"There are {doc.page_count} Pages")
        for i in range(doc.page_count):
            page = doc.load_page(i)
            pix = page.get_pixmap()
            image_path = f"{output_folder}/page_{i + 1}.png"
            pix.save(image_path)
            #print(f"Page {i + 1} converted to image: {image_path}")
        
        img_list = ActivityController.get_images(doc.page_count, output_folder, criteria_with_strictness, activity_instance)
        
        print("Image List:", img_list)
        
        response = ActivityController.model.generate_content(img_list, stream=True)
        response.resolve()
        
        if response is None:
            print("EMMMMMMMMMMPPPPPPPPPPPPTTTTTTTTTTTTTyyyyyyyyyyy")

        print(response.text)
        ActivityController.delete_files(doc.page_count, output_folder)
        doc.close()
        
        return response.text
    
    
    
    def parse_json_string_to_list(json_string):
        # Remove any non-JSON text before the actual JSON content
        json_string = re.sub(r'^[^\[]*', '', json_string)  # Remove everything before the first '['
        try:
            data = json.loads(json_string)
            return data
            if not isinstance(data, list):
                raise ValueError("Parsed data is not a list")

            # Initialize a list to hold the field-value pairs
            field_value_list = []

            # Iterate over each entry in the JSON list
            for entry in data:
                for key, value in entry.items():
                    field_value_list.append(f'"{key}": {value}')

            return field_value_list
        except (json.JSONDecodeError, ValueError) as e:
            print(f"Error parsing JSON: {e}")
            return None


    def list_toString(theList):
        theString = ""
        for i in theList:
            s = str(i) +", "
            theString = theString + s
        return theString

    def delete_files(pageTotal, output_folder):
        for i in range(pageTotal):
            try:

                os.remove(output_folder + f"/page_{i + 1}.png")
                print(f"File at {output_folder}/page_{i + 1}.png deleted successfully.")
            except OSError as e:
                print(f"Error: {output_folder}/page_{i + 1}.png - {e.strerror}")

    def get_images(numberOfPages, output_folder, criteria_with_strictness, activity_instance):
        image_list = []
        for i in range(numberOfPages):
            image_list.append(f"{output_folder}/page_{i + 1}.png")
        
        #print(image_list)
        
        # Create a list comprehension to generate strings containing all criteria names
        #criteria_strings = [f"-{activity_criteria.name}" for activity_criteria in activity_criteria_list]

        
       
        
        # Join the criteria strings together and append to the images list

        #images = [ "Activity Title: " + activity_instance.title + "\nDescription: " + activity_instance.description + "\n" + "Instructions: " + activity_instance.instruction + "\nDirectly rate all images as a whole from 1 - 10  base on the following Criteria:"] + criteria_strings + ["\nEach criteria must have a rating The format is JSON separate by each criteria, overall rating and no other unnecessary texts. It should start with '[' and end with ']'. Include in the JSON the \"Overall Feedback\" about the input and enclose the value with single quotes. There should only be 1 object."]
        images = [
            "Analyze the following images as a whole, treating them as a single Activity. " + 
            "Evaluate the entire activity based on the provided criteria and their associated strictness levels(Strictness is the depth of the evaluation for that criteria). " + 
            "Each criterion should be rated from 1 to 10, where 10 indicates full adherence to the criteria, and 1 indicates minimal adherence. Provide an explanation for each rating." +
            "\nActivity Title: " + activity_instance.title +
            "\nActivity Description: " + activity_instance.description +
            "\nActivity Instructions: " + activity_instance.instruction +
            "\n\n Images to analyze:\n" 
        ]
        #appending images to prompt
        for i in image_list:
            images.append(Image.open(i))

        images.append("\n\nCriteria with strictness:")

        for index, (criteria, strictness) in enumerate(criteria_with_strictness, start=1):
            images.append(f"\n{index}. Criteria: {criteria}, Strictness: {strictness}")

        images.append("\nFor the entire activity, return the following:" +
                      "\n1. A rating for each criterion from 1 to 10." +
                      "\n2. A detailed explanation of why that rating was given, taking the strictness level into account." +
                      "\n3. The format is JSON separate by each criteria." +
                      "\n**Output Format:**" +
                      "\n- Criterion Name" +
                      "\n- Rating: [1-10]" +
                      "\n- Explanation: [Brief explanation of why the rating was given based on the strictness]"
                      )   


        return images
    


    
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
            activityCriteria_ids = request.data.get('activityCriteria_id', [])
            strictness_levels = request.data.get('strictness_levels', [])

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
                                instruction=activity_data.get('instruction'),
                                submission_status=activity_data.get('submission_status', False),
                                due_date=activity_data.get('due_date'),
                                evaluation=activity_data.get('evaluation'),
                                total_score=activity_data.get('total_score', 100)
                            )
                            new_activity.team_id.add(team)
                            # Create ActivityCriteriaRelation instances
                            for criteria_id, strictness in zip(activityCriteria_ids, strictness_levels):
                                ActivityCriteriaRelation.objects.create(
                                    activity=new_activity,
                                    activity_criteria_id=criteria_id,
                                    strictness=strictness  # Use the strictness from the request
                                )
                            # new_activity.activityCriteria_id.add(*activityCriteria_ids)
                            activity_instances.append(new_activity)

                    template = ActivityTemplate.objects.create(
                            course_name=activity_data.get('classroom_id').course_name,
                            title=activity_data.get('title'),
                            description=activity_data.get('description'),
                            instructions=activity_data.get('instruction')
                        )

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
        activityCriteria_ids = request.data.get('activityCriteria_id', [])
        strictness_levels = request.data.get('strictness_levels', [])


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
                            for criteria_id, strictness in zip(activityCriteria_ids, strictness_levels):
                                activity_criteria_instance = ActivityCriteria.objects.filter(pk=criteria_id).first()
                                if not activity_criteria_instance:
                                    return Response({"error": f"ActivityCriteria with ID {criteria_id} not found"}, status=status.HTTP_404_NOT_FOUND)
                                
                                try:
                                    ActivityCriteriaRelation.objects.create(
                                        activity=new_activity,
                                        activity_criteria=activity_criteria_instance,
                                        strictness=strictness
                                    )
                                except Exception as e:
                                    return Response({"error": f"Failed to create ActivityCriteriaRelation: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

                            
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
            
            
            attachments = ActivityWorkAttachment.objects.filter(activity_id=activity)
            serializer = ActivityWorkAttachmentSerializer(attachments, many=True)
            
            member = ClassMember.objects.get(class_id=activity.classroom_id, role=0)
            theUser = User.objects.get(email=member.user_id)
            

            activity_instance = Activity.objects.get(pk=pk)  # Get an activity instance

            criteria_relations = ActivityCriteriaRelation.objects.filter(activity=activity_instance)
            criteria_with_strictness = [
                (relation.activity_criteria.name, relation.strictness)
                for relation in criteria_relations
            ]

            #activity_criteria_related = activity_instance.activityCriteria_id.all()
            # activity_strictness_related = activity_instance.activityStrictness_id.all()

            #activity_criteria_list = list(activity_criteria_related)
            # activity_strictness_list = list(activity_strictness_related)
            
            print("MAO NI ANG CRITERIA OG ANG STRICTNESS NIYA\n.................\n.................")
            print(criteria_with_strictness)

            
            for attachment_data in serializer.data:
                file_attachment = attachment_data['file_attachment']
                response_text = ActivityController.pdf_to_images(file_attachment, 'D:\\SOFTWARE ENGINEERING\\techno-systems-main\\techno-systems\\backend\\backend\\activity_work_submissions', criteria_with_strictness, activity_instance)

                print("||||||||||||||||||||||||||||||||||||")
                if response_text is None:
                    print("\n-------------\n\nEMPTY AND RESPONSE\n\n--------------")
                else:
                    print(response_text.text)
                
            



   
            
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

