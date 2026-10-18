import test from 'node:test';
import assert from 'node:assert/strict';
import {jobFormSchema} from '../src/lib/validation/job.ts';

const valid = {
  title:'Senior Python Engineer',description:'Design and deliver secure software used by enterprise teams.',
  employment:'FULL_TIME',remote:'REMOTE',location:'Bratislava',
  salaryMin:'2500',salaryMax:'4500',salaryPeriod:'MONTH',skills:'Python, AI, Python',
};

test('job salary and duplicate skills normalize',()=>{
  const result=jobFormSchema.safeParse(valid);
  assert.equal(result.success,true);
  if(result.success)assert.deepEqual(result.data.skills,['Python','AI']);
});
test('job cannot publish inverted salary',()=>{
  assert.equal(jobFormSchema.safeParse({...valid,salaryMin:'9000',salaryMax:'1000'}).success,false);
});
test('job requires wage transparency and a substantial description',()=>{
  assert.equal(jobFormSchema.safeParse({...valid,salaryMin:undefined}).success,false);
  assert.equal(jobFormSchema.safeParse({...valid,description:'too short'}).success,false);
});
test('freelance fixed price is accepted',()=>{
  assert.equal(jobFormSchema.safeParse({...valid,employment:'FREELANCE',salaryPeriod:'FIXED'}).success,true);
});
