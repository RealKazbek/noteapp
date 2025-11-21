from rest_framework import viewsets, generics, permissions, filters
from django.contrib.auth.models import User
from .models import Task
from .serializers import TaskSerializer, UserSerializer

class UserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    authentication_classes = [] 
    permission_classes = [permissions.AllowAny]


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    filter_backends = [
        filters.SearchFilter,   
        filters.OrderingFilter  
    ]
    
    search_fields = ['title', 'description']
    
    ordering_fields = ['created_at', 'title', 'is_done']

    def get_queryset(self):
        return self.request.user.tasks.all().order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)