-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "MemberRole" AS ENUM ('MEMBER', 'ADMIN', 'OWNER');

-- CreateEnum
CREATE TYPE "InviteStatus" AS ENUM ('PENDING', 'ACCEPTED', 'EXPIRED', 'REVOKED');

-- CreateEnum
CREATE TYPE "ApiPermission" AS ENUM ('READ', 'WRITE', 'DELETE', 'ADMIN');

-- CreateEnum
CREATE TYPE "PlanType" AS ENUM ('FREE', 'STARTER', 'PROFESSIONAL', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "AgentVisibility" AS ENUM ('PRIVATE', 'ORGANIZATION', 'PUBLIC', 'UNLISTED');

-- CreateEnum
CREATE TYPE "DataSourceType" AS ENUM ('TEXT', 'FILE', 'WEBSITE', 'NOTION', 'GOOGLE_DRIVE', 'SALESFORCE', 'ZENDESK', 'CUSTOM');

-- CreateEnum
CREATE TYPE "DataSourceStatus" AS ENUM ('QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED', 'DELETED');

-- CreateEnum
CREATE TYPE "ChatRole" AS ENUM ('SYSTEM', 'USER', 'ASSISTANT', 'FUNCTION', 'TOOL');

-- CreateEnum
CREATE TYPE "IntegrationType" AS ENUM ('CRM', 'HELPDesk', 'CALENDAR', 'PAYMENT', 'EMAIL', 'SLACK', 'DISCORD', 'TEAMS', 'CUSTOM');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "twoFactorEnabled" BOOLEAN DEFAULT false,
    "role" TEXT,
    "banned" BOOLEAN DEFAULT false,
    "banReason" TEXT,
    "banExpires" TIMESTAMP(3),
    "stripeCustomerId" TEXT,
    "metadata" JSONB,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,
    "activeOrganizationId" TEXT,
    "impersonatedBy" TEXT,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verifications" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organizations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT,
    "logo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "metadata" JSONB,
    "plan" "PlanType" DEFAULT 'STARTER',
    "settings" JSONB,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "members" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "MemberRole" NOT NULL DEFAULT 'MEMBER',
    "permissions" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invitations" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "MemberRole" DEFAULT 'MEMBER',
    "status" "InviteStatus" NOT NULL DEFAULT 'PENDING',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "inviterId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invitations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "two_factors" (
    "id" TEXT NOT NULL,
    "secret" TEXT NOT NULL,
    "backupCodes" TEXT[],
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "two_factors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "passkeys" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "publicKey" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "credentialID" TEXT NOT NULL,
    "counter" INTEGER NOT NULL,
    "deviceType" TEXT,
    "backedUp" BOOLEAN NOT NULL,
    "transports" TEXT[],
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "aaguid" TEXT,

    CONSTRAINT "passkeys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_keys" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "secret" TEXT,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "permissions" "ApiPermission"[],
    "rateLimit" INTEGER DEFAULT 1000,
    "expiresAt" TIMESTAMP(3),
    "lastUsedAt" TIMESTAMP(3),
    "isActive" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "api_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agents" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "language" VARCHAR(10) NOT NULL DEFAULT 'en',
    "prompt" TEXT,
    "temperature" DOUBLE PRECISION DEFAULT 0.7,
    "maxTokens" INTEGER DEFAULT 1000,
    "model" VARCHAR(50) DEFAULT 'gpt-4',
    "provider" VARCHAR(20) DEFAULT 'openai',
    "modelName" VARCHAR(100) DEFAULT 'gpt-4',
    "apiVersion" VARCHAR(50),
    "topP" DOUBLE PRECISION DEFAULT 0.9,
    "frequencyPenalty" DOUBLE PRECISION DEFAULT 0.0,
    "presencePenalty" DOUBLE PRECISION DEFAULT 0.0,
    "stopSequences" TEXT[],
    "contextWindow" INTEGER DEFAULT 8000,
    "maxContextTokens" INTEGER DEFAULT 4000,
    "memoryType" VARCHAR(20) DEFAULT 'sliding',
    "reasoningDepth" VARCHAR(20) DEFAULT 'balanced',
    "chainOfThought" BOOLEAN DEFAULT false,
    "selfReflection" BOOLEAN DEFAULT false,
    "safetyLevel" VARCHAR(20) DEFAULT 'medium',
    "biasMitigation" BOOLEAN DEFAULT true,
    "factChecking" BOOLEAN DEFAULT false,
    "visionEnabled" BOOLEAN DEFAULT false,
    "audioEnabled" BOOLEAN DEFAULT false,
    "tokenOptimization" BOOLEAN DEFAULT true,
    "cacheResponses" BOOLEAN DEFAULT true,
    "fallbackModel" VARCHAR(50),
    "supportedLanguages" TEXT[],
    "defaultLanguage" VARCHAR(10) DEFAULT 'en',
    "autoDetectLanguage" BOOLEAN DEFAULT true,
    "conversationStarters" TEXT[],
    "fallbackMessages" TEXT[],
    "escalationTriggers" TEXT,
    "contentFilterLevel" VARCHAR(20) DEFAULT 'medium',
    "blockedTerms" TEXT[],
    "sensitiveTopics" TEXT[],
    "userPersonalization" BOOLEAN DEFAULT false,
    "rememberConversation" BOOLEAN DEFAULT true,
    "contextWindowSize" INTEGER DEFAULT 10,
    "allowImages" BOOLEAN DEFAULT false,
    "allowFiles" BOOLEAN DEFAULT false,
    "allowVoiceMessages" BOOLEAN DEFAULT false,
    "maxFileSize" INTEGER DEFAULT 5,
    "responseTemplates" JSONB,
    "quickReplies" TEXT[],
    "dataRetentionDays" INTEGER DEFAULT 90,
    "autoDeleteConversations" BOOLEAN DEFAULT false,
    "exportConversations" BOOLEAN DEFAULT true,
    "gdprCompliant" BOOLEAN DEFAULT true,
    "ccpaCompliant" BOOLEAN DEFAULT true,
    "hipaaCompliant" BOOLEAN DEFAULT false,
    "anonymizeUserData" BOOLEAN DEFAULT false,
    "pseudonymization" BOOLEAN DEFAULT true,
    "dataEncryption" BOOLEAN DEFAULT true,
    "apiRateLimit" INTEGER DEFAULT 1000,
    "concurrentSessions" INTEGER DEFAULT 10,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "visibility" "AgentVisibility" NOT NULL DEFAULT 'PRIVATE',
    "userId" TEXT NOT NULL,
    "organizationId" TEXT,
    "totalChats" INTEGER NOT NULL DEFAULT 0,
    "totalMessages" INTEGER NOT NULL DEFAULT 0,
    "totalTokens" INTEGER NOT NULL DEFAULT 0,
    "totalUsers" INTEGER NOT NULL DEFAULT 0,
    "avgRating" DOUBLE PRECISION,
    "totalRevenue" DOUBLE PRECISION DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastActiveAt" TIMESTAMP(3),

    CONSTRAINT "agents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_interfaces" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "welcomeMessage" TEXT,
    "placeholderText" VARCHAR(100) DEFAULT 'Type a message...',
    "primaryColor" TEXT DEFAULT '#3B82f6',
    "fontSize" INTEGER DEFAULT 14,
    "position" VARCHAR(20) DEFAULT 'bottom-right',
    "isOpenByDefault" BOOLEAN DEFAULT false,
    "colorScheme" VARCHAR(20) DEFAULT 'system',
    "secondaryColor" TEXT DEFAULT '#64748b',
    "accentColor" TEXT DEFAULT '#8b5cf6',
    "backgroundColor" TEXT DEFAULT '#ffffff',
    "textColor" TEXT DEFAULT '#1f2937',
    "borderColor" TEXT DEFAULT '#e5e7eb',
    "fontFamily" VARCHAR(100) DEFAULT 'Inter, sans-serif',
    "fontWeight" VARCHAR(20) DEFAULT 'normal',
    "lineHeight" DOUBLE PRECISION DEFAULT 1.5,
    "horizontalOffset" INTEGER DEFAULT 20,
    "verticalOffset" INTEGER DEFAULT 20,
    "width" VARCHAR(50) DEFAULT '380px',
    "height" VARCHAR(50) DEFAULT '600px',
    "maxWidth" VARCHAR(50) DEFAULT '90vw',
    "maxHeight" VARCHAR(50) DEFAULT '80vh',
    "entranceAnimation" VARCHAR(20) DEFAULT 'slide-in',
    "messageAnimation" VARCHAR(20) DEFAULT 'fade-up',
    "typingIndicator" BOOLEAN DEFAULT true,
    "readReceipts" BOOLEAN DEFAULT true,
    "soundEffects" BOOLEAN DEFAULT false,
    "soundVolume" INTEGER DEFAULT 50,
    "showAvatars" BOOLEAN DEFAULT true,
    "agentAvatar" TEXT,
    "userAvatar" TEXT,
    "showTimestamps" BOOLEAN DEFAULT true,
    "showTypingIndicator" BOOLEAN DEFAULT true,
    "messageBubbleStyle" VARCHAR(20) DEFAULT 'rounded',
    "showHeader" BOOLEAN DEFAULT true,
    "showFooter" BOOLEAN DEFAULT true,
    "mobileBreakpoint" INTEGER DEFAULT 768,
    "mobilePosition" VARCHAR(20) DEFAULT 'bottom',
    "fullScreenMobile" BOOLEAN DEFAULT false,
    "hideOnMobile" BOOLEAN DEFAULT false,
    "hideOnTablet" BOOLEAN DEFAULT false,
    "chatTitle" VARCHAR(100),
    "chatIcon" TEXT,
    "companyName" VARCHAR(100),
    "companyLogo" TEXT,
    "brandMessage" TEXT,
    "embedMethod" VARCHAR(20) DEFAULT 'floating',
    "targetDomains" TEXT[],
    "allowedOrigins" TEXT[],
    "autoShow" BOOLEAN DEFAULT false,
    "showAfterDelay" INTEGER DEFAULT 0,
    "showOnExitIntent" BOOLEAN DEFAULT false,
    "showOnScroll" BOOLEAN DEFAULT false,
    "scrollPercentage" INTEGER DEFAULT 50,
    "displayRules" JSONB,
    "googleAnalyticsId" TEXT,
    "facebookPixelId" TEXT,
    "googleTagManagerId" TEXT,
    "hotjarId" TEXT,
    "customEvents" JSONB,
    "trackConversions" BOOLEAN DEFAULT false,
    "webhookUrl" TEXT,
    "webhookEvents" TEXT[],
    "apiKey" TEXT,
    "customCSS" TEXT,
    "customHeaderHTML" TEXT,
    "customFooterHTML" TEXT,
    "customJavaScript" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chat_interfaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "data_sources" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "type" "DataSourceType" NOT NULL DEFAULT 'TEXT',
    "name" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "content" TEXT,
    "fileUrl" TEXT,
    "fileName" VARCHAR(200),
    "fileSize" INTEGER,
    "fileType" VARCHAR(50),
    "websiteUrl" TEXT,
    "scrapeDepth" INTEGER DEFAULT 1,
    "sitemapUrl" TEXT,
    "includePatterns" TEXT[],
    "excludePatterns" TEXT[],
    "status" "DataSourceStatus" NOT NULL DEFAULT 'PROCESSING',
    "tokens" INTEGER,
    "chunks" INTEGER,
    "vectorEmbeddings" BOOLEAN DEFAULT false,
    "embeddingModel" VARCHAR(50),
    "error" TEXT,
    "processedAt" TIMESTAMP(3),
    "lastIndexedAt" TIMESTAMP(3),
    "metadata" JSONB,
    "tags" TEXT[],
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "data_sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversations" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "userId" TEXT,
    "title" VARCHAR(200),
    "summary" TEXT,
    "sentiment" DOUBLE PRECISION,
    "category" VARCHAR(50),
    "userEmail" VARCHAR(200),
    "userName" VARCHAR(100),
    "userPhone" VARCHAR(20),
    "userCompany" VARCHAR(100),
    "ipAddress" VARCHAR(45),
    "userAgent" TEXT,
    "country" VARCHAR(50),
    "city" VARCHAR(50),
    "timezone" VARCHAR(50),
    "language" VARCHAR(10),
    "deviceType" VARCHAR(20),
    "browser" VARCHAR(50),
    "messageCount" INTEGER NOT NULL DEFAULT 0,
    "tokenCount" INTEGER NOT NULL DEFAULT 0,
    "wordCount" INTEGER NOT NULL DEFAULT 0,
    "rating" INTEGER,
    "feedback" TEXT,
    "resolved" BOOLEAN DEFAULT false,
    "escalation" BOOLEAN DEFAULT false,
    "escalatedTo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastActivityAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chats" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "role" "ChatRole" NOT NULL DEFAULT 'USER',
    "content" TEXT NOT NULL,
    "tokens" INTEGER,
    "wordCount" INTEGER,
    "messageId" TEXT,
    "parentId" TEXT,
    "sequence" INTEGER,
    "model" VARCHAR(50),
    "provider" VARCHAR(20),
    "temperature" DOUBLE PRECISION,
    "topP" DOUBLE PRECISION,
    "sources" JSONB,
    "citations" TEXT[],
    "confidence" DOUBLE PRECISION,
    "attachments" JSONB,
    "latency" INTEGER,
    "error" TEXT,
    "isEdited" BOOLEAN DEFAULT false,
    "editedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_analytics" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "period" VARCHAR(10) DEFAULT 'day',
    "totalConversations" INTEGER NOT NULL DEFAULT 0,
    "totalMessages" INTEGER NOT NULL DEFAULT 0,
    "totalTokens" INTEGER NOT NULL DEFAULT 0,
    "totalUsers" INTEGER NOT NULL DEFAULT 0,
    "newUsers" INTEGER NOT NULL DEFAULT 0,
    "returningUsers" INTEGER NOT NULL DEFAULT 0,
    "avgResponseTime" DOUBLE PRECISION,
    "firstResponseTime" DOUBLE PRECISION,
    "resolutionRate" DOUBLE PRECISION,
    "escalationRate" DOUBLE PRECISION,
    "completionRate" DOUBLE PRECISION,
    "avgRating" DOUBLE PRECISION,
    "sentimentScore" DOUBLE PRECISION,
    "userSatisfaction" DOUBLE PRECISION,
    "conversationQuality" DOUBLE PRECISION,
    "conversionRate" DOUBLE PRECISION,
    "leadGenerationCount" INTEGER DEFAULT 0,
    "revenueAttributed" DOUBLE PRECISION,
    "goalsCompleted" INTEGER DEFAULT 0,
    "errorRate" DOUBLE PRECISION,
    "uptimePercentage" DOUBLE PRECISION,
    "latency95thPercentile" DOUBLE PRECISION,
    "cacheHitRate" DOUBLE PRECISION,
    "avgSessionDuration" INTEGER,
    "avgMessagesPerSession" DOUBLE PRECISION,
    "bounceRate" DOUBLE PRECISION,
    "retentionRate" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agent_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_workflows" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "triggers" JSONB,
    "actions" JSONB,
    "conditions" JSONB,
    "isActive" BOOLEAN DEFAULT true,
    "priority" INTEGER DEFAULT 1,
    "version" TEXT DEFAULT '1.0.0',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agent_workflows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_knowledge_bases" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "content" JSONB,
    "vectorEmbedding" JSONB,
    "metadata" JSONB,
    "version" TEXT DEFAULT '1.0.0',
    "isActive" BOOLEAN DEFAULT true,
    "chunkSize" INTEGER DEFAULT 1000,
    "chunkOverlap" INTEGER DEFAULT 200,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agent_knowledge_bases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_integrations" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "type" "IntegrationType" NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "config" JSONB,
    "credentials" JSONB,
    "isActive" BOOLEAN DEFAULT true,
    "lastSync" TIMESTAMP(3),
    "syncStatus" VARCHAR(20) DEFAULT 'idle',
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agent_integrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_permissions" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "userId" TEXT,
    "teamId" TEXT,
    "role" VARCHAR(50) NOT NULL,
    "permissions" TEXT[],
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agent_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sessions_token_key" ON "sessions"("token");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_slug_key" ON "organizations"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "members_organizationId_userId_key" ON "members"("organizationId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "passkeys_credentialID_key" ON "passkeys"("credentialID");

-- CreateIndex
CREATE UNIQUE INDEX "api_keys_key_key" ON "api_keys"("key");

-- CreateIndex
CREATE INDEX "agents_userId_idx" ON "agents"("userId");

-- CreateIndex
CREATE INDEX "agents_organizationId_idx" ON "agents"("organizationId");

-- CreateIndex
CREATE INDEX "agents_isPublic_isActive_idx" ON "agents"("isPublic", "isActive");

-- CreateIndex
CREATE INDEX "agents_createdAt_idx" ON "agents"("createdAt");

-- CreateIndex
CREATE INDEX "agents_totalChats_idx" ON "agents"("totalChats");

-- CreateIndex
CREATE UNIQUE INDEX "chat_interfaces_agentId_key" ON "chat_interfaces"("agentId");

-- CreateIndex
CREATE INDEX "data_sources_agentId_idx" ON "data_sources"("agentId");

-- CreateIndex
CREATE INDEX "data_sources_userId_idx" ON "data_sources"("userId");

-- CreateIndex
CREATE INDEX "data_sources_type_idx" ON "data_sources"("type");

-- CreateIndex
CREATE INDEX "data_sources_status_idx" ON "data_sources"("status");

-- CreateIndex
CREATE UNIQUE INDEX "conversations_sessionId_key" ON "conversations"("sessionId");

-- CreateIndex
CREATE INDEX "conversations_agentId_idx" ON "conversations"("agentId");

-- CreateIndex
CREATE INDEX "conversations_userId_idx" ON "conversations"("userId");

-- CreateIndex
CREATE INDEX "conversations_createdAt_idx" ON "conversations"("createdAt");

-- CreateIndex
CREATE INDEX "conversations_rating_idx" ON "conversations"("rating");

-- CreateIndex
CREATE INDEX "conversations_resolved_idx" ON "conversations"("resolved");

-- CreateIndex
CREATE UNIQUE INDEX "chats_messageId_key" ON "chats"("messageId");

-- CreateIndex
CREATE INDEX "chats_conversationId_createdAt_idx" ON "chats"("conversationId", "createdAt");

-- CreateIndex
CREATE INDEX "chats_agentId_idx" ON "chats"("agentId");

-- CreateIndex
CREATE INDEX "chats_role_idx" ON "chats"("role");

-- CreateIndex
CREATE INDEX "chats_createdAt_idx" ON "chats"("createdAt");

-- CreateIndex
CREATE INDEX "agent_analytics_agentId_idx" ON "agent_analytics"("agentId");

-- CreateIndex
CREATE INDEX "agent_analytics_date_idx" ON "agent_analytics"("date");

-- CreateIndex
CREATE UNIQUE INDEX "agent_analytics_agentId_date_period_key" ON "agent_analytics"("agentId", "date", "period");

-- CreateIndex
CREATE INDEX "agent_workflows_agentId_idx" ON "agent_workflows"("agentId");

-- CreateIndex
CREATE INDEX "agent_workflows_isActive_idx" ON "agent_workflows"("isActive");

-- CreateIndex
CREATE INDEX "agent_knowledge_bases_agentId_idx" ON "agent_knowledge_bases"("agentId");

-- CreateIndex
CREATE INDEX "agent_integrations_agentId_idx" ON "agent_integrations"("agentId");

-- CreateIndex
CREATE INDEX "agent_integrations_type_idx" ON "agent_integrations"("type");

-- CreateIndex
CREATE INDEX "agent_permissions_agentId_idx" ON "agent_permissions"("agentId");

-- CreateIndex
CREATE INDEX "agent_permissions_userId_idx" ON "agent_permissions"("userId");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_inviterId_fkey" FOREIGN KEY ("inviterId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "two_factors" ADD CONSTRAINT "two_factors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "passkeys" ADD CONSTRAINT "passkeys_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agents" ADD CONSTRAINT "agents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agents" ADD CONSTRAINT "agents_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_interfaces" ADD CONSTRAINT "chat_interfaces_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "agents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "data_sources" ADD CONSTRAINT "data_sources_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "agents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "data_sources" ADD CONSTRAINT "data_sources_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "agents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "agents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_analytics" ADD CONSTRAINT "agent_analytics_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "agents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_workflows" ADD CONSTRAINT "agent_workflows_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "agents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_knowledge_bases" ADD CONSTRAINT "agent_knowledge_bases_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "agents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_integrations" ADD CONSTRAINT "agent_integrations_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "agents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_permissions" ADD CONSTRAINT "agent_permissions_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "agents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_permissions" ADD CONSTRAINT "agent_permissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
