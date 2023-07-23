<script setup>
import {GChart} from 'vue-google-charts'
import {onMounted, ref} from 'vue'

const lisbon = ref([])
const lisbon_graph = ref([])
const chartOptions = {
  title: '24h Temperature Variation in Lisbon',
  width: 700,
  height: 500,
  vAxis: {
    title: 'Temperature (ºC)'
  }
}
onMounted(async () => {
  const registration = await navigator.serviceWorker.ready;
  if ('periodicSync' in registration) {
    const status = await navigator.permissions.query({
      name: 'periodic-background-sync',
    });
    if (status.state === 'granted') {
      try {
        // Register new sync every 24 hours
        await registration.periodicSync.register('update-json', {
          minInterval: 30 * 60 * 1000, // 1 day
        });
        console.log('Periodic background sync registered!');
      } catch (e) {
        console.error(`Periodic background sync failed:\n${e}`);
      }
    }
  }
})

async function fetchData() {
  const response = await fetch(
      'https://api.ipma.pt/open-data/observation/meteorology/stations/observations.json'
  )
  const data = await response.json()
  lisbon.value = [];
  lisbon_graph.value = [];
  for (const hour in data) {
    lisbon.value = [...lisbon.value, [hour, data[hour]['1200579']]]
    lisbon_graph.value = [...lisbon_graph.value, [hour, data[hour]['1200579'].temperatura]]
  }
  lisbon.value.sort()
  lisbon_graph.value.sort()
  lisbon_graph.value = [['Time', 'Temperature'], ...lisbon_graph.value]
}
</script>
<template>
  <div class="box">
    <button type="button" @click="fetchData">Get Data</button>
  </div>
  <div v-if="lisbon.length" class="row">
    <div class="column">
      <table class="table table-striped">
        <thead>
        <tr>
          <th>Time</th>
          <th>Humidity</th>
          <th>Wind Direction</th>
          <th>Wind Intensity</th>
          <th>Wind Speed</th>
          <th>Pressure</th>
          <th>Radiation</th>
          <th>Temperature</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="hour in lisbon" v-bind:key="hour[0]">
          <td>{{ hour[0] }}</td>
          <td>{{ hour[1].humidade }}</td>
          <td>{{ hour[1].idDireccVento }}</td>
          <td>{{ hour[1].intensidadeVento }}</td>
          <td>{{ hour[1].intensidadeVentoKM }}</td>
          <td>{{ hour[1].pressao }}</td>
          <td>{{ hour[1].radiacao }}</td>
          <td>{{ hour[1].temperatura }}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <div v-if="lisbon.length" class="column">
      <GChart type="LineChart" :data="lisbon_graph" :options="chartOptions"/>
    </div>
  </div>
</template>
