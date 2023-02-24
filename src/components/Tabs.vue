<script lang="ts">
import {User} from "../models/User";
import Login from "./Tabs/Login.vue";
import Passwords from "./Tabs/Passwords.vue";
import Clipboard from "./Tabs/Clipboard.vue";
import {defineComponent} from 'vue';
import Todo from "./Tabs/Todo/Todo.vue";
import storage from "../storage/storage";

export default defineComponent({
  components: {
    Login,
    Clipboard,
    Todo,
    Passwords
  },
  data: function () {
    return {
      isDevelopmentMode: false,
      user: null as User | null,
      currentTab: 'Login',
      tabs: ['Passwords', 'Todo', 'Clipboard', 'Login'] as string[]
    }
  },
  methods: {
    setTab(currentTab: string) {
      this.currentTab = currentTab;
      storage.setCurrentTab(currentTab)
    },
    setUserData: function (user: User | null) {
      this.user = user
      storage.setUser(user);
    }
  },
  created: async function () {
    this.isDevelopmentMode = process.env.NODE_ENV === 'development';
    this.user = await storage.getUser();
    this.currentTab = await storage.getCurrentTab() ?? 'Login';
  }
});
</script>

<template>
  <header class="p-2 px-3 small text-end">
    <span class="mx-2 badge bg-danger" v-if="isDevelopmentMode === true">DEV MODE</span>
    <span v-if="user && user.token">
      You are logged in as <span class="badge bg-success">{{ user.email }}</span>.
    </span>
    <span v-else class="badge bg-warning text-dark">You are not logged.</span>
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
