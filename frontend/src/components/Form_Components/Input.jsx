import React from 'react';
import PropTypes from 'prop-types';

const Input = ({
    type = 'text',
    id = '',
    name = '',
    className = 'w-full',
    placeholder = '',
    onChange = () => { },
    required = false,
    value = '',
    disabled = false,
    readOnly = false,
    icon = null,
    ...rest
}) => {

    // console.log("Name is: ", name);
    // console.log("Type is: ", type);

    return (
        <div className={`relative w-full`}>
            <input
                type={type}
                id={id}
                name={name}
                className={`text-[15px] md:text-[13px] lg:text-[13px] bg-transparent h-[40px]  text-slate-700 text-md border border-gray-600 placeholder:text-gray-600 rounded-xl px-3 py-2 pr-10 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-800 shadow-sm focus:shadow ${className} 
                ${disabled ? 'cursor-not-allowed bg-gray-100 text-gray-500' : ''}`}
                placeholder={placeholder}
                onChange={onChange}
                required={required}
                value={value}
                min={type === 'number' ? 0 : undefined}
                disabled={disabled}
                readOnly={readOnly}
                {...rest}
            />
            {icon && (
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    {icon}
                </span>
            )}
        </div>
    );
};

Input.propTypes = {
    type: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string,
    className: PropTypes.string,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    required: PropTypes.bool,
    value: PropTypes.string,
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,
    icon: PropTypes.node,
};

export default Input;