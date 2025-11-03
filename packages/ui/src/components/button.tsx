import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@workspace/utils/functions/cn";
import { Tooltip } from "./tooltip";
import { LoadingSpinner } from "./global/loading-spinner";

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        primary:
          "border-black text-white bg-black dark:bg-white dark:border-white text-content-inverted hover:bg-inverted hover:ring-4 hover:ring-border-subtle",
        success:
          "border-blue-500 bg-blue-500 text-white hover:bg-blue-600 hover:ring-4 hover:ring-blue-100",
        danger:
          "border-red-500 bg-red-500 text-white hover:bg-red-600 hover:ring-4 hover:ring-red-100",
        "danger-outline":
          "border-transparent bg-white text-red-500 hover:bg-red-600 hover:text-white",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  text?: React.ReactNode | string;
  textWrapperClassName?: string;
  shortcutClassName?: string;
  loading?: boolean;
  icon?: React.ReactNode;
  shortcut?: string;
  right?: React.ReactNode;
  disabledTooltip?: string | React.ReactNode;
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  text,
  textWrapperClassName,
  shortcutClassName,
  loading,
  icon,
  shortcut,
  disabledTooltip,
  right,
  ...props
}: ButtonProps) {
  if (disabledTooltip) {
    return (
      <Tooltip content={disabledTooltip}>
        <div
          className={cn(
            "flex h-10 w-full cursor-not-allowed items-center justify-center gap-2 rounded-md border border-neutral-200 bg-neutral-100 px-4 text-sm text-neutral-400 transition-all focus:outline-none",
            {
              "border-transparent bg-transparent": variant?.endsWith("outline"),
            },
            className
          )}
        >
          {icon}
          {text && (
            <div
              className={cn(
                "min-w-0 truncate",
                shortcut && "flex-1 text-left",
                textWrapperClassName
              )}
            >
              {text}
            </div>
          )}
          {shortcut && (
            <kbd
              className={cn(
                "hidden rounded border border-neutral-200 bg-neutral-100 px-2 py-0.5 text-xs font-light text-neutral-400 md:inline-block",
                {
                  "bg-neutral-100": variant?.endsWith("outline"),
                },
                shortcutClassName
              )}
            >
              {shortcut}
            </kbd>
          )}
        </div>
      </Tooltip>
    );
  }

  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      // if onClick is passed, it's a "button" type, otherwise it's being used in a form, hence "submit"
      type={props.onClick ? "button" : "submit"}
      data-slot="button"
      className={cn(
        buttonVariants({ variant, size, className }),
        props.disabled || loading
          ? "cursor-not-allowed border-neutral-300 bg-black/10 dark:bg-white/60 text-black/80 dark:text-black/40 outline-none"
          : "",
        loading ? "pointer-events-none opacity-70" : "",
        className
      )}
      disabled={props.disabled || loading}
      {...props}
    >
      {loading ? <LoadingSpinner /> : icon ? icon : null}
      {text && (
        <div
          className={cn(
            "min-w-0 truncate",
            shortcut && "flex-1 text-left",
            textWrapperClassName
          )}
        >
          {text}
        </div>
      )}
      {shortcut && (
        <kbd
          className={cn(
            "hidden rounded px-2 py-0.5 text-xs font-light transition-all duration-75 md:inline-block",
            {
              "bg-neutral-700 text-neutral-400 group-hover:bg-neutral-600 group-hover:text-neutral-300":
                variant === "primary",
              "bg-neutral-200 text-neutral-400 group-hover:bg-neutral-100 group-hover:text-neutral-500":
                variant === "secondary",
              "bg-neutral-100 text-neutral-500 group-hover:bg-neutral-200":
                variant === "outline",
              "bg-red-400 text-white": variant === "danger",
              "bg-red-100 text-red-600 group-hover:bg-red-500 group-hover:text-white":
                variant === "danger-outline",
            },
            shortcutClassName
          )}
        >
          {shortcut}
        </kbd>
      )}
      {right}
    </Comp>
  );
}

export { Button, buttonVariants };
