<template>
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
              <img src="/quote.svg" class="quote-img" />
              <p>
                {{ quote.content }} <br />
                <span>{{ quote.author }}</span>
              </p>
            </blockquote>
          </div>
          <small>
            <a class="link" href="https://quotable.io"> Quotable.io </a>
          </small>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from "vue"
import { GetRandomQuote } from "../services/QuoteService"

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

<style scoped lang="scss">
.blockquote {
  padding: 60px 80px 40px;
  position: relative;
  & > p {
    font-family: "Times New Roman";
    font-size: 35px;
    font-weight: 700px;
    text-align: center;
  }
  & span {
    font-family: "Times New Roman";
    font-size: 20px;
    text-align: center;
  }
  &::after {
    content: "";
    top: 20px;
    left: 50%;
    margin-left: -100px;
    position: absolute;
    border-bottom: 3px solid #bf0024;
    height: 3px;
    width: 200px;
  }
  & > .quote-img {
    width: 100px;
    position: absolute;
    top: 20px;
    left: 70px;
  }
  @media (max-width: 768px) {
    padding: 0;
    &::after {
      top: -5px;
    }
    & > .quote-img {
      display: none;
    }
  }
}
</style>
