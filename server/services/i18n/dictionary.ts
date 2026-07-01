import { cookies } from "next/headers";
import en from "./dictionaries/en.json";
import es from "./dictionaries/es.json";

const dictionaries = {
  en,
  es,
};

export type DictionaryType = typeof en;

export async function getLocale(): Promise<"en" | "es"> {
  const cookieStore = await cookies();
  const locale = cookieStore.get("lang")?.value || "en";
  return locale === "es" ? "es" : "en";
}

export async function getDictionary(): Promise<DictionaryType> {
  const locale = await getLocale();
  return dictionaries[locale];
}
export type DictionaryKeys = keyof DictionaryType;
