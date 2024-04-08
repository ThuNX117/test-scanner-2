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
    // each camera
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: _device.deviceId,
      },
    });

    let _result: MediaTrackCapabilities[] = [];
    const tracks = stream.getTracks();
    tracks.forEach(async (_track) => {
      const _trackInfo = _track.getCapabilities();
      _result.push(_trackInfo);
    });
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
    for (const element of _devices) {
      const data = await getTrackData(element);
      result.push(data);
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
