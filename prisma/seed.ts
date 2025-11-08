// prisma/seed.ts
import prisma from "./client";

async function main() {
  await seedData();
  console.log("✅ Seed completed.");
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

// -------------------- DATA --------------------

const organizationRoles: Record<string, (string | null)[]> = {
  "CEO/Chair of Board": [
    "Jo-Anne Sinclair",
    "A chief executive officer, the highest-ranking person in a company or other institution, ultimately responsible for making managerial decisions."
  ],
  "COO/VP Operations": [
    "Jackson Smith",
    "The chief operating officer (COO) is responsible for executing and implementing the operational directives set by the CEO and the board of directors."
  ],
  "CFO/VP Administration": [
    "Susan Thomas",
    "A chief financial officer, a senior executive with responsibility for the financial affairs of a corporation or other institution. The vice president of administration position is responsible for directing all of the administrative functions of the corporation…"
  ],
  "VP Client Services": [
    "Richa Kaur",
    "Responsible for the Consumer Banking division …"
  ],
  "CIO": [
    "Josee Benjamin",
    "Chief Information Officer (CIO) …"
  ],
  "VP Sales & Marketing": ["Vincent Grey"],
  "Director Financial and Audit Svcs": [
    "Rupa Kharki (she/her/hers)",
    "Sometimes called a compliance manager …"
  ],
  "Director Human Resources": [
    "Xun Kuang",
    "HR may be responsible for a number of job duties …"
  ],
  "Director Legal Services/General Counsel": [
    "Stien Pedersen",
    "The senior executive managing legal affairs for the company."
  ],
  "Director Information Technology": [
    "Sandra Bear",
    "Manages the IT infrastructure, operations, and services …"
  ],
  "Director Information Security and CISSO": [
    "Gus Blue",
    "A chief information security officer (CISO) …"
  ],
  "Director Accounting": [
    "Sam Kong",
    "Is responsible for analysis and reconciliation of accounts …"
  ],
  "Director Physical Security": [
    "Valentine Smith",
    "Responsible for identifying, assessing, and integrating physical security …"
  ],
  "Director Facilities": ["Mariya Kaperski"],
  "Manager, Business Continuity and Disaster Recovery": [
    "Abd al-Hamid Alami",
    "Develop, maintain, and implement business continuity and disaster recovery …"
  ],
  "Manager, Internal Audit": [
    "Victoria Gray",
    "Performs full audits including risk management …"
  ],
  "Chief Architect": ["Cheryl Guru"],
  "Manager, Security Architecture": [
    "Jean Ngoy",
    "Designs and oversees the implementation of security measures …"
  ],
  "Solution Architect, Online Banking": ["Kris Gold"],
  "Manager, Application Solutions": ["Isaac Smith"],
  "Lead Developer, Online Banking": ["Payton Frost"],
  "Manager, Operational Risk": [
    "Samantha Nettle",
    "Responsible for monitoring, handling, and measuring operational and economic risk …"
  ],
  "Manager, Vendor Relations": ["Yolanda Ferreira"],
  "Manager, Purchasing": [
    "Samir Hassan",
    "Responsible for leading all global procurement efforts …"
  ],
  "Manager, Communications": ["Yuna Aikawa"],
  "Manager Customer Experience and Community Eng.": [
    "Jonathan Carberry",
    "The major goal of CEM is to foster customer loyalty …"
  ],
  "Manager of Sales": [
    "Roland Wei",
    "Leads a sales team by providing guidance, training, and mentorship …"
  ],
  "Manager, Marketing": [
    "Pran Singh",
    "Responsible for developing, implementing, and executing strategic marketing plans …"
  ],
  "Business Analyst, Online Banking": ["Linda Analyst"],
  "Manager, Contract Management": ["Esra Sedge"],
  "Manager, Compliance Management": ["Pranee Tan"],
  "Manager IT End User Service Desk": [
    "Karmen Spruce",
    "Responsible for managing daily operations of the service desk …"
  ],
  "Manager IT End User Computing": [
    "Haydar Katirci",
    "Delivers operational day-to-day support for the operations of end-user computing …"
  ],
  "Manager IT Telecom and Infrastructure": [
    "Jill Harkness",
    "Responsible for the daily operations of infrastructure and telecom …"
  ],
  "Manager, Data Center and Hosting Services": [
    "Tim Morrison",
    "Responsible for the day-to-day operations of the datacenter …"
  ],
  "Manager of IT Risk Management": [
    "Aleksandr Milosevic",
    "Responsible for identifying, assessing, and mitigating risks …"
  ],
  "Manager IT, project management office": ["Jim Wingnut"],
  "Left Vacant for future expansion": [null]
};

const departments: Record<string, string[]> = {
  Administration: ["Zoë Robins", "Madeleine Madden"],
  Audit: ["Josha Sadowski", "Kate Fleetwood"],
  BankingOperations: [
    "Priyanka Bose",
    "Hammed Animashaun",
    "Álvaro Morte",
    "Taylor Napier",
    "Alan Simmonds"
  ],
  Communications: ["Gil Cardinal", "Richard J. Lewis"],
  CorporateServices: ["Randy Bradshaw", "Tracey Cook", "Lubomir Mykytiuk"],
  Facilities: ["Dakota House", "Lori Lea Okemah", "Renae Morrisseau", "Rick Belcourt"],
  FinancialServices: [
    "Selina Hanusa",
    "Buffy Gaudry",
    "Shaneen Ann Fox",
    "Allan Little",
    "Danny Rabbit"
  ],
  HumanResources: [
    "Jesse Ed aure",
    "Stacy Da Silva",
    "Vladimír Valenta",
    "Samone Sayeses-Whitney",
    "Paul Coeur"
  ],
  InformationTechnology: ["Graham Greene", "Sandika Evergreen", "Jennifer Rodriguez"],
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
    "Onatah Redhawk"
  ]
};

// -------------------- SEED LOGIC --------------------

async function seedData() {
  // clear in FK order
  await prisma.employee.deleteMany();
  await prisma.role.deleteMany();

  // 1) create roles (capture ids)
  const roleNameToId: Record<string, string> = {};

  for (const [roleName, payload] of Object.entries(organizationRoles)) {
    const description =
      Array.isArray(payload) && payload.length > 1 ? payload[1] : null;

    const role = await prisma.role.create({
      data: {
        name: roleName,
        description: description ?? null
      }
    });

    roleNameToId[roleName] = role.id;
  }

  // 2) map person name -> roleId (for roles that list a main person)
  const personToRoleId: Record<string, string> = {};
  for (const [roleName, payload] of Object.entries(organizationRoles)) {
    const person = Array.isArray(payload) ? payload[0] : null;
    if (person) {
      const clean = person.split("(")[0].trim();
      personToRoleId[clean] = roleNameToId[roleName];
    }
  }

  // 3) create employees per department (NO email anymore)
  for (const [departmentName, emps] of Object.entries(departments)) {
    for (const fullName of emps) {
      const cleanName = fullName.split("(")[0].trim();
      const maybeRoleId = personToRoleId[cleanName] ?? null;

      await prisma.employee.create({
        data: {
          name: fullName,
          department: departmentName,
          roleId: maybeRoleId
        }
      });
    }
  }
}
