// Source registry. These URLs are official entry points.
// Individual parsers are intentionally conservative: only publish an opening when
// title/date/link can be extracted and validated. Do not bypass CAPTCHA or login.
export const OFFICIAL_SOURCES = [
  {name:"SSC Official", url:"https://ssc.gov.in/", category:["SSC"]},
  {name:"IBPS Official", url:"https://www.ibps.in/", category:["IBPS","Banking"]},
  {name:"RRB Ahmedabad", url:"https://www.rrbahmedabad.gov.in/", category:["Railway"]},
  {name:"GPSC Official", url:"https://gpsc.gujarat.gov.in/", category:["Gujarat Government"]},
  {name:"GSSSB Official", url:"https://gsssb.gujarat.gov.in/", category:["Gujarat Government"]},
  {name:"SBI Careers", url:"https://sbi.co.in/web/careers", category:["Banking"]},
  {name:"RBI", url:"https://www.rbi.org.in/", category:["Banking","RBI"]}
];

export async function fetchOfficialSources() {
  // This MVP keeps previously verified data if a source parser is unavailable.
  // Add source-specific parsers here after testing the public page structure.
  const results=[];
  for (const source of OFFICIAL_SOURCES) {
    try {
      // Deliberately no CAPTCHA/login bypassing. A source may be skipped.
      // A future parser can fetch source.url and return only verified structured records.
      console.log(`Source registered: ${source.name}`);
    } catch (error) {
      console.error(`Source failed: ${source.name}`, error.message);
    }
  }
  return results;
}