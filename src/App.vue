<script setup lang="ts">
import { computed, reactive, Ref, ref } from "vue"

interface IData {
  givenUrl: String
  hash: String
  tinyrl: String
}

const data: IData = reactive({
  givenUrl: "",
  hash: "",
  tinyrl: "",
})
const loading: Ref<boolean> = ref(false)

const saveHash = (url: String) => {
  loading.value = true
  setTimeout(() => {
    const generatedShortUrl = generateHash.value
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

const generateHash = computed<String>(() =>
  (Math.random() + 1).toString(36).substring(7)
)
const historicalUrls = computed<any>(() => {
  const urls = localStorage.getItem("historicalUrls")
  return urls ? JSON.parse(urls) : []
})

const copyToClipboard = (url: string) => {
  const el = document.createElement("textarea")
  el.value = url
  document.body.appendChild(el)
  el.select()
  document.execCommand("copy")
  document.body.removeChild(el)
}
const copy = (historicalUrl: IData) => {
  copyToClipboard(historicalUrl.tinyrl.toString())
  const btn = copyBtns.value[historicalUrl.hash.toString()]
  btn.classList.add("success")
  btn.innerText = "Copied!"
  setTimeout(() => {
    btn.classList.remove("success")
    btn.innerText = "Copy"
  }, 2000)
}
const copyBtns = ref<any>({})
</script>

<template>
  <div class="wrapper">
    <div class="container">
      {{ loading ? "Loading..." : "" }}
      <div class="row flex justify-content-center">
        <div class="col-lg-9 col-12">
          <input
            v-model="data.givenUrl"
            type="text"
            class="create block"
            placeholder="Enter a URL to tinify"
          />
        </div>
        <div class="col-lg-1"></div>
        <div class="col-lg-2 col-12 mt-2">
          <button
            @click="() => saveHash(data.givenUrl)"
            class="block blue create-button tinify-button"
          >
            Tinify
          </button>
        </div>
      </div>
      <div class="row flex justify-content-center">
        <div class="card col-12 mt-3 border-radius-1 p-2">
          <!-- get from local storage -->
          <div
            class="row flex justify-content-center align-items-center mt-2 p-2"
            v-for="historicalUrl in historicalUrls"
            :key="historicalUrl.hash"
          >
            <div class="col-lg-6 col-md-12 flex justify-content-start">
              <p>{{ historicalUrl.givenUrl }}</p>
            </div>
            <div class="col-lg-6 col-md-12">
              <div class="row flex align-items-center">
                <div class="col-lg-9 col-md-12 col-12">
                  <p class="text-right mr-4">
                    <a
                      class="link"
                      :href="historicalUrl.tinyrl"
                      target="_blank"
                      >{{ historicalUrl.tinyrl }}</a
                    >
                  </p>
                </div>
                <div class="col-lg-3 col-md-12 col-12">
                  <button
                    v-on:click="() => copy(historicalUrl)"
                    class="light text-dark block create-button copy-btn"
                    :ref="(el) => (copyBtns[historicalUrl.hash] = el)"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
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
.tinify-button {
  height: 60px;
  border-radius: 1rem;
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

.success {
  background-color: #4caf50 !important;
  color: #fff !important;
}
</style>
