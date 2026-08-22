const profile={education:["B.Com completed","M.Com pursuing"],skills:["Tally","Accounting","Commerce"],professional:["CS Executive pursuing"],location:"Ahmedabad, Gujarat"};
export function scoreOpportunity(o){
 let score=45, reasons=[];
 const text=JSON.stringify(o).toLowerCase();
 if(/graduate|b\.?com|commerce/.test(text)){score+=25;reasons.push("Graduate/commerce qualification appears relevant");}
 if(/tally|account/.test(text)){score+=15;reasons.push("Matches accounting or Tally background");}
 if(/cs|compliance|secretarial/.test(text)){score+=12;reasons.push("Matches CS Executive/compliance interest");}
 if(/ahmedabad/.test(text)){score+=10;reasons.push("Located in Ahmedabad");}
 if(/remote/.test(text)){score+=6;reasons.push("Remote opportunity");}
 return {...o,matchScore:Math.min(99,score),eligibilityStatus:"check",eligibilityExplanation:[...reasons,"Verify age and post-specific requirements in the official notification."]};
}