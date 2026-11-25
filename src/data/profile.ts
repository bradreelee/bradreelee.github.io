import type { Lang } from '../i18n';

// Edit this file to change the intro and contact links in each language.
const shared = {
  nickname: 'Brad',
  email: 'chantree607@gmail.com',
  skills: ['React Native', 'React', 'TypeScript', 'Flutter', 'Reanimated', 'Tailwind CSS'],
  links: [
    { label: 'GitHub', href: 'https://github.com/bradreelee' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/chan-yong-lee-40939b1a0/' },
  ],
};

export const profiles = {
  ko: {
    ...shared,
    name: '이찬용',
    role: '풀스택 엔지니어',
    headline: 'AI로 개발의 한계를 넓히고, 기술적 전문성으로 결과에 책임지는 엔지니어입니다.',
    about: [
      '독일 아헨 공과대학에서 컴퓨터과학을 전공하고, 2022년 LG CNS에 입사해 웹 풀스택과 모바일 개발을 경험했습니다. 현재는 태국 가상은행 BankX 구축 프로젝트에 React Native 개발자로 참여하고 있습니다.',
      '사이드프로젝트인 소개팅 서비스 아모링의 개발을 총괄하고 있습니다. 기존 서비스를 혼자 40일 만에 재개발하고 직접 운영하면서, 기술적 의사결정뿐 아니라 제품의 방향과 성과에도 책임지는 일에 매력을 느꼈습니다.',
      '기술의 내부 동작을 이해하고 문제의 근본 원인을 해결하는 것을 중요하게 생각합니다. AI가 코드 작성을 대체하더라도 기술적 전문성을 바탕으로 그 결과에 책임지며, 기술과 제품 양쪽의 의사결정에 기여하는 프로덕트 엔지니어를 지향합니다.',
    ],
  },
  en: {
    ...shared,
    name: 'Chan Yong Lee',
    role: 'Full-stack Engineer',
    headline: 'I use AI to expand what I can build, backed by the technical expertise to stand behind the results.',
    about: [
      'I studied Computer Science at RWTH Aachen University and joined LG CNS in 2022, working across full-stack web and mobile development. I currently work as a React Native engineer on BankX, a new digital bank being built in Thailand.',
      'I also lead engineering for Amoring, a dating app that I rebuilt independently in 40 days. Building and operating a product firsthand has drawn me toward taking ownership of not only technical decisions but also product direction and outcomes.',
      'I value understanding how technology works and solving problems at their root. Even as AI takes over code generation, I believe engineers must have the technical expertise to stand behind the software they ship. I aspire to be a product engineer who contributes to both engineering and product decisions.',
    ],
  },
} satisfies Record<Lang, typeof shared & { name: string; role: string; headline: string; about: string[] }>;
