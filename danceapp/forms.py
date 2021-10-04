from django import forms
from django.contrib.auth.forms import PasswordChangeForm 

from .models import Video, Comment

class PasswordChangeForm(PasswordChangeForm):
    
    def __init__(self, *args, **kwargs):
        super(PasswordChangeForm, self).__init__(*args, **kwargs)
        self.fields['old_password'].label = 'Current password:'
        self.fields['old_password'].widget.attrs.update({
            'class': 'form-control',
            'autofocus': False,
        })
        self.fields['new_password1'].label = 'New password:'
        self.fields['new_password1'].widget.attrs.update({
            'class': 'form-control',
        })
        self.fields['new_password2'].label = 'Confirm new password:'
        self.fields['new_password2'].widget.attrs.update({
            'class': 'form-control',
        })

# Model form for a new video
class NewVideoForm(forms.ModelForm):
    class Meta:
        model = Video
        fields = ['youtube_id', 'title', 'thumbnail_url', 'description', 'style', 'calena_steps', 'level', 'teacher', 'student_access', 'class_date']
        widgets = {
                    'youtube_id': forms.TextInput(attrs={'class': 'form-control', 'id': 'videoYoutubeId', 'readonly':'readonly'}),
                    'title': forms.TextInput(attrs={'class': 'form-control', 'id': 'videoTitle'}),
                    'thumbnail_url': forms.URLInput(attrs={'class': 'form-control', 'id': 'videoThumbnailUrl'}),
                    'description': forms.Textarea(attrs={'rows': 6, 'maxlength': 1000, 'class': 'form-control', 'id': 'videoDescription'}),
                    'style': forms.Select(attrs={'class': 'form-control', 'id': 'style'}),
                    'calena_steps': forms.CheckboxSelectMultiple(),
                    'level': forms.Select(attrs={'class': 'form-control'}),
                    'teacher': forms.CheckboxSelectMultiple(attrs={'class': 'column-checkbox'}), 
                    'student_access': forms.CheckboxSelectMultiple(attrs={'class': 'column-checkbox'}),
                    'class_date': forms.DateInput(attrs={'type': 'date', 'class': 'form-control'})

                    }
        labels = {
            'teacher': 'Teacher(s):'
        }

class CommentForm(forms.ModelForm): 
    class Meta:
        model = Comment
        fields = ['comment']
        labels = {
            'comment': ''
        }
        widgets = {"comment": forms.Textarea(attrs={'rows': 2, 'id': 'comment-textarea', 'class': 'form-control ml-2', 'maxlength': '5000', 'placeholder': 'Add a public comment'})}