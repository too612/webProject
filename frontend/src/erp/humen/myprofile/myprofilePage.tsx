import {
  BadgeCheck,
  Briefcase,
  Building2,
  CalendarDays,
  GraduationCap,
  History,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Save,
  UserRound,
  X,
} from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  DetailPageShell,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../common/ui";
import { useMyProfilePage } from "./myprofileHook";
import type { MyProfileContactUpdate } from "./myprofileModel";

function formatDate(value?: string | null) {
  return value ? value.slice(0, 10) : "-";
}

function genderLabel(value?: string | null) {
  switch (value) {
    case "M":
      return "남성";
    case "F":
      return "여성";
    case "O":
      return "기타";
    case "U":
      return "미지정";
    default:
      return "-";
  }
}

function ReadOnlyField({
  label,
  value,
}: Readonly<{ label: string; value?: string | null }>) {
  return (
    <div className="min-w-0 border-b border-slate-100 py-3 last:border-b-0">
      <dt className="text-xs font-medium text-slate-500">{label}</dt>
      <dd className="mt-1 break-words text-sm text-slate-800">{value || "-"}</dd>
    </div>
  );
}

type ContactFieldProps = Readonly<{
  field: keyof MyProfileContactUpdate;
  label: string;
  type?: string;
  value: string;
  required?: boolean;
  disabled?: boolean;
  onChange: (field: keyof MyProfileContactUpdate, value: string) => void;
}>;

function ContactField({
  field,
  label,
  type = "text",
  value,
  required = false,
  disabled = false,
  onChange,
}: ContactFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={`myprofile-${field}`}>{label}</Label>
      <Input
        id={`myprofile-${field}`}
        type={type}
        value={value}
        required={required}
        disabled={disabled}
        onChange={(event) => onChange(field, event.target.value)}
        autoComplete={field}
      />
    </div>
  );
}

function EmptySection({ label }: Readonly<{ label: string }>) {
  return (
    <div className="rounded-none border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center text-sm text-slate-500">
      등록된 {label} 정보가 없습니다.
    </div>
  );
}

