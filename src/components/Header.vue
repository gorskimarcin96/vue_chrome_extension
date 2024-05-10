<script lang="ts">

import {defineComponent} from "vue";
import {User} from "../models/User";
import ip from "../api/ipify/ip";
import {notify} from "../utils/notification";
import {IP} from "@/models/IP";
import storage from "@/storage/storage";
import moment from "moment/moment";

export default defineComponent({
  props: {
    user: {required: false, type: User},
  },
  data() {
    return {
      loadedData: false,
      isShowHistoryIp: false,
      ip: "",
      ips: [] as IP[],
      isDevelopmentMode: false
    }
  },
  methods: {
    async copyIP(ip: string) {
      navigator.clipboard.writeText(ip.trim());
      notify('Added IP "' + ip.trim() + '" to clipboard.');
    },
    updateIPinStorage() {
      for (const ip of this.ips) {
        if (ip.ip === this.ip) {
          return;
        }
      }

      storage.addIP(this.ip);
      this.ips.push({ip: ip, date: Date.now()})
    },
    timestampToString(date: number): string {
      return moment(date).format('YYYY-MM-DD HH:mm')
    },
    showHistoryIp() {
      this.isShowHistoryIp = true;
    }
  },
  created: async function () {
    this.isDevelopmentMode = process.env.NODE_ENV === 'development';
    this.ip = await ip.get();
    this.ips = await storage.getIPs() ?? [];
    this.updateIPinStorage();
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
    <div class="max-height-100px overflow-auto">
      <table class="ms-auto my-1" v-if="isShowHistoryIp">
        <tbody>
        <tr v-for="historyIP in ips">
          <td class="px-2">{{ timestampToString(historyIP.date) }}</td>
          <td class="fw-bolder" @click="copyIP(ip)">{{ historyIP.ip }}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <div>
      <span v-if="ip" @click="copyIP(ip)">Your IP: <span class="fw-bolder">{{ ip }}</span></span>
      <span v-if="!isShowHistoryIp" @click="showHistoryIp" class="link-success cursor-pointer"> - show IP history</span>
    </div>
  </header>
  <header class="text-end" v-else>
    <div class="spinner-border m-2" role="status"></div>
  </header>
</template>
