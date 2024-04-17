export type Highlight = {
  highlight: string;
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
