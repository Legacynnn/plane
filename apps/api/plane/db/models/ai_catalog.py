# Copyright (c) 2023-present Plane Software, Inc. and contributors
# SPDX-License-Identifier: AGPL-3.0-only
# See the LICENSE file for details.

# Python imports
from decimal import Decimal

# Django imports
from django.core.exceptions import ValidationError
from django.db import models, transaction
from django.db.models import Q
from django.utils import timezone

# Module imports
from plane.license.utils.encryption import decrypt_data, encrypt_data

from .base import BaseModel

LIVE = Q(deleted_at__isnull=True)


class AIProvider(BaseModel):
    class Kind(models.TextChoices):
        LLM = "llm", "LLM"
        DECISION = "decision", "Decision"
        SEARCH = "search", "Search"
        EMBEDDING = "embedding", "Embedding"

    slug = models.SlugField(max_length=64)
    name = models.CharField(max_length=255)
    kind = models.CharField(max_length=16, choices=Kind.choices, default=Kind.LLM)
    base_url = models.URLField(max_length=1024, blank=True, default="")
    api_key_encrypted = models.TextField(blank=True, default="")
    enabled = models.BooleanField(default=True)
    cloud_only = models.BooleanField(default=False)

    class Meta:
        verbose_name = "AI Provider"
        verbose_name_plural = "AI Providers"
        db_table = "ai_providers"
        ordering = ("name",)
        constraints = [
            models.UniqueConstraint(fields=["slug"], condition=LIVE, name="ai_provider_unique_slug_when_live"),
        ]

    def __str__(self):
        return self.slug

    @property
    def api_key(self):
        return decrypt_data(self.api_key_encrypted)

    @property
    def has_api_key(self):
        return bool(self.api_key_encrypted)

    def set_api_key(self, value):
        self.api_key_encrypted = encrypt_data(value)


class AIModel(BaseModel):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        ACTIVE = "active", "Active"
        DEPRECATED = "deprecated", "Deprecated"
        DISABLED = "disabled", "Disabled"

    class Source(models.TextChoices):
        MODELS_DEV = "models.dev", "models.dev"
        LITELLM = "litellm", "LiteLLM"
        MANUAL = "manual", "Manual"

    provider = models.ForeignKey(AIProvider, on_delete=models.CASCADE, related_name="models")
    key = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    capabilities = models.JSONField(default=list, blank=True)
    context_window = models.PositiveIntegerField(null=True, blank=True)
    max_output_tokens = models.PositiveIntegerField(null=True, blank=True)
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.PENDING)
    source = models.CharField(max_length=16, choices=Source.choices, default=Source.MANUAL)

    class Meta:
        verbose_name = "AI Model"
        verbose_name_plural = "AI Models"
        db_table = "ai_models"
        ordering = ("provider", "key")
        constraints = [
            models.UniqueConstraint(
                fields=["provider", "key"], condition=LIVE, name="ai_model_unique_provider_key_when_live"
            ),
        ]

    def __str__(self):
        return f"{self.provider.slug}/{self.key}"


class ModelPrice(BaseModel):
    FROZEN_FIELDS = (
        "model_id",
        "currency",
        "input_per_mtok",
        "cached_input_per_mtok",
        "cache_write_per_mtok",
        "output_per_mtok",
        "reasoning_per_mtok",
        "per_call",
        "effective_from",
    )

    model = models.ForeignKey(AIModel, on_delete=models.CASCADE, related_name="prices")
    currency = models.CharField(max_length=3, default="USD")
    input_per_mtok = models.DecimalField(max_digits=18, decimal_places=8, null=True, blank=True)
    cached_input_per_mtok = models.DecimalField(max_digits=18, decimal_places=8, null=True, blank=True)
    cache_write_per_mtok = models.DecimalField(max_digits=18, decimal_places=8, null=True, blank=True)
    output_per_mtok = models.DecimalField(max_digits=18, decimal_places=8, null=True, blank=True)
    reasoning_per_mtok = models.DecimalField(max_digits=18, decimal_places=8, null=True, blank=True)
    per_call = models.DecimalField(max_digits=18, decimal_places=8, null=True, blank=True)
    effective_from = models.DateTimeField(default=timezone.now)
    effective_to = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = "Model Price"
        verbose_name_plural = "Model Prices"
        db_table = "ai_model_prices"
        ordering = ("model", "-effective_from")
        constraints = [
            models.UniqueConstraint(
                fields=["model"],
                condition=LIVE & Q(effective_to__isnull=True),
                name="ai_model_price_one_open_price_per_model",
            ),
            models.CheckConstraint(
                condition=Q(effective_to__isnull=True) | Q(effective_to__gt=models.F("effective_from")),
                name="ai_model_price_window_is_ordered",
            ),
        ]

    def __str__(self):
        return f"{self.model_id} from {self.effective_from:%Y-%m-%d}"

    def save(self, *args, **kwargs):
        if not self._state.adding:
            stored = ModelPrice.all_objects.get(pk=self.pk)
            changed = [field for field in self.FROZEN_FIELDS if getattr(stored, field) != getattr(self, field)]
            if changed:
                raise ValidationError(f"A model price is never edited in place: {', '.join(changed)}")
        super().save(*args, **kwargs)

    @classmethod
    def start(cls, model, effective_from=None, **prices):
        effective_from = effective_from or timezone.now()
        with transaction.atomic():
            current = cls.objects.select_for_update().filter(model=model, effective_to__isnull=True).first()
            if current:
                if effective_from <= current.effective_from:
                    raise ValidationError("A model price must start after the current one.")
                current.effective_to = effective_from
                current.save(update_fields=["effective_to", "updated_at"])
            return cls.objects.create(model=model, effective_from=effective_from, **prices)

    @classmethod
    def effective_at(cls, model, moment):
        return (
            cls.objects.filter(model=model, effective_from__lte=moment)
            .filter(Q(effective_to__isnull=True) | Q(effective_to__gt=moment))
            .order_by("-effective_from")
            .first()
        )


