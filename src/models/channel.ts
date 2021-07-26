import axios from "axios";

class Channel {
  audioCtx: AudioContext;
  channelIndex: number;
  buffer?: AudioBuffer;
  loaded: boolean = false;

  // Nodes
  sourceNode: AudioBufferSourceNode | undefined;
  gainNode: GainNode;
  pannerNode: StereoPannerNode;
  analyserNode: AnalyserNode;

  constructor(src: string | ArrayBuffer, channelIndex: number, audioCtx: AudioContext) {
    this.channelIndex = channelIndex;
    this.audioCtx = audioCtx;
    this.gainNode = this.audioCtx.createGain();    
    this.pannerNode = this.audioCtx.createStereoPanner();
    this.analyserNode = this.audioCtx.createAnalyser();
  
    if (typeof (src) === 'string') {
      this.fetchBufferFromSrc(src)
    } else if (src instanceof ArrayBuffer) {
      this.setAudioBuffer(src)
    }
  }

  private connectNodes() {
    this.sourceNode?.connect(this.gainNode);
    this.gainNode.connect(this.pannerNode);
    this.pannerNode.connect(this.analyserNode);
  }

  private fetchBufferFromSrc(src: string) {
    const request = axios.get(src, { responseType: 'arraybuffer' });
    request.then((response) => this.setAudioBuffer(response.data));
  }

  private setAudioBuffer(buffer: ArrayBuffer) {
    this.audioCtx.decodeAudioData(buffer, (buffer) => {
      this.buffer = buffer;
      this.createBufferSourceNode(buffer)
      this.connectNodes();
      this.loaded = true;
    })
  }

  private createBufferSourceNode(buffer: AudioBuffer) {
    const sourceNode = this.audioCtx.createBufferSource();
    sourceNode.buffer = buffer;
    this.sourceNode = sourceNode;
  }

  connectToMixer(masterGainNode: GainNode) {
    this.analyserNode.connect(masterGainNode);
  }

  reloadChannel() {
    if (!this.sourceNode && this.buffer) {
      this.createBufferSourceNode(this.buffer)
      this.connectNodes();
    }
  }

  play() {
    console.log("play")
    this.sourceNode?.start(0)
  }

  stop() {
    this.sourceNode?.stop();
    this.sourceNode?.disconnect();
    this.sourceNode = undefined;
  }
}

export default Channel;