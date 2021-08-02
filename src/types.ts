export type ChannelDto = {
  src: File | string
  title?: string 
}

export type ChannelMeta = {
  index: number
  src: File | string
  title?: string
}


export interface MixerController {
  play: (when: number, offset: number) => boolean
  stop: () => boolean
  pause: () => boolean
  seek: (when: number, offset: number) => boolean
}


export interface FaderHandleProps {
  position: number
}
