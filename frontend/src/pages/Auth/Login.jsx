import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../apis/apiCalls";
import {
    showErrorToast,
    showSuccessToast,
} from "../../components/ToastNotification";
import { useDispatch } from "react-redux";
import { login } from "../../redux/Slices/userSlice";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleLogin = async (e) => {
        e.preventDefault();

        // Form validation
        const newErrors = {};
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!validateEmail(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (!formData.password.trim()) {
            newErrors.password = "Password is required";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            setLoading(true);
            const response = await loginUser(formData);

            if (response.status === 200) {
                const userData = response.data.data;

                // Store user data in Redux
                dispatch(login(userData));

                showSuccessToast("Login successful!");

                const role = userData.role;
                switch (role) {
                    case "student":
                        navigate("/student/dashboard");
                        break;
                    case "employee":
                        navigate("/employee/dashboard");
                        break;
                    case "family":
                        navigate("/family/dashboard");
                        break;
                    case "srcitizen":
                        navigate("/senior/dashboard");
                        break;
                    default:
                        navigate("/");
                }
            }
        } catch (error) {
            console.error(error);
            showErrorToast(
                error?.response?.data?.message || "Login failed! Please check your credentials."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full p-3 md:p-2 min-h-screen relative">
            <div className="w-full md:px-6 lg:px-28 py-4">
                <div className="flex flex-col md:flex-row justify-between items-center p-4">
                    <div className="flex items-center gap-4 mb-4 md:mb-0">
                        <Link to={"/"}>
                            <img
                                alt="logo"
                                src={""}
                                className="w-full h-10"
                            />
                        </Link>
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <p className="text-center md:text-left">
                            Don't have an account?
                        </p>
                        <Link to={"/auth/sign-up"}>
                            <button className="px-8 py-3 bg-dark text-white rounded-full font-semibold">
                                Sign up
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="w-full flex items-center justify-center flex-col pt-8 md:pt-20 lg:pt-14">
                <div className="w-full flex items-center justify-center">
                    <div className="bg-white mx-auto w-full md:w-[500px] lg:w-[550px] rounded-[30px] border border-dark p-6 md:px-14">
                        <h2 className="text-2xl font-semibold text-center mb-8">
                            Welcome Back
                        </h2>
                        <p className="text-center text-gray-600 mb-8">
                            Login to your account to continue
                        </p>

                        <form onSubmit={handleLogin}>
                            {/* Email Field */}
                            <div className="mb-6">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="Your email address"
                                    value={formData.email}
                                    onChange={(e) => {
                                        setFormData({ ...formData, email: e.target.value });
                                        setErrors({ ...errors, email: "" });
                                    }}
                                    className="w-full px-4 py-3 border border-dark rounded-xl text-sm focus:outline-none"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div className="mb-6">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Password<span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={(e) => {
                                            setFormData({ ...formData, password: e.target.value });
                                            setErrors({ ...errors, password: "" });
                                        }}
                                        className="w-full px-4 py-3 border border-dark rounded-xl text-sm focus:outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-3 transform"
                                    >
                                        {showPassword ? (
                                            <Eye className="w-4 h-4" />
                                        ) : (
                                            <EyeOff className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                                )}
                            </div>

                            {/* Forgot Password Link */}
                            {/* <div className="flex justify-end mb-6">
                                <Link to="/auth/forgot-password" className="text-sm text-blue-500 hover:underline">
                                    Forgot password?
                                </Link>
                            </div> */}

                            {/* Login Button */}
                            <button
                                type="submit"
                                className="w-full bg-black text-white py-3 px-2 rounded-full font-semibold hover:bg-gray-800 transition-colors"
                                disabled={loading}
                            >
                                {loading ? "Logging in..." : "Login"}
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-sm text-gray-600">
                                By continuing, you agree to our{" "}
                                <Link to="/terms-service" className="text-blue-500">
                                    Terms of Service
                                </Link>{" "}
                                and{" "}
                                <Link to="/privacy-policy" className="text-blue-500">
                                    Privacy Policy
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
