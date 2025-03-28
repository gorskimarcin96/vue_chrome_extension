<script lang="ts">
import {User} from "@/models/User";
import Login from "./Tabs/Login.vue";
import Passwords from "./Tabs/Passwords.vue";
import Currency from "./Tabs/Currency/Currency.vue";
import Coin from "./Tabs/Coin/Coin.vue";
import {defineComponent} from 'vue';
import Header from "./Header.vue";
import Footer from "./Footer.vue";
import storage from "../storage/storage";
import Nju from "@/components/Tabs/Nju/Nju.vue";
import Todo from "@/components/Tabs/Todo/Todo.vue";

export default defineComponent({
  components: {
    Header,
    Footer,
    Login,
    Passwords,
    Currency,
    Coin,
    Nju,
    Todo
  },
  data: function () {
    return {
      user: null as User | null,
      currentTab: 'Login',
      tabs: ['Passwords', 'Todo', 'Currency', 'Coin', 'Nju', 'Login'] as string[]
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
    this.user = await storage.getUser();
    this.currentTab = await storage.getCurrentTab() ?? 'Login';
  }
});
</script>

<template>
  <Header v-bind:user="user"/>

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

  <Footer/>
</template>
