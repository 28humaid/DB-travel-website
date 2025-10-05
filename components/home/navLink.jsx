const NavLink = ({ children, onClick, active = false }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center px-3 py-2 rounded-md text-sm md:text-base font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      active
        ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-500'
        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
    }`}
  >
    {children}
  </button>
);

export default NavLink;