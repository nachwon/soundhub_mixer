import Mixer from "./mixer";

interface MixerController {
  play: () => boolean
  stop: () => boolean
  pause: () => boolean
}

class BaseMixerController {
  mixer: Mixer;

  constructor(mixer: Mixer) {
    this.mixer = mixer
  }

  playChannels() {
    if (this.mixer.isPlaying || !this.mixer.channelsLoaded) {
      return false
    }

    for (let channel of this.mixer.channels) {
      channel.play()
    }
    return true
  }
}


class RunningMixerController extends BaseMixerController implements MixerController {
  play() {
    return this.playChannels()
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

class SuspendedMixerController extends BaseMixerController implements MixerController {
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

class StoppedMixerController extends BaseMixerController implements MixerController {
  play() {
    return this.playChannels()
  }

  stop() {
    return true
  }

  pause() {
    return true
  }
}


export const ControllerMap = {
  'running': RunningMixerController,
  'suspended': SuspendedMixerController,
  'closed': undefined,
  'stopped': StoppedMixerController
}
