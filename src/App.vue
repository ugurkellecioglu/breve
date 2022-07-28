<script setup lang="ts">
import { ref } from "vue"

const url = ref("")
const loading = ref(false)
const shortenUrl = (url) => {
  loading.value = true
  setTimeout(() => {
    const generatedShortUrl = generateShortUrl()
    loading.value = false
    return generatedShortUrl
  }, 2000)
}

const generateShortUrl = () => (Math.random() + 1).toString(36).substring(7)
</script>

<template>
  <div class="wrapper">
    <div class="container">
      {{ loading ? "Loading..." : "" }}
      <div class="row flex justify-content-center">
        <div class="col-lg-8">
          <input
            v-model="url"
            type="text"
            class="create block"
            placeholder="Enter a URL to shorten"
          />
        </div>
        <div class="col-lg-4">
          <button
            @click="() => shortenUrl(url)"
            class="block green create-button"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
