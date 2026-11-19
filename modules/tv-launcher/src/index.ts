import { requireNativeModule } from "expo";

export type NativeTVApp = {
  id: string;
  packageName: string;
  label: string;
  iconDataUrl: string | null;
};

export type DeviceMemory = {
  totalBytes: number;
  availableBytes: number;
  usedBytes: number;
  lowMemory: boolean;
};

type TvLauncherNativeModule = {
  getInstalledApps(): Promise<NativeTVApp[]>;
  launchApp(appId: string): Promise<boolean>;
  openWifiSettings(): boolean;
  openBluetoothSettings(): boolean;
  openAppMemorySettings(): boolean;
  getDeviceMemory(): DeviceMemory;
};

export default requireNativeModule<TvLauncherNativeModule>("TvLauncher");
