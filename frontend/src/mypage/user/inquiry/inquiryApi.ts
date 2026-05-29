import type { MypageInquiryItem } from './inquiryModel';

const DEFAULT_INQUIRIES: MypageInquiryItem[] = [
  { id: 1, title: '문의 제목1', status: '답변완료', date: '2026-05-01', reply: '감사합니다' },
  { id: 2, title: '문의 제목2', status: '답변대기', date: '2026-04-28', reply: '' },
  { id: 3, title: '문의 제목3', status: '답변완료', date: '2026-04-25', reply: '안내드립니다' },
];

export const mypageInquiryApi = {
  async getInquiryList(): Promise<MypageInquiryItem[]> {
    return DEFAULT_INQUIRIES;
  },
};
