import React, { useRef, useEffect } from 'react';
import styles from './OTPInput.module.css';

const OTPInput = ({ length = 6, value, onChange, error }) => {
    const inputs = useRef([]);

    useEffect(() => {
        if (inputs.current[0]) {
            inputs.current[0].focus();
        }
    }, []);

    const handleChange = (e, index) => {
        const val = e.target.value;
        if (isNaN(val)) return;

        const newOtp = value.split('');
        newOtp[index] = val.substring(val.length - 1);
        const combinedOtp = newOtp.join('');
        onChange(combinedOtp);

        // Move to next input if value exists
        if (val && index < length - 1 && inputs.current[index + 1]) {
            inputs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !value[index] && index > 0 && inputs.current[index - 1]) {
            inputs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const data = e.clipboardData.getData('text').slice(0, length);
        if (isNaN(data)) return;
        onChange(data.padEnd(length, '').trim()); // Adjust if needed
        // Ideally distribute logic, but simple paste support:
        // For now, let parent handle string update, and we just render.
        // Actually, for better UX:
        if (data.length === length) {
            inputs.current[length - 1].focus();
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.inputs}>
                {[...Array(length)].map((_, index) => (
                    <input
                        key={index}
                        ref={(el) => inputs.current[index] = el}
                        type="text"
                        maxLength={1}
                        className={`${styles.input} ${error ? styles.error : ''}`}
                        value={value[index] || ''}
                        onChange={(e) => handleChange(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onPaste={handlePaste}
                    />
                ))}
            </div>
            {error && <p className={styles.errorMessage}>{error}</p>}
        </div>
    );
};

export default OTPInput;
