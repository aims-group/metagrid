# Generated by Django 3.0.7 on 2020-07-08 19:57

import django.contrib.postgres.fields.jsonb
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('cart', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='cart',
            name='items',
            field=django.contrib.postgres.fields.jsonb.JSONField(default=list),
        ),
        migrations.DeleteModel(
            name='CartItem',
        ),
    ]
