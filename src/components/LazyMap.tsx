'use client';

import { useEffect, useRef, useState } from 'react';

const MAP_SRC =
    'https://www.google.com/maps?q=Rotary+Divyang+Center,+64VH%2BCG+Kalyan,+Maharashtra&z=17&output=embed';

export default function LazyMap() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '200px' } // start loading 200px before it enters viewport
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={containerRef}
            className="overflow-hidden border border-[#d8e3ee] bg-[#edf3f8] min-h-[300px] sm:min-h-[380px]"
            style={{ minHeight: '380px' }}
        >
            {visible && (
                <iframe
                    title="Rotary Divyang Center location"
                    src={MAP_SRC}
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: '380px', display: 'block' }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                />
            )}
        </div>
    );
}
