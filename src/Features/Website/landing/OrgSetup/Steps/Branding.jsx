import React, { useState } from 'react';
import styles from '../OrgSetup.module.css';

export default function Branding({ formData, handleChange, setFormData, errors }) {
    const [preview, setPreview] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, logo: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="flex flex-col gap-8">
            <div className={styles.fieldGroup}>
                <label className={styles.label}>Organization Logo</label>
                <label className={styles.fileUpload}>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        hidden
                    />
                    <div className="flex flex-col items-center gap-2">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <circle cx="8.5" cy="8.5" r="1.5"></circle>
                            <polyline points="21 15 16 10 5 21"></polyline>
                        </svg>
                        <span className="text-sm text-dim">Click to upload logo (PNG, JPG)</span>
                    </div>
                    {preview && (
                        <img src={preview} alt="Logo Preview" className={styles.previewImage} />
                    )}
                </label>
            </div>

            <div className={styles.fieldGroup}>
                <label className={styles.label}>Theme Colors</label>
                <div className="flex gap-8">
                    <div className="flex flex-col gap-2">
                        <span className="text-xs text-muted">Primary Color</span>
                        <div className={styles.colorPickerWrapper}>
                            <div
                                className={styles.colorPreview}
                                style={{ backgroundColor: formData.theme_color_primary }}
                            >
                                <input
                                    type="color"
                                    name="theme_color_primary"
                                    value={formData.theme_color_primary}
                                    onChange={handleChange}
                                    className={styles.colorInput}
                                />
                            </div>
                            <span className="text-sm font-mono">{formData.theme_color_primary}</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <span className="text-xs text-muted">Secondary Color</span>
                        <div className={styles.colorPickerWrapper}>
                            <div
                                className={styles.colorPreview}
                                style={{ backgroundColor: formData.theme_color_secondary }}
                            >
                                <input
                                    type="color"
                                    name="theme_color_secondary"
                                    value={formData.theme_color_secondary}
                                    onChange={handleChange}
                                    className={styles.colorInput}
                                />
                            </div>
                            <span className="text-sm font-mono">{formData.theme_color_secondary}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
