from django.shortcuts import render
from rest_framework.generics import GenericAPIView, RetrieveAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import *
from rest_framework_simplejwt.tokens import RefreshToken # type: ignore
from rest_framework.response import Response
from rest_framework import status

class UserRegistrationAPIView(GenericAPIView):
    permission_classes = (AllowAny, )
    serializer_class=UserRegistrationSerializer
    usable_password = None
    def post(self, request, *args, **kwargs):
        
        serializer=self.get_serializer(data=request.data)
        print("data")
        print(serializer)
        serializer.is_valid(raise_exception=True)
        print("datax")
        user=serializer.save()
        print("dataxx")
        print(user)
        token=RefreshToken.for_user(user)
        data=serializer.data
        usable_password = None
        data["tokens"]={"refresh":str(token), "access": str(token.access_token)}
        return Response(data, status= status.HTTP_201_CREATED)
    

class UserLoginAPIView(GenericAPIView):
    permission_classes = (AllowAny, )
    serializer_class = UserLoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data= request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        serializer = CustomUserSerializer(user)
        token = RefreshToken.for_user(user)
        data = serializer.data
        data["tokens"] = {"refresh":str(token), "access":str(token.access_token)}
        return Response(data, status=status.HTTP_200_OK)
    
class UserLogoutAPIView(GenericAPIView):
    print("jestem")
    permission_classes=(IsAuthenticated,)
    
    
    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.data["refresh"]
            token= RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status= status.HTTP_400_BAD_REQUEST)
        
class UserInfoAPIView(RetrieveAPIView):
    permission_classes= (IsAuthenticated,)
    
    serializer_class = CustomUserSerializer

    def get_object(self):
        return self.request.user