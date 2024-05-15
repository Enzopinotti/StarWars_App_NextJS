import React, { useState } from 'react';
import Link from 'next/link';

const SocialMedia = () => {
  const [hovered, setHovered] = useState({ github: false, linkedin: false, figma: false });

  return (
    <div className="flex justify-center space-x-6 mb-4">
      <Link href="https://github.com/Enzopinotti">
        <img
          src={hovered.github ? "/images/icons/GitHub_relleno.png" : "/images/icons/GitHub.png"}
          alt="GitHub"
          onMouseEnter={() => setHovered({ ...hovered, github: true })}
          onMouseLeave={() => setHovered({ ...hovered, github: false })}
          width="30"
          height="40"
        />
      </Link>
      <Link href="https://www.linkedin.com/in/enzo-daniel-pinotti-667270179/">
        <img
          src={hovered.linkedin ? "/images/icons/Linkedin_relleno.png" : "/images/icons/Linkedin.png"}
          alt="LinkedIn"
          onMouseEnter={() => setHovered({ ...hovered, linkedin: true })}
          onMouseLeave={() => setHovered({ ...hovered, linkedin: false })}
          width="30"
          height="40"
        />
      </Link>
      <Link href="https://www.figma.com/files/recents-and-sharing/recently-viewed?fuid=1245782265747292159">
        <img
          src={hovered.figma ? "/images/icons/Figma_relleno.png" : "/images/icons/Figma.png"}
          alt="Figma"
          onMouseEnter={() => setHovered({ ...hovered, figma: true })}
          onMouseLeave={() => setHovered({ ...hovered, figma: false })}
          width="30"
          height="40"
        />
      </Link>
    </div>
  );
};

export default SocialMedia;