# Generated by Django 3.1.6 on 2021-08-23 16:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('danceapp', '0020_auto_20210821_0120'),
    ]

    operations = [
        migrations.CreateModel(
            name='CalenaStep',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=40)),
            ],
        ),
    ]
