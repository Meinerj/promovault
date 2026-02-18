// Database package entry point — re-exports Prisma client and types

export { PrismaClient } from "@prisma/client";
export type {
  User,
  Organization,
  Category,
  Subscription,
  Lead,
  PageView,
  BlogPost,
  Application,
  Image,
  Offer,
  AuditLog,
  SiteSettings,
  Account,
  Session,
  VerificationToken,
  OrganizationCategory,
} from "@prisma/client";

export {
  UserRole,
  OrganizationStatus,
  SubscriptionTier,
  SubscriptionInterval,
  SubscriptionStatus,
  ApplicationStatus,
  LeadType,
  BlogPostStatus,
  ImageType,
  DeviceType,
} from "@prisma/client";

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
