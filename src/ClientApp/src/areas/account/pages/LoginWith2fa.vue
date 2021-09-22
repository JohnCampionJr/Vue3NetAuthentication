<template>
  <h1>Two-factor authentication</h1>

  <p>Your login is protected with an authenticator app. Enter your authenticator code below.</p>

  <TwAlertSuccess v-if="message">
    {{ message }}
  </TwAlertSuccess>
  <TwAlertDanger v-if="error">
    {{ error }}
  </TwAlertDanger>

  <TwCard title="Please enter your details" class="max-w-lg mt-8">
    <div class="grid grid-cols-1 gap-6">
      <form @submit.prevent="onSubmit">
        <TwFormGroup label="Verification Code">
          <VuelidateInput v-focus :v="v$.twoFactorCode"></VuelidateInput>
          <VuelidateMessages :v="v$.twoFactorCode"></VuelidateMessages>
        </TwFormGroup>
        <div class="block">
          <div class="mt-2">
            <div>
              <label class="inline-flex items-center">
                <input id="rememberMachine" v-model="model.rememberMachine" type="checkbox" />
                <span class="ml-2">Remember this machine</span>
              </label>
            </div>
          </div>
        </div>

        <button type="submit" class="mt-4 btn">
          Submit
        </button>
      </form>
    </div>
  </TwCard>
  <p>
    Don't have access to your authenticator device? You can
    <router-link
      :to="{ path: '/account/LoginWithRecoveryCode', query: { returnUrl: returnUrl } }"
    >
      log in with a recovery code
    </router-link>.
  </p>
</template>

<script setup lang="ts">
import axios from 'axios'
import { ref, reactive, onBeforeMount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, maxLength } from '@vuelidate/validators'
import type { ILoginResult } from '../models'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()

const router = useRouter()
const route = useRoute()
const message = ref('')
const error = ref('')
const returnUrl = ref('')
const model = reactive({ twoFactorCode: '', rememberMachine: false })

const rules = {
  twoFactorCode: { required, min: minLength(6), max: maxLength(7) }
}

const $externalResults = ref({})

const v$ = useVuelidate(rules, model, { $externalResults, $autoDirty: true })

onBeforeMount(async() => {
  returnUrl.value = route.query.returnUrl as string
  try {
    await axios.post('/api/account/checkmfa', {})
  }
  catch (ex) {
    router.push({ path: '/account/login', query: { returnUrl: returnUrl.value } })
  }
})

const onSubmit = async() => {
  const isFormValid = await v$.value.$validate()
  if (!isFormValid) return

  message.value = ''
  error.value = ''
  try {
    const response = await axios.post<ILoginResult>('/api/account/loginmfa', model)
    const result = response.data

    if (result.isSuccessful) {
      authStore.login(result.token)
      if (returnUrl.value) router.push(returnUrl.value)
      else router.push('/')
    }
  }
  catch (ex: any) {
    error.value = ex.response.data.message
    $externalResults.value = ex.response.data.validationErrors
    const x = document.getElementsByName(Object.keys(ex.response.data.validationErrors)[0])[0]
    if (x) x.focus()
  }
}
</script>
