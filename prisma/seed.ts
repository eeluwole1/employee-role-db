
import prisma from "./client";

function makeEmail(name: string, fallbackDept = "general"): string {
  if (!name) {
    return `unknown.${fallbackDept.toLowerCase()}@bank.local`;
  }

  const normalized = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const parts = normalized.split(/\s+/).filter(Boolean);
  const emailName =
    parts.length >= 2
      ? `${parts[0].toLowerCase()}.${parts[parts.length - 1].toLowerCase()}`
      : parts[0].toLowerCase();
  return `${emailName}@bank.local`;
}

const organizationData = {
  role: {
    "CEO/Chair of Board": [
      "Jo-Anne Sinclair",
      "A chief executive officer, the highest-ranking person in a company or other institution, ultimately responsible for making managerial decisions.",
    ],
    "COO/VP Operations": [
      "Jackson Smith",
      "The chief operating officer (COO) is responsible for executing and implementing the operational directives set by the CEO and the board of directors.",
    ],
    "CFO/VP Administration": [
      "Susan Thomas",
      "A chief financial officer, a senior executive with responsibility for the financial affairs of a corporation or other institution. The vice president of administration position is responsible for directing all of the administrative functions of the corporation in accordance with industry standards, where applicable, regulatory agencies, as appropriate and company objectives and policies.",
    ],
    "VP Client Services": [
      "Richa Kaur",
      "Responsible for the Consumer Banking division performing a variety of roles including lending, investing, risk management, marketing, and technology...",
    ],
    CIO: [
      "Josee Benjamin",
      "Chief Information Officer (CIO) ... responsible for IT and digital systems.",
    ],
    "VP Sales & Marketing": ["Vincent Grey"],
    "Director Financial and Audit Svcs": [
      "Rupa Kharki (she/her/hers)",
      "Ensures the company conducts its business in full compliance...",
    ],
    "Director Human Resources": [
      "Xun Kuang",
      "HR may be responsible for a number of job duties...",
    ],
    "Director Legal Services/General Counsel": [
      "Stien Pedersen",
      "The senior executive managing legal affairs for the company.",
    ],
    "Director Information Technology": [
      "Sandra Bear",
      "Manages the IT infrastructure, operations, and services...",
    ],
    "Director Information Security and CISSO": [
      "Gus Blue",
      "Responsible for establishing and maintaining the security vision...",
    ],
    "Manager, Business Continuity and Disaster Recovery": [
      "Abd al-Hamid Alami",
      "Develop, maintain, and implement business continuity and disaster recovery strategies...",
    ],
    "Manager, Internal Audit": [
      "Victoria Gray",
      "Performs full audits including risk management...",
    ],
    "Manager IT End User Service Desk": [
      "Karmen Spruce",
      "Responsible for managing daily operations of the service desk...",
    ],
    "Manager IT Telecom and Infrastructure": [
      "Jill Harkness",
      "Responsible for the daily operations of infrastructure and telecom...",
    ],
    "Manager of Sales": [
      "Roland Wei",
      "Leads a sales team by providing guidance, training, and mentorship...",
    ],
    "Left Vacant for future expansion": [null],
  },
};


const departmentData = {
  departments: {
    Administration: ["Zoë Robins", "Madeleine Madden"],
    Audit: ["Josha Sadowski", "Kate Fleetwood"],
    BankingOperations: [
      "Priyanka Bose",
      "Hammed Animashaun",
      "Álvaro Morte",
      "Taylor Napier",
      "Alan Simmonds",
    ],
    Communications: ["Gil Cardinal", "Richard J. Lewis"],
    CorporateServices: ["Randy Bradshaw", "Tracey Cook", "Lubomir Mykytiuk"],
    Facilities: [
      "Dakota House",
      "Lori Lea Okemah",
      "Renae Morrisseau",
      "Rick Belcourt",
    ],
    FinancialServices: [
      "Selina Hanusa",
      "Buffy Gaudry",
      "Shaneen Ann Fox",
      "Allan Little",
      "Danny Rabbit",
    ],
    HumanResources: [
      "Jesse Ed aure",
      "Stacy Da Silva",
      "Vladimír Valenta",
      "Samone Sayeses-Whitney",
      "Paul Coeur",
    ],
    InformationTechnology: [
      "Graham Greene",
      "Sandika Evergreen",
      "Jennifer Rodriguez",
    ],
    ItTechnician: [
      "Aiyana Littlebear",
      "Inara Thunderbird",
      "Kaya Runningbrook",
      "Elara Firehawk",
      "Siona Moonflower",
      "Kaiyu Greywolf",
      "Ayawamat Nightwind",
      "Tala Braveheart",
      "Iniko Stonebear",
      "Onatah Redhawk",
    ],
  },
};

async function seedData() {
  await prisma.employee.deleteMany();
  await prisma.role.deleteMany();

  console.log("cleared employee and role tables");

 
  const roleMap = new Map<string, string>(); 

  for (const [roleName, value] of Object.entries(organizationData.role)) {
    const personName = value[0];
    const description = value[1] ?? null;

    const role = await prisma.role.create({
      data: {
        name: roleName,
        description: description,
      },
    });

    roleMap.set(roleName, role.id);

    if (personName) {
      await prisma.employee.create({
        data: {
          name: personName,
          email: makeEmail(personName, "executive"),
          department: "Executive",
          roleId: role.id,
        },
      });
    }
  }

  console.log("seeded org roles + executive employees");

  const inserted = new Set<string>();

  for (const [deptName, employees] of Object.entries(
    departmentData.departments
  )) {
    for (const empName of employees) {
      if (!empName) {
        continue;
      }
      if (inserted.has(empName)) {
        continue;
      }

      await prisma.employee.create({
        data: {
          name: empName,
          email: makeEmail(empName, deptName),
          department: deptName,
          roleId: null,
        },
      });

      inserted.add(empName);
    }
  }

  console.log("seeded department employees");

  console.log("Seeding completed!");
}

async function main() {
  await seedData();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
