import type {SupportStatus} from "./featureDataProcessor";

export interface SupportStatusItem {
    state: SupportStatus;
    char: string;
    short: string;
    description: string;
    alwaysShow?: boolean;
}

export const DEFAULT_STATE = 1;

export const SUPPORT_STATUS_ITEMS: SupportStatusItem[] = [
    {state: 'ok',             short:'Ok',        description: 'Ready, but evolving!',                        char: '✓ ', alwaysShow: true},
    {state: 'no',             short:'No',        description: 'Unknown, maybe in progress',                  char: '✗ ', alwaysShow: true},
    {state: 'maybe',          short:'Maybe',     description: 'In progress, either mod or KSA dev team',     char: '？', alwaysShow: true},
    {state: 'wont-do',        short:'Won\'t Do', description: 'KSA dev team wont implement it',              char: '⛔', alwaysShow: true},
    {state: 'wip',            short:'WIP',       description: 'Work in progress, but not ready for release', char: '⚠',  alwaysShow: true},
    {state: 'menu-option',    short:'Via Menu',  description: 'Enabled only from menu',                      char: '👁', alwaysShow: true},
    {state: 'preview',        short:'Preview',   description: 'Preview mode',                                char: '👀', },
    {state: 'alpha',          short:'Alpha',     description: 'Alpha testing phase',                         char: 'A', },
    {state: 'beta',           short:'Beta',      description: 'Beta testing phase',                          char: 'B', },
    {state: 'ready',          short:'Ready',     description: 'Ready for release',                           char: '✅', },
]