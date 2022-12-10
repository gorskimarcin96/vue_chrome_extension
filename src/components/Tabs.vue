<script>
import Clipboard from "./Tabs/Clipboard.vue";
import Passwords from "@/components/Tabs/Passwords.vue";

export default {
  components: {
    Passwords,
    Clipboard,
  },
  data() {
    return {
      currentTab: 'Clipboard',
      tabs: ['Passwords', 'Clipboard']
    }
  },
  methods: {}
}
</script>

<template>
  <nav>
    <ul class="nav nav-tabs border-success px-3">
      <li class="nav-item" v-for="tab in tabs" :key="tab" @click="currentTab = tab">
        <button type="button" class="nav-link" :class="[{ 'bg-success text-white': currentTab === tab }]">{{ tab }}</button>
      </li>
    </ul>
  </nav>

  <main class="my-2 p-3">
    <component :is="currentTab" class="tab"></component>
  </main>
</template>