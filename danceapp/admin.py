from django.contrib import admin
from .models import User, Student, Teacher, Style, Video, Notification, CalenaStep, Comment


# Register your models here.
admin.site.register(User)
admin.site.register(Student)
admin.site.register(Style)
admin.site.register(Teacher)
admin.site.register(Video)
admin.site.register(Notification)
admin.site.register(CalenaStep)
admin.site.register(Comment)