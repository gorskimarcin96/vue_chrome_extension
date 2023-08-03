<script lang="ts">
import {defineComponent} from 'vue';
import apiTodo from "../../../api/mgorski/todo";
import TodoTask from "./TodoTask.vue";
import TodoList from "./TodoList.vue";
import {User as UserModel} from "../../../models/User";
import {TodoList as TodoListModel} from "../../../models/TodoList";
import {TodoTask as TodoTaskModel} from "../../../models/TodoTask";

export default defineComponent({
  components: {TodoTask, TodoList},
  props: {
    user: {required: false, type: UserModel},
  },
  data() {
    return {
      todoLists: [] as TodoListModel[],
      formTodoList: new TodoListModel()
    }
  },
  created() {
    this.getTodos();
  },
  methods: {
    async getTodos() {
      if (this.user && this.user.token) {
        this.todoLists = await apiTodo.list(this.user.token)
      }
    },
    async changeTodoListStatus(todoList: TodoListModel) {
      if (this.user && this.user.token) {
        const foundTodoList = this.todoLists.find((foundTodoList) => {
          return todoList.id === foundTodoList.id;
        });

        const response = await apiTodo.changeListStatus(this.user.token, foundTodoList);

        response instanceof TodoListModel ? foundTodoList?.change_status() : alert(response);
      }
    },
    async changeTodoTaskStatus(todoList: TodoListModel, todoTask: TodoTaskModel) {
      if (this.user && this.user.token) {
        const foundTodoList = this.todoLists.find((foundTodoList) => {
          return todoList.id === foundTodoList.id;
        });

        const foundTodoTask = foundTodoList?.todo_tasks.find((foundTodoTask) => {
          return todoTask.id === foundTodoTask.id;
        });

        if (await apiTodo.changeTaskStatus(this.user.token, foundTodoTask) instanceof TodoTaskModel) {
          foundTodoTask?.change_status();
        }
      }
    },
    async addTodoList() {
      if (this.user && this.user.token && this.formTodoList.name) {
        this.todoLists.push(await apiTodo.addList(this.user.token, this.formTodoList));
        this.formTodoList = new TodoListModel()
      }
    },
    async addTodoTask(todoList: TodoListModel, todoTask: TodoTaskModel) {
      if (this.user && this.user.token) {
        const foundTodoList = this.todoLists.find((foundTodoList) => {
          return todoList.id === foundTodoList.id;
        });

        foundTodoList?.add_todo_task(await apiTodo.addTask(this.user.token, todoList, todoTask));
      }
    }
  }
});
</script>

<template>
  <div v-if="user && user.token === null" class="alert alert-warning py-2">You are not logged.</div>
  <div v-else>
    <div class="card mb-2 text-white bg-transparent border-success">
      <todo-list v-bind:todoList="formTodoList"/>
      <div class="input-group">
        <input type="text" class="form-control border-warning bg-dark text-light" v-model="formTodoList['_name']"
               placeholder="Your new todo list">
        <button class="btn btn-sm btn-warning" type="button" @click="addTodoList">Add</button>
      </div>
    </div>
    <div v-for="todoList in todoLists" class="card mb-2 text-white bg-transparent border-success">
      <todo-list v-bind:todoList="todoList" :key="todoList.id" @add-todo-task="addTodoTask"
                 @change-todo-task-status="changeTodoTaskStatus" @change-todo-list-status="changeTodoListStatus"/>
    </div>
  </div>
</template>
