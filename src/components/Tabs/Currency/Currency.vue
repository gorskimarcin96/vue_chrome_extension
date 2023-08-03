<script lang="ts">
import {User} from "../../../models/User";
import {defineComponent} from 'vue';
import apiCurrency from "./../../../api/mgorski/currency"
import {Currency} from "../../../models/Currency";
import moment from "moment/moment";
import currency from "./../../../api/mgorski/currency";
import Chart from "./Chart.vue";

export default defineComponent({
  computed: {
    currency() {
      return currency
    }
  },
  components: {Chart},
  props: {
    user: {required: false, type: User},
  },
  data() {
    return {
      spinner: false,
      days: 1,
      selectedCurrency: 'EUR',
      availableCurrencies: ['EUR', 'USD', 'CHF', 'GBP'],
      currencies: [] as Currency[],
      currenciesSortedByBuy: [] as Currency[],
      currenciesSortedBySell: [] as Currency[],
      chartData: {},
    }
  },
  async created() {
    await this.getCurrencies();
  },
  methods: {
    async getCurrencies() {
      if (this.user && this.user.token) {
        this.spinner = true;
        this.currencies = await apiCurrency.list(this.user.token, this.selectedCurrency, this.days)

        let datasetBuy = [], datasetSell = [], labels = [];
        for (let i = 0; i < this.currencies.length; i++) {
          datasetBuy.push(parseFloat(this.currencies[i].buy));
          datasetSell.push(parseFloat(this.currencies[i].sell));
          labels.push(moment(this.currencies[i].dateTime).format('MM-DD HH:mm'));
        }

        this.chartData = {
          labels: labels,
          datasets: [
            {label: 'Buy', borderColor: '#f8f9fa', data: datasetBuy},
            {label: 'Sell', borderColor: '#428133', data: datasetSell}
          ]
        };

        let copy = this.currencies;
        this.currenciesSortedByBuy = copy.sort(this.sortCurrenciesByBuy).slice(0, 5);
        this.currenciesSortedBySell = copy.sort(this.sortCurrenciesBySell).slice(0, 5);

        this.spinner = false;
      }
    },
    date(dateTime: Date): string {
      return moment(dateTime).format('YYYY-MM-DD')
    },
    time(dateTime: Date): string {
      return moment(dateTime).format('HH:mm')
    },
    sortCurrenciesByBuy(first: Currency, second: Currency) {
      if (first.buy < second.buy) {
        return -1;
      }

      if (first.buy > second.buy) {
        return 1;
      }

      return 0;
    },
    sortCurrenciesBySell(first: Currency, second: Currency) {
      if (first.sell > second.sell) {
        return -1;
      }

      if (first.sell < second.sell) {
        return 1;
      }

      return 0;
    }
  }
});
</script>

<style>
.currency {
  max-height: 250px;
  min-width: 1000px;
}
</style>

<template>
  <div v-if="user && user.token === null" class="alert alert-warning py-2">You are not logged.</div>
  <div v-else>
    <div class="max-height-250">
      <div class="input-group">
        <select class="form-select" v-model="selectedCurrency" @change="getCurrencies">
          <option v-for="currency in availableCurrencies" v-bind:value="currency">{{ currency }}</option>
        </select>
        <input class="form-control" type="number" min="1" v-model="days" @change="getCurrencies">
      </div>

      <div class="text-center m-2" v-if="spinner">
        <div class="spinner-border m-2" role="status"></div>
      </div>
      <div v-else>
        <div class="currency overflow-auto">
          <Chart v-bind:data="chartData"/>
        </div>
        <div class="row">
          <div class="col-6 p-0">
            <h2 class="text-light text-center">The best buy</h2>
            <table class="table table-dark border-success">
              <thead>
              <tr class="table-light">
                <th>Buy</th>
                <th>Date time</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(currency, key) in currenciesSortedByBuy" :class="{ 'table-light': key === 0 }">
                <td>{{ currency.buy }}</td>
                <td>{{ date(currency.dateTime) }} {{ time(currency.dateTime) }}</td>
              </tr>
              </tbody>
            </table>
          </div>
          <div class="col-6 p-0">
            <h2 class="text-light text-center">The best sell</h2>
            <table class="table table-dark border-success text-light">
              <thead>
              <tr class="table-success">
                <th>Sell</th>
                <th>Date time</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(currency, key) in currenciesSortedBySell" :class="{ 'table-success': key === 0 }">
                <td>{{ currency.sell }}</td>
                <td>{{ date(currency.dateTime) }} {{ time(currency.dateTime) }}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
