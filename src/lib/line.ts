import { getCollection, type CollectionEntry } from 'astro:content';

export type Org = CollectionEntry<'timeline'>;
export type Project = CollectionEntry<'projects'>;

export const typeLabel: Record<Org['data']['type'], string> = {
  work: '경력',
  education: '학력',
  community: '활동',
};

export const ym = (d: Date) => `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}`;
export const period = (start: Date, end?: Date) => `${ym(start)} – ${end ? ym(end) : '현재'}`;

const byStartDesc = <T extends { data: { start: Date } }>(a: T, b: T) =>
  b.data.start.getTime() - a.data.start.getTime();

/** Organizations newest first, each with its projects (newest first). */
export async function getTimeline() {
  const [orgs, projects] = await Promise.all([getCollection('timeline'), getCollection('projects')]);
  return orgs.sort(byStartDesc).map((org) => ({
    org,
    projects: projects.filter((p) => p.data.org.id === org.id).sort(byStartDesc),
  }));
}

export async function getPosts() {
  return (await getCollection('blog', (p) => import.meta.env.DEV || !p.data.draft)).sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime(),
  );
}
