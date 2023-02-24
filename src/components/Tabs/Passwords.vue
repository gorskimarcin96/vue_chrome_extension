<script lang="ts">
import {User} from "../../models/User";
import {defineComponent} from 'vue';
import apiPassword from "./../../api/password"
import {Password} from "../../models/Password";
import storage from "../../storage/storage";

export default defineComponent({
  props: {
    user: {required: false, type: User},
  },
  data() {
    return {
      message: null as string | null,
      search: '' as string,
      passwords: [] as Password[],
    }
  },
  async created() {
    this.search = await storage.getPasswordSearch() ?? '';
    await this.getPasswords();
  },
  methods: {
    async getPasswords() {
      storage.setPasswordSearch(this.search);
      this.passwords = [];

      if (this.user && this.user.token) {
        this.passwords = await apiPassword.list(this.user.token, this.search)
      }
    },
    copyLogin(key: number) {
      const login = this.passwords[key].login;
      navigator.clipboard.writeText(login);
      this.message = 'Added login "<b>' + login + '</b>" to clipboard.';
    },
    async copyPassword(key: number) {
      if (this.user && this.user.token) {
        const password = await apiPassword.getPassword(this.user.token, this.passwords[key].id);
        await navigator.clipboard.writeText(password);
        this.message = 'Added password for "<b>' + this.passwords[key].domain + '</b>" to clipboard.';
      }
    },
    async login(key: number) {
      if (process.env.NODE_ENV === 'development') {
        alert('Its not work for development mode.');
      } else {
        if (this.user && this.user.token) {
          const password = await apiPassword.getPassword(this.user.token, this.passwords[key].id);

          chrome.runtime.sendMessage({
            event_name: "log_in",
            login: this.passwords[key].login,
            password: password,
            url: this.passwords[key].href
          });
        }
      }
    }
  }
});
</script>

<template>
  <div v-if="user && user.token === null" class="alert alert-warning py-2">You are not logged.</div>
  <div v-else>
    <div class="btn-group w-100 mb-2">
      <input type="text" class="form-control" v-model="search" v-on:keyup.enter="getPasswords()">
      <button class="btn btn-success" type="button" @click="getPasswords()">Search</button>
    </div>
    <div class="alert alert-info py-2" v-if="message" v-html="message"></div>
    <div class="table-responsive">
      <table class="table border-success text-light">
        <thead>
        <tr>
          <th>Website</th>
          <th>Description</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(password,key) in passwords">
          <td><a v-bind:href="password.href" target="_blank">{{ password.domain }}</a></td>
          <td>{{ password.description }}</td>
          <td>
            <div class="btn-group w-100 mb-2">
              <button class="btn btn-sm btn-success" type="button" @click="copyLogin(key)">Login</button>
              <button class="btn btn-sm btn-warning" type="button" @click="copyPassword(key)">Password</button>
              <button class="btn btn-sm btn-primary" type="button" @click="login(key)">Log in</button>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
