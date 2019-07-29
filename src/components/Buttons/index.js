import SubmitButton from './SubmitButton'
import SaveButton from './SaveButton'
import CancelButton from './CancelButton'
import PropTypes from "prop-types";
import React from "react";

const Button = ({
                    onClick,
                    className = '',
                    children
                }) =>
    <button
        onClick={onClick}
        className={className}
        type="button"
    >
        {children}
    </button>;

Button.defaultProps = {
    className: '',
};
Button.propTypes = {
    onClick: PropTypes.func.isRequired,
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
};

export {
    SubmitButton,
    SaveButton,
    CancelButton,
    Button,
};