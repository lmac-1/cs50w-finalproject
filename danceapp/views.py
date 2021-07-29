from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.urls import reverse
from django.http import HttpResponseRedirect
from django.http import HttpResponse
from django.db import IntegrityError
from django.contrib import messages

from .models import User, Student, Video
from .forms import NewVideoForm

def index(request):
    return render(request, "danceapp/index.html", {
        "videos": Video.objects.all()
    })

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
            # Redirect to listing page 
            return HttpResponseRedirect(reverse("index",))
    else:
        return render(request, "danceapp/newvideo.html", {
            "form": NewVideoForm()
        })

# Register a new student (teachers can only be added via admin Django view)
def register_student(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]
        first_name = request.POST["first_name"]
        last_name = request.POST["last_name"]

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
            user.is_student = True
            # Saves user
            user.save()
            # Creates student instance of user
            student = Student.objects.create(user=user)

        except IntegrityError:
            messages.error(request, 'Username already taken.')
            return HttpResponseRedirect(reverse("register_student"))
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "danceapp/register.html")