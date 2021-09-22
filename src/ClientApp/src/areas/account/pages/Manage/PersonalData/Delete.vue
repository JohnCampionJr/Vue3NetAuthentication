<template>
  <h2>Delete Personal Data</h2>
  <TwAlertSuccess v-if="message">
    {{ message }}
  </TwAlertSuccess>
  <TwAlertDanger v-if="error">
    {{ error }}
  </TwAlertDanger>

  <div class="alert alert-warning" role="alert">
    <p>
      <strong>Deleting this data will permanently remove your account, and this cannot be recovered.</strong>
    </p>
  </div>

  <div class="row">
    <div class="col-md-6">
      <form @submit.prevent="onSubmit">
        <TwFormGroup label="Password">
          <VuelidateInput v-focus type="password" :v="v$.password"></VuelidateInput>
          <VuelidateMessages :v="v$.password"></VuelidateMessages>
        </TwFormGroup>
        <button class="mt-4 bg-red-400 btn" type="submit">
          Delete data and close my account
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useVuelidate } from '@vuelidate/core'
import { required, minLength } from '@vuelidate/validators'

const router = useRouter()
const message = ref('')
const error = ref('')
const model = reactive({ password: '' })

const rules = {
  password: { required, minLength: minLength(8) }
}
const $externalResults = ref({})

const v$ = useVuelidate(rules, model, { $externalResults, $autoDirty: true })

const onSubmit = async() => {
  const isFormValid = await v$.value.$validate()
  if (!isFormValid) return

  message.value = ''
  error.value = ''
  try {
    await axios.post('/api/account/manage/deletepersonaldata', model)
    router.push('/account/logout')
  }
  catch (ex: any) {
    error.value = ex.response.message
    $externalResults.value = ex.response.data.validationErrors
    const x = document.getElementsByName(Object.keys(ex.response.data.validationErrors)[0])[0]
    if (x) x.focus()
  }
}
</script>
