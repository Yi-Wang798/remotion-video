import {isIllustrated} from './visual-policy.mjs';
export function workflowFor(plan){
 if(isIllustrated(plan)||((plan.version||1)>=4&&(plan.creative?.imageGenerationRequired||plan.creative?.artwork==='built-in-imagegen')))return 'designed';
 if(['direct','designed'].includes(plan.workflow))return plan.workflow;
 if((plan.version||1)>=4)return plan.needsCustomArt?'designed':'direct';
 if((plan.version||1)<2)return 'designed';
 return plan.needsCustomArt||plan.taskKind==='illustration'?'designed':'direct';
}
export function reviewLevelFor(plan){
 if(isIllustrated(plan))return 'segments';
 return ['light','segments'].includes(plan.reviewLevel)?plan.reviewLevel:workflowFor(plan)==='designed'?'segments':'light';
}