export default function MyProfilePage() {
  const {
    profile,
    form,
    activeTab,
    loading,
    saving,
    isEditing,
    error,
    message,
    setActiveTab,
    handleContactChange,
    handleSubmit,
    handleCancelEdit,
    handleStartEdit,
    loadProfile,
  } = useMyProfilePage();
  const contactFormId = "myprofile-contact-form";
  const roleSummary = [profile?.positionName, profile?.deptName]
    .filter(Boolean)
    .join(" · ");
  const address = [profile?.addressLine1, profile?.addressLine2]
    .filter(Boolean)
    .join(" ");

  return (
    <DetailPageShell
      actions={
        profile ? (
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button
                  type="submit"
                  form={contactFormId}
                  disabled={saving}
                >
                  <Save className="h-4 w-4" />
                  {saving ? "저장 중..." : "저장"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={saving}
                >
                  <X className="h-4 w-4" /> 취소
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={handleStartEdit}>
                <Pencil className="h-4 w-4" /> 연락처 수정
              </Button>
            )}
          </div>
        ) : undefined
      }
      contentClassName="space-y-4"
    >
      {loading && !profile ? (
        <div
          className="flex min-h-48 items-center justify-center text-sm text-slate-500"
          role="status"
        >
          내 정보를 불러오는 중입니다...
        </div>
      ) : !profile ? (
        <div className="space-y-4">
          <div
            className="rounded-none border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            {error || "내 정보를 표시할 수 없습니다."}
          </div>
          <Button
            variant="outline"
            onClick={() => void loadProfile()}
            disabled={loading}
          >
            다시 불러오기
          </Button>
        </div>
      ) : (
        <>
          <header className="overflow-hidden border border-slate-200 bg-white">
            <div className="h-16 bg-slate-100 sm:h-20" />
            <div className="flex flex-col gap-4 px-4 pb-4 sm:flex-row sm:items-end sm:px-6">
              <Avatar className="-mt-8 h-16 w-16 border-2 border-white bg-white sm:-mt-10 sm:h-20 sm:w-20">
                <AvatarImage
                  src={profile.profilePhotoUrl || undefined}
                  alt={profile.nameKo}
                />
                <AvatarFallback className="bg-slate-100 text-xl text-slate-700">
                  {profile.nameKo.slice(0, 1)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1 sm:pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-semibold text-slate-900">
                    {profile.nameKo}
                  </h2>
                  {profile.employeeNo ? (
                    <Badge variant="outline">{profile.employeeNo}</Badge>
                  ) : (
                    <Badge variant="outline">사번 미연결</Badge>
                  )}
                  {profile.serviceStatusName && (
                    <Badge variant="success">{profile.serviceStatusName}</Badge>
                  )}
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  {roleSummary || "소속 및 직위 정보 없음"}
                  {profile.nameEn ? ` · ${profile.nameEn}` : ""}
                </p>
              </div>
              {profile.employmentTypeName && (
                <Badge variant="secondary" className="w-fit sm:mb-2">
                  {profile.employmentTypeName}
                </Badge>
              )}
            </div>
          </header>

          {error && (
            <div
              className="rounded-none border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              role="alert"
            >
              {error}
            </div>
          )}
          {message && (
            <div
              className="rounded-none border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
              role="status"
            >
              {message}
            </div>
          )}
          {!profile.employeeLinked && (
            <div
              className="rounded-none border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
              role="status"
            >
              계정 정보는 표시하고 수정할 수 있지만, 인사정보 연결이 아직 설정되지 않아 소속·발령·경력·학력은 표시되지 않습니다. 관리자에게 계정과 사번 연결을 요청하세요.
            </div>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="h-auto w-full justify-start gap-2 overflow-x-auto rounded-none border-b border-slate-200 bg-transparent p-0">
          <TabsTrigger
            value="info"
            className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-cyan-700 data-[state=active]:bg-transparent data-[state=active]:text-cyan-800 data-[state=active]:shadow-none"
          >
            <UserRound className="mr-2 h-4 w-4" /> 정보
          </TabsTrigger>
          <TabsTrigger
            value="assignment"
            className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-cyan-700 data-[state=active]:bg-transparent data-[state=active]:text-cyan-800 data-[state=active]:shadow-none"
          >
            <Building2 className="mr-2 h-4 w-4" /> 발령
          </TabsTrigger>
          <TabsTrigger
            value="career"
            className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-cyan-700 data-[state=active]:bg-transparent data-[state=active]:text-cyan-800 data-[state=active]:shadow-none"
          >
            <History className="mr-2 h-4 w-4" /> 경력
          </TabsTrigger>
          <TabsTrigger
            value="education"
            className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-cyan-700 data-[state=active]:bg-transparent data-[state=active]:text-cyan-800 data-[state=active]:shadow-none"
          >
            <GraduationCap className="mr-2 h-4 w-4" /> 학력
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="mt-5">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
            <Card>
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Briefcase className="h-4 w-4 text-cyan-700" />
                  인사 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <dl className="grid gap-x-8 sm:grid-cols-2">
                  <ReadOnlyField label="이름" value={profile.nameKo} />
                  <ReadOnlyField label="영문 이름" value={profile.nameEn} />
                  <ReadOnlyField label="생년월일" value={formatDate(profile.birthDate)} />
                  <ReadOnlyField label="성별" value={genderLabel(profile.genderCode)} />
                  <ReadOnlyField label="소속" value={profile.deptName} />
                  <ReadOnlyField label="직급" value={profile.gradeName} />
                  <ReadOnlyField label="직위" value={profile.positionName} />
                  <ReadOnlyField label="고용형태" value={profile.employmentTypeName} />
                  <ReadOnlyField label="재직구분" value={profile.serviceStatusName} />
                  <ReadOnlyField label="입사일" value={formatDate(profile.hireDate)} />
                  <ReadOnlyField label="퇴사일" value={formatDate(profile.retireDate)} />
                  <ReadOnlyField label="최근 승진일" value={formatDate(profile.promotionDate)} />
                </dl>
                <p className="mt-4 rounded-lg bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-500">
                  인사 원장 정보는 조회 전용입니다. 변경이 필요하면 인사 담당자에게 문의하세요.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base">연락처 정보</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <form
                    id={contactFormId}
                    className="space-y-4"
                    onSubmit={handleSubmit}
                  >
                    <ContactField
                      field="email"
                      label="이메일"
                      type="email"
                      value={form.email}
                      required
                      disabled={saving}
                      onChange={handleContactChange}
                    />
                    <ContactField
                      field="phone"
                      label="연락처"
                      type="tel"
                      value={form.phone}
                      required
                      disabled={saving}
                      onChange={handleContactChange}
                    />
                    <ContactField
                      field="postalCode"
                      label="우편번호"
                      value={form.postalCode}
                      disabled={saving}
                      onChange={handleContactChange}
                    />
                    <ContactField
                      field="addressLine1"
                      label="주소"
                      value={form.addressLine1}
                      disabled={saving}
                      onChange={handleContactChange}
                    />
                    <ContactField
                      field="addressLine2"
                      label="상세 주소"
                      value={form.addressLine2}
                      disabled={saving}
                      onChange={handleContactChange}
                    />
                  </form>
                ) : (
                  <dl className="space-y-4">
                    <ReadOnlyField label="이메일" value={profile.email} />
                    <ReadOnlyField label="연락처" value={profile.phone} />
                    <div className="border-b border-slate-100 py-3 last:border-b-0">
                      <dt className="flex items-center gap-2 text-xs font-medium text-slate-500">
                        <MapPin className="h-3.5 w-3.5" /> 주소
                      </dt>
                      <dd className="mt-1 break-words text-sm text-slate-800">
                        {[profile.postalCode, address].filter(Boolean).join(" ") || "-"}
                      </dd>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5" /> 계정 연락처
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5" /> 본인 수정 가능
                      </span>
                    </div>
                  </dl>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="assignment" className="mt-5 space-y-4">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-cyan-700" />
            <h2 className="text-lg font-semibold text-slate-900">발령 이력</h2>
          </div>
          {profile.assignments.length === 0 ? (
            <EmptySection label="발령" />
          ) : (
            <div className="space-y-3">
              {profile.assignments.map((assignment) => (
                <Card key={assignment.assignmentKey}>
                  <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-start">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-50 text-cyan-800">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-slate-900">
                          {assignment.assignmentTypeName || "발령"}
                        </h3>
                        {assignment.concurrentAssignmentYn === "Y" && (
                          <Badge variant="outline">겸임</Badge>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-slate-600">
                        {[assignment.deptName, assignment.gradeName, assignment.positionName, assignment.jobTitleName]
                          .filter(Boolean)
                          .join(" · ") || "-"}
                      </p>
                      {assignment.assignmentContent && (
                        <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">
                          {assignment.assignmentContent}
                        </p>
                      )}
                      {assignment.remark && (
                        <p className="mt-2 text-xs text-slate-500">{assignment.remark}</p>
                      )}
                    </div>
                    <div className="shrink-0 text-sm text-slate-500">
                      {formatDate(assignment.assignmentDate)}
                      {assignment.assignmentEndDate
                        ? ` - ${formatDate(assignment.assignmentEndDate)}`
                        : ""}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="career" className="mt-5 space-y-4">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-cyan-700" />
            <h2 className="text-lg font-semibold text-slate-900">경력</h2>
          </div>
          {profile.careers.length === 0 ? (
            <EmptySection label="경력" />
          ) : (
            <div className="space-y-3">
              {profile.careers.map((career) => (
                <Card key={career.careerKey}>
                  <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-start">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-slate-900">{career.companyName}</h3>
                        {career.employmentTypeName && (
                          <Badge variant="outline">{career.employmentTypeName}</Badge>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-slate-600">
                        {[career.jobTitle, career.jobResponsibility].filter(Boolean).join(" · ") || "-"}
                      </p>
                      {career.remark && (
                        <p className="mt-2 text-xs text-slate-500">{career.remark}</p>
                      )}
                    </div>
                    <div className="shrink-0 text-sm text-slate-500">
                      {formatDate(career.hireDate)} - {formatDate(career.retireDate)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="education" className="mt-5 space-y-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-cyan-700" />
            <h2 className="text-lg font-semibold text-slate-900">학력</h2>
          </div>
          {profile.educations.length === 0 ? (
            <EmptySection label="학력" />
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {profile.educations.map((education) => (
                <Card key={education.educationKey}>
                  <CardHeader className="pb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <CardTitle className="text-base">{education.schoolName}</CardTitle>
                      {education.finalEducation && (
                        <Badge variant="info">
                          <BadgeCheck className="mr-1 h-3.5 w-3.5" /> 최종학력
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-500">
                      {[education.schoolTypeName, education.graduationStatusName]
                        .filter(Boolean)
                        .join(" · ") || "-"}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-slate-600">
                    <p>
                      {[education.degreeName, education.fieldName, education.major]
                        .filter(Boolean)
                        .join(" · ") || "-"}
                    </p>
                    {education.minor && <p>부전공: {education.minor}</p>}
                    <p className="text-xs text-slate-500">
                      {formatDate(education.admissionDate)} - {formatDate(education.graduationDate)}
                    </p>
                    {education.remark && (
                      <p className="whitespace-pre-wrap text-xs">{education.remark}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
          </Tabs>
        </>
      )}
    </DetailPageShell>
  );
}
