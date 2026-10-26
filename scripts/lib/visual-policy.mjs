import fs from 'node:fs';
import {projectFile} from './project-files.mjs';

export const visualModes=['illustrated','schematic','data','geometry','footage','typography'];
export const usesVisualPolicy=plan=>(plan.version||1)>=4;
export const isIllustrated=plan=>usesVisualPolicy(plan)&&plan.creative?.visualMode==='illustrated';
const text=value=>typeof value==='string'&&Boolean(value.trim());

// These checks verify declared choices and evidence, not artistic quality.
export function validateVisualPolicy(project,plan,{final=false}={}){
 if(!usesVisualPolicy(plan))return [];
 const issues=[],c=plan.creative||{},refs=plan.references||[];
 const file=(name,label)=>{try{const stat=fs.statSync(projectFile(project,name));if(!stat.isFile()||!stat.size)throw new Error();}catch{issues.push(label+': file missing or invalid');}};
 if(!visualModes.includes(c.visualMode))issues.push('Choose a visualMode before production');
 if(!text(c.visualReason))issues.push('Explain the visual route in creative.visualReason');
 if(!['built-in-imagegen','existing','none'].includes(c.artwork))issues.push('Choose creative.artwork');
 if(typeof c.imageGenerationRequired!=='boolean')issues.push('Record whether the brief requires image generation');
 const requiredArt=c.imageGenerationRequired||c.artwork==='built-in-imagegen';
 if(c.imageGenerationRequired&&c.artwork!=='built-in-imagegen')issues.push('The brief requires built-in ImageGen; do not downgrade the artwork route');
 if(requiredArt&&!refs.some(r=>r.generatedWith==='built-in-imagegen'))issues.push('Built-in ImageGen references missing');
 if(requiredArt&&plan.workflow==='direct')issues.push('ImageGen artwork requires the designed workflow');
 if(isIllustrated(plan)){
  if(plan.workflow==='direct')issues.push('Illustrated videos require the designed workflow');
  if(c.previewMode==='compact')issues.push('Illustrated videos require a timed animatic');
  if(plan.reviewLevel==='light')issues.push('Illustrated videos require segment reviews');
  if(c.artwork==='none')issues.push('Illustrated videos need generated or suitable existing artwork');
  if(!refs.length)issues.push('Illustrated artwork missing');
 }
 if(c.artwork==='existing'&&!refs.some(r=>['existing','user'].includes(r.generatedWith)))issues.push('Existing artwork references missing');
 const generated=refs.filter(r=>r.generatedWith==='built-in-imagegen');
 for(const r of refs)file(r.file,`Reference ${r.id}`);
 for(const r of generated.slice(1))if(!r.basedOn?.length)issues.push(`Reference ${r.id}: connect later generated artwork to selected references`);
 for(const key of ['intent','contrast','sequence','material'])if(!text(plan.design?.colorDirection?.[key]))issues.push(`Color direction: ${key} missing`);
 if(!plan.design?.palette||Array.isArray(plan.design.palette)||Object.keys(plan.design.palette).length<3)issues.push('Define named background, subject and accent palette roles');
 for(const s of plan.shots||[]){
  if(!Array.isArray(s.overlays))issues.push(`Shot ${s.id}: record all non-caption overlays, or []`);
  for(const o of s.overlays||[]){
   if(!text(o.text)||!['title','label','credit','brand','chapter'].includes(o.purpose))issues.push(`Shot ${s.id}: overlay needs text and a useful purpose`);
   if(['brand','chapter'].includes(o.purpose)&&o.requested!==true)issues.push(`Shot ${s.id}: unrequested branding or chapter/page decoration`);
  }
  const beats=s.visual?.beats;
  if(!Array.isArray(beats)||!beats.length)issues.push(`Shot ${s.id}: record timed visual beats`);
  let previous=-1;
  for(const b of beats||[]){
   if(!Number.isInteger(b.frame)||b.frame<=previous||b.frame<0||b.frame>=s.durationInFrames||!text(b.event)||!['action','reveal','camera','hold','loop'].includes(b.kind))issues.push(`Shot ${s.id}: invalid visual beat`);
   previous=b.frame;
   if(['hold','loop'].includes(b.kind)&&!text(b.reason))issues.push(`Shot ${s.id}: explain the purpose of a hold or loop`);
  }
  if(beats?.length&&beats[0].frame!==0)issues.push(`Shot ${s.id}: visual beats must include the entry state at frame 0`);
  if(isIllustrated(plan)){
   if(!s.referenceIds?.length)issues.push(`Shot ${s.id}: select artwork references`);
   if(!s.assetFiles?.length)issues.push(`Shot ${s.id}: declare artwork used in the rendered shot`);
  }
  for(const f of s.assetFiles||[])file(f,`Shot ${s.id} artwork asset`);
 }
 if(final){
  const checks=plan.reviews?.final?.shotChecks||[];
  for(const s of plan.shots||[]){
   const r=checks.find(r=>r.shotId===s.id);
   for(const key of ['development','artwork','color','overlays'])if(!text(r?.[key]))issues.push(`Shot ${s.id}: final observation ${key} missing`);
  }
 }
 return issues;
}
