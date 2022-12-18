<script>
import apiAuth from "@/api/auth"
import apiUser from "@/api/user"

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
      error: null,
      password: null
    }
  },
  methods: {
    async login() {
      let self = this;
      let token = await apiAuth.login(self.user.email, self.password).catch((response) => {
        if (response.response && response.response.status) {
          if (response.response.status === 400) {
            self.error = 'Email or password is not valid.';
          } else if (response.response.status >= 500) {
            self.error = 'Network error.';
          }
        } else if (response.message) {
          self.error = response.message;
        }
      });

      if (token) {
        let user = await apiUser.me(token);
        user.token = token;

        self.$emit('user-data', user);
      }
      this.password = null;
    },
    logout() {
      this.$emit('user-data', {
        id: null,
        email: null,
        token: null,
      });
    },
  }
}
</script>

<template>
  <div class="alert alert-success py-2" v-if="user.id !== null">You are logged.</div>
  <div class="alert alert-danger py-2" v-if="error">{{ error }}</div>

  <div class="text-end" v-if="user.id === null">
    <input type="email" class="form-control" v-model="user.email">
    <input type="password" class="form-control my-2" v-model="password">
    <button class="btn btn-success" type="button" @click="login" id="login">Login</button>
  </div>
  <div class="text-end" v-if="user.id !== null">
    <button class="btn btn-success w-100" type="button" @click="logout" id="logout">Logout</button>
  </div>
</template>
