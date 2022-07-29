<script setup lang="ts">
import { computed, onMounted, reactive, Ref, ref, watch } from "vue"
import { SaveUrl } from "./services/UrlService.js"
import { GetRandomQuote } from "./services/QuoteService.js"
import Record from "./components/Record.vue"
import Quote from "./components/Quote.vue"
import Footer from "./components/Footer.vue"
import RecordList from "./components/RecordList.vue"
import SuccessfulRecord from "./components/SuccessfulRecord.vue"
import Customize from "./components/Customize.vue"
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
      <Customize v-model:isCustomizeTrue="isCustomizeTrue" />
      <!-- successful minik -->
      <SuccessfulRecord :successful-save="successfulSave" />

      <!-- old records -->
      <RecordList :historical-urls="historicalUrls" :error="error" />
      <!-- random quote -->
      <Quote />
      <!-- footer -->
      <Footer />
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
