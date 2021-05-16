<template>
  <div class="price-history">
    <div class="title">{{ title }}</div>
    <div class="row header">
      <div class="cell">Timestamp</div>
      <div class="cell">Symbol</div>
      <div class="cell">Price</div>
    </div>
    <div class="row" v-for="(row, index) in records" v-bind:key="index">
      <div class="cell">{{ row.last_updated }}</div>
      <div class="cell">{{ row.symbol }}</div>
      <div class="cell">${{ row.market_data.current_price.usd }}</div>
    </div>
  </div>
</template>

<style lang="scss">
.title {
  display: flex;
  justify-content: flex-start;
  font-size: 2rem;
  font-weight: bold;
}
.price-history {
  display: flex;
  flex-direction: column;
  min-width: 30rem;
  padding: 0.5rem;
}
.header {
  font-weight: bold;
}
.row {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-content: center;
  width: 100%;
  border-top: 1px solid black;
  border-right: 1px solid black;
}
.row:last-child {
  border-bottom: 1px solid black;
}
.cell {
  display: flex;
  width: 25%;
  padding: 0.1rem;
  border-left: 1px solid black;
}
.cell:first-child {
  width: 50%;
}
</style>

<script lang="ts">
import { v4 as uuid } from "uuid";
import { Component, Prop, Vue } from "vue-property-decorator";

type PriceRecord = {
  symbol: string;
  timestamp: number;
  price: number;
};

const COIN_API_BASE = "https://api.coingecko.com/api/v3/coins";

@Component
export default class PriceHistory extends Vue {
  @Prop({ type: String, default: "title" }) title!: string;
  @Prop({ type: Number, default: 5 }) interval!: number;
  @Prop({ type: Number, default: 10 }) history!: number;
  @Prop({ type: String, default: "await" }) method!: "then" | "await" | "all";

  private data: PriceRecord[] = [];

  async created() {
    await this.update();
  }

  get records(): PriceRecord[] {
    if (this.data.length > this.history) {
      this.data = this.data.splice(this.data.length - this.history);
    }
    return this.data;
  }

  async update() {
    if (this.method === "then") {
      this.useThen();
    } else if (this.method === "await") {
      await this.useAwait();
    } else {
      throw new Error("invalid method type during update");
    }

    setTimeout(async () => {
      await this.update();
    }, this.interval * 1000);
  }

  useThen() {
    const contextID: string = uuid();

    console.log(`context ${contextID}: starting 'then'`);

    fetch(`${COIN_API_BASE}/bitcoin`)
      .then((res: Response) => {
        // res is the response for bitcoin;
        // since parsing the json body is async, we return another response
        // to keep the promise / then chain going.
        return res.json();
      })
      .then((res: any) => {
        // res is the json content parsed from the response;
        this.data.push(res);
        // getting the next symbol, just like the first, is obviously async.
        // we return another promise, which is then-able.
        return fetch(`${COIN_API_BASE}/ethereum`);
      })
      .then((res: Response) => {
        // res is the response for ethereum, parsing is async, etc.
        return res.json();
      })
      .then((res: any) => {
        // res is the parsed json content
        this.data.push(res);
        // should we go on and get another ticker?
        return fetch(`${COIN_API_BASE}/dogecoin`);
      })
      .then((res: Response) => {
        return res.json();
      })
      .then((res: any) => {
        this.data.push(res);

        console.log(`context ${contextID}: finished 'then'`);
      })
      .catch((err) => {
        // if anything fails, at any point in the method chain, we go here
        console.error(err);
      });

    console.log(`context ${contextID}: exiting 'then'`);
  }

  useAll() {
    const contextID: string = uuid();

    console.log(`context ${contextID}: starting 'all'`);

    const symbols = ["bitcoin", "ethereum", "dogecoin"];
    const promises: Promise<any>[] = [];

    for (const symbol of symbols) {
      // for each symbol, we create a promise and store it in an array.
      // the promise, like above, is chained. so it's actually two promises.
      // the first executes the http request, the second parses the body.
      const promise = fetch(`${COIN_API_BASE}/${symbol}`).then(
        (res: Response) => {
          return res.json();
        },
      );
      promises.push(promise);
    }

    // Promise.all waits for the completion of all the promises you pass in.
    // if everything works, you get an array of results. if not, .catch handles
    // the error. it's all or nothing. see Promise.allSettled for handling
    // partial failures.
    Promise.all(promises)
      .then((res: any[]) => {
        this.data.push(...res);

        console.log(`context ${contextID}: finished 'all'`);
      })
      .catch((err) => {
        console.error(err);
      });

    console.log(`context ${contextID}: exiting 'all'`);
  }

  // v notice that this guy uses the async keyword
  async useAwait() {
    const contextID: string = uuid();

    console.log(`context ${contextID}: starting 'await'`);

    const symbols = ["bitcoin", "ethereum", "dogecoin"];

    for (const symbol of symbols) {
      try {
        // from right to left, send the request, await the response
        const response = await fetch(`${COIN_API_BASE}/${symbol}`);
        // same here, wait on json parsing to complete
        const data = await response.json();
        // collect response data one at a time
        this.data.push(data);
        console.log(`context ${contextID}: finished 'await'`);
      } catch (err) {
        console.error(err);
      }
    }
    console.log(`context ${contextID}: exiting 'await'`);
  }
}
</script>
