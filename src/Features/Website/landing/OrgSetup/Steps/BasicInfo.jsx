import React from 'react';
import styles from '../OrgSetup.module.css';

export default function BasicInfo({ formData, handleChange, errors }) {
    return (
        <div className={styles.formGrid}>
            <div className={styles.fieldGroup}>
                <label className={styles.label}>Organization Name</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="e.g. Eastern Empire College"
                />
                {errors.name && <span className={styles.errorMsg}>{errors.name}</span>}
            </div>

            <div className={styles.fieldGroup}>
                <label className={styles.label}>Established Date</label>
                <input
                    type="date"
                    name="established_date"
                    value={formData.established_date}
                    onChange={handleChange}
                    className={styles.input}
                />
                {errors.established_date && <span className={styles.errorMsg}>{errors.established_date}</span>}
            </div>

            <div className={styles.fieldGroup}>
                <label className={styles.label}>PAN / VAT Number</label>
                <input
                    type="text"
                    name="pan_vat_number"
                    value={formData.pan_vat_number}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="e.g. 123456789"
                />
            </div>
        </div>
    );
}
