from alembic import op
import sqlalchemy as sa
revision='0001_initial'; down_revision=None; branch_labels=None; depends_on=None
def upgrade():
 op.create_table('users',sa.Column('id',sa.Integer,primary_key=True),sa.Column('email',sa.String(320),unique=True),sa.Column('password_hash',sa.Text),sa.Column('created_at',sa.DateTime)); op.create_index('ix_users_email','users',['email'])
 op.create_table('plans',sa.Column('id',sa.Integer,primary_key=True),sa.Column('name',sa.String(40),unique=True),sa.Column('monthly_ai_requests',sa.Integer),sa.Column('monthly_vision_requests',sa.Integer),sa.Column('monthly_speech_minutes',sa.Integer))
 op.create_table('subscriptions',sa.Column('id',sa.Integer,primary_key=True),sa.Column('user_id',sa.Integer,sa.ForeignKey('users.id')),sa.Column('plan_id',sa.Integer,sa.ForeignKey('plans.id')),sa.Column('status',sa.String(30)),sa.Column('provider_customer_id',sa.String(255)))
 op.create_table('conversations',sa.Column('id',sa.Integer,primary_key=True),sa.Column('user_id',sa.Integer,sa.ForeignKey('users.id')),sa.Column('title',sa.String(255)),sa.Column('created_at',sa.DateTime))
 op.create_table('messages',sa.Column('id',sa.Integer,primary_key=True),sa.Column('conversation_id',sa.Integer,sa.ForeignKey('conversations.id')),sa.Column('role',sa.String(20)),sa.Column('content',sa.Text),sa.Column('created_at',sa.DateTime))
 op.create_table('documents',sa.Column('id',sa.Integer,primary_key=True),sa.Column('user_id',sa.Integer,sa.ForeignKey('users.id')),sa.Column('filename',sa.String(255)),sa.Column('storage_key',sa.String(512)),sa.Column('created_at',sa.DateTime))
 op.create_table('document_chunks',sa.Column('id',sa.Integer,primary_key=True),sa.Column('document_id',sa.Integer,sa.ForeignKey('documents.id')),sa.Column('content',sa.Text),sa.Column('embedding_ref',sa.String(512)))
 op.create_table('usage_events',sa.Column('id',sa.Integer,primary_key=True),sa.Column('user_id',sa.Integer,sa.ForeignKey('users.id')),sa.Column('kind',sa.String(40)),sa.Column('units',sa.Integer),sa.Column('created_at',sa.DateTime))
 op.create_table('sessions',sa.Column('id',sa.Integer,primary_key=True),sa.Column('user_id',sa.Integer,sa.ForeignKey('users.id')),sa.Column('token_hash',sa.String(255)),sa.Column('expires_at',sa.DateTime))
 op.create_table('settings',sa.Column('id',sa.Integer,primary_key=True),sa.Column('user_id',sa.Integer,sa.ForeignKey('users.id')),sa.Column('key',sa.String(100)),sa.Column('value',sa.Text),sa.Column('enabled',sa.Boolean))
 op.create_table('audit_events',sa.Column('id',sa.Integer,primary_key=True),sa.Column('user_id',sa.Integer,sa.ForeignKey('users.id')),sa.Column('action',sa.String(100)),sa.Column('created_at',sa.DateTime))
def downgrade():
 for t in ['audit_events','settings','sessions','usage_events','document_chunks','documents','messages','conversations','subscriptions','plans','users']: op.drop_table(t)
