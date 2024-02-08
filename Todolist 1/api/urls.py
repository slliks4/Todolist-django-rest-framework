from .import views
from django.urls import path

urlpatterns = [
    path('', views.api_overview, name='api_overview'),
    path('task_list', views.task_list, name = "task_list"),
    path('task_detail/<str:pk>/', views.task_detail, name = "task_detail"),
    path('task_create', views.task_create, name = "task_create"),
    path('task_update/<str:pk>/', views.task_update, name = "task_update"),
    path('task_delete/<str:pk>/', views.task_delete, name = "task_delete"),
]
