import React from 'react';
import UserLayout from '@/components/layout/UserLayout';
import styles from './UserDashboard.module.css';
import { useAuth } from '@/context/AuthContext';
import {
    GraduationCap,
    Users,
    School,
    CalendarCheck,
    Clock,
    Bell,
    ArrowUpRight,
    Search,
    AlertCircle
} from 'lucide-react';

const UserDashboard = () => {
    const { user } = useAuth();
    // Mock data for the dashboard
    const stats = [
        { label: 'Total Students', value: '1,284', icon: GraduationCap, color: '#4361ee' },
        { label: 'Total Teachers', value: '64', icon: Users, color: '#3f37c9' },
        { label: 'Active Classes', value: '24', icon: School, color: '#4cc9f0' },
        { label: 'Attendance Today', value: '94%', icon: CalendarCheck, color: '#4895ef' },
    ];

    const upcomingEvents = [
        { title: 'Parent-Teacher Meeting', date: 'Oct 24, 2023', time: '10:00 AM', type: 'Meeting' },
        { title: 'Mid-term Exams Begin', date: 'Nov 02, 2023', time: '09:00 AM', type: 'Academic' },
        { title: 'Annual Sports Day', date: 'Nov 15, 2023', time: '08:30 AM', type: 'Event' },
    ];

    const notices = [
        { title: 'New Timetable Release', content: 'The timetable for the upcoming semester has been released.', time: '2 hours ago' },
        { title: 'Holiday Announcement', content: 'School will remain closed on Friday for national holiday.', time: '1 day ago' },
        { title: 'Fee Payment Deadline', content: 'Last date for semester fee payment is next Monday.', time: '3 days ago' },
    ];

    return (
        <UserLayout title="Dashboard Overview">
            <div className={styles.container}>
                {user?.approval_status === 'PENDING_APPROVAL' && (
                    <div className={styles.approvalBanner}>
                        <div className={styles.bannerContent}>
                            <AlertCircle size={20} />
                            <span>Your profile is currently <strong>pending approval</strong>. Some dashboard features are restricted until an administrator verifies your account.</span>
                        </div>
                    </div>
                )}
                {/* Search and Filter Area */}
                <div className={styles.header}>
                    <div className={styles.searchBox}>
                        <Search size={18} className={styles.searchIcon} />
                        <input type="text" placeholder="Search students, teachers, or reports..." className={styles.searchInput} />
                    </div>
                </div>

                {/* Stats Grid */}
                <div className={styles.statsGrid}>
                    {stats.map((stat, index) => (
                        <div key={index} className={styles.statCard}>
                            <div className={styles.statIcon} style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                                <stat.icon size={24} />
                            </div>
                            <div className={styles.statInfo}>
                                <span className={styles.statLabel}>{stat.label}</span>
                                <h3 className={styles.statValue}>{stat.value}</h3>
                            </div>
                            <div className={styles.statTrend}>
                                <ArrowUpRight size={16} />
                                <span>+2.4%</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.dashboardContent}>
                    {/* Main Feed / Chart Placeholder */}
                    <div className={styles.mainPanel}>
                        <div className={styles.panelHeader}>
                            <h3 className={styles.panelTitle}>Academic Performance</h3>
                            <select className={styles.panelSelect}>
                                <option>This Term</option>
                                <option>Last Term</option>
                            </select>
                        </div>
                        <div className={styles.chartPlaceholder}>
                            <div className={styles.mockChart}>
                                {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                                    <div key={i} className={styles.chartBar} style={{ height: `${h}%` }}></div>
                                ))}
                            </div>
                            <div className={styles.chartLabels}>
                                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Panels */}
                    <div className={styles.sidePanels}>
                        {/* Upcoming Events */}
                        <div className={styles.panel}>
                            <div className={styles.panelHeader}>
                                <h3 className={styles.panelTitle}>Events</h3>
                                <button className={styles.viewAll}>View all</button>
                            </div>
                            <div className={styles.eventsList}>
                                {upcomingEvents.map((event, index) => (
                                    <div key={index} className={styles.eventItem}>
                                        <div className={styles.eventDate}>
                                            <span className={styles.dateDay}>{event.date.split(' ')[1].replace(',', '')}</span>
                                            <span className={styles.dateMonth}>{event.date.split(' ')[0]}</span>
                                        </div>
                                        <div className={styles.eventDetails}>
                                            <h4 className={styles.eventTitle}>{event.title}</h4>
                                            <span className={styles.eventTime}>
                                                <Clock size={12} /> {event.time}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Notices */}
                        <div className={styles.panel}>
                            <div className={styles.panelHeader}>
                                <h3 className={styles.panelTitle}>Notices</h3>
                                <div className={styles.notificaitonDot}></div>
                            </div>
                            <div className={styles.noticesList}>
                                {notices.map((notice, index) => (
                                    <div key={index} className={styles.noticeItem}>
                                        <div className={styles.noticeHeader}>
                                            <h4 className={styles.noticeTitle}>{notice.title}</h4>
                                            <span className={styles.noticeTime}>{notice.time}</span>
                                        </div>
                                        <p className={styles.noticeContent}>{notice.content}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
};

export default UserDashboard;
