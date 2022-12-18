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
          this.passwords.push({
            id: data[i].id,
            website: new URL(data[i].website),
            login: data[i].login,
            description: data[i].description,
            password: null
          });
        }
      }
    },
    async show(key) {
      const password = await apiPassword.getPassword(this.user.token, this.passwords[key].id);
      this.passwords[key].password = password;
      await navigator.clipboard.writeText(password);
      this.message = 'Added password "' + password + '" to clipboard.';
    },
  }
}
</script>

<template>
  <div v-if="user.id">
    <div class="btn-group w-100 mb-2">
      <input type="text" class="form-control" v-model="search" v-on:keyup.enter="getPasswords()">
      <button class="btn btn-success" type="button" @click="getPasswords()">Search</button>
    </div>
    <div class="alert alert-info py-2" v-if="message">{{ message }}</div>
    <div class="table-responsive">
      <table class="table border-success text-light">
        <thead>
        <tr>
          <th>Website</th>
          <th>Login</th>
          <th>Description</th>
          <th>Password</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(password,key) in passwords">
          <td><a v-bind:href="password.website.href" target="_blank">{{ password.website.host }}</a></td>
          <td>{{ password.login }}</td>
          <td>{{ password.description }}</td>
          <td>
            <input disabled v-if="password.password" v-bind:value="password.password" class="form-control small py-1"/>
            <button v-else class="btn btn-sm btn-success" type="button" @click="show(key)">Show</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
