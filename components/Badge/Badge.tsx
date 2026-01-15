import { ReactNode } from "react";
import styles from "./Badge.module.scss";
export interface BadgeProps {
  children: ReactNode;
  style?:
    "yellow" |
    "teal" |
    "passport" |
    "red" |
    "coral" |
    "coral_midnight" |
    "teal_midnight" |
    "live" |
    "yellow_outline" |
    "teal_outline" |
    "passport_outline" |
    "red_outline";
  className?: string;
}

const Badge = (props: BadgeProps) => {
  const { children, style = "yellow", className } = props;

  let classNames = `${styles[style]}`;

  if (className) {
    classNames += ` ${className}`;
  }

  return (
    <span className={classNames}>
      {children}
    </span>
  );
}

export default Badge;
