// ──────────────────────────────────────────────────────────────────────────────
// src/data/mockData.js
// Realistic financial mock data. This serves as the seed for the app's state.
// ──────────────────────────────────────────────────────────────────────────────

export const CATEGORIES = [
  'Salary',
  'Freelance',
  'Investments',
  'Food & Dining',
  'Transport',
  'Entertainment',
  'Healthcare',
  'Shopping',
  'Utilities',
  'Rent',
  'Education',
  'Travel',
];

export const CATEGORY_COLORS = {
  'Salary':        '#00D4AA',
  'Freelance':     '#00B891',
  'Investments':   '#66E7D1',
  'Food & Dining': '#FF4D6A',
  'Transport':     '#FFB347',
  'Entertainment': '#A78BFA',
  'Healthcare':    '#60A5FA',
  'Shopping':      '#F472B6',
  'Utilities':     '#34D399',
  'Rent':          '#FB923C',
  'Education':     '#FBBF24',
  'Travel':        '#E879F9',
};

// Generate a consistent id
let _id = 1;
const id = () => String(_id++).padStart(4, '0');

// Helper to format dates as YYYY-MM-DD
const d = (year, month, day) =>
  `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

export const INITIAL_TRANSACTIONS = [
  // ── January ──
  { id: id(), date: d(2024, 1, 1),  description: 'Monthly Salary',          category: 'Salary',        amount: 5200,  type: 'income'  },
  { id: id(), date: d(2024, 1, 5),  description: 'Netflix Subscription',    category: 'Entertainment', amount: 15,    type: 'expense' },
  { id: id(), date: d(2024, 1, 8),  description: 'Grocery Shopping',        category: 'Food & Dining', amount: 210,   type: 'expense' },
  { id: id(), date: d(2024, 1, 12), description: 'Apartment Rent',          category: 'Rent',          amount: 1200,  type: 'expense' },
  { id: id(), date: d(2024, 1, 15), description: 'Freelance Web Project',   category: 'Freelance',     amount: 850,   type: 'income'  },
  { id: id(), date: d(2024, 1, 18), description: 'Electricity Bill',        category: 'Utilities',     amount: 88,    type: 'expense' },
  { id: id(), date: d(2024, 1, 22), description: 'Uber Rides',              category: 'Transport',     amount: 65,    type: 'expense' },
  { id: id(), date: d(2024, 1, 28), description: 'Online Course — React',   category: 'Education',     amount: 49,    type: 'expense' },

  // ── February ──
  { id: id(), date: d(2024, 2, 1),  description: 'Monthly Salary',          category: 'Salary',        amount: 5200,  type: 'income'  },
  { id: id(), date: d(2024, 2, 3),  description: 'Restaurant Dinner',       category: 'Food & Dining', amount: 92,    type: 'expense' },
  { id: id(), date: d(2024, 2, 8),  description: 'Stock Dividends',         category: 'Investments',   amount: 340,   type: 'income'  },
  { id: id(), date: d(2024, 2, 12), description: 'Apartment Rent',          category: 'Rent',          amount: 1200,  type: 'expense' },
  { id: id(), date: d(2024, 2, 14), description: 'Valentine Gift',          category: 'Shopping',      amount: 120,   type: 'expense' },
  { id: id(), date: d(2024, 2, 19), description: 'Freelance UI Design',     category: 'Freelance',     amount: 620,   type: 'income'  },
  { id: id(), date: d(2024, 2, 23), description: 'Doctor Visit',            category: 'Healthcare',    amount: 75,    type: 'expense' },
  { id: id(), date: d(2024, 2, 26), description: 'Metro Card',              category: 'Transport',     amount: 40,    type: 'expense' },

  // ── March ──
  { id: id(), date: d(2024, 3, 1),  description: 'Monthly Salary',          category: 'Salary',        amount: 5200,  type: 'income'  },
  { id: id(), date: d(2024, 3, 4),  description: 'Grocery Shopping',        category: 'Food & Dining', amount: 195,   type: 'expense' },
  { id: id(), date: d(2024, 3, 7),  description: 'Freelance API Project',   category: 'Freelance',     amount: 1100,  type: 'income'  },
  { id: id(), date: d(2024, 3, 10), description: 'Apartment Rent',          category: 'Rent',          amount: 1200,  type: 'expense' },
  { id: id(), date: d(2024, 3, 14), description: 'Gym Membership',          category: 'Healthcare',    amount: 50,    type: 'expense' },
  { id: id(), date: d(2024, 3, 18), description: 'Online Shopping',         category: 'Shopping',      amount: 230,   type: 'expense' },
  { id: id(), date: d(2024, 3, 22), description: 'Electricity Bill',        category: 'Utilities',     amount: 82,    type: 'expense' },
  { id: id(), date: d(2024, 3, 28), description: 'Cinema Night',            category: 'Entertainment', amount: 35,    type: 'expense' },

  // ── April ──
  { id: id(), date: d(2024, 4, 1),  description: 'Monthly Salary',          category: 'Salary',        amount: 5200,  type: 'income'  },
  { id: id(), date: d(2024, 4, 5),  description: 'Stock Dividends',         category: 'Investments',   amount: 410,   type: 'income'  },
  { id: id(), date: d(2024, 4, 8),  description: 'Grocery Shopping',        category: 'Food & Dining', amount: 220,   type: 'expense' },
  { id: id(), date: d(2024, 4, 10), description: 'Apartment Rent',          category: 'Rent',          amount: 1200,  type: 'expense' },
  { id: id(), date: d(2024, 4, 15), description: 'Freelance Dashboard UI',  category: 'Freelance',     amount: 950,   type: 'income'  },
  { id: id(), date: d(2024, 4, 19), description: 'Spring Clothing',         category: 'Shopping',      amount: 185,   type: 'expense' },
  { id: id(), date: d(2024, 4, 24), description: 'Taxi & Rideshare',        category: 'Transport',     amount: 58,    type: 'expense' },
  { id: id(), date: d(2024, 4, 29), description: 'Internet Bill',           category: 'Utilities',     amount: 60,    type: 'expense' },

  // ── May ──
  { id: id(), date: d(2024, 5, 1),  description: 'Monthly Salary',          category: 'Salary',        amount: 5200,  type: 'income'  },
  { id: id(), date: d(2024, 5, 3),  description: 'Grocery Shopping',        category: 'Food & Dining', amount: 205,   type: 'expense' },
  { id: id(), date: d(2024, 5, 9),  description: 'Weekend Trip — Goa',      category: 'Travel',        amount: 780,   type: 'expense' },
  { id: id(), date: d(2024, 5, 12), description: 'Apartment Rent',          category: 'Rent',          amount: 1200,  type: 'expense' },
  { id: id(), date: d(2024, 5, 16), description: 'Freelance Branding',      category: 'Freelance',     amount: 700,   type: 'income'  },
  { id: id(), date: d(2024, 5, 20), description: 'Pharmacy',                category: 'Healthcare',    amount: 42,    type: 'expense' },
  { id: id(), date: d(2024, 5, 25), description: 'Electricity Bill',        category: 'Utilities',     amount: 91,    type: 'expense' },

  // ── June ──
  { id: id(), date: d(2024, 6, 1),  description: 'Monthly Salary',          category: 'Salary',        amount: 5200,  type: 'income'  },
  { id: id(), date: d(2024, 6, 2),  description: 'Stock Dividends',         category: 'Investments',   amount: 380,   type: 'income'  },
  { id: id(), date: d(2024, 6, 6),  description: 'Grocery Shopping',        category: 'Food & Dining', amount: 198,   type: 'expense' },
  { id: id(), date: d(2024, 6, 10), description: 'Apartment Rent',          category: 'Rent',          amount: 1200,  type: 'expense' },
  { id: id(), date: d(2024, 6, 14), description: 'Freelance Mobile App',    category: 'Freelance',     amount: 1400,  type: 'income'  },
  { id: id(), date: d(2024, 6, 18), description: 'Summer Clothes',          category: 'Shopping',      amount: 310,   type: 'expense' },
  { id: id(), date: d(2024, 6, 22), description: 'Concert Tickets',         category: 'Entertainment', amount: 120,   type: 'expense' },
  { id: id(), date: d(2024, 6, 27), description: 'Transport Pass',          category: 'Transport',     amount: 45,    type: 'expense' },

  // ── July ──
  { id: id(), date: d(2024, 7, 1),  description: 'Monthly Salary',          category: 'Salary',        amount: 5200,  type: 'income'  },
  { id: id(), date: d(2024, 7, 5),  description: 'Grocery Shopping',        category: 'Food & Dining', amount: 215,   type: 'expense' },
  { id: id(), date: d(2024, 7, 8),  description: 'International Flight',    category: 'Travel',        amount: 1250,  type: 'expense' },
  { id: id(), date: d(2024, 7, 12), description: 'Apartment Rent',          category: 'Rent',          amount: 1200,  type: 'expense' },
  { id: id(), date: d(2024, 7, 18), description: 'Electricity Bill',        category: 'Utilities',     amount: 96,    type: 'expense' },
  { id: id(), date: d(2024, 7, 20), description: 'Freelance Consulting',    category: 'Freelance',     amount: 500,   type: 'income'  },
  { id: id(), date: d(2024, 7, 25), description: 'Online Shopping',         category: 'Shopping',      amount: 145,   type: 'expense' },

  // ── August ──
  { id: id(), date: d(2024, 8, 1),  description: 'Monthly Salary',          category: 'Salary',        amount: 5200,  type: 'income'  },
  { id: id(), date: d(2024, 8, 3),  description: 'Stock Dividends',         category: 'Investments',   amount: 425,   type: 'income'  },
  { id: id(), date: d(2024, 8, 7),  description: 'Grocery Shopping',        category: 'Food & Dining', amount: 225,   type: 'expense' },
  { id: id(), date: d(2024, 8, 10), description: 'Apartment Rent',          category: 'Rent',          amount: 1200,  type: 'expense' },
  { id: id(), date: d(2024, 8, 14), description: 'Birthday Dinner',         category: 'Food & Dining', amount: 160,   type: 'expense' },
  { id: id(), date: d(2024, 8, 18), description: 'Freelance Logo Design',   category: 'Freelance',     amount: 450,   type: 'income'  },
  { id: id(), date: d(2024, 8, 23), description: 'Electronics Purchase',    category: 'Shopping',      amount: 580,   type: 'expense' },
  { id: id(), date: d(2024, 8, 28), description: 'Internet & Phone Bill',   category: 'Utilities',     amount: 98,    type: 'expense' },

  // ── September ──
  { id: id(), date: d(2024, 9, 1),  description: 'Monthly Salary',          category: 'Salary',        amount: 5200,  type: 'income'  },
  { id: id(), date: d(2024, 9, 5),  description: 'Grocery Shopping',        category: 'Food & Dining', amount: 190,   type: 'expense' },
  { id: id(), date: d(2024, 9, 9),  description: 'Freelance Dashboard',     category: 'Freelance',     amount: 1200,  type: 'income'  },
  { id: id(), date: d(2024, 9, 12), description: 'Apartment Rent',          category: 'Rent',          amount: 1200,  type: 'expense' },
  { id: id(), date: d(2024, 9, 16), description: 'Gym + Spa',               category: 'Healthcare',    amount: 80,    type: 'expense' },
  { id: id(), date: d(2024, 9, 21), description: 'Spotify + Apple Music',   category: 'Entertainment', amount: 18,    type: 'expense' },
  { id: id(), date: d(2024, 9, 27), description: 'Electricity Bill',        category: 'Utilities',     amount: 85,    type: 'expense' },

  // ── October ──
  { id: id(), date: d(2024, 10, 1),  description: 'Monthly Salary',         category: 'Salary',        amount: 5200,  type: 'income'  },
  { id: id(), date: d(2024, 10, 3),  description: 'Stock Dividends',        category: 'Investments',   amount: 460,   type: 'income'  },
  { id: id(), date: d(2024, 10, 7),  description: 'Grocery Shopping',       category: 'Food & Dining', amount: 200,   type: 'expense' },
  { id: id(), date: d(2024, 10, 10), description: 'Apartment Rent',         category: 'Rent',          amount: 1200,  type: 'expense' },
  { id: id(), date: d(2024, 10, 14), description: 'Freelance Full Project', category: 'Freelance',     amount: 1800,  type: 'income'  },
  { id: id(), date: d(2024, 10, 19), description: 'Fall Shopping',          category: 'Shopping',      amount: 275,   type: 'expense' },
  { id: id(), date: d(2024, 10, 24), description: 'Weekend Getaway',        category: 'Travel',        amount: 420,   type: 'expense' },
  { id: id(), date: d(2024, 10, 29), description: 'Transport & Rideshare',  category: 'Transport',     amount: 72,    type: 'expense' },

  // ── November ──
  { id: id(), date: d(2024, 11, 1),  description: 'Monthly Salary',         category: 'Salary',        amount: 5200,  type: 'income'  },
  { id: id(), date: d(2024, 11, 4),  description: 'Grocery Shopping',       category: 'Food & Dining', amount: 210,   type: 'expense' },
  { id: id(), date: d(2024, 11, 8),  description: 'Freelance Consulting',   category: 'Freelance',     amount: 900,   type: 'income'  },
  { id: id(), date: d(2024, 11, 11), description: 'Black Friday Shopping',  category: 'Shopping',      amount: 640,   type: 'expense' },
  { id: id(), date: d(2024, 11, 15), description: 'Apartment Rent',         category: 'Rent',          amount: 1200,  type: 'expense' },
  { id: id(), date: d(2024, 11, 20), description: 'Annual Health Check',    category: 'Healthcare',    amount: 150,   type: 'expense' },
  { id: id(), date: d(2024, 11, 25), description: 'Electricity Bill',       category: 'Utilities',     amount: 102,   type: 'expense' },

  // ── December ──
  { id: id(), date: d(2024, 12, 1),  description: 'Monthly Salary',         category: 'Salary',        amount: 5200,  type: 'income'  },
  { id: id(), date: d(2024, 12, 3),  description: 'Stock Dividends',        category: 'Investments',   amount: 510,   type: 'income'  },
  { id: id(), date: d(2024, 12, 5),  description: 'Freelance Year-End',     category: 'Freelance',     amount: 2200,  type: 'income'  },
  { id: id(), date: d(2024, 12, 10), description: 'Apartment Rent',         category: 'Rent',          amount: 1200,  type: 'expense' },
  { id: id(), date: d(2024, 12, 14), description: 'Christmas Shopping',     category: 'Shopping',      amount: 820,   type: 'expense' },
  { id: id(), date: d(2024, 12, 18), description: 'Holiday Travel',         category: 'Travel',        amount: 980,   type: 'expense' },
  { id: id(), date: d(2024, 12, 22), description: 'Holiday Dinner',         category: 'Food & Dining', amount: 180,   type: 'expense' },
  { id: id(), date: d(2024, 12, 28), description: 'Electricity Bill',       category: 'Utilities',     amount: 110,   type: 'expense' },
];
