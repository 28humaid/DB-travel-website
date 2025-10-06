import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import InputField from "./inputField"; // Uses existing InputField
import Button from "./button"; // Uses existing Button
import { X, Eye, EyeOff } from "lucide-react";

const validationSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});

const LoginModal = ({ onClose }) => {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setError(null);
      try {
        const res = await signIn("credentials", {
          username: values.username, // Fixed: Use 'username' instead of non-existent 'email'
          password: values.password,
          redirect: false,
        });

        if (res?.error) {
          setError("Invalid username or password");
          setSubmitting(false);
          return;
        }

        if (res?.ok) {
          // Success: Close modal and redirect
          onClose(); // Close the modal
          router.push("/profile");
          // Alternative: If checking session, import { useSession } from 'next-auth/react' and use it here
          // const { data: session } = useSession();
          // if (session) {
          //   router.push("/admin/dashboard/createUser");
          // }
        }
      } catch (err) {
        console.error("Login error:", err);
        setError(
          err.message?.includes("bad auth")
            ? "Database authentication failed. Please contact support."
            : "An unexpected error occurred. Please try again."
        );
      } finally {
        setSubmitting(false); // Ensure submitting state resets
      }
    },
  });

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.75)" }}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Login</h2>
          {!formik.isSubmitting && (
                <button
                onClick={onClose}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Close modal"
                >
                <X size={24} />
                </button>
            )}
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
            type={showPassword ? "text" : "password"}
            label="Password"
            placeholder="Enter your password"
            formik={formik}
            icon={
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="cursor-pointer text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            }
          />
          {/* Error Display */}
          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
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