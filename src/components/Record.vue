<template>
  <div
    class="row flex justify-content-center justify-content-start-sm align-items-center p-2"
  >
    <div class="col-lg-4 col-md-12 flex justify-content-start">
      <p>{{ historicalUrl.givenUrl }}</p>
    </div>
    <div class="col-lg-2"></div>
    <div class="col-lg-6 col-md-12 col-12 mt-2 mt-sm-0">
      <div class="row flex align-items-center">
        <div class="col-lg-8 col-md-12 col-12">
          <p class="text-right text-left-sm mr-lg-4">
            <a class="link" :href="historicalUrl.breveUrl" target="_blank">{{
              historicalUrl.breveUrl
            }}</a>
          </p>
        </div>
        <div class="col-lg-4 col-md-12 col-12">
          <button
            v-on:click="() => copy(historicalUrl, index + 1)"
            class="light text-dark block create-button copy-btn"
            :ref="(el) => (copyBtns[index + 1] = el)"
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"

interface HistoricalUrl {
  givenUrl: string
  hash: string
  breveUrl: string
}
defineProps<{
  historicalUrl: HistoricalUrl
  index: number
}>()

// copy
const copyToClipboard = (url: string) => {
  const el = document.createElement("textarea")
  el.value = url
  document.body.appendChild(el)
  el.select()
  document.execCommand("copy")
  document.body.removeChild(el)
}
const copy = (historicalUrl: HistoricalUrl, index: number) => {
  copyToClipboard(historicalUrl.breveUrl)

  const btn = copyBtns.value[index]
  btn.classList.add("success")
  btn.innerText = "Copied!"
  setTimeout(() => {
    btn.classList.remove("success")
    btn.innerText = "Copy"
  }, 2000)
}
const copyBtns = ref<any>({})
// copy end
</script>

<style scoped>
.success {
  background-color: #4caf50 !important;
  color: #fff !important;
}

.copy-btn {
  border-radius: 0.6rem;
  border: none;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  &:hover {
    background-color: #e9e9e9;
  }
}
</style>
