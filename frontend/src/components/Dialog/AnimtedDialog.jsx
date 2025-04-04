import React from "react";
import { Dialog } from "@headlessui/react";
import { Button } from "@material-tailwind/react";

const AnimatedDialog = ({
    isOpen,
    onClose,
    title,
    children,
    footerButtons = [], 
    headerButtons = [], 
    className = "",
    roundedSize = 'lg',
    backgroundColor = 'white',
}) => {

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50 ">
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
                aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center">
                <Dialog.Panel
                    className={`w-full bg-${backgroundColor}   rounded-${roundedSize} border border-dark shadow-lg  ${className}`}
                >
                    {/* Header Section */}
                    {/* <div className="flex items-center justify-between bg-blue-400">
                        {title && <Dialog.Title className="text-lg font-bold">{title}</Dialog.Title>}
                        <div className="flex space-x-2">
                            {headerButtons.map(({ key, label, onClick, color, variant, className }, index) => (
                                <Button
                                    key={key || index}
                                    onClick={onClick}
                                    color={color || "blue"}
                                    variant={variant || "filled"}
                                    className={className || ""}
                                >
                                    {label}
                                </Button>
                            ))}
                        </div>
                    </div> */}



                    {/* Content Section */}
                    <div className="">{children}</div>

                    {/* Footer Section */}
                    {footerButtons.length > 0 && (
                        <div className="flex justify-end space-x-2 mt-4">
                            {footerButtons.map(({ key, label, onClick, color, variant, className }, index) => (
                                <Button
                                    key={key || index}
                                    onClick={onClick}
                                    color={color || "blue"}
                                    variant={variant || "gradient"}
                                    className={className || ""}
                                >
                                    {label}
                                </Button>
                            ))}
                        </div>
                    )}
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};

export default AnimatedDialog;