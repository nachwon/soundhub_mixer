import { MixerController } from "../types";
import Mixer from "./mixer";


class BaseMixerController {
  mixer: Mixer;

  constructor(mixer: Mixer) {
    this.mixer = mixer
  }

  playChannels() {
    for (let channel of this.mixer.channels) {
      channel.play()
    }
    return true
  }

  stopChannels() {
    for (let channel of this.mixer.channels) {
      channel.stop();
    }
    return true
  }

  pauseChannels() {
    this.mixer.audioCtx.suspend()
    return true
  }

  resumeChannels() {
    this.mixer.audioCtx.resume()
    return true
  }

  seekChannels(offset: number) {
    if (!this.mixer.channelsLoaded) {
      return false
    }

    for (let channel of this.mixer.channels) {
      channel.seek(offset)
    }
    return true
  }
}


export class DefaultMixerController extends BaseMixerController implements MixerController {
  play = () => false;
  stop = () => false;
  pause = () => false;
  seek = (offset: number) => false;
}


class RunningMixerController extends BaseMixerController implements MixerController {
  play() {
    if (this.mixer.isPlaying || !this.mixer.channelsLoaded) {
      return false
    }

    return this.playChannels()
  }

  pause() {
    return this.pauseChannels()
  }

  stop() {
    if (!this.mixer.isPlaying) {
      return false
    }

    return this.stopChannels()
  }

  seek(offset: number) {
    return this.seekChannels(offset)
  }
}

class SuspendedMixerController extends BaseMixerController implements MixerController {
  play() {
    this.resumeChannels()
    return true
  }

  stop() {
    this.stopChannels()
    this.resumeChannels()
    return true
  }

  pause() {
    return false
  }

  seek(offset: number) {
    if (this.seekChannels(offset)) {
      this.resumeChannels()
      return true
    } else {
      return false
    }
  }
}

class StoppedMixerController extends BaseMixerController implements MixerController {
  play() {
    if (!this.mixer.channelsLoaded) {
      return false
    }
    return this.playChannels()
  }

  stop() {
    return false
  }

  pause() {
    return false
  }

  seek(offset: number) {
    return this.seekChannels(offset)
  }
}


export const ControllerMap = {
  'running': RunningMixerController,
  'suspended': SuspendedMixerController,
  'closed': DefaultMixerController,
  'stopped': StoppedMixerController
}
