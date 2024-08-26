import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faMoon, faSun, faPause, faTimesCircle, faSmile, faFrown } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';

const STATUS = {
    AWAY: 'away',
    DND: 'dnd',
    XA: 'xa',
    ONLINE: 'online',
    OFFLINE: 'offline',
};

// Map of status to icons
const statusIcons = {
    [STATUS.AWAY]: faMoon,          // Representing away status with a moon icon
    [STATUS.DND]: faPause,         // Do Not Disturb represented with a pause icon
    [STATUS.XA]: faTimesCircle,    // Extended Away represented with a times circle icon
    [STATUS.ONLINE]: faCircle,     // Online represented with a circle icon
    [STATUS.OFFLINE]: faFrown,     // Offline represented with a frown icon
};

const Avatar = ({ jid, status, imageUrl }) => {
    const icon = statusIcons[status] || faSmile; // Default icon if status is unknown

    return (
        <div className="d-flex align-items-center">
            <img
                src={imageUrl || 'default-avatar.png'}
                alt={jid}
                className="rounded-circle"
                style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px' }}
            />
            <FontAwesomeIcon
                icon={icon}
                size="lg"
                style={{
                    color: status === STATUS.ONLINE ? 'green' :
                           status === STATUS.AWAY ? 'orange' :
                           status === STATUS.DND ? 'red' :
                           status === STATUS.XA ? 'blue' :
                           'gray',
                    position: 'relative',
                    top: '-30px',
                    left: '-10px',
                }}
            />
        </div>
    );
};

export default Avatar;
