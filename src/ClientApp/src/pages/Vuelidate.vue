<template>
  <div>
    <h4>Validation Sample</h4>
    <hr class="mb-5" />
    <div v-if="message" class="alert alert-success" role="alert">
      {{ message }}
    </div>
    <div v-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>
    <div>
      <VuelidateFullInput :v="v$.name"></VuelidateFullInput>
    </div>

    <div>
      <label>Age: </label>
      <div>
        <VuelidateInput type="number" :v="v$.age"></VuelidateInput>
        <VuelidateMessages :v="v$.age"></VuelidateMessages>
      </div>
    </div>

    <div>
      <label>Email: </label>
      <div>
        <VuelidateInput :v="v$.emailAddress"></VuelidateInput>
        <VuelidateMessages :v="v$.emailAddress"></VuelidateMessages>
      </div>
    </div>

    <button class="mr-1 btn btn-primary" @click="onSubmit">
      Save
    </button>
  </div>
  <pre>{{ v$.age }}</pre>
</template>

<script setup lang="ts">
import axios from 'axios'
import { useVuelidate } from '@vuelidate/core'
import { email, between, integer, required } from '@vuelidate/validators'

import type { Person } from '~/models/Person'

const message = ref('')
const error = ref('')
const model = reactive({ name: 'Isadora Jarr', age: 39, emailAddress: 'im@nymous.com' } as Person)

const rules = {
  name: { required },
  age: { required, integer, between: between(0, 150) },
  emailAddress: { required, email }
}
const $externalResults = ref({})

const v$ = useVuelidate(rules, model, { $externalResults, $autoDirty: true })

const onSubmit = async() => {
  message.value = ''
  error.value = ''
  const isFormCorrect = await v$.value.$validate()
  if (!isFormCorrect) return
  try {
    const response = await axios.post('api/person', model)
    message.value = response.data.successMessage
  }
  catch (ex: any) {
    error.value = ex.response.data.errorMessage

    $externalResults.value = ex.response.data.validationErrors

    // actions.setErrors(ex.response.data.validationErrors)
    const x = document.getElementsByName(Object.keys(ex.response.data.validationErrors)[0])[0]
    x.focus()
  }
}
</script>

<style lang="postcss">
.is-invalid {
  @apply border-red-300;
}
</style>
