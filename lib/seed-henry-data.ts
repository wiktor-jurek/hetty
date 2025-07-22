import { db } from "@/lib/db/drizzle";
import { runs, projects, models, explores, unusedJoins, unusedFields } from "@/lib/db/schema";

export async function seedHenryData() {
  console.log("🌱 Seeding Henry analytics data...");

  try {
    // Insert henry run
    const [insertedRun] = await db.insert(runs).values({
      status: "completed",
    }).returning({ runId: runs.runId });

    // Insert projects
    const projectData = [
      {
        runId: insertedRun.runId,
        projectName: "dna_legal",
        gitConnectionStatus: "OK",
        prMode: "off",
        isValidationRequired: true,
      },
      {
        runId: insertedRun.runId,
        projectName: "living_dna",
        gitConnectionStatus: "Bare repo, no tests required",
        prMode: "off",
        isValidationRequired: true,
      },
      {
        runId: insertedRun.runId,
        projectName: "marketplace_extension_api_explorer",
        gitConnectionStatus: "Bare repo, no tests required",
        prMode: "off",
        isValidationRequired: false,
      },
      {
        runId: insertedRun.runId,
        projectName: "dna_legal_general",
        gitConnectionStatus: "Bare repo, no tests required",
        prMode: "off",
        isValidationRequired: true,
      },
    ];

    const insertedProjects = await db.insert(projects).values(projectData).returning({ 
      projectId: projects.projectId, 
      projectName: projects.projectName 
    });

    // Insert models
    const dnaLegalProject = insertedProjects.find(p => p.projectName === "dna_legal")!;
    const livingDnaProject = insertedProjects.find(p => p.projectName === "living_dna")!;
    const dnaLegalGeneralProject = insertedProjects.find(p => p.projectName === "dna_legal_general")!;

    const modelData = [
      {
        projectId: dnaLegalProject.projectId,
        modelName: "dna_legal",
        totalExplores: 10,
        unusedExplores: 6,
        queryCount: 1035,
      },
      {
        projectId: livingDnaProject.projectId,
        modelName: "living_dna",
        totalExplores: 24,
        unusedExplores: 24,
        queryCount: 0,
      },
      {
        projectId: dnaLegalGeneralProject.projectId,
        modelName: "warehouse_general",
        totalExplores: 8,
        unusedExplores: 7,
        queryCount: 21,
      },
    ];

    const insertedModels = await db.insert(models).values(modelData).returning({ 
      modelId: models.modelId, 
      modelName: models.modelName 
    });

    // Insert explores
    const dnaLegalModel = insertedModels.find(m => m.modelName === "dna_legal")!;

    const exploreData = [
      {
        modelId: dnaLegalModel.modelId,
        exploreName: "shipping_costs",
        isHidden: false,
        hasDescription: false,
        totalJoins: 0,
        unusedJoins: 0,
        totalFields: 27,
        unusedFields: 10,
        queryCount: 0,
      },
      {
        modelId: dnaLegalModel.modelId,
        exploreName: "invoice_items",
        isHidden: false,
        hasDescription: false,
        totalJoins: 2,
        unusedJoins: 0,
        totalFields: 144,
        unusedFields: 7,
        queryCount: 0,
      },
      {
        modelId: dnaLegalModel.modelId,
        exploreName: "invoices",
        isHidden: false,
        hasDescription: false,
        totalJoins: 13,
        unusedJoins: 2,
        totalFields: 323,
        unusedFields: 17,
        queryCount: 0,
      },
      {
        modelId: dnaLegalModel.modelId,
        exploreName: "quote_drop_off",
        isHidden: false,
        hasDescription: false,
        totalJoins: 7,
        unusedJoins: 4,
        totalFields: 1087,
        unusedFields: 24,
        queryCount: 56,
      },
      {
        modelId: dnaLegalModel.modelId,
        exploreName: "account_converted_drop_off",
        isHidden: false,
        hasDescription: false,
        totalJoins: 9,
        unusedJoins: 1,
        totalFields: 767,
        unusedFields: 19,
        queryCount: 390,
      },
      {
        modelId: dnaLegalModel.modelId,
        exploreName: "user_targets",
        isHidden: false,
        hasDescription: false,
        totalJoins: 5,
        unusedJoins: 2,
        totalFields: 483,
        unusedFields: 13,
        queryCount: 0,
      },
    ];

    const insertedExplores = await db.insert(explores).values(exploreData).returning({ 
      exploreId: explores.exploreId, 
      exploreName: explores.exploreName 
    });

    // Insert some sample unused joins and fields
    const sampleUnusedJoins = [
      { exploreId: insertedExplores[2].exploreId, joinName: "cases" }, // invoices explore
      { exploreId: insertedExplores[2].exploreId, joinName: "invoice_items" }, // invoices explore
      { exploreId: insertedExplores[3].exploreId, joinName: "dnacr_caserecords_sugar_crm" }, // quote_drop_off explore
      { exploreId: insertedExplores[3].exploreId, joinName: "quotes_accounts_sugar_crm" }, // quote_drop_off explore
    ];

    await db.insert(unusedJoins).values(sampleUnusedJoins);

    const sampleUnusedFields = [
      { exploreId: insertedExplores[0].exploreId, fieldName: "shipping_costs.average_dhl_cost" },
      { exploreId: insertedExplores[0].exploreId, fieldName: "shipping_costs.cost_date" },
      { exploreId: insertedExplores[0].exploreId, fieldName: "shipping_costs.cost_month" },
      { exploreId: insertedExplores[1].exploreId, fieldName: "accounts.account_commission_joining_information" },
      { exploreId: insertedExplores[1].exploreId, fieldName: "invoice_items.cost_price" },
      { exploreId: insertedExplores[2].exploreId, fieldName: "accounts.account_name" },
      { exploreId: insertedExplores[2].exploreId, fieldName: "cases.account_id" },
      { exploreId: insertedExplores[3].exploreId, fieldName: "accounts_sugar_crm.account_category" },
      { exploreId: insertedExplores[3].exploreId, fieldName: "dnacr_caserecords_sugar_crm.barcode" },
    ];

    await db.insert(unusedFields).values(sampleUnusedFields);

    console.log("✅ Henry analytics data seeded successfully!");
    
  } catch (error) {
    console.error("❌ Error seeding Henry data:", error);
    throw error;
  }
}

// Run the seeding function if this file is executed directly
if (require.main === module) {
  seedHenryData()
    .then(() => {
      console.log("Seeding completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Seeding failed:", error);
      process.exit(1);
    });
} 