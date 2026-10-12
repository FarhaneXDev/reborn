from django.urls import path
from .views import MissionListView, MissionDetailView, TodayMissionView, DailyProgressRecordView

urlpatterns = [
    path('missions/', MissionListView.as_view(), name='mission_list'),
    path('missions/today/', TodayMissionView.as_view(), name='mission_today'),
    path('missions/<uuid:pk>/', MissionDetailView.as_view(), name='mission_detail'),
    path('progress/', DailyProgressRecordView.as_view(), name='progress_record'),
]
