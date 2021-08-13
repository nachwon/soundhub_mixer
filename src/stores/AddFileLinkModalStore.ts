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

  async addChannelWithLink(mixer: Mixer, index: number, link: string) {
    await mixer.addChannel(index, {
      title: "test",
      src: link,
    });
  }
}

export default new AddFileLinkModalStore();
