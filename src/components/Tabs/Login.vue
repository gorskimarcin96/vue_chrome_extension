<script>
import apiAuth from "@/api/auth"
import apiUser from "@/api/user"
import moment from 'moment'

export default {
  props: {
    user: {
      id: null,
      email: null,
      token: null,
      exp: null,
    }
  },
  data() {
    return {
      error: null,
      password: null
    }
  },
  created() {
    chrome.storage.sync.get('user', storageData => {
      if (Object.keys(storageData).length !== 0) {
        this.user.email = storageData.user.email;
      }
    });
  },
  methods: {
    async login() {
      let auth = await apiAuth.login(this.user.email, this.password).catch((response) => {
        if (response.response && response.response.status) {
          if (response.response.status === 401) {
            this.error = response.response.data.message ?? 'Not authorized';
          } else if (response.response.status === 400) {
            this.error = 'Email or password is not valid.';
          } else if (response.response.status >= 500) {
            this.error = 'Network error.';
          }
        } else if (response.message) {
          this.error = response.message ?? 'Network error.';
        }
      });

      if (auth) {
        let user = await apiUser.me(auth.token);
        user.token = auth.token;
        user.exp = auth.exp;

        this.$emit('user-data', user);
        this.error = this.password = null;
      }
    },
    logout() {
      this.error = null;
      this.$emit('user-data', {
        id: null,
        email: null,
        token: null,
      });
    },
    getDeadlineToken() {
      return moment(new Date(this.user.exp * 1000)).format('YYYY-MM-DD HH:mm')
    }
  }
}
</script>

<template>
  <div class="alert alert-success py-2" v-if="user.token !== null">You are logged.</div>
  <div class="alert alert-info py-2" v-if="user.token !== null">
    The life of the token lasts until <b>{{ getDeadlineToken() }}</b>.
  </div>
  <div class="alert alert-danger py-2" v-if="error">{{ error }}</div>

  <div class="text-end" v-if="user.token === null">
    <input type="email" class="form-control" v-model="user.email">
    <input type="password" class="form-control my-2" v-model="password" v-on:keyup.enter="login()">
    <button class="btn btn-success" type="button" @click="login" id="login">Login</button>
  </div>
  <div class="text-end" v-if="user.token !== null">
    <button class="btn btn-success w-100" type="button" @click="logout" id="logout">Logout</button>
  </div>
</template>
