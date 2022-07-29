<template>
  <div class="row flex mt-2 align-items-center">
    <div class="col-lg-5">
      <input
        :checked="isCustomizeTrue"
        @change="$emit('update:isCustomizeTrue', $event!.target!.checked)"
        type="checkbox"
        id="customize"
      />
      <label for="customize" class="ml-2">Customize for free!</label>
    </div>
    <div v-if="isCustomizeTrue" class="col-12 col-lg-7">
      <input
        @input="$emit('update:dynamicHash', $event!.target!.value)"
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
// https://vuejs.org/guide/components/events.html#usage-with-v-model
defineProps<{
  isCustomizeTrue: boolean
  dynamicHash: string
  dynamicUrl: string
}>()
defineEmits(["update:isCustomizeTrue", "update:dynamicHash"])
</script>

<style lang="scss" scoped></style>
