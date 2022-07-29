<template>
  <div class="row flex mt-2">
    <div class="col-12">
      <div
        class="success-message card border-radius-1"
        v-if="successfulSave.data.hash.length > 0"
      >
        <div class="mt-2 ml-2">
          <h3>Success!</h3>
        </div>
        <Record :historicalUrl="successfulSave.data" :index="0" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface IHistoricalUrl {
  givenUrl: string
  hash: string
  breveUrl: string
}
defineProps<{
  successfulSave: {
    data: IHistoricalUrl
  }
}>()
</script>

<style lang="scss" scoped></style>
