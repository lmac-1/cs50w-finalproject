# Generated by Django 3.1.6 on 2021-09-06 15:45

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('danceapp', '0004_auto_20210904_0107'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='calenastep',
            options={'ordering': ['name']},
        ),
    ]