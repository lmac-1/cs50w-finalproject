# Generated by Django 3.1.6 on 2021-07-27 16:11

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('danceapp', '0005_teacher'),
    ]

    operations = [
        migrations.CreateModel(
            name='Style',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='Video',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=500)),
                ('link', models.CharField(max_length=600)),
                ('student_access', models.ManyToManyField(blank=True, related_name='videos', to='danceapp.Student')),
                ('style', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='danceapp.style')),
                ('teacher', models.ManyToManyField(related_name='videos', to='danceapp.Teacher')),
            ],
        ),
    ]
