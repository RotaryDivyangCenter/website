import { ImageResponse } from 'next/og';
import { readFile } from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';
export const alt = 'Rotary Divyang Center | Giving Hope, Giving Smile';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/jpeg';

export default async function Image() {
    const imgPath = path.join(process.cwd(), 'public', '4.jpg');
    const logoPath = path.join(process.cwd(), 'public', 'logo-circular.png');

    const [imgData, logoData] = await Promise.all([readFile(imgPath), readFile(logoPath)]);
    const base64 = `data:image/jpeg;base64,${imgData.toString('base64')}`;
    const logoBase64 = `data:image/png;base64,${logoData.toString('base64')}`;

    return new ImageResponse(
        (
            <div
                style={{
                    width: '1200px',
                    height: '630px',
                    display: 'flex',
                    position: 'relative',
                }}
            >
                {/* Background image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={base64}
                    alt=""
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />

                {/* Bottom-right logo watermark */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={logoBase64}
                    alt=""
                    style={{
                        position: 'absolute',
                        bottom: '24px',
                        right: '28px',
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        border: '3px solid rgba(255,255,255,0.85)',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.35)',
                        objectFit: 'cover',
                    }}
                />
            </div>
        ),
        { ...size }
    );
}
