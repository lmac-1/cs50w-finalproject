from django import forms

from .models import Video

# Model form for a new video
class NewVideoForm(forms.ModelForm):
    class Meta:
        model = Video
        fields = ['title', 'thumbnail_url', 'description', 'style', 'teacher', 'tags', 'student_access', 'youtube_id', 'class_date']
        widgets = {
                    'title': forms.TextInput(attrs={'class': 'form-control', 'id': 'videoTitle'}),
                    'thumbnail_url': forms.URLInput(attrs={'class': 'form-control', 'id': 'videoThumbnailUrl'}),
                    'description': forms.Textarea(attrs={'rows':6, 'maxlength': 1000, 'class': 'form-control', 'id': 'videoDescription'}),
                    'style': forms.Select(attrs={'class': 'form-control'}),
                    'teacher': forms.SelectMultiple(attrs={'class': 'form-control'}), 
                    'tags': forms.SelectMultiple(attrs={'class': 'form-control'}),
                    'student_access': forms.SelectMultiple(attrs={'class': 'form-control'}),
                    'youtube_id': forms.TextInput(attrs={'class': 'form-control d-none', 'id': 'videoYoutubeId', 'value': ''}),
                    #TODO - add validation
                    'class_date': forms.DateInput(attrs={'type': 'date'})
                    
                    #TODO - make CheckboxSelectMultiple Styling Work
                    # 'student_access': forms.CheckboxSelectMultiple(attrs={'class': 'form-check-input'})

                    }
        labels = {
            'youtube_id': ''
        }