import type { ReactNode } from "react";
import { cx } from "@/lib/format";

interface TagProps {
  children: ReactNode;
  tone?: "orange" | "green" | "gray" | "blue";
}

const tones = {
  orange: "bg-orange-50 text-orange-700 ring-orange-200",
  green: "bg-green-50 text-green-700 ring-green-200",
  gray: "bg-gray-100 text-gray-700 ring-gray-200",
  blue: "bg-blue-50 text-blue-700 ring-blue-200"
};

export function Tag({ children, tone = "gray" }: TagProps) {
  if (!children) {
    return null;
  }
  return (
    <span className={cx("inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1", tones[tone])}>
      {children}
    </span>
  );
}
