import type { ComponentProps } from "react";

function Card({ className = "", ...props }: ComponentProps<"div">) {
  return (
    <div className={`rounded-xl border border-border bg-surface p-6 ${className}`} {...props} />
  );
}

export default Card;
