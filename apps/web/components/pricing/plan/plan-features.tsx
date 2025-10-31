import { SELF_SERVE_PAID_PLANS } from "@workspace/utils";
import { AdvancedLinkFeaturesTooltip } from "@workspace/ui/components/tooltip-advanced-link-features";
import { motion } from "framer-motion";
import { cn } from "@workspace/utils/functions/cn";
import {
  SimpleTooltipContent,
  Tooltip,
} from "@workspace/ui/components/tooltip";
import { PLAN_FEATURE_ICONS } from "@workspace/utils/icons/plan-feature-icons";
import { Check } from "lucide-react";

export function PlanFeatures({
  plan,
  className,
}: {
  plan: string;
  className?: string;
}) {
  const selectedPlan =
    SELF_SERVE_PAID_PLANS.find(
      (p) => p.name.toLowerCase() === plan.toLowerCase()
    ) ?? SELF_SERVE_PAID_PLANS[0];

  return (
    <motion.div
      variants={{
        show: {
          transition: {
            staggerChildren: 0.08,
          },
        },
      }}
      initial="hidden"
      animate="show"
      className={cn("flex flex-col gap-2", className)}
    >
      {selectedPlan?.featureTitle && (
        <motion.div
          key="business-plan-feature"
          variants={{
            hidden: { opacity: 0, y: 10 },
            show: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.3, type: "spring" },
            },
          }}
          className="text-start text-sm text-neutral-500"
        >
          {selectedPlan.featureTitle}
        </motion.div>
      )}
      {selectedPlan?.features?.map(({ id, text, tooltip }, i) => {
        const Icon =
          id && id in PLAN_FEATURE_ICONS
            ? PLAN_FEATURE_ICONS[id as keyof typeof PLAN_FEATURE_ICONS]
            : Check;

        return (
          <motion.div
            key={i}
            variants={{
              hidden: { opacity: 0, y: 10 },
              show: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.3, type: "spring" },
              },
            }}
            className="flex items-center space-x-2 text-sm text-neutral-500"
          >
            <Icon className="size-4" />

            {tooltip ? (
              <Tooltip
                content={
                  typeof tooltip === "string" ? (
                    tooltip === "ADVANCED_LINK_FEATURES" ? (
                      <AdvancedLinkFeaturesTooltip />
                    ) : (
                      tooltip
                    )
                  ) : (
                    <SimpleTooltipContent {...tooltip} />
                  )
                }
              >
                <p className="cursor-help text-neutral-600 underline decoration-dotted underline-offset-2">
                  {text}
                </p>
              </Tooltip>
            ) : (
              <p className="text-neutral-600">{text}</p>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
