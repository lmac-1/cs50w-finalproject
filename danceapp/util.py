from .models import Video, Student

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