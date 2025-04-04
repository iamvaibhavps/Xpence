import React from 'react';
import { FaSearch } from 'react-icons/fa'; 

const TextArea = ({
    id = '',
    name = '',
    className = '',
    placeholder = '',
    onChange = () => { },
    required = false,
    value = '',
    rows = 3,
    disabled = false,
    readOnly = false,
    icon = '', 
    ...rest
}) => {
    return (
        <div className="relative w-full">
            <textarea
                id={id}
                name={name}
                className={`text-[15px] md:text-[13px] lg:text-[13px] w-full bg-transparent border border-gray-600 placeholder:text-gray-600 text-slate-700 text-md S rounded-xl px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow ${className}
                ${disabled ? 'cursor-not-allowed bg-gray-100 text-gray-500' : ''}`}
                placeholder={placeholder}
                onChange={onChange}
                required={required}
                value={value}
                rows={rows}
                disabled={disabled}
                readOnly={readOnly}
                {...rest}
            />
            {icon && (
                <div className="absolute bottom-4 right-3 text-gray-500">
                    {icon}
                </div>
            )}
        </div>
    );
};

export default TextArea;