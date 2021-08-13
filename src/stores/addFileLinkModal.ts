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

  async addChannelWithLink(mixer: Mixer, link: string, index?: number): Promise<boolean> {
    if (!link || index === undefined) {
      return false;
    }

    const title = link.split("/").pop();
    const channelAdded = await mixer.addChannel(index, {
      title: title,
      src: link,
    });

    if (channelAdded) {
      this.closeModal();
      return true;
    } else {
      return false;
    }
  }
}

export default new AddFileLinkModalStore();
