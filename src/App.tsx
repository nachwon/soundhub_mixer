import { useEffect } from "react";
import { useRef } from "react";
import SoundHubMixer from "./components/mixer";
import StackIcons from "./components/stackIcons";

import Mixer from "./models/mixer";

function App() {
  const mixer = useRef(new Mixer());
  useEffect(() => {
    mixer.current.addChannel(0, {
      src: "https://soundhub-mixer.s3.ap-northeast-2.amazonaws.com/samples/Sample+-+Guitar.mp3",
      title: "Guitar",
    });
    mixer.current.addChannel(1, {
      src: "https://soundhub-mixer.s3.ap-northeast-2.amazonaws.com/samples/Sample+-+Bass.mp3",
      title: "Bass",
    });
    mixer.current.addChannel(2, {
      src: "https://soundhub-mixer.s3.ap-northeast-2.amazonaws.com/samples/Sample+-+Drums.mp3",
      title: "Drums",
    });
  }, []);

  return (
    <>
      <SoundHubMixer mixer={mixer.current} />
      <StackIcons />
    </>
  );
}

export default App;
