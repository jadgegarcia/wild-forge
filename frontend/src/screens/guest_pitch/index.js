import React, { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';
import { useAuth } from '../../contexts/AuthContext';
import { MeetingsService } from '../../services';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/header';
import Search from '../../components/search';
import GLOBALS from '../../app_globals';
import { useNavigate } from 'react-router-dom';
import './index.scss';

function GuestPitch() {
    const { accessToken } = useAuth();
    const user = jwtDecode(accessToken);
    const navigate = useNavigate();
    const [invitedMeetings, setInvitedMeetings] = useState([]);

    let buttons;
    if (user?.role === GLOBALS.USER_ROLE.MODERATOR) {
        buttons = GLOBALS.SIDENAV_MODERATOR;
    } else {
        buttons = GLOBALS.SIDENAV_DEFAULT;
    }

    useEffect(() => {
        async function fetchInvitedMeetings() {
            try {
                const response = await MeetingsService.getInvitedMeetingsByEmail(user.email);
                console.log('Invited meetings response:', response.data);
                setInvitedMeetings(response.data.meetings);
            } catch (error) {
                console.error('Error fetching invited meetings:', error.response?.data || error.message);
            }
        }
        fetchInvitedMeetings();
    }, [user.email]);

    const handleJoinClick = (meeting) => {
        console.log("Join button clicked for meeting:", meeting);
        if (meeting.status === 'in_progress') {
            console.log("Navigating to:", `/classes/${meeting.classroom_id}/teknoplat/live/${meeting.id}`);
            navigate(`/classes/${meeting.classroom_id}/teknoplat/live/${meeting.id}`);
        }
    };

    return (
        <div className="d-flex">
            <Sidebar name={`${user?.first_name} ${user?.last_name}`} sidebarItems={buttons} />
            <div className="container-fluid d-flex flex-column">
                <Header />
                <div className="d-flex pt-2 pb-2">
                    <div className="py-2 mx-5">
                        <Search />
                    </div>
                </div>
                <div className="d-flex flex-column">
                    <div className="brown-text fw-bold fs-5 py-2 px-5 underline">MEETING INVITES</div>
                    <div className="px-5 py-2">
                        {invitedMeetings.length > 0 ? (
                            invitedMeetings.map((meeting) => (
                                <div key={meeting.id} className="meeting-item">
                                    <span>{meeting.status}</span>
                                    <span className="meeting-name">{meeting.name}</span>
                                    <button onClick={() => handleJoinClick(meeting)}>Join Meeting</button>
                                </div>
                            ))
                        ) : (
                            <h5>No meeting invites found.</h5>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GuestPitch;
