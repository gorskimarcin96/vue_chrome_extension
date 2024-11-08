<script lang="ts">
import {User} from "@/models/User";
import {defineComponent} from 'vue';
import apiCoin from "./../../../api/mgorski/coin"
import {Coin} from "@/models/Coin";
import moment from "moment/moment";
import coin from "./../../../api/mgorski/coin";
import Chart from "./Chart.vue";

export default defineComponent({
  computed: {
    coin() {
      return coin
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
      days: 30,
      selectedCoin: 'Złoty liść klonowy',
      availableCoins: ['Złoty liść klonowy', 'Złoty australijski kangur', 'Srebny australijski kangur', 'Srebny liść klonowy'],
      coins: [] as Coin[],
      coinsSortedByBuy: [] as Coin[],
      coinsSortedBySell: [] as Coin[],
      chartData: {},
      currentCoin: null as Coin | null,
    }
  },
  async created() {
    await this.getCoins();
  },
  methods: {
    async getCoins() {
      if (this.user && this.user.token) {
        this.spinner = true;
        this.coins = await apiCoin.list(this.user.token, this.selectedCoin, this.days);
        if (this.coins.length) {
          this.currentCoin = this.coins[this.coins.length - 1];
        }

        if (this.coins.length > 1000) {
          this.isAggregateData = true;
        }

        this.loadChartData();

        let copy = this.coins;
        this.coinsSortedByBuy = copy.sort(this.sortCoinsByBuy).slice(0, 5);
        this.coinsSortedBySell = copy.sort(this.sortCoinsBySell).slice(0, 5);
        this.spinner = false;
      }
    },
    loadChartData() {
      let datasetBuy = [], datasetSell = [], labels = [];
      for (const coin of this.isAggregateData ? this.aggregateCoins(this.coins) : this.coins) {
        datasetBuy.push(parseFloat(coin.buy));
        datasetSell.push(parseFloat(coin.sell));
        labels.push(moment(coin.dateTime).format(this.isAggregateData ? 'MM-DD' : 'MM-DD HH:mm'));
      }

      this.chartData = {
        labels: labels,
        datasets: [
          {label: 'Buy', borderColor: '#f8f9fa', data: datasetBuy},
          {label: 'Sell', borderColor: '#428133', data: datasetSell}
        ]
      };
    },
    aggregateCoins(coins: Coin[]): Coin[] {
      const aggregatedData = new Map<string, { sellSum: number; buySum: number; count: number }>();

      coins.forEach((entry) => {
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

      return [...averages.values()].map((data: any) => new Coin(
          this.selectedCoin,
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
    sortCoinsByBuy(first: Coin, second: Coin) {
      if (first.buy < second.buy) {
        return -1;
      }

      if (first.buy > second.buy) {
        return 1;
      }

      return 0;
    },
    sortCoinsBySell(first: Coin, second: Coin) {
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
          <input class="form-check-input" type="checkbox" @change.prevent="loadChartData" v-model="isAggregateData">
        </div>
        <select class="form-select" v-model="selectedCoin" @change="getCoins">
          <option v-for="coin in availableCoins" v-bind:value="coin">{{ coin }}</option>
        </select>
        <input class="form-control" type="number" min="1" v-model="days" @change="getCoins">
      </div>

      <div class="text-center m-2" v-if="spinner">
        <div class="spinner-border m-2" role="status"></div>
      </div>
      <div v-else>
        <div class="row">
          <div class="col-12 p-0" v-if="coins.length">
            <h2 class="text-light text-center">Current coin</h2>
            <table class="table table-dark">
              <thead>
              <tr class="table-dark">
                <th>Title</th>
                <th>Buy</th>
                <th>Sell</th>
                <th>Date time</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>{{ currentCoin.title }}</td>
                <td><span class="badge bg-white text-dark">{{ currentCoin.buy }}</span></td>
                <td><span class="badge bg-success">{{ currentCoin.sell }}</span></td>
                <td>{{ date(currentCoin.dateTime) }} {{ time(currentCoin.dateTime) }}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="coin overflow-auto">
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
              <tr v-for="(coin, key) in coinsSortedByBuy" :class="{ 'table-light': key === 0 }">
                <td>{{ coin.buy }}</td>
                <td>{{ date(coin.dateTime) }} {{ time(coin.dateTime) }}</td>
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
              <tr v-for="(coin, key) in coinsSortedBySell" :class="{ 'table-success': key === 0 }">
                <td>{{ coin.sell }}</td>
                <td>{{ date(coin.dateTime) }} {{ time(coin.dateTime) }}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