class ModelAssignment(BaseModel):
    class Scope(models.TextChoices):
        INSTANCE = "instance", "Instance"
        WORKSPACE = "workspace", "Workspace"
        AGENT = "agent", "Agent"

    scope = models.CharField(max_length=16, choices=Scope.choices, default=Scope.INSTANCE)
    workspace = models.ForeignKey(
        "db.Workspace", on_delete=models.CASCADE, related_name="model_assignments", null=True, blank=True
    )
    agent_id = models.UUIDField(null=True, blank=True)
    feature = models.CharField(max_length=64)
    model = models.ForeignKey(AIModel, on_delete=models.PROTECT, related_name="assignments")
    fallback_model = models.ForeignKey(
        AIModel, on_delete=models.SET_NULL, related_name="fallback_assignments", null=True, blank=True
    )

    class Meta:
        verbose_name = "Model Assignment"
        verbose_name_plural = "Model Assignments"
        db_table = "ai_model_assignments"
        ordering = ("feature", "scope")
        constraints = [
            models.CheckConstraint(
                condition=(
                    Q(scope="instance", workspace__isnull=True, agent_id__isnull=True)
                    | Q(scope="workspace", workspace__isnull=False, agent_id__isnull=True)
                    | Q(scope="agent", agent_id__isnull=False)
                ),
                name="ai_model_assignment_scope_matches_target",
            ),
            models.UniqueConstraint(
                fields=["feature"],
                condition=LIVE & Q(scope="instance"),
                name="ai_model_assignment_unique_instance_feature",
            ),
            models.UniqueConstraint(
                fields=["workspace", "feature"],
                condition=LIVE & Q(scope="workspace"),
                name="ai_model_assignment_unique_workspace_feature",
            ),
            models.UniqueConstraint(
                fields=["agent_id", "feature"],
                condition=LIVE & Q(scope="agent"),
                name="ai_model_assignment_unique_agent_feature",
            ),
        ]

    def __str__(self):
        return f"{self.scope}:{self.feature}"

    @classmethod
    def resolve(cls, feature, workspace=None, agent_id=None):
        assignments = cls.objects.filter(feature=feature).select_related("model", "fallback_model")
        candidates = [
            assignments.filter(scope=cls.Scope.AGENT, agent_id=agent_id) if agent_id else None,
            assignments.filter(scope=cls.Scope.WORKSPACE, workspace=workspace) if workspace else None,
            assignments.filter(scope=cls.Scope.INSTANCE),
        ]
        for candidate in candidates:
            match = candidate.first() if candidate is not None else None
            if match:
                return match
        return None


class Markup(BaseModel):
    provider = models.ForeignKey(AIProvider, on_delete=models.CASCADE, related_name="markups", null=True, blank=True)
    multiplier = models.DecimalField(max_digits=8, decimal_places=4, default=Decimal("1"))

    class Meta:
        verbose_name = "Markup"
        verbose_name_plural = "Markups"
        db_table = "ai_markups"
        constraints = [
            models.CheckConstraint(condition=Q(multiplier__gt=0), name="ai_markup_multiplier_is_positive"),
            models.UniqueConstraint(
                fields=["provider"],
                condition=LIVE & Q(provider__isnull=False),
                name="ai_markup_unique_provider_when_live",
            ),
            models.UniqueConstraint(
                models.Value(True),
                condition=LIVE & Q(provider__isnull=True),
                name="ai_markup_one_instance_default",
            ),
        ]

    def __str__(self):
        return f"{self.provider_id or 'instance'} x{self.multiplier}"

    @classmethod
    def for_provider(cls, provider):
        markup = (
            cls.objects.filter(Q(provider=provider) | Q(provider__isnull=True))
            .order_by(models.F("provider").desc(nulls_last=True))
            .first()
        )
        return markup.multiplier if markup else Decimal("1")
