# Generated by Django 3.1.6 on 2021-07-28 15:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('danceapp', '0008_video_author'),
    ]

    operations = [
        migrations.AddField(
            model_name='video',
            name='description',
            field=models.TextField(blank=True),
        ),
    ]
