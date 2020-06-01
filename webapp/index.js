const ID = Math.random().toString(32).substring(2);
const ws = new WebSocket(`ws://localhost:8080?id=${ID}`);

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

const app = document.getElementById("app");
async function createMenu() {
  const devices = (await navigator.mediaDevices.enumerateDevices()).filter(it => it.kind === "videoinput");
  const select = h("select", {},
    ...devices.map(it => h("option", { value: it.deviceId }, it.label))
  );
  app?.append(
    h("div", {}, select,
      select,
      h("button", { onClick: () => startCamera(select.value) }, "select")
    )
  );
}

async function startCamera(deviceId) {
  const myStream = await navigator.mediaDevices.getUserMedia({
    video: { deviceId: { exact: deviceId } },
    audio: false,
  });
  const video = h("video", {});
  app?.append(h("div", {}, video));
  video.srcObject = myStream;
  video.play();
  myStream.getTracks().forEach(track => peer.addTrack(track, myStream));
}

function sendSDP(sdp) {
  ws.send(JSON.stringify({ message: "sdp", data: sdp }))
}

/**
 * @param {MediaStream} stream
 */
async function addVideo(stream) {
  const video = h("video", {});
  const button = h("button", { style: { position: "absolute", top: 50, left: 30, zIndex: 1 }, onClick: () => (button.style.display = "none", video.play()) }, "play");
  app?.append(h("div", {},
    button,
    video,
  ));
  video.srcObject = stream;
}

async function createPeer() {
  const peer = new RTCPeerConnection();

  ws.addEventListener("message", (e) => {
    const data = JSON.parse(e.data);
    receiveSdp(data.data);
  });

  function receiveSdp(data) {
    switch(data.data.type) {
      case "offer":
        onOffer(data);
        break;
      case "answer":
        onAnswer(data);
        break;
    }
  }

  async function onOffer(data) {
    await peer.setRemoteDescription(data.data);
    console.log("success to set remote description")
    sendAnswer()
  }

  async function sendAnswer() {
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    sendSDP(peer.localDescription);
  }

  async function onAnswer(data) {
    await peer.setRemoteDescription(data.data);
    console.log("success to set remote description answer")
  }

  peer.addEventListener("icecandidate", e => {
    if (e.candidate) {
    } else {
      sendSDP(peer.localDescription);
    }
  })

  peer.addEventListener("track", e => {
    console.log(e);
    e.streams.forEach(stream => addVideo(stream));
  });

  peer.addEventListener("negotiationneeded", async e => {
    const offer = await peer.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    });
    await peer.setLocalDescription(offer);
    sendSDP(offer);
  });

  const offer = await peer.createOffer({
    offerToReceiveAudio: true,
    offerToReceiveVideo: true,
  });
  await peer.setLocalDescription(offer);
  sendSDP(offer);
  return peer;
}

/** @type {RTCPeerConnection} */
let peer;
async function initialize() {
  await createMenu();
  peer = await createPeer();
}

/** @type {HTMLVideoElement} */
initialize();

class Peer {
  constructor() {
    this.ID = Math.random().toString(32).substring(2);
    this.ws = new WebSocket(`ws://localhost:8080?id=${this.ID}`);
  }
}
