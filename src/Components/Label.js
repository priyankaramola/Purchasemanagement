import React from "react";
import PropTypes from "prop-types";

const Label = ({ htmlFor, children,value, ...props }) => {
    return (
        <label
            htmlFor={htmlFor}
            className="block mb-2 text-m font-medium text-gray-600"
            {...props}
        >
            {children}
        </label>
    );
}

Label.propTypes = {
    htmlFor: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
};

export default Label;
