from datetime import date, timedelta
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from apps.journeys.models import DailyProgress
from apps.journal.models import JournalEntry
from apps.goals.models import PersonalGoal, GoalAction
from apps.accounts.serializers import UserSerializer
from apps.journeys.serializers import DailyProgressSerializer
from apps.journal.serializers import JournalEntrySerializer
from apps.goals.serializers import PersonalGoalSerializer


class SummaryStatsView(APIView):
    def get(self, request):
        user = request.user
        period = request.query_params.get('period', '7d')
        days = 30 if period == '30d' else (90 if period == '90d' else 7)

        since_date = date.today() - timedelta(days=days)

        # Suivi humeur et missions
        progresses = DailyProgress.objects.filter(user=user, local_date__gte=since_date).order_by('local_date')
        mood_entries_count = progresses.exclude(mood__isnull=True).exclude(mood='').count()
        completed_missions_count = progresses.filter(mission_status='completed').count()

        # Actions terminées
        completed_actions_count = GoalAction.objects.filter(user=user, is_completed=True).count()
        active_goals_count = PersonalGoal.objects.filter(user=user, status='active').count()

        # Série temporelle humeur pour le graphique
        mood_map = {
            'very_low': 1,
            'low': 2,
            'neutral': 3,
            'good': 4,
            'very_good': 5
        }
        mood_trend = []
        for p in progresses:
            if p.mood:
                mood_trend.append({
                    'date': str(p.local_date),
                    'mood': p.mood,
                    'score': mood_map.get(p.mood, 3),
                    'intensity': p.mood_intensity
                })

        # Bilan hebdomadaire factuel et bienveillant
        week_ago = date.today() - timedelta(days=7)
        week_moods = DailyProgress.objects.filter(user=user, local_date__gte=week_ago).exclude(mood__isnull=True).exclude(mood='').count()
        week_missions = DailyProgress.objects.filter(user=user, local_date__gte=week_ago, mission_status='completed').count()
        week_actions = GoalAction.objects.filter(user=user, is_completed=True, completed_at__date__gte=week_ago).count()

        weekly_message = (
            f"Tu as renseigné ton humeur {week_moods} jour{'s' if week_moods > 1 else ''} cette semaine. "
            f"Tu as terminé {week_missions} mission{'s' if week_missions > 1 else ''} "
            f"et réalisé {week_actions} action{'s' if week_actions > 1 else ''} personnelle{'s' if week_actions > 1 else ''}."
        )

        return Response({
            'period': period,
            'mood_entries_count': mood_entries_count,
            'completed_missions_count': completed_missions_count,
            'completed_actions_count': completed_actions_count,
            'active_goals_count': active_goals_count,
            'mood_trend': mood_trend,
            'weekly_summary': weekly_message
        })


class ExportDataView(APIView):
    def get(self, request):
        user = request.user
        progresses = DailyProgress.objects.filter(user=user)
        journal = JournalEntry.objects.filter(user=user)
        goals = PersonalGoal.objects.filter(user=user)

        data = {
            'user': UserSerializer(user).data,
            'progress': DailyProgressSerializer(progresses, many=True).data,
            'journal_entries': JournalEntrySerializer(journal, many=True).data,
            'goals': PersonalGoalSerializer(goals, many=True).data,
            'export_date': str(date.today())
        }
        return Response(data)


class ResetDataView(APIView):
    def delete(self, request):
        user = request.user
        # Suppression des données personnelles
        DailyProgress.objects.filter(user=user).delete()
        JournalEntry.objects.filter(user=user).delete()
        PersonalGoal.objects.filter(user=user).delete()
        GoalAction.objects.filter(user=user).delete()

        return Response({'message': 'Toutes les données ont été réinitialisées avec succès.'}, status=status.HTTP_200_OK)
