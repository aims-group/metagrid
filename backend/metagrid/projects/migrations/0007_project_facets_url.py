# Generated by Django 3.0.5 on 2020-04-30 16:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0006_delete_facetvariable'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='facets_url',
            field=models.URLField(null=True),
        ),
    ]