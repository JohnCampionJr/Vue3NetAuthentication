<template>
  <h1>Login</h1>

  <TwAlertSuccess v-if="message">
    {{ message }}
  </TwAlertSuccess>
  <TwAlertDanger v-if="error">
    {{ error }}
  </TwAlertDanger>

  <TwCard title="Please enter your details" class="max-w-lg mt-8">
    <div class="grid grid-cols-1 gap-6">
      <form @submit.prevent="onSubmit">
        <TwFormGroup label="Email address">
          <VuelidateInput v-focus :v="v$.email"></VuelidateInput>
          <VuelidateMessages :v="v$.email"></VuelidateMessages>
        </TwFormGroup>
        <TwFormGroup label="Password">
          <VuelidateInput type="password" :v="v$.password"></VuelidateInput>
          <VuelidateMessages :v="v$.password"></VuelidateMessages>
        </TwFormGroup>
        <button type="submit" class="mt-4 btn">
          Submit
        </button>
      </form>
    </div>
  </TwCard>

  <pre> {{ v$.password }} </pre>

  <div class="form-group">
    <p>
      <router-link to="/Account/ForgotPassword">
        Forgot your password?
      </router-link>
    </p>
    <p>
      <router-link to="/Account/Register">
        Register as a new user
      </router-link>
    </p>
    <p>
      <router-link to="/Account/ResendEmailConfirmation">
        Resend email confirmation
      </router-link>
    </p>
  </div>
</template>

<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core'
import { email, required, minLength } from '@vuelidate/validators'
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'
import { useRouter, useRoute } from 'vue-router'
import type { ILoginCommand, ILoginResult } from '../models'
import authStore from '~/store/authStore'

const router = useRouter()
const route = useRoute()
const message = ref('')
const error = ref('')
const returnUrl = ref('')
const model: ILoginCommand = reactive({} as ILoginCommand)

const rules = {
  email: { required, email },
  password: { required, minLength: minLength(8) }
}
const $externalResults = ref({})

const v$ = useVuelidate(rules, model, { $externalResults, $autoDirty: true })

onMounted(() => {
  returnUrl.value = route.query.returnUrl as string
})

const onSubmit = async() => {
  message.value = ''
  error.value = ''
  const isFormCorrect = await v$.value.$validate()
  if (!isFormCorrect) return

  try {
    const response = await axios.post<ILoginResult>('/api/account/login', model)
    const result = response.data

    authStore.login(result.token)
    if (returnUrl.value) router.push(returnUrl.value)
    else router.push('/')
  }
  catch (ex: any) {
    const result = ex.response.data
    if (result.requiresTwoFactor) {
      router.push({ path: '/account/loginwith2fa', query: { returnUrl: returnUrl.value } })
    }
    else if (result.requiresEmailConfirmation) {
      router.push({
        path: '/account/ResendEmailConfirmation',
        query: { returnUrl: returnUrl.value }
      })
    }
    else if (result.isLockedOut) {
      router.push('/Account/Lockout')
    }
    else {
      error.value = ex.response.data.message
      $externalResults.value = ex.response.data.validationErrors
      // actions.setErrors(ex.response.data.validationErrors)
      const x = document.getElementsByName(Object.keys(ex.response.data.validationErrors)[0])[0]
      if (x) x.focus()
    }
  }
}
</script>
