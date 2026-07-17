export type Language = "en" | "fr";

export interface InterfaceCopy {
	app: {
		brandTitle: string;
		brandSubtitle: string;
		sitesIndexed: string;
		indexedLocations: string;
		dragToTraverse: string;
		scrollToExamine: string;
		closeLocationDetails: string;
		switchLanguage: string;
	};
	vault: {
		eyebrow: string;
		titleFirst: string;
		titleSecond: string;
		credit: string;
		enter: string;
		hint: string;
	};
	audio: {
		controls: string;
		decrease: string;
		increase: string;
		mute: string;
		unmute: string;
		decreaseTitle: string;
		increaseTitle: string;
		muteTitle: string;
		unmuteTitle: string;
		volume: string;
	};
	location: {
		archiveLocation: string;
		close: string;
		closeDetails: string;
		archivalView: string;
		population: string;
		openLink: string;
		relatedTransmissions: string;
		storiesFromPlace: string;
	};
	map: {
		worldMap: string;
		interactiveMap: string;
		openingIndex: string;
		archiveInterruption: string;
		mapUnavailable: string;
		mapOpenError: string;
		tileWarning: string;
		retry: string;
	};
	mapControls: {
		controls: string;
		zoomIn: string;
		zoomOut: string;
		reset: string;
	};
	portal: {
		open: string;
	};
	distance: {
		launcher: string;
		ariaLabel: string;
		eyebrow: string;
		close: string;
		startingPoint: string;
		destination: string;
		calculated: string;
		directDistance: string;
		note: string;
		prompt: string;
		clear: string;
		walk: string;
		horse: string;
		train: string;
		wyvern: string;
		day: string;
		hour: string;
		minute: string;
		locale: string;
	};
	placement: {
		ariaLabel: string;
		mode: string;
		developmentOnly: string;
		copied: string;
		copyCoordinates: string;
		copyObject: string;
		instruction: string;
		newLocation: string;
		uncatalogued: string;
		populationPending: string;
		descriptionPlaceholder: string;
	};
}

