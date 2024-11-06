import json
from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from api.serializers import SpringProjectBoardSerializer, SpringProjectSerializer
from api.models import SpringProject, SpringProjectBoard, SpringBoardTemplate, Team, TeamMember
import requests
from django.db.models import Max
from django.conf import settings
import os
from openai import OpenAI


class CreateProjectBoard(generics.CreateAPIView):
    serializer_class = SpringProjectBoardSerializer

    def perform_create(self, serializer, data):
        serializer.save(**data)

    def update_project_score(self, project, add_score):
        project.score += add_score
        project.save()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        data = {}

        highest_board_id = SpringProjectBoard.objects.aggregate(Max('board_id'))[
            'board_id__max']
        new_board_id = highest_board_id + 1 if highest_board_id is not None else 1

        prompt = (
            f"Please analyze the following data: {request.data.get('content', '')}. "
            f"Provide a detailed and critical rating (1-10) in numerical value(not in string) for the following aspects: "
            f"\n1. Novelty: Evaluate the originality of the data. "
            f"\n2. Technical Feasibility: Assess whether the data is technically sound and feasible. "
            f"\n3. Capability: Determine if the data demonstrates capability. "
            f"\nRatings below 5 should be considered for data that lacks composition, effort, verbosity, or information. "
            f"Be critical and practical when rating. "
            f"Include at least 2 specific sentences of advice for improvements (Recommendations) and "
            f"2 sentences of feedback on how the data is presented and structured, and what can be done to improve those aspects (Feedback) for each of the above aspects. "
            f"The output should be in the following JSON format: "
            f"\n'novelty': 'numerical rating', 'technical_feasibility': 'numerical rating', 'capability': 'numerical rating', "
            f"'recommendations_novelty': ['specific advice'], 'recommendations_technical_feasibility': [' advice'], "
            f"'recommendations_capability': ['specific advice'], 'feedback_novelty': ['specific feedback'], "
            f"'feedback_technical_feasibility': ['feedback'], 'feedback_capability': ['specific feedback']. "
            f"Ensure a fair and balanced assessment for each aspect."
        )
        client = OpenAI(api_key=os.environ.get("OPENAI_KEY", ""))
        message = [
            {"role": "user", "content": prompt}
        ]

        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo", messages=message, temperature=0, max_tokens=1050
            )
            if response:
                try:
                    choices = response.choices
                    first_choice_content = response.choices[0].message.content

                    if choices:
                        gpt_response = first_choice_content
                        json_response = json.loads(gpt_response)
                        print(json_response)
                        novelty = json_response.get("novelty", 0)
                        technical_feasibility = json_response.get(
                            "technical_feasibility", 0)
                        capability = json_response.get("capability", 0)
                        recommendations_novelty = json_response.get(
                            "recommendations_novelty", [])
                        recommendations_technical_feasibility = json_response.get(
                            "recommendations_technical_feasibility", [])
                        recommendations_capability = json_response.get(
                            "recommendations_capability", [])

                        feedback_novelty = json_response.get(
                            "feedback_novelty", [])
                        feedback_technical_feasibility = json_response.get(
                            "feedback_technical_feasibility", [])
                        feedback_capability = json_response.get(
                            "feedback_capability", [])

                        recommendations = '\n'.join([
                            "Novelty Recommendations:\n" +
                            '\n'.join(recommendations_novelty),
                            "\n\nTechnical Feasibility Recommendations:\n" +
                            '\n'.join(
                                recommendations_technical_feasibility),
                            "\n\nCapability Recommendations:\n" +
                            '\n'.join(recommendations_capability)
                        ])

                        feedback = '\n'.join([
                            "Novelty Feedback:\n" +
                            '\n'.join(feedback_novelty),
                            "\n\nTechnical Feasibility Feedback:\n" +
                            '\n'.join(feedback_technical_feasibility),
                            "\n\nCapability Feedback:\n" +
                            '\n'.join(feedback_capability)
                        ])
                        title = request.data.get('title', '')
                        content = request.data.get('content', '')
                        project_id_id = request.data.get('project_id', None)

                        data = {
                            'title': title,
                            'content': content,
                            'novelty': novelty,
                            'technical_feasibility': technical_feasibility,
                            'capability': capability,
                            'recommendation': recommendations,
                            'feedback': feedback,
                            'project_id': SpringProject.objects.get(id=project_id_id),
                            'board_id': new_board_id,
                        }

                        project_instance = SpringProject.objects.get(
                            id=project_id_id)
                        add_score = (
                            (novelty * 0.4) +
                            (technical_feasibility * 0.3) +
                            (capability * 0.3)
                        )
                        self.update_project_score(
                            project_instance, add_score)

                    else:
                        print("No response content or choices found.")
                except json.JSONDecodeError as json_error:
                    return Response({"error": f"Error decoding JSON response: {json_error}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            else:
                return Response({"error": response.text}, status=status.HTTP_400_BAD_REQUEST)
        except requests.exceptions.RequestException as e:
            print(f"An error occurred: {e}")
            data = {}

        if serializer.is_valid():
            self.perform_create(serializer, data)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GetProjectBoards(generics.ListAPIView):
    serializer_class = SpringProjectBoardSerializer

    def get_queryset(self):
        project_id = self.kwargs.get('project_id')
        queryset = SpringProjectBoard.objects.filter(project_id_id=project_id).values(
            'template_id').annotate(
                latest_id=Max('id'),
        ).values(
                'latest_id',
        )

        return SpringProjectBoard.objects.filter(id__in=queryset)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class GetVersionProjectBoards(generics.ListAPIView):
    serializer_class = SpringProjectBoardSerializer
    queryset = SpringProjectBoard.objects.all()

    def get(self, request, *args, **kwargs):
        projectboard_id = self.kwargs.get('projectboard_id')

        try:
            projectboard = SpringProjectBoard.objects.get(id=projectboard_id)
            template_id = projectboard.template_id
            board_id = projectboard.board_id

            related_projectboards = SpringProjectBoard.objects.filter(
                template_id=template_id, board_id=board_id)

            related_projectboards = related_projectboards.order_by(
                '-date_created')

            serializer = SpringProjectBoardSerializer(
                related_projectboards, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except SpringProjectBoard.DoesNotExist:
            return Response({"error": "ProjectBoard not found"}, status=status.HTTP_404_NOT_FOUND)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class GetProjectBoardById(generics.ListAPIView):
    serializer_class = SpringProjectBoardSerializer
    queryset = SpringProjectBoard.objects.all()

    def get(self, request, *args, **kwargs):
        projectboard_id = self.kwargs.get('projectboard_id')

        try:
            projectboard = SpringProjectBoard.objects.get(id=projectboard_id)
            serializer = SpringProjectBoardSerializer(projectboard)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except SpringProjectBoard.DoesNotExist:
            return Response({"error": "ProjectBoards not found"}, status=status.HTTP_404_NOT_FOUND)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UpdateBoard(generics.CreateAPIView):
    serializer_class = SpringProjectBoardSerializer

    def update_project_score(self, project, subtract_score, new_score):
        project.score -= subtract_score
        project.score += new_score
        project.save()

    def create(self, request, *args, **kwargs):
        data = request.data
        project_board_id = kwargs.get('projectboard_id')

        try:
            project_board = SpringProjectBoard.objects.get(id=project_board_id)

            subtract_score = (
                (project_board.novelty * 0.4) +
                (project_board.technical_feasibility * 0.3) +
                (project_board.capability * 0.3)
            )

            prompt = (
                f"Please analyze the following data: {request.data.get('content', '')}. "
                f"Provide a detailed and critical rating (1-10) in numerical value(not in string) for the following aspects: "
                f"\n1. Novelty: Evaluate the originality of the data. "
                f"\n2. Technical Feasibility: Assess whether the data is technically sound and feasible. "
                f"\n3. Capability: Determine if the data demonstrates capability. "
                f"\nRatings below 5 should be considered for data that lacks composition, effort, verbosity, or information. "
                f"Be critical and practical when rating. "
                f"Include at least 2 specific sentences of advice for improvements (Recommendations) and "
                f"2 sentences of feedback on how the data is presented and structured, and what can be done to improve those aspects (Feedback) for each of the above aspects. "
                f"The output should be in the following JSON format: "
                f"\n'novelty': 'numerical rating', 'technical_feasibility': 'numerical rating', 'capability': 'numerical rating', "
                f"'recommendations_novelty': ['specific advice'], 'recommendations_technical_feasibility': ['advice'], "
                f"'recommendations_capability': ['specific advice'], 'feedback_novelty': ['specific feedback'], "
                f"'feedback_technical_feasibility': ['feedback'], 'feedback_capability': ['specific feedback']. "
                f"Ensure a fair and balanced assessment for each aspect."
            )
            client = OpenAI(api_key=os.environ.get("OPENAI_KEY", ""))
            message = [
                {"role": "user", "content": prompt}
            ]
            response = client.chat.completions.create(
                model="gpt-3.5-turbo", messages=message, temperature=0, max_tokens=1050
            )
            if response:
                try:
                    choices = response.choices
                    first_choice_content = response.choices[0].message.content
                    if choices:
                        gpt_response = first_choice_content
                        json_response = json.loads(gpt_response)
                        novelty = json_response.get("novelty", 0)
                        technical_feasibility = json_response.get(
                            "technical_feasibility", 0)
                        capability = json_response.get("capability", 0)
                        recommendations_novelty = json_response.get(
                            "recommendations_novelty", [])
                        recommendations_technical_feasibility = json_response.get(
                            "recommendations_technical_feasibility", [])
                        recommendations_capability = json_response.get(
                            "recommendations_capability", [])

                        feedback_novelty = json_response.get(
                            "feedback_novelty", [])
                        feedback_technical_feasibility = json_response.get(
                            "feedback_technical_feasibility", [])
                        feedback_capability = json_response.get(
                            "feedback_capability", [])

                        recommendations = '\n'.join([
                            "Novelty Recommendations:\n" +
                            '\n'.join(recommendations_novelty),
                            "\n\nTechnical Feasibility Recommendations:\n" +
                            '\n'.join(
                                recommendations_technical_feasibility),
                            "\n\nCapability Recommendations:\n" +
                            '\n'.join(recommendations_capability)
                        ])

                        feedback = '\n'.join([
                            "Novelty Feedback:\n" +
                            '\n'.join(feedback_novelty),
                            "\n\nTechnical Feasibility Feedback:\n" +
                            '\n'.join(feedback_technical_feasibility),
                            "\n\nCapability Feedback:\n" +
                            '\n'.join(feedback_capability)
                        ])
                        data = {
                            'title': data.get('title', ''),
                            'content': data.get('content', ''),
                            'novelty': novelty,
                            'technical_feasibility': technical_feasibility,
                            'capability': capability,
                            'recommendation': recommendations,
                            'feedback': feedback,
                            'project_id': project_board.project_id,
                            'template_id': project_board.template_id,
                            'board_id': project_board.board_id,
                        }

                        new_board_instance = SpringProjectBoard(**data)
                        new_board_instance.save()

                        project_instance = SpringProject.objects.get(
                            id=project_board.project_id.id)

                        new_score = (
                            (novelty * 0.4) +
                            (technical_feasibility * 0.3) + (capability * 0.3)
                        )
                        subtract_score = subtract_score

                        self.update_project_score(
                            project_instance, subtract_score, new_score)

                    else:
                        return Response({"error": "No response content or choices found"}, status=status.HTTP_400_BAD_REQUEST)
                except json.JSONDecodeError as json_error:
                    return Response({"error": f"Error decoding JSON response: {json_error}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            else:
                return Response({"error": response.text}, status=status.HTTP_400_BAD_REQUEST)

        except SpringProjectBoard.DoesNotExist:
            return Response({"error": "ProjectBoard not found"}, status=status.HTTP_404_NOT_FOUND)
        except requests.exceptions.RequestException as e:
            return Response({"error": f"An error occurred: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"id": new_board_instance.id}, status=status.HTTP_201_CREATED)


class DeleteProjectBoard(generics.DestroyAPIView):
    queryset = SpringProjectBoard.objects.all()
    serializer_class = SpringProjectBoardSerializer
    lookup_field = 'id'

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            subtract_score = (
                (instance.novelty * 0.4) +
                (instance.technical_feasibility * 0.3) +
                (instance.capability * 0.3)
            )
            instance.project_id.score -= subtract_score
            instance.project_id.save()
            SpringProjectBoard.objects.filter(
                board_id=instance.board_id).delete()

            return Response(status=status.HTTP_204_NO_CONTENT)
        except SpringProjectBoard.DoesNotExist:
            return Response({"error": "ProjectBoard not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
