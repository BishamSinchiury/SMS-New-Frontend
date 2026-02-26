import React from 'react';
import styles from './Button.module.css';

/**
 * Button Component
 * 
 * Reusable button component with multiple variants and sizes.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.variant - Button style variant (primary, secondary, outline, ghost)
 * @param {string} props.size - Button size (sm, md, lg)
 * @param {boolean} props.fullWidth - Whether button should take full width
 * @param {boolean} props.disabled - Whether button is disabled
 * @param {Function} props.onClick - Click handler
 * @param {string} props.type - Button type (button, submit, reset)
 * @param {string} props.className - Additional CSS classes
 */
const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    disabled = false,
    onClick,
    type = 'button',
    className = '',
    ...rest
}) => {
    const buttonClasses = [
        styles.button,
        styles[variant],
        styles[size],
        fullWidth ? styles.fullWidth : '',
        className,
    ].filter(Boolean).join(' ');

    return (
        <button
            type={type}
            className={buttonClasses}
            onClick={onClick}
            disabled={disabled}
            {...rest}
        >
            {children}
        </button>
    );
};

export default Button;
