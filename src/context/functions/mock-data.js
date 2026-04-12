const sections = ['news', 'sports', 'literary', 'opinion', 'general', 'sci-tech', 'feature'];

const sectionLabels = {
  news: 'News',
  sports: 'Sports',
  literary: 'Literary',
  opinion: 'Opinion',
  general: 'General',
  'sci-tech': 'Sci-Tech',
  feature: 'Feature',
};

export { sectionLabels };

const loremContent = `
<p>In the grand tapestry of academic life, moments of transformation often arrive unannounced. The corridors of learning, once silent witnesses to routine, now echo with the vibrant energy of change—a change that promises to redefine not just how we learn, but how we perceive the very essence of education.</p>

<p>The initiative, spearheaded by a coalition of visionary educators and passionate students, represents a paradigm shift in institutional thinking. Where once bureaucratic inertia stifled innovation, there now exists a fertile ground for experimentation and growth.</p>

<h2>A New Chapter Begins</h2>

<p>"We are not merely adapting to the times," explained the project lead during last week's assembly. "We are actively shaping the future of education within these walls. Every student who walks through our gates deserves an experience that prepares them for a world we cannot yet fully imagine."</p>

<p>The numbers speak volumes. Since the program's inception, student engagement has surged by forty-three percent, while collaborative projects between departments have tripled. These are not abstract statistics—they represent real stories of students finding their voice, their passion, and their purpose.</p>

<h2>Community Response</h2>

<p>The broader community has taken notice. Local organizations have expressed interest in partnerships, recognizing the institution's commitment to producing not just graduates, but thoughtful citizens equipped to navigate complexity with grace and determination.</p>

<p>As the semester progresses, the full impact of these changes will become increasingly apparent. What remains clear, however, is that the seeds of transformation have been sown—and they are already beginning to bloom.</p>
`;

const articleTemplates = [
  { title: "Breaking New Ground: University Unveils Revolutionary Campus Design", section: 'news' },
  { title: "The Silent Revolution in Student Governance", section: 'news' },
  { title: "Beyond the Classroom: Redefining Experiential Learning", section: 'news' },
  { title: "Championship Dreams: The Rise of Our Athletics Program", section: 'sports' },
  { title: "Against All Odds: The Underdog Season That Captivated a Campus", section: 'sports' },
  { title: "The Art of Discipline: How Student-Athletes Balance Life", section: 'sports' },
  { title: "Whispers of the Forgotten Garden — A Short Story", section: 'literary' },
  { title: "Verses from the Margin: Poetry of Displacement", section: 'literary' },
  { title: "The Weight of Unspoken Words — A Creative Essay", section: 'literary' },
  { title: "Why We Must Rethink Digital Literacy in Higher Education", section: 'opinion' },
  { title: "The Case for Compassionate Leadership on Campus", section: 'opinion' },
  { title: "An Open Letter to the Future Generation of Thinkers", section: 'opinion' },
  { title: "Infrastructure Overhaul Promises a Greener, Smarter Campus", section: 'news' },
  { title: "From Local Courts to National Glory: A Basketball Chronicle", section: 'sports' },
  { title: "Echoes of Home: An Anthology of Belonging", section: 'literary' },
  { title: "The Paradox of Progress: Are We Moving Too Fast?", section: 'opinion' },
  { title: "New Research Lab Opens Doors to Innovation", section: 'news' },
  { title: "The Mental Game: Psychology in Competitive Sports", section: 'sports' },
  { title: "Letters Never Sent — Prose Poetry Collection", section: 'literary' },
  { title: "Reimagining Student Welfare in a Post-Pandemic World", section: 'opinion' },
  { title: "Faculty Senate Approves Sweeping Curriculum Reforms", section: 'news' },
  { title: "Swimming to Success: The Aquatics Team's Remarkable Journey", section: 'sports' },
  { title: "The Architecture of Silence — An Experimental Narrative", section: 'literary' },
  { title: "Social Media and the Student Voice: A Double-Edged Sword", section: 'opinion' },
  { title: "Scholarship Program Expands Access for Underserved Communities", section: 'news' },
  { title: "Track and Field: Breaking Records, Building Character", section: 'sports' },
  { title: "Cartography of Dreams — Visual Poetry", section: 'literary' },
  { title: "The Ethics of AI in Academic Research", section: 'opinion' },
  { title: "International Exchange Program Sees Record Participation", section: 'news' },
  { title: "Women in Sports: Shattering Glass Ceilings on the Field", section: 'sports' },
  { title: "Fragments of Light — A Photographic Essay in Words", section: 'literary' },
  { title: "Democracy on Campus: Why Every Vote Counts", section: 'opinion' },
  { title: "Student Council Launches Community Outreach Initiative", section: 'general' },
  { title: "Campus Safety Protocols Updated for New Academic Year", section: 'general' },
  { title: "Annual University Day Celebration Draws Record Attendance", section: 'general' },
  { title: "AI-Powered Research Tools Transform Student Projects", section: 'sci-tech' },
  { title: "Engineering Students Build Solar-Powered Water Purifier", section: 'sci-tech' },
  { title: "New Computer Lab Features Cutting-Edge VR Equipment", section: 'sci-tech' },
  { title: "Behind the Scenes: The Making of the University Film Festival", section: 'feature' },
  { title: "A Day in the Life of a Student-Athlete Scholar", section: 'feature' },
  { title: "From Classroom to Career: Alumni Success Stories", section: 'feature' },
];

const authorNames = [
  'Sofia Reyes', 'Marco Villanueva', 'Isabella Cruz', 'Gabriel Santos',
  'Camille Tan', 'Rafael Aquino', 'Luna Bautista', 'Diego Fernandez',
  'Aria Mendoza', 'Mateo Rivera'
];

const generateDate = (index) => {
  const base = new Date(2025, 11, 20);
  base.setDate(base.getDate() - index * 2);
  return base.toISOString().split('T')[0];
};

export const articles = articleTemplates.map((template, i) => ({
  id: `article-${i + 1}`,
  title: template.title,
  slug: template.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
  excerpt: `A compelling exploration into ${template.section === 'literary' ? 'the depths of creative expression' : template.section === 'sports' ? 'the world of competitive athletics' : template.section === 'opinion' ? 'critical perspectives shaping discourse' : 'the latest developments shaping our community'}. This piece invites readers to engage with ideas that challenge convention and inspire thoughtful reflection.`,
  content: loremContent,
  section: template.section,
  authors: [authorNames[i % authorNames.length], ...(i % 3 === 0 ? [authorNames[(i + 3) % authorNames.length]] : [])],
  date: generateDate(i),
  thumbnail: null,
  featured: i < 5,
}));
