# Generated by Django 3.1.6 on 2021-08-23 17:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('danceapp', '0021_calenastep'),
    ]

    operations = [
        migrations.AddField(
            model_name='video',
            name='saved_by',
            field=models.ManyToManyField(related_name='favourites', to='danceapp.Student'),
        ),
    ]