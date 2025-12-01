/*
  Warnings:

  - You are about to drop the column `agent_id` on the `apply_tenant_users` table. All the data in the column will be lost.
  - You are about to drop the column `is_allowed` on the `apply_tenant_users` table. All the data in the column will be lost.
  - You are about to drop the column `is_verified` on the `apply_tenant_users` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `apply_tenant_users` table. All the data in the column will be lost.
  - You are about to drop the column `phone_number` on the `apply_tenant_users` table. All the data in the column will be lost.
  - You are about to drop the `_PlanFeatures` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `apply_role_field_definitions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `apply_role_fields_sections` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `apply_tenant_user_auth_providers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `apply_user_field_values` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tech_activity_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tech_agent_student_app_required_docs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tech_agent_student_application_docs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tech_agent_student_applications` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tech_agent_student_docs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tech_agent_student_interests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tech_agent_student_meta` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tech_agent_student_required_docs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tech_agents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tech_all_feature_elements` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tech_applications_status` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tech_brand_elements` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tech_campaign_recipients` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tech_cities` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tech_countries` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tech_currencies` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tech_disciplines` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tech_domain_requests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tech_domains` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tech_explorer_elements` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tech_feature_elements` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tech_general_settings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tech_intakes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tech_mail_configurations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tech_newsletter_campaigns` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tech_newsletter_subscribers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tech_pages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tech_partner_types` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tech_payment_settings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tech_payments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tech_permissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tech_plan_features` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tech_plans` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tech_role_permissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tech_roles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tech_sms_configurations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tech_software_elements` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tech_states` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tech_student_app_required_docs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tech_student_application_docs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tech_student_applications` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tech_student_docs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tech_student_interests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tech_student_meta` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tech_student_required_docs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tech_study_levels` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tech_subscription_requests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tech_subscriptions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tech_tenant_users` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tech_tenants` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tech_testimonial_elements` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tech_track_agent_app_status` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tech_track_student_app_status` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tech_universities` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tech_university_courses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tech_university_types` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tech_users` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tech_website_sections` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tech_why_us_elements` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[uuid]` on the table `apply_tenant_users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tenant_id,email]` on the table `apply_tenant_users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `apply_tenants` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `password_hash` to the `apply_tenant_users` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `role` on the `apply_tenant_users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - The required column `uuid` was added to the `apply_tenants` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- CreateEnum
CREATE TYPE "DomainType" AS ENUM ('SUBDOMAIN', 'CUSTOM');

-- CreateEnum
CREATE TYPE "TenantUserRole" AS ENUM ('TENANT_ADMIN', 'TENANT_STAFF', 'TENANT_AGENT', 'TENANT_STUDENT');

-- CreateEnum
CREATE TYPE "SupportCategory" AS ENUM ('GENERAL', 'TECHNICAL', 'BILLING', 'APPLICATION', 'DOCUMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "SupportPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "SupportStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "PermissionModule" AS ENUM ('DASHBOARD', 'STUDENTS', 'AGENTS', 'UNIVERSITIES', 'COURSES', 'APPLICATIONS', 'SUPPORT', 'COMMISSIONS', 'SETTINGS', 'REPORTS');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'DOCUMENTS_REQUESTED', 'INTERVIEW_SCHEDULED', 'CONDITIONAL_OFFER', 'UNCONDITIONAL_OFFER', 'ACCEPTED', 'REJECTED', 'WITHDRAWN', 'DEFERRED');

-- CreateEnum
CREATE TYPE "StudentType" AS ENUM ('DIRECT', 'AGENT_MANAGED');

-- CreateEnum
CREATE TYPE "DomainStatus" AS ENUM ('PENDING', 'VERIFIED', 'ACTIVE', 'INACTIVE', 'REJECTED');

-- DropForeignKey
ALTER TABLE "public"."_PlanFeatures" DROP CONSTRAINT "_PlanFeatures_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_PlanFeatures" DROP CONSTRAINT "_PlanFeatures_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."apply_role_field_definitions" DROP CONSTRAINT "apply_role_field_definitions_section_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."apply_tenant_user_auth_providers" DROP CONSTRAINT "apply_tenant_user_auth_providers_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."apply_tenant_users" DROP CONSTRAINT "apply_tenant_users_agent_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."apply_user_field_values" DROP CONSTRAINT "apply_user_field_values_field_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_activity_logs" DROP CONSTRAINT "tech_activity_logs_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_agent_student_app_required_docs" DROP CONSTRAINT "tech_agent_student_app_required_docs_application_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_agent_student_application_docs" DROP CONSTRAINT "tech_agent_student_application_docs_application_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_agent_student_application_docs" DROP CONSTRAINT "tech_agent_student_application_docs_document_type_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_agent_student_application_docs" DROP CONSTRAINT "tech_agent_student_application_docs_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_agent_student_application_docs" DROP CONSTRAINT "tech_agent_student_application_docs_verified_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_agent_student_applications" DROP CONSTRAINT "tech_agent_student_applications_agent_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_agent_student_applications" DROP CONSTRAINT "tech_agent_student_applications_agent_student_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_agent_student_applications" DROP CONSTRAINT "tech_agent_student_applications_assigned_to_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_agent_student_applications" DROP CONSTRAINT "tech_agent_student_applications_course_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_agent_student_applications" DROP CONSTRAINT "tech_agent_student_applications_status_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_agent_student_docs" DROP CONSTRAINT "tech_agent_student_docs_document_type_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_agent_student_docs" DROP CONSTRAINT "tech_agent_student_docs_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_agent_student_docs" DROP CONSTRAINT "tech_agent_student_docs_verified_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_agent_student_interests" DROP CONSTRAINT "tech_agent_student_interests_student_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_agent_student_meta" DROP CONSTRAINT "tech_agent_student_meta_agent_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_agent_student_meta" DROP CONSTRAINT "tech_agent_student_meta_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_agents" DROP CONSTRAINT "tech_agents_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_all_feature_elements" DROP CONSTRAINT "tech_all_feature_elements_section_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_brand_elements" DROP CONSTRAINT "tech_brand_elements_section_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_campaign_recipients" DROP CONSTRAINT "tech_campaign_recipients_campaignId_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_campaign_recipients" DROP CONSTRAINT "tech_campaign_recipients_subscriberId_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_cities" DROP CONSTRAINT "tech_cities_state_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_cities" DROP CONSTRAINT "tech_cities_tenant_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_countries" DROP CONSTRAINT "tech_countries_tenant_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_disciplines" DROP CONSTRAINT "tech_disciplines_tenant_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_domain_requests" DROP CONSTRAINT "tech_domain_requests_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_domains" DROP CONSTRAINT "tech_domains_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_explorer_elements" DROP CONSTRAINT "tech_explorer_elements_section_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_feature_elements" DROP CONSTRAINT "tech_feature_elements_section_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_intakes" DROP CONSTRAINT "tech_intakes_tenant_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_newsletter_campaigns" DROP CONSTRAINT "tech_newsletter_campaigns_sentBy_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_pages" DROP CONSTRAINT "tech_pages_authorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_partner_types" DROP CONSTRAINT "tech_partner_types_tenant_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_payments" DROP CONSTRAINT "tech_payments_planId_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_payments" DROP CONSTRAINT "tech_payments_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_role_permissions" DROP CONSTRAINT "tech_role_permissions_permissionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_role_permissions" DROP CONSTRAINT "tech_role_permissions_roleId_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_software_elements" DROP CONSTRAINT "tech_software_elements_section_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_states" DROP CONSTRAINT "tech_states_country_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_states" DROP CONSTRAINT "tech_states_tenant_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_student_app_required_docs" DROP CONSTRAINT "tech_student_app_required_docs_application_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_student_application_docs" DROP CONSTRAINT "tech_student_application_docs_application_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_student_application_docs" DROP CONSTRAINT "tech_student_application_docs_document_type_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_student_application_docs" DROP CONSTRAINT "tech_student_application_docs_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_student_application_docs" DROP CONSTRAINT "tech_student_application_docs_verified_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_student_applications" DROP CONSTRAINT "tech_student_applications_application_status_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_student_applications" DROP CONSTRAINT "tech_student_applications_assigned_to_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_student_applications" DROP CONSTRAINT "tech_student_applications_course_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_student_applications" DROP CONSTRAINT "tech_student_applications_student_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_student_docs" DROP CONSTRAINT "tech_student_docs_document_type_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_student_docs" DROP CONSTRAINT "tech_student_docs_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_student_docs" DROP CONSTRAINT "tech_student_docs_verified_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_student_interests" DROP CONSTRAINT "tech_student_interests_student_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_student_meta" DROP CONSTRAINT "tech_student_meta_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_study_levels" DROP CONSTRAINT "tech_study_levels_tenant_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_subscription_requests" DROP CONSTRAINT "tech_subscription_requests_planId_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_subscription_requests" DROP CONSTRAINT "tech_subscription_requests_reviewedBy_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_subscription_requests" DROP CONSTRAINT "tech_subscription_requests_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_subscriptions" DROP CONSTRAINT "tech_subscriptions_approvedBy_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_subscriptions" DROP CONSTRAINT "tech_subscriptions_planId_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_subscriptions" DROP CONSTRAINT "tech_subscriptions_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_tenant_users" DROP CONSTRAINT "tech_tenant_users_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_tenant_users" DROP CONSTRAINT "tech_tenant_users_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_tenants" DROP CONSTRAINT "tech_tenants_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_tenants" DROP CONSTRAINT "tech_tenants_planId_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_testimonial_elements" DROP CONSTRAINT "tech_testimonial_elements_section_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_track_agent_app_status" DROP CONSTRAINT "tech_track_agent_app_status_agent_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_track_agent_app_status" DROP CONSTRAINT "tech_track_agent_app_status_application_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_track_agent_app_status" DROP CONSTRAINT "tech_track_agent_app_status_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_track_student_app_status" DROP CONSTRAINT "tech_track_student_app_status_application_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_track_student_app_status" DROP CONSTRAINT "tech_track_student_app_status_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_universities" DROP CONSTRAINT "tech_universities_city_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_universities" DROP CONSTRAINT "tech_universities_country_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_universities" DROP CONSTRAINT "tech_universities_kind_of_partners_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_universities" DROP CONSTRAINT "tech_universities_state_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_universities" DROP CONSTRAINT "tech_universities_tenant_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_universities" DROP CONSTRAINT "tech_universities_type_of_university_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_university_courses" DROP CONSTRAINT "tech_university_courses_city_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_university_courses" DROP CONSTRAINT "tech_university_courses_country_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_university_courses" DROP CONSTRAINT "tech_university_courses_discipline_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_university_courses" DROP CONSTRAINT "tech_university_courses_intake_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_university_courses" DROP CONSTRAINT "tech_university_courses_kind_of_partners_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_university_courses" DROP CONSTRAINT "tech_university_courses_state_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_university_courses" DROP CONSTRAINT "tech_university_courses_study_level_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_university_courses" DROP CONSTRAINT "tech_university_courses_tenant_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_university_courses" DROP CONSTRAINT "tech_university_courses_type_of_university_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_university_courses" DROP CONSTRAINT "tech_university_courses_university_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_university_types" DROP CONSTRAINT "tech_university_types_tenant_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_users" DROP CONSTRAINT "tech_users_roleId_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_website_sections" DROP CONSTRAINT "tech_website_sections_created_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_website_sections" DROP CONSTRAINT "tech_website_sections_updated_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."tech_why_us_elements" DROP CONSTRAINT "tech_why_us_elements_section_id_fkey";

-- DropIndex
DROP INDEX "public"."apply_tenant_users_agent_id_idx";

-- DropIndex
DROP INDEX "public"."apply_tenant_users_email_key";

-- AlterTable
ALTER TABLE "apply_tenant_users" DROP COLUMN "agent_id",
DROP COLUMN "is_allowed",
DROP COLUMN "is_verified",
DROP COLUMN "password",
DROP COLUMN "phone_number",
ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "is_email_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "last_login_at" TIMESTAMP(3),
ADD COLUMN     "password_hash" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT,
DROP COLUMN "role",
ADD COLUMN     "role" "TenantUserRole" NOT NULL;

-- AlterTable
ALTER TABLE "apply_tenants" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "plan_id" INTEGER,
ADD COLUMN     "settings" JSONB,
ADD COLUMN     "subscription_ends_at" TIMESTAMP(3),
ADD COLUMN     "trial_ends_at" TIMESTAMP(3),
ADD COLUMN     "uuid" TEXT NOT NULL,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- DropTable
DROP TABLE "public"."_PlanFeatures";

-- DropTable
DROP TABLE "public"."apply_role_field_definitions";

-- DropTable
DROP TABLE "public"."apply_role_fields_sections";

-- DropTable
DROP TABLE "public"."apply_tenant_user_auth_providers";

-- DropTable
DROP TABLE "public"."apply_user_field_values";

-- DropTable
DROP TABLE "public"."tech_activity_logs";

-- DropTable
DROP TABLE "public"."tech_agent_student_app_required_docs";

-- DropTable
DROP TABLE "public"."tech_agent_student_application_docs";

-- DropTable
DROP TABLE "public"."tech_agent_student_applications";

-- DropTable
DROP TABLE "public"."tech_agent_student_docs";

-- DropTable
DROP TABLE "public"."tech_agent_student_interests";

-- DropTable
DROP TABLE "public"."tech_agent_student_meta";

-- DropTable
DROP TABLE "public"."tech_agent_student_required_docs";

-- DropTable
DROP TABLE "public"."tech_agents";

-- DropTable
DROP TABLE "public"."tech_all_feature_elements";

-- DropTable
DROP TABLE "public"."tech_applications_status";

-- DropTable
DROP TABLE "public"."tech_brand_elements";

-- DropTable
DROP TABLE "public"."tech_campaign_recipients";

-- DropTable
DROP TABLE "public"."tech_cities";

-- DropTable
DROP TABLE "public"."tech_countries";

-- DropTable
DROP TABLE "public"."tech_currencies";

-- DropTable
DROP TABLE "public"."tech_disciplines";

-- DropTable
DROP TABLE "public"."tech_domain_requests";

-- DropTable
DROP TABLE "public"."tech_domains";

-- DropTable
DROP TABLE "public"."tech_explorer_elements";

-- DropTable
DROP TABLE "public"."tech_feature_elements";

-- DropTable
DROP TABLE "public"."tech_general_settings";

-- DropTable
DROP TABLE "public"."tech_intakes";

-- DropTable
DROP TABLE "public"."tech_mail_configurations";

-- DropTable
DROP TABLE "public"."tech_newsletter_campaigns";

-- DropTable
DROP TABLE "public"."tech_newsletter_subscribers";

-- DropTable
DROP TABLE "public"."tech_pages";

-- DropTable
DROP TABLE "public"."tech_partner_types";

-- DropTable
DROP TABLE "public"."tech_payment_settings";

-- DropTable
DROP TABLE "public"."tech_payments";

-- DropTable
DROP TABLE "public"."tech_permissions";

-- DropTable
DROP TABLE "public"."tech_plan_features";

-- DropTable
DROP TABLE "public"."tech_plans";

-- DropTable
DROP TABLE "public"."tech_role_permissions";

-- DropTable
DROP TABLE "public"."tech_roles";

-- DropTable
DROP TABLE "public"."tech_sms_configurations";

-- DropTable
DROP TABLE "public"."tech_software_elements";

-- DropTable
DROP TABLE "public"."tech_states";

-- DropTable
DROP TABLE "public"."tech_student_app_required_docs";

-- DropTable
DROP TABLE "public"."tech_student_application_docs";

-- DropTable
DROP TABLE "public"."tech_student_applications";

-- DropTable
DROP TABLE "public"."tech_student_docs";

-- DropTable
DROP TABLE "public"."tech_student_interests";

-- DropTable
DROP TABLE "public"."tech_student_meta";

-- DropTable
DROP TABLE "public"."tech_student_required_docs";

-- DropTable
DROP TABLE "public"."tech_study_levels";

-- DropTable
DROP TABLE "public"."tech_subscription_requests";

-- DropTable
DROP TABLE "public"."tech_subscriptions";

-- DropTable
DROP TABLE "public"."tech_tenant_users";

-- DropTable
DROP TABLE "public"."tech_tenants";

-- DropTable
DROP TABLE "public"."tech_testimonial_elements";

-- DropTable
DROP TABLE "public"."tech_track_agent_app_status";

-- DropTable
DROP TABLE "public"."tech_track_student_app_status";

-- DropTable
DROP TABLE "public"."tech_universities";

-- DropTable
DROP TABLE "public"."tech_university_courses";

-- DropTable
DROP TABLE "public"."tech_university_types";

-- DropTable
DROP TABLE "public"."tech_users";

-- DropTable
DROP TABLE "public"."tech_website_sections";

-- DropTable
DROP TABLE "public"."tech_why_us_elements";

-- DropEnum
DROP TYPE "public"."CampaignAudience";

-- DropEnum
DROP TYPE "public"."CampaignStatus";

-- DropEnum
DROP TYPE "public"."DeliveryStatus";

-- DropEnum
DROP TYPE "public"."DocStatus";

-- DropEnum
DROP TYPE "public"."DomainRequestStatus";

-- DropEnum
DROP TYPE "public"."ElementStatus";

-- DropEnum
DROP TYPE "public"."EntityType";

-- DropEnum
DROP TYPE "public"."FeeStatus";

-- DropEnum
DROP TYPE "public"."LogAction";

-- DropEnum
DROP TYPE "public"."LogSeverity";

-- DropEnum
DROP TYPE "public"."LogStatus";

-- DropEnum
DROP TYPE "public"."PageStatus";

-- DropEnum
DROP TYPE "public"."PageType";

-- DropEnum
DROP TYPE "public"."SectionStatus";

-- DropEnum
DROP TYPE "public"."UserRole";

-- CreateTable
CREATE TABLE "apply_domains" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "tenant_id" INTEGER NOT NULL,
    "domain" TEXT NOT NULL,
    "type" "DomainType" NOT NULL DEFAULT 'CUSTOM',
    "status" "DomainStatus" NOT NULL DEFAULT 'PENDING',
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "verified_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "apply_domains_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apply_plans" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price_monthly" DOUBLE PRECISION NOT NULL,
    "price_yearly" DOUBLE PRECISION,
    "features" JSONB NOT NULL,
    "limits" JSONB NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "apply_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apply_subscription_requests" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "tenant_id" INTEGER NOT NULL,
    "plan_id" INTEGER NOT NULL,
    "selected_modules" JSONB NOT NULL,
    "status" "SubscriptionRequestStatus" NOT NULL DEFAULT 'PENDING',
    "requested_by" INTEGER,
    "reviewed_by" INTEGER,
    "reviewed_at" TIMESTAMP(3),
    "admin_notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "apply_subscription_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apply_subscriptions" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "tenant_id" INTEGER NOT NULL,
    "plan_id" INTEGER NOT NULL,
    "activated_modules" JSONB NOT NULL,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "starts_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ends_at" TIMESTAMP(3) NOT NULL,
    "is_auto_renew" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "apply_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apply_payments" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "tenant_id" INTEGER NOT NULL,
    "plan_id" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "payment_method" TEXT NOT NULL,
    "transaction_id" TEXT,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "billing_period" TEXT NOT NULL,
    "due_date" TIMESTAMP(3),
    "paid_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "apply_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apply_tenant_agent_students" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "tenant_id" INTEGER NOT NULL,
    "agent_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,
    "can_login" BOOLEAN NOT NULL DEFAULT true,
    "can_edit_profile" BOOLEAN NOT NULL DEFAULT false,
    "can_view_applications" BOOLEAN NOT NULL DEFAULT true,
    "can_create_applications" BOOLEAN NOT NULL DEFAULT false,
    "can_upload_documents" BOOLEAN NOT NULL DEFAULT false,
    "commission_rate" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "apply_tenant_agent_students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apply_tenant_support_replies" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "tenant_id" INTEGER NOT NULL,
    "ticket_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "is_internal" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "apply_tenant_support_replies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apply_tenant_universities" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "tenant_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "country_code" TEXT NOT NULL,
    "state_code" TEXT,
    "city" TEXT,
    "address" TEXT,
    "website" TEXT,
    "contact_email" TEXT,
    "phone" TEXT,
    "description" TEXT,
    "logo" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "apply_tenant_universities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apply_tenant_courses" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "tenant_id" INTEGER NOT NULL,
    "university_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "study_level" TEXT NOT NULL,
    "discipline" TEXT NOT NULL,
    "duration" TEXT,
    "tuition_fee" JSONB,
    "intake_dates" JSONB,
    "requirements" JSONB,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "apply_tenant_courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apply_tenant_applications" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "tenant_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,
    "course_id" INTEGER NOT NULL,
    "intake_date" TIMESTAMP(3) NOT NULL,
    "application_status" "ApplicationStatus" NOT NULL DEFAULT 'DRAFT',
    "application_fee_status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "assigned_staff_id" INTEGER,
    "notes" JSONB,
    "submitted_at" TIMESTAMP(3),
    "decision_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "apply_tenant_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apply_tenant_user_permissions" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "tenant_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "module" "PermissionModule" NOT NULL,
    "can_view" BOOLEAN NOT NULL DEFAULT false,
    "can_create" BOOLEAN NOT NULL DEFAULT false,
    "can_edit" BOOLEAN NOT NULL DEFAULT false,
    "can_delete" BOOLEAN NOT NULL DEFAULT false,
    "can_manage" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "apply_tenant_user_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apply_tenant_staff_profiles" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "tenant_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "department" TEXT,
    "position" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "apply_tenant_staff_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apply_tenant_agent_profiles" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "tenant_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "agency_name" TEXT NOT NULL,
    "registration_number" TEXT,
    "business_address" JSONB,
    "contact_person" TEXT,
    "website" TEXT,
    "social_media" JSONB,
    "commission_rate" DOUBLE PRECISION NOT NULL DEFAULT 15.0,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "total_students" INTEGER NOT NULL DEFAULT 0,
    "successful_applications" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "apply_tenant_agent_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apply_tenant_student_profiles" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "tenant_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "student_type" "StudentType" NOT NULL DEFAULT 'DIRECT',
    "date_of_birth" TIMESTAMP(3),
    "gender" TEXT,
    "nationality" TEXT,
    "passport_number" TEXT,
    "address" JSONB,
    "emergency_contact" JSONB,
    "education_background" JSONB,
    "test_scores" JSONB,
    "preferred_countries" JSONB,
    "preferred_levels" JSONB,
    "preferred_disciplines" JSONB,
    "budget_range" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "apply_tenant_student_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apply_tenant_admin_profiles" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "tenant_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "is_primary_admin" BOOLEAN NOT NULL DEFAULT true,
    "can_manage_billing" BOOLEAN NOT NULL DEFAULT true,
    "can_manage_users" BOOLEAN NOT NULL DEFAULT true,
    "can_manage_settings" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "apply_tenant_admin_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apply_tenant_support_tickets" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "tenant_id" INTEGER NOT NULL,
    "student_id" INTEGER,
    "agent_id" INTEGER,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "SupportCategory" NOT NULL,
    "priority" "SupportPriority" NOT NULL DEFAULT 'MEDIUM',
    "status" "SupportStatus" NOT NULL DEFAULT 'OPEN',
    "assigned_staff_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "apply_tenant_support_tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_apply_tenant_applicationsToapply_tenant_universities" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_apply_tenant_applicationsToapply_tenant_universities_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "apply_domains_uuid_key" ON "apply_domains"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "apply_domains_domain_key" ON "apply_domains"("domain");

-- CreateIndex
CREATE INDEX "apply_domains_tenant_id_idx" ON "apply_domains"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "apply_domains_tenant_id_domain_key" ON "apply_domains"("tenant_id", "domain");

-- CreateIndex
CREATE UNIQUE INDEX "apply_plans_uuid_key" ON "apply_plans"("uuid");

-- CreateIndex
CREATE INDEX "apply_plans_is_active_idx" ON "apply_plans"("is_active");

-- CreateIndex
CREATE INDEX "apply_plans_is_default_idx" ON "apply_plans"("is_default");

-- CreateIndex
CREATE UNIQUE INDEX "apply_subscription_requests_uuid_key" ON "apply_subscription_requests"("uuid");

-- CreateIndex
CREATE INDEX "apply_subscription_requests_tenant_id_idx" ON "apply_subscription_requests"("tenant_id");

-- CreateIndex
CREATE INDEX "apply_subscription_requests_status_idx" ON "apply_subscription_requests"("status");

-- CreateIndex
CREATE UNIQUE INDEX "apply_subscriptions_uuid_key" ON "apply_subscriptions"("uuid");

-- CreateIndex
CREATE INDEX "apply_subscriptions_tenant_id_idx" ON "apply_subscriptions"("tenant_id");

-- CreateIndex
CREATE INDEX "apply_subscriptions_status_idx" ON "apply_subscriptions"("status");

-- CreateIndex
CREATE UNIQUE INDEX "apply_subscriptions_tenant_id_plan_id_key" ON "apply_subscriptions"("tenant_id", "plan_id");

-- CreateIndex
CREATE UNIQUE INDEX "apply_payments_uuid_key" ON "apply_payments"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "apply_payments_transaction_id_key" ON "apply_payments"("transaction_id");

-- CreateIndex
CREATE INDEX "apply_payments_tenant_id_idx" ON "apply_payments"("tenant_id");

-- CreateIndex
CREATE INDEX "apply_payments_status_idx" ON "apply_payments"("status");

-- CreateIndex
CREATE UNIQUE INDEX "apply_tenant_agent_students_uuid_key" ON "apply_tenant_agent_students"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "apply_tenant_agent_students_student_id_key" ON "apply_tenant_agent_students"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "apply_tenant_agent_students_tenant_id_agent_id_student_id_key" ON "apply_tenant_agent_students"("tenant_id", "agent_id", "student_id");

-- CreateIndex
CREATE UNIQUE INDEX "apply_tenant_support_replies_uuid_key" ON "apply_tenant_support_replies"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "apply_tenant_universities_uuid_key" ON "apply_tenant_universities"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "apply_tenant_universities_tenant_id_slug_key" ON "apply_tenant_universities"("tenant_id", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "apply_tenant_courses_uuid_key" ON "apply_tenant_courses"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "apply_tenant_courses_tenant_id_university_id_slug_key" ON "apply_tenant_courses"("tenant_id", "university_id", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "apply_tenant_applications_uuid_key" ON "apply_tenant_applications"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "apply_tenant_applications_tenant_id_student_id_course_id_in_key" ON "apply_tenant_applications"("tenant_id", "student_id", "course_id", "intake_date");

-- CreateIndex
CREATE UNIQUE INDEX "apply_tenant_user_permissions_uuid_key" ON "apply_tenant_user_permissions"("uuid");

-- CreateIndex
CREATE INDEX "apply_tenant_user_permissions_tenant_id_idx" ON "apply_tenant_user_permissions"("tenant_id");

-- CreateIndex
CREATE INDEX "apply_tenant_user_permissions_user_id_idx" ON "apply_tenant_user_permissions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "apply_tenant_user_permissions_tenant_id_user_id_module_key" ON "apply_tenant_user_permissions"("tenant_id", "user_id", "module");

-- CreateIndex
CREATE UNIQUE INDEX "apply_tenant_staff_profiles_uuid_key" ON "apply_tenant_staff_profiles"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "apply_tenant_staff_profiles_user_id_key" ON "apply_tenant_staff_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "apply_tenant_staff_profiles_tenant_id_user_id_key" ON "apply_tenant_staff_profiles"("tenant_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "apply_tenant_agent_profiles_uuid_key" ON "apply_tenant_agent_profiles"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "apply_tenant_agent_profiles_user_id_key" ON "apply_tenant_agent_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "apply_tenant_agent_profiles_tenant_id_user_id_key" ON "apply_tenant_agent_profiles"("tenant_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "apply_tenant_student_profiles_uuid_key" ON "apply_tenant_student_profiles"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "apply_tenant_student_profiles_user_id_key" ON "apply_tenant_student_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "apply_tenant_student_profiles_tenant_id_user_id_key" ON "apply_tenant_student_profiles"("tenant_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "apply_tenant_admin_profiles_uuid_key" ON "apply_tenant_admin_profiles"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "apply_tenant_admin_profiles_user_id_key" ON "apply_tenant_admin_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "apply_tenant_admin_profiles_tenant_id_user_id_key" ON "apply_tenant_admin_profiles"("tenant_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "apply_tenant_support_tickets_uuid_key" ON "apply_tenant_support_tickets"("uuid");

-- CreateIndex
CREATE INDEX "_apply_tenant_applicationsToapply_tenant_universities_B_index" ON "_apply_tenant_applicationsToapply_tenant_universities"("B");

-- CreateIndex
CREATE UNIQUE INDEX "apply_tenant_users_uuid_key" ON "apply_tenant_users"("uuid");

-- CreateIndex
CREATE INDEX "apply_tenant_users_email_idx" ON "apply_tenant_users"("email");

-- CreateIndex
CREATE INDEX "apply_tenant_users_role_idx" ON "apply_tenant_users"("role");

-- CreateIndex
CREATE UNIQUE INDEX "apply_tenant_users_tenant_id_email_key" ON "apply_tenant_users"("tenant_id", "email");

-- CreateIndex
CREATE UNIQUE INDEX "apply_tenants_uuid_key" ON "apply_tenants"("uuid");

-- CreateIndex
CREATE INDEX "apply_tenants_status_idx" ON "apply_tenants"("status");

-- AddForeignKey
ALTER TABLE "apply_tenants" ADD CONSTRAINT "apply_tenants_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "apply_plans"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apply_domains" ADD CONSTRAINT "apply_domains_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "apply_tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apply_subscription_requests" ADD CONSTRAINT "apply_subscription_requests_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "apply_tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apply_subscription_requests" ADD CONSTRAINT "apply_subscription_requests_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "apply_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apply_subscriptions" ADD CONSTRAINT "apply_subscriptions_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "apply_tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apply_subscriptions" ADD CONSTRAINT "apply_subscriptions_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "apply_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apply_payments" ADD CONSTRAINT "apply_payments_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "apply_tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apply_payments" ADD CONSTRAINT "apply_payments_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "apply_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apply_tenant_users" ADD CONSTRAINT "apply_tenant_users_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "apply_tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apply_tenant_agent_students" ADD CONSTRAINT "apply_tenant_agent_students_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "apply_tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apply_tenant_agent_students" ADD CONSTRAINT "apply_tenant_agent_students_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "apply_tenant_agent_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apply_tenant_agent_students" ADD CONSTRAINT "apply_tenant_agent_students_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "apply_tenant_student_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apply_tenant_support_replies" ADD CONSTRAINT "apply_tenant_support_replies_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "apply_tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apply_tenant_support_replies" ADD CONSTRAINT "apply_tenant_support_replies_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "apply_tenant_support_tickets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apply_tenant_support_replies" ADD CONSTRAINT "apply_tenant_support_replies_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "apply_tenant_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apply_tenant_universities" ADD CONSTRAINT "apply_tenant_universities_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "apply_tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apply_tenant_courses" ADD CONSTRAINT "apply_tenant_courses_university_id_fkey" FOREIGN KEY ("university_id") REFERENCES "apply_tenant_universities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apply_tenant_courses" ADD CONSTRAINT "apply_tenant_courses_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "apply_tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apply_tenant_applications" ADD CONSTRAINT "apply_tenant_applications_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "apply_tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apply_tenant_applications" ADD CONSTRAINT "apply_tenant_applications_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "apply_tenant_student_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apply_tenant_applications" ADD CONSTRAINT "apply_tenant_applications_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "apply_tenant_courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apply_tenant_applications" ADD CONSTRAINT "apply_tenant_applications_assigned_staff_id_fkey" FOREIGN KEY ("assigned_staff_id") REFERENCES "apply_tenant_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apply_tenant_user_permissions" ADD CONSTRAINT "apply_tenant_user_permissions_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "apply_tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apply_tenant_user_permissions" ADD CONSTRAINT "apply_tenant_user_permissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "apply_tenant_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apply_tenant_staff_profiles" ADD CONSTRAINT "apply_tenant_staff_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "apply_tenant_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apply_tenant_staff_profiles" ADD CONSTRAINT "apply_tenant_staff_profiles_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "apply_tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apply_tenant_agent_profiles" ADD CONSTRAINT "apply_tenant_agent_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "apply_tenant_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apply_tenant_agent_profiles" ADD CONSTRAINT "apply_tenant_agent_profiles_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "apply_tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apply_tenant_student_profiles" ADD CONSTRAINT "apply_tenant_student_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "apply_tenant_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apply_tenant_student_profiles" ADD CONSTRAINT "apply_tenant_student_profiles_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "apply_tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apply_tenant_admin_profiles" ADD CONSTRAINT "apply_tenant_admin_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "apply_tenant_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apply_tenant_admin_profiles" ADD CONSTRAINT "apply_tenant_admin_profiles_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "apply_tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apply_tenant_support_tickets" ADD CONSTRAINT "apply_tenant_support_tickets_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "apply_tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apply_tenant_support_tickets" ADD CONSTRAINT "apply_tenant_support_tickets_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "apply_tenant_student_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apply_tenant_support_tickets" ADD CONSTRAINT "apply_tenant_support_tickets_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "apply_tenant_agent_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apply_tenant_support_tickets" ADD CONSTRAINT "apply_tenant_support_tickets_assigned_staff_id_fkey" FOREIGN KEY ("assigned_staff_id") REFERENCES "apply_tenant_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_apply_tenant_applicationsToapply_tenant_universities" ADD CONSTRAINT "_apply_tenant_applicationsToapply_tenant_universities_A_fkey" FOREIGN KEY ("A") REFERENCES "apply_tenant_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_apply_tenant_applicationsToapply_tenant_universities" ADD CONSTRAINT "_apply_tenant_applicationsToapply_tenant_universities_B_fkey" FOREIGN KEY ("B") REFERENCES "apply_tenant_universities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
