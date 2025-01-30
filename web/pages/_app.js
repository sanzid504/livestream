import { StreamTheme } from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import "stream-chat-react/dist/css/v2/index.css";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <StreamTheme style={{ fontFamily: "sans-serif" }}>
      <Component {...pageProps} />
    </StreamTheme>
  );
}
