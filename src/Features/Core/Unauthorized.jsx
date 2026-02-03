import React from 'react';
import { Link } from 'react-router-dom';
// import styles from './Unauthorized.module.css'; // Add styles later

const Unauthorized = () => {
    return (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'white' }}>
            <h1>403 - Unauthorized</h1>
            <p>You do not have permission to view this page.</p>
            <Link to="/dashboard" style={{ color: '#6366f1', marginTop: '1rem', display: 'inline-block' }}>
                Return to Dashboard
            </Link>
        </div>
    );
};

export default Unauthorized;
