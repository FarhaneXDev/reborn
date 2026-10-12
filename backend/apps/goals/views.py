from django.utils import timezone
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import PersonalGoal, GoalAction
from .serializers import PersonalGoalSerializer, GoalActionSerializer


class GoalListCreateView(generics.ListCreateAPIView):
    serializer_class = PersonalGoalSerializer

    def get_queryset(self):
        return PersonalGoal.objects.filter(user=self.request.user)


class GoalDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PersonalGoalSerializer

    def get_queryset(self):
        return PersonalGoal.objects.filter(user=self.request.user)


class GoalActionCreateView(APIView):
    def post(self, request, goal_id):
        try:
            goal = PersonalGoal.objects.get(id=goal_id, user=request.user)
        except PersonalGoal.DoesNotExist:
            return Response({'detail': 'Objectif non trouvé.'}, status=status.HTTP_404_NOT_FOUND)

        description = request.data.get('description')
        if not description:
            return Response({'description': 'Ce champ est requis.'}, status=status.HTTP_400_BAD_REQUEST)

        action_date = request.data.get('action_date')

        action = GoalAction.objects.create(
            goal=goal,
            user=request.user,
            description=description,
            action_date=action_date
        )
        return Response(GoalActionSerializer(action).data, status=status.HTTP_201_CREATED)


class GoalActionDetailView(APIView):
    def patch(self, request, goal_id, action_id):
        try:
            action = GoalAction.objects.get(id=action_id, goal_id=goal_id, user=request.user)
        except GoalAction.DoesNotExist:
            return Response({'detail': 'Action non trouvée.'}, status=status.HTTP_404_NOT_FOUND)

        if 'is_completed' in request.data:
            action.is_completed = request.data['is_completed']
            action.completed_at = timezone.now() if action.is_completed else None

        if 'description' in request.data:
            action.description = request.data['description']

        if 'action_date' in request.data:
            action.action_date = request.data['action_date']

        action.save()
        return Response(GoalActionSerializer(action).data)

    def delete(self, request, goal_id, action_id):
        try:
            action = GoalAction.objects.get(id=action_id, goal_id=goal_id, user=request.user)
        except GoalAction.DoesNotExist:
            return Response({'detail': 'Action non trouvée.'}, status=status.HTTP_404_NOT_FOUND)

        action.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
