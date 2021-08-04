<template>
  <div>
    <p class="my-3">
      Current count:
      <strong>{{ counter.count }}</strong>
    </p>
    <button class="mr-2 btn btn-primary" @click.prevent="increment">Increment</button>
    <button class="btn btn-secondary" @click.prevent="reset">Reset</button>
  </div>
</template>

<script setup lang="ts">
import { useCounterStore } from '~/stores/counter'

const counter = useCounterStore()

const increment = (): void => {
  counter.count++
}

const reset = (): void => {
  counter.reset()
}
</script>