export const interfaceCopy: Record<Language, InterfaceCopy> = {
	en: {
		app: {
			brandTitle: "The Vault of Echoes",
			brandSubtitle: "My World, my Universe.",
			sitesIndexed: "sites indexed",
			indexedLocations: "indexed locations",
			dragToTraverse: "Drag to traverse",
			scrollToExamine: "Scroll to examine",
			closeLocationDetails: "Close location details",
			switchLanguage: "Passer au français",
		},
		vault: {
			eyebrow: "My Universe",
			titleFirst: "The Vault",
			titleSecond: "of Echoes",
			credit: "A continuously evolving world by Andrei Bituleanu",
			enter: "Enter the vault",
			hint: "Use headphones only if ambient audio is enabled",
		},
		audio: {
			controls: "Ambient music controls",
			decrease: "Decrease music volume",
			increase: "Increase music volume",
			mute: "Mute ambient music",
			unmute: "Unmute ambient music",
			decreaseTitle: "Decrease volume",
			increaseTitle: "Increase volume",
			muteTitle: "Mute music",
			unmuteTitle: "Unmute music",
			volume: "Music volume",
		},
		location: {
			archiveLocation: "Archive location",
			close: "Close",
			closeDetails: "Close location details",
			archivalView: "Archival view of",
			population: "Population",
			openLink: "Open link",
			relatedTransmissions: "Related transmissions",
			storiesFromPlace: "Stories from this place",
		},
		map: {
			worldMap: "World map",
			interactiveMap:
				"Interactive map. Drag to pan, scroll or use plus and minus to zoom, arrow keys to move, and Home to reset.",
			openingIndex: "Opening the cartographic index",
			archiveInterruption: "Archive interruption",
			mapUnavailable: "Map unavailable",
			mapOpenError:
				"The map archive could not be opened. Check the DZI descriptor and tile folder.",
			tileWarning: "One map tile was unavailable. Navigation remains active.",
			retry: "Retry map",
		},
		mapControls: {
			controls: "Map controls",
			zoomIn: "Zoom in",
			zoomOut: "Zoom out",
			reset: "Reset map to world view",
		},
		portal: {
			open: "Open",
		},
		distance: {
			launcher: "Measure route",
			ariaLabel: "Map distance measurement",
			eyebrow: "Cartographic measure",
			close: "Close distance tool",
			startingPoint: "Select the starting point",
			destination: "Select the destination",
			calculated: "Route calculated",
			directDistance: "Direct distance",
			note: "Estimates assume uninterrupted travel at the listed speeds.",
			prompt:
				"Click any two points or two location markers to measure their distance.",
			clear: "Clear route",
			walk: "Walk",
			horse: "Horse",
			train: "Train",
			wyvern: "Wyvern",
			day: "d",
			hour: "h",
			minute: "m",
			locale: "en-CA",
		},
		placement: {
			ariaLabel: "Development node placement tool",
			mode: "Placement mode",
			developmentOnly: "Development only",
			copied: "Copied",
			copyCoordinates: "Copy coordinates",
			copyObject: "Copy location object",
			instruction:
				"Click an unmarked point on the map to capture normalized coordinates.",
			newLocation: "New Location",
			uncatalogued: "Uncatalogued",
			populationPending: "Population pending",
			descriptionPlaceholder: "Add a concise archival description.",
		},
	},
	fr: {
		app: {
			brandTitle: "Le Continent de Echoes",
			brandSubtitle: "Mon Monde, mon Univers.",
			sitesIndexed: "sites indexés",
			indexedLocations: "lieux indexés",
			dragToTraverse: "Glisser pour parcourir",
			scrollToExamine: "Défiler pour examiner",
			closeLocationDetails: "Fermer les détails du lieu",
			switchLanguage: "Switch to English",
		},
		vault: {
			eyebrow: "Mon Univers",
			titleFirst: "Le Continent",
			titleSecond: "de Echoes",
			credit: "Un monde en constante évolution par Andrei Bituleanu",
			enter: "Entrer dans le continent",
			hint: "Utilisez un casque uniquement si l'audio ambiant est activé",
		},
		audio: {
			controls: "Contrôles de la musique ambiante",
			decrease: "Diminuer le volume de la musique",
			increase: "Augmenter le volume de la musique",
			mute: "Couper la musique ambiante",
			unmute: "Réactiver la musique ambiante",
			decreaseTitle: "Diminuer le volume",
			increaseTitle: "Augmenter le volume",
			muteTitle: "Couper la musique",
			unmuteTitle: "Réactiver la musique",
			volume: "Volume de la musique",
		},
		location: {
			archiveLocation: "Lieu archivé",
			close: "Fermer",
			closeDetails: "Fermer les détails du lieu",
			archivalView: "Vue d'archive de",
			population: "Population",
			openLink: "Ouvrir le lien",
			relatedTransmissions: "Transmissions associées",
			storiesFromPlace: "Histoires de ce lieu",
		},
		map: {
			worldMap: "Carte du monde",
			interactiveMap:
				"Carte interactive. Faites glisser pour vous déplacer, défilez ou utilisez plus et moins pour zoomer, les flèches pour bouger et Origine pour réinitialiser.",
			openingIndex: "Ouverture de l'index cartographique",
			archiveInterruption: "Interruption des archives",
			mapUnavailable: "Carte indisponible",
			mapOpenError:
				"Les archives cartographiques n'ont pas pu être ouvertes. Vérifiez le descripteur DZI et le dossier des tuiles.",
			tileWarning:
				"Une tuile de la carte est indisponible. La navigation demeure active.",
			retry: "Réessayer",
		},
		mapControls: {
			controls: "Contrôles de la carte",
			zoomIn: "Zoomer",
			zoomOut: "Dézoomer",
			reset: "Réinitialiser la vue du monde",
		},
		portal: {
			open: "Ouvrir",
		},
		distance: {
			launcher: "Mesurer un trajet",
			ariaLabel: "Mesure des distances sur la carte",
			eyebrow: "Mesure cartographique",
			close: "Fermer l'outil de distance",
			startingPoint: "Sélectionnez le point de départ",
			destination: "Sélectionnez la destination",
			calculated: "Trajet calculé",
			directDistance: "Distance directe",
			note: "Les estimations supposent un déplacement ininterrompu aux vitesses indiquées.",
			prompt:
				"Cliquez sur deux points ou deux marqueurs de lieu pour mesurer leur distance.",
			clear: "Effacer le trajet",
			walk: "Marche",
			horse: "Cheval",
			train: "Train",
			wyvern: "Wyverne",
			day: "j",
			hour: "h",
			minute: "min",
			locale: "fr-CA",
		},
		placement: {
			ariaLabel: "Outil de placement des nœuds de développement",
			mode: "Mode placement",
			developmentOnly: "Développement uniquement",
			copied: "Copié",
			copyCoordinates: "Copier les coordonnées",
			copyObject: "Copier l'objet du lieu",
			instruction:
				"Cliquez sur un point non marqué de la carte pour relever ses coordonnées normalisées.",
			newLocation: "Nouveau lieu",
			uncatalogued: "Non catalogué",
			populationPending: "Population à déterminer",
			descriptionPlaceholder: "Ajoutez une brève description d'archive.",
		},
	},
};
