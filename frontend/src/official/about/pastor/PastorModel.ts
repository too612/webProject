export type Pastor = {
  corpId: number;
  corpName: string;
  businessRegistrationNumber: string;
  chiefName: string;
  chiefImagePath?: string;
  phoneNumber?: string;
  postalCode?: string;
  addressLine1?: string;
  addressLine2?: string;
  introduction?: string;
  updatedAt?: string;
};

export type PastorRequest = {
  corpName: string;
  businessRegistrationNumber: string;
  chiefName: string;
  chiefImagePath?: string;
  phoneNumber?: string;
  postalCode?: string;
  addressLine1?: string;
  addressLine2?: string;
  introduction?: string;
  createdBy?: string;
  createdIp?: string;
  updatedBy?: string;
  updatedIp?: string;
};
