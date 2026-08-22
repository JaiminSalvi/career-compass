export function normalizeOpportunity(raw, sourceName) {
  return {
    id: raw.id || `${sourceName}-${String(raw.title || "opportunity").toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    title: raw.title || "Untitled opportunity",
    organization: raw.organization || sourceName,
    type: raw.type || "government_job",
    typeLabel: raw.typeLabel || raw.type || "Opportunity",
    category: Array.isArray(raw.category) ? raw.category : [],
    location: Array.isArray(raw.location) ? raw.location : ["India"],
    qualification: raw.qualification || "Check official notification",
    ageRequirement: raw.ageRequirement || "Check official notification",
    applicationDeadline: raw.applicationDeadline || null,
    eligibilityStatus: raw.eligibilityStatus || "check",
    eligibilityExplanation: raw.eligibilityExplanation || ["Verify the official notification before applying."],
    matchScore: Number(raw.matchScore || 0),
    skills: raw.skills || [],
    notificationUrl: raw.notificationUrl || null,
    applicationUrl: raw.applicationUrl || null,
    sourceName,
    sourceUrl: raw.sourceUrl || null,
    lastVerifiedAt: new Date().toISOString(),
    status: raw.status || "open"
  };
}