# Generated by Django 3.1.6 on 2021-07-28 15:31

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('danceapp', '0007_auto_20210727_1825'),
    ]

    operations = [
        migrations.AddField(
            model_name='video',
            name='author',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='danceapp.user'),
            preserve_default=False,
        ),
    ]
