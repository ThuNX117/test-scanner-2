<script lang="ts" setup>
  import { computed, ref, watch } from "vue";

  import { QrcodeStream } from "vue-qrcode-reader";

  interface DetectedCode {
    boundingBox: BoundingBox;
    rawValue: string;
    format: string;
    cornerPoints: CornerPoint[];
  }

  interface BoundingBox {
    x: number;
    y: number;
    width: number;
    height: number;
    top: number;
    right: number;
    bottom: number;
    left: number;
  }

  interface CornerPoint {
    x: number;
    y: number;
  }
  const code = ref("-");

  const turn = ref(0);
  const onDetect = (detectedCodes: DetectedCode[]) => {
    console.log({ detectedCodes });
    if (detectedCodes[0]) {
      code.value = detectedCodes[0].rawValue;
      turn.value = turn.value + 1;
    }
  };
  const props = defineProps<{ cameraId?: string }>();
  const videoConstraints = computed<MediaTrackConstraints>(() => ({
    deviceId: props.cameraId,
  }));
  const showQR = ref(false);
  // watch(
  //   () => props.cameraId,
  //   () => {
  //     showQR.value = false;
  //     setTimeout(() => {
  //       showQR.value = true;
  //     }, 500);
  //   }
  // );
  function paintBoundingBox(
    detectedCodes: DetectedCode[],
    ctx: CanvasRenderingContext2D
  ) {
    for (const detectedCode of detectedCodes) {
      const {
        boundingBox: { x, y, width, height },
      } = detectedCode;

      ctx.lineWidth = 2;
      ctx.strokeStyle = "#007bff";
      ctx.strokeRect(x, y, width, height);
    }
  }
</script>
<template>
  <div>
    <h1>vue-qrcode-reader</h1>
    <p>scan Num:{{ turn }}</p>
    <p>Code: {{ code }}</p>
    <qrcode-stream
      class="qr-box"
      :track="paintBoundingBox"
      @detect="onDetect"
      :constraints="videoConstraints"
      :formats="['ean_13']"
    ></qrcode-stream>
  </div>
  <!-- {{ status }} -->
</template>
