<script lang="ts">
import {User} from "../../models/User";
import {defineComponent} from 'vue';
import apiPassword from "./../../api/mgorski/password"
import {Password} from "../../models/Password";
import storage from "../../storage/storage";
import {FormPassword} from "../../models/FormPassword";
import {notify} from "@/utils/notification";

export default defineComponent({
  props: {
    user: {required: false, type: User},
  },
  data() {
    return {
      showForm: true,
      passwordLength: 20,
      isLowerAZ: true,
      isUpperAZ: true,
      isNumeric: true,
      isSpecial: true,
      search: '' as string,
      passwords: [] as Password[],
      formPassword: new FormPassword('', '', '', ''),
    }
  },
  async created() {
    this.search = await storage.getPasswordSearch() ?? '';
    await this.getPasswords();

    if (this.user) {
      this.formPassword.login = this.user.email;
    }

    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
      this.formPassword.website = tabs[0].url;
    });

    this.generatePassword();
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
      notify('Added login "' + login + '" to clipboard.');
    },
    async copyPassword(key: number) {
      if (this.user && this.user.token) {
        const password = await apiPassword.getPassword(this.user.token, this.passwords[key].id);
        await navigator.clipboard.writeText(password);
        notify('Added password for "' + this.passwords[key].domain + '" to clipboard.');
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
    },
    changeStatusForIsSpecial() {
      this.isSpecial = !this.isSpecial;
    },
    changeStatusForIsLowerAZ() {
      this.isLowerAZ = !this.isLowerAZ;
    },
    changeStatusForIsUpperAZ() {
      this.isUpperAZ = !this.isUpperAZ;
    },
    changeStatusForIsNumeric() {
      this.isNumeric = !this.isNumeric;
    },
    generatePassword() {
      const chars = ""
          + (this.isLowerAZ ? 'abcdefghijklmnopqrstuvwxyz' : '')
          + (this.isUpperAZ ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' : '')
          + (this.isNumeric ? '0123456789' : '')
          + (this.isSpecial ? '!@#$%^&*' : '');

      let password = '';

      for (let i = 1; i <= this.passwordLength; i++) {
        const char = Math.floor(Math.random() * chars.length + 1);

        password += chars.charAt(char)
      }

      this.formPassword.password = password;
    },
    addPassword() {
      this.showForm = false;

      if (this.user && this.user.token) {
        apiPassword.addPassword(this.user.token, this.formPassword).then(() => {
          this.showForm = true;
          notify('Password is added.');
        }).catch((reason) => {
          this.showForm = true;
          notify(reason.toString());
        });
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
    <div class="table-responsive">
      <table class="table table-dark border-success text-light">
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

    <div class="card bg-dark text-light border-success" v-if="showForm">
      <div class="card-header fw-bold border-success">New password</div>
      <div class="card-body">
        <div class="row g-2 align-items-center">
          <div class="col-3">
            <label for="website" class="col-form-label">Website</label>
          </div>
          <div class="col-9">
            <input type="text" id="website" class="form-control" v-model="formPassword['_website']" required>
          </div>

          <div class="col-3">
            <label for="login" class="col-form-label">Login</label>
          </div>
          <div class="col-9">
            <input type="text" id="login" class="form-control" v-model="formPassword['_login']" required>
          </div>

          <div class="col-3">
            <label for="password" class="col-form-label">Password</label>
          </div>
          <div class="col-9 align-text-top">
            <div class="input-group">
              <input type="number" class="form-control" v-model="passwordLength" min="1" required>
              <button class="btn" :class="{ 'btn-outline-warning': !isSpecial, 'btn-warning': isSpecial }"
                      @click="changeStatusForIsSpecial()">S
              </button>
              <button class="btn" :class="{ 'btn-outline-warning': !isLowerAZ, 'btn-warning': isLowerAZ }"
                      @click="changeStatusForIsLowerAZ()">a-z
              </button>
              <button class="btn" :class="{ 'btn-outline-warning': !isUpperAZ, 'btn-warning': isUpperAZ }"
                      @click="changeStatusForIsUpperAZ()">A-Z
              </button>
              <button class="btn" :class="{ 'btn-outline-warning': !isNumeric, 'btn-warning': isNumeric }"
                      @click="changeStatusForIsNumeric()">0-9
              </button>
              <button class="btn btn-success" @click="generatePassword">
                <font-awesome-icon icon="fa-solid fa-random"/>
              </button>
            </div>
            <div class="input-group">
              <input type="text" id="password" class="form-control" v-model="formPassword['_password']" required>
            </div>
          </div>

          <div class="col-3">
            <label for="description" class="col-form-label">Description</label>
          </div>
          <div class="col-9">
            <input type="text" id="description" class="form-control" v-model="formPassword['_description']">
          </div>

          <button class="btn btn-success" type="button" @click="addPassword">Add</button>
        </div>
      </div>
    </div>
  </div>
</template>
