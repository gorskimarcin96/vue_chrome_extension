<script lang="ts">
import {User} from "../models/User";
import Login from "./Tabs/Login.vue";
import Passwords from "./Tabs/Passwords.vue";
import Clipboard from "./Tabs/Clipboard.vue";
import {defineComponent} from 'vue';
import Todo from "./Tabs/Todo/Todo.vue";

export default defineComponent({
  components: {
    Login,
    Clipboard,
    Todo,
    Passwords
  },
  data: function () {
    return {
      user: null as User | null,
      currentTab: 'Login',
      tabs: ['Passwords', 'Todo', 'Clipboard', 'Login'] as string[]
    }
  },
  methods: {
    setTab(currentTab: string) {
      this.currentTab = currentTab;
      chrome.storage.sync.set({'currentTab': currentTab});
    },
    setUserData: function (user: User | null) {
      this.user = user
      if (user) {
        chrome.storage.sync.set({'user': {id: user.id, email: user.email, token: user.token, exp: user.exp}});
      }
    }
  },
  created() {
    chrome.storage.sync.get('currentTab', storageData => {
      if (Object.keys(storageData).length !== 0) {
        this.currentTab = storageData.currentTab
      }
    });
    chrome.storage.sync.get('user', storageData => {
      if (Object.keys(storageData).length !== 0) {
        this.user = new User(storageData.user.id, storageData.user.email, storageData.user.token, storageData.user.exp);
      }
    });
  }
});
</script>

<template>
  <header class="p-2 px-3 small text-end">
    <div v-if="user && user.token">
      You are logged in as <span class="badge bg-success">{{ user.email }}</span>.
    </div>
    <div v-else>
      <span class="badge bg-warning text-dark">You are not logged.</span>
    </div>
  </header>

  <nav>
    <ul class="nav nav-tabs border-success px-3">
      <li class="nav-item" v-for="tab in tabs" :key="tab" @click="setTab(tab)">
        <button type="button" class="nav-link" :class="[{ 'bg-success text-white': currentTab === tab }]">
          {{ tab }}
        </button>
      </li>
    </ul>
  </nav>

  <main class="my-2 p-3">
    <component :is="currentTab" @user-data="setUserData" v-bind:user="user" class="tab"></component>
  </main>
</template>
