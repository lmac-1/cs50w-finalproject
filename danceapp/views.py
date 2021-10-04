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
from django.contrib.auth import update_session_auth_hash
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt

from .models import User, Student, Video, Teacher, Style, Notification, CalenaStep, Comment
from .forms import NewVideoForm, CommentForm, PasswordChangeForm
from . import util

@login_required(login_url='/login')
def index(request):

    # Needed for filter dropdowns
    teachers = Teacher.objects.all()
    styles = Style.objects.all()

    return render(request, "danceapp/index.html", {
        "teachers": teachers,
        "styles": styles,
        "levels": Video.LEVELS,
        "steps": CalenaStep.objects.all()
    })

# API route
@login_required(login_url='/login')
def videos(request, mode):
    
    try:
        user = User.objects.get(pk=request.user.pk)
    except User.DoesNotExist:
        return JsonResponse({"error": "User does not exist."}, status=400)

    # Used by index page
    if mode == "all":
        videos = util.get_user_videos(request)
    
    # Used by saved video page
    elif mode == "saved":
        if user.is_student == True:
            user = user.student
            videos = user.favourites.all()
        else:
            return JsonResponse({"error": "Only student profiles can make this request."}, status=400)
    else:
        return JsonResponse({"error": "You must set mode to \"saved\" or \"all\"."}, status=400)
            
    return JsonResponse([video.serialize() for video in videos], safe=False)

@login_required(login_url='/login')
@csrf_exempt
def add_step(request):
    
    if request.method != 'POST':
        return JsonResponse({"error": "POST request required."}, status=400)

    current_steps = CalenaStep.objects.values_list('name', flat=True).order_by('name')

    # Gets data from POST request and pulls out step name
    data = json.loads(request.body)
    step_name = data.get("step_name")
    # We convert the provided step name to lower and then capitalize it to allow consistency
    step_name = step_name.lower()
    step_name = step_name.capitalize()

    # Cannot add a blank step name to the database
    if len(step_name) == 0:
        error_for_page_html = "You cannot submit a step with no name. Please try again."
        return JsonResponse({"error": error_for_page_html}, status=400)
    
    if step_name in current_steps:
        error_for_page_html = "This step is already saved in the database, please add a different step."
        return JsonResponse({"error": error_for_page_html}, status=400)

    try: 
        new_step = CalenaStep(name=step_name)
        new_step.save()
    except:
        return JsonResponse({"error": "An error has occurred when attempting to add to the database."}, status=400)

    return JsonResponse({"message": "Step added successfully", "name": step_name, "value": new_step.id}, status=201)

def saved_videos(request):

    if request.user.is_student == False:
        return render(request, "danceapp/error.html", {
                "message": "Sorry, only student profiles can see this page."
            })

    return render(request, "danceapp/saved_videos.html")

@login_required(login_url='/login')
def new_video(request):
    
    if request.method == 'POST':
        
        if request.user.is_student == True:
            return render(request, "danceapp/error.html", {
                "message": "Sorry, only teacher or admin profiles can add new videos."
            })
            
        # Take in the data the user submitted and save it as form
        form = NewVideoForm(request.POST)
        
        # Checks if form data is valid (server-side)
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

                # Works out name to show in notification text
                if request.user.first_name != '':
                    message_name = request.user.first_name
                else:
                    message_name = request.user.username

                message = f"{message_name} uploaded a new video: {form.cleaned_data.get('title')}"
                
                # Adds a notification to notify them of the new video
                notification = Notification(video=new_video, user=user_student, author=request.user, message=message)
                notification.save()

                # Increments the students total unread notifications by 1
                user_student.unread_notifications += 1
                user_student.save()

            # Redirect to listing page 
            return HttpResponseRedirect(reverse("index",))
        else:
            return render(request, "danceapp/error.html", {
                "message": "An error has occurred. Please try again."
            })
    else:
        if request.user.is_teacher or request.user.is_staff:
            try:
                YOUTUBE_API_KEY = settings.YOUTUBE_API_KEY
            except:
                YOUTUBE_API_KEY = ''
                pass
            
            return render(request, "danceapp/newvideo.html", {
                "form": NewVideoForm(),
                "YOUTUBE_API_KEY": YOUTUBE_API_KEY
            })
        else:
            return render(request, "danceapp/error.html", {
                "message": "You do not have permission to see this page."
            })

# All notifications
def notifications(request):
    return render(request, "danceapp/notifications.html")

