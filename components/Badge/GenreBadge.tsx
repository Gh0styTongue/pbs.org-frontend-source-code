import { ReactNode } from "react";
import Link from "next/link";

import styles from "./Badge.module.scss";
export interface BadgeProps {
  children: ReactNode;
  href: string;
  className?: string;
}

const GenreBadge = (props: BadgeProps) => {
  const { children, href, className } = props;
  
  let classNames = styles.genre;

  if (className) {
    classNames += ` ${className}`;
  }

  return (
    <Link className={classNames} href={href}>
      {children}
    </Link>
  );
}

export default GenreBadge;
