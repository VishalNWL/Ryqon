import { createRequire } from "module";
import { config } from "dotenv";

config();

const require = createRequire(import.meta.url);
const { PrismaClient } = require("@prisma/client");
const { PrismaNeon } = require("@prisma/adapter-neon");

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  const jee = await prisma.category.upsert({
    where: { slug: "jee" },
    update: {},
    create: { name: "JEE", slug: "jee", description: "Joint Entrance Examination" },
  });

  const neet = await prisma.category.upsert({
    where: { slug: "neet" },
    update: {},
    create: { name: "NEET", slug: "neet", description: "National Eligibility cum Entrance Test" },
  });

  console.log("✅ Categories created");

  const jeeQuestions = [
    {
      title: "A particle moves in a straight line with uniform acceleration",
      description: "A particle moves in a straight line with uniform acceleration. It covers 10 m in the first second and 20 m in the second second. What is the acceleration of the particle?",
      subject: "Physics", chapter: "Kinematics", year: 2023, difficulty: "MEDIUM",
      options: [
        { label: "A", text: "5 m/s²", isCorrect: false },
        { label: "B", text: "10 m/s²", isCorrect: true },
        { label: "C", text: "15 m/s²", isCorrect: false },
        { label: "D", text: "20 m/s²", isCorrect: false },
      ],
    },
    {
      title: "The work done by a force on a body moving in a circular path",
      description: "A body moves in a circular path of radius R with uniform speed. The work done by the centripetal force in one complete revolution is:",
      subject: "Physics", chapter: "Work, Energy and Power", year: 2023, difficulty: "EASY",
      options: [
        { label: "A", text: "2πR", isCorrect: false },
        { label: "B", text: "πR²", isCorrect: false },
        { label: "C", text: "Zero", isCorrect: true },
        { label: "D", text: "2πR²", isCorrect: false },
      ],
    },
    {
      title: "Molarity of a solution containing 4g of NaOH in 500 mL",
      description: "Calculate the molarity of a solution prepared by dissolving 4 g of NaOH (molecular weight = 40) in enough water to make 500 mL of solution.",
      subject: "Chemistry", chapter: "Solutions", year: 2022, difficulty: "EASY",
      options: [
        { label: "A", text: "0.1 M", isCorrect: false },
        { label: "B", text: "0.2 M", isCorrect: true },
        { label: "C", text: "0.4 M", isCorrect: false },
        { label: "D", text: "0.5 M", isCorrect: false },
      ],
    },
    {
      title: "Integration of x² from 0 to 3",
      description: "Evaluate the definite integral ∫₀³ x² dx",
      subject: "Mathematics", chapter: "Integral Calculus", year: 2022, difficulty: "EASY",
      options: [
        { label: "A", text: "6", isCorrect: false },
        { label: "B", text: "9", isCorrect: true },
        { label: "C", text: "12", isCorrect: false },
        { label: "D", text: "27", isCorrect: false },
      ],
    },
    {
      title: "Eigenvalues of a 2x2 matrix",
      description: "Find the eigenvalues of the matrix A = [[3, 1], [1, 3]]",
      subject: "Mathematics", chapter: "Matrices and Determinants", year: 2021, difficulty: "HARD",
      options: [
        { label: "A", text: "2 and 4", isCorrect: true },
        { label: "B", text: "1 and 5", isCorrect: false },
        { label: "C", text: "3 and 3", isCorrect: false },
        { label: "D", text: "0 and 6", isCorrect: false },
      ],
    },
  ];

  for (const q of jeeQuestions) {
    const { options, ...questionData } = q;
    await prisma.question.create({
      data: { ...questionData, categoryId: jee.id, options: { create: options } },
    });
  }

  console.log("✅ JEE questions created");

  const neetQuestions = [
    {
      title: "The powerhouse of the cell",
      description: "Which organelle is known as the powerhouse of the cell due to its role in ATP production through cellular respiration?",
      subject: "Biology", chapter: "Cell Biology", year: 2023, difficulty: "EASY",
      options: [
        { label: "A", text: "Nucleus", isCorrect: false },
        { label: "B", text: "Ribosome", isCorrect: false },
        { label: "C", text: "Mitochondria", isCorrect: true },
        { label: "D", text: "Golgi Apparatus", isCorrect: false },
      ],
    },
    {
      title: "Number of chromosomes in human somatic cells",
      description: "The normal number of chromosomes in a human somatic (body) cell is:",
      subject: "Biology", chapter: "Cell Division", year: 2022, difficulty: "EASY",
      options: [
        { label: "A", text: "23", isCorrect: false },
        { label: "B", text: "44", isCorrect: false },
        { label: "C", text: "46", isCorrect: true },
        { label: "D", text: "48", isCorrect: false },
      ],
    },
    {
      title: "pH of a 0.01 M HCl solution",
      description: "What is the pH of a 0.01 M solution of hydrochloric acid (HCl) at 25°C? Assume complete dissociation.",
      subject: "Chemistry", chapter: "Ionic Equilibrium", year: 2023, difficulty: "MEDIUM",
      options: [
        { label: "A", text: "1", isCorrect: false },
        { label: "B", text: "2", isCorrect: true },
        { label: "C", text: "3", isCorrect: false },
        { label: "D", text: "4", isCorrect: false },
      ],
    },
  ];

  for (const q of neetQuestions) {
    const { options, ...questionData } = q;
    await prisma.question.create({
      data: { ...questionData, categoryId: neet.id, options: { create: options } },
    });
  }

  console.log("✅ NEET questions created");
  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });