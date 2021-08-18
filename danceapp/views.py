from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect
from django.http import HttpResponse
from django.db import IntegrityError
from django.http import JsonResponse
from django.contrib import messages

from .models import User, Student, Video, Teacher, Style, Notification
from .forms import NewVideoForm, CommentForm
from . import util

@login_required(login_url='/login')
def index(request):

    videos = util.get_user_videos(request)

    teachers = Teacher.objects.all()
    styles = Style.objects.all()

    return render(request, "danceapp/index.html", {
        "videos": videos,
        "teachers": teachers,
        "styles": styles,
        "levels": Video.LEVELS
    })

def videos(request):
    videos = util.get_user_videos(request)
    return JsonResponse([video.serialize() for video in videos], safe=False)

def new_video(request):
    if request.method == 'POST':
        # Take in the data the user submitted and save it as form
        form = NewVideoForm(request.POST)

        # Check if form data is valid (server-side)
        if form.is_valid():
            # Sets author field in new listing
            form.instance.author = request.user
            # Saves new listing
            new_video = form.save()
            
            # Gets students from form
            students = form.cleaned_data.get('student_access')

            # Iterates through students
            for student in students:
                user = student.user
                message = f"You have a new video available: {form.cleaned_data.get('title')}"
                # Adds a notification to notify them of the new video
                notification = Notification(video=new_video, user=user, message=message)
                notification.save()

            # Redirect to listing page 
            return HttpResponseRedirect(reverse("index",))
    else:
        return render(request, "danceapp/newvideo.html", {
            "form": NewVideoForm()
        })

# [TODO] Add login required
def video(request, video_id):
    try: 
        video = Video.objects.get(pk = video_id)
        comments = video.comments.all()
    except Video.DoesNotExist:
        # [TODO] Improve error handling
        return HttpResponse("This video doesn't exist")
    
    if request.method == "GET":
        return render(request, "danceapp/video.html", {
            "video": video,
            "comment_form": CommentForm(),
            "comments": comments
        })

def add_comment(request, video_id):
    if request.method == "POST": 
        # [TODO] - error handling try/catch?
        video = Video.objects.get(pk = video_id)
        teachers = video.teacher.all()

        # Take in the data the user submitted and save it as form
        form = CommentForm(request.POST)

        # Check if form data is valid (server-side)
        if form.is_valid():
            
            # Sets item and user fields
            form.instance.video = video
            form.instance.user = request.user

            # Saves comment to database
            form.save()

            # Success message that we will show in the template
            messages.success(request, 'Comment successfully added.')

            for teacher in teachers:
                # Gets user for teacher of the video
                user_teacher = teacher.user
                
                # Works out name to show in notification text
                if request.user.first_name != '':
                    message_name = request.user.first_name
                else:
                    message_name = request.user.username
                
                # Creates notification message
                message = f"{message_name} added a new comment on your video {video.title}"
                
                # Adds a notification to notify them of the new video
                notification = Notification(video=video, user=user_teacher, message=message)
                notification.save()

            # Reloads page
            return HttpResponseRedirect(reverse("video", args=(video_id,)))

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)
        
        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            messages.error(request, 'Invalid username and/or password')
            return HttpResponseRedirect(reverse("login"))
    else:
        return render(request, "danceapp/login.html")

# Register a new student (teachers can only be added via admin Django view)
def register_student(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]
        first_name = request.POST["first_name"]
        last_name = request.POST["last_name"]
        account_type = request.POST["account_type"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "danceapp/register.html", {
                "message": "Passwords must match."
            })

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

            if account_type == "student":
                # Creates student instance of user
                student = Student.objects.create(user=user)
            else:
                teacher = Teacher.objects.create(user=user)

        except IntegrityError:
            messages.error(request, 'Username already taken.')
            return HttpResponseRedirect(reverse("register_student"))

        login(request, user)
        return HttpResponseRedirect(reverse("index"))

    else:
        return render(request, "danceapp/register.html")

def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("login"))