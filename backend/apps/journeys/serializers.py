from rest_framework import serializers
from .models import DailyMission, DailyProgress


class DailyMissionSerializer(serializers.ModelSerializer):
    user_progress = serializers.SerializerMethodField()

    class Meta:
        model = DailyMission
        fields = [
            'id', 'day_number', 'theme', 'title', 'introduction',
            'reflection_prompt', 'exercise', 'main_action', 'gentle_version',
            'is_published', 'user_progress'
        ]

    def get_user_progress(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return None
        progress = DailyProgress.objects.filter(user=request.user, mission=obj).order_by('-updated_at').first()
        if not progress:
            return None
        return {
            'id': progress.id,
            'local_date': progress.local_date,
            'mood': progress.mood,
            'mood_intensity': progress.mood_intensity,
            'reflection': progress.reflection,
            'mission_status': progress.mission_status,
            'completed_at': progress.completed_at
        }


class DailyProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyProgress
        fields = [
            'id', 'mission', 'local_date', 'mood', 'mood_intensity',
            'reflection', 'mission_status', 'completed_at', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate(self, attrs):
        user = self.context['request'].user
        local_date = attrs.get('local_date')
        if self.instance is None and local_date:
            if DailyProgress.objects.filter(user=user, local_date=local_date).exists():
                raise serializers.ValidationError({"local_date": "Un suivi existe déjà pour cette date."})
        return attrs
