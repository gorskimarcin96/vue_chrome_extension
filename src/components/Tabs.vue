<script>
import Clipboard from "./Tabs/Clipboard.vue";
import Passwords from "@/components/Tabs/Passwords.vue";
import Login from "@/components/Tabs/Login.vue";

export default {
  components: {
    Passwords,
    Clipboard,
    Login,
  },
  data() {
    return {
      user: {
        id: null,
        email: null,
        token: null,
        exp: null
      },
      currentTab: 'Login',
      tabs: ['Passwords', 'Clipboard', 'Login']
    }
  },
  methods: {
    setTab(currentTab) {
      this.currentTab = currentTab;
      chrome.storage.sync.set({'currentTab': currentTab});
    },
    setUserData(user) {
      this.user = user
      chrome.storage.sync.set({'user': user});
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
        if(storageData.user.exp * 1000 < Date.now()) {
          storageData.user.exp = null;
          storageData.user.token = null;
        }

        this.user = storageData.user;
      }
    });
  }
}
</script>

<template>
  <header class="p-2 px-3 small text-end">
    <div v-if="user.token !== null">
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
