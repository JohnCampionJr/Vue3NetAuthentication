<template>
  <h2>Profile</h2>
  <TwAlertSuccess v-if="message">
    {{ message }}
  </TwAlertSuccess>
  <TwAlertDanger v-if="error">
    {{ error }}
  </TwAlertDanger>

  <TwCard class="max-w-lg mt-8">
    <div class="grid grid-cols-1 gap-6">
      <form @submit.prevent="onSubmit">
        <TwFormGroup label="User Name">
          <VuelidateInput :v="v$.email" class="block w-full mt-1 bg-gray-200 border-gray-300"></VuelidateInput>
        </TwFormGroup>
        <TwFormGroup label="Phone Number">
          <VuelidateInput v-focus :v="v$.phoneNumber"></VuelidateInput>
          <VuelidateMessages :v="v$.phoneNumber"></VuelidateMessages>
        </TwFormGroup>
        <button type="submit" class="mt-4 btn">
          Save
        </button>
      </form>
    </div>
  </TwCard>
</template>

<script setup lang="ts">
import axios from 'axios'
import { ref, reactive, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { useVuelidate } from '@vuelidate/core'
import { email, required } from '@vuelidate/validators'
import type { IUserProfileCommand } from '../../models'

const router = useRouter()
const message = ref('')
const error = ref('')
const model = reactive({} as IUserProfileCommand)

const rules = {
  email: { required, email },
  phoneNumber: {}
}
const $externalResults = ref({})

const v$ = useVuelidate(rules, model, { $externalResults, $autoDirty: true })

onBeforeMount(async() => {
  try {
    const response = await axios.get<IUserProfileCommand>('/api/account/manage/userprofile')
    Object.assign(model, response.data)
  }
  catch (ex) {
    router.push('/account/login')
  }
})

const onSubmit = async() => {
  const isFormValid = await v$.value.$validate()
  if (!isFormValid) return

  message.value = ''
  error.value = ''
  try {
    await axios.post('/api/account/manage/userprofile', model)
    message.value = 'profile updated'
  }
  catch (ex: any) {
    error.value = ex.response.data.message
    $externalResults.value = ex.response.data.validationErrors
    const x = document.getElementsByName(Object.keys(ex.response.data.validationErrors)[0])[0]
    if (x) x.focus()
  }
}
</script>
