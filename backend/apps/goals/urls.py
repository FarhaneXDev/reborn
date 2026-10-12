from django.urls import path
from .views import GoalListCreateView, GoalDetailView, GoalActionCreateView, GoalActionDetailView

urlpatterns = [
    path('', GoalListCreateView.as_view(), name='goal_list_create'),
    path('<uuid:pk>/', GoalDetailView.as_view(), name='goal_detail'),
    path('<uuid:goal_id>/actions/', GoalActionCreateView.as_view(), name='goal_action_create'),
    path('<uuid:goal_id>/actions/<uuid:action_id>/', GoalActionDetailView.as_view(), name='goal_action_detail'),
]
