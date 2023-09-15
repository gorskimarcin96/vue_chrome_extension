<script lang="ts">

import {defineComponent} from "vue";
import {User} from "../models/User";
import ip from "../api/ipify/ip";
import {notify} from "../utils/notification";

export default defineComponent({
  props: {
    user: {required: false, type: User},
  },
  data() {
    return {
      loadedData: false,
      ip: "",
      isDevelopmentMode: false
    }
  },
  methods: {
    async copyIP() {
      navigator.clipboard.writeText(this.ip.trim());
      notify('Added IP "' + this.ip.trim() + '" to clipboard.');
    }
  },
  created: async function () {
    this.isDevelopmentMode = process.env.NODE_ENV === 'development';
    this.ip = await ip.get();
    this.loadedData = true;
  }
});
</script>

<template>
  <header class="p-2 px-3 small text-end" v-if="loadedData">
    <span class="mx-2 badge bg-danger" v-if="isDevelopmentMode === true">DEV MODE</span>
    <span v-if="user && user.token">
      You are logged in as <span class="text-success fw-semibold">{{ user.email }}</span>.
    </span>
    <span v-if="!user || !user.token" class="badge bg-warning text-dark">You are not logged.</span>
    <div v-if="ip" @click="copyIP">Your IP: <span class="fw-bolder">{{ ip }}</span></div>
  </header>
  <header class="text-end" v-else>
    <div class="spinner-border m-2" role="status"></div>
  </header>
</template>
