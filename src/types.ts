export type ChannelDto = {
  src: File | string
  title?: string 
}

export type ChannelMeta = {
  channelIndex: number
  src: File | string
  title?: string
}


export interface MixerController {
  play: (when: number) => boolean
  stop: () => boolean
  pause: () => boolean
  seek: (offset: number) => boolean
}