<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/player">Player</router-link> |
      <router-link to="/playable">Playable</router-link> |
      <router-link to="/Video">Video</router-link>
    </div>
    <router-view />
  </div>
</template>
