from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    
    # Account management
    path("register", views.register_student, name="register_student"),
    path("register_teacher", views.register_teacher, name="register_teacher"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("change_password", views.change_password, name="change_password"),

    # Teacher only
    path("new_video", views.new_video, name="new_video"),

    # Student only
    path("saved_videos", views.saved_videos, name="saved_videos"),

    # Notifications
    path("notifications", views.notifications, name="notifications"),

    # Video page
    path("video/<int:video_id>", views.video, name="video"),
    path("add_comment/<int:video_id>", views.add_comment, name="add_comment"),

    # API Routes (returning JSON responses)
    path("videos/<str:mode>", views.videos, name ="videos"),
    path("add_step", views.add_step, name="add_step"),
    path("update_favourites/<int:video_id>", views.update_favourites, name="update_favourites"),
    path("delete_comment/<int:comment_id>", views.delete_comment, name="delete_comment"),
    path("read_notification/<int:notification_id>", views.read_notification, name="read_notification"),
    path("read_all_notifications", views.read_all_notifications, name="read_all_notifications"),
    path("reset_notifications_counter", views.reset_notifications_counter, name="reset_notifications_counter")
]