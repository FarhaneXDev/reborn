from rest_framework import serializers
from .models import User, UserProfile


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['id', 'timezone', 'journey_start_date', 'no_contact_start_date', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'created_at', 'profile']
        read_only_fields = ['id', 'created_at', 'profile']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    timezone = serializers.CharField(required=False, default='Africa/Porto-Novo')
    no_contact_start_date = serializers.DateField(required=False, allow_null=True)

    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'timezone', 'no_contact_start_date']

    def create(self, validated_data):
        tz_pref = validated_data.pop('timezone', 'Africa/Porto-Novo')
        nc_date = validated_data.pop('no_contact_start_date', None)
        password = validated_data.pop('password')

        user = User.objects.create_user(password=password, **validated_data)
        UserProfile.objects.create(user=user, timezone=tz_pref, no_contact_start_date=nc_date)
        return user
