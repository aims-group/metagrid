# Generated by Django 3.0.8 on 2020-07-21 16:55

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('cart', '0005_auto_20200720_2217'),
    ]

    operations = [
        migrations.AddField(
            model_name='search',
            name='uuid',
            field=models.UUIDField(default=uuid.uuid4),
        ),
    ]