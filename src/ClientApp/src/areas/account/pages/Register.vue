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
import { useVuelidate } from '@vuelidate/core'
import { email, required, minLength, sameAs, helpers } from '@vuelidate/validators'
import axios from 'axios'
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const message = ref('')
const error = ref('')
const model = reactive({ email: '', password: '', confirmPassword: '', returnUrl: '' })

const matchPassword = helpers.withMessage('Password must contain one uppercase, one number and one special case character', helpers.regex(/^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/))

const rules = {
  email: { required, email },
  password: { required, minLength: minLength(8), matchPassword },
  confirmPassword: { required, sameAs: sameAs(computed(() => model.password)) }
}
const $externalResults = ref({})

const v$ = useVuelidate(rules, model, { $externalResults, $autoDirty: true })

const onSubmit = async() => {
  message.value = ''
  error.value = ''
  model.returnUrl = route.query.returnUrl as string
  const isFormCorrect = await v$.value.$validate()
  if (!isFormCorrect) return

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
