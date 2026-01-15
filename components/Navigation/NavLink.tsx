import Link from 'next/link';
import { ReactNode } from "react";
import { usePathname } from 'next/navigation';

import styles from './NavLink.module.scss';

interface NavLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

/**
 * A simple pass through to the Next Link component
 * that adds an active class when the href matches the current path
 * @param {ReactNode} children
 * @param {string} href
 * @returns {ReactNode}
*/
const NavLink = (props: NavLinkProps) => {
  const {
    href,
    children,
    className,
    onClick,
  } = props;

  let classNames = styles.nav_link;

  if (className) {
    classNames += ` ${className}`;
  }

  const pathName = usePathname();

  if (pathName === href) {
    classNames += ` ${styles.is_active}`;
  }

  return (
    <Link href={href} className={classNames} onClick={onClick} prefetch={false}>
      {children}
    </Link>
  );
};

export default NavLink;
