-- Additive talent marketplace migration; DOES NOT modify historical service tables
CREATE TYPE "CompanyVerification" AS ENUM ('PENDING','VERIFIED','REJECTED');
CREATE TYPE "CompanyMemberRole" AS ENUM ('OWNER','EDITOR','VIEWER');
CREATE TYPE "JobStatus" AS ENUM ('DRAFT','PUBLISHED','EXPIRED','CLOSED');
CREATE TYPE "JobEmployment" AS ENUM ('FULL_TIME','PART_TIME','CONTRACT','FREELANCE');
CREATE TYPE "JobRemote" AS ENUM ('ONSITE','HYBRID','REMOTE');
CREATE TYPE "SalaryPeriod" AS ENUM ('HOUR','MONTH','YEAR','FIXED');
CREATE TYPE "ApplicationStatus" AS ENUM ('APPLIED','REVIEWING','INTERVIEW','OFFER','HIRED','REJECTED','WITHDRAWN');
CREATE TYPE "JobAlertFrequency" AS ENUM ('DAILY','WEEKLY');

CREATE TABLE "candidate_profiles" (
  "id" TEXT NOT NULL PRIMARY KEY, "profile_id" TEXT NOT NULL UNIQUE,
  "headline" TEXT, "bio" TEXT, "location" TEXT,
  "github_url" TEXT, "linkedin_url" TEXT, "hourly_rate" DECIMAL(12,2),
  "skills" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "is_visible" BOOLEAN NOT NULL DEFAULT false,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "candidate_profiles_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE "companies" (
  "id" TEXT NOT NULL PRIMARY KEY, "owner_id" TEXT NOT NULL,
  "name" TEXT NOT NULL, "slug" TEXT NOT NULL UNIQUE,
  "description" TEXT, "website" TEXT, "logo_url" TEXT, "location" TEXT,
  "verification" "CompanyVerification" NOT NULL DEFAULT 'PENDING',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "companies_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE TABLE "company_members" (
  "id" TEXT NOT NULL PRIMARY KEY, "company_id" TEXT NOT NULL, "profile_id" TEXT NOT NULL,
  "role" "CompanyMemberRole" NOT NULL DEFAULT 'EDITOR',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "company_members_company_id_profile_id_key" UNIQUE ("company_id","profile_id"),
  CONSTRAINT "company_members_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "company_members_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE "jobs" (
  "id" TEXT NOT NULL PRIMARY KEY, "company_id" TEXT NOT NULL,
  "slug" TEXT NOT NULL UNIQUE, "title" TEXT NOT NULL, "description" TEXT NOT NULL,
  "employment" "JobEmployment" NOT NULL, "remote" "JobRemote" NOT NULL, "location" TEXT,
  "salary_min" DECIMAL(12,2) NOT NULL, "salary_max" DECIMAL(12,2) NOT NULL,
  "salary_period" "SalaryPeriod" NOT NULL DEFAULT 'MONTH',
  "currency" VARCHAR(3) NOT NULL DEFAULT 'EUR',
  "skills" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "status" "JobStatus" NOT NULL DEFAULT 'DRAFT',
  "published_at" TIMESTAMP(3), "expires_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "jobs_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "jobs_salary_range_valid" CHECK ("salary_min" >= 0 AND "salary_max" >= "salary_min")
);
CREATE TABLE "job_applications" (
  "id" TEXT NOT NULL PRIMARY KEY, "job_id" TEXT NOT NULL, "candidate_id" TEXT NOT NULL,
  "cover_letter" TEXT, "status" "ApplicationStatus" NOT NULL DEFAULT 'APPLIED',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "job_applications_job_id_candidate_id_key" UNIQUE ("job_id","candidate_id"),
  CONSTRAINT "job_applications_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "job_applications_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "candidate_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE "job_alerts" (
  "id" TEXT NOT NULL PRIMARY KEY, "profile_id" TEXT NOT NULL,
  "query" TEXT, "location" TEXT,
  "employment" "JobEmployment", "remote" "JobRemote",
  "frequency" "JobAlertFrequency" NOT NULL DEFAULT 'DAILY',
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "last_delivered_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "job_alerts_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "companies_owner_id_idx" ON "companies" ("owner_id");
CREATE INDEX "companies_verification_idx" ON "companies" ("verification");
CREATE INDEX "company_members_profile_id_idx" ON "company_members" ("profile_id");
CREATE INDEX "jobs_status_published_at_idx" ON "jobs" ("status","published_at");
CREATE INDEX "jobs_company_id_status_idx" ON "jobs" ("company_id","status");
CREATE INDEX "jobs_employment_remote_idx" ON "jobs" ("employment","remote");
CREATE INDEX "jobs_expires_at_idx" ON "jobs" ("expires_at");
CREATE INDEX "job_applications_candidate_id_created_at_idx" ON "job_applications" ("candidate_id","created_at");
CREATE INDEX "job_applications_job_id_status_idx" ON "job_applications" ("job_id","status");
CREATE INDEX "job_alerts_profile_id_is_active_idx" ON "job_alerts" ("profile_id","is_active");
