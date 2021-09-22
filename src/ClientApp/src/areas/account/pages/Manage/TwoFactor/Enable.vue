<template>
  <h2>Enable multi-factor authentication (MFA)</h2>

  <TwAlertSuccess v-if="message">
    {{ message }}
  </TwAlertSuccess>
  <TwAlertDanger v-if="error">
    {{ error }}
  </TwAlertDanger>

  <div v-if="model.qrCodeBase64">
    <p>To use an authenticator app go through the following steps:</p>
    <ol class="list">
      <li>
        <p>
          Download a two-factor authenticator app like Microsoft Authenticator for
          <a href="https://go.microsoft.com/fwlink/?Linkid=825072">Android</a> and
          <a href="https://go.microsoft.com/fwlink/?Linkid=825073">iOS</a> or Google Authenticator for
          <a
            href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&amp;hl=en"
          >Android</a>
          and
          <a href="https://itunes.apple.com/us/app/google-authenticator/id388497605?mt=8">iOS</a>.
        </p>
      </li>
      <li>
        <p>
          Scan the QR Code or enter this key <kbd>{{ model.sharedKey }}</kbd> into your two factor authenticator app.
          Spaces and casing do not matter.
        </p>
        <img :src="'data:image/png;base64,' + model.qrCodeBase64" />
      </li>
      <li>
        <p>
          Once you have scanned the QR code or input the key above, your two factor authentication app will provide you
          with a unique code. Enter the code in the confirmation box below.
        </p>
        <div class="row">
          <div class="col-md-6">
            <form @submit.prevent="onSubmit">
              <TwFormGroup label="Verification Code">
                <VuelidateInput v-focus :v="v$.verificationCode"></VuelidateInput>
                <VuelidateMessages :v="v$.verificationCode"></VuelidateMessages>
              </TwFormGroup>
              <button type="submit" class="mt-4 btn">
                Verify
              </button>
            </form>
          </div>
        </div>
      </li>
    </ol>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import { ref, reactive, onBeforeMount } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, maxLength } from '@vuelidate/validators'
import type { IMfaEnableResult } from '../../../models'

const message = ref('')
const error = ref('')
const model = reactive({} as IMfaEnableResult)
const codeModel = reactive({ verificationCode: '' })

const rules = {
  verificationCode: { required, min: minLength(6), max: maxLength(7) }
}

const $externalResults = ref({})

const v$ = useVuelidate(rules, codeModel, { $externalResults, $autoDirty: true })

onBeforeMount(async() => {
  try {
    const response = await axios.get<IMfaEnableResult>('/api/account/manage/mfaenable')
    Object.assign(model, response.data)
  }
  catch (ex: any) {
    error.value = ex.message
  }
})

const onSubmit = async() => {
  const isFormValid = await v$.value.$validate()
  if (!isFormValid) return

  message.value = ''
  error.value = ''
  try {
    const response = await axios.post('/api/account/manage/mfaenable', {
      verificationCode: codeModel.verificationCode
    })
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
