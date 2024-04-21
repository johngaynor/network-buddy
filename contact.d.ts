export type Highlight = {
  highlight: string;
  isDeleted?: boolean;
  id?: number;
};

export type Interaction = {
  id: number;
  date: Date;
  location: string;
  title: string;
  Highlights: Highlight[];
};

export type Contact = {
  id: number;
  name: string;
  affiliation: string;
  notes: string;
  position: string;
  company: string;
  lastUpdated: Date;
  intTitle: string | null;
  intDate: Date | null;
  intHighlights: Highlight[];
};

export type ContactObj = {
  id: number;
  name: string;
  affiliation: string;
  notes: string;
  position: string;
  company: string;
  lastUpdated: Date;
  interactions: Interaction[];
};
