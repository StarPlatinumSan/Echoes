export interface LoreSection {
	title: string;
	body: string;
}

export interface LocationLink {
	url?: string;
	label?: string;
}

export interface Story {
	id: string;
	title: string;
	format: string;
	synopsis: string;
	image: string;
	url: string;
	buttonLabel: string;
}

export interface Location {
	id: string;
	name: string;
	category: string;
	x: number;
	y: number;
	image?: string;
	fallbackImage?: string;
	population?: string;
	description?: string;
	link?: LocationLink;
	sections?: LoreSection[];
	stories?: Story[];
}

interface ZoneDraft {
	id: string;
	name: string;
	x: number;
	y: number;
}

// Ordered visually from north to south, and left to right within each row.
// Coordinates are normalized against the complete 16384×12288 map image.
const zoneDrafts: ZoneDraft[] = [
	{ id: "zone-01", name: "Zone 01", x: 0.429074, y: 0.035881 },
	{ id: "zone-02", name: "Zone 02", x: 0.466589, y: 0.073323 },
	{ id: "zone-03", name: "Zone 03", x: 0.588511, y: 0.074883 },
	{ id: "zone-04", name: "Zone 04", x: 0.028136, y: 0.198128 },
	{ id: "zone-05", name: "Zone 05", x: 0.22626, y: 0.25273 },
	{ id: "zone-06", name: "Zone 06", x: 0.407972, y: 0.201248 },
	{ id: "zone-07", name: "Zone 07", x: 0.7034, y: 0.237129 },
	{ id: "zone-08", name: "Zone 08", x: 0.309496, y: 0.319813 },
	{ id: "zone-09", name: "Zone 09", x: 0.502931, y: 0.305772 },
	{ id: "zone-10", name: "Zone 10", x: 0.214537, y: 0.427457 },
	{ id: "zone-11", name: "Zone 11", x: 0.321219, y: 0.485179 },
	{ id: "zone-12", name: "Zone 12", x: 0.379836, y: 0.472699 },
	{ id: "zone-13", name: "Zone 13", x: 0.567409, y: 0.446178 },
	{ id: "zone-14", name: "Zone 14", x: 0.148886, y: 0.638066 },
	{ id: "zone-15", name: "Zone 15", x: 0.440797, y: 0.606864 },
	{ id: "zone-16", name: "Zone 16", x: 0.325909, y: 0.687988 },
	{ id: "zone-17", name: "Zone 17", x: 0.4068, y: 0.723869 },
	{ id: "zone-18", name: "Zone 18", x: 0.124267, y: 0.929797 },
];

interface LocationDetails {
	name: string;
	image?: string;
	population?: string;
	description: string;
	link?: LocationLink;
	sections?: LoreSection[];
	stories?: Story[];
}

