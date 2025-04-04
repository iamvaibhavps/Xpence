import React from 'react';
import Select from 'react-select';

const SelectInput = ({
    id = '',
    options = [],
    value = null,
    onChange = () => { },
    isMulti = false,
    isClearable = false,
    placeholder = '',
    customStyles = {},
    className = '',
    isDisabled = false,
    icon = '',
    styles = {},
    borderRadius = '0.75rem',
    borderColor = '#757575',
}) => {
    const defaultStyles = {
        control: (base, state) => ({
            ...base,
            backgroundColor: 'white',
            borderColor: borderColor,
            boxShadow: state.isFocused ? '0 0 0 0px #444444' : 'none',
            '&:hover': {
                borderColor: '#4B5556',
            },
            borderRadius: borderRadius,
            padding: '0.2rem 0.20rem',
            transition: 'border-color 0.1s ease',
            cursor: isDisabled ? 'not-allowed' : 'default',
            display: 'flex',
            alignItems: 'center',
            height: '40px',
            fontSize: '13px'
        }),
        placeholder: (base) => ({
            ...base,
            color: '#757575',
        }),
        singleValue: (base) => ({
            ...base,
            color: '#1e293b',
        }),
        multiValue: (base) => ({
            ...base,
            backgroundColor: '#e5e7eb',
        }),
        multiValueLabel: (base) => ({
            ...base,
            color: '#1e293b',
        }),
        multiValueRemove: (base) => ({
            ...base,
            color: '#1e293b',
            '&:hover': {
                backgroundColor: 'bg-lightBlue',
                color: '#1e293b',
            },
        }),
        dropdownIndicator: (base) => ({
            ...base,
            color: '#94a3b8', // You can customize the color here
        }),
    };

    const customDropdownIndicator = (props) => {
        return (
            <div {...props.innerProps} style={{ display: 'flex', alignItems: 'center' }}>
                {icon} {/* This is where the icon is rendered */}
            </div>
        );
    };

    return (
        <Select
            id={id}
            options={options}
            value={value}
            onChange={onChange}
            isMulti={isMulti}
            isClearable={isClearable}
            placeholder={placeholder}
            styles={{ ...defaultStyles, ...customStyles } || styles}
            className={`w-full ${className}`}
            isDisabled={isDisabled}
            components={{ DropdownIndicator: customDropdownIndicator }} // Use custom DropdownIndicator
        />
    );
};

export default SelectInput;