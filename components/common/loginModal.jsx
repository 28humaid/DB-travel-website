import { useFormik } from 'formik';
import * as Yup from 'yup';
import InputField from './inputField'; // Uses existing InputField
import Button from './button'; // Uses existing Button
import { X } from 'lucide-react';

const validationSchema = Yup.object({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
});

const LoginModal = ({ onClose }) => {
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      // Handle login (e.g., API call); for now, log and close
      console.log('Login values:', values);
      setSubmitting(false);
      onClose();
    },
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}>
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Login</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={formik.handleSubmit} className="p-6">
          <InputField
            name="username"
            type="text"
            label="Username"
            placeholder="Enter your username"
            formik={formik}
          />
          <InputField
            name="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            formik={formik}
          />
          <Button
            type="submit"
            disabled={!formik.isValid || formik.isSubmitting}
            loading={formik.isSubmitting}
            loadingText="Logging in..."
            className="w-full mt-4"
            size="medium"
          >
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;