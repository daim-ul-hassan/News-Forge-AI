import enum
import uuid
from datetime import datetime

from sqlalchemy import DateTime, Enum, Index, String, Text, UniqueConstraint, func
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class CreatorConnectionPlatform(str, enum.Enum):
    youtube = "youtube"
    tiktok = "tiktok"
    x = "x"
    instagram = "instagram"


class CreatorConnectionStatus(str, enum.Enum):
    pending = "pending"
    connected = "connected"
    expired = "expired"
    revoked = "revoked"
    failed = "failed"


class CreatorConnection(Base):
    __tablename__ = "creator_connections"
    __table_args__ = (
        UniqueConstraint("profile_id", "platform", "external_account_id"),
        Index("ix_creator_connections_profile_platform", "profile_id", "platform"),
    )

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    profile_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)
    platform: Mapped[CreatorConnectionPlatform] = mapped_column(
        Enum(CreatorConnectionPlatform, name="creator_connection_platform"),
        nullable=False,
    )
    status: Mapped[CreatorConnectionStatus] = mapped_column(
        Enum(CreatorConnectionStatus, name="creator_connection_status"),
        nullable=False,
        default=CreatorConnectionStatus.pending,
    )
    external_account_id: Mapped[str | None] = mapped_column(String(255), nullable=True)
    external_account_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    access_token_encrypted: Mapped[str | None] = mapped_column(Text, nullable=True)
    refresh_token_encrypted: Mapped[str | None] = mapped_column(Text, nullable=True)
    scopes: Mapped[list[str] | None] = mapped_column(JSONB, nullable=True)
    connection_metadata: Mapped[dict | None] = mapped_column("metadata", JSONB, nullable=True)
    connected_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
