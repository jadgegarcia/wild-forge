# Generated by Django 4.2.1 on 2023-12-18 09:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('wildforge_api', '0002_alter_classroom_class_code'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='password',
            field=models.CharField(max_length=255),
        ),
    ]
