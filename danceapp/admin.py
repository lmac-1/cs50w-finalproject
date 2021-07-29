from django.contrib import admin
from .models import User, Student, Teacher, Style, Video, Tag

# Register your models here.
admin.site.register(User)
admin.site.register(Student)
admin.site.register(Style)
admin.site.register(Tag)
admin.site.register(Teacher)
admin.site.register(Video)