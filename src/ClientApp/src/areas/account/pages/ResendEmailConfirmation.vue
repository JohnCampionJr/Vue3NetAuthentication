<template>
  <h1>Resend Email Confirmation</h1>
  <TwCard title="Please enter your details" class="max-w-lg mt-8">
    <div class="grid grid-cols-1 gap-6">
      <form @submit.prevent="onSubmit">
        <TwFormGroup label="Email address">
          <VuelidateInput v-focus :v="v$.email"></VuelidateInput>
          <VuelidateMessages :v="v$.email"></VuelidateMessages>
        </TwFormGroup>
        <button type="submit" class="mt-4 btn">
          Resend
        </button>
      </form>
    </div>
  </TwCard>
</template>

<script setup lang="ts">
import axios from 'axios'
import { ref, reactive } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { email, required } from '@vuelidate/validators'

const message = ref('')
const error = ref('')
const model = reactive({ email: '' })

const rules = {
  email: { required, email }
}
const $externalResults = ref({})

const v$ = useVuelidate(rules, model, { $externalResults, $autoDirty: true })

const onSubmit = async() => {
  const isFormValid = await v$.value.$validate()
  if (!isFormValid) return

  message.value = ''
  error.value = ''
  try {
    const response = await axios.post('/api/account/resendemailconfirmation', model)
    message.value = response.data.message
  }
  catch (ex: any) {
    error.value = ex.response.data.message
    $externalResults.value = ex.response.data.validationErrors
    const x = document.getElementsByName(Object.keys(ex.response.data.validationErrors)[0])[0]
    if (x) x.focus()
  }
}
</script>
