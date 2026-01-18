// 1. Type Definitions
export type SupportStatus = 'ok' | 'no' | 'maybe' | 'wont-do' | 'wip' | 'menu-option' | 'preview' | 'alpha' | 'beta' | 'ready';

export type TableType = 'FeatureTable' | 'ResourceTable' | 'MetaInformation';

export interface Feature {
  name: string;
  core: SupportStatus;
  mod: SupportStatus;
  comment: string;
}

export interface Resource {
  name: string;
  url: string;
  url_name?: string;
}

export interface Meta {
  last_update: string;
}

export interface MetaInformation {
  type: 'MetaInformation';
  name: string;
  meta: Meta;
}

export interface FeatureTable {
  type: 'FeatureTable';
  name: string;
  features: Feature[];
}

export interface ResourceTable {
  type: 'ResourceTable';
  name: string;
  resources: Resource[];
}

export type TableInstance = MetaInformation | FeatureTable | ResourceTable;

// 2. Deserialization Logic
/**
 * Processes the raw JSON data into a list of typed table instances.
 */
export function processFeatureData(rawData: any[]): TableInstance[] {
  return rawData.map((item) => {
    if ('features' in item) {
      return {
        type: 'FeatureTable',
        name: item.name,
        features: item.features.map((f: any) => ({
          name: f.name,
          core: f.core as SupportStatus,
          mod: f.mod as SupportStatus,
          comment: f.comment,
        })),
      };
    } else if ('resources' in item) {
      return {
        type: 'ResourceTable',
        name: item.name,
        resources: item.resources.map((r: any) => ({
          name: r.name,
          url: r.url,
          url_name: r.url_name,
        })),
      };
    } else if ('meta' in item) {
      return {
        type: 'MetaInformation',
        name: item.name,
        meta: {
          last_update: item.meta.last_update
        },
      }
    }
    
    throw new Error(`Unknown table structure for category: ${item.name}`);
  });
}