import type { DeviceMemory, NativeTVApp } from "./src";

const TvLauncher = {
  async getInstalledApps(): Promise<NativeTVApp[]> {
    return [];
  },
  async launchApp(_appId: string): Promise<boolean> {
    return false;
  },
  openWifiSettings(): boolean {
    return false;
  },
  openBluetoothSettings(): boolean {
    return false;
  },
  openAppMemorySettings(): boolean {
    return false;
  },
  getDeviceMemory(): DeviceMemory {
    return { totalBytes: 0, availableBytes: 0, usedBytes: 0, lowMemory: false };
  },
};

export default TvLauncher;
