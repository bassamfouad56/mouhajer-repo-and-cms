import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "b6q28exv",
  dataset: "production",
  apiVersion: "2024-11-21",
  token:
    "skiIzl2j9bAUcxtrJGS2MFp1JccNsjBPTSwzGGuydjQpIkCqtx6tt6jDtKKsZaarRfFHApyFrWH64y0RYkFPm7pLOAErsezEPJ5tGAn48O3ruOLA9n6scz2zWZsF6JOPNwSAMWpsupJlNrTVMoJ2Jju6OCcVB5RAs2kFKXtDVOO2jZ04eTZJ",
  useCdn: false,
});

async function test() {
  try {
    console.log("Testing connection to b6q28exv...");
    const result = await client.fetch('*[_type == "project"][0...5]');
    console.log(`✅ Connected! Found ${result.length} projects`);
    if (result.length > 0) {
      console.log("\nSample project:");
      console.log(JSON.stringify(result[0], null, 2));
    }
  } catch (error: any) {
    console.error("❌ Connection failed:", error.message);
  }
}

test();
