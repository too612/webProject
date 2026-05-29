import { EMPTY_MYPAGE_PROFILE, type MypageProfileData } from './profileModel';

export const mypageProfileApi = {
  async getProfileData(): Promise<MypageProfileData> {
    return EMPTY_MYPAGE_PROFILE;
  },

  async updateProfileData(_data: MypageProfileData): Promise<void> {
    return;
  },
};
