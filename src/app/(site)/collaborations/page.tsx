// app/collaborations/page.tsx
import CollaborationComponent from './CollaborationComponent';

const sampleCollaborationData = {
  partners: [
    {
      id: 1,
      name: "Stanford University",
      logo: "stanford.png",
      description: "World-renowned research university in Silicon Valley, collaborating on AI research and technology innovation programs.",
      website_url: "https://www.stanford.edu",
      category: "university",
      country: "USA",
      established_year: 1885,
      key_projects: ["AI Research Initiative", "Tech Entrepreneurship Program", "Sustainable Energy Research"]
    },
    {
      id: 2,
      name: "Microsoft Corporation",
      logo: "microsoft.png",
      description: "Global technology company partnering on digital transformation and cloud computing initiatives for education.",
      website_url: "https://www.microsoft.com",
      category: "corporation",
      country: "USA",
      established_year: 1975,
      key_projects: ["Azure for Education", "Digital Skills Training", "AI Development Platform"]
    },
    {
      id: 3,
      name: "University of Oxford",
      logo: "oxford.png",
      description: "Historic university collaborating on medical research, public policy studies, and global education initiatives.",
      website_url: "https://www.ox.ac.uk",
      category: "university",
      country: "UK",
      established_year: 1096,
      key_projects: ["Global Health Research", "Public Policy Studies", "Cultural Exchange Program"]
    },
    {
      id: 4,
      name: "Siemens AG",
      logo: "siemens.png",
      description: "German multinational conglomerate collaborating on industrial automation and sustainable energy projects.",
      website_url: "https://www.siemens.com",
      category: "corporation",
      country: "Germany",
      established_year: 1847,
      key_projects: ["Smart Manufacturing", "Renewable Energy Solutions", "Digital Twin Technology"]
    },
    {
      id: 5,
      name: "National University of Singapore",
      logo: "nus.png",
      description: "Asia's leading university partnering on Asian studies, business innovation, and technology research.",
      website_url: "https://www.nus.edu.sg",
      category: "university",
      country: "Singapore",
      established_year: 1905,
      key_projects: ["Asian Business Studies", "Tech Innovation Hub", "Maritime Research"]
    },
    {
      id: 6,
      name: "United Nations Development Programme",
      logo: "undp.png",
      description: "UN agency collaborating on sustainable development goals and poverty alleviation initiatives worldwide.",
      website_url: "https://www.undp.org",
      category: "nonprofit",
      country: "Global",
      established_year: 1965,
      key_projects: ["Sustainable Development Goals", "Poverty Alleviation", "Climate Action"]
    },
    {
      id: 7,
      name: "Massachusetts Institute of Technology",
      logo: "mit.png",
      description: "Premier institution for science and technology research, collaborating on cutting-edge innovation projects.",
      website_url: "https://www.mit.edu",
      category: "university",
      country: "USA",
      established_year: 1861,
      key_projects: ["Quantum Computing Research", "Biotech Innovation", "Space Technology"]
    },
    {
      id: 8,
      name: "Samsung Electronics",
      logo: "samsung.png",
      description: "Global electronics manufacturer partnering on semiconductor research and smart technology development.",
      website_url: "https://www.samsung.com",
      category: "corporation",
      country: "South Korea",
      established_year: 1938,
      key_projects: ["Semiconductor Research", "Smart Device Innovation", "5G Technology"]
    },
    {
      id: 9,
      name: "Australian Government - DFAT",
      logo: "australia-gov.png",
      description: "Australian government department collaborating on international education and development programs.",
      website_url: "https://www.dfat.gov.au",
      category: "government",
      country: "Australia",
      key_projects: ["Education Partnerships", "Development Aid Programs", "Cultural Exchange"]
    },
    {
      id: 10,
      name: "ETH Zurich",
      logo: "ethz.png",
      description: "Swiss federal institute of technology collaborating on engineering excellence and scientific research.",
      website_url: "https://www.ethz.ch",
      category: "university",
      country: "Switzerland",
      established_year: 1855,
      key_projects: ["Engineering Research", "Material Science", "Robotics Innovation"]
    },
    {
      id: 11,
      name: "World Health Organization",
      logo: "who.png",
      description: "UN specialized agency for international public health, collaborating on global health initiatives.",
      website_url: "https://www.who.int",
      category: "nonprofit",
      country: "Global",
      established_year: 1948,
      key_projects: ["Global Health Security", "Disease Prevention", "Healthcare Access"]
    },
    {
      id: 12,
      name: "Tsinghua University",
      logo: "tsinghua.png",
      description: "Leading Chinese university collaborating on technology transfer and innovation ecosystem development.",
      website_url: "https://www.tsinghua.edu.cn",
      category: "university",
      country: "China",
      established_year: 1911,
      key_projects: ["Tech Transfer Programs", "Innovation Ecosystem", "AI Research Center"]
    }
  ],
  stats: {
    total_partners: 125,
    universities_count: 68,
    corporations_count: 42,
    countries_count: 35,
    ongoing_projects: 89
  },
  featured_partners: [
    {
      id: 1,
      name: "Stanford University",
      logo: "stanford.png",
      description: "World-renowned research university in Silicon Valley, collaborating on AI research and technology innovation programs.",
      website_url: "https://www.stanford.edu",
      category: "university",
      country: "USA",
      established_year: 1885
    },
    {
      id: 2,
      name: "Microsoft Corporation",
      logo: "microsoft.png",
      description: "Global technology company partnering on digital transformation and cloud computing initiatives for education.",
      website_url: "https://www.microsoft.com",
      category: "corporation",
      country: "USA",
      established_year: 1975
    },
    {
      id: 6,
      name: "United Nations Development Programme",
      logo: "undp.png",
      description: "UN agency collaborating on sustainable development goals and poverty alleviation initiatives worldwide.",
      website_url: "https://www.undp.org",
      category: "nonprofit",
      country: "Global",
      established_year: 1965
    }
  ]
};

export default function CollaborationsPage() {

  
  return <CollaborationComponent  />;
}