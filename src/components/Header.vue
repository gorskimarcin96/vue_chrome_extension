<script lang="ts">

import {defineComponent} from "vue";
import {User} from "@/models/User";
import ip from "../api/ipify/ip";
import {notify} from "@/utils/notification";
import apiNju from "../api/mgorski/nju";
import {Nju} from "@/models/Nju";

export default defineComponent({
  props: {
    user: {required: false, type: User},
  },
  data() {
    return {
      loadedData: false,
      isShowHistoryIp: false,
      ip: "",
      isDevelopmentMode: false,
      njuData: null as Nju
    }
  },
  watch: {user: {immediate: true, handler: "fetchNjuData"}},
  methods: {
    async copyIP(ip: string) {
      navigator.clipboard.writeText(ip.trim());
      notify('Added IP "' + ip.trim() + '" to clipboard.');
    },
    async fetchNjuData() {
      this.njuData = this.user && this.user.token ? await apiNju.current(this.user.token) : null;
    },
  },
  created: async function () {
    this.isDevelopmentMode = process.env.NODE_ENV === 'development';
    this.ip = await ip.get();
    await this.fetchNjuData();
    this.loadedData = true;
  }
});
</script>

<template>
  <header class="p-2 px-3 small text-end" v-if="loadedData">
    <span v-if="user && user.token">
      You are logged in as <span class="text-success fw-semibold">{{ user.email }}</span>.
    </span>
    <span v-if="!user || !user.token" class="badge bg-warning text-dark">You are not logged.</span>
    <div>
      <span v-if="ip" @click="copyIP(ip)">Your IP: <span class="fw-bolder">{{ ip }}</span></span>
    </div>
    <span class="mx-2 badge bg-danger" v-if="isDevelopmentMode">DEV MODE</span>
    <span class="badge bg-warning text-dark" v-if="njuData">
      NJU {{ njuData.usedNet }}GB / {{ njuData.totalNet }}GB
    </span>
  </header>
  <header class="text-end" v-else>
    <div class="spinner-border m-2" role="status"></div>
  </header>
</template>
