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

        {/* iOS "Add to Home Screen" */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Spectaculeads" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <link rel="icon" href="/favicon.ico" />

        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: pageStyle }} />
        <script dangerouslySetInnerHTML={{ __html: swRegister }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

// Match the brand background behind the app (and the phone frame on desktop).
const pageStyle = `html,body{background-color:#191C3B;}`;

// Register the service worker (web only) for installability + offline fallback.
const swRegister = `
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/sw.js').catch(function () {});
  });
}`;
