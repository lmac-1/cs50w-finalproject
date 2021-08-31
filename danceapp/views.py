import json
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect
from django.http import HttpResponse
from django.db import IntegrityError
from django.http import JsonResponse
from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt

from .models import User, Student, Video, Teacher, Style, Notification, CalenaStep
from .forms import NewVideoForm, CommentForm
from . import util

@login_required(login_url='/login')
def index(request):
    # Gets available videos for given user
    videos = util.get_user_videos(request)

    # Needed for filter dropdowns
    teachers = Teacher.objects.all()
    styles = Style.objects.all()

    return render(request, "danceapp/index.html", {
        "videos": videos,
        "teachers": teachers,
        "styles": styles,
        "levels": Video.LEVELS,
        "steps": CalenaStep.objects.all()
    })

# API route
# TODO check this when not logged in and see what happens
@login_required
def videos(request):
    videos = util.get_user_videos(request)
    return JsonResponse([video.serialize() for video in videos], safe=False)

@login_required
def new_video(request):
    # TODO - validation that teacher is doing request
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
                
                user_student = student.user
                message = f"{request.user.first_name} uploaded a new video: {form.cleaned_data.get('title')}"
                """ message = f"You have a new video available: {form.cleaned_data.get('title')}" """
                
                # Adds a notification to notify them of the new video
                notification = Notification(video=new_video, user=user_student, author=request.user, message=message)
                notification.save()

                # Increments the students total unread notifications by 1
                user_student.unread_notifications += 1
                user_student.save()

            # Redirect to listing page 
            return HttpResponseRedirect(reverse("index",))
    else:
        if request.user.is_teacher or request.user.is_staff:
            return render(request, "danceapp/newvideo.html", {
                "form": NewVideoForm()
            })
        else:
            return render(request, "danceapp/error.html", {
                "message": "You do not have permission to see this page."
            })

# All notifications
def notifications(request):
    return render(request, "danceapp/notifications.html")

@login_required
@csrf_exempt
def reset_notifications(request):
    try:
        user = User.objects.get(pk=request.user.pk)
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found."}, status=404)
    
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request."}, status=404)
    else: 
        user.unread_notifications = 0
        user.save()

        return JsonResponse({"message": "Notifications reset"}, status=201)

@login_required
@csrf_exempt
def read_notification(request, notification_id):
    try: 
        notification = Notification.objects.get(pk=notification_id)
        
    except Notification.DoesNotExist:
        return JsonResponse({"error": "Notification not found"}, status=404)
    
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request."}, status=404)
    else:
        notification.read = True
        notification.save()

        return JsonResponse({"message":"Success"}, status=201)

@login_required
@csrf_exempt
def read_all_notifications(request):
    # Get user from request
    try:
        user = User.objects.get(pk=request.user.pk)
    except User.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=404)
    
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request."}, status=404)
    else:
        # Find unread notifications for user
        unread_notifications = request.user.notifications.all().filter(read=False)

        # Iterate through unread notifications and mark as read
        for notification in unread_notifications:
            notification.read = True
            notification.save()

        return JsonResponse({"message":"Success"}, status=201)


# [TODO] Add login required + test
@login_required
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

@login_required
@csrf_exempt
def update_favourites(request, video_id):
    
    # Adding to favourites must be via POST
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    
    user = request.user

    if user.is_student != True:
        return JsonResponse({"error": "Only students can save videos"}, status=400)

    # Saves student instance of user
    user = request.user.student

    # Finds video
    try:
        video = Video.objects.get(pk = video_id)
    except Video.DoesNotExist:
        return JsonResponse({"error": "Video not found"}, status=404)

    # If the video is in user's favourites, remove it
    if (user.favourites.filter(pk=video_id).exists()):
        video.saved_by.remove(user)
        in_favourites = False
    # If the video is not in favourites, add it
    else: 
        video.saved_by.add(user)
        in_favourites = True

    # We pass back the in_favourites parameter to build logic to update the page
    return JsonResponse({"in_favourites": in_favourites}, status=200)

@login_required
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
            # messages.success(request, 'Comment successfully added.')

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
                notification = Notification(video=video, user=user_teacher, author=request.user, message=message)
                notification.save()

                # Increments teachers total unread notifications by 1
                user_teacher.unread_notifications += 1
                user_teacher.save()

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
        if request.user.is_authenticated:
            return HttpResponseRedirect(reverse("index"))
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