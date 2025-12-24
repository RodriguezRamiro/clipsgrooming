/* //clipsgrooming/src/components/Banner.jsx */

import React from 'react';
import bannerImage from '../assets/bannerVan.jpg';


function Banner() {
    return (
        <section
        className="banner"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)),
            url(${bannerImage})
          `
        }}
      >
        <h2>Percision Cuts. Classic Style.</h2>
      </section>
    );
  }

  export default Banner;
