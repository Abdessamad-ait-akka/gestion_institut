import React from 'react';

const DashboardCard = ({ icon, title, description, onClick }) =>{
    return (
        <div onClick={onClick} style={styles.card}>
            <div style={styles.icon}> {icon}</div>
            <h3 style={styles.title}>{title}</h3>
            <p style={styles.description}>{description}</p>
        </div>
    );
};

const styles = {
    card: {
        width: '220px',
        background: '#fff',
        borderRadius: '8px',
        padding: '20px',
        textAlign: 'center',
        bxShadow: '0 2px 6px rgba(0,0,0,0,0.1)',
        cursor: 'pointer',
        transition: '0.3s',
    },
    icon: {
        background: '#00aaff',
        borderRadius: '50%',
        width: '80px',
        height: '80px',
        margin: '0 auto 10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontsize: '32px',
    },

    title: {
        fontSize: '18px',
        margin: '10px 0 4px',
    },
    desc: {
        fontSize: '14px',
        color: '#666',
    },
};

export default DashboardCard;