type MetricType =
  | 'startup'
  | 'switching'
  | 'frame_rate'
  | 'static_memory'
  | 'peak_memory';

export interface SeedRecord {
  metricType: MetricType;
  testDate: Date;
  platform: string;
  product: string;
  version: string;
}

export interface SeedValue {
  recordIndex: number;
  sceneName: string;
  metricName: string;
  value: number;
  unit: string;
  baseline: number;
  threshold: number;
}

function rand(min: number, max: number): number {
  return Math.round((min + Math.random() * (max - min)) * 100) / 100;
}

const metricConfigs: Record<
  MetricType,
  {
    scenes: string[];
    metrics: Array<{
      name: string;
      unit: string;
      min: number;
      max: number;
      baseline: number;
      threshold: number;
    }>;
  }
> = {
  startup: {
    scenes: ['default_mode', 'portrait_mode', 'night_mode'],
    metrics: [
      {
        name: 'cold_start_time',
        unit: 'ms',
        min: 800,
        max: 2000,
        baseline: 1200,
        threshold: 1800,
      },
      {
        name: 'hot_start_time',
        unit: 'ms',
        min: 200,
        max: 600,
        baseline: 350,
        threshold: 500,
      },
    ],
  },
  switching: {
    scenes: ['photo_mode', 'video_mode', 'panorama_mode'],
    metrics: [
      {
        name: 'front_to_rear',
        unit: 'ms',
        min: 300,
        max: 800,
        baseline: 450,
        threshold: 700,
      },
      {
        name: 'rear_to_front',
        unit: 'ms',
        min: 300,
        max: 800,
        baseline: 420,
        threshold: 700,
      },
      {
        name: 'mode_switch',
        unit: 'ms',
        min: 200,
        max: 500,
        baseline: 300,
        threshold: 450,
      },
    ],
  },
  frame_rate: {
    scenes: ['outdoor_bright', 'indoor_low_light', 'night_scene'],
    metrics: [
      {
        name: 'preview_fps',
        unit: 'fps',
        min: 25,
        max: 30,
        baseline: 30,
        threshold: 26,
      },
      {
        name: 'capture_fps',
        unit: 'fps',
        min: 15,
        max: 30,
        baseline: 28,
        threshold: 20,
      },
      {
        name: 'frame_interval',
        unit: 'ms',
        min: 33,
        max: 40,
        baseline: 33.3,
        threshold: 38,
      },
    ],
  },
  static_memory: {
    scenes: ['idle', 'preview_active', 'background'],
    metrics: [
      {
        name: 'camera_process',
        unit: 'MB',
        min: 50,
        max: 200,
        baseline: 120,
        threshold: 180,
      },
      {
        name: 'hal_memory',
        unit: 'MB',
        min: 30,
        max: 100,
        baseline: 60,
        threshold: 90,
      },
      {
        name: 'total_memory',
        unit: 'MB',
        min: 100,
        max: 350,
        baseline: 200,
        threshold: 300,
      },
    ],
  },
  peak_memory: {
    scenes: ['single_capture', 'burst_capture', 'video_recording', '4k_mode'],
    metrics: [
      {
        name: 'capture_peak',
        unit: 'MB',
        min: 150,
        max: 400,
        baseline: 250,
        threshold: 380,
      },
      {
        name: 'video_peak',
        unit: 'MB',
        min: 200,
        max: 500,
        baseline: 320,
        threshold: 450,
      },
      {
        name: 'burst_peak',
        unit: 'MB',
        min: 250,
        max: 600,
        baseline: 400,
        threshold: 550,
      },
    ],
  },
};

const versions = ['v1.0', 'v2.0', 'v3.0', 'v4.0', 'v5.0'];

export function generateSeedData(): {
  records: SeedRecord[];
  values: SeedValue[];
} {
  const records: SeedRecord[] = [];
  const values: SeedValue[] = [];

  const metricTypes: MetricType[] = [
    'startup',
    'switching',
    'frame_rate',
    'static_memory',
    'peak_memory',
  ];

  let recordIndex = 0;

  for (const metricType of metricTypes) {
    const config = metricConfigs[metricType];

    for (let vi = 0; vi < versions.length; vi++) {
      const version = versions[vi];
      const testDate = new Date(2024, 0 + vi * 2, 15);

      records.push({
        metricType,
        testDate,
        platform: 'Android',
        product: 'CameraApp',
        version,
      });

      const currentRecordIndex = recordIndex;
      recordIndex++;

      for (const scene of config.scenes) {
        for (const metric of config.metrics) {
          let value = rand(metric.min, metric.max);

          // Intentionally make some v5.0 values exceed thresholds for demo
          if (version === 'v5.0' && Math.random() > 0.5) {
            if (
              metricType === 'frame_rate' &&
              metric.name.includes('fps')
            ) {
              // For FPS, bad = below threshold
              value = rand(metric.min, metric.threshold - 2);
            } else {
              // For time/memory, bad = above threshold
              value = rand(metric.threshold, metric.max * 1.2);
            }
          }

          // v4.0 gets some moderate regressions
          if (version === 'v4.0' && Math.random() > 0.6) {
            if (
              metricType === 'frame_rate' &&
              metric.name.includes('fps')
            ) {
              value = rand(
                metric.baseline * 0.85,
                metric.baseline * 0.95,
              );
            } else {
              value = rand(
                metric.baseline * 1.15,
                metric.baseline * 1.3,
              );
            }
          }

          values.push({
            recordIndex: currentRecordIndex,
            sceneName: scene,
            metricName: metric.name,
            value,
            unit: metric.unit,
            baseline: metric.baseline,
            threshold: metric.threshold,
          });
        }
      }
    }
  }

  return { records, values };
}
