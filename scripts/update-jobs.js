import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { fetchOfficialSources } from "./sources/official.js";
import { fetchPrivateSources } from "./sources/private.js";
import { deduplicate } from "./core/deduplicate.js";
import { scoreOpportunity } from "./core/eligibility.js";

const __dirname=path.dirname(fileURLToPath(import.meta.url));
const file=path.resolve(__dirname,"../data/jobs.json");

async function main(){
  const current=JSON.parse(await fs.readFile(file,"utf8"));
  const [official,privateJobs]=await Promise.all([fetchOfficialSources(),fetchPrivateSources()]);
  // Preserve existing records. Live adapters only add records after verification.
  const verified=[...official,...privateJobs].map(scoreOpportunity);
  const merged=deduplicate([...verified,...current.opportunities]);
  const now=new Date();
  const opportunities=merged.map(o=>{
    if(o.applicationDeadline && new Date(o.applicationDeadline)<now) return {...o,status:"closed"};
    return o;
  });
  const next={...current,lastUpdated:new Date().toISOString(),opportunities};
  await fs.writeFile(file,JSON.stringify(next,null,2)+"\n");
  console.log(`Updated ${opportunities.length} opportunities.`);
}
main().catch(err=>{console.error(err);process.exit(1);});