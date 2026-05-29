export type MypageWithdrawAgreementKey = 'noticeChecked' | 'irreversibleChecked';

export type MypageWithdrawState = {
  noticeChecked: boolean;
  irreversibleChecked: boolean;
  password: string;
};

export const EMPTY_MYPAGE_WITHDRAW_STATE: MypageWithdrawState = {
  noticeChecked: false,
  irreversibleChecked: false,
  password: '',
};

export const MYPAGE_WITHDRAW_NOTICE_ITEMS = [
  '회원 탈퇴 후 계정과 모든 데이터는 복구할 수 없습니다',
  '작성한 게시물과 댓글은 삭제되지 않을 수 있습니다',
  '탈퇴 후 같은 이메일로 재가입할 수 없습니다',
  '진행 전에 반드시 개인정보를 백업해주세요',
] as const;
