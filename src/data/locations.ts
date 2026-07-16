export interface LoreSection {
  title: string;
  body: string;
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
  image: string;
  summary: string;
  sections?: LoreSection[];
  stories?: Story[];
}

export const locations: Location[] = [
  {
    id: "glass-archive",
    name: "The Glass Archive",
    category: "Memory Repository",
    x: 0.31,
    y: 0.38,
    image: "/assets/glass-archive.webp",
    summary:
      "A submerged index where memories are pressed into panes of black glass and catalogued by the sound they make when struck.",
    sections: [
      {
        title: "The keeping",
        body:
          "The archivists never write. They tune each pane to a remembered voice, then suspend it in the flooded stacks. At low tide, an entire century can be heard humming beneath the floor.",
      },
      {
        title: "Visitor protocol",
        body:
          "Names are surrendered at the outer lock. Anyone who speaks their own name inside the stacks risks exchanging a living memory for one that belongs to the archive.",
      },
    ],
  },
  {
    id: "bell-foundry",
    name: "The Drowned Bell Foundry",
    category: "Abandoned Works",
    x: 0.61,
    y: 0.58,
    image: "/assets/bell-foundry.webp",
    summary:
      "An ironworks built into the salt cliffs, silent since its final bell rang eleven minutes before it was cast.",
    sections: [
      {
        title: "An impossible resonance",
        body:
          "Every unfinished bell in the lower foundry carries the same note. The vibration travels through stone instead of air and can be felt days before a storm reaches the coast.",
      },
    ],
    stories: [
      {
        id: "salt-memory",
        title: "A Memory Made of Salt",
        format: "Illustrated short story",
        synopsis:
          "A bellmaker returns to the flooded furnaces to recover the voice she sealed inside her last commission.",
        image: "/assets/story-salt-memory.webp",
        url: "https://example.com/stories/a-memory-made-of-salt",
        buttonLabel: "Read the field edition",
      },
    ],
  },
  {
    id: "meridian-station",
    name: "Meridian Station Nine",
    category: "Threshold Station",
    x: 0.77,
    y: 0.28,
    image: "/assets/meridian-station.webp",
    summary:
      "The last station on a railway that crosses no visible land. Its clocks disagree about the year, but all strike midnight together.",
    sections: [
      {
        title: "Departures",
        body:
          "A train arrives whenever the station loses its shadow. Tickets list a passenger's place of departure but never a destination, and the conductor accepts only obsolete currencies.",
      },
      {
        title: "The night index",
        body:
          "Platform Nine keeps a ledger of stars that have vanished from the sky. Several entries are dated tomorrow in a hand that matches the current stationmaster's.",
      },
    ],
    stories: [
      {
        id: "last-bell",
        title: "The Last Bell Before Morning",
        format: "Audio drama",
        synopsis:
          "Two passengers wait through a night that keeps rearranging the station around them.",
        image: "/assets/story-last-bell.webp",
        url: "https://example.com/stories/the-last-bell-before-morning",
        buttonLabel: "Listen to the transmission",
      },
      {
        id: "night-index",
        title: "Index of Absent Stars",
        format: "Archive novella",
        synopsis:
          "A junior cartographer discovers that each missing star corresponds to a place erased from every map but hers.",
        image: "/assets/story-night-index.webp",
        url: "https://example.com/stories/index-of-absent-stars",
        buttonLabel: "Open the recovered folio",
      },
    ],
  },
];
