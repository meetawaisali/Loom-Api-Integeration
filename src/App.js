import { useEffect, useState, useRef } from "react";
import { setup, isSupported } from "@loomhq/record-sdk";
import { oembed } from "@loomhq/loom-embed";
import "./App.css";

const PUBLIC_APP_ID = process.env.REACT_APP_LOOM_PUBLIC_APP_ID;
const BUTTON_ID = "loom-record-sdk-button";

function App() {
  const [videoHTML, setVideoHTML] = useState("");
  const [url, setUrl] = useState("");
  const recordButtonRef = useRef(null);

  useEffect(() => {
    async function setupLoom() {
      const { supported, error } = await isSupported();

      if (!supported) {
        console.warn(`Error setting up Loom: ${error}`);
        return;
      }

      const button = recordButtonRef.current;

      if (!button) {
        return;
      }

      const { configureButton } = await setup({
        publicAppId: PUBLIC_APP_ID,
      });

      const sdkButton = configureButton({ element: button });

      sdkButton.on("insert-click", async (video) => {
        setUrl(video.sharedUrl)
        const { html } = await oembed(video.sharedUrl, { width: 400 });
        setVideoHTML(html);
      });
    }
    setupLoom();
  }, []);

  const handleDelete = () => {
    setVideoHTML("");
    setUrl("");
  };

  return (
    <div className="App">
      <div className="App-header">
        <h1>Record a Loom video</h1>
        <p>Click the button below to start recording your video</p>
      </div>
      <button ref={recordButtonRef} id={BUTTON_ID} className="record-button">
        {videoHTML ? "RE-RECORD" : "RECORD"}
      </button>
      <div className="video-container">
        <p>{url}</p>
        <div dangerouslySetInnerHTML={{ __html: videoHTML }}></div>
      </div>
      {videoHTML && (
        <button onClick={handleDelete} className="delete-button">
          DELETE
        </button>
      )}
    </div>
  );
}

export default App;
