type Highlight = {
  highlight: string;
};

type Interaction = {
  title: string;
  location: string;
  date: Date;
  Highlights: Highlight[];
};

type Contact = {
  id: number;
  name: string;
  affiliation: string;
  notes: string;
  position: string;
  company: string;
  lastUpdated: Date;
  Interactions: Interaction[];
};
