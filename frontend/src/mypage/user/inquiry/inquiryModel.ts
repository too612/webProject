export type MypageInquiryItem = {
  id: number;
  title: string;
  status: '답변완료' | '답변대기';
  date: string;
  reply: string;
};

export const EMPTY_MYPAGE_INQUIRIES: MypageInquiryItem[] = [];
