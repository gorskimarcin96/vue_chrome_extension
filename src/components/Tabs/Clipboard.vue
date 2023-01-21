<script>
import exportFromJSON from "export-from-json";

export default {
  data() {
    return {
      word: '',
      words: [],
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
    remove(key) {
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
    download() {
      const data = this.words;
      const fileName = "words";
      const exportType = exportFromJSON.types.json;

      if (data) exportFromJSON({
        data,
        fileName,
        exportType
      });
    }
  },
  created() {
    chrome.storage.sync.get('words', storageData => {
      this.words = Object.values(storageData.words)
    });
  },
}
</script>

<template>
  <p v-if="words.length === 0 && word === ''" class="alert alert-warning py-2">Your list is empty.</p>

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
    <button class="btn btn-success" type="button" @click="download" id="download">Download</button>
    <button class="btn btn-warning" type="button" @click="clearList" id="clear_list">Clear list</button>
    <input type="text" class="form-control border-0 bg-dark border-success text-success" v-model="word">
    <button class="btn btn-success" type="button" @click="add" id="add">Add</button>
  </div>
  <p class="text-end small">You can use the shortcut "<b class="text-success">ctrl+Q</b>".</p>
</template>
