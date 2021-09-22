<template>
  <h2>Change Password</h2>
  <TwAlertSuccess v-if="message">
    {{ message }}
  </TwAlertSuccess>
  <TwAlertDanger v-if="error">
    {{ error }}
  </TwAlertDanger>

  <TwCard class="max-w-lg mt-8">
    <div class="grid grid-cols-1 gap-6">
      <form @submit.prevent="onSubmit">
        <TwFormGroup label="Old Password">
          <VuelidateInput type="password" :v="v$.oldPassword"></VuelidateInput>
          <VuelidateMessages :v="v$.oldPassword"></VuelidateMessages>
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
          Update Password
        </button>
      </form>
    </div>
  </TwCard>
</template>

<script setup lang="ts">
import axios from 'axios'
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, sameAs } from '@vuelidate/validators'
import { ref, reactive } from 'vue'
import { passwordRules } from '../../models'

const message = ref('')
const error = ref('')
const model = reactive({ oldPassword: '', password: '', confirmPassword: '' })

const rules = computed(() => {
  return {
    oldPassword: { required, minLength: minLength(8) },
    password: passwordRules,
    confirmPassword: { required, sameAs: sameAs(model.password) }
  }
})

const $externalResults = ref({})

const v$ = useVuelidate(rules, model, { $externalResults, $autoDirty: true })

const onSubmit = async() => {
  const isFormValid = await v$.value.$validate()
  if (!isFormValid) return

  message.value = ''
  error.value = ''
  try {
    const response = await axios.post('/api/account/manage/changepassword', model)
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
