<script>

import apiPassword from "@/api/password"

export default {
  props: {
    user: {
      id: null,
      email: null,
      token: null,
    }
  },
  data() {
    return {
      message: null,
      search: '',
      passwords: [],
    }
  },
  async created() {
    await this.getPasswords();
  },
  methods: {
    async getPasswords() {
      this.passwords = [];

      if (this.user.token) {
        const data = await apiPassword.list(this.user.token, this.search)
        for (let i = 0; i < data.length; i++) {
          let url = data[i].website;

          try {
            url = new URL(data[i].website);
          } catch (e) {
          }

          this.passwords.push({
            id: data[i].id,
            href: url.href ?? data[i].website,
            domain: url.host ?? data[i].website,
            login: data[i].login,
            description: data[i].description
          });
        }
      }
    },
    copyLogin(key) {
      const login = this.passwords[key].login;
      navigator.clipboard.writeText(login);
      this.message = 'Added login "<b>' + login + '</b>" to clipboard.';
    },
    async copyPassword(key) {
      const password = await apiPassword.getPassword(this.user.token, this.passwords[key].id);
      await navigator.clipboard.writeText(password);
      this.message = 'Added password for "<b>' + this.passwords[key].domain + '</b>" to clipboard.';
    }
  }
}
</script>

<template>
  <div v-if="user.id">
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
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
