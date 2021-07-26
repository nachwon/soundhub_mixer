import { MixerController } from "../types";
import Mixer from "./mixer";


class BaseMixerController {
  mixer: Mixer;

  constructor(mixer: Mixer) {
    this.mixer = mixer
  }

  playChannels(when: number = 0) {
    for (let channel of this.mixer.channels) {
      channel.play(when)
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

  seekChannels(when: number, offset: number) {
    if (!this.mixer.channelsLoaded) {
      return false
    }

    for (let channel of this.mixer.channels) {
      channel.seek(when, offset)
    }
    return true
  }
}


export class DefaultMixerController extends BaseMixerController implements MixerController {
  play = (when: number = 0) => false;
  stop = () => false;
  pause = () => false;
  seek = (when: number, offset: number) => false;
}


class RunningMixerController extends BaseMixerController implements MixerController {
  play(when: number = 0) {
    if (this.mixer.isPlaying || !this.mixer.channelsLoaded) {
      return false
    }

    return this.playChannels(when)
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

  seek(when: number, offset: number) {
    return this.seekChannels(when, offset)
  }
}

class SuspendedMixerController extends BaseMixerController implements MixerController {
  play(when: number = 0) {
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

  seek(when: number, offset: number) {
    if (this.seekChannels(when, offset)) {
      this.resumeChannels()
      return true
    } else {
      return false
    }
  }
}

class StoppedMixerController extends BaseMixerController implements MixerController {
  play(when: number = 0) {
    if (!this.mixer.channelsLoaded) {
      return false
    }
    return this.playChannels(when)
  }

  stop() {
    return false
  }

  pause() {
    return false
  }

  seek(when: number, offset: number) {
    return false
  }
}


export const ControllerMap = {
  'running': RunningMixerController,
  'suspended': SuspendedMixerController,
  'closed': DefaultMixerController,
  'stopped': StoppedMixerController
}
