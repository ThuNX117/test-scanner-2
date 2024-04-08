<script lang="ts" setup>
  import { onMounted, ref } from "vue";

  import { cameraConfig } from "../../composables/cameraConfig";

  // import BarCodeScanner from "../barcode/BarCodeScanner.vue";
  // import HTML5QRCODE from "../barcode/HTML5QRCODE.vue";

  const { trackCapability, getCameraList, getCapabilities, devices } = cameraConfig();
  const scannerName = ref("BarCodeScanner");
  const bothRun = ref(false);
  const toggle = () => {
    if (scannerName.value === "BarCodeScanner") {
      scannerName.value = "HTML5QRCODE";
    } else {
      scannerName.value = "BarCodeScanner";
    }
  };
  const data = ref<string>("");
  const cameraId = ref("");
  onMounted(async () => {
    devices.value = await getCameraList();
    trackCapability.value = await getCapabilities(devices.value);
    cameraId.value = trackCapability.value[0].device.deviceId;
    data.value = JSON.stringify({ data: trackCapability.value });
    console.log(data.value);
    console.log(cameraId);
  });
</script>
<template>
  <div class="flex flex-row">
    <button @click="toggle">Toggle to {{ scannerName }}</button>
    <button @click="bothRun = !bothRun">bothRun</button>
    <p>cameraId: {{ cameraId }}</p>

    <template v-if="cameraId && (scannerName === 'HTML5QRCODE' || bothRun)">
      <BarCodeScanner :camera-id="cameraId" />
    </template>
    <template v-if="cameraId && (scannerName === 'BarCodeScanner' || bothRun)">
      <HTML5QRCODE :camera-id="cameraId" />
    </template>

    <h1>trackCapability</h1>
    <div v-for="item in trackCapability" :key="item.device.deviceId">
      <p>{{ item.device }}</p>
      <small v-for="(cap, index) in item.track" :key="index">
        {{ cap }}
      </small>
    </div>
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
