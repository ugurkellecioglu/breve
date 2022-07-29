<template>
  <div class="row flex justify-content-center mt-2">
    <div class="col-lg-9 col-12">
      <input
        v-model="url"
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
              ? $emit('saveDynamically', givenUrl)
              : $emit('saveHash', givenUrl)
        "
        class="block blue create-button minik-button mt-2 mt-lg-0"
      >
        {{ loading ? "Miniking..." : "Minik" }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"

const props = defineProps<{
  givenUrl: string
  loading: boolean
  isCustomizeTrue: boolean
}>()
const emit = defineEmits(["update:givenUrl", "saveDynamically", "saveHash"])

const url = computed({
  get() {
    return props.givenUrl
  },
  set(value) {
    emit("update:givenUrl", value)
  },
})
</script>

<style lang="scss" scoped>
.minik-button {
  border-radius: 1rem;
  transition: all 0.3s ease-in-out;
  &:hover {
    background-color: #00bcd4 !important;
    color: #fff;
  }
}
</style>
