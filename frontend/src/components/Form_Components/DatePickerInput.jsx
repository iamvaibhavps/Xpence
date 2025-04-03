import React, { useState } from "react";
import { DateTimePicker, DatePicker, Picklist, PicklistOption } from "react-rainbow-components";
import PropTypes from "prop-types";
import "./DatePickerInput.css"; 

const containerStyles = {
    maxWidth: 400,
};

const okButtonLocalizedLabel = {
    "en-US": "OK",
    "es-ES": "Aceptar",
    "fr-FR": "D'accord",
};

const cancelButtonLocalizedLabel = {
    "en-US": "Cancel",
    "es-ES": "Cancelar",
    "fr-FR": "Annuler",
};

const DatePickerInput = ({
    value,
    onDateTimeChange,
    disabled,
    icon,
    renderInput,
    locale = "en-US",
    className = "",
    minDate,
    type,
}) => {
    const [selectedLocale, setSelectedLocale] = useState({ name: locale, label: "English (US)" });

    const handleLocaleChange = (value) => {
        setSelectedLocale(value);
    };

    return (
        <div
            className={`rainbow-align-content_center rainbow-m-vertical_large rainbow-p-horizontal_small rainbow-m_auto ${className}`}
            style={containerStyles}
        >
            {/* <Picklist
                value={selectedLocale}
                onChange={(value) => handleLocaleChange(value)}
            >
                <PicklistOption name="en-US" label="English (US)" />
                <PicklistOption name="es-ES" label="Spanish (Spain)" />
                <PicklistOption name="fr-FR" label="French" />
            </Picklist> */}

            {type === "birthDate" ? (
                <DatePicker
                    id="custom-datepicker"
                    value={value}
                    onChange={onDateTimeChange}
                    formatStyle="large"
                    locale={selectedLocale.name}
                    okLabel={okButtonLocalizedLabel[selectedLocale.name]}
                    cancelLabel={cancelButtonLocalizedLabel[selectedLocale.name]}
                    disabled={disabled}
                    icon={icon}
                    className={`rainbow-m-top_medium custom-datepicker w-full ${className}
                        ${disabled ? "text-dark opacity-100 cursor-not-allowed" : ""
                        }`}
                    borderRadius="semi-rounded"
                    minDate={minDate}
                />
            ) : (
                <DateTimePicker
                    id="custom-datetimepicker"
                    value={value}
                    onChange={onDateTimeChange}
                    formatStyle="large"
                    locale={selectedLocale.name}
                    okLabel={okButtonLocalizedLabel[selectedLocale.name]}
                    cancelLabel={cancelButtonLocalizedLabel[selectedLocale.name]}
                    disabled={disabled}
                    icon={icon}
                    className={`rainbow-m-top_medium custom-datetimepicker w-full ${className}
                        ${disabled ? "text-dark opacity-100 cursor-not-allowed" : ""
                        }`}
                    borderRadius="semi-rounded"
                    minDate={minDate}
                />
            )}

            {renderInput && renderInput({ value, onChange: onDateTimeChange })}
        </div>
    );
};

DatePickerInput.propTypes = {
    value: PropTypes.instanceOf(Date),
    onDateTimeChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    icon: PropTypes.node,
    renderInput: PropTypes.func,
    locale: PropTypes.string,
    className: PropTypes.string,
    type: PropTypes.string,
};

export default DatePickerInput;