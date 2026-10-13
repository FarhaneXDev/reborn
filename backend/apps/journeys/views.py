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

        # Progression spécifique de cette mission pour l'utilisateur
        progress = DailyProgress.objects.filter(user=user, mission=mission).first()
        progress_data = DailyProgressSerializer(progress).data if progress else None

        # Humeur du jour
        today_mood_entry = DailyProgress.objects.filter(
            user=user, local_date=today
        ).exclude(mood__isnull=True).exclude(mood='').first()

        today_mood_data = {
            'mood': today_mood_entry.mood if today_mood_entry else None,
            'mood_intensity': today_mood_entry.mood_intensity if today_mood_entry else None,
            'reflection': today_mood_entry.reflection if today_mood_entry else '',
        }

        return Response({
            'current_day_number': day_number,
            'today_date': today,
            'mission': serializer.data,
            'today_progress': progress_data,
            'today_mood': today_mood_data,
        })


class DailyProgressRecordView(APIView):
    """
    Enregistre ou met à jour la progression d'une mission ou l'humeur.
    """
    def post(self, request):
        local_date_raw = request.data.get('local_date')
        try:
            local_date = date.fromisoformat(local_date_raw) if local_date_raw else date.today()
        except (ValueError, TypeError):
            local_date = date.today()

        mission_id = request.data.get('mission_id')
        mood = request.data.get('mood')
        mood_intensity = request.data.get('mood_intensity')
        reflection = request.data.get('reflection', '')
        mission_status = request.data.get('mission_status')

        # 1. Si un mission_id est fourni -> Progression rattachée à cette mission
        if mission_id:
            progress = DailyProgress.objects.filter(user=request.user, mission_id=mission_id).first()
            if not progress:
                progress = DailyProgress.objects.create(
                    user=request.user,
                    mission_id=mission_id,
                    local_date=local_date,
                    mission_status=mission_status or 'not_started',
                    completed_at=timezone.now() if mission_status == 'completed' else None,
                    reflection=reflection,
                )
            else:
                if mission_status:
                    progress.mission_status = mission_status
                    if mission_status == 'completed' and not progress.completed_at:
                        progress.completed_at = timezone.now()
                    elif mission_status != 'completed':
                        progress.completed_at = None
                if reflection != '':
                    progress.reflection = reflection
                progress.local_date = local_date
                progress.save()

            return Response(DailyProgressSerializer(progress).data, status=status.HTTP_200_OK)

        # 2. Si seule l'humeur est fournie -> Enregistrement de l'humeur du jour
        if mood:
            progress = DailyProgress.objects.filter(
                user=request.user, local_date=local_date
            ).exclude(mood__isnull=True).exclude(mood='').first()

            if not progress:
                progress = DailyProgress.objects.create(
                    user=request.user,
                    local_date=local_date,
                    mood=mood,
                    mood_intensity=mood_intensity,
                    reflection=reflection,
                )
            else:
                progress.mood = mood
                if mood_intensity is not None:
                    progress.mood_intensity = mood_intensity
                if reflection != '':
                    progress.reflection = reflection
                progress.save()

            return Response(DailyProgressSerializer(progress).data, status=status.HTTP_200_OK)

        return Response({'detail': 'Aucune donnée à enregistrer.'}, status=status.HTTP_400_BAD_REQUEST)
