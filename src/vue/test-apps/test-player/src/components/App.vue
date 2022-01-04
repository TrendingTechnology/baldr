<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>
      <ul>
        <li>
          Components:
          <router-link to="/components/media-player">MediaPlayer</router-link>
          |
          <router-link to="/components/playable-base">PlayableBase</router-link>
          |
          <router-link to="/components/play-button">PlayButton</router-link>
          |
          <router-link to="/components/progress-bar">ProgressBar</router-link>
          |
          <router-link to="/components/video-screen">VideoScreen</router-link>
          |
          <router-link to="/components/wave-form">WaveForm</router-link>
        </li>
        <li>
          Classes:

          <router-link to="/classes/playable">Playable</router-link>
          | <router-link to="/classes/player">Player</router-link>
        </li>
      </ul>
    </div>
    <router-view />
  </div>
</template>
