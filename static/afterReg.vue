<style>
  html, body {
    height: 100%;
  }
  #thank {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 3rem;
    font-weight: bold;
  }
</style>

<template>
  <div class="container">
    <div id="thank" class="columns is-centered is-vcentered is-mobile">
      <div class="column is-narrow has-text-centered">
      <template v-if="sid === null">
        <p class="fas fa-spinner fa-spin"></p>
        <p>Verifying</p>
      </template>
      <template v-else-if="sid === ''">
        <p class="fas fa-times-circle"></p>
        <p>Failed</p>
      </template>
      <template v-else>
        <p class="fas fa-check-circle"></p>
        <p>{{ sid }}</p>
        <p>Registered</p>
      </template>
      </div>
    </div>
  </div>
</template>

<script>
  async function getSidFromToken (token) {
    const url = `/api/token/${token}`;
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors'
    });
    const respObj = await response.json();
    return respObj.sid;
  }

  export default {
    data() {
      return {sid: null};
    },
    mounted() {
      getSidFromToken(this.token)
        .then((sid) => {
          this.sid = sid;
        })
        .catch(() => {
          this.sid = null;
        })
    },
    computed: {
      token() {
        return this.$store.getters.token;
      },
    }
  }
</script>
