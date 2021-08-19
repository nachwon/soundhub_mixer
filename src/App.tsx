import SoundHubMixer from "./components/mixer";

import Mixer from "./models/mixer";

function App() {
  return <SoundHubMixer mixer={new Mixer()} />;
}

export default App;
