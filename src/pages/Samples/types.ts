import { v4 as uuidv4 } from "uuid";

export interface SampleRow {
  id: string;
  moisture: number;
  dryDensity: number;
  correctionFactor: number;
  porosity: number;
  adjustedMoisture: number;
  adjustedDensity: number;
}

export type SampleRowConfig = {
  [k in keyof SampleRow]: {
    editable?: boolean;
    defaultValue?: SampleRow[k];
  };
};

export const SAMPLE_ROW_CONFIG = {
  id: {
    get defaultValue() {
      return uuidv4();
    },
  },
  moisture: { editable: true },
  dryDensity: { editable: true },
  correctionFactor: { editable: true, defaultValue: 5 },
  porosity: { editable: true, defaultValue: 30 },
  adjustedMoisture: {},
  adjustedDensity: {},
} as const satisfies SampleRowConfig;
