import { supabasePublic } from "@/lib/supabase/publicClient";

export type SiteMediaKey =
  | "home_hero_video"
  | "social_facebook"
  | "social_instagram"
  | "social_youtube"
  | "social_reclameaqui"
  | "social_google";

export async function getSiteMediaUrl(chave: SiteMediaKey): Promise<string> {
  const { data, error } = await supabasePublic
    .from("site_media")
    .select("url")
    .eq("chave", chave)
    .maybeSingle();

  if (error || !data?.url) return "";
  return data.url;
}

/** Várias chaves numa só consulta. Chave sem mídia volta como "". */
export async function getSiteMediaUrls<K extends SiteMediaKey>(chaves: K[]): Promise<Record<K, string>> {
  const result = Object.fromEntries(chaves.map((c) => [c, ""])) as Record<K, string>;

  const { data, error } = await supabasePublic.from("site_media").select("chave, url").in("chave", chaves);
  if (error || !data) return result;

  for (const row of data) {
    if (row.url) result[row.chave as K] = row.url;
  }
  return result;
}
