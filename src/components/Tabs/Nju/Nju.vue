<script lang="ts">
import {User} from "@/models/User";
import {defineComponent} from 'vue';
import apiNju from "./../../../api/mgorski/nju";
import moment from "moment/moment";
import Chart from "./Chart.vue";
import {Nju} from "@/models/Nju";

export default defineComponent({
  computed: {
    Nju() {
      return Nju
    }
  },
  components: {Chart},
  props: {
    user: {required: false, type: User},
  },
  data() {
    return {
      days: 30,
      isAggregateData: true,
      spinner: false,
      currentData: null as Nju,
      njuData: [] as Nju[],
      chartData: {},
    }
  },
  async created() {
    await this.getNjuData();
  },
  methods: {
    async getNjuData() {
      if (this.user && this.user.token) {
        this.spinner = true;
        this.njuData = await apiNju.list(this.user.token, this.days, this.isAggregateData);
        if (this.njuData) {
          this.currentData = this.njuData[this.njuData - 1];
        }
        this.loadChartData();
        this.spinner = false;
      }
    },
    loadChartData() {
      let usedNet = [], totalNet = [], labels = [];
      for (const nju of this.njuData) {
        usedNet.push(nju.usedNet);
        totalNet.push(nju.totalNet);
        labels.push(moment(nju.createdAt).format(this.isAggregateData ? 'DD-MM-YYYY' : 'DD HH:mm'));
      }

      this.chartData = {
        labels: labels,
        datasets: [
          {label: 'Used net', borderColor: '#f8f9fa', data: usedNet},
          {label: 'Total net', borderColor: '#428133', data: totalNet}
        ]
      };
    },
    date(dateTime: Date): string {
      return moment(dateTime).format('YYYY-MM-DD')
    },
    time(dateTime: Date): string {
      return moment(dateTime).format('HH:mm')
    },
  }
});
</script>

<style>
.coin {
  max-height: 250px;
  min-width: 1000px;
}
</style>

<template>
  <div v-if="!user || user.token === null" class="alert alert-warning py-2">You are not logged.</div>
  <div v-else>
    <div class="max-height-250">
      <div class="input-group">
        <div class="input-group-text">
          <label class="form-check-label me-2">Aggregate</label>
          <input class="form-check-input" type="checkbox" @change.prevent="getNjuData" v-model="isAggregateData">
        </div>
        <input class="form-control" type="number" min="1" v-model="days" @change="getNjuData">
      </div>

      <div class="text-center m-2" v-if="spinner">
        <div class="spinner-border m-2" role="status"></div>
      </div>
      <div v-else>
        <div class="row">
          <div class="col-12 p-0" v-if="currentData">
            <h2 class="text-light text-center">Nju data</h2>
            <table class="table table-dark">
              <thead>
              <tr class="table-dark">
                <th>Used net</th>
                <th>Total net</th>
                <th>Date time</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td><span class="badge bg-white text-dark">{{ currentData.usedNet }}</span></td>
                <td><span class="badge bg-success">{{ currentData.totalNet }}</span></td>
                <td>{{ date(currentData.createdAt) }} {{ time(currentData.createdAt) }}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="coin overflow-auto">
          <Chart v-bind:data="chartData"/>
        </div>
      </div>
    </div>
  </div>
</template>