const locationDetails: LocationDetails[] = [
	{
		name: "Neovia",
		image: "/images/locations/Neovia.jpg",
		population: "11 000 000",
		description:
			"Neovia is the northernmost city on the continent of Echoes. Renowned for its radiant neon skyline and towering neo-architecture, the city stands at the forefront of technological innovation. Its technocratic government and progress-driven economy have transformed Neovia into a powerful supernation and one of the continent’s wealthiest and most prosperous societies.",
	},
	{
		name: "My Portfolio",
		population: "1",
		description: "Click the link below to access my Portfolio website.",
		link: {
			url: "https://portfolio-star.up.railway.app/",
			label: "Visit portfolio",
		},
	},
	{
		name: "Europa",
		image: "/images/locations/Europa.png",
		population: "17 000 000",
		description:
			"Europa, the Timeless City, is home to the continent's foremost University of Chronurgy, where the mysteries of time are studied, mastered, and reshaped. Widely regarded as the birthplace of the Steampunk Era in Echoes, this supernation continues to thrive through its command of clockwork technology and temporal science. Though only the fourth most populous nation on the continent, Europa remains one of its most dynamic and influential, an ever-evolving metropolis where the past, present, and future converge.",
	},
	{
		name: "Edmonton",
		image: "/images/locations/Edmonton.png",
		link: { label: "Coming soon" },
		description:
			"Echoes of Freedom is a soon-to-be published D&D 5e one-shot set in Edmonton, a mysterious city hidden within the Sealed Continent. Once home to one of the world’s foremost anomaly research laboratories, Edmonton severed all contact with the outside world after harnessing a Thaumiel-class anomaly capable of shielding the city from the Rapture.",
	},
	{
		name: "Copperbraum",
		image: "/images/locations/Copperbraum.jpg",
		population: "3 000 000",
		description:
			"the city of dwarves and gnomes, is also known as the City of Copper. Built across rugged hills and sustained by a thriving mining economy, its streets glow with molten metal and roaring furnaces. Despite the surrounding climate, the constant use of lava and industrial forges makes Copperbraum one of the hottest cities on the continent with an average temperature of 44 degrees during the day and 35 at night.",
	},
	{
		name: "Fjellgard",
		image: "/images/locations/Fjellgard.png",
		population: "1 000 000",
		description:
			"Deep within the coldest reaches of the continent, nestled between the tallest mountains of Echoes, stands a city built to endure the endless frost. At its heart burns a colossal central furnace that protects its population from the deadly cold. Life here is quiet and unhurried, with most inhabitants relying on hunting, fishing, and coal extraction to live.",
	},
	{
		name: "Drakya",
		image: "/images/locations/Drakonia.png",
		population: "2 700 000",
		description:
			"Scattered throughout the jungles of the Far East lies a peaceful Dragonborn nation whose capital, Drakya, stands as its prosperous heart. Welcoming Dragonborns of every lineage, the city is a haven where they can coexist, preserve their traditions, and progress together.",
	},
	{
		name: "Ironhaven",
		image: "/images/locations/Ironhaven.jpg",
		population: "6 000 000",
		description:
			"The City of Iron lives up to its name. A seemingly flawless supernation, Ironhaven stands as one of the few civilizations to have achieved something resembling a true utopia, or at least, that is the image it presents to the outside world.",
	},
	{
		name: "The Republic",
		image: "/images/locations/Republic.jpg",
		population: "23 000 000",
		description:
			"The Republic is the second-most populous supernation in the world and a nation unlike any other. Behind its colossal walls lies a sprawling dark-steampunk city-state, completely isolated from the outside world. Few people still know what truly happens within its borders; all that is known is that the Republic has descended into a very uneasy dystopia, leaving outsiders with little desire to obtain the right of entry.",
		sections: [
			{
				title: "Recovered entry 07/17/6426 - Shepherd Protocol",
				body:
					"Fragments recovered from a Republic logistics registry identify Montreal as a city designated for long-term civic trials. The Shepherd Program appears to have introduced a new unregistered experimental weapon. Following its deployment, observations were conducted on public behavior, institutional obedience, and administrative drift. The logistics surrounding this experiment suggest the existence of an operational, centrally managed underground complex. What remains of the manifest mentions admission rooms, observation areas, periodic purges, and outbound transfers marked for the Republic’s Lower City. The final annotations appear to have been corrupted. Nevertheless, they refer to a docile workforce and contentment. Nothing indicates whether Montreal was aware that it was the subject of an experiment.",
			},
		],
	},
	{
		name: "Anchorage",
		image: "/images/locations/Anchorage.png",
		population: "9 000 000",
		link: { label: "Coming soon" },
		description:
			"With nearly nine million inhabitants, Anchorage is an imposing industrial metropolis defined by its monumental architecture and strict discipline. As the sixth-largest city on the continent, it stands along the coast of the Echovian Ocean, the final citadel before the dark horizon of the Sealed Continent. Governed by an authoritarian, centre-right technocratic autocracy, the city is administered by the engineers and strategists of the Steam Order. Its skyline is dominated by colossal steel-and-steam bridges that cross the Stendhal River, linking its districts and spanning vast industrial chasms. There seems to be a two-shot for Game Masters soon coming out telling more about its story.",
	},
	{
		name: "Ashfenbourg",
		image: "/images/locations/Ashfenbourg.jpg",
		population: "5 000 000",
		description:
			"Situated closer to the continental capital than any other city, Ashfenbourg is a prosperous Elven nation renowned for its explorers, diplomats, and mastery of negotiation. Many of the continent's most respected judges, lawmakers, and legal scholars emerge from its prestigious institutions. Moreover, The Pantheon sieges its location there within the sub-city of Athena. Yet beneath its elegance and affluence, the cost of living continues to soar, gradually transforming Ashfenbourg into a city accessible only to its wealthiest citizens.",
	},
	{
		name: "Kyoran",
		image: "/images/locations/Kyoran.png",
		population: "27 000 000",
		description:
			"Kyoran, the capital-nation of Echoes, is the largest city in the world, a boundless metropolis where nearly anything can be found and every ambition pursued. It's never-ending and forever evolving layered history is a testament to the city's relentless dynamism. Its immense density, Asian-inspired culture, and infinite and eternal chaos makes it a place many dream of calling home. Opportunity flows through every crowded street and towering district, but amid its ceaseless movement, there is one luxury Kyoran cannot offer: peace.",
	},
	{
		name: "Vapoya",
		image: "/images/locations/Vapoya.png",
		population: "21 000 000",
		description:
			"Vapoya owes its rise as a supernation to its prestigious universities and brilliant researchers, whose breakthroughs in the manipulation of gases and vapor have reshaped both industry and everyday life. Moreover renowned for its prestigious Academy of Medicine, whose discoveries have revolutionized the treatment of illness and injury throughout Echoes. More recently, its researchers have begun harnessing Anomite as a therapeutic material, showing promising potential in the treatment of certain mental disorders. This emerging field, however, remains experimental and its long-term effects are still largely unknown. Often regarded as Kyoran's younger cousin, the city shares its relentless dynamism and complex history. Beneath its ever-shifting veil of mist, Vapoya continually reinvents itself and never ceases to amaze those who call it home.",
	},
	{
		name: "Anomite",
		population: "0",
		description:
			"This region contains a high concentration of Anomite, a mysterious mineral capable of producing immense energy and piercing the magical veil of reality. Exposure can grant humans extraordinary abilities, but often at the cost of their psychological stability. Some researchers believe Anomite may also be connected to the emergence of Anomalies, though whether the mineral creates them, attracts them, or is produced by them remains unknown.",
	},
	{
		name: "Babylone",
		image: "/images/locations/Babylona.jpg",
		population: "700 000",
		description:
			"This desert metropolis stands at the crossroads of the continent’s greatest trade routes and is home to the largest library in the known world. Yet its bustling markets, sun-scorched towers, and vast archives reveal only a fraction of its true scale. Beneath the sands lies an immense hidden city, proof that everything visible on the surface is merely the tip of the iceberg.",
	},
	{
		name: "Alexandria",
		image: "/images/locations/Alexandria.jpg",
		population: "100 000",
		description:
			"This quiet medieval town offers everything needed for a peaceful life untouched by the relentless march of modern industry. Within its ancient walls, artisans, farmers, and merchants preserve the traditions of a simpler age, making it the perfect refuge for anyone seeking the calm and charm of the old world.",
	},
	{
		name: "Montpellier",
		image: "/images/locations/Montpellier.png",
		population: "300 000",
		description:
			"This small coastal city is renowned for its gentle pace of life, where mornings begin with coffee at the local coffee shop and no one ever seems to be in a hurry. Beyond its quiet streets lie some of the most radiant crystal-blue seas of Echoes. Here, the sun shines almost all year and simplicity is not a limitation, but a way of life.",
	},
	{
		name: "Montreal",
		image: "/images/locations/Mask.png",
		population: "4 000 000",
		link: { label: "Coming soon" },
		description:
			"Located within the Sealed Continent, this isolated city transmitted a series of deeply unsettling messages several months ago, until all communication abruptly ceased. Yet nothing indicates that its population has perished. The city may still be inhabited, silently concealing whatever unfolded within its walls. Perhaps its story will soon be told through an upcoming tale, or an interactive movie ...",
	},
];

export const locations: Location[] = zoneDrafts.map((zone, index) => {
	const details = locationDetails[index];

	return {
		...zone,
		...details,
		category: "Indexed Location",
		fallbackImage: details.image ? `/images/locations/zones/${zone.id}.webp` : undefined,
	};
});
