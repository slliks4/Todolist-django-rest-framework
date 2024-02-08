from django.shortcuts import render
from django.http import JsonResponse
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import Task_serializer
from to_do_list .models import Task

@api_view(['GET'])
def api_overview(request):
    api_urls = {
        'List':'/task_list/',
        'Detail_view':'/task_detail/<str:pk>/',
        'Create':'/task_create/',
        'Update':'/task_update/<str:pk>/',
        'Delete':'/task_delete/<str:pk>/',
    }
    return Response(api_urls)

@api_view(['GET'])
def task_list(request):
    tasks = Task.objects.all()
    serializer = Task_serializer(tasks, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def task_detail(request,pk):
    tasks = Task.objects.get(id=pk)
    serializer = Task_serializer(tasks, many=False)
    return Response(serializer.data)

@api_view(['POST'])
def task_create(request):
    serializer = Task_serializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)

@api_view(['POST'])
def task_update(request,pk):
    task = Task.objects.get(id=pk)
    serializer = Task_serializer(instance=task, data=request.data)
    if serializer.is_valid():
        serializer.save()
    
    return Response(serializer.data)

@api_view(['DELETE'])
def task_delete(request,pk):
    tasks = Task.objects.get(id=pk)
    tasks.delete()

    return Response("items successfully deleted")