<script setup lang="ts">
  import { defineProps, onBeforeUnmount, onMounted, ref } from "vue";

  import { Html5Qrcode } from "html5-qrcode";

  let html5QrCode: Html5Qrcode | null = null;
  const turn = ref(0);
  const code = ref("");
  const props = defineProps<{ cameraId: string }>();
  const onScanSuccess = (decodedText: string) => {
    code.value = decodedText;
    turn.value = turn.value + 1;
  };

  // const html5QrCode = ref<Html5Qrcode>();
  async function startScan() {
    if (html5QrCode === null) {
      alert("html5QrCode null");
      return;
    }
    console.log("cameraId", props.cameraId);

    const config = {
      fps: 10,
    };
    html5QrCode?.start({ deviceId: props.cameraId }, config, onScanSuccess, () => {});
  }
  onMounted(() => {
    html5QrCode = new Html5Qrcode("reader");
    console.log("onMounted", props.cameraId);
    startScan();
  });

  onBeforeUnmount(() => {
    if (html5QrCode === null) {
      return;
    }
    html5QrCode?.stop();
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
