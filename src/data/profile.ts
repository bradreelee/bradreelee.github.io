import type { Lang } from '../i18n';

// Edit this file to change the intro and contact links in each language.
const shared = {
  email: 'you@example.com',
  skills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'AWS'],
  links: [
    { label: 'GitHub', href: 'https://github.com/bradreelee' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/username' },
  ],
};

export const profiles = {
  ko: {
    ...shared,
    name: '이찬용',
    role: '풀스택 엔지니어',
    headline: '(예시) 한 줄 소개를 씁니다. 예: 서비스의 처음부터 끝까지 책임지는 풀스택 엔지니어입니다.',
    about: [
      '(예시) 자기소개 첫 문단입니다. 어떤 문제를 풀어 왔고, 어떤 방식으로 일하는지 씁니다.',
      '(예시) 두 번째 문단입니다. 다음 회사에서 하고 싶은 일이나 관심 분야를 씁니다.',
    ],
  },
  en: {
    ...shared,
    name: 'Your Name',
    role: 'Full-stack Engineer',
    headline: '(Sample) A one-line intro. e.g. A full-stack engineer who owns products end to end.',
    about: [
      '(Sample) First paragraph: what problems you have solved and how you work.',
      '(Sample) Second paragraph: what you want to work on next.',
    ],
  },
} satisfies Record<Lang, typeof shared & { name: string; role: string; headline: string; about: string[] }>;
