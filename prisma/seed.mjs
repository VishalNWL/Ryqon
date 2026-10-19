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
      // PHYSICS
    {
      title: "Work done in an isothermal process",
      description: "One mole of an ideal gas expands isothermally and reversibly at 300 K from 10 L to 100 L. What is the work done by the gas? (R = 8.314 J/mol·K)",
      subject: "Physics", chapter: "Thermodynamics", year: 2021, difficulty: "MEDIUM",
      options: [
        { label: "A", text: "-5.74 kJ", isCorrect: true },
        { label: "B", text: "-2.87 kJ", isCorrect: false },
        { label: "C", text: "+5.74 kJ", isCorrect: false },
        { label: "D", text: "+2.87 kJ", isCorrect: false },
      ],
    },
    {
      title: "Energy of electron in Bohr orbit",
      description: "The ground state energy of a hydrogen atom is -13.6 eV. What is the kinetic energy of the electron in this state?",
      subject: "Physics", chapter: "Atoms", year: 2020, difficulty: "EASY",
      options: [
        { label: "A", text: "-13.6 eV", isCorrect: false },
        { label: "B", text: "13.6 eV", isCorrect: true },
        { label: "C", text: "-27.2 eV", isCorrect: false },
        { label: "D", text: "27.2 eV", isCorrect: false },
      ],
    },
    // CHEMISTRY
    {
      title: "Unit of zero-order rate constant",
      description: "What is the unit of the rate constant (k) for a zero-order reaction?",
      subject: "Chemistry", chapter: "Chemical Kinetics", year: 2022, difficulty: "EASY",
      options: [
        { label: "A", text: "s⁻¹", isCorrect: false },
        { label: "B", text: "mol L⁻¹ s⁻¹", isCorrect: true },
        { label: "C", text: "L mol⁻¹ s⁻¹", isCorrect: false },
        { label: "D", text: "L² mol⁻² s⁻¹", isCorrect: false },
      ],
    },
    {
      title: "Most stable carbocation",
      description: "Which of the following carbocations is the most stable?",
      subject: "Chemistry", chapter: "Organic Chemistry - Some Basic Principles", year: 2021, difficulty: "MEDIUM",
      options: [
        { label: "A", text: "Primary (1°) carbocation", isCorrect: false },
        { label: "B", text: "Secondary (2°) carbocation", isCorrect: false },
        { label: "C", text: "Tertiary (3°) carbocation", isCorrect: true },
        { label: "D", text: "Methyl carbocation", isCorrect: false },
      ],
    },
    // MATHEMATICS
    {
      title: "Modulus of a complex number",
      description: "What is the modulus of the complex number z = 3 + 4i?",
      subject: "Mathematics", chapter: "Complex Numbers", year: 2023, difficulty: "EASY",
      options: [
        { label: "A", text: "5", isCorrect: true },
        { label: "B", text: "7", isCorrect: false },
        { label: "C", text: "25", isCorrect: false },
        { label: "D", text: "1", isCorrect: false },
      ],
    },
    {
      title: "Derivative of parametric functions",
      description: "If x = a cos(θ) and y = a sin(θ), then what is dy/dx?",
      subject: "Mathematics", chapter: "Continuity and Differentiability", year: 2020, difficulty: "MEDIUM",
      options: [
        { label: "A", text: "tan(θ)", isCorrect: false },
        { label: "B", text: "cot(θ)", isCorrect: false },
        { label: "C", text: "-cot(θ)", isCorrect: true },
        { label: "D", text: "-tan(θ)", isCorrect: false },
      ],
    },

    // PHYSICS - JEE
    {
      title: "Capacitance of a parallel plate capacitor",
      description: "A parallel plate capacitor has a capacitance of 10 μF without a dielectric. A dielectric slab of dielectric constant K = 2 is inserted between the plates, completely filling the space. What is the new capacitance?",
      subject: "Physics", chapter: "Electrostatic Potential and Capacitance", year: 2021, difficulty: "EASY",
      options: [
        { label: "A", text: "5 μF", isCorrect: false },
        { label: "B", text: "10 μF", isCorrect: false },
        { label: "C", text: "20 μF", isCorrect: true },
        { label: "D", text: "40 μF", isCorrect: false },
      ],
    },
    {
      title: "Magnetic field at the center of a circular loop",
      description: "A circular coil of radius R carries a current I. The magnetic field at its center is B. If the radius is doubled and the current is halved, the new magnetic field at the center will be:",
      subject: "Physics", chapter: "Moving Charges and Magnetism", year: 2022, difficulty: "MEDIUM",
      options: [
        { label: "A", text: "B/4", isCorrect: true },
        { label: "B", text: "B/2", isCorrect: false },
        { label: "C", text: "B", isCorrect: false },
        { label: "D", text: "2B", isCorrect: false },
      ],
    },
    {
      title: "Half-life of a radioactive substance",
      description: "A radioactive sample has a half-life of 10 days. What fraction of the sample remains undecayed after 30 days?",
      subject: "Physics", chapter: "Nuclei", year: 2020, difficulty: "EASY",
      options: [
        { label: "A", text: "1/2", isCorrect: false },
        { label: "B", text: "1/4", isCorrect: false },
        { label: "C", text: "1/8", isCorrect: true },
        { label: "D", text: "1/16", isCorrect: false },
      ],
    },
    // CHEMISTRY - JEE
    {
      title: "Number of lone pairs on Xe in XeF6",
      description: "In the molecule XeF₆, how many lone pairs of electrons are present on the central Xenon atom?",
      subject: "Chemistry", chapter: "The p-Block Elements", year: 2023, difficulty: "MEDIUM",
      options: [
        { label: "A", text: "0", isCorrect: false },
        { label: "B", text: "1", isCorrect: true },
        { label: "C", text: "2", isCorrect: false },
        { label: "D", text: "3", isCorrect: false },
      ],
    },
    {
      title: "IUPAC name of an organic compound",
      description: "What is the IUPAC name of CH₃-CH(OH)-CH₂-COOH?",
      subject: "Chemistry", chapter: "Organic Chemistry - Some Basic Principles", year: 2021, difficulty: "MEDIUM",
      options: [
        { label: "A", text: "3-hydroxybutanoic acid", isCorrect: true },
        { label: "B", text: "2-hydroxybutanoic acid", isCorrect: false },
        { label: "C", text: "4-hydroxybutanoic acid", isCorrect: false },
        { label: "D", text: "3-carboxypropan-2-ol", isCorrect: false },
      ],
    },
    {
      title: "Depression in freezing point",
      description: "The addition of a non-volatile solute to a solvent results in:",
      subject: "Chemistry", chapter: "Solutions", year: 2022, difficulty: "EASY",
      options: [
        { label: "A", text: "Lowering of vapor pressure and elevation of freezing point", isCorrect: false },
        { label: "B", text: "Elevation of boiling point and depression of freezing point", isCorrect: true },
        { label: "C", text: "Lowering of boiling point and depression of freezing point", isCorrect: false },
        { label: "D", text: "Elevation of vapor pressure and elevation of boiling point", isCorrect: false },
      ],
    },
    // MATHEMATICS - JEE
    {
      title: "Maximum value of a trigonometric function",
      description: "What is the maximum value of the function f(x) = 3sin(x) + 4cos(x)?",
      subject: "Mathematics", chapter: "Trigonometric Functions", year: 2021, difficulty: "MEDIUM",
      options: [
        { label: "A", text: "5", isCorrect: true },
        { label: "B", text: "7", isCorrect: false },
        { label: "C", text: "1", isCorrect: false },
        { label: "D", text: "12", isCorrect: false },
      ],
    },
    {
      title: "Number of solutions of a quadratic equation",
      description: "For what value of k does the equation x² - 4x + k = 0 have coincident (equal) roots?",
      subject: "Mathematics", chapter: "Quadratic Equations", year: 2022, difficulty: "EASY",
      options: [
        { label: "A", text: "2", isCorrect: false },
        { label: "B", text: "4", isCorrect: true },
        { label: "C", text: "8", isCorrect: false },
        { label: "D", text: "16", isCorrect: false },
      ],
    },
    {
      title: "Area bounded by a parabola",
      description: "Find the area bounded by the parabola y = x², the x-axis, and the lines x = 1 and x = 2.",
      subject: "Mathematics", chapter: "Application of Integrals", year: 2020, difficulty: "MEDIUM",
      options: [
        { label: "A", text: "7/3", isCorrect: true },
        { label: "B", text: "8/3", isCorrect: false },
        { label: "C", text: "3/2", isCorrect: false },
        { label: "D", text: "5/3", isCorrect: false },
      ],
    },
    {
      title: "Probability of rolling dice",
      description: "Two unbiased dice are thrown simultaneously. What is the probability of getting a sum of 9?",
      subject: "Mathematics", chapter: "Probability", year: 2023, difficulty: "EASY",
      options: [
        { label: "A", text: "1/9", isCorrect: true },
        { label: "B", text: "1/6", isCorrect: false },
        { label: "C", text: "1/12", isCorrect: false },
        { label: "D", text: "1/36", isCorrect: false },
      ],
    }
  ];

  for (const q of jeeQuestions) {
    const { options, ...questionData } = q;
    await prisma.question.create({
      data: { ...questionData, categoryId: jee.id, options: { create: options } },
    });
  }

  console.log(`✅ ${jeeQuestions.length} JEE questions created`);

  // const neetQuestions = [
  //   // BIOLOGY
  //   {
  //     title: "Site of translation",
  //     description: "Translation or protein synthesis occurs in which cellular organelle?",
  //     subject: "Biology", chapter: "Molecular Basis of Inheritance", year: 2021, difficulty: "EASY",
  //     options: [
  //       { label: "A", text: "Nucleus", isCorrect: false },
  //       { label: "B", text: "Ribosome", isCorrect: true },
  //       { label: "C", text: "Mitochondria", isCorrect: false },
  //       { label: "D", text: "Lysosome", isCorrect: false },
  //     ],
  //   },
  //   {
  //     title: "Universal blood donor",
  //     description: "Which blood group is considered the universal donor?",
  //     subject: "Biology", chapter: "Body Fluids and Circulation", year: 2020, difficulty: "EASY",
  //     options: [
  //       { label: "A", text: "AB positive", isCorrect: false },
  //       { label: "B", text: "O positive", isCorrect: false },
  //       { label: "C", text: "O negative", isCorrect: true },
  //       { label: "D", text: "AB negative", isCorrect: false },
  //     ],
  //   },
  //   {
  //     title: "C4 plants leaf anatomy",
  //     description: "The characteristic leaf anatomy found in C4 plants is known as:",
  //     subject: "Biology", chapter: "Photosynthesis in Higher Plants", year: 2022, difficulty: "MEDIUM",
  //     options: [
  //       { label: "A", text: "Kranz anatomy", isCorrect: true },
  //       { label: "B", text: "Spongy anatomy", isCorrect: false },
  //       { label: "C", text: "Palisade anatomy", isCorrect: false },
  //       { label: "D", text: "Reticulate anatomy", isCorrect: false },
  //     ],
  //   },
  //   {
  //     title: "Hormone for milk ejection",
  //     description: "Which hormone is responsible for milk ejection from the mammary glands after childbirth?",
  //     subject: "Biology", chapter: "Chemical Coordination and Integration", year: 2019, difficulty: "MEDIUM",
  //     options: [
  //       { label: "A", text: "Prolactin", isCorrect: false },
  //       { label: "B", text: "Oxytocin", isCorrect: true },
  //       { label: "C", text: "Estrogen", isCorrect: false },
  //       { label: "D", text: "Progesterone", isCorrect: false },
  //     ],
  //   },
  //   // CHEMISTRY (NEET)
  //   {
  //     title: "Most electronegative element",
  //     description: "Among the halogens, which element has the highest electronegativity?",
  //     subject: "Chemistry", chapter: "Periodic Properties", year: 2021, difficulty: "EASY",
  //     options: [
  //       { label: "A", text: "Chlorine", isCorrect: false },
  //       { label: "B", text: "Bromine", isCorrect: false },
  //       { label: "C", text: "Fluorine", isCorrect: true },
  //       { label: "D", text: "Iodine", isCorrect: false },
  //     ],
  //   },
  //   {
  //     title: "Geometry of Ammonia",
  //     description: "The geometry of an ammonia (NH₃) molecule is:",
  //     subject: "Chemistry", chapter: "Chemical Bonding", year: 2022, difficulty: "MEDIUM",
  //     options: [
  //       { label: "A", text: "Tetrahedral", isCorrect: false },
  //       { label: "B", text: "Trigonal planar", isCorrect: false },
  //       { label: "C", text: "Trigonal pyramidal", isCorrect: true },
  //       { label: "D", text: "Linear", isCorrect: false },
  //     ],
  //   },
  //   // PHYSICS (NEET)
  //   {
  //     title: "Dimensions of Universal Gravitational Constant",
  //     description: "The dimensional formula of the Universal Gravitational Constant (G) is:",
  //     subject: "Physics", chapter: "Units and Measurements", year: 2020, difficulty: "MEDIUM",
  //     options: [
  //       { label: "A", text: "[M⁻¹ L³ T⁻²]", isCorrect: true },
  //       { label: "B", text: "[M¹ L² T⁻²]", isCorrect: false },
  //       { label: "C", text: "[M⁻¹ L² T⁻²]", isCorrect: false },
  //       { label: "D", text: "[M¹ L³ T⁻¹]", isCorrect: false },
  //     ],
  //   },
  //   {
  //     title: "Energy of a photon",
  //     description: "The energy of a photon of wavelength λ is given by:",
  //     subject: "Physics", chapter: "Dual Nature of Radiation and Matter", year: 2023, difficulty: "EASY",
  //     options: [
  //       { label: "A", text: "hcλ", isCorrect: false },
  //       { label: "B", text: "hc/λ", isCorrect: true },
  //       { label: "C", text: "λ/hc", isCorrect: false },
  //       { label: "D", text: "hλ/c", isCorrect: false },
  //     ],
  //   }
  // ];

//   for (const q of neetQuestions) {
//     const { options, ...questionData } = q;
//     await prisma.question.create({
//       data: { ...questionData, categoryId: neet.id, options: { create: options } },
//     });
//   }

//   console.log(`✅ ${neetQuestions.length} NEET questions created`);
//   console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });