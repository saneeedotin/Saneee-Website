export type Service = {
  name: string;
  /** Sane: what it actually includes. */
  text: string;
  /** Insane: the same thing in one line. */
  voice: string;
};

export type Project = {
  slug: string;
  name: string;
  business: string;
  where?: string;
  image: string;
  live?: { url: string; label: string };
  sign: { background: string; color: string };
  /** Insane: one line. */
  line: string;
};

export type Person = {
  name: string;
  role: string;
  image: string;
  /** Sane: in their own words. */
  bio: string;
  /** Insane: one line. */
  line: string;
};
