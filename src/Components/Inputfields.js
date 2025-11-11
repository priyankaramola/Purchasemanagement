import React from "react";
import PropTypes from "prop-types";

const InputField = ({ type, id, placeholder, className,setValue,value,userSelect, ...props }) => {
    return (
        <input
            type={type}
            id={id}
            className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-300  block w-full p-2.5 shadow-md focus:outline-none focus:bg-white focus:border-gray-300 ${className}`}
            placeholder={placeholder}
            required
            onCopy={()=> {return userSelect}}
            onSelect={() =>{return userSelect}}
            onChange={(e)=>setValue(e.target.value)}
            value={value}
            {...props}
        />
    );
};

InputField.propTypes = {
    type: PropTypes.string,
    id: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    className: PropTypes.string,
};

InputField.defaultProps = {
    type: "text",
};

export default InputField;
