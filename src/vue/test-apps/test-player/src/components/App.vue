<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>
      <ul>
        <li>
          Components:
          <router-link to="/component-media-player-demo"
            >MediaPlayer</router-link
          >
          |
          <router-link to="/component-play-button-demo"
            >PlayButton</router-link
          >
          |
          <router-link to="/component-progress-bar-demo"
            >ProgressBar</router-link
          >
          |
          <router-link to="/component-wave-form-demo"
            >WaveForm</router-link
          >
        </li>
        <li>
          Classes:

          <router-link to="/class-playable-demo">Playable</router-link>
          | <router-link to="/class-player-demo">Player</router-link>
        </li>
      </ul>
    </div>
    <router-view />
  </div>
</template>
