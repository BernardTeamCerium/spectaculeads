/**
 * Native fallback for the web intro video. We keep the real player web-only
 * (plain HTML5 <video>) so we don't add a native video library; on iOS/Android
 * this renders nothing and the app opens straight to the splash.
 */
export function IntroVideo() {
  return null;
}
