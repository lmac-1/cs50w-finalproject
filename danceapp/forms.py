from django import forms

from .models import Video

# Model form for a new video
class NewVideoForm(forms.ModelForm):
    class Meta:
        model = Video
        fields = ['title', 'link', 'description', 'style', 'teacher', 'tags', 'student_access']
        widgets = {
                    'title': forms.TextInput(attrs={'class': 'form-control'}),
                    'link': forms.URLInput(attrs={'class': 'form-control'}),
                    'description': forms.Textarea(attrs={'rows':2, 'maxlength': 1000, 'class': 'form-control'}),
                    'style': forms.Select(attrs={'class': 'form-control'}),
                    'teacher': forms.SelectMultiple(attrs={'class': 'form-control'}), 
                    'tags': forms.SelectMultiple(attrs={'class': 'form-control'}),
                    'student_access': forms.SelectMultiple(attrs={'class': 'form-control'})
                    
                    #TODO - make CheckboxSelectMultiple Styling Work
                    # 'student_access': forms.CheckboxSelectMultiple(attrs={'class': 'form-check-input'})
                    }
        """ labels = {
            'image': 'Image URL'
        } """