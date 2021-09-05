from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("register", views.register_student, name="register_student"),
    path("login", views.login_view, name="login"),
    path("video/<int:video_id>", views.video, name="video"),
    path("logout", views.logout_view, name="logout"),
    path("newvideo", views.new_video, name="new_video"),
    path("add_comment/<int:video_id>", views.add_comment, name="add_comment"),
    path("notifications", views.notifications, name="notifications"),
    path("reset_notifications_counter", views.reset_notifications_counter, name="reset_notifications_counter"),  
    path("read_notification/<int:notification_id>", views.read_notification, name="read_notification"),
    path("read_all_notifications", views.read_all_notifications, name="read_all_notifications"),
    path("update_favourites/<int:video_id>", views.update_favourites, name="update_favourites"),
    path("delete_comment/<int:comment_id>", views.delete_comment, name="delete_comment"),
    path("saved_videos", views.saved_videos, name="saved_videos"),

    # API Routes
    path("videos", views.videos, name ="videos"),
    path("add_step", views.add_step, name="add_step")
]