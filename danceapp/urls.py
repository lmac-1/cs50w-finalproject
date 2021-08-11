from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("register", views.register_student, name="register_student"),
    path("login", views.login_view, name="login"),
    path("video/<int:video_id>", views.video, name="video"),
    path("logout", views.logout_view, name="logout"),
    path("newvideo", views.new_video, name="new_video"),

    # API Routes
    path("videos", views.videos, name ="videos")
]