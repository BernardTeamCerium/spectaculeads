import { useEffect, useRef, useState } from 'react';

/**
 * Intro video shown the first time someone opens the app (web).
 *
 * Autoplays muted (browsers allow muted autoplay), is skippable, and only
 * shows once per visitor. Decorative overlay — the app renders underneath.
 * Native builds get a no-op fallback (see IntroVideo.tsx) so we don't pull in
 * a video library.
 *
 * ▶ TO USE YOUR OWN VIDEO: replace INTRO_VIDEO_URL below with your demo clip —
 *   either a hosted MP4 URL, or drop a file in /public and use '/intro.mp4'.
 *   Bump SEEN_KEY (…_v2) if you want returning visitors to see the new one.
 */
const INTRO_VIDEO_URL =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
const SEEN_KEY = 'sl_intro_seen_v1';

export function IntroVideo() {
  const [show, setShow] = useState(false);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    let seen = false;
    try {
      seen = localStorage.getItem(SEEN_KEY) === '1';
    } catch {
      seen = false;
    }
    if (!seen) setShow(true);
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(SEEN_KEY, '1');
    } catch {
      /* private mode / blocked storage — fine, just dismiss */
    }
    setShow(false);
  };

  const toggleMute = () => {
    const v = videoRef.current;
    const next = !muted;
    if (v) {
      v.muted = next;
      if (!next) v.play().catch(() => {});
    }
    setMuted(next);
  };

  if (!show) return null;

  return (
    <div style={overlayStyle} role="dialog" aria-label="Welcome video">
      <video
        ref={videoRef}
        src={INTRO_VIDEO_URL}
        autoPlay
        muted
        playsInline
        onEnded={dismiss}
        onError={dismiss}
        style={videoStyle}
      />
      <button onClick={dismiss} style={skipStyle} aria-label="Skip intro">
        Skip&nbsp;&nbsp;⏭
      </button>
      <button onClick={toggleMute} style={muteStyle} aria-label={muted ? 'Unmute' : 'Mute'}>
        {muted ? '🔊  Tap for sound' : '🔇  Mute'}
      </button>
    </div>
  );
}

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 9999,
  background: '#191C3B',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const videoStyle: React.CSSProperties = {
  maxWidth: '100%',
  maxHeight: '100%',
  width: 'auto',
  height: 'auto',
  objectFit: 'contain',
};

const pillBase: React.CSSProperties = {
  position: 'absolute',
  padding: '9px 16px',
  borderRadius: 999,
  border: 'none',
  color: '#fff',
  fontFamily: 'Figtree_600SemiBold, Figtree, sans-serif',
  fontSize: 14,
  cursor: 'pointer',
  background: 'rgba(255,255,255,0.18)',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)',
};

const skipStyle: React.CSSProperties = {
  ...pillBase,
  top: 'calc(env(safe-area-inset-top, 0px) + 16px)',
  right: 16,
};

const muteStyle: React.CSSProperties = {
  ...pillBase,
  bottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)',
  left: 16,
};
