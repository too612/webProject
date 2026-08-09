import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const pageTitleVariants = cva("flex flex-col gap-1", {
  variants: {
    size: {
      default: "",
      compact: "gap-1",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export interface PageTitleProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof pageTitleVariants> {
  title: React.ReactNode;
  description?: React.ReactNode;
  titleClassName?: string;
  descriptionClassName?: string;
}

const PageTitle = React.forwardRef<HTMLDivElement, PageTitleProps>(
  (
    {
      className,
      size,
      title,
      description,
      titleClassName,
      descriptionClassName,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(pageTitleVariants({ size, className }))}
        {...props}
      >
        <h2
          className={cn(
            "text-[1.05rem] font-semibold tracking-tight text-slate-900 md:text-[1.35rem]",
            titleClassName,
          )}
        >
          {title}
        </h2>
        {description ? (
          <p
            className={cn(
              "max-w-3xl text-sm leading-6 text-slate-500",
              descriptionClassName,
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
    );
  },
);

PageTitle.displayName = "PageTitle";

export { PageTitle, pageTitleVariants };
