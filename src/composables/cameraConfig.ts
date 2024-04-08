import { ref } from "vue";

type trackCapability = MediaTrackCapabilities & {
  focusMode: "none" | "manual" | "single-shot" | "continuous";
};
type trackCapabilityType = {
  device: Pick<MediaDeviceInfo, "deviceId" | "kind" | "groupId">;
  track: trackCapability[];
};
export const cameraConfig = () => {
  const cameraId = ref<string>("");
  const ready = ref<boolean>(false);
  const devices = ref<MediaDeviceInfo[]>([]);
  const trackCapability = ref<trackCapabilityType[]>([]);
  const getCameraList = async () => {
    let result: MediaDeviceInfo[] = [];
    try {
      const _devices: MediaDeviceInfo[] = await navigator.mediaDevices.enumerateDevices();
      result = _devices.filter((item) => item.kind == "videoinput");
    } catch (error) {
      alert("getCameraList" + error);
    }

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
        _track.stop();
      });
    } catch (error) {
      alert("getTrackData: " + error);
    }
    return {
      device: {
        deviceId: _device.deviceId,
        groupId: _device.groupId,
        kind: _device.kind,
      },
      track: _result,
    } as trackCapabilityType;
  };
  const getCapabilities = async (_devices: MediaDeviceInfo[]) => {
    let result: trackCapabilityType[] = [];
    try {
      for (const element of _devices) {
        const data = await getTrackData(element);
        result.push(data);
        console.log({ data });
      }
    } catch (error) {
      alert("getCapabilities" + error);
    }
    return result;
  };
  const getBestCamera = (list: trackCapabilityType[]) => {
    let id: string | undefined = "";
    let width: number | undefined = 0;
    let height: number | undefined = 0;
    id = list[0].device.deviceId;
    list.forEach((item) => {
      item.track.forEach((_track) => {
        if (
          _track.focusMode?.includes("continuous") &&
          _track.facingMode?.includes("environment")
        ) {
          id = _track.deviceId;
          width = _track.width?.max;
          height = _track.height?.max;
        }
      });
    });
    return { id, width, height };
  };

  return {
    ready,
    cameraId,
    devices,
    trackCapability,
    getCameraList,
    getCapabilities,
    getBestCamera,
  };
};
export default cameraConfig;
