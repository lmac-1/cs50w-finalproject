from django import forms

from .models import Video

# Model form for a new video
class NewVideoForm(forms.ModelForm):
    class Meta:
        model = Video
        fields = ['youtube_id', 'title', 'thumbnail_url', 'description', 'style', 'teacher', 'tags', 'student_access', 'class_date']
        widgets = {
                    'youtube_id': forms.TextInput(attrs={'class': 'form-control', 'id': 'videoYoutubeId', 'readonly':'readonly'}),
                    'title': forms.TextInput(attrs={'class': 'form-control', 'id': 'videoTitle'}),
                    'thumbnail_url': forms.URLInput(attrs={'class': 'form-control', 'id': 'videoThumbnailUrl'}),
                    'description': forms.Textarea(attrs={'rows':6, 'maxlength': 1000, 'class': 'form-control', 'id': 'videoDescription'}),
                    'style': forms.Select(attrs={'class': 'form-control'}),
                    'teacher': forms.SelectMultiple(attrs={'class': 'form-control'}), 
                    'tags': forms.SelectMultiple(attrs={'class': 'form-control'}),
                    'student_access': forms.SelectMultiple(attrs={'class': 'form-control'}),
                    #TODO - add validation
                    'class_date': forms.DateInput(attrs={'type': 'date', 'class': 'form-control'})
                    
                    #TODO - make CheckboxSelectMultiple Styling Work
                    # 'student_access': forms.CheckboxSelectMultiple(attrs={'class': 'form-check-input'})

                    }
        """ labels = {
            'youtube_id': ''
        } """