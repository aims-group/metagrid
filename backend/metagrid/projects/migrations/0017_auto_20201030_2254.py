# Generated by Django 3.1.1 on 2020-10-30 22:54
from typing import TYPE_CHECKING

from django.db import migrations

if TYPE_CHECKING:
    from metagrid.projects.models import Facet, FacetGroup, Project


def insert_cross_search(apps, schema_editor):
    ProjectModel = apps.get_model("projects", "Project")  # type: Project
    FacetModel = apps.get_model("projects", "Facet")  # type: Facet
    FacetGroupModel = apps.get_model(
        "projects", "FacetGroup"
    )  # type: FacetGroup

    cross_project = ProjectModel(
        name="All (except CMIP6)",
        description="Cross project search for all projects except CMIP6.",
    )
    cross_project.save()
    facets = {
        "General": [
            "project",
            "product",
            "institute",
            "model",
            "data_node",
        ],
        "Identifiers": [
            "source_id",
            "experiment",
            "experiment_family",
        ],
        "Classifications": [
            "time_frequency",
            "realm",
            "cmor_table",
            "ensemble",
            "variable",
            "variable_long_name",
            "cf_standard_name",
            "driving_model",
        ],
        "ISIMIP-FT": [
            "impact_model",
            "sector",
            "social_forcing",
            "co2_forcing",
            "irrigation_forcing",
            "crop",
            "pft",
            "vegetation",
        ],
        "CORDEX": [
            "domain",
            "rcm_name",
            "rcm_version",
        ],
    }

    for group_name, facets_by_group in facets.items():
        group = FacetGroupModel.objects.get_or_create(name=group_name)
        for facet in facets_by_group:
            FacetModel.objects.create(
                name=facet,
                project=cross_project,
                group=group[0],
            )


def reverse_cross_search(apps, schema_editor):
    ProjectModel = apps.get_model("projects", "Project")  # type: Project
    FacetGroupModel = apps.get_model(
        "projects", "FacetGroup"
    )  # type: FacetGroup

    ProjectModel.objects.get(name="All (except CMIP6)").delete()
    FacetGroupModel.objects.filter(name__in=["ISIMIP-FT", "CORDEX"]).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("projects", "0016_auto_20201030_2115"),
    ]

    operations = [
        migrations.RunPython(insert_cross_search, reverse_cross_search)
    ]
