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
      click: () => startCamera(it.deviceId),
    }))
  );
  Menu.setApplicationMenu(menu);
}

const app = document.getElementById("app");
async function startCamera(deviceId) {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { deviceId: { exact: deviceId } },
    audio: false,
  });
  const video = h("video", {});
  app?.append(h("div", {}, video));
  video.srcObject = stream;
  video.play();
}

async function addVideo(stream) {

}

async function createPeer() {
  const pc_config = {"iceServers":[ {"urls":"stun:stun.webrtc.ecl.ntt.com:3478"} ]};
  const peer = new RTCPeerConnection(pc_config);

  // リモートのMediaStreamTrackを受信した時
  peer.addEventListener("track", e => {
    addVideo(e.streams[0]);
  });

  // ICE Candidateを収集したときのイベント
  peer.addEventListener("icecandidate", e => {
    if (e.candidate) {
      console.log(e.candidate);
    } else {

    }
  });

  return peer;
}

async function initialize() {
  await createMenu();
  createPeer();
}

/** @type {HTMLVideoElement} */
initialize();
