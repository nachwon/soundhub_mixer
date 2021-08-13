export const THEME = {
  MAIN_COLOR_GREEN: "#4CF7CF",
  MAIN_COLOR_BLUE: "#5DE3EF",
  MAIN_HIGHLIGHT: "#ffd933",
  SUB_HIGHLIGHT: "#f62a66",
  SUB_COLOR: "#374955",
  BACKGROUND_COLOR: "#242526",
  WHITE: "#FFFFFF",
  BLACK: "#000000",
  ERROR: "#F44336",
  PROFILE_IMG_BACKGROUND: "#333333",
};

export const FileInputId = "file-input";
export const MaxChannelCount = 8;

export const MIXER_SETTINGS = {
  mixerBackgroundColor: "#242526",
  channelHeight: 550,
  channelWidth: 80,
  channelTopBottomPadding: 5,
  numberOfChannels: MaxChannelCount,
  faderLength: 280,
  faderWidth: 10,
  faderMaxPercent: 1.4,
  faderIdlePercent: 1,
};

export const InitialFaderPosition = (1 - MIXER_SETTINGS.faderIdlePercent / MIXER_SETTINGS.faderMaxPercent) * 100;
