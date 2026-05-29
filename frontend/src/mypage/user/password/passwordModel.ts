export type MypagePasswordData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export const EMPTY_MYPAGE_PASSWORD: MypagePasswordData = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};
