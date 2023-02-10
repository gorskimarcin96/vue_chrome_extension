<script lang="ts">
import {defineComponent} from 'vue';
import {TodoTask as TodoTaskModel} from "../../../models/TodoTask";
import moment from "moment";

export default defineComponent({
  props: {
    todoTask: {
      required: true,
      type: TodoTaskModel,
    },
  },
  data() {
    return {
      isChecked: this.todoTask.is_done,
    }
  },
  watch: {
    isChecked() {
      this.$emit('change-todo-task-status', this.todoTask);
    }
  },
  methods: {
    createdAt(): string {
      return moment(this.todoTask.created_at).format('YYYY-MM-DD HH:mm')
    },
  }
});
</script>

<template>
  <li class="list-group-item" :class="{
      'bg-success': todoTask.id && todoTask.is_done,
      'bg-dark': todoTask.id && !todoTask.is_done,
      'text-white': todoTask.id,
      'text-mute': !todoTask.id }">

    <div class="d-flex flex-row">
      <div class="flex-grow-1">
        <input type="checkbox" class="me-2" v-model="isChecked">{{ todoTask.name }}
      </div>
      <div>
        <div class="btn-group">
          <button class="btn btn-sm btn-light" v-bind:title="todoTask.description" data-bs-toggle="tooltip"
                  :disabled="!todoTask.description">
            <font-awesome-icon icon="fa-solid fa-message"/>
          </button>
          <a class="btn btn-sm btn-light" target="_blank" v-bind:href="todoTask.file_fn" v-if="todoTask.file_fn">
            <font-awesome-icon icon="fa-solid fa-file"/>
          </a>
          <button class="btn btn-sm btn-light" v-else disabled>
            <font-awesome-icon icon="fa-solid fa-file"/>
          </button>
          <button class="btn btn-sm btn-light" v-bind:title="createdAt()" data-bs-toggle="tooltip">
            <font-awesome-icon icon="fa-solid fa-clock"/>
          </button>
        </div>
      </div>
    </div>
  </li>
</template>
