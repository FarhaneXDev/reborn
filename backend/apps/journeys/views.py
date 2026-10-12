from datetime import date
from django.utils import timezone
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import DailyMission, DailyProgress
from .serializers import DailyMissionSerializer, DailyProgressSerializer


class MissionListView(generics.ListAPIView):
    queryset = DailyMission.objects.filter(is_published=True).order_by('day_number')
    serializer_class = DailyMissionSerializer


class MissionDetailView(generics.RetrieveAPIView):
    queryset = DailyMission.objects.filter(is_published=True)
    serializer_class = DailyMissionSerializer


class TodayMissionView(APIView):
    def get(self, request):
        user = request.user
        today = date.today()
        profile = getattr(user, 'profile', None)

        if profile and profile.journey_start_date:
            day_diff = (today - profile.journey_start_date).days + 1
            day_number = max(1, min(day_diff, 30))
        else:
            day_number = 1

        mission = DailyMission.objects.filter(day_number=day_number, is_published=True).first()
        if not mission:
            mission = DailyMission.objects.filter(is_published=True).first()

        if not mission:
            return Response({'detail': 'Aucune mission configurée.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = DailyMissionSerializer(mission, context={'request': request})
        progress = DailyProgress.objects.filter(user=user, local_date=today).first()
        progress_data = DailyProgressSerializer(progress).data if progress else None

        return Response({
            'current_day_number': day_number,
            'today_date': today,
            'mission': serializer.data,
            'today_progress': progress_data
        })


class DailyProgressRecordView(APIView):
    """
    Enregistre ou met à jour le suivi / l'humeur pour une date donnée.
    """
    def post(self, request):
        local_date = request.data.get('local_date', str(date.today()))
        mission_id = request.data.get('mission_id')
        mood = request.data.get('mood')
        mood_intensity = request.data.get('mood_intensity')
        reflection = request.data.get('reflection', '')
        mission_status = request.data.get('mission_status', 'not_started')

        progress, created = DailyProgress.objects.get_or_create(
            user=request.user,
            local_date=local_date,
            defaults={
                'mission_id': mission_id,
                'mood': mood,
                'mood_intensity': mood_intensity,
                'reflection': reflection,
                'mission_status': mission_status,
                'completed_at': timezone.now() if mission_status == 'completed' else None
            }
        )

        if not created:
            if mission_id is not None:
                progress.mission_id = mission_id
            if mood is not None:
                progress.mood = mood
            if mood_intensity is not None:
                progress.mood_intensity = mood_intensity
            if reflection != '':
                progress.reflection = reflection
            if mission_status:
                progress.mission_status = mission_status
                if mission_status == 'completed' and not progress.completed_at:
                    progress.completed_at = timezone.now()
                elif mission_status != 'completed':
                    progress.completed_at = None
            progress.save()

        return Response(DailyProgressSerializer(progress).data, status=status.HTTP_200_OK)
