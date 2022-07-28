<script setup lang="ts">
import { computed, onMounted, reactive, Ref, ref, watch } from "vue"
import { SaveUrl } from "./services/UrlService.js"
import { GetRandomQuote } from "./services/QuoteService.js"
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
const loading: Ref<boolean> = ref(false)

const saveHash = async (url: string) => {
  data.hash = generateHash.value
  data.breveUrl = `${window.location.origin}/${generateHash.value}`
  const response = await SaveUrl(data)
  historicalUrls.data.unshift(response)
  console.log(response)
}

const generateHash = computed<string>(() =>
  (Math.random() + 1).toString(36).substring(7)
)

const historicalUrls = reactive({ data: [] as IData[] })

onMounted(async () => {
  historicalUrls.data = [
    ...historicalUrls.data,
    ...JSON.parse(localStorage.getItem("historicalUrls") || "[]"),
  ]
})

// copy
const copyToClipboard = (url: string) => {
  const el = document.createElement("textarea")
  el.value = url
  document.body.appendChild(el)
  el.select()
  document.execCommand("copy")
  document.body.removeChild(el)
}
const copy = (historicalUrl: IData) => {
  copyToClipboard(historicalUrl.breveUrl)
  const btn = copyBtns.value[historicalUrl.hash]
  btn.classList.add("success")
  btn.innerText = "Copied!"
  setTimeout(() => {
    btn.classList.remove("success")
    btn.innerText = "Copy"
  }, 2000)
}
const copyBtns = ref<any>({})
// copy end

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
  dynamicURL.value = `${window.location.origin}/${newValue}`
})

const saveDynamically = async (url: string) => {
  const newHash = dynamicHash.value
  const newUrl = dynamicURL.value
  const newUrlData = {
    givenUrl: url,
    hash: newHash,
    breveUrl: `${window.location.origin}/${newHash}`,
  }
  const response = await SaveUrl(newUrlData)
  historicalUrls.data.unshift(response)

  console.log(response)
}

// quote
interface IQuote {
  content: string
  author: string
}
const quote: IQuote = reactive({ content: "", author: "" })
onMounted(async () => {
  const data: IQuote = await GetRandomQuote()
  quote.content = data.content
  quote.author = data.author
})
</script>

<template>
  <div class="wrapper">
    <div class="container">
      <div class="mt-4">
        <div>
          <h1>Breve URL</h1>
        </div>
        <div>
          <small>Your free URL shortener. <br /></small>
        </div>
      </div>

      <!-- Breve section -->
      <div class="row flex justify-content-center mt-2">
        <div class="col-lg-9 col-12">
          <input
            v-model="data.givenUrl"
            type="text"
            class="create block"
            placeholder="Enter a URL to tinify"
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
            class="block blue create-button breve-button"
          >
            Breve It
          </button>
        </div>
      </div>
      <!-- ask customize  -->
      <div class="row flex mt-2 align-items-center">
        <input :onchange="toggleCustomize" type="checkbox" id="customize" />
        <label for="customize" class="ml-2">Customize for Free!</label>
        <div v-if="isCustomizeTrue" class="col-6 ml-2">
          <input
            v-model="dynamicHash"
            type="text"
            class="create block pb-2"
            placeholder="Enter a custom word"
          />
          <small v-if="dynamicHash.length > 0"
            >Your URL will be
            <a class="link" href="#">{{ dynamicURL }}</a></small
          >
        </div>
      </div>

      <!-- History -->
      <div class="row flex justify-content-center">
        <div class="card col-12 mt-3 border-radius-1 p-2">
          <!-- get from local storage -->
          <h3 class="p-2">Previous Breves</h3>
          <small class="p-2" v-if="historicalUrls.data.length === 0">
            You don't have any previous breve's
          </small>
          <div
            class="row flex justify-content-center align-items-center mt-2 p-2"
            v-for="historicalUrl in historicalUrls.data"
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
                      :href="historicalUrl.breveUrl"
                      target="_blank"
                      >{{ historicalUrl.breveUrl }}</a
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

      <!-- Quote -->
      <div
        v-if="quote.content.length > 0"
        class="flex row justify-content-center mt-2"
      >
        <div class="col-lg-12 col-12">
          <div class="card border-radius-1 p-2">
            <h3 class="p-2">Random Quote</h3>
            <div
              class="row flex justify-content-center align-items-center mt-2 p-2"
            >
              <div class="col-lg-12 col-md-12 flex justify-content-center">
                <blockquote class="blockquote">
                  <img src="../public/quote.svg" class="quote-img" />
                  <p>
                    {{ quote.content }} <br />
                    <span>{{ quote.author }}</span>
                  </p>
                </blockquote>
              </div>
              <smal>
                <a class="link" href="https://quotable.io"> Quotable.io </a>
              </smal>
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
.breve-button {
  border-radius: 1rem;
  transition: all 0.3s ease-in-out;
  &:hover {
    background-color: #00bcd4 !important;
    color: #fff;
  }
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

.blockquote {
  padding: 60px 80px 40px;
  position: relative;
}
.blockquote p {
  font-family: "Times New Roman";
  font-size: 35px;
  font-weight: 700px;
  text-align: center;
}
.blockquote span {
  font-family: "Times New Roman";
  font-size: 20px;
  font-weight: 700px;
  text-align: center;
}

.blockquote::after {
  content: "";
  top: 20px;
  left: 50%;
  margin-left: -100px;
  position: absolute;
  border-bottom: 3px solid #bf0024;
  height: 3px;
  width: 200px;
}
.quote-img {
  width: 100px;
  position: absolute;
  top: 20px;
  left: 70px;
}
</style>
