import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword } from '../../apis/apiCalls';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            setError('Please enter your email address');
            return;
        }

        try {
            setLoading(true);
            setError('');
            setMessage('');

            const response = await forgotPassword({ email });
            // console.log(response);
            const resetToken = response.data.resetToken;
            if (response.data) {
                setMessage('Password reset instructions have been sent to your email.');
                setEmail('');
            }

        } catch (error) {
            console.log(error);
            setError(error.response?.data?.message || 'Something went wrong. Please try again later.');
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
                        <h2 className="text-2xl font-semibold text-center mb-8">
                            Forgot Password
                        </h2>
                        <p className="text-center text-gray-600 mb-8">
                            Enter your email address and we'll send you instructions to reset your password.
                        </p>

                        {message && (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6" role="alert">
                                <span className="block sm:inline">{message}</span>
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6" role="alert">
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-6">
                                <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email<span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="w-full px-4 py-3 border border-dark rounded-xl text-sm focus:outline-none"
                                    placeholder="Your email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full bg-black text-white py-3 px-2 rounded-full font-semibold hover:bg-gray-800 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'Processing...' : 'Send Reset Instructions'}
                            </button>
                        </form>


                    </div>
                </div>
            </div>
        </div>
    );
}
