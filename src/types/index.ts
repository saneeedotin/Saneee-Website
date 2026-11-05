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
  /** One-colour mark (transparent PNG used as a mask). Without one, the name is set as a wordmark. */
  logo?: string;
  /** The thinking behind the project, for its case page. */
  story: { brief: string; approach: string; built: string[] };
};

export type Person = {
  name: string;
  image: string;
};
