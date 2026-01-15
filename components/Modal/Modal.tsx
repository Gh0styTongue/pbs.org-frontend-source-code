// imports
import { useRef, ReactNode, useEffect } from "react";

// SVG's
import CloseIcon from '@/public/svg/close.svg';

// styles
import styles from './Modal.module.scss';
export interface ModalProps {
  isOpen: boolean;
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  onClose?: () => void;
}

function Modal(props: ModalProps) {
  const { isOpen, className, innerClassName, children, onClose } = props;
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if(isOpen) {
      dialogRef.current?.showModal?.();
    } else {
      dialogRef.current?.close?.();
    }
  }, [isOpen])

  const handleClose = () => {
    if (onClose) {
      onClose()
    }

    dialogRef.current?.close?.();
  }

  // this allows for click on the background and dismissing the modal
  const handleModalClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const target = e.target as HTMLElement;

    if (target === dialogRef.current) {
      handleClose();
    }
  };

  let classNames = `${styles.modal}`;

  if (className) {
    classNames += ` ${className}`;
  }

  return (
    <dialog
      ref={dialogRef}
      className={classNames}
      onCancel={handleClose}
      onClick={handleModalClick}
    >
    {/* This inner div is necessary so that clicking inside the dialog
    doesn't dismiss the modal. */}
      <div className={innerClassName}>
        {children}

        <button
          className={styles.btn__close}
          onClick={handleClose}
          aria-label='Close'
        >
          <CloseIcon />
        </button>
      </div>
    </dialog>
  )
}

export default Modal
