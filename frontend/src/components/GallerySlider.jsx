import React, { useState, useEffect, useRef } from 'react';

import img1 from '../assets/WhatsApp Image 2026-09-08 at .jpeg';
import img2 from '../assets/WhatsApp Image 2026-09-08 at 8..jpeg';
import img3 from '../assets/WhatsApp Image 2026-09-08 at 8.0.jpeg';
import img4 from '../assets/WhatsApp Image 2026-09-08 at 8.04..jpeg';
import img5 from '../assets/WhatsApp Image 2026-09-08 at 8.04.41 P.jpeg';
import img6 from '../assets/WhatsApp Image 2026-09-08 at 8.04.41 PM.jpeg';
import img7 from '../assets/WhatsApp Image 2026-09-08 at 8.04.44 PM.jpeg';
import img8 from '../assets/WhatsApp Image 2026-09-08 at 8.05.07 PM.jpeg';
import img9 from '../assets/WhatsApp Image 2026-09-08 at 8.05.08 PM.jpeg';
import img10 from '../assets/WhatsApp Image 2026-09-08 at 8.06.28.jpeg';
import img11 from '../assets/WhatsApp Image 2026-09-08 at 8.06.29.jpeg';
import img12 from '../assets/kamal.jpg';
import img13 from '../assets/kk.jpeg';
import img14 from '../assets/oo.jpeg';
import img15 from '../assets/pg.jpg';
import img16 from '../assets/WhatsApp Image 2026-09-08 at 8.--.jpeg';
import img17 from '../assets/WhatsApp Image 2026-09-08 at 8.24..jpeg';
import img18 from '../assets/WhatsApp Image 2026-09-08 at 8.24.08 PM.jpeg';
import img19 from '../assets/WhatsApp Image 2026-09-08 at 8.24.14 .jpeg';
import img20 from '../assets/WhatsApp Image 2026-09-08 at 8.24.14 PM.jpeg';
import img21 from '../assets/WhatsApp Image 2026-09-08 at 8.24.15 PM.jpeg';
import img22 from '../assets/ooo.jpeg';

const galleryPhotos = [
  { id: 1, src: img12, title: 'Kamal Bohara' },
  { id: 2, src: img13, title: 'Memories' },
  { id: 3, src: img14, title: 'Moments' },
  { id: 4, src: img22, title: 'Special Moments' },
  { id: 5, src: img15, title: 'Highlights' },
  { id: 6, src: img1, title: 'Gallery Photo 1' },
  { id: 7, src: img16, title: 'Gallery Photo 2' },
  { id: 8, src: img2, title: 'Gallery Photo 3' },
  { id: 9, src: img3, title: 'Gallery Photo 4' },
  { id: 10, src: img4, title: 'Gallery Photo 5' },
  { id: 11, src: img5, title: 'Gallery Photo 6' },
  { id: 12, src: img6, title: 'Gallery Photo 7' },
  { id: 13, src: img7, title: 'Gallery Photo 8' },
  { id: 14, src: img8, title: 'Gallery Photo 9' },
  { id: 15, src: img9, title: 'Gallery Photo 10' },
  { id: 16, src: img10, title: 'Gallery Photo 11' },
  { id: 17, src: img11, title: 'Gallery Photo 12' },
  { id: 18, src: img17, title: 'Gallery Photo 13' },
  { id: 19, src: img18, title: 'Gallery Photo 14' },
  { id: 20, src: img19, title: 'Gallery Photo 15' },
  { id: 21, src: img20, title: 'Gallery Photo 16' },
  { id: 22, src: img21, title: 'Gallery Photo 17' },
];

export default function GallerySlider() {
  const [activeModal, setActiveModal] = useState(null);
  const wrapperRef = useRef(null);
  const cardRefs = useRef([]);

  // Triple photos list to ensure seamless infinite looping
  const marqueeList = [...galleryPhotos, ...galleryPhotos, ...galleryPhotos];

  useEffect(() => {
    let animFrameId;

    const checkCenterPosition = () => {
      if (!wrapperRef.current) return;
      const wrapperRect = wrapperRef.current.getBoundingClientRect();
      const wrapperCenter = wrapperRect.left + wrapperRect.width / 2;

      cardRefs.current.forEach((card) => {
        if (!card) return;
        const cardRect = card.getBoundingClientRect();
        const cardCenter = cardRect.left + cardRect.width / 2;
        const distanceFromCenter = Math.abs(wrapperCenter - cardCenter);
        const maxDistance = Math.min(wrapperRect.width / 2, 400);

        if (distanceFromCenter < maxDistance) {
          const ratio = 1 - distanceFromCenter / maxDistance; // 1 at center, 0 at edge
          const scale = 0.85 + ratio * 0.42; // scales up to ~1.27x at center
          const opacity = 0.65 + ratio * 0.35;
          card.style.transform = `scale(${scale})`;
          card.style.opacity = opacity;
          card.style.zIndex = Math.round(ratio * 20);
        } else {
          card.style.transform = 'scale(0.85)';
          card.style.opacity = '0.65';
          card.style.zIndex = '1';
        }
      });

      animFrameId = requestAnimationFrame(checkCenterPosition);
    };

    animFrameId = requestAnimationFrame(checkCenterPosition);
    return () => cancelAnimationFrame(animFrameId);
  }, []);

  return (
    <section className="gallery-section">
      <div className="gallery-header">
        <h2>MY GALLERY</h2>
        <p>Capturing special moments, events & memories</p>
        <hr className="accent-hr" />
      </div>

      <div className="marquee-wrapper" ref={wrapperRef}>
        <div className="marquee-track marquee-rtl">
          {marqueeList.map((photo, index) => (
            <div 
              key={`${photo.id}-${index}`} 
              ref={(el) => (cardRefs.current[index] = el)}
              className="marquee-card"
              onClick={() => setActiveModal(photo.src)}
            >
              <img src={photo.src} alt={photo.title} />
            </div>
          ))}
        </div>
      </div>

      {activeModal && (
        <div className="gallery-modal" onClick={() => setActiveModal(null)}>
          <div className="gallery-modal-content" onClick={e => e.stopPropagation()}>
            <button className="gallery-modal-close" onClick={() => setActiveModal(null)}>
              <i className="ri-close-line" />
            </button>
            <img src={activeModal} alt="Full view" />
          </div>
        </div>
      )}
    </section>
  );
}
