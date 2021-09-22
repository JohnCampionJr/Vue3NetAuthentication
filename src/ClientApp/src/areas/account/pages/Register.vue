<template>
  <h1>Register</h1>

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
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useVuelidate } from '@vuelidate/core'
import { email, required, sameAs } from '@vuelidate/validators'
import { passwordRules } from '../models'

const router = useRouter()
const route = useRoute()
const message = ref('')
const error = ref('')
const model = reactive({ email: '', password: '', confirmPassword: '', returnUrl: '' })

/**
 function rules() {
  return {
    email: { required, email },
    password: passwordRules,
    confirmPassword: { required, sameAs: sameAs(model.password) }
  }
}
 */
const rules = {
  email: { required, email },
  password: passwordRules,
  confirmPassword: { required, sameAs: sameAs(computed(() => model.password)) }
}

const $externalResults = ref({})

const v$ = useVuelidate(rules, model, { $externalResults, $autoDirty: true })

const onSubmit = async() => {
  const isFormValid = await v$.value.$validate()
  if (!isFormValid) return

  message.value = ''
  error.value = ''
  model.returnUrl = route.query.returnUrl as string

  try {
    await axios.post('/api/account/register', model)
    router.push('/account/registerconfirmation')
  }
  catch (ex: any) {
    error.value = ex.response.message
    $externalResults.value = ex.response.data.validationErrors
    const x = document.getElementsByName(Object.keys(ex.response.data.validationErrors)[0])[0]
    if (x) x.focus()
  }
}
</script>
