/**
 * Shared taxonomy, status ladder, seed data and the single page's section
 * registry. Every component reads its vocabulary from here.
 */

/**
 * The grid's fallback photograph, used when a report is filed without one.
 * Kept here so the registry layer and the UI agree on a single value.
 */
export const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800';

/** Public reference code for an issue, e.g. ISS-0002. */
export const issueRef = (id, seq) => `ISS-${String(seq ?? id).padStart(4, '0')}`;

const SEED_ISSUES = [
  {
    id: 1,
    title: 'Large pothole on Main Road',
    description: 'Dangerous pothole causing accidents near City Mall',
    category: 'roads',
    status: 'reported',
    location: { lat: 13.0827, lng: 80.2707, address: 'Main Road, Anna Nagar' },
    image: 'https://images.unsplash.com/photo-1564577160324-112d603f750f?w=800',
    upvotes: 45,
    createdAt: '2024-03-10',
    reportedBy: 'John Doe',
    authorId: 'demo-john-doe',
    authorPhoto: null,
    likedBy: []
  },
  {
    id: 2,
    title: 'Broken streetlight',
    description: 'Street light not working for past 2 weeks',
    category: 'electricity',
    status: 'in-progress',
    location: { lat: 13.0878, lng: 80.2785, address: 'Park Avenue, T Nagar' },
    image: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=800',
    upvotes: 23,
    createdAt: '2024-03-08',
    reportedBy: 'Jane Smith',
    authorId: 'demo-jane-smith',
    authorPhoto: null,
    likedBy: []
  },
  {
    id: 3,
    title: 'Garbage pile near school',
    description: 'Uncollected garbage causing health issues',
    category: 'sanitation',
    status: 'resolved',
    location: { lat: 13.0358, lng: 80.2464, address: 'School Street, Adyar' },
    image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800',
    upvotes: 67,
    createdAt: '2024-03-05',
    reportedBy: 'Mike Johnson',
    authorId: 'demo-mike-johnson',
    authorPhoto: null,
    likedBy: []
  }
];

/**
 * Demo seed, pre-normalised to the same shape Firestore documents take so the
 * UI never has to branch on where a report came from.
 */
export const MOCK_ISSUES = SEED_ISSUES.map((issue) => ({
  ...issue,
  code: issueRef(issue.id),
  imagePath: null
}));

/**
 * The taxonomy is deliberately monochrome. Identity is carried by a short
 * monospace code plus the name — never by hue — so the interface stays within
 * the single-accent rule in design.md and survives greyscale printing.
 */
export const CATEGORIES = [
  { id: 'roads', name: 'Roads & Potholes', short: 'Roads', code: 'RDS' },
  { id: 'sanitation', name: 'Garbage & Sanitation', short: 'Sanitation', code: 'SAN' },
  { id: 'electricity', name: 'Street Lights', short: 'Lighting', code: 'LGT' },
  { id: 'water', name: 'Water Supply', short: 'Water', code: 'WTR' },
  { id: 'drainage', name: 'Drainage', short: 'Drainage', code: 'DRN' },
  { id: 'other', name: 'Other Issues', short: 'Other', code: 'OTH' }
];

/** Status reads as a ladder: raised → being worked → settled. */
export const STATUS_CONFIG = {
  reported: { label: 'Reported' },
  'in-progress': { label: 'In Progress' },
  resolved: { label: 'Resolved' }
};

export const STATUS_ORDER = ['reported', 'in-progress', 'resolved'];

/**
 * The single page's section registry. Nav, scroll spy and section shells all
 * read from this list, so adding a section is a one-line change.
 */
export const SECTIONS = [
  { id: 'overview', index: '01', label: 'Overview' },
  { id: 'issues', index: '02', label: 'Issues' },
  { id: 'report', index: '03', label: 'Report' },
  { id: 'analytics', index: '04', label: 'Analytics' },
  { id: 'account', index: '05', label: 'Account' }
];

/** Look up a section's shell props by id. */
export const section = (id) => SECTIONS.find((entry) => entry.id === id) || SECTIONS[0];

export const findCategory = (id) =>
  CATEGORIES.find((category) => category.id === id) || CATEGORIES[CATEGORIES.length - 1];

/** True when this account has already backed the report. */
export const hasLiked = (issue, uid) => Boolean(uid) && (issue.likedBy || []).includes(uid);
