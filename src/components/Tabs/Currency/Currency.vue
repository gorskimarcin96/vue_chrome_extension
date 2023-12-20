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
      isAggregateData: false,
      days: 1,
      selectedCurrency: 'EUR',
      availableCurrencies: ['EUR', 'USD', 'CHF', 'GBP'],
      currencies: [] as Currency[],
      currenciesSortedByBuy: [] as Currency[],
      currenciesSortedBySell: [] as Currency[],
      chartData: {},
      currentCurrency: null as Currency | null,
    }
  },
  async created() {
    await this.getCurrencies();
  },
  methods: {
    async getCurrencies() {
      if (this.user && this.user.token) {
        this.spinner = true;
        this.currencies = await apiCurrency.list(this.user.token, this.selectedCurrency, this.days);
        if (this.currencies.length) {
          this.currentCurrency = this.currencies[this.currencies.length - 1];
        }

        if (this.currencies.length > 1000) {
          this.isAggregateData = true;
        }

        this.loadChartData();

        let copy = this.currencies;
        this.currenciesSortedByBuy = copy.sort(this.sortCurrenciesByBuy).slice(0, 5);
        this.currenciesSortedBySell = copy.sort(this.sortCurrenciesBySell).slice(0, 5);
        this.spinner = false;
      }
    },
    loadChartData() {
      let datasetBuy = [], datasetSell = [], labels = [];
      for (const currency of this.isAggregateData ? this.aggregateCurrencies(this.currencies) : this.currencies) {
        datasetBuy.push(parseFloat(currency.buy));
        datasetSell.push(parseFloat(currency.sell));
        labels.push(moment(currency.dateTime).format(this.isAggregateData ? 'MM-DD' : 'MM-DD HH:mm'));
      }

      this.chartData = {
        labels: labels,
        datasets: [
          {label: 'Buy', borderColor: '#f8f9fa', data: datasetBuy},
          {label: 'Sell', borderColor: '#428133', data: datasetSell}
        ]
      };
    },
    aggregateCurrencies(currencies: Currency[]): Currency[] {
      const aggregatedData = new Map<string, { sellSum: number; buySum: number; count: number }>();

      currencies.forEach((entry) => {
        const date = entry.dateTime.toISOString().split("T")[0];

        if (!aggregatedData.has(date)) {
          aggregatedData.set(date, {sellSum: 0, buySum: 0, count: 0});
        }

        aggregatedData.get(date)!.sellSum += Number(entry.sell);
        aggregatedData.get(date)!.buySum += Number(entry.buy);
        aggregatedData.get(date)!.count += 1;
      });

      const averages = new Map<string, { averageSell: number; averageBuy: number, date: string }>();

      aggregatedData.forEach((value, date: string) => {
        averages.set(date, {
          averageSell: value.sellSum / value.count,
          averageBuy: value.buySum / value.count,
          date: date,
        });
      });

      return [...averages.values()].map((data: any) => new Currency(
          this.selectedCurrency,
          data.averageSell.toFixed(4),
          data.averageBuy.toFixed(4),
          data.date)
      );
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
        return 1;
      }

      if (first.sell < second.sell) {
        return -1;
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
  <div v-if="!user || user.token === null" class="alert alert-warning py-2">You are not logged.</div>
  <div v-else>
    <div class="max-height-250">
      <div class="input-group">
        <div class="input-group-text">
          <label class="form-check-label me-2">Aggregate</label>
          <input class="form-check-input" type="checkbox" @change.prevent="loadChartData" v-model="isAggregateData">
        </div>
        <select class="form-select" v-model="selectedCurrency" @change="getCurrencies">
          <option v-for="currency in availableCurrencies" v-bind:value="currency">{{ currency }}</option>
        </select>
        <input class="form-control" type="number" min="1" v-model="days" @change="getCurrencies">
      </div>

      <div class="text-center m-2" v-if="spinner">
        <div class="spinner-border m-2" role="status"></div>
      </div>
      <div v-else>
        <div class="row">
          <div class="col-12 p-0" v-if="currencies.length">
            <h2 class="text-light text-center">Current currency</h2>
            <table class="table table-dark">
              <thead>
              <tr class="table-dark">
                <th>Label</th>
                <th>Buy</th>
                <th>Sell</th>
                <th>Date time</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>{{ currentCurrency.label }}</td>
                <td><span class="badge bg-white text-dark">{{ currentCurrency.buy }}</span></td>
                <td><span class="badge bg-success">{{ currentCurrency.sell }}</span></td>
                <td>{{ date(currentCurrency.dateTime) }} {{ time(currentCurrency.dateTime) }}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
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
