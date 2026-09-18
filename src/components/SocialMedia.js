import React, { useState } from 'react';
import Link from 'next/link';

const socialLinks = [
  {
    key: 'github',
    href: 'https://github.com/Enzopinotti',
    label: 'GitHub',
    icon: '/images/icons/GitHub.png',
    activeIcon: '/images/icons/GitHub_relleno.png',
  },
  {
    key: 'linkedin',
    href: 'https://www.linkedin.com/in/enzo-daniel-pinotti-667270179/',
    label: 'LinkedIn',
    icon: '/images/icons/LinkedIn.png',
    activeIcon: '/images/icons/LinkedIn_relleno.png',
  },
  {
    key: 'figma',
    href: 'https://www.figma.com/files/recents-and-sharing/recently-viewed?fuid=1245782265747292159',
    label: 'Figma',
    icon: '/images/icons/Figma.png',
    activeIcon: '/images/icons/Figma_relleno.png',
  },
];

const SocialMedia = () => {
  const [active, setActive] = useState(null);

  return (
    <div className="flex justify-center space-x-6 mb-4">
      {socialLinks.map((link) => (
        <Link
          key={link.key}
          href={link.href}
          aria-label={link.label}
          onMouseEnter={() => setActive(link.key)}
          onMouseLeave={() => setActive(null)}
          onFocus={() => setActive(link.key)}
          onBlur={() => setActive(null)}
          className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-mikado-yellow"
        >
          <img
            src={active === link.key ? link.activeIcon : link.icon}
            alt=""
            aria-hidden="true"
            width="30"
            height="40"
          />
        </Link>
      ))}
    </div>
  );
};

export default SocialMedia;
