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
      },
      currentTab: 'Login',
      tabs: ['Passwords', 'Clipboard', 'Login']
    }
  },
  methods: {
    setUserData(user) {
      this.user = user
    }
  }
}
</script>

<template>
  <header class="p-2 px-3 small text-end">
    <div v-if="user.id">
      You are logged in as <span class="badge bg-success">{{ user.email }}</span>.
    </div>
    <div v-else>
      <span class="badge bg-warning text-dark">You are not logged.</span>
    </div>
  </header>

  <nav>
    <ul class="nav nav-tabs border-success px-3">
      <li class="nav-item" v-for="tab in tabs" :key="tab" @click="currentTab = tab">
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
