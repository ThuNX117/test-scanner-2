<script lang="ts" setup>
  import { onMounted, ref } from "vue";

  import BarCodeScanner from "../barcode/BarCodeScanner.vue";
  import HTML5QRCODE from "../barcode/HTML5QRCODE.vue";

  const scannerName = ref("BarCodeScanner");
  const bothRun = ref(false);
  const toggle = () => {
    if (scannerName.value === "BarCodeScanner") {
      scannerName.value = "HTML5QRCODE";
    } else {
      scannerName.value = "BarCodeScanner";
    }
  };
  const devices = ref<MediaDeviceInfo[]>([]);
  const getCameraList = () => {
    navigator.mediaDevices.enumerateDevices().then((_devices: MediaDeviceInfo[]) => {
      devices.value = _devices.filter((item) => item.kind === "videoinput");
    });
  };
  onMounted(() => {
    getCameraList();
  });
</script>
<template>
  <div class="flex flex-row">
    <p v-for="item in devices" :key="item.deviceId">
      [{{ item.kind }}]-[{{ item.deviceId }}]
    </p>
    <button @click="toggle">Toogle to {{ scannerName }}</button>
    <button @click="bothRun = !bothRun">bothRun</button>
    <template v-if="scannerName === 'HTML5QRCODE' || bothRun">
      <BarCodeScanner />
    </template>
    <template v-if="scannerName === 'BarCodeScanner' || bothRun">
      <HTML5QRCODE />
    </template>
  </div>
</template>
<style>
  .demo-tabs > .el-tabs__content {
    padding: 32px;
    color: #6b778c;
    font-size: 32px;
    font-weight: 600;
  }
</style>
