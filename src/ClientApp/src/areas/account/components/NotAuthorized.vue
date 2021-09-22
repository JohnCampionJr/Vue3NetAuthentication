<template>
  <template v-if="!isAuthorized">
    <slot></slot>
  </template>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()

const isAuthorized = computed(() => authStore.isAuthenticated)
</script>
