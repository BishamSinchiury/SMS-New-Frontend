import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import styles from '../OrgSetup.module.css';

// Fix for Leaflet marker icons in React
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

function LocationMarker({ position, setPosition }) {
    const map = useMapEvents({
        click(e) {
            setPosition(e.latlng);
            map.flyTo(e.latlng, map.getZoom());
        },
    });

    return position === null ? null : (
        <Marker position={position}></Marker>
    );
}

export default function ContactInfo({ formData, handleChange, setFormData, errors }) {
    const [position, setPosition] = useState(
        formData.latitude && formData.longitude
            ? { lat: parseFloat(formData.latitude), lng: parseFloat(formData.longitude) }
            : { lat: 27.7172, lng: 85.3240 } // Default to Kathmandu
    );

    useEffect(() => {
        if (position) {
            setFormData(prev => ({
                ...prev,
                latitude: position.lat.toFixed(6),
                longitude: position.lng.toFixed(6)
            }));
        }
    }, [position, setFormData]);

    return (
        <div className="flex flex-col gap-6">
            <div className={styles.formGrid}>
                <div className={styles.fieldGroup}>
                    <label className={styles.label}>Contact Email</label>
                    <input
                        type="email"
                        name="contact_email"
                        value={formData.contact_email}
                        onChange={handleChange}
                        className={styles.input}
                        placeholder="admin@college.edu.np"
                    />
                    {errors.contact_email && <span className={styles.errorMsg}>{errors.contact_email}</span>}
                </div>

                <div className={styles.fieldGroup}>
                    <label className={styles.label}>Contact Phone</label>
                    <input
                        type="tel"
                        name="contact_phone"
                        value={formData.contact_phone}
                        onChange={handleChange}
                        className={styles.input}
                        placeholder="+977-98XXXXXXXX"
                    />
                    {errors.contact_phone && <span className={styles.errorMsg}>{errors.contact_phone}</span>}
                </div>
            </div>

            <div className={styles.fieldGroup}>
                <label className={styles.label}>Physical Address</label>
                <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={`${styles.input} ${styles.textarea}`}
                    placeholder="Street Address, City, District"
                />
                {errors.address && <span className={styles.errorMsg}>{errors.address}</span>}
            </div>

            <div className={styles.fieldGroup}>
                <label className={styles.label}>Location (Click on map to set)</label>
                <div className={styles.mapContainer}>
                    <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <LocationMarker position={position} setPosition={setPosition} />
                    </MapContainer>
                </div>
                <div className="flex gap-4 text-sm text-muted">
                    <span>Lat: {formData.latitude || '-'}</span>
                    <span>Lng: {formData.longitude || '-'}</span>
                </div>
            </div>
        </div>
    );
}
