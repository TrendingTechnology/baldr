<template>
  <div class="vc_remote_control" b-ui-theme="default">
    <h1>Fernsteuerung (über Websockets)</h1>

    <div class="link" @click="sendMessage">Nachricht schicken</div>

  </div>
</template>

<script>

export default {
  name: 'RemoteControl',
  data () {
    return {
      socket: null
    }
  },
  methods: {
    sendMessage () {
      this.$socket.send('some data')
    }
  }
}
</script>
