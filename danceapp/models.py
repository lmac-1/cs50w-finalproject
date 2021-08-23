from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    pass
    # Flag that determines whether the user is a student or teacher
    is_student = models.BooleanField('student status', default=False)
    is_teacher = models.BooleanField('teacher status', default=False)  

    def __str__(self):
        if (self.is_student):
            return f"{self.first_name} {self.last_name} (Student)"
        elif (self.is_teacher):
            return f"{self.first_name} (Teacher)"
        else:
            return f"{self.username} (Other)"

    class Meta: 
        # Orders users by first name
        ordering = ['first_name']

class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name}"
    
    class Meta: 
        # Orders students by first name
        ordering = ['user']
    

class Teacher(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)

    def __str__(self):
        if (self.user.first_name):
            return self.user.first_name
        else:
            return self.user.username

    class Meta: 
        # Orders teachers by first name
        ordering = ['user']

class Style(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name
    
    class Meta: 
        # Orders styles by name
        ordering = ['name']

# TODO - delete?
class Tag(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name
    
    class Meta:
        # Orders tags by name
        ordering = ['name']

class Video(models.Model):
    LEVELS = [('BEG', 'Beginner'), ('INT', 'Intermediate'), ('ADV', 'Advanced')]
    
    title = models.CharField(max_length=59)
    youtube_id = models.CharField(max_length=30)
    description = models.TextField(blank=True)
    thumbnail_url = models.URLField(max_length=600)
    style = models.ForeignKey(Style, on_delete=models.CASCADE)
    level = models.CharField(max_length=10, choices=LEVELS)
    teacher = models.ManyToManyField(Teacher, related_name="videos")
    student_access = models.ManyToManyField(Student, blank=True, related_name="videos")
    #tags = models.ManyToManyField(Tag, blank=True, related_name="videos")
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    class_date = models.DateField()

    def __str__(self):
        return f"{self.title} uploaded by {self.author.first_name}"

    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "youtube_id": self.youtube_id, 
            "thumbnail_url": self.thumbnail_url,
            "style": self.style.pk,
            "level": self.level,
            "teacher": [{"name": teacher.user.first_name, "value": teacher.pk} for teacher in self.teacher.all()],
            "class_date": self.class_date.strftime("%d/%m/%Y")
        }
    
    class Meta:
        # Orders videos in reverse chronological order
        ordering = ['-class_date']

class CalenaStep(models.Model):
    name = models.CharField(max_length=40)

class Comment(models.Model):
    video = models.ForeignKey(Video, on_delete=models.CASCADE, related_name="comments")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments")
    comment = models.CharField(max_length=5000)
    time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.comment)

    class Meta: 
        # Orders comment by most recent first, by default
        ordering = ['-time']

class Notification(models.Model):
    video = models.ForeignKey(Video, on_delete=models.CASCADE, related_name="notifications")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications")
    message = models.CharField(max_length=5000)
    time = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)

    def __str__(self):
        return f"Notification for {self.user.first_name} : {self.message}"
    
    class Meta:
        # Orders notifications by most recent first by default
        ordering = ['-time']