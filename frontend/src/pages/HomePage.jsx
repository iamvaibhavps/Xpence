import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
// import { logoImg } from "../allImages";

import trackImg from "../assets/homepage/Track.png";
import assignImg from "../assets/homepage/Assign.png";
import measureImg from "../assets/homepage/Measure.png";
import playIcon from "../assets/homepage/playIcon.webp";
// import Header from "../components/Header";
import Footer from "../pages/Footer";

import underline1 from "../assets/svglines/underline1.svg"
import underline2 from "../assets/svglines/underline2.svg"
import underline3 from "../assets/svglines/underline3.png"

import homePageDes from "../assets/homepage/homee.jpg";
import withBeenium from "../assets/homepage/with_beenium.png";
import withoutBeenium from "../assets/homepage/without_beenium.png";
import Chatbot from "./Chatbot";

import logo from "../assets/beenium_logos/xpencelogo.png";



export default function HomePage() {
    const currentUser = useSelector((state) => state.user.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser) {

            switch (currentUser.role) {
                case 'student':
                    navigate('/student/dashboard');
                    break;
                case 'employee':
                    navigate('/employee/dashboard');
                    break;
                case 'family':
                    navigate('/family/dashboard');
                    break;
                case 'srcitizen':
                    navigate('/senior/dashboard');
                    break;
                default:

                    break;
            }
        }
    }, [currentUser, navigate]);

    const videoRef = useRef(null);

    const [showButton, setShowButton] = useState(true);

    const handlePlayVideo = () => {
        if (videoRef.current) {
            videoRef.current.scrollIntoView({ behavior: "smooth" });
            videoRef.current.play();
            setShowButton(false); // Hide the button
        }
    };

    const [productDropdownOpen, setProductDropdownOpen] = useState(false);
    const [contactDropdownOpen, setContactDropdownOpen] = useState(false);

    const handleProductMouseEnter = () => setProductDropdownOpen(true);
    const handleProductMouseLeave = () => setProductDropdownOpen(false);
    const handleContactMouseEnter = () => setContactDropdownOpen(true);
    const handleContactMouseLeave = () => setContactDropdownOpen(false);

    return (
        <div className=" w-full min-h-screen bg-white px-1 overflow-y-auto  ">
            <Chatbot />
            {/* Header */}
            {/* <Header /> */}

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

                        {currentUser ? (
                            <Link to={`${currentUser.role}/dashboard`}>
                                <button className="px-8 py-3 bg-dark text-white rounded-full font-semibold">
                                    Dashboard
                                </button>
                            </Link>
                        ) : (
                            <Link to={"/auth/sign-in"}>
                                <button className="px-8 py-3 bg-dark text-white rounded-full font-semibold">
                                    Sign In
                                </button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* <SplashCursor /> */}
            {/* First Page */}
            <div className="container mx-auto py-10 flex flex-col items-center justify-center w-full md:px-16 ">
                <div className="flex flex-col items-center gap-3">
                    <h1 className="flex flex-col items-center gap-4">
                        <p className="font-poppins text-dark text-[28px] md:text-[70px] tracking-tight">
                            <span className="flex items-center gap-2 md:gap-5 relative">
                                {/* Container for "Simplify" with overlapping underline */}
                                <span className="relative inline-block">
                                    Simplify
                                    <img
                                        src={underline1}
                                        alt="underline1"
                                        className="absolute left-0 bottom-[2px] w-full"
                                    />
                                </span>
                                Expenses
                            </span>
                        </p>
                        <p className="font-poppins text-dark text-[28px] md:text-[70px] -mt-4 md:-mt-8  tracking-tight">
                            <span className="flex items-center gap-2 md:gap-5 relative">
                                Amplify
                                {/* Container for "Simplify" with overlapping underline */}
                                <span className="relative inline-block">
                                    Savings
                                    <img
                                        src={underline2}
                                        alt="underline2"
                                        className="absolute left-0 bottom-[2px] w-full"
                                    />
                                </span>
                            </span>
                        </p>
                    </h1>
                    <p className="md:text-xl text-dark text-center">
                        Xpence is a simple tool to track expenses, manage budgets, <br className="block md:hidden" />and effortlessly split costs!
                    </p>
                    {/* <div className="mt-14 mb-4">
                        <button
                            className="bg-dark px-4 py-2 md:px-6 md:py-3 text-white rounded-full hover:bg-gray-900 text-md   md:text-[19px] "
                            onClick={handlePlayVideo}
                        >
                            Watch Video
                        </button>
                    </div> */}
                </div>

                <div className=" max-w-6xl mt-14 md:mt-16    relative">
                    {/* <video
                        ref={videoRef}
                        className="w-full h-full object-cover  rounded-[20px] md:rounded-[40px]"
                        src={videoPath}
                        controls={true}
                        onPlay={() => setShowButton(false)}
                        loop
                    />
                    {showButton && (
                        <div
                            className="absolute text-dark bg-white py-1 px-2 md:py-2 md:px-6 rounded-full md:text-[19px] border   shadow-lg transition-transform transform hover:scale-105"
                            style={{
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                            }}
                        >
                            <button
                                onClick={handlePlayVideo}
                                className="flex items-center gap-2"
                            >
                                <img
                                    src={playIcon}
                                    alt="play"
                                    className="md:w-6 md:h-6 w-4 h-4"
                                />
                                
                                Take a 2 min. tour
                            </button>
                        </div>
                    )} */}
                    <img src={homePageDes} alt="homepage description" className="w-full px-3 md:px-0 md:h-[70vh] " />

                </div>

                {/* Text */}
                {/* <div className="font-poppins container w-full mt-12 md:mt-16 text-center md:text-[38px] lg:text-[45px]">
                    With Beenium, we help you make work feel less like work and a lot more
                    like winning. Because let’s be honest, ticking off tasks should feel
                    like a victory dance.
                </div> */}
            </div>

            {/* Xpence Works Section */}
            <div className="container mx-auto w-full flex flex-col justify-center items-center gap-20 px-10 lg:px-0">
                <div className="relative lg:container w-full flex items-center justify-center text-dark text-[19px] md:text-[45px] mt-10 font-sans">
                    How Xpence Works?
                    <img src={underline3} alt="underline1" className="absolute left-100 bottom-[-5px] w-[55%] md:w-[45%] lg:w-[30%]" />
                </div>

                {/* Cards Container */}
                <div className="flex flex-col gap-10 md:gap-20 w-full max-w-6xl">
                    {/* Assign Card */}
                    <div className="flex flex-col gap-10 md:flex-row items-center border border-gray-300 rounded-[30px] bg-gray-50 px-10 py-6 lg:py-0 md:min-h-[350px]">
                        <div className="flex-1 flex flex-col items-center md:items-start h-full justify-between">
                            <p className="md:text-[25px] font-semibold">1 - Account & Expense Setup</p>
                            <p className="md:text-[33px] font-semibold mt-2 mb-2">Create, Assign, & Categorize Expenses</p>
                            <ul className="md:text-[19px] text-gray-700 space-y-2">
                                <li>Set up user profiles based on user type (Student/Professional).</li>
                                <li>Assign and categorize expenses with custom categories (e.g., food, rent, shopping).</li>
                                <li>Assign goals and tasks, set deadlines with notifications and reminders.</li>
                            </ul>
                        </div>
                        <div className="flex-1 flex justify-center">
                            <img src={assignImg} alt="assign" className="w-[400px] lg:h-[350px] object-cover" />
                        </div>
                    </div>

                    {/* Track Card */}
                    <div className="flex flex-col gap-10 md:gap-40 md:flex-row-reverse items-center border border-gray-300 rounded-[30px] bg-gray-50 px-10 py-6 lg:py-0 md:min-h-[350px]">
                        {/* Text div */}
                        <div className="flex-1 flex flex-col items-center md:items-start h-full justify-between order-2">
                            <p className="md:text-[25px] font-semibold">2 - Track & Manage</p>
                            <p className="md:text-[33px] font-semibold mt-2 mb-2">Real-time Updates & Notifications</p>
                            <ul className="md:text-[19px] text-gray-700 space-y-2">
                                <li>Track personal and group expenses, share real-time updates.</li>
                                <li>Receive instant notifications for any group contributions and overdue payments.</li>
                                <li>Get notified when budgets are overspent or nearing the limit.</li>
                            </ul>
                        </div>

                        {/* Mobile-only image div */}
                        <div className="flex flex-1 justify-center order-3">
                            <img src={trackImg} alt="track" className="w-[400px] object-cover" />
                        </div>
                    </div>

                    {/* Measure Card */}
                    <div className="flex flex-col gap-10 md:flex-row items-center border border-gray-300 rounded-[30px] bg-gray-50 px-10 py-6 lg:py-0 md:min-h-[350px]">
                        <div className="flex-1 flex flex-col items-center md:items-start h-full justify-between">
                            <p className="md:text-[25px] font-semibold">3 - Budget Adjustment</p>
                            <p className="md:text-[33px] font-semibold mt-2 mb-2">Insights, Savings & Auto-Budgeting</p>
                            <ul className="md:text-[19px] text-gray-700 space-y-2">
                                <li>Analyze past expenses and adjust budgets based on real-time spending.</li>
                                <li>Set up custom savings goals, and automatically move small change to savings.</li>
                                <li>Use predictive analytics to forecast future spending and make adjustments to stay on track.</li>
                                <li>Receive insights to manage recurring expenses like subscriptions or medical funds.</li>
                            </ul>
                        </div>
                        <div className="flex-1 flex justify-center">
                            <img src={measureImg} alt="measure" className="w-[400px] lg:h-[350px] object-cover" />
                        </div>
                    </div>
                </div>
            </div>


            {/* Core */}
            {/* <div className="flex justify-center items-center">
        <div className="bg-white rounded-2xl max-w-3xl shadow-lg overflow-hidden mt-24 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           
            <div className="p-6 w-full">
              <h2 className="text-[22px] md:text-[28px] font-bold mb-6 text-center md:text-left">
                CEO Nightmares <br className="hidden md:block" /> without
                Beenium
              </h2>
              <div className="space-y-4">
                {[
                  "No idea who’s working vs. who’s pretending.",
                  "Endless follow-ups.",
                  "Need training just to use the tool.",
                  "Unmotivated team, high payroll.",
                  "Not in office = Not in charge.",
                ].map((text, index) => (
                  <p
                    key={index}
                    className="text-[15px] md:text-[17px] text-gray-700"
                  >
                    {text}
                  </p>
                ))}
              </div>
            </div>

            
            <div className="bg-black p-6 rounded-tl-3xl md:rounded-tl-none md:rounded-tr-3xl text-white w-full">
              <h2 className="text-[22px] md:text-[28px] font-bold mb-6 text-center md:text-left">
                CEO Superpowers <br className="hidden md:block" /> with Beenium
              </h2>
              <div className="space-y-4">
                {[
                  "See who’s delivering & who’s slacking.",
                  "Automated WhatsApp updates & reminders.",
                  "Zero training needed. Anyone can use it.",
                  "Points system that drives motivation.",
                  "Run your business anytime with our mobile app.",
                ].map((text, index) => (
                  <p key={index} className="text-[15px] md:text-[17px]">
                    {text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div> */}
            <div className="flex items-center justify-center  mt-16">
                <div className="bg-white rounded-[60px] shadow-lg overflow-hidden  max-w-5xl border border-gray-900">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        {/* CEO Nightmares */}
                        <div className="p-6 md:p-10 flex flex-col gap-6 border-r md:border-r border-gray-800">
                            <h2 className="font-poppins text-[28px] md:text-[40px] leading-[1.4] border-b pb-3 border-gray-800">
                                <span className="flex items-center gap-2 relative">

                                    {/* Container for "Simplify" with overlapping underline */}
                                    <span className="relative inline-block">
                                        Nightmares
                                        <img
                                            src={underline1}
                                            alt="underline1"
                                            className="absolute left-0 bottom-[-2px] w-full"
                                        />
                                    </span>
                                </span>
                                without Xpence
                            </h2>
                            <div className="space-y-6">
                                {[
                                    "Spending without realizing where the money goes.",
                                    "Difficult to plan for future financial goals.",
                                    "Group expenses are hard to track and settle.",
                                    "Expense Fraud & Errors.",
                                    "Struggle to save consistently.",
                                    "Overspending due to impulse purchases.",
                                    "Difficult to manage medical and emergency funds."
                                ].map((item, index) => (
                                    <div
                                        key={index}
                                        className="text-[14px] md:text-[17px] text-gray-800 border-b last:border-b-0 border-gray-800 pb-3"
                                    >
                                        {item}
                                    </div>
                                ))}
                            </div>
                            {/* Without Beenium Image */}
                            <div className="mt-6 flex justify-center">
                                <img
                                    src={withoutBeenium}
                                    alt="Without Beenium"
                                    className="w-full max-w-[280px] md:max-w-[320px] rounded-lg object-contain"
                                />
                            </div>
                        </div>

                        {/* CEO Superpowers */}
                        <div className="p-6 md:p-10 flex flex-col gap-6 bg-white">
                            <h2 className="font-poppins text-[28px] md:text-[40px] leading-[1.4] border-b pb-3 border-gray-800">
                                <span className="flex items-center gap-2 relative">

                                    {/* Container for "Simplify" with overlapping underline */}
                                    <span className="relative inline-block">
                                        Superpowers
                                        <img
                                            src={underline1}
                                            alt="underline1"
                                            className="absolute left-0 bottom-[-2px] w-full"
                                        />
                                    </span>
                                </span>
                                with Xpence
                            </h2>
                            <div className="space-y-6">
                                {[
                                    "Automatically classifies expenses, detects spending patterns, and suggests budget adjustments.",
                                    "Users set financial goals and AI helps allocate funds accordingly.",
                                    "Detect fraud transactions by using clustering algorithm.",
                                    "Auto-splits expenses, reminds members, and ensures timely repayments.",
                                    "Notifies users when they are overspending in a category.",

                                ]
                                    .map((item, index) => (
                                        <div
                                            key={index}
                                            className="text-[14px] md:text-[17px] text-gray-900 border-b last:border-b-0 border-gray-800 pb-3"
                                        >
                                            {item}
                                        </div>
                                    ))}
                            </div>
                            {/* With Beenium Image */}
                            <div className="mt-6 flex justify-center">
                                <img
                                    src={withBeenium}
                                    alt="With Beenium"
                                    className="w-full max-w-[280px] md:max-w-[320px] rounded-lg object-contain"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-16 text-center mb-14">
                <div className="flex flex-col items-center gap-3">
                    <h1 className="flex flex-col items-center space-y-2">
                        <p className="font-poppins font-bold text-dark text-[40px]  md:text-[70px] tracking-tight">
                            No more budgeting<span className="font-poppins">-</span> stress<span className="font-poppins">.</span>
                        </p>
                        <p className="font-poppins text-gray-500 text-[18px]  md:text-[28px] tracking-tight">
                            Join thousands of users and simplify your finances with Xpence today.
                        </p>
                    </h1>
                    <div className="flex items-center gap-5 mt-4">
                        <button className="bg-dark px-5 md:px-10 py-2 md:text-[19px] text-black rounded-full hover:bg-gray-400">
                            <Link to={`${currentUser ? "/" : "/auth/sign-up"}`}>Get started free</Link>
                        </button>
                        <button className="bg-dark px-5  md:px-10 py-2 md:text-[19px] text-black rounded-full hover:bg-gray-400">
                            <Link to={"/contact-sales"}>Request a demo</Link>
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
}