@login_required(login_url='/login')
@csrf_exempt
def reset_notifications_counter(request):
    try:
        user = User.objects.get(pk=request.user.pk)
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found."}, status=404)
    
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request. POST request required."}, status=404)
    else: 
        user.unread_notifications = 0
        user.save()

        return JsonResponse({"message": "Notifications reset"}, status=201)

@login_required(login_url='/login')
@csrf_exempt
def read_notification(request, notification_id):
    try: 
        notification = Notification.objects.get(pk=notification_id)
        
    except Notification.DoesNotExist:
        return JsonResponse({"error": "Notification not found"}, status=404)
    
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request. POST request required."}, status=404)
    else:
        notification.read = True
        notification.save()

        return JsonResponse({"message":"Success"}, status=201)

@login_required(login_url='/login')
@csrf_exempt
def read_all_notifications(request):
    # Get user from request
    try:
        user = User.objects.get(pk=request.user.pk)
    except User.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=404)
    
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request. POST request required."}, status=404)
    else:
        # Find unread notifications for user
        unread_notifications = request.user.notifications.all().filter(read=False)

        # Iterate through unread notifications and mark as read
        for notification in unread_notifications:
            notification.read = True
            notification.save()

        return JsonResponse({"message":"Success"}, status=201)


@login_required(login_url='/login')
def video(request, video_id):
    if request.method != "GET":
        return render(request, "danceapp/error.html", {
                "message": "An error has occurred."
            })
    try: 
        video = Video.objects.get(pk = video_id)
        comments = video.comments.all()
        
    except Video.DoesNotExist:
        return render(request, "danceapp/error.html", {
                "message": "An error has occurred. This video doesn't exist."
            })
    
    return render(request, "danceapp/video.html", {
        "video": video,
        "comment_form": CommentForm(),
        "comments": comments
    })

@login_required(login_url='/login')
@csrf_exempt
def update_favourites(request, video_id):
    
    # Adding to favourites must be via POST
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    
    # Find user
    try:
        user = request.user
    except User.DoesNotExist:
        return JsonResponse({"error": "User cannot be found"}, status=400)

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

@login_required(login_url='/login')
def add_comment(request, video_id):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request. POST request required"}, code=400)
    
    try:
        video = Video.objects.get(pk = video_id)
        teachers = video.teacher.all()
    except Video.DoesNotExist:
        return JsonResponse({"error": "Video cannot be found"}, code=400)

    # Take in the data the user submitted and save it as form
    form = CommentForm(request.POST)

    # Check if form data is valid (server-side)
    if form.is_valid():
        
        # Sets item and user fields
        form.instance.video = video
        form.instance.author = request.user

        # Saves comment to database
        form.save()

        # Raises notification for teachers of uploaded video
        for teacher in teachers:
            
            # Gets user for teacher of the video
            user_teacher = teacher.user

            # Don't raise notifications for teacher if they are the one commenting
            if user_teacher == request.user:
                break
            
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
    # Shows if form data invalid
    else:
        return render(request, "danceapp/error.html", {
                "message": "Sorry, an error has occurred. Please try again."
            })

@csrf_exempt
def delete_comment(request, comment_id):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "User must be logged in."}, status=400)

    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    
    try: 
        comment = Comment.objects.get(pk=comment_id)
    except Comment.DoesNotExist:
        return JsonResponse({"error": "Comment not found."}, status=400)

    # We only delete comments for users if they are the author
    if comment.author == request.user:
        comment.delete()
        deleted = True
    else:
        deleted = False

    total_comments = comment.video.comments.all().count()

    return JsonResponse({"deleted": deleted, "total_comments": total_comments}, status=200)

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

def change_password(request):
    if request.method == 'POST':
        form = PasswordChangeForm(request.user, request.POST)
        if form.is_valid():
            user = form.save()
            update_session_auth_hash(request, user)  # Important! Keeps user logged in still
            messages.success(request, 'Your password was successfully updated!')
            return redirect('index')
        else:
            messages.error(request, 'Please correct the error(s) below.')
    else:
        form = PasswordChangeForm(request.user)
    return render(request, 'danceapp/change_password.html', {'form': form })
        
# Register a new student (teachers can only be added via admin Django view)
def register_student(request):
    if request.method == "POST":
        page_redirect = util.register(request,"student")
        return HttpResponseRedirect(reverse(page_redirect))

    else:
        return render(request, "danceapp/register.html")
    
def register_teacher(request):
    if request.method == "POST":
        page_redirect = util.register(request,"teacher")
        return HttpResponseRedirect(reverse(page_redirect))
    else:
        return render(request, "danceapp/register.html")

def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("login"))