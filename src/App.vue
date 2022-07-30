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
import ShortenUrl from "./components/ShortenUrl.vue"
import Hero from "./components/Hero.vue"
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
  dynamicUrl.value = ""
  isCustomizeTrue.value = false
}
const loading: Ref<boolean> = ref(false)

const saveHash = async (url: string) => {
  const hash = generateHash()
  data.hash = hash
  data.breveUrl = `${getHost.value}/v/${hash}`
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
    dynamicUrl.value = ""
  }
})

const dynamicHash = ref<string>("")
const dynamicUrl = ref<string>("")
watch(dynamicHash, (newValue) => {
  dynamicUrl.value = `${window.location.origin}/v/${newValue}`
})

const saveDynamically = async (url: string) => {
  const newHash = `${dynamicHash.value}`
  const newUrlData = {
    givenUrl: url,
    hash: newHash,
    breveUrl: `${getHost.value}/v/${newHash}`,
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
const getHost = computed(() => {
  const host = window.location.host
  return host.startsWith("www.") ? host.substring(4) : host
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
      <Hero />
      <!-- Minik section -->
      <ShortenUrl
        v-model:given-url="data.givenUrl"
        :loading="loading"
        :is-customize-true="isCustomizeTrue"
        @save-dynamically="saveDynamically"
        @save-hash="saveHash"
      />
      <!-- ask customize  -->
      <Customize
        v-model:is-customize-true="isCustomizeTrue"
        v-model:dynamic-hash="dynamicHash"
        v-model:dynamic-url="dynamicUrl"
      />
      <!-- successful minik -->
      <SuccessfulRecord v-model:successful-save="successfulSave" />

      <!-- old records -->
      <RecordList :historical-urls="historicalUrls" :error="error" />
      <!-- random quote -->
      <Quote />
      <!-- footer -->
      <Footer />
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
