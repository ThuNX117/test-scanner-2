<script lang="ts" setup>
import { ref } from 'vue';

import type { DetectedBarcode } from 'barcode-detector/pure';
import { QrcodeStream } from 'vue-qrcode-reader';

const code = ref("-");

  const turn = ref(0);
  const onDetect = (detectedCodes: DetectedBarcode[]) => {
    console.log({ detectedCodes });
    if (detectedCodes[0]) {
      code.value = detectedCodes[0].rawValue;
      turn.value = turn.value + 1;
    }
  };
  const videoConstraints = {
    width: 500,
    height: 300,
  };
</script>
<template>
  <div>
    <h1>vue-qrcode-reader</h1>
    <p>scan Num:{{ turn }}</p>
    <p>Code: {{ code }}</p>
    <qrcode-stream
      @detect="onDetect"
      :constraints="videoConstraints"
      :formats="['ean_13']"
    ></qrcode-stream>
  </div>
  <!-- {{ status }} -->
</template>
