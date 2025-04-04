import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../apis/apiCalls";
import {
    showErrorToast,
    showSuccessToast,
} from "../../components/ToastNotification";
import { useDispatch } from "react-redux";
import { login } from "../../redux/Slices/userSlice";
import { Eye, EyeOff } from "lucide-react";
// import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import logo from "../../assets/beenium_logos/xpencelogo.png"

const PhoneNumberInput = ({ value, onChange }) => {
    const [selectedCountry, setSelectedCountry] = useState({
        code: "+91",
        flag: "🇮🇳",
    });

    const [errorMessage, setErrorMessage] = useState("");
    const [inputValue, setInputValue] = useState(
        value.replace(selectedCountry.code, "")
    );

    const countryOptions = [
        { code: "+91", flag: "🇮🇳", name: "India" },
        { code: "+1", flag: "🇺🇸", name: "United States" },
        { code: "+44", flag: "🇬🇧", name: "United Kingdom" },
        { code: "+61", flag: "🇦🇺", name: "Australia" },
    ];

    const handleCountryChange = (event) => {
        const selectedCode = event.target.value;
        const selectedCountry = countryOptions.find(
            (option) => option.code === selectedCode
        );
        setSelectedCountry(selectedCountry);


        onChange(`${selectedCode}${inputValue}`);
    };

    const handleInputChange = (event) => {
        const newValue = event.target.value;
        setInputValue(newValue);


        if (selectedCountry.code === "+91") {
            if (!/^\d*$/.test(newValue)) {
                setErrorMessage("Only digits are allowed.");
                return;
            }
            if (newValue.length > 10) {
                setErrorMessage("Phone number must be exactly 10 digits.");
                return;
            }
            if (newValue.length < 10) {
                setErrorMessage("Phone number must be exactly 10 digits.");
                return;
            }
            if (newValue.length === 0) {
                setErrorMessage("Phone number is required");
                return;
            }
        }


        setErrorMessage("");


        onChange(`${selectedCountry.code}${newValue}`);
    };

    return (
        <div className="mb-4 flex flex-col items-center justify-center w-full">
            <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-2 text-left w-full"
            >
                Phone Number<span className="text-red-500">*</span>
            </label>
            <div className="flex items-center border border-dark rounded-xl px-3 py-2 w-full">

                <select
                    value={selectedCountry.code}
                    onChange={handleCountryChange}
                    className="bg-transparent outline-none text-lg mr-2 px-2 border-r-2 border-gray-500 cursor-pointer"
                >
                    {countryOptions.map((option) => (
                        <option key={option.code} value={option.code}>
                            {option.flag}
                        </option>
                    ))}
                </select>


                <span className="text-gray-600 mr-2">{selectedCountry.code}</span>


                <input
                    type="number"
                    name="phone"
                    id="phone"
                    className="ml-2 flex-1 border-none outline-none w-full"
                    placeholder="000 00 000 00"
                    value={inputValue}
                    onChange={handleInputChange}
                />
            </div>


            {errorMessage && (
                <p className="text-red-500 text-sm mt-2 text-left w-full">{errorMessage}</p>
            )}
        </div>
    );
};

