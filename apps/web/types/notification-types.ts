import z from "@/lib/zod";

export const notificationTypes = z.enum([
    "linkUsageSummary",
    "domainConfigurationUpdates",
    "newPartnerSale",
    "newPartnerApplication",
    "newBountySubmitted",
    "newMessageFromPartner",
]);