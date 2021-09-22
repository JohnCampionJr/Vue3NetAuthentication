<template>
  <label>{{ _.startCase(props.v.$path) }}: </label>
  <div>
    <VuelidateInput :v="props.v"></VuelidateInput>
    <VuelidateMessages :v="props.v"></VuelidateMessages>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash'

const props = defineProps({
  v: {
    type: Object,
    required: true
  }
})
</script>
