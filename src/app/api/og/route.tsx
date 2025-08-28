import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const country = searchParams.get('country') ?? 'Travel Check Hub';

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '64px',
          background: 'white',
        }}
      >
        <div style={{ fontSize: 44, fontWeight: 600 }}>출국 체크</div>
        <div style={{ marginTop: 12, fontSize: 72, fontWeight: 800 }}>{country}</div>
        <div style={{ marginTop: 24, fontSize: 28 }}>
          비자 · eSIM · 전압/플러그 · 수하물 · 기후
        </div>
        <div style={{ marginTop: 32, fontSize: 24, color: '#666' }}>rvtwin.com</div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
