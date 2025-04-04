import React from 'react'
import { Link } from 'react-router-dom';

import rightArrowIconImg from '../assets/homepage/rightArrowIconImg.webp'
// import { logoImg } from '../../allImages';
// import { logoIcon } from '../../allImages';

import instagramImg from '../assets/social_media/instagram.png'
import linkedinImg from '../assets/social_media/linkedin.png'
import facebookImg from '../assets/social_media/facebook.png'
import twitterImg from '../assets/social_media/twitter.png'
import youtubeImg from '../assets/social_media/youtube.png'

const Footer = () => {
  return (
    <div className="w-full mt-20 flex flex-col gap-5 text-white bg-black rounded-t-[30px]">
        {/* Links Section */}
        <div className="flex flex-col mt-10 px-10 md:mt-20 md:px-8 lg:px-16">
            <div className="grid grid-cols-2 sm:grid-cols-4 md:flex md:flex-wrap gap-8 md:gap-14 lg:gap-40">
                {/* Product */}
                <div className="flex flex-col gap-3">
                    <p className="font-bold text-[15px] md:text-[17px]">Product</p>
                    <div className="flex flex-col gap-2">
                        <p className="text-[14px] md:text-[17px]">
                            <Link to={"/product/overview"}>Overview</Link>
                        </p>
                        <p className="text-[14px] md:text-[17px]">
                            <Link to="/product/features">Features</Link>
                        </p>
                    </div>
                </div>

                {/* Resources */}
                <div className="flex flex-col gap-3">
                    <p className="font-bold text-[15px] md:text-[17px]">Resources</p>
                    <div className="flex flex-col gap-2">
                        <p className="text-[14px] md:text-[17px]">
                            <Link to="/blog">Blog</Link>
                        </p>
                        <p className="text-[14px] md:text-[17px]">
                            <Link to="/help-center">Help center</Link>
                        </p>
                        {/* <p className="text-[14px] md:text-[17px]">
                            <Link to="/success-stories">Success stories</Link>
                        </p>
                        <p className="text-[14px] md:text-[17px]">
                            <Link to="/about-us">About us</Link>
                        </p> */}
                    </div>
                </div>

                {/* Pricing */}
                <div className="flex flex-col gap-3">
                    <p className="font-bold text-[15px] md:text-[17px]">Pricing</p>
                    <div className="flex flex-col gap-2">
                        <p className="text-[14px] md:text-[17px]">
                            <Link to={"/pricing"}>Pricing details</Link>
                        </p>
                    </div>
                </div>

                {/* Contact */}
                <div className="flex flex-col gap-3">
                    <p className="font-bold text-[15px] md:text-[17px]">Contact</p>
                    <div className="flex flex-col gap-2">
                        <p className="text-[14px] md:text-[17px]">
                            <Link to={"/contact-sales"}>Contact sales</Link>
                        </p>
                        {/* <p className="text-[14px] md:text-[17px]">
                            <Link to={"/careers"}>Careers</Link>
                        </p> */}
                    </div>
                </div>

                {/* Newsletter Section */}
                <div className="flex flex-col gap-3 col-span-2 sm:col-span-4 md:col-span-1 mt-8 sm:mt-8 md:mt-0 lg:-ml-10">
                    <div className="text-[20px] md:text-[25px] lg:text-[36px] font-bold mb-4 text-center md:text-left">
                        Buzz with Xpence
                    </div>
                    <div>
                        <div className="flex flex-col md:flex-row items-center justify-between gap-2">
                            <p className="text-[14px] md:text-[17px] text-gray-500">
                                Email address
                            </p>
                            <img
                                src={rightArrowIconImg}
                                alt="arrow"
                                className="w-5 h-5"
                            />
                        </div>
                        <div className="flex gap-2 mt-2">
                            <input
                                type="checkbox"
                                id="newsletter"
                                className="w-4 h-4 mt-1 accent-orange"
                            />
                            <label
                                htmlFor="newsletter"
                                className="text-[14px] md:text-[17px]"
                            >
                                I agree to receive Xpence{" "}
                                <br className="hidden md:block lg:hidden" /> newsletter
                                <br className="hidden lg:block" /> and marketing{" "}
                                <br className="hidden md:block lg:hidden" /> emails.
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Logo Section */}
        <div className="w-full flex flex-col md:mt-4 lg:mt-0">
            <div className="flex items-center justify-center">
          
                <div>
                    <p className="font-bold text-[40px] md:text-[150px] lg:text-[250px] pl-4 md:pl-[65px] lg:pl-[100px]">
                        Xpence
                    </p>
                </div>
            </div>
            <hr className="h-[0.2px] border-1 border-gray-500 mx-8 md:mx-16 lg:mr-[100px]" />
        </div>

        {/* Social Media and Links Section */}
        <div className="px-4 py-10 md:px-16 md:py-14">
            <div className="flex flex-col gap-8 md:flex-row md:justify-between lg:gap-40 lg:mr-24 items-center">
                {/* Social Media Icons */}
                <div className="flex justify-center md:justify-start gap-6 lg:gap-10">
                    <Link to="https://www.instagram.com" target="_blank">
                        <img src={instagramImg} alt="Instagram" className="w-8 h-8" />
                    </Link>
                    <Link to="https://www.linkedin.com" target="_blank">
                        <img src={linkedinImg} alt="LinkedIn" className="w-8 h-8" />
                    </Link>
                    <Link to="https://www.facebook.com" target="_blank">
                        <img src={facebookImg} alt="Facebook" className="w-8 h-8" />
                    </Link>
                    <Link to="https://www.twitter.com" target="_blank">
                        <img
                            src={twitterImg}
                            alt="Twitter"
                            className="w-8 h-8 border rounded-full"
                        />
                    </Link>
                    <Link to="https://www.youtube.com" target="_blank">
                        <img src={youtubeImg} alt="YouTube" className="w-8 h-8" />
                    </Link>
                </div>

                {/* Terms and Privacy Links */}
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-10 lg:gap-48 text-center md:text-left">
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-10">
                        <p className="md:text-[17px]">
                            <Link to="/terms-service">Terms of use</Link>
                        </p>
                        <p className="md:text-[17px]">
                            <Link to="/privacy-policy">Privacy policy</Link>
                        </p>
                    </div>
                    <p className="md:text-[17px]">
                        &copy; Xpence 2025. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Footer;