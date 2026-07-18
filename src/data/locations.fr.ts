import { locations, type Location, type LoreSection } from "./locations";

interface LocationTranslation {
	name: string;
	description: string;
	linkLabel?: string;
	sections?: LoreSection[];
}

const locationTranslations: Record<string, LocationTranslation> = {
	"zone-01": {
		name: "Neovia",
		description:
			"Neovia est la ville la plus au nord du continent d'Echoes. Réputée pour sa ligne d'horizon néon étincelante et ses imposantes structures néo-architecturales, la ville se trouve à l'avant-garde de l'innovation technologique. Son gouvernement technocratique et son économie axée sur le progrès ont transformé Neovia en une supernation puissante et l'une des sociétés les plus riches et prospères du continent.",
	},
	"zone-02": {
		name: "Mon portfolio",
		description: "Cliquez sur le lien ci-dessous pour accéder à mon site portfolio.",
		linkLabel: "Visiter le portfolio",
	},
	"zone-03": {
		name: "Europa",
		description:
			"Europa, la Ville intemporelle, abrite la plus importante Université de chronurgie du continent, où les mystères du temps sont étudiés, recherchés et maîtrisés. Largement considérée comme le berceau de l'Ère steampunk d'Echoes, cette supernation continue de prospérer grâce à sa maîtrise de la technologie chronurgique et des sciences temporelles. Bien qu'elle ne soit que la quatrième nation la plus peuplée du continent, Europa demeure l'une des plus dynamiques et influentes : une métropole en constante évolution où convergent le passé, le présent et l'avenir.",
	},
	"zone-04": {
		name: "Edmonton",
		description:
			"Echoes of Freedom est un scénario D&D 5e en une séance, bientôt publié, qui se déroule à Edmonton, une ville cachée au sein du Continent scellé. Autrefois siège de l'un des plus importants laboratoires de recherche sur les anomalies au monde, Edmonton a rompu tout contact avec l'extérieur après avoir exploité une anomalie de classe Thaumiel capable de protéger la ville du Ravissement.",
		linkLabel: "Bientôt",
	},
	"zone-05": {
		name: "Copperbraum",
		description:
			"La ville des nains et des gnomes est également connue sous le nom de Ville du cuivre. Construite sur des collines escarpées et soutenue par une économie minière florissante, ses rues rayonnent du métal en fusion et de ses fournaises rugissantes. Malgré le climat environnant, l'utilisation constante de la lave et des forges industrielles fait de Copperbraum l'une des villes les plus chaudes du continent, avec une température moyenne de 44 degrés le jour et de 35 degrés la nuit.",
	},
	"zone-06": {
		name: "Fjellgard",
		description:
			"Au plus profond des régions les plus froides du continent, nichée entre les plus hautes montagnes d'Echoes, se dresse une ville bâtie pour résister au gel éternel. En son cœur brûle une immense fournaise centrale qui protège sa population du froid mortel. La vie y est calme et sans hâte, la plupart des habitants dépendant de la chasse, de la pêche et de l'extraction du charbon pour subsister.",
	},
	"zone-07": {
		name: "Drakya",
		description:
			"Dispersée dans les jungles de l'Extrême-Orient se trouve une paisible nation drakéide dont la capitale prospère, Drakya, constitue le cœur. Accueillant les drakéides de toutes les lignées, la ville est un refuge où ils peuvent coexister, préserver leurs traditions et progresser ensemble.",
	},
	"zone-08": {
		name: "Ironhaven",
		description:
			"La Ville de fer porte bien son nom. Supernation en apparence irréprochable, Ironhaven est l'une des rares civilisations à avoir atteint quelque chose qui ressemble à une véritable utopie, ou du moins, telle est l'image qu'elle présente au monde extérieur.",
	},
	"zone-09": {
		name: "La République",
		description:
			"La République est la deuxième supernation la plus peuplée au monde et une nation sans équivalent. Derrière ses murs colossaux s'étend une vaste cité-État dark steampunk, entièrement isolée du monde extérieur. Peu de gens savent encore ce qui se passe réellement à l'intérieur de ses frontières; tout ce que l'on sait, c'est que la République a sombré dans une dystopie profondément inquiétante, laissant aux étrangers bien peu d'envie d'obtenir un droit d'entrée.",
		sections: [
			{
				title: "Entrée récupérée 07/17/6426 - Protocole du berger",
				body:
					"Des fragments récupérés dans un registre logistique de la République désignent Montréal non comme une ville, mais comme un essai civique à long terme. Le programme semble avoir introduit un système expérimental non enregistré, puis observé les changements dans le comportement public, l'obéissance institutionnelle et la dérive administrative. Un code d'acheminement récurrent pointe sous le niveau de la rue. Ce qui subsiste des manifestes ne décrit qu'un site parmi plusieurs : salles d'admission, quartiers d'observation, purges périodiques et transferts sortants marqués pour la ville inférieure de la République. Les dernières annotations sont moins lisibles. Elles parlent de stabilité en surface, de main-d'œuvre docile et de contentement comme s'il s'agissait d'une seule et même mesure. Rien n'indique si Montréal a jamais su qu'elle faisait l'objet d'un test.",
			},
		],
	},
	"zone-10": {
		name: "Anchorage",
		description:
			"Avec près de neuf millions d'habitants, Anchorage est une imposante métropole industrielle définie par son architecture monumentale et sa discipline rigoureuse. Sixième plus grande ville du continent, elle se dresse sur la côte de l'Océan échovien, dernière citadelle avant l'horizon sombre du Continent scellé. Gouvernée par une autocratie technocratique autoritaire de centre droit, la ville est administrée par les ingénieurs et stratèges de l'Ordre de la vapeur. Sa silhouette est dominée par de gigantesques ponts d'acier et de vapeur qui franchissent la rivière Stendhal, relient ses quartiers et enjambent d'immenses gouffres industriels. Il semblerait qu'un scénario en deux séances destiné aux maîtres de jeu paraîtra bientôt pour raconter davantage son histoire.",
		linkLabel: "Bientôt",
	},
	"zone-11": {
		name: "Ashfenbourg",
		description:
			"Située plus près de la capitale continentale que toute autre ville, Ashfenbourg est une nation elfique prospère, réputée pour ses explorateurs, ses diplomates et sa maîtrise de la négociation. Nombre des juges, législateurs et juristes les plus respectés du continent sont issus de ses prestigieuses institutions. De plus, le Panthéon y a établi son siège dans la sous-ville d'Athéna. Pourtant, sous son élégance et son opulence, le coût de la vie ne cesse d'augmenter, transformant peu à peu Ashfenbourg en une ville accessible uniquement à ses citoyens les plus fortunés.",
	},
	"zone-12": {
		name: "Kyoran",
		description:
			"Kyoran, la nation-capitale d'Echoes, est la plus grande ville du monde : une métropole sans limites où presque tout peut être trouvé et chaque ambition poursuivie. Son histoire stratifiée, infinie et en perpétuelle évolution témoigne du dynamisme incessant de la ville. Son immense densité, sa culture d'inspiration asiatique et son chaos infini et éternel en font un lieu que beaucoup rêvent d'appeler leur foyer. Les occasions affluent dans chaque rue bondée et chaque quartier vertigineux, mais au milieu de ce mouvement incessant, Kyoran ne peut offrir un seul luxe : la paix.",
	},
	"zone-13": {
		name: "Vapoya",
		description:
			"Vapoya doit son ascension au rang de supernation à ses universités prestigieuses et à ses brillants chercheurs, dont les découvertes sur la manipulation des gaz et de la vapeur ont transformé l'industrie comme la vie quotidienne. Elle est également reconnue pour sa prestigieuse Académie de médecine, dont les avancées ont révolutionné le traitement des maladies et des blessures dans tout Echoes. Plus récemment, ses chercheurs ont commencé à exploiter l'Anomite comme matériau thérapeutique, révélant un potentiel prometteur pour le traitement de certains troubles mentaux. Ce domaine émergent demeure toutefois expérimental et ses effets à long terme restent largement inconnus. Souvent considérée comme la jeune cousine de Kyoran, la ville partage son dynamisme incessant et son histoire complexe. Sous son voile de brume en perpétuel mouvement, Vapoya se réinvente continuellement et ne cesse d'émerveiller ceux qui y vivent.",
	},
	"zone-14": {
		name: "Anomite",
		description:
			"Cette région contient une forte concentration d'Anomite, un minerai mystérieux capable de produire une énergie immense et de percer le voile magique de la réalité. L'exposition peut conférer aux humains des capacités extraordinaires, mais souvent au prix de leur stabilité psychologique. Certains chercheurs pensent que l'Anomite pourrait également être liée à l'apparition des Anomalies, bien que l'on ignore encore si le minerai les crée, les attire ou est produit par elles.",
	},
	"zone-15": {
		name: "Babylone",
		description:
			"Cette métropole désertique se dresse au carrefour des plus grandes routes commerciales du continent et abrite la plus vaste bibliothèque du monde connu. Pourtant, ses marchés animés, ses tours brûlées par le soleil et ses immenses archives ne révèlent qu'une fraction de sa véritable ampleur. Sous les sables repose une gigantesque cité cachée, preuve que tout ce qui est visible à la surface ne constitue que la pointe de l'iceberg.",
	},
	"zone-16": {
		name: "Alexandrie",
		description:
			"Cette paisible ville médiévale offre tout ce qu'il faut pour mener une vie tranquille, épargnée par la marche incessante de l'industrie moderne. À l'intérieur de ses remparts anciens, artisans, agriculteurs et marchands préservent les traditions d'une époque plus simple, faisant d'Alexandrie le refuge idéal pour quiconque recherche le calme et le charme du vieux monde.",
	},
	"zone-17": {
		name: "Montpellier",
		description:
			"Cette petite ville côtière est réputée pour la douceur de son rythme de vie, où les matinées commencent par un café sur la Place de la Comédie et où personne ne semble jamais pressé. Au-delà de ses rues tranquilles s'étendent certaines des mers bleu cristal les plus radieuses d'Echoes. Ici, le soleil brille presque toute l'année et la simplicité n'est pas une limite, mais une manière de vivre.",
	},
	"zone-18": {
		name: "Montréal",
		description:
			"Située au sein du Continent scellé, cette ville isolée a transmis une série de messages profondément troublants il y a plusieurs mois, avant que toute communication ne cesse brusquement. Pourtant, rien n'indique que sa population ait péri. La ville pourrait encore être habitée, dissimulant silencieusement ce qui s'est déroulé derrière ses murs. Peut-être son histoire sera-t-elle bientôt racontée dans un récit à venir, ou dans un film interactif...",
		linkLabel: "Bientôt",
	},
};

export const locationsFr: Location[] = locations.map((location) => {
	const translation = locationTranslations[location.id];

	return {
		...location,
		name: translation.name,
		category: "Lieu indexé",
		description: translation.description,
		sections: translation.sections ?? location.sections,
		link: location.link
			? {
					...location.link,
					label: translation.linkLabel ?? location.link.label,
				}
			: undefined,
	};
});
