import { makeAutoObservable } from "mobx";
import Mixer from "../models/mixer";

class AddFileLinkModalStore {
  isOpen: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  openModal() {
    this.isOpen = true;
  }

  closeModal() {
    this.isOpen = false;
  }

  async addChannelWithLink(
    mixer: Mixer,
    link: string,
    index?: number,
    onProgressUpdate?: (e: ProgressEvent) => void
  ): Promise<boolean> {
    if (!link || index === undefined) {
      return false;
    }

    const title = link.split("/").pop();
    const channelDto = {
      title: title,
      src: link,
    };

    const channelAdded = await mixer.addChannel(index, channelDto, onProgressUpdate);

    if (channelAdded) {
      this.closeModal();
      return true;
    } else {
      return false;
    }
  }
}

export default new AddFileLinkModalStore();
