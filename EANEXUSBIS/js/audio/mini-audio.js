
// audio/mini-audio.js
import { app } from '../core/state.js';
import { injectMiniAudioCSSOnce } from '../core/utils.js';

export const miniAudio = {
  el: null,
  wrapper: null,
  btnPrev: null,
  btnHeadset: null,
  pauseBadge: null,
  btnNext: null,
  index: 0,
  active: false,
  pendingFirstPlay: false
};

export function ensureMiniAudio() {
  injectMiniAudioCSSOnce();

  const topMenu = document.querySelector('.menu');
  if (!topMenu) return;

  let center = topMenu.querySelector('.menu-center');
  if (!center) {
    center = document.createElement('div');
    center.className = 'menu-center';
    topMenu.appendChild(center);
  }

  let wrapper = center.querySelector('#miniAudioBar');
  if (!wrapper) {
    wrapper = document.createElement('div');
    wrapper.id = 'miniAudioBar';
    wrapper.className = 'audio-mini';
    wrapper.innerHTML = `
      <button type="button" class="icon-btn audio-prev icon-left" aria-label="Piste précédente">&lt;</button>
      <button type="button" class="icon-btn audio-headset" id="audioHeadset" aria-label="Musique du site" title="Musique du site">
        🎧
        <span class="audio-pause-badge" aria-hidden="true">
          <svg viewBox="0 0 24 24" role="img" focusable="false" aria-label="Pause">
            <rect x="6"  y="4" width="4" height="16" rx="1.5"></rect>
            <rect x="14" y="4" width="4" height="16" rx="1.5"></rect>
          </svg>
        </span>
      </button>
      <button type="button" class="icon-btn audio-next icon-right" aria-label="Piste suivante">&gt;</button>
    `;
    center.appendChild(wrapper);
  }

  if (!miniAudio.el) {
    const audio = new Audio();
    audio.preload = 'metadata';
    audio.loop = !!app.data.audioOptions.loop;
    miniAudio.el = audio;
    audio.addEventListener('ended', () => {
      if (app.data.playlistAudio.length) playAtIndex(miniAudio.index + 1, false);
    });
  }

  miniAudio.wrapper = wrapper;
  miniAudio.btnPrev = wrapper.querySelector('.audio-prev');
  miniAudio.btnHeadset = wrapper.querySelector('#audioHeadset');
  miniAudio.pauseBadge = wrapper.querySelector('.audio-pause-badge');
  miniAudio.btnNext = wrapper.querySelector('.audio-next');

  miniAudio.btnHeadset.onclick = onHeadsetClick;
  miniAudio.btnPrev.onclick = () => playAtIndex(miniAudio.index - 1, true);
  miniAudio.btnNext.onclick = () => playAtIndex(miniAudio.index + 1, true);
}

export function onHeadsetClick() {
  if (!app.data.playlistAudio.length) {
    miniAudio.pendingFirstPlay = true;
    activateControls(true);
    setPlayingUI(false);
    return;
  }

  if (!miniAudio.active || miniAudio.el.paused || !miniAudio.el.src) {
    activateControls(true);
    if (!miniAudio.el.src) {
      playAtIndex(miniAudio.index, false);
    } else {
      miniAudio.el.play().catch(e => console.warn('Lecture impossible:', e));
      setPlayingUI(true);
    }
  } else {
    miniAudio.el.pause();
    setPlayingUI(false);
  }
}

function activateControls(active) {
  miniAudio.active = active;
  miniAudio.wrapper.classList.toggle('active', active);
  setPlayingUI(active && !miniAudio.el.paused);
}

function setPlayingUI(playing) {
  miniAudio.wrapper.classList.toggle('audio-playing', !!playing);
}

export function playAtIndex(i, wrap) {
  const list = app.data.playlistAudio;
  if (!list.length) return;

  let next = i;
  if (wrap) {
    if (i < 0) next = list.length - 1;
    if (i >= list.length) next = 0;
  } else {
    if (i >= list.length) {
      setPlayingUI(false);
      return;
    }
    if (i < 0) next = 0;
  }

  miniAudio.index = next;
  miniAudio.el.src = list[next].src;
  miniAudio.el.play().then(() => {
    activateControls(true);
    setPlayingUI(true);
  }).catch(e => console.warn('Lecture impossible:', e));
}
