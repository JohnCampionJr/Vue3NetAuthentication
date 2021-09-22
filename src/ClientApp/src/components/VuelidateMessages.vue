<template>
  <div v-for="error of props.v.$errors" :key="error.$uid" class="input-errors">
    <div class="invalid-feedback">
      {{ error.$message }}
    </div>
  </div>
</template>

<script setup lang="ts">

const props = defineProps({
  v: {
    type: Object,
    required: true
  }
})
</script>
