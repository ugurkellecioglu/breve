<template>
  <div class="row flex mt-2 align-items-center">
    <div class="col-lg-5">
      <input v-model="checkbox" type="checkbox" id="customize" />
      <label for="customize" class="ml-2">Customize for free!</label>
    </div>
    <div v-if="isCustomizeTrue" class="col-12 col-lg-7">
      <input
        v-model="url"
        type="text"
        class="create block pb-2"
        placeholder="Enter a word to make the url minik"
      />
    </div>
    <div class="flex justify-content-end w-100 mt-1">
      <small class="text-right" v-if="dynamicHash && dynamicHash.length > 0"
        >Your URL will be <a class="link" href="#">{{ dynamicUrl }}</a></small
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"

// https://vuejs.org/guide/components/events.html#usage-with-v-model
const props = defineProps<{
  isCustomizeTrue: boolean
  dynamicHash: string
  dynamicUrl: string
}>()
const emit = defineEmits(["update:isCustomizeTrue", "update:dynamicHash"])

const url = computed({
  get() {
    return props.dynamicHash
  },
  set(value) {
    emit("update:dynamicHash", value)
  },
})

const checkbox = computed({
  get() {
    return props.isCustomizeTrue
  },
  set(value) {
    emit("update:isCustomizeTrue", value)
  },
})
</script>

<style lang="scss" scoped></style>
