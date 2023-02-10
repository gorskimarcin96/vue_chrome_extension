<script lang="ts">
import {defineComponent} from 'vue';
import TodoTask from "./TodoTask.vue";
import {TodoList as TodoListModel} from "../../../models/TodoList";
import {TodoTask as TodoTaskModel} from "../../../models/TodoTask";
import moment from "moment";

export default defineComponent({
  components: {TodoTask},
  props: {
    todoList: {
      required: true,
      type: TodoListModel,
    },
  },
  data() {
    return {
      isChecked: this.todoList.is_done,
      formTodoTask: new TodoTaskModel()
    }
  },
  watch: {
    isChecked() {
      this.$emit('change-todo-list-status', this.todoList);
    }
  },
  methods: {
    changeTodoTaskStatus(todoTask: TodoTaskModel) {
      this.$emit('change-todo-task-status', this.todoList, todoTask);
    },
    createdAt(): string {
      return moment(this.todoList.created_at).format('YYYY-MM-DD HH:mm')
    },
    addTodoTask() {
      this.$emit('add-todo-task', this.todoList, this.formTodoTask);
      this.formTodoTask = new TodoTaskModel();
    }
  }
});
</script>

<template>
  <div>
    <div class="card-header fw-bold" :class="{ 'bg-success': todoList.is_done, 'bg-dark': !todoList.is_done }">
      <input type="checkbox" class="me-2" v-model="isChecked">{{ todoList.name }}
    </div>
    <ul class="list-group list-group-flush">
      <todo-task v-bind:todo-task="todoTask" v-for="todoTask in todoList.todo_tasks" :key="todoList.id"
                 @change-todo-task-status="changeTodoTaskStatus"/>
      <todo-task v-bind:todo-task="formTodoTask" v-if="(formTodoTask.name || formTodoTask.description) && !isChecked"/>
      <li class="input-group" v-if="!isChecked && todoList.id">
        <input type="text" class="form-control border-warning bg-dark text-light" v-model="formTodoTask['_name']">
        <input type="text" class="form-control border-warning bg-dark text-light" v-model="formTodoTask['_description']">
        <button class="btn btn-sm btn-warning" type="button" @click="addTodoTask">Add</button>
      </li>
    </ul>
  </div>
</template>
