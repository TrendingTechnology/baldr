<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/icons">All Icons</router-link> |
      <router-link to="/styles">All Styles</router-link> |
      <router-link to="/link">As a link</router-link> |
      <router-link to="/vanish">VanishIcon</router-link>
    </div>
    <router-view />
  </div>
</template>
