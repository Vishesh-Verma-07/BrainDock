import * as React from "react";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

interface BaseButtonProps {
  variant?: Variant;
  size?: Size;
  icon?: LucideIcon;
  iconOnRight?: boolean;
  showArrow?: boolean;
}

interface ButtonProps
  extends BaseButtonProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

interface AnchorButtonProps
  extends BaseButtonProps,
    React.AnchorHTMLAttributes<HTMLAnchorElement> {}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-foreground text-background hover:bg-[#2a2622] active:bg-[#151210] shadow-sm hover:shadow-md active:scale-[0.97]",
  secondary:
    "bg-surface-elevated text-foreground hover:bg-[#EDE8DF] active:bg-[#E3DDD2] border border-border hover:border-foreground/15 active:scale-[0.97]",
  ghost:
    "bg-transparent text-foreground hover:bg-foreground/[0.05] active:bg-foreground/[0.08] active:scale-[0.97]",
  outline:
    "bg-transparent text-foreground border border-foreground/[0.15] hover:border-foreground/[0.3] hover:bg-foreground/[0.03] active:scale-[0.97]",
};

const sizeStyles: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm gap-1.5 rounded-md",
  md: "h-11 px-5 text-sm gap-2 rounded-md",
  lg: "h-13 px-6 text-base gap-2.5 rounded-md",
};

function ButtonInner({
  icon: Icon,
  iconOnRight = false,
  showArrow = false,
  children,
}: {
  icon?: LucideIcon;
  iconOnRight?: boolean;
  showArrow?: boolean;
  children?: React.ReactNode;
}) {
  const IconComp = Icon ?? (showArrow ? ArrowRight : null);
  // A bare arrow reads as "go", so it trails the label; custom icons honour iconOnRight.
  iconOnRight = iconOnRight || (!Icon && showArrow);

  return (
    <>
      {IconComp && !iconOnRight && (
        <IconComp
          className="w-4 h-4 shrink-0 transition-transform duration-250 ease-out-expo group-hover:translate-x-[-1px]"
          aria-hidden
        />
      )}
      {children}
      {IconComp && iconOnRight && (
        <IconComp
          className="w-4 h-4 shrink-0 transition-transform duration-250 ease-out-expo group-hover:translate-x-[3px]"
          aria-hidden
        />
      )}
    </>
  );
}

function baseClass(variant: Variant, size: Size, className?: string) {
  return cn(
    "inline-flex items-center justify-center font-medium tracking-[-0.01em] whitespace-nowrap",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
    "group cursor-pointer",
    variantStyles[variant],
    sizeStyles[size],
    className
  );
}

export function Button({
  variant = "primary",
  size = "md",
  icon: Icon,
  iconOnRight = false,
  showArrow = variant === "primary",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={baseClass(variant, size, className)}
      {...props}
    >
      <ButtonInner
        icon={Icon}
        iconOnRight={iconOnRight}
        showArrow={showArrow}
      >
        {children}
      </ButtonInner>
    </button>
  );
}

export function AnchorButton({
  href,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconOnRight = false,
  showArrow = variant === "primary",
  className,
  children,
  ...props
}: AnchorButtonProps) {
  return (
    <a
      href={href}
      className={baseClass(variant, size, className)}
      {...props}
    >
      <ButtonInner
        icon={Icon}
        iconOnRight={iconOnRight}
        showArrow={showArrow}
      >
        {children}
      </ButtonInner>
    </a>
  );
}

export default Button;