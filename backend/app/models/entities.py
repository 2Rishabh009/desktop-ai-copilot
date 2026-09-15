from datetime import datetime
from sqlalchemy import String, Text, Integer, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from app.database.base import Base
class User(Base):
 __tablename__='users'; id:Mapped[int]=mapped_column(primary_key=True); email:Mapped[str]=mapped_column(String(320),unique=True,index=True); password_hash:Mapped[str]=mapped_column(Text); created_at:Mapped[datetime]=mapped_column(DateTime,default=datetime.utcnow)
class Plan(Base):
 __tablename__='plans'; id:Mapped[int]=mapped_column(primary_key=True); name:Mapped[str]=mapped_column(String(40),unique=True); monthly_ai_requests:Mapped[int]=mapped_column(Integer,default=100); monthly_vision_requests:Mapped[int]=mapped_column(Integer,default=20); monthly_speech_minutes:Mapped[int]=mapped_column(Integer,default=30)
class Subscription(Base):
 __tablename__='subscriptions'; id:Mapped[int]=mapped_column(primary_key=True); user_id:Mapped[int]=mapped_column(ForeignKey('users.id')); plan_id:Mapped[int]=mapped_column(ForeignKey('plans.id')); status:Mapped[str]=mapped_column(String(30),default='active'); provider_customer_id:Mapped[str|None]=mapped_column(String(255),nullable=True)
class Conversation(Base):
 __tablename__='conversations'; id:Mapped[int]=mapped_column(primary_key=True); user_id:Mapped[int]=mapped_column(ForeignKey('users.id')); title:Mapped[str|None]=mapped_column(String(255),nullable=True); created_at:Mapped[datetime]=mapped_column(DateTime,default=datetime.utcnow)
class Message(Base):
 __tablename__='messages'; id:Mapped[int]=mapped_column(primary_key=True); conversation_id:Mapped[int]=mapped_column(ForeignKey('conversations.id')); role:Mapped[str]=mapped_column(String(20)); content:Mapped[str]=mapped_column(Text); created_at:Mapped[datetime]=mapped_column(DateTime,default=datetime.utcnow)
class Document(Base):
 __tablename__='documents'; id:Mapped[int]=mapped_column(primary_key=True); user_id:Mapped[int]=mapped_column(ForeignKey('users.id')); filename:Mapped[str]=mapped_column(String(255)); storage_key:Mapped[str|None]=mapped_column(String(512),nullable=True); created_at:Mapped[datetime]=mapped_column(DateTime,default=datetime.utcnow)
class DocumentChunk(Base):
 __tablename__='document_chunks'; id:Mapped[int]=mapped_column(primary_key=True); document_id:Mapped[int]=mapped_column(ForeignKey('documents.id')); content:Mapped[str]=mapped_column(Text); embedding_ref:Mapped[str|None]=mapped_column(String(512),nullable=True)
class UsageEvent(Base):
 __tablename__='usage_events'; id:Mapped[int]=mapped_column(primary_key=True); user_id:Mapped[int]=mapped_column(ForeignKey('users.id')); kind:Mapped[str]=mapped_column(String(40)); units:Mapped[int]=mapped_column(Integer,default=1); created_at:Mapped[datetime]=mapped_column(DateTime,default=datetime.utcnow)
class Session(Base):
 __tablename__='sessions'; id:Mapped[int]=mapped_column(primary_key=True); user_id:Mapped[int]=mapped_column(ForeignKey('users.id')); token_hash:Mapped[str]=mapped_column(String(255)); expires_at:Mapped[datetime]=mapped_column(DateTime)
class Setting(Base):
 __tablename__='settings'; id:Mapped[int]=mapped_column(primary_key=True); user_id:Mapped[int]=mapped_column(ForeignKey('users.id')); key:Mapped[str]=mapped_column(String(100)); value:Mapped[str]=mapped_column(Text); enabled:Mapped[bool]=mapped_column(Boolean,default=True)
class AuditEvent(Base):
 __tablename__='audit_events'; id:Mapped[int]=mapped_column(primary_key=True); user_id:Mapped[int|None]=mapped_column(ForeignKey('users.id'),nullable=True); action:Mapped[str]=mapped_column(String(100)); created_at:Mapped[datetime]=mapped_column(DateTime,default=datetime.utcnow)
