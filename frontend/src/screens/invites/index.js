import React, { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import { useAuth } from "../../contexts/AuthContext";
import { ClassRoomsService } from "../../services";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/header";
import Search from "../../components/search";
import GLOBALS from "../../app_globals";
import { useNavigate } from "react-router-dom";
import './index.scss';

function TeamInvite() {
    const { accessToken } = useAuth();
    const user = jwtDecode(accessToken);
    const navigate = useNavigate();
    const [invitedClassrooms, setInvitedClassrooms] = useState([]);
    const [joinRequestStatus, setJoinRequestStatus] = useState(null);

    let buttons;
    if (user?.role === GLOBALS.USER_ROLE.MODERATOR) {
        buttons = GLOBALS.SIDENAV_MODERATOR;
    } else {
        buttons = GLOBALS.SIDENAV_DEFAULT;
    }

    useEffect(() => {
        async function fetchInvitedClasses() {
            const data = {
                email: user.email
            };
            try {
                const response = await ClassRoomsService.getInvitedClasses(data);
                setInvitedClassrooms(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching invited meetings:', error.response?.data || error.message);
            }
        }
        fetchInvitedClasses();
    }, [user.email]);

    const handleJoinClick = async (classRoom) => {
        const data = {
            class_code: classRoom.class_code, // Assuming `class_code` exists
        };

        try {
            const response = await ClassRoomsService.join(data);
            console.log('Join request sent successfully:', response.data);
            setJoinRequestStatus('Request sent. Waiting for teacher approval.');
        } catch (error) {
            console.error('Error joining class:', error.response?.data || error.message);
            setJoinRequestStatus('Error joining class. Please try again.');
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
                    <div className="brown-text fw-bold fs-5 py-2 px-5 underline">TEAM INVITES</div>
                    <div className="px-5 py-2">
                        {invitedClassrooms?.classes && invitedClassrooms.classes.length > 0 ? (
                            invitedClassrooms.classes.map((classRoom) => (
                                <div key={classRoom.id} className="meeting-item">
                                    <span>{classRoom.course_name || "No Course Name"}</span>
                                    <span>{classRoom.sections || "No Sections"}</span>
                                    <span>{classRoom.schedule || "No Schedule"}</span>
                                    <button onClick={() => handleJoinClick(classRoom)}>Join Class</button>
                                </div>
                            ))
                        ) : (
                            <h5>No Class Invites Found.</h5>
                        )}
                        {joinRequestStatus && <p>{joinRequestStatus}</p>} {/* Display join request status */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TeamInvite;
