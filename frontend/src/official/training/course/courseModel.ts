export type CourseItem = {
  title: string;
  description: string;
};

export type CourseContent = {
  headline: string;
  summary: string;
  courses: CourseItem[];
};

export const DEFAULT_COURSE_CONTENT: CourseContent = {
  headline: '양육과정',
  summary:
    '말씀 위에 세워지는 성숙한 제자를 양육하기 위한 다양한 과정을 제공합니다.',
  courses: [
    {
      title: '생명의 삶',
      description: '기독교 신앙의 기초를 배우고 구원의 확신을 세우는 과정입니다.',
    },
    {
      title: '확신의 삶',
      description: '말씀과 기도, 교제를 통해 신앙 성숙을 돕는 과정입니다.',
    },
    {
      title: '새가족 과정',
      description: '교회에 처음 나온 새가족이 신앙과 교회 공동체에 잘 정착하도록 돕는 과정입니다.',
    },
    {
      title: '제자 훈련',
      description: '말씀과 삶이 통합된 제자로 성장하도록 체계적으로 훈련하는 과정입니다.',
    },
  ],
};