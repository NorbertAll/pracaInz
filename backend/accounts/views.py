from django.shortcuts import render
from rest_framework.generics import GenericAPIView, RetrieveAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import *
from rest_framework_simplejwt.tokens import RefreshToken # type: ignore
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail
from rest_framework.views import APIView
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_decode

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
class PasswordResetView(APIView):
    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'error': 'Email jest wymagany'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return Response({'error': 'Nie znaleziono użytkownika'}, status=status.HTTP_404_NOT_FOUND)

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)

        reset_link = f"http://localhost:3000/reset/password/confirm/{uid}/{token}/"

        send_mail(
            'Reset hasła',
            f'Kliknij poniższy link, aby zresetować hasło do Platformy Quizowo Egzamninacyjnej :\n\n{reset_link} \n\n Jeśli nie prosiłeś o Zmianę hasła Nie klikaj Linku \n\n Pozdrawiam Norbert Gutkowski',
            'noreply@twojadomena.com',
            [email],
            fail_silently=False,
        )

        return Response({'message': 'Link resetujący został wysłany'}, status=status.HTTP_200_OK)
class PasswordResetConfirmView(APIView):
    def post(self, request, uidb64, token):
        password = request.data.get("password")
        if not password:
            return Response({"error": "Nowe hasło jest wymagane"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = CustomUser.objects.get(pk=uid)
        except (CustomUser.DoesNotExist, ValueError, TypeError, OverflowError):
            return Response({"error": "Nieprawidłowy link resetujący"}, status=status.HTTP_400_BAD_REQUEST)

        if not default_token_generator.check_token(user, token):
            return Response({"error": "Token jest nieprawidłowy lub wygasł"}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(password)
        user.save()

        return Response({"message": "Hasło zostało zaktualizowane"}, status=status.HTTP_200_OK)