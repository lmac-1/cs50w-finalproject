# Generated by Django 3.1.6 on 2021-08-03 22:23

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('danceapp', '0013_auto_20210729_1715'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='video',
            name='link',
        ),
    ]
