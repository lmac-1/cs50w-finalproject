from django.http import HttpResponseRedirect
from django.contrib import messages
from django.db import IntegrityError
from django.contrib.auth import login

from .models import Video, Student, User, Teacher


def get_user_videos(request):

# Admin and teachers can see all videos
    if request.user.is_staff or request.user.is_teacher:
        return Video.objects.all()
    # Students can only see videos that teachers have given them access to
    elif request.user.is_student:
        try: 
            student = Student.objects.get(pk=request.user.id)
            return student.videos.all()
        except Student.DoesNotExist:
            return ''
    else:
        return ''

def register(request, account_type):
    username = request.POST["username"]
    email = request.POST["email"]
    first_name = request.POST["first_name"]
    last_name = request.POST["last_name"]
    password = request.POST["password"]
    confirmation = request.POST["confirmation"]
    
    # Ensure password matches confirmation
    if password != confirmation:
        messages.error(request, 'Passwords must match.')
        if account_type == 'student':
            return "register_student"
        # Teacher accounts
        return "register_teacher"

    # Attempt to create new user
    try:
        # Creates user
        user = User.objects.create_user(username, email, password)
        # Saves first name, last name and student flag
        user.first_name = first_name
        user.last_name = last_name

        if account_type == "student":
            user.is_student = True
        else:
            user.is_teacher = True
        
        # Saves user
        user.save()

        # Create student or teacher instance of user
        if account_type == "student":
            Student.objects.create(user=user)
        else:
            Teacher.objects.create(user=user)

    # For cases where username already taken
    except IntegrityError:
        messages.error(request, 'Username already taken.')
        if account_type == "student":
            return "register_student"
        # Teacher accounts
        return "register_teacher"

    login(request, user)
    return "index"