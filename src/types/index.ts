export type Service = {
  name: string;
  /** Sane: what it actually includes. */
  text: string;
  /** Insane: the same thing in one line. */
  voice: string;
  /** Insane: the picture on its card. */
  image?: string;
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
  /** One-colour mark (transparent PNG used as a mask). Without one, the name is set as a wordmark. */
  logo?: string;
  /** The thinking behind the project, for its case page. */
  story: { brief: string; approach: string; built: string[] };
  // Facts for the case page; each shows only when set. Nothing sensitive, such as budgets.
  /** What the studio did, e.g. ["Website", "Branding"]. */
  services?: string[];
  /** When it went live, e.g. "March 2026". */
  delivered?: string;
  /** How long it took, e.g. "5 weeks". */
  timeline?: string;
};

export type Person = {
  name: string;
  image: string;
};
