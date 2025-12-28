/* //clipsgrooming/src/components/Profile.jsx */

import React from 'react';
import profileImg from "../assets/ProfileGallery.jpg";

function Profile( {onBookNow }){
    return (
        <section className='profile'>
        <div className='profile-image-wrapper'>
        <img src={profileImg} alt='Barber profile' />
        </div>

        <h3>Zandalio's Grooming</h3>
        <p>Master Barber | Percission Fades | Classic Grooming</p>

        <button className="booking-btn" onClick={onBookNow}>
            Book Now
        </button>
        </section>
    )
}


export default Profile;