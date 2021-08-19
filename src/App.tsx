import SoundHubMixer from "./components/mixer";
import StackIcons from "./components/stackIcons";

import Mixer from "./models/mixer";

function App() {
  return (
    <>
      <SoundHubMixer mixer={new Mixer()} />
      <StackIcons />
    </>
  );
}

export default App;
