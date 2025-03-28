<script lang="ts">
import {User} from "@/models/User";
import {defineComponent} from 'vue';
import apiTodo from "@/api/mgorski/todo";
import apiLabel from "@/api/mgorski/label";
import {Todo} from "@/models/Todo";
import moment from "moment";
import {FormTodo} from "@/models/FormTodo";
import {Label} from "@/models/Label";
import apiPassword from "@/api/mgorski/password";
import {notify} from "@/utils/notification";

export default defineComponent({
  props: {user: {required: false, type: User}},
  data() {
    return {
      spinner: false,
      labelData: [] as Label[],
      todoData: [] as Todo[],
      formTodo: new FormTodo(),
    }
  },
  async created() {
    this.spinner = true;
    await this.getLabelsData();
    await this.getTodoData();
    this.spinner = false;
  },
  methods: {
    async getLabelsData() {
      if (this.user && this.user.token) {
        this.labelData = await apiLabel.list(this.user.token);
      }
    },
    async getTodoData() {
      if (this.user && this.user.token) {
        this.todoData = await apiTodo.list(this.user.token);
      }
    },
    date(dateTime: Date): string {
      return moment(dateTime).format('YYYY-MM-DD')
    },
    addTodo() {
      if (this.user && this.user.token) {
        apiTodo.addTodo(this.user.token, this.formTodo)
            .then(() => {
              this.getTodoData()
              this.formTodo = new FormTodo()
            })
            .catch((reason) => notify(reason.toString()));
      }
    },
    deleteTodo(id: number) {
      if (this.user && this.user.token) {
        apiTodo.deleteTodo(this.user.token, id)
            .then(() => this.getTodoData())
            .catch((reason) => notify(reason.toString()));
      }
    }
  }
});
</script>

<template>
  <div v-if="!user || user.token === null" class="alert alert-warning py-2">You are not logged.</div>
  <div class="text-center m-2" v-else-if="spinner">
    <div class="spinner-border m-2" role="status"></div>
  </div>
  <div v-else>
    <ol class="list-group list-group-numbered mb-4" v-if="todoData.length">
      <li class="list-group-item d-flex justify-content-between align-items-start bg-dark text-light border-success"
          v-for="todo in todoData">
        <div class="ms-2 me-auto">
          <div class="fw-bold">{{ todo.title }}</div>
          {{ todo.description }}
        </div>
        <span v-if="todo.label" class="badge mx-1 bg-primary rounded-pill">{{ todo.label }}</span>
        <span v-if="todo.deadline" class="badge mx-1 bg-danger rounded-pill">{{ date(todo.deadline) }}</span>
        <span class="badge mx-1 bg-success rounded-pill">{{ date(todo.createdAt) }}</span>
        <button class="badge mx-1 bg-white rounded-pill text-black cursor-pointer" type="button"
                @click="deleteTodo(todo.id)">X
        </button>
      </li>

    </ol>
    <div v-else class="alert alert-success py-2">
      Your list is empty.
    </div>

    <div class="card bg-dark text-light border-success">
      <div class="card-header fw-bold border-success">New todo</div>
      <div class="card-body">
        <div class="row g-2 align-items-center">
          <div class="col-3">
            <label for="title" class="col-form-label">Title</label>
          </div>
          <div class="col-9">
            <input type="text" id="title" class="form-control" v-model="formTodo['_title']" required>
          </div>
          <div class="col-3">
            <label for="description" class="col-form-label">Description</label>
          </div>
          <div class="col-9">
            <input type="text" id="description" class="form-control" v-model="formTodo['_description']" required>
          </div>
          <div class="col-3">
            <label for="label" class="col-form-label">Label</label>
          </div>
          <div class="col-9">
            <select class="form-select" v-model="formTodo['_label']">
              <option v-for="label in labelData" v-bind:value="label.id">{{ label.title }}</option>
            </select>
          </div>
          <div class="col-3">
            <label for="deadline" class="col-form-label">Deadline</label>
          </div>
          <div class="col-9">
            <input type="date" id="deadline" class="form-control" v-model="formTodo['_deadline']" required>
          </div>
          <button class="btn btn-success" type="button" @click="addTodo">Add</button>
        </div>
      </div>
    </div>
  </div>
</template>
