import { makeAutoObservable } from "mobx";

class EditModeStore {
  isEditing: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  toggleEditMode() {
    this.isEditing = !this.isEditing;
  }

  turnOnEditMode() {
    this.isEditing = true;
  }

  turnOffEditMode() {
    this.isEditing = false;
  }
}

export default new EditModeStore();
