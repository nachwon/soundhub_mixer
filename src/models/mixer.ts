import Channel from "./channel";

interface MixerController {
  play: () => boolean
  stop: () => boolean
  pause: () => boolean
}


class RunningMixerController implements MixerController {
  mixer: Mixer;

  constructor(mixer: Mixer) {
    this.mixer = mixer
  }

  play() {
    if (this.mixer.isPlaying) {
      return false
    }

    for (let channel of this.mixer.channels) {
      channel.play();
    }
    return true
  }

  pause() {
    this.mixer.audioCtx.suspend()
    return true
  }

  stop() {
    if (!this.mixer.isPlaying) {
      return false
    }
    for (let channel of this.mixer.channels) {
      channel.stop();
    }
    return true
  }
}

class SuspendedMixerController implements MixerController {
  mixer: Mixer;

  constructor(mixer: Mixer) {
    this.mixer = mixer
  }

  play() {
    this.mixer.audioCtx.resume()
    return true
  }

  stop() {
    for (let channel of this.mixer.channels) {
      channel.stop();
    }
    this.mixer.audioCtx.resume()
    return true
  }

  pause() {
    return true
  }
}

class StoppedMixerController implements MixerController {
  mixer: Mixer;

  constructor(mixer: Mixer) {
    this.mixer = mixer
  }

  play() {
    for (let channel of this.mixer.channels) {
      channel.reloadChannel();
      channel.play();
    }
    return true
  }

  stop() {
    return true
  }

  pause() {
    return true
  }
}


const ControllerMap = {
  'running': RunningMixerController,
  'suspended': SuspendedMixerController,
  'closed': undefined,
  'stopped': StoppedMixerController
}


class Mixer {
  // Context
  audioCtx: AudioContext;

  // Channels
  channels: Array<Channel> = [];
  maxChannel?: Channel = undefined;

  // States
  isPlaying: boolean = false;
  state: 'running' | 'suspended' | 'stopped' | 'closed' = 'stopped';
  controller: any | undefined;

  // Nodes
  masterGainNode: GainNode;
  splitterNode: ChannelSplitterNode;
  analyserNodeL: AnalyserNode;
  analyserNodeR: AnalyserNode;

  constructor() {
    this.audioCtx = new AudioContext();
    this.masterGainNode = this.audioCtx.createGain();
    this.splitterNode = this.audioCtx.createChannelSplitter(2);
    this.analyserNodeL = this.audioCtx.createAnalyser();
    this.analyserNodeR = this.audioCtx.createAnalyser();

    this.connectNodes()
    this.setMixerState('running')
  }

  connectNodes() {
    this.masterGainNode.connect(this.splitterNode);
    this.splitterNode.connect(this.analyserNodeL, 0);
    this.splitterNode.connect(this.analyserNodeR, 1);
    this.masterGainNode.connect(this.audioCtx.destination);
  }

  addChannel(src: ArrayBuffer | string) {
    const channel = new Channel(src, this.channelsCount, this.audioCtx);
    this.channels.push(channel);
    channel.connectToMixer(this.masterGainNode);
  }

  get channelsCount() {
    return this.channels.length
  }

  setMixerState(state: 'running' | 'suspended' | 'stopped' | 'closed') {
    this.state = state;
    const controller = ControllerMap[state]
    if (controller) {
      this.controller = new controller(this)
    }
  }

  play() {
    if (this.controller.play()) {
      this.setMixerState('running')
      this.isPlaying = true;
    }
  }

  stop() {
    
    if (this.controller.stop()) {
      this.setMixerState('stopped')
      this.isPlaying = false;
    }
  }

  pause() {
    if (this.controller.pause()) {
      this.setMixerState('suspended')
      this.isPlaying = false;
    }
  }
}

export default Mixer;
