import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  narrow?: boolean;
  padded?: boolean;
}

export function Container({
  narrow = false,
  padded = true,
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full",
        padded && "px-6 md:px-8 lg:px-10",
        narrow ? "max-w-3xl" : "max-w-7xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}