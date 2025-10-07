import Button from "../common/button";

const LogoutButton = ({ onClick, className = '', size = 'medium', ...props }) => (
  <Button
    onClick={onClick}
    variant="primary"
    size={size}
    className={`md:ml-4 ${className}`} // Matches LoginButton styling
    {...props}
  >
    Logout
  </Button>
);

export default LogoutButton;