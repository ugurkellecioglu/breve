<template>
  <div class="row flex justify-content-center">
    <div class="error" v-if="error">
      {{ error }}
    </div>
    <div class="card col-12 mt-3 border-radius-1 p-2">
      <!-- get from local storage -->
      <h3 class="p-2">Previous Miniks</h3>
      <small class="p-2" v-if="historicalUrls.data.length === 0">
        You don't have any previous minik's
      </small>
      <div
        v-for="(historicalUrl, idx) in historicalUrls.data"
        :key="historicalUrl.hash"
      >
        <Record :historicalUrl="historicalUrl" :index="idx" />
        <hr />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Record from "./Record.vue"
interface IHistoricalUrl {
  givenUrl: string
  hash: string
  breveUrl: string
}
interface IHistoricalUrls {
  data: IHistoricalUrl[]
}
defineProps<{
  historicalUrls: IHistoricalUrls
  error?: string
}>()
</script>

<style lang="scss" scoped></style>
