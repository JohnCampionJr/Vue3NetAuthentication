<template>
  <h1>Reset Password</h1>
  <TwAlertSuccess v-if="message">
    {{ message }}
  </TwAlertSuccess>
  <TwAlertDanger v-if="error">
    {{ error }}
  </TwAlertDanger>

  <TwCard title="Please enter your details" class="max-w-lg mt-8">
    <div class="grid grid-cols-1 gap-6">
      <form @submit.prevent="onSubmit">
        <TwFormGroup label="New Password">
          <VuelidateInput type="password" :v="v$.password"></VuelidateInput>
          <VuelidateMessages :v="v$.password"></VuelidateMessages>
        </TwFormGroup>
        <TwFormGroup label="Confirm Password">
          <VuelidateInput type="password" :v="v$.confirmPassword"></VuelidateInput>
          <VuelidateMessages :v="v$.confirmPassword"></VuelidateMessages>
        </TwFormGroup>
        <button type="submit" class="mt-4 btn">
          Submit
        </button>
      </form>
    </div>
  </TwCard>
</template>

<script setup lang="ts">
import axios from 'axios'
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useVuelidate } from '@vuelidate/core'
import { required, sameAs } from '@vuelidate/validators'
import { passwordRules } from '../models'
import type { IResetPasswordCommand } from '../models'

const router = useRouter()
const route = useRoute()
const message = ref('')
const error = ref('')
const model: IResetPasswordCommand = reactive({} as IResetPasswordCommand)

const rules = computed(() => {
  return {
    password: passwordRules,
    confirmPassword: { required, sameAs: sameAs(model.password) }
  }
})

const $externalResults = ref({})

const v$ = useVuelidate(rules, model, { $externalResults, $autoDirty: true })

onMounted(() => {
  const email = route.query.email
  const code = route.query.code

  if (!email || !code) router.push('/')

  model.email = email as string
  model.code = code as string
})

const onSubmit = async() => {
  const isFormValid = await v$.value.$validate()
  if (!isFormValid) return

  message.value = ''
  error.value = ''
  try {
    await axios.post('/api/account/resetpassword', model)
    router.push('/Account/ResetPasswordConfirmation')
  }
  catch (ex: any) {
    error.value = ex.response.data.message
    $externalResults.value = ex.response.data.validationErrors
    const x = document.getElementsByName(Object.keys(ex.response.data.validationErrors)[0])[0]
    if (x) x.focus()
  }
}
</script>
