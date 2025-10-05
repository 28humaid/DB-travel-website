import Button from '../common/button';

const LoginButton = ({ onClick, className = '', size = 'medium', ...props }) => (
  <Button
    onClick={onClick}
    variant="primary"
    size={size}
    className={`md:ml-4 ${className}`} // ml-4 for desktop spacing; override in mobile
    {...props}
  >
    Login
  </Button>
);

export default LoginButton;