// imports
import { useAtom } from 'jotai';

// lib files
import { signinModalAtom, SignInModalStateEnum } from '@/lib/atoms/signin-modal';

// components
import Button, { ButtonProps } from '@/components/Button/Button';

interface SignInButtonProps {
  className?: string;
  size?: 'responsive' | 'min' | 'max';
  onClick?: () => void;
  children?: React.ReactNode;
  style?: ButtonProps['style'];
};

const SignInButton = (props: SignInButtonProps) => {
  const { className, size, children, onClick, style = "white_ghost" } = props;
  const [ _, setSigninModalOpen] = useAtom(signinModalAtom)

  // create a onclick handler that uses the onClick prop if it exists
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    setSigninModalOpen(SignInModalStateEnum.True);
  }
  return (
    <Button
      style={style}
      onClick={handleClick}
      className={className}
      size={size}
    >
      { children || 'Sign In' }
    </Button>
  );
};

export default SignInButton;
