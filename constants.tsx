
import { AndroidVersion, BuildType } from './types';

export const REPO_DEFAULTS = {
  [BuildType.LINEAGE_OS]: {
    [AndroidVersion.PIE_9]: {
      device: 'https://github.com/LineageOS/android_device_motorola_sanders',
      vendor: 'https://github.com/TheMuppets/proprietary_vendor_motorola',
      kernel: 'https://github.com/LineageOS/android_kernel_motorola_msm8953',
      manifest: 'https://github.com/LineageOS/android.git',
      branch: 'lineage-16.0'
    },
    [AndroidVersion.Q_10]: {
      device: 'https://github.com/LineageOS/android_device_motorola_sanders',
      vendor: 'https://github.com/TheMuppets/proprietary_vendor_motorola',
      kernel: 'https://github.com/LineageOS/android_kernel_motorola_msm8953',
      manifest: 'https://github.com/LineageOS/android.git',
      branch: 'lineage-17.1'
    },
    [AndroidVersion.R_11]: {
      device: 'https://github.com/LineageOS/android_device_motorola_sanders',
      vendor: 'https://github.com/TheMuppets/proprietary_vendor_motorola',
      kernel: 'https://github.com/LineageOS/android_kernel_motorola_msm8953',
      manifest: 'https://github.com/LineageOS/android.git',
      branch: 'lineage-18.1'
    }
  },
  [BuildType.ARROW_OS]: {
    [AndroidVersion.PIE_9]: {
      device: 'https://github.com/ArrowOS-Devices/android_device_motorola_sanders',
      vendor: 'https://github.com/ArrowOS-Devices/android_vendor_motorola_sanders',
      kernel: 'https://github.com/ArrowOS-Devices/android_kernel_motorola_msm8953',
      manifest: 'https://github.com/ArrowOS/android_manifest.git',
      branch: 'arrow-9.x'
    },
    [AndroidVersion.Q_10]: {
      device: 'https://github.com/ArrowOS-Devices/android_device_motorola_sanders',
      vendor: 'https://github.com/ArrowOS-Devices/android_vendor_motorola_sanders',
      kernel: 'https://github.com/ArrowOS-Devices/android_kernel_motorola_msm8953',
      manifest: 'https://github.com/ArrowOS/android_manifest.git',
      branch: 'arrow-10.0'
    },
    [AndroidVersion.R_11]: {
      device: 'https://github.com/ArrowOS-Devices/android_device_motorola_sanders',
      vendor: 'https://github.com/ArrowOS-Devices/android_vendor_motorola_sanders',
      kernel: 'https://github.com/ArrowOS-Devices/android_kernel_motorola_msm8953',
      manifest: 'https://github.com/ArrowOS/android_manifest.git',
      branch: 'arrow-11.0'
    }
  },
  // Placeholders for AOSP and DerpFest
  [BuildType.AOSP]: {
    [AndroidVersion.PIE_9]: { branch: 'pie', manifest: 'https://android.googlesource.com/platform/manifest' },
    [AndroidVersion.Q_10]: { branch: 'android-10.0.0_r1', manifest: 'https://android.googlesource.com/platform/manifest' },
    [AndroidVersion.R_11]: { branch: 'android-11.0.0_r1', manifest: 'https://android.googlesource.com/platform/manifest' },
  },
  [BuildType.DERPFEST]: {
    [AndroidVersion.PIE_9]: { branch: 'pie', manifest: 'https://github.com/DerpFest-AOSP/manifest' },
    [AndroidVersion.Q_10]: { branch: 'ten', manifest: 'https://github.com/DerpFest-AOSP/manifest' },
    [AndroidVersion.R_11]: { branch: 'eleven', manifest: 'https://github.com/DerpFest-AOSP/manifest' },
  }
};
