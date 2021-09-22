<template>
  <template v-if="isAuthorized">
    <slot :userName="userName"></slot>
  </template>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()

const userName = computed(() => authStore.userName)
const isAuthorized = computed(() => authStore.isAuthenticated)
</script>
