<script setup lang="ts">
import { computed, reactive, ref } from "vue"

const data = reactive({
  givenUrl: "",
  hash: "",
  tinyrl: "",
})
const loading = ref(false)

const saveHash = (url) => {
  loading.value = true
  setTimeout(() => {
    const generatedShortUrl = generateHash()
    loading.value = false
    data.hash = generatedShortUrl
    data.tinyrl = `${window.location.origin}/${generatedShortUrl}`
    localStorage.setItem(
      "historicalUrls",
      JSON.stringify([...historicalUrls.value, data])
    )
    return generatedShortUrl
  }, 2000)
}

const generateHash = () => (Math.random() + 1).toString(36).substring(7)

const historicalUrls = computed(() => {
  const urls = localStorage.getItem("historicalUrls")
  return urls ? urls : []
})
</script>

<template>
  <div class="wrapper">
    <div class="container">
      {{ loading ? "Loading..." : "" }}
      <div class="row flex justify-content-center">
        <div class="col-lg-8">
          <input
            v-model="data.givenUrl"
            type="text"
            class="create block"
            placeholder="Enter a URL to tinify"
          />
        </div>
        <div class="mr-3"></div>
        <div class="col-lg-2">
          <button
            @click="() => saveHash(data.givenUrl)"
            class="block blue create-button"
          >
            Tinify
          </button>
        </div>
      </div>
      <div class="row flex justify-content-center">
        <div class="card">
          <div class="card-body">
            <!-- get from local storage -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
input {
  height: 60px;
  border-radius: 1rem;
}
button {
  height: 60px;
  border-radius: 1rem;
}
</style>
