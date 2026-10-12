from rest_framework import serializers
from .models import PersonalGoal, GoalAction


class GoalActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = GoalAction
        fields = ['id', 'goal', 'description', 'action_date', 'is_completed', 'completed_at', 'created_at']
        read_only_fields = ['id', 'created_at']


class PersonalGoalSerializer(serializers.ModelSerializer):
    actions = GoalActionSerializer(many=True, read_only=True)

    class Meta:
        model = PersonalGoal
        fields = ['id', 'title', 'description', 'status', 'target_date', 'actions', 'created_at', 'completed_at']
        read_only_fields = ['id', 'created_at']

    def create(self, validated_data):
        user = self.context['request'].user
        return PersonalGoal.objects.create(user=user, **validated_data)
