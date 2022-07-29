<script setup lang="ts">
import { computed, onMounted, reactive, Ref, ref, watch } from "vue"
import { SaveUrl } from "./services/UrlService.js"
import { GetRandomQuote } from "./services/QuoteService.js"
import Record from "./components/Record.vue"
import Quote from "./components/Quote.vue"
interface IData {
  givenUrl: string
  hash: string
  breveUrl: string
}

const data: IData = reactive({
  givenUrl: "",
  hash: "",
  breveUrl: "",
})
const resetData = () => {
  data.givenUrl = ""
  data.hash = ""
  data.breveUrl = ""
  dynamicHash.value = ""
  dynamicURL.value = ""
  isCustomizeTrue.value = false
}
const loading: Ref<boolean> = ref(false)

const saveHash = async (url: string) => {
  const hash = generateHash()
  data.hash = hash
  data.breveUrl = `${window.location.origin}/v/${hash}`
  save(data)
}

const generateHash = () => (Math.random() + 1).toString(36).substring(7)

const historicalUrls = reactive({ data: [] as IData[] })

onMounted(async () => {
  historicalUrls.data = [
    ...historicalUrls.data,
    ...JSON.parse(localStorage.getItem("historicalUrls") || "[]"),
  ]
})

// customize
const isCustomizeTrue = ref<boolean>(false)
watch(isCustomizeTrue, (val) => {
  if (!val) {
    dynamicHash.value = ""
    dynamicURL.value = ""
  }
})

const toggleCustomize = () => {
  isCustomizeTrue.value = !isCustomizeTrue.value
}
const dynamicHash = ref<string>("")
const dynamicURL = ref<string>("")
watch(dynamicHash, (newValue) => {
  dynamicURL.value = `${window.location.origin}/v/${newValue}`
})

const saveDynamically = async (url: string) => {
  const newHash = `${dynamicHash.value}`
  const newUrlData = {
    givenUrl: url,
    hash: newHash,
    breveUrl: `${window.location.origin}/v/${newHash}`,
  }
  save(newUrlData)
}
const successfulSave = reactive({
  data: {
    givenUrl: "",
    hash: "",
    breveUrl: "",
  },
})
const save = async (data: IData) => {
  loading.value = true
  SaveUrl(data)
    .then((response: any) => {
      successfulSave.data = response
      historicalUrls.data = [{ ...response }, ...historicalUrls.data]
    })
    .catch((err: any) => {
      error.value = err
    })
    .finally(() => {
      loading.value = false
      resetData()
      setTimeout(() => {
        error.value = ""
      }, 1500)
    })
}

const error = ref<string>("")
</script>

<template>
  <div class="wrapper">
    <div class="container">
      <div class="mt-4">
        <div>
          <h1>Minik</h1>
        </div>
        <div>
          <small>Your free URL shortener. <br /></small>
        </div>
      </div>

      <!-- Minik section -->
      <div class="row flex justify-content-center mt-2">
        <div class="col-lg-9 col-12">
          <input
            v-model="data.givenUrl"
            type="text"
            class="create block"
            placeholder="Enter a URL to make it minik"
          />
        </div>
        <div class="col-lg-1"></div>
        <div class="col-lg-2 col-12">
          <button
            @click="
              () =>
                isCustomizeTrue
                  ? saveDynamically(data.givenUrl)
                  : saveHash(data.givenUrl)
            "
            class="block blue create-button minik-button mt-2 mt-lg-0"
          >
            {{ loading ? "Miniking..." : "Minik" }}
          </button>
        </div>
      </div>
      <!-- ask customize  -->
      <div class="row flex mt-2 align-items-center">
        <div class="col-lg-5">
          <input
            :onchange="toggleCustomize"
            :checked="isCustomizeTrue"
            type="checkbox"
            id="customize"
          />
          <label for="customize" class="ml-2">Customize for free!</label>
        </div>
        <div v-if="isCustomizeTrue" class="col-12 col-lg-7">
          <input
            v-model="dynamicHash"
            type="text"
            class="create block pb-2"
            placeholder="Enter a word to make the url minik"
          />
        </div>
        <div class="flex justify-content-end w-100 mt-1">
          <small class="text-right" v-if="dynamicHash.length > 0"
            >Your URL will be
            <a class="link" href="#">{{ dynamicURL }}</a></small
          >
        </div>
      </div>
      <!-- successfull minik -->

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

      <!-- History -->
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

      <Quote />

      <!-- Footer -->
      <div class="row flex justify-content-center mt-2">
        <div class="col-lg-12 col-12">
          <div class="card border-radius-1 p-2">
            <h3 class="p-2">About</h3>
            <div class="row flex justify-content-center align-items-center p-2">
              <div class="col-lg-12 col-md-12 flex">
                <p>
                  Minik is a free URL shortener. It's a simple and easy way to
                  shorten your URLs.<br />Minik is open source and you can find
                  the source code on
                  <a
                    class="link"
                    href="https://github.com/ugurkellecioglu/minik"
                  >
                    GitHub </a
                  >.<br />
                  Minik is a project by
                  <a class="link" href="https://ugurkellecioglu.me">
                    Ugur Kellecioglu
                  </a>
                  and is licensed under the MIT license.
                  <br />
                  Made with ❤️ in Ankara, Turkey.
                </p>
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
  border-radius: 1rem;
}
.minik-button {
  border-radius: 1rem;
  transition: all 0.3s ease-in-out;
  &:hover {
    background-color: #00bcd4 !important;
    color: #fff;
  }
}
</style>
