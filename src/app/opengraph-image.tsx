import { ImageResponse } from 'next/og';
import { readFile } from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';
export const alt = 'Rotary Divyang Center | Giving Hope, Giving Smile';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/jpeg';

export default async function Image() {
    const imgPath = path.join(process.cwd(), 'public', '4.jpg');
    const imgData = await readFile(imgPath);
    const base64 = `data:image/jpeg;base64,${imgData.toString('base64')}`;

    return new ImageResponse(
        (
            <div
                style={{
                    width: '1200px',
                    height: '630px',
                    display: 'flex',
                    position: 'relative',
                    fontFamily: 'sans-serif',
                }}
            >
                {/* Background image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={base64}
                    alt=""
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />

                {/* Dark gradient overlay */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.10) 100%)',
                    }}
                />

                {/* Text content */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: '48px 60px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                    }}
                >
                    {/* Headline */}
                    <div
                        style={{
                            color: '#ffffff',
                            fontSize: '52px',
                            fontWeight: 700,
                            lineHeight: 1.15,
                            letterSpacing: '-0.5px',
                            textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                        }}
                    >
                        Rotary Divyang Center
                    </div>

                    {/* Sub-headline */}
                    <div
                        style={{
                            color: 'rgba(255,255,255,0.90)',
                            fontSize: '26px',
                            fontWeight: 400,
                            lineHeight: 1.3,
                            textShadow: '0 1px 4px rgba(0,0,0,0.5)',
                        }}
                    >
                        Giving Hope, Giving Smiles
                    </div>

                    {/* CTA badge */}
                    <div
                        style={{
                            marginTop: '8px',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <div
                            style={{
                                background: '#2563eb',
                                color: '#fff',
                                fontSize: '20px',
                                fontWeight: 600,
                                padding: '10px 24px',
                                borderRadius: '8px',
                                letterSpacing: '0.2px',
                            }}
                        >
                            Free Prosthetics &amp; Orthotics Support
                        </div>
                    </div>
                </div>
            </div>
        ),
        { ...size }
    );
}
