import { ref } from "vue";

type trackCapabilityType = {
  device: Pick<MediaDeviceInfo, "deviceId" | "kind" | "groupId">;
  track: MediaTrackCapabilities[];
};
export const cameraConfig = () => {
  const cameraId = ref<string>("");
  const devices = ref<MediaDeviceInfo[]>([]);
  const trackCapability = ref<trackCapabilityType[]>([]);
  const getCameraList = async () => {
    console.log("getCameraList");
    let result: MediaDeviceInfo[] = [];
    const _devices: MediaDeviceInfo[] = await navigator.mediaDevices.enumerateDevices();
    result = _devices.filter((item) => item.kind == "videoinput");
    console.log("getCameraList >>", result);
    return result;
  };

  const getTrackData = async (_device: MediaDeviceInfo) => {
    let _result: MediaTrackCapabilities[] = [];

    try {
      // each camera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: _device.deviceId,
        },
      });

      const tracks = stream.getTracks();
      tracks.forEach(async (_track) => {
        const _trackInfo = _track.getCapabilities();
        _result.push(_trackInfo);
      });
      stream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      alert("error" + error);
    }
    return {
      device: {
        deviceId: _device.deviceId,
        groupId: _device.groupId,
        kind: _device.kind,
      },
      track: _result,
    };
  };
  const getCapabilities = async (_devices: MediaDeviceInfo[]) => {
    let result: trackCapabilityType[] = [];
    try {
      for (const element of _devices) {
        const data = await getTrackData(element);
        result.push(data);
      }
    } catch (error) {
      alert("getCapabilities" + error);
    }
    return result;
  };
  return {
    cameraId,
    devices,
    trackCapability,
    getCameraList,
    getCapabilities,
  };
};
export default cameraConfig;
