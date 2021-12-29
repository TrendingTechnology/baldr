<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/class-playable-demo">ClassPlayableDemo</router-link> |
      <router-link to="/class-player-demo">ClassPlayerDemo</router-link> |
      <router-link to="/component-media-player-demo"
        >ComponentMediaPlayerDemo</router-link
      >
      |
      <router-link to="/component-play-button-demo"
        >ComponentPlayButtonDemo</router-link
      >
      |
      <router-link to="/component-progress-bar-demo"
        >ComponentProgressBarDemo</router-link
      >
      |
      <router-link to="/component-wave-form-demo"
        >ComponentWaveFormDemo</router-link
      >
      |
    </div>
    <router-view />
  </div>
</template>
