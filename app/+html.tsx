import { ScrollViewStyleReset } from 'expo-router/html';
import { type PropsWithChildren } from 'react';

/**
 * Customizes the root HTML document for every web page.
 * Adds the PWA manifest, theme color, and iOS "add to home screen" meta tags
 * so the web build installs and launches full-screen like a native app.
 */
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />

        {/* Progressive Web App */}
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#191C3B" />
        <meta name="mobile-web-app-capable" content="yes" />

        {/* iOS "Add to Home Screen" — translucent bar so content fills the screen;
            the safe-area padding below keeps headers clear of the notch. */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Spectaculeads" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" href="/favicon.ico" />

        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: pageStyle }} />
        <script dangerouslySetInnerHTML={{ __html: swRegister }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

// Match the brand background behind the app (and the phone frame on desktop),
// and inset the app by the device safe areas so headers clear the notch/status
// bar and the tab bar clears the home indicator (0 in normal desktop browsers).
const pageStyle = `
  html,body{background-color:#191C3B;}
  #root{
    box-sizing:border-box;
    padding-top:env(safe-area-inset-top);
    padding-bottom:env(safe-area-inset-bottom);
    padding-left:env(safe-area-inset-left);
    padding-right:env(safe-area-inset-right);
  }`;

// Register the service worker (web only) for installability + offline fallback.
const swRegister = `
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/sw.js').catch(function () {});
  });
}`;
