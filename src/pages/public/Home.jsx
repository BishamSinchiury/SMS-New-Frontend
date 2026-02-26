import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { MainLayout } from '@/components/layout';
import styles from './Home.module.css';

const Home = () => {
    return (
        <MainLayout>
            <div className={styles.homeContainer}>
                {/* Hero Section */}
                <div className={styles.heroWrapper}>
                    <section className={styles.heroSection}>
                        <h1 className={styles.heroTitle}>
                            Welcome to EECOHM
                        </h1>
                        <p className={styles.heroSubtitle}>
                            EECOHM School of Excellence is a top-tier educational establishment that provides comprehensive education from Pre-school till High School Diploma. Our dynamic environment fosters intellectual, artistic, and physical growth in students, with an emphasis on academic excellence and skill-based education.
                        </p>
                        <div className={styles.ctaButtons}>
                            <Link to={ROUTES.SIGNUP} className={styles.btnPrimary}>
                                <span>Get Started</span>
                            </Link>
                            <Link to={ROUTES.LOGIN} className={styles.btnSecondary}>
                                Login Now
                            </Link>
                        </div>
                    </section>
                </div>


            </div>
        </MainLayout>
    );
};

export default Home;
