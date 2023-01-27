<script lang="ts">
import {User} from "../../models/User";
import {defineComponent} from 'vue';
import apiWord from "./../../api/word"

export default defineComponent({
  props: {
    user: {
      required: false,
      type: User,
    },
  },
  data() {
    return {
      word: '',
      words: [] as string[],
      added: null,
    }
  },
  methods: {
    add() {
      if (this.word) {
        this.words.push(this.word);
        chrome.storage.sync.set({'words': this.words}, () => {
          this.word = '';
        });
      }
    },
    remove(key: number) {
      if (confirm("Are you sure?")) {
        this.words.splice(key, 1);
        chrome.storage.sync.set({'words': this.words});
      }
    },
    clearList() {
      if (confirm("Are you sure?")) {
        chrome.storage.sync.set({'words': []});
        this.words = [];
      }
    },
    async sendDataToApp() {
      if (this.user && this.user.token) {
        const response = await apiWord.add(this.user.token, this.words);
        this.added = response.added;
      }
    }
  },
  created() {
    chrome.storage.sync.get('words', storageData => {
      this.words = Object.values(storageData.words)
    });
  },
});
</script>

<template>
  <p v-if="words.length === 0 && word === ''" class="alert alert-warning py-2">Your list is empty.</p>
  <div class="alert alert-success py-2" v-if="added">Added <b>{{ added }}</b> number of words to the app.</div>

  <ol>
    <li v-for="(word, key) in words">
      <div class="d-flex">
        <span>{{ word }}</span>
        <span class="link-danger ms-auto" @click="remove(key)">remove</span>
      </div>
    </li>
    <li v-if="word" class="text-light">{{ word }}</li>
  </ol>

  <div class="input-group mb-3">
    <button class="btn btn-success" type="button" @click="sendDataToApp" id="send_data_to_app" v-if="user">
      Send to app
    </button>
    <button class="btn btn-warning" type="button" @click="clearList" id="clear_list">Clear list</button>
    <input type="text" class="form-control border-0 bg-dark border-success text-success" v-model="word">
    <button class="btn btn-success" type="button" @click="add" id="add">Add</button>
  </div>
  <p class="text-end small">You can use the shortcut "<b class="text-success">ctrl+Q</b>".</p>
</template>
