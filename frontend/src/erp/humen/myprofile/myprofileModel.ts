export type MyProfileAssignment = {
  assignmentKey: string;
  assignmentDate: string;
  assignmentEndDate?: string | null;
  assignmentTypeName?: string | null;
  deptName?: string | null;
  gradeName?: string | null;
  positionName?: string | null;
  jobTitleName?: string | null;
  assignmentContent?: string | null;
  concurrentAssignmentYn?: string | null;
  remark?: string | null;
};

export type MyProfileCareer = {
  careerKey: string;
  companyName: string;
  jobTitle?: string | null;
  jobResponsibility?: string | null;
  hireDate: string;
  retireDate?: string | null;
  employmentTypeName?: string | null;
  remark?: string | null;
};

export type MyProfileEducation = {
  educationKey: string;
  schoolTypeName?: string | null;
  schoolName: string;
  admissionDate?: string | null;
  graduationDate?: string | null;
  graduationStatusName?: string | null;
  degreeName?: string | null;
  fieldName?: string | null;
  major?: string | null;
  minor?: string | null;
  finalEducation?: boolean | null;
  remark?: string | null;
};

export type MyProfile = {
  employeeNo?: string | null;
  employeeLinked: boolean;
  nameKo: string;
  nameEn?: string | null;
  profilePhotoUrl?: string | null;
  deptName?: string | null;
  gradeName?: string | null;
  positionName?: string | null;
  employmentTypeName?: string | null;
  serviceStatusName?: string | null;
  birthDate?: string | null;
  genderCode?: string | null;
  hireDate?: string | null;
  retireDate?: string | null;
  promotionDate?: string | null;
  email: string;
  phone: string;
  postalCode?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  assignments: MyProfileAssignment[];
  careers: MyProfileCareer[];
  educations: MyProfileEducation[];
};

export type MyProfileContactUpdate = {
  email: string;
  phone: string;
  postalCode: string;
  addressLine1: string;
  addressLine2: string;
};

export function toMyProfileContactUpdate(
  profile: MyProfile,
): MyProfileContactUpdate {
  return {
    email: profile.email ?? "",
    phone: profile.phone ?? "",
    postalCode: profile.postalCode ?? "",
    addressLine1: profile.addressLine1 ?? "",
    addressLine2: profile.addressLine2 ?? "",
  };
}
