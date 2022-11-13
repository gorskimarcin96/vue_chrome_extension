<script setup>
import WordManager from "./components/WordManager.vue";</script>

<template>
  <header>
    <img alt="mgorski.dev" src="/logo.png" class="float-start me-3"/>
    <h1 class="text-success text-uppercase">mgorski.dev</h1>
    <p>Created by <a href="https://mgorski.dev" target="_blank">mgorski.dev</a>.</p>
  </header>

  <main class="my-5">
    <WordManager/>
  </main>

  <footer>
    <img alt="Vue logo" src="./assets/vue.svg" class="float-end ms-3"/>
    <p class="pt-3">
      You’ve successfully created a project with
      <a href="https://vitejs.dev/" target="_blank" class="vue-link">Vite</a> +
      <a href="https://vuejs.org/" target="_blank" class="vue-link">Vue 3</a>.
    </p>
  </footer>
</template>