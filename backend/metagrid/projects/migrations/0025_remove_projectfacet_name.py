# Generated by Django 3.1.1 on 2020-11-02 22:39

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0024_auto_20201102_2230'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='projectfacet',
            name='name',
        ),
    ]