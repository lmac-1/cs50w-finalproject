# Generated by Django 3.1.6 on 2021-08-21 01:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('danceapp', '0019_video_level'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='video',
            options={'ordering': ['-class_date']},
        ),
        migrations.AlterField(
            model_name='video',
            name='title',
            field=models.CharField(max_length=59),
        ),
    ]
