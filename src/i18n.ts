export const langs = ['ko', 'en'] as const;
export type Lang = (typeof langs)[number];
export const defaultLang: Lang = 'ko';

export const ui = {
  ko: {
    htmlLang: 'ko',
    dateLocale: 'ko-KR',
    switchLabel: 'English',
    switchAria: 'Read in English',
    nav: { home: '홈', projects: '프로젝트', blog: '기록' },
    navAria: '주요 메뉴',
    contactAria: '연락처',
    present: '현재',
    type: { work: '경력', education: '학력', community: '활동', personal: '개인' },
    orgProjectsAria: (org: string) => `${org}에서 한 프로젝트`,
    projects: { title: '프로젝트', description: '조직별로 정리한 프로젝트 목록입니다.' },
    blog: {
      title: '기록',
      description: '프로젝트를 수행하며 겪은 문제를 해결한 과정들을 기록합니다.',
      empty: '아직 공개한 글이 없습니다.',
      all: '전체 글',
    },
    relatedPosts: '관련 글',
    relatedProject: '관련 프로젝트',
  },
  en: {
    htmlLang: 'en',
    dateLocale: 'en-US',
    switchLabel: '한국어',
    switchAria: '한국어로 보기',
    nav: { home: 'Home', projects: 'Projects', blog: 'Notes' },
    navAria: 'Main menu',
    contactAria: 'Contact',
    present: 'Present',
    type: { work: 'Work', education: 'Education', community: 'Community', personal: 'Personal' },
    orgProjectsAria: (org: string) => `Projects at ${org}`,
    projects: { title: 'Projects', description: 'Projects grouped by organization.' },
    blog: {
      title: 'Notes',
      description: 'How I solved the problems I ran into while working on projects.',
      empty: 'No posts yet.',
      all: 'All posts',
    },
    relatedPosts: 'Related posts',
    relatedProject: 'Related project',
  },
} as const;

/** Site path for a language. path is language-neutral and starts with "/", e.g. "/projects/". */
export const localize = (lang: Lang, path: string) => (lang === defaultLang ? path : `/${lang}${path}`);

export const otherLang = (lang: Lang): Lang => (lang === 'ko' ? 'en' : 'ko');

/** getStaticPaths entries for the [...lang] route segment: Korean at the root, English under /en. */
export const langParams = () =>
  langs.map((lang) => ({ lang, param: lang === defaultLang ? undefined : lang }));
