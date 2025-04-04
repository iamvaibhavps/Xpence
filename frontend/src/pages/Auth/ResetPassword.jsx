import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { resetPassword } from '../../apis/apiCalls';

export default function ResetPassword() {
    const location = useLocation();
    const navigate = useNavigate();
    const [email, setEmail] = useState(location.state?.email || '');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [currentStep, setCurrentStep] = useState(1); // Changed from 2 to 1 to start with OTP verification

    const inputRefs = useRef([]);

    const handleOtpChange = (index, value) => {
        if (value.length > 1) {
            value = value.slice(0, 1);
        }

        if (!/^[0-9]*$/.test(value)) {
            return;
        }

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value !== '' && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const goToNextStep = () => {
        setError('');

        if (currentStep === 1) {
            const token = otp.join('');
            if (token.length !== 6) {
                setError('Please enter the complete 6-digit code');
                return;
            }
            setCurrentStep(2);
        }
    };

    const goToPreviousStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            setError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const token = otp.join('');

        if (token.length !== 6) {
            setError('Please enter the complete 6-digit code');
            return;
        }

        if (!newPassword) {
            setError('Please enter a new password');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        try {
            setLoading(true);
            // Include email in the resetPassword call
            const response = await resetPassword({
                email,
                otp: token,
                newPassword
            });

            if (response.data.success) {
                setSuccess('Password has been reset successfully!');
                setTimeout(() => {
                    navigate('/auth/login');
                }, 2000);
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to reset password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <>
                        <h2 className="text-2xl font-semibold text-center mb-8">
                            Step 1: Verify OTP
                        </h2>
                        <p className="text-center text-gray-600 mb-8">
                            Enter the verification code sent to your email.
                        </p>
                        <div className="mb-6">
                            <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-2">
                                Email<span className="text-red-500">*</span>
                            </label>
                            <input
                                id="email-address"
                                type="email"
                                className="w-full px-4 py-3 border border-dark rounded-xl text-sm bg-gray-100"
                                value={email}
                                disabled
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Verification Code<span className="text-red-500">*</span>
                            </label>
                            <div className="flex justify-between gap-2">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => (inputRefs.current[index] = el)}
                                        type="text"
                                        maxLength="1"
                                        className="w-12 h-12 border border-dark rounded-lg text-center text-xl font-bold"
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                    />
                                ))}
                            </div>
                        </div>
                        <button
                            type="button"
                            disabled={loading}
                            onClick={goToNextStep}
                            className="w-full bg-black text-white py-3 px-2 rounded-full font-semibold hover:bg-gray-800 transition-colors"
                        >
                            Verify & Continue
                        </button>
                    </>
                );
            case 2:
                return (
                    <>
                        <h2 className="text-2xl font-semibold text-center mb-8">
                            Step 2: Set New Password
                        </h2>
                        <p className="text-center text-gray-600 mb-8">
                            Create a new password for your account.
                        </p>
                        <div className="mb-6">
                            <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-2">
                                Email<span className="text-red-500">*</span>
                            </label>
                            <input
                                id="email-address"
                                type="email"
                                className="w-full px-4 py-3 border border-dark rounded-xl text-sm bg-gray-100"
                                value={email}
                                disabled
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-2">
                                New Password<span className="text-red-500">*</span>
                            </label>
                            <input
                                id="new-password"
                                type="password"
                                className="w-full px-4 py-3 border border-dark rounded-xl text-sm focus:outline-none"
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm Password<span className="text-red-500">*</span>
                            </label>
                            <input
                                id="confirm-password"
                                type="password"
                                className="w-full px-4 py-3 border border-dark rounded-xl text-sm focus:outline-none"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={goToPreviousStep}
                                className="w-1/2 bg-gray-200 text-black py-3 px-2 rounded-full font-semibold hover:bg-gray-300 transition-colors"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-1/2 bg-black text-white py-3 px-2 rounded-full font-semibold hover:bg-gray-800 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'Processing...' : 'Reset Password'}
                            </button>
                        </div>
                    </>
                );
            default:
                return null;
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
                            Remember your password?
                        </p>
                        <Link to={"/auth/sign-in"}>
                            <button className="px-8 py-3 bg-dark text-white rounded-full font-semibold">
                                Login
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="w-full flex items-center justify-center flex-col pt-8 md:pt-20 lg:pt-14">
                <div className="w-full flex items-center justify-center">
                    <div className="bg-white mx-auto w-full md:w-[500px] lg:w-[550px] rounded-[30px] border border-dark p-6 md:px-14">
                        <div className="flex justify-center mb-8">
                            <div className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'}`}>
                                    1
                                </div>
                                <div className={`w-16 h-1 ${currentStep >= 2 ? 'bg-black' : 'bg-gray-200'}`}></div>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'}`}>
                                    2
                                </div>
                            </div>
                        </div>

                        {success && (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6" role="alert">
                                <span className="block sm:inline">{success}</span>
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6" role="alert">
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            {renderStepContent()}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
