<script lang="ts" setup>
  import { onMounted, ref } from "vue";

  import JsonViewer from "vue-json-viewer";

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
  type trackCapabilityType = MediaDeviceInfo & { track: MediaTrackCapabilities[] };
  const devices = ref<MediaDeviceInfo[]>([]);
  const trackCapability = ref<trackCapabilityType[]>([]);
  const getCameraList = () => {
    navigator.mediaDevices.enumerateDevices().then((_devices: MediaDeviceInfo[]) => {
      console.log(_devices);
      const __devices = _devices.filter((item) => item.kind === "videoinput");
      devices.value = __devices;
      getCapabilities(__devices);
    });
    console.log(devices.value);
  };

  const getCapabilities = (_devices: MediaDeviceInfo[]) => {
    let rs: trackCapabilityType[] = [];
    _devices.forEach(async (device) => {
      let stream = null;

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: device.deviceId,
          },
        });
        let result: MediaTrackCapabilities[] = [];
        stream.getTracks().forEach((track) => {
          result.push(track.getCapabilities());
        });
        rs.push({ ...device, track: result });

        /* use the stream */
      } catch (err) {
        /* handle the error */
      }
    });
    trackCapability.value = rs;
    console.log("trackCapability.value", trackCapability.value);
  };
  onMounted(() => {
    getCameraList();
    // getCapabilities();
  });
</script>
<template>
  <div class="flex flex-row">
    <div>
      {{ trackCapability }}
    </div>
    <button @click="toggle">Toogle to {{ scannerName }}</button>
    <button @click="bothRun = !bothRun">bothRun</button>
    <template v-if="scannerName === 'HTML5QRCODE' || bothRun">
      <BarCodeScanner :camera-id="devices[0].deviceId" />
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
