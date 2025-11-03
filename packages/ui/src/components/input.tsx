import { cn } from "@workspace/utils/functions/cn";
import { AlertCircle } from "lucide-react";
import React, { useCallback, useState } from "react";
import { Eye, EyeSlash } from "@workspace/utils/icons/index";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const toggleIsPasswordVisible = useCallback(
      () => setIsPasswordVisible((prev) => !prev),
      []
    );

    const inputType = type === "password" && isPasswordVisible ? "text" : type;

    return (
      <div className="w-full">
        <div className="relative">
          <input
            type={inputType}
            className={cn(
              // Base styles
              "flex h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-all",
              "placeholder:text-muted-foreground",
              "file:border-0 file:bg-transparent file:text-sm file:font-medium",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/80",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "selection:bg-primary selection:text-primary-foreground",

              // Light theme
              "border-border text-foreground",
              "bg-background",
              "read-only:bg-muted/50 read-only:text-muted-foreground",

              // Dark theme enhancements
              "dark:bg-input/30 dark:border-none",
              "dark:read-only:bg-muted/20",

              // Error states
              error && "border-destructive focus-visible:ring-destructive/50",
              error && "dark:border-destructive/80",

              // Password field padding adjustment
              type === "password" && "pr-10",
              error && type === "password" && "pr-20",

              className
            )}
            ref={ref}
            aria-invalid={error ? "true" : "false"}
            {...props}
          />

          {/* Icons container */}
          <div className="absolute inset-y-0 right-0 flex items-center gap-1 pr-3">
            {/* Error icon */}
            {error && (
              <div
                className={cn(
                  "flex items-center",
                  type === "password" &&
                    "transition-opacity duration-200 group-hover:opacity-0"
                )}
              >
                <AlertCircle
                  className="h-4 w-4 text-destructive"
                  fill="currentColor"
                  aria-hidden="true"
                />
              </div>
            )}

            {/* Password toggle button */}
            {type === "password" && (
              <button
                type="button"
                onClick={toggleIsPasswordVisible}
                className={cn(
                  "flex items-center cursor-pointer justify-center rounded-sm p-1",
                  "text-muted-foreground hover:text-foreground",
                  "transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  error &&
                    "opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                )}
                aria-label={
                  isPasswordVisible ? "Hide password" : "Show password"
                }
                aria-pressed={isPasswordVisible}
              >
                {isPasswordVisible ? (
                  <EyeSlash className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Error message */}
        {error && (
          <p
            className="mt-2 flex items-center gap-1.5 text-sm text-destructive"
            role="alert"
            aria-live="polite"
          >
            <AlertCircle className="h-3.5 w-3.5 flex-none" aria-hidden="true" />
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
