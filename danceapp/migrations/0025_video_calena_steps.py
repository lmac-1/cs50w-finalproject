# Generated by Django 3.1.6 on 2021-08-25 01:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('danceapp', '0024_notification_author'),
    ]

    operations = [
        migrations.AddField(
            model_name='video',
            name='calena_steps',
            field=models.ManyToManyField(related_name='videos', to='danceapp.CalenaStep'),
        ),
    ]
