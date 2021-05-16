<template>
  <div id="app">
    <PriceHistory title="Async / Await" type="await" />
    <PriceHistory title="Promise.then()" type="then" />
    <PriceHistory title="Promise.all()" type="all" />
  </div>
</template>

<style lang="scss">
#app {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 5rem;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import PriceHistory from "@/components/PriceHistory.vue";

@Component({
  components: {
    PriceHistory,
  },
})
export default class App extends Vue {}
</script>
