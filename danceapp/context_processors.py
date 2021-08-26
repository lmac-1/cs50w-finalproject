from .models import User

# Adds global notifications variable that will be used in the navbar in layout template - tbc JS
def notifications_processor(request):
    
    user_logged_in = None
    if request.user.is_authenticated:
        try:
            user_logged_in = User.objects.get(pk=request.user.pk)
        except User.DoesNotExist:
            pass

    if user_logged_in:
        notifications = user_logged_in.notifications.all()

    else:
        notifications = []
    
    return {'notifications': notifications}