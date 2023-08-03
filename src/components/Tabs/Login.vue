<script lang="ts">
import {User} from "../../models/User";
import {defineComponent} from 'vue'
import apiAuth from "./../../api/mgorski/auth"
import apiUser from "./../../api/mgorski/user"
import moment from "moment";

export default defineComponent({
  props: {
    user: {required: false, type: User},
  },
  data() {
    return {
      error: null as string | null,
      email: null as string | null,
      password: null as string | null
    }
  },
  created() {
    this.email = this.user ? this.user.email : null;
  },
  methods: {
    async login() {
      if (this.email && this.password) {
        let auth = await apiAuth.login(this.email, this.password).catch((response) => {
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
          const user = await apiUser.me(auth.token);
          this.$emit('user-data', new User(user.id, user.email, auth.token, auth.exp));
          this.error = this.password = null;
        }
      }
    },
    logout() {
      this.error = null;
      this.$emit('user-data', this.user ? new User(user.id, user.email, user.token, 0) : null);
    },
    getDeadlineToken() {
      return this.user && this.user.exp ? moment(new Date(this.user.exp * 1000)).format('YYYY-MM-DD HH:mm') : null;
    }
  }
});
</script>

<template>
  <div class="alert alert-success py-2" v-if="user && user.token !== null">You are logged.</div>
  <div class="alert alert-info py-2" v-if="user && user.token !== null">
    The life of the token lasts until <b>{{ getDeadlineToken() }}</b>.
  </div>
  <div class="alert alert-danger py-2" v-if="error">{{ error }}</div>

  <div class="text-end" v-if="user === null || (user && user.token === null)">
    <input type="email" class="form-control" v-model="email">
    <input type="password" class="form-control my-2" v-model="password" v-on:keyup.enter="login()">
    <button class="btn btn-success" type="button" @click="login" id="login">Login</button>
  </div>
  <div class="text-end" v-if="user && user.token !== null">
    <button class="btn btn-success w-100" type="button" @click="logout" id="logout">Logout</button>
  </div>
</template>
