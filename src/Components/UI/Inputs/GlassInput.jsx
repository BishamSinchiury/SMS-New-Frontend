import React from 'react';
import styles from './GlassInput.module.css';

const GlassInput = ({ label, id, error, icon: Icon, rightElement, ...props }) => {
    return (
        <div className={styles.group}>
            {label && <label htmlFor={id} className={styles.label}>{label}</label>}
            <div className={`${styles.wrapper} ${error ? styles.errorWrapper : ''}`}>
                {Icon && <Icon className={styles.icon} size={20} />}
                <input
                    id={id}
                    className={styles.input}
                    {...props}
                />
                {rightElement && <div className={styles.rightElement}>{rightElement}</div>}
            </div>
            {error && <span className={styles.errorMessage}>{error}</span>}
        </div>
    );
};

export default GlassInput;
