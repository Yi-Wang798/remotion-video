export function workflowFor(plan){
 if(['direct','designed'].includes(plan.workflow))return plan.workflow;
 if((plan.version||1)<2)return 'designed';
 return plan.needsCustomArt||plan.taskKind==='illustration'?'designed':'direct';
}
export function reviewLevelFor(plan){
 return ['light','segments'].includes(plan.reviewLevel)?plan.reviewLevel:workflowFor(plan)==='designed'?'segments':'light';
}
