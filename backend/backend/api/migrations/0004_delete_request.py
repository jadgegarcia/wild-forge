# Generated by Django 4.2.1 on 2023-12-19 02:25

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('wildforge_api', '0003_alter_user_password'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Request',
        ),
    ]
