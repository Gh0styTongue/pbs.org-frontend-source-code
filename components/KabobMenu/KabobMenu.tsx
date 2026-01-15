import IconButton from "@/components/Button/IconButton";
import { ReactNode, useRef, useState } from "react";

import {
  useFloating,
  autoUpdate,
  arrow,
  offset,
  flip,
  shift,
  useDismiss,
  useRole,
  useClick,
  useInteractions,
  FloatingFocusManager,
  FloatingArrow,
} from "@floating-ui/react";
import KabobIcon from '@/public/svg/kabob.svg';

import styles from './KabobMenu.module.scss';
interface KabobMenuProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

const KabobMenu = (props: KabobMenuProps) => {
  const { className, contentClassName, children } = props;
  const [isOpen, setIsOpen] = useState(false);
  const show = () => setIsOpen(true);
  const hide = () => setIsOpen(false);

  let buttonClasses = styles.kabob_menu_button

  if (className) {
    buttonClasses += ' ' + className
  }

  let contentClasses = styles.kabob_menu_content

  if (contentClassName) {
    contentClasses += ' ' + contentClassName
  }

  const arrowRef = useRef(null);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'right-start',
    middleware: [
      offset(5),
      flip({ fallbackAxisSideDirection: "end" }),
      shift(),
      arrow({ element: arrowRef }),
    ],
    whileElementsMounted: autoUpdate
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role
  ]);

  return (
    <>
      <button
        ref={refs.setReference}
        {...getReferenceProps()}
        title="Toggle Menu"
        className={buttonClasses}
        onClick={isOpen ? hide : show}
      >
        <KabobIcon />
      </button>
      {isOpen && (
        <FloatingFocusManager context={context} modal={false}>
          <div
            className={contentClasses}
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
          >
            <IconButton
              onClick={isOpen ? hide : show}
              className={styles.kabob_menu_close_button}
              icon="close"
              title="Close"
            />
            <div className={styles.kabob_menu_content_inner}>
              {children}
            </div>
            <FloatingArrow
              ref={arrowRef}
              context={context}
              className={styles.kabob_menu_arrow}
              width={16}
              height={16}
            />
          </div>
        </FloatingFocusManager>
      )}
    </>
  );
}

export default KabobMenu;
