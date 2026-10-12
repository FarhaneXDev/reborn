from django.urls import path
from .views import SummaryStatsView, ExportDataView, ResetDataView

urlpatterns = [
    path('summary/', SummaryStatsView.as_view(), name='stats_summary'),
    path('export/', ExportDataView.as_view(), name='account_export'),
    path('reset/', ResetDataView.as_view(), name='account_reset'),
]
