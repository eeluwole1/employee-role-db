// prisma/seed.ts
import prisma from "./client";

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

// helper to make emails from names
function makeEmail(name: string, dept?: string): string {
  const base = name
    .normalize("NFD") // remove accents
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .trim()
    .replace(/\s+/g, ".")
    .toLowerCase();

  const deptPart = dept ? dept.toLowerCase() : "corp";
  return `${base}@${deptPart}.example.com`;
}

async function main() {
  await seedData();
}

async function seedData() {
  // 1. clear tables (employees before roles because of FK)
  await prisma.employee.deleteMany();
  await prisma.role.deleteMany();

  // 2. source data (copied from your frontend)
  const organizationRoles = {
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
      "A chief financial officer, a senior executive with responsibility for the financial affairs of a corporation or other institution. The vice president of administration position is responsible for directing all of the administrative functions of the corporation in accordance with industry standards, where applicable, regulatory agencies, as appropriate and company objectives and policies."
    ],
    "VP Client Services": [
      "Richa Kaur",
      "Responsible for the Consumer Banking division performing a variety of roles including lending, investing, risk management, marketing, and technology. Their team provides a suite of solutions to help our retail customers meet their financial goals. Also responsible for the Commercial Banking Division performing a variety of roles including lending, investing, risk management, marketing, and technology. Their team provides a suite of solutions to help our retail customers meet their financial goals."
    ],
    "CIO": [
      "Josee Benjamin",
      "Chief Information Officer (CIO), chief digital information officer (CDIO) or information technology (IT) director is a job title commonly given to the most senior executive in a bank responsible for the traditional information technology and computer systems that support bank goals."
    ],
    "VP Sales & Marketing": ["Vincent Grey"],
    "Director Financial and Audit Svcs": [
      "Rupa Kharki (she/her/hers)",
      "Sometimes called a compliance manager, this role ensures the company conducts its business in full compliance with all national and international laws and regulations that pertain to its industry, as well as professional standards and accepted business practices."
    ],
    "Director Human Resources": [
      "Xun Kuang",
      "HR may be responsible for a number of job duties related to organizational development, recruitment and staffing, employment law, performance management, employee relations, and compensation and benefits."
    ],
    "Director Legal Services/General Counsel": [
      "Stien Pedersen",
      "The senior executive managing legal affairs for the company."
    ],
    "Director Information Technology": [
      "Sandra Bear",
      "Manages the IT infrastructure, operations, and services, and how it enables the organization to access and make use of data and services."
    ],
    "Director Information Security and CISSO": [
      "Gus Blue",
      "A chief information security officer (CISO) is the senior-level executive within an organization responsible for establishing and maintaining the security vision, strategy, and program to ensure information assets and technologies are adequately protected."
    ],
    "Director Accounting": [
      "Sam Kong",
      "Is responsible for analysis and reconciliation of accounts and for development and implementation of accounting policies, procedures, and controls."
    ],
    "Director Physical Security": [
      "Valentine Smith",
      "Responsible for identifying, assessing, and integrating physical security operations, technology, and policy solutions at the organization."
    ],
    "Director Facilities": ["Mariya Kaperski"],
    "Manager, Business Continuity and Disaster Recovery": [
      "Abd al-Hamid Alami",
      "Develop, maintain, and implement business continuity and disaster recovery strategies and solutions, including risk assessments, business impact analyses, strategy selection, and documentation of business continuity and disaster recovery procedures."
    ],
    "Manager, Internal Audit": [
      "Victoria Gray",
      "Performs full audits including risk management, control management, and assessing financial reliability to ensure compliance is met within all the company's systems."
    ],
    "Chief Architect": ["Cheryl Guru"],
    "Manager, Security Architecture": [
      "Jean Ngoy",
      "Designs and oversees the implementation of security measures for the organization's information systems, ensuring systems are resistant to potential threats and compliant with security policies and regulations."
    ],
    "Solution Architect, Online Banking": ["Kris Gold"],
    "Manager, Application Solutions": ["Isaac Smith"],
    "Lead Developer, Online Banking": ["Payton Frost"],
    "Manager, Operational Risk": [
      "Samantha Nettle",
      "Responsible for monitoring, handling, and measuring operational and economic risk exposures in order to minimize risk and place appropriate controls in place."
    ],
    "Manager, Vendor Relations": ["Yolanda Ferreira"],
    "Manager, Purchasing": [
      "Samir Hassan",
      "Responsible for leading all global procurement efforts to efficiently and effectively enable spend owners (business units and functional partners) to maximize the value they receive from suppliers to meet their objectives."
    ],
    "Manager, Communications": ["Yuna Aikawa"],
    "Manager Customer Experience and Community Eng.": [
      "Jonathan Carberry",
      "The major goal of CEM is to foster customer loyalty through high-quality interactions at each step. Customer experience managers are responsible for improving the experiences customers have with organizations, with the goal of increasing customer satisfaction."
    ],
    "Manager of Sales": [
      "Roland Wei",
      "Leads a sales team by providing guidance, training, and mentorship; setting sales quotas and goals; creating sales plans; analyzing data; assigning sales territories; and building the team."
    ],
    "Manager, Marketing": [
      "Pran Singh",
      "Responsible for developing, implementing, and executing strategic marketing plans for an entire organization (or lines of business and brands within an organization) in order to attract potential customers and retain existing ones."
    ],
    "Business Analyst, Online Banking": ["Linda Analyst"],
    "Manager, Contract Management": ["Esra Sedge"],
    "Manager, Compliance Management": ["Pranee Tan"],
    "Manager IT End User Service Desk": [
      "Karmen Spruce",
      "Responsible for managing daily operations of the service desk, managing the service desk team, representing the team to other elements of the organization, and ensuring that the service desk is constantly developing and improving."
    ],
    "Manager IT End User Computing": [
      "Haydar Katirci",
      "Delivers operational day-to-day support for the operations of end-user computing services organization-wide, in collaboration with third-party vendors."
    ],
    "Manager IT Telecom and Infrastructure": [
      "Jill Harkness",
      "Responsible for the daily operations of infrastructure and telecom, and infrastructure support staff; works with other business and IT teams to ensure that services and infrastructure needs are met."
    ],
    "Manager, Data Center and Hosting Services": [
      "Tim Morrison",
      "Responsible for the day-to-day operations of the datacenter, contracting cloud services, and ensuring high availability of data to stakeholders."
    ],
    "Manager of IT Risk Management": [
      "Aleksandr Milosevic",
      "Responsible for identifying, assessing, and mitigating risks that could potentially jeopardize an organization's assets, profitability, or existence."
    ],
    "Manager IT, project management office": ["Jim Wingnut"],
    "Left Vacant for future expansion": [null]
  };

  const departments = {
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

  // 3. create all roles first
  const roleNameToId: Record<string, string> = {};

  for (const [roleName, payload] of Object.entries(organizationRoles)) {
    // payload can be [person, desc] or [person] or [null]
    const mainPerson = Array.isArray(payload) ? payload[0] : null;
    const description =
      Array.isArray(payload) && payload.length > 1 ? payload[1] : null;

    const role = await prisma.role.create({
      data: {
        name: roleName,
        description: description ?? null
      }
    });

    roleNameToId[roleName] = role.id;

    // we will use mainPerson later to try to attach
  }

  // build a quick lookup: personName -> roleId (for the ones that have a main person)
  const personToRoleId: Record<string, string> = {};
  for (const [roleName, payload] of Object.entries(organizationRoles)) {
    const person = Array.isArray(payload) ? payload[0] : null;
    if (person) {
      // strip things like "(she/her/hers)"
      const cleanPerson = person.split("(")[0].trim();
      personToRoleId[cleanPerson] = roleNameToId[roleName];
    }
  }

  // 4. create employees from departments data
  for (const [departmentName, employees] of Object.entries(departments)) {
    for (const fullName of employees) {
      // try to match to a role holder
      const cleanName = fullName.split("(")[0].trim();
      const maybeRoleId = personToRoleId[cleanName];

      await prisma.employee.create({
        data: {
          name: fullName,
          email: makeEmail(fullName, departmentName),
          department: departmentName,
          roleId: maybeRoleId ?? null
        }
      });
    }
  }

  console.log("✅ Seed completed.");
}


