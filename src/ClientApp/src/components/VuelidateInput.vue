<template>
  <input
    v-model="props.v.$model"
    :name="props.v.$path"
    type="text"
    class="form-control block w-full mt-1"
    :class="{ 'is-invalid': props.v.$invalid }"
  >
</template>

<script setup lang="ts">

const props = defineProps({
  v: {
    type: Object,
    required: true
  }
})
</script>
