export interface State {
  // user mood
  mood: string;
  // web3 login
  connected: false;
  pubkey: "";
  balance: "0";
  // web2 login
  login: false;
  email: "";
  name: "";
  // user info
  country: "";
  gender: "";
  age: "";
  phone: "";
  topics: string[];
  created: string;
  verified: boolean;
  // clock
  gmt: number;
  timezone: string;
  alarm: string;
  // messages
  chat: ChatRecord[];
  // ui config
  dark: true;
  sound: true;
  primaryColor: "blue-500";
  secondaryColor: "blue-500";
  heart: string;
  emoji: string;
}

export interface ChatRecord {
  user: UserMessage;
  theia: TheiaMessage;
}

export interface UserMessage {
  text: string;
  audio: AudioBuffer | string;
  datetime: string;
  timestamp: bigint;
}

export interface TheiaMessage {
  text: string;
  audio: AudioBuffer | string;
  video: Buffer | string;
  image: HTMLImageElement | string;
  links: string;
  datetime: string;
  timestamp: bigint;
  computed_in: number; // how long took to answer in seconds
}
