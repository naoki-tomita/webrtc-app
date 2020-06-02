const { remote } = require("electron");
const { Menu, MenuItem } = remote;

/**
 * @param {string} tag
 * @param {{[key: string]: any}} attributes
 * @param  {...any} children
 * @returns {any}
 */
function h(tag, attributes, ...children) {
  const el = document.createElement(tag);
  Object.keys(attributes).forEach(key => {
    if (key.startsWith("on")) {
      el.addEventListener(key.substr(2).toLowerCase(), attributes[key]);
      return;
    }
    if (key === "style") {
      const style = attributes["style"]
      Object.keys(style).forEach(styleName => {
        el.style[styleName] = style[styleName];
      });
      return;
    }
    el.setAttribute(key, attributes[key]);
    return;
  });
  el.append(...children);
  return el;
}

async function createMenu() {
  const devices = (await navigator.mediaDevices.enumerateDevices()).filter(it => it.kind === "videoinput");
  const menu = Menu.getApplicationMenu();
  devices.forEach(it =>
    menu?.items[0].submenu?.items[0].submenu?.append(new MenuItem({
      label: it.label,
      click: async () => {
        const stream = await startCamera(it.deviceId)
        stream.getTracks().forEach(track => peer.addTrack(track, stream));
      },
    }))
  );
  Menu.setApplicationMenu(menu);
}

const app = document.getElementById("app");
/**
 * @param {string} deviceId
 */
async function startCamera(deviceId) {
  const myStream = await navigator.mediaDevices.getUserMedia({
    video: { deviceId: { exact: deviceId } },
    audio: false,
  });
  const video = h("video", {});
  app?.append(h("div", {}, video));
  video.srcObject = myStream;
  video.play();
  return myStream;
}

/**
 * @param {MediaStream} stream
 */
async function addVideo(stream) {
  const video = h("video", {});
  const button = h("button", { style: { position: "absolute", top: 50, left: 30, zIndex: 1 }, onClick: () => (button.style.display = "none", video.play()) }, "play");
  app?.append(h("div", {},
    // button,
    video,
  ));
  video.srcObject = stream;
  video.play();
}

class Peer {
  constructor() {
    this.ID = Math.random().toString(32).substring(2);
    this.ws = new TargetedWebSocket(`wss://webrtc-room7.herokuapp.com?id=${this.ID}`);
    this.ws.addEventListener(this.onReceiveSdpMessage.bind(this));
    /** @type {any} */
    this.peers = {};
    /** @type {{track: MediaStreamTrack, stream: MediaStream}[]} */
    this.tracks = []
  }

  /**
   *
   * @param {MediaStreamTrack} track
   * @param {MediaStream} stream
   */
  addTrack(track, stream) {
    this.tracks.push({ track, stream });
    Object.keys(this.peers).forEach(id => {
      const peer = this.peerInstance(id);
      peer.addTrack(track, stream);
    })
  }

  /**
   * @param {string} id
   * @returns {RTCPeerConnection}
   */
  peerInstance(id) {
    if (this.peers[id]) {
      return this.peers[id];
    }
    const peer = this.peers[id] = new RTCPeerConnection();
    peer.addEventListener("icecandidate", e =>
      !e.candidate && this.sendSdpToId(id, peer.localDescription || {}))

    peer.addEventListener("track", e =>
      e.streams.forEach(stream => addVideo(stream)));

    peer.addEventListener("negotiationneeded", async e => {
      const offer = await peer.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });
      await peer.setLocalDescription(offer);
      this.sendSdpToId(id, offer);
    });

    this.tracks.forEach(({ track, stream }) => peer.addTrack(track, stream));

    return peer;
  }

  async requestConnection() {
    this.ws.targets.filter(it => this.ID !== it).forEach(this.requestConnect.bind(this));
  }

  /**
   * @param {string} id
   */
  async requestConnect(id) {
    const peer = this.peerInstance(id);
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    this.sendSdpToId(id, offer);
  }

  /**
   * @param {string} from
   * @param {RTCSessionDescriptionInit} offer
   */
  async onOffer(from, offer) {
    const peer = this.peerInstance(from);
    await peer.setRemoteDescription(offer);
    console.log("success to set remote description")
    this.sendAnswerTo(from);
  }

  /**
   * @param {string} id
   */
  async sendAnswerTo(id) {
    const peer = this.peerInstance(id);
    if (peer.connectionState === "connected") {
      return;
    }

    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    this.sendSdpToId(id, peer.localDescription || {});
  }

  /**
   * @param {string} from
   * @param {RTCSessionDescriptionInit} answer
   */
  async onAnswer(from, answer) {
    const peer = this.peerInstance(from);
    if (peer.connectionState === "connected") {
      return;
    }

    await peer.setRemoteDescription(answer);
  }

  /**
   * @param {string} id
   * @param {RTCSessionDescriptionInit} sdp
   */
  sendSdpToId(id, sdp) {
    this.ws.send(id, sdp);
  }

  /**
   *
   * @param {string} id
   * @param {RTCSessionDescriptionInit} data
   */
  onReceiveSdpMessage(id, data) {
    switch (data.type) {
      case "offer":
        this.onOffer(id, data);
        break;
      case "answer":
        this.onAnswer(id, data);
        break;
    }
  }
}
class TargetedWebSocket {

  /**
   *
   * @param {string} url
   */
  constructor(url) {
    /** @type {string[]} */
    this.targets = [];
    /** @type {((id: string, data: any) => void)[]} */
    this.observables = [];
    this.ws = new WebSocket(url);
    this.ws.addEventListener("message", this.onMessage.bind(this));
  }

  /**
   *
   * @param {{ id: string, data: any }} message
   */
  emit(message) {
    this.observables.forEach(cb => cb(message.id, message.data));
  }

  /**
   * @param {{ data: string }} e
   */
  onMessage(e) {
    const message = JSON.parse(e.data);
    switch(message.type) {
      case "list":
        this.targets = message.data;
        break;
      default:
        this.emit(message);
    }
  }

  /**
   *
   * @param {(id: string, data: any) => void} cb
   */
  addEventListener(cb) {
    this.observables.push(cb);
  }

  /**
   * @param {string} target
   * @param {any} data
   */
  send(target, data) {
    this.ws.send(JSON.stringify({ type: "message", target, data }));
  }

  /**
   * @param {any} data
   */
  broadcast(data) {
    this.ws.send(JSON.stringify({ type: "broadcast", data }));
  }
}

const peer = new Peer();
async function initialize() {
  await createMenu();
  setTimeout(() => peer.requestConnection(), 2000)
}

initialize();
