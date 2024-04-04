<script setup lang="ts">
import {
  onBeforeUnmount,
  onMounted,
  ref,
} from 'vue';

import { Html5Qrcode } from 'html5-qrcode';

const elementId = ref("reader");
  const turn = ref(0);
  const code = ref("");
  const cameraId = ref("");
  const onScanSuccess = (decodedText: string) => {
    code.value = decodedText;
    turn.value = turn.value + 1;
  };

  const html5QrCode = ref<Html5Qrcode>();
  async function startScan() {
    console.log("cameraId", cameraId.value);
    html5QrCode.value = new Html5Qrcode(elementId.value);
    const videoConstraints = {};
    const config = {
      fps: 10,
      videoConstraints,
    };
    html5QrCode.value.start(
      { facingMode: { exact: "environment" } },
      config,
      onScanSuccess,
      () => {}
    );
  }
  onMounted(() => {
    console.log("onMounted");
    startScan();
  });

  onBeforeUnmount(() => {
    html5QrCode.value?.stop();
    console.log("stoped ");
  });
</script>
<template>
  <div>
    <h1>HTML5 QRCODE</h1>
    <p>scan Num:{{ turn }}</p>
    <p>Code: {{ code }}</p>
    <div id="reader">123</div>
  </div>
</template>
<style>
  #reader {
    background: gray;
    height: 300px;
    width: 500px;
  }
</style>