export default function Register() {

    const [errors, setErrors] = useState({});
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phoneNo: "",
        role: "student",
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();


    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validatePassword = (password) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
            password
        );


    const isStep1Valid = () => {
        const newErrors = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = "First name is required";
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = "Last name is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!validateEmail(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return false;
        }

        return true;
    };


    const handleNextStep = () => {
        if (isStep1Valid()) {
            setCurrentStep(2);
        }
    };


    const handlePrevStep = () => {
        setCurrentStep(1);
    };


    const handleRegister = async (e) => {
        e.preventDefault();


        const newErrors = {};

        if (!formData.password.trim()) {
            newErrors.password = "Password is required";
        } else if (!validatePassword(formData.password)) {
            newErrors.password = "Password must be at least 8 characters, contain uppercase, lowercase, number, and special character";
        }

        if (!formData.phoneNo.trim()) {
            newErrors.phoneNo = "Phone number is required";
        }

        if (!agreeTerms) {
            newErrors.terms = "You must agree to the terms and privacy policy";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            setLoading(true);

            const formattedData = {
                name: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                phoneNo: formData.phoneNo,
                password: formData.password,
                role: formData.role
            };

            const response = await registerUser(formattedData);

            if (response.status === 201) {
                showSuccessToast("Registration successful!");
                navigate("/auth/sign-in");
            }
        } catch (error) {
            console.error(error);
            showErrorToast(error?.response?.data?.message || "Registration failed! Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full p-3 md:p-2 min-h-screen relative">
            <div className="w-full md:px-6 lg:px-28 -mt-8">
                <div className="flex flex-col md:flex-row justify-between items-center p-4">
                    <div className="flex items-center gap-4 mb-4 md:mb-0">
                        <Link to={"/"}>
                            <img
                                alt="logo"
                                src={logo}
                                className="w-full h-40  object-cover"
                            />
                        </Link>
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <p className="text-center md:text-left">
                            Already have an account?{" "}
                        </p>
                        <Link to={"/auth/sign-in"}>
                            <button className="px-8 py-3 bg-dark text-white rounded-full font-semibold">
                                Sign In
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="w-full flex items-center justify-center flex-col pt-8 md:pt-20 lg:pt-14">
                <div className="w-full flex items-center justify-center">
                    <div className="bg-white mx-auto w-full md:w-[600px]  lg:w-[650px] rounded-[30px] border border-dark p-6 md:px-14">
                        <h2 className="text-xl font-semibold text-center mb-1">
                            Welcome to smart expense Management
                        </h2>

                        {/* Step Indicator */}
                        <div className="flex justify-center items-center mb-6 mt-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep === 1 ? 'bg-dark text-white' : 'bg-gray-200'}`}>
                                1
                            </div>
                            <div className="w-20 h-1 bg-gray-200">
                                <div className={`h-full ${currentStep === 2 ? 'bg-dark' : 'bg-gray-200'}`} style={{ width: currentStep > 1 ? '100%' : '0%' }}></div>
                            </div>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep === 2 ? 'bg-dark text-white' : 'bg-gray-200'}`}>
                                2
                            </div>
                        </div>

                        <form onSubmit={handleRegister}>
                            {/* STEP 1: Basic Information */}
                            {currentStep === 1 && (
                                <>
                                    {/* Name Fields */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 mt-10">
                                        <div>
                                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                                                First Name<span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="firstName"
                                                placeholder="Your first name"
                                                value={formData.firstName}
                                                onChange={(e) => {
                                                    setFormData({
                                                        ...formData,
                                                        firstName: e.target.value,
                                                    });
                                                    setErrors({ ...errors, firstName: "" });
                                                }}
                                                className="w-full px-4 py-2 border border-dark rounded-xl text-sm focus:outline-none"
                                            />
                                            {errors.firstName && (
                                                <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                                                Last Name<span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="lastName"
                                                placeholder="Your last name"
                                                value={formData.lastName}
                                                onChange={(e) => {
                                                    setFormData({
                                                        ...formData,
                                                        lastName: e.target.value,
                                                    });
                                                    setErrors({ ...errors, lastName: "" });
                                                }}
                                                className="w-full px-4 py-2 border border-dark rounded-xl text-sm focus:outline-none"
                                            />
                                            {errors.lastName && (
                                                <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Email Field */}
                                    <div className="mb-4">
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                            Email<span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            placeholder="Work Email"
                                            value={formData.email}
                                            onChange={(e) => {
                                                setFormData({ ...formData, email: e.target.value });
                                                setErrors({ ...errors, email: "" });
                                            }}
                                            className="w-full px-4 py-2 border border-dark rounded-xl text-sm focus:outline-none"
                                        />
                                        {errors.email && (
                                            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                                        )}
                                    </div>

                                    {/* Next Step Button */}
                                    <button
                                        type="button"
                                        onClick={handleNextStep}
                                        className="w-full bg-black text-white py-3 px-2 rounded-full font-semibold hover:bg-gray-800 mt-4 transition-colors"
                                    >
                                        Continue
                                    </button>
                                </>
                            )}

                            {/* STEP 2: Additional Information */}
                            {currentStep === 2 && (
                                <>
                                    {/* Password Field */}
                                    <div className="mb-4">
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                            Password<span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                id="password"
                                                placeholder="Enter a strong password"
                                                value={formData.password}
                                                onChange={(e) => {
                                                    setFormData({
                                                        ...formData,
                                                        password: e.target.value,
                                                    });
                                                    if (validatePassword(e.target.value)) {
                                                        setErrors({ ...errors, password: "" });
                                                    }
                                                }}
                                                className="w-full px-4 py-2 border border-dark rounded-xl text-sm focus:outline-none"
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

                                    {/* Phone Number */}
                                    <PhoneNumberInput
                                        value={formData.phoneNo}
                                        onChange={(value) => {
                                            setFormData({ ...formData, phoneNo: value });
                                            setErrors({ ...errors, phoneNo: "" });
                                        }}
                                    />

                                    {/* Role Selection */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Select Your Role<span className="text-red-500">*</span>
                                        </label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            <label
                                                className="flex items-center justify-center p-3 text-center cursor-pointer"
                                            >
                                                <input
                                                    type="radio"
                                                    name="role"
                                                    value="student"
                                                    checked={formData.role === 'student'}
                                                    onChange={() => setFormData({ ...formData, role: 'student' })}
                                                />
                                                <p className="font-medium text-xs ml-2">College Student</p>
                                            </label>
                                            <label
                                                className="flex items-center justify-center p-3 text-center cursor-pointer"
                                            >
                                                <input
                                                    type="radio"
                                                    name="role"
                                                    value="employee"
                                                    checked={formData.role === 'employee'}
                                                    onChange={() => setFormData({ ...formData, role: 'employee' })}
                                                />
                                                <p className="font-medium text-xs ml-2">Salaried Employee</p>
                                            </label>
                                            <label
                                                className="flex items-center justify-center p-3 text-center cursor-pointer"
                                            >
                                                <input
                                                    type="radio"
                                                    name="role"
                                                    value="family"
                                                    checked={formData.role === 'family'}
                                                    onChange={() => setFormData({ ...formData, role: 'family' })}
                                                />
                                                <p className="font-medium text-xs ml-2">Family Man</p>
                                            </label>
                                            <label
                                                className="flex items-center justify-center p-3 text-center cursor-pointer"
                                            >
                                                <input
                                                    type="radio"
                                                    name="role"
                                                    value="srcitizen"
                                                    checked={formData.role === 'srcitizen'}
                                                    onChange={() => setFormData({ ...formData, role: 'srcitizen' })}
                                                />
                                                <p className="font-medium text-xs ml-2">Senior Citizen</p>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Terms and Conditions */}
                                    <div className="flex items-center mb-4">
                                        <input
                                            type="checkbox"
                                            id="agreeTerms"
                                            checked={agreeTerms}
                                            onChange={() => {
                                                setAgreeTerms(!agreeTerms);
                                                setErrors({ ...errors, terms: "" });
                                            }}
                                            className="mr-2 w-5 h-5 accent-black transition duration-150 ease-in-out rounded-md cursor-pointer focus:ring-0"
                                        />
                                        <label htmlFor="agreeTerms" className="text-sm text-gray-700">
                                            I agree with{" "}
                                            <Link
                                                to={"/terms-service"}
                                                className="text-blue-500"
                                            >
                                                terms of use
                                            </Link>{" "}
                                            and{" "}
                                            <Link
                                                to={"/privacy-policy"}
                                                className="text-blue-500"
                                            >
                                                privacy policy
                                            </Link>
                                        </label>
                                    </div>
                                    {errors.terms && (
                                        <p className="text-red-500 text-xs mb-4">
                                            {errors.terms}
                                        </p>
                                    )}

                                    {/* Navigation Buttons */}
                                    <div className="flex gap-4 mt-10">
                                        <button
                                            type="button"
                                            onClick={handlePrevStep}
                                            className="w-1/2 bg-gray-200 text-dark py-3 px-2 rounded-full font-semibold hover:bg-gray-300 transition-colors"
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="submit"
                                            className="w-1/2 bg-black text-white py-3 px-2 rounded-full font-semibold hover:bg-gray-800 transition-colors"
                                            disabled={loading}
                                        >
                                            {loading ? "Signing up..." : "Sign up"}
                                        </button>
                                    </div>
                                </>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}