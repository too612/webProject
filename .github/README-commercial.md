# GitHub Copilot용 Harness Lab (상업용 확장판)

> 이 프로젝트는 [`revfactory/harness`](https://github.com/revfactory/harness)의 황민호 님 스킬을 기반으로,
> GitHub Copilot 환경에 맞게 재구성한 교육용 배포본입니다.
> 학습용(Phase 2-9)부터 상업용(Phase 0-15)까지 단계적으로 확장할 수 있습니다.

---

## 설치

`.github/` 폴더를 프로젝트 루트에 복사합니다.

```bash
cp -R .github /path/to/your-project/
```

### 필수 설정 (VS Code)

```
Ctrl+Shift+P → "Preferences: Open Settings (UI)" → "chat.promptFiles" 검색 → 활성화
```

또는 `settings.json`:

```json
{ "chat.promptFiles": true }
```

> prompt 파일은 **VS Code, Visual Studio, JetBrains**에서만 지원됩니다.
> `.github/copilot-instructions.md`는 항상 읽힐 수 있으므로 짧은 라우팅만 두고,
> 상세 설명은 `.github/harness-lab/` 문서로 분리하는 구성을 권장합니다.

---

## 파일 구조

```
.github/
  copilot-instructions.md              ← 얇은 프로젝트 라우터 (항상 주입)
  instructions/
    harness-lab.instructions.md        ← 라우팅 힌트, 10줄 (applyTo: "**")
  prompts/
    harness-lab.prompt.md              ← 실행 입구 (agent: 'agent')
  harness-lab/                         ← 참조 문서 (수동 호출 시만 로드)
    phase-guide.md                     ← Phase 0-15 진행 가이드
    pattern-catalog.md                 ← 협업 + 장애 격리 패턴 (10가지)
    everyday-examples.md               ← 수준별 업무 예시
    testing-improvement.md             ← 테스트 4종 + 개선 프로세스
    security-guide.md                  ← Phase 10 보안 검토 (신규)
    deployment-guide.md                ← Phase 11-12 인프라 & 배포 (신규)
    observability-guide.md             ← Phase 13 관찰 가능성 & SLA (신규)
    governance-guide.md                ← Phase 1, 14-15 거버넌스 (신규)
    copilot-templates.md               ← 수준별 산출물 템플릿
```

---

## 라우팅 원칙

- `.github/copilot-instructions.md`에는 항상 필요한 짧은 전역 규칙과 라우팅만 둡니다.
- 하네스 개념 설명, Phase 표, 템플릿, 예시는 `.github/harness-lab/`에 둡니다.
- `.github/instructions/harness-lab.instructions.md`는 10줄 안팎의 경량 힌트만 유지합니다.
- 프로젝트별 실제 하네스 내용은 `.github/{project-name}/` 아래에 둡니다.
- `.github/prompts/`와 `.github/instructions/`에는 해당 프로젝트 폴더를 읽는 얇은 엔트리만 둡니다.

---

## 수준별 Phase 구조

| Stage              | Phase | 이름                            | 학습 | 팀도구 | 상업용 |
| ------------------ | ----- | ------------------------------- | :--: | :----: | :----: |
| **1. 사전 검토**   | 0     | 비즈니스 목표 & 이해관계자 정렬 |      |        |   ✅   |
|                    | 1     | 리스크 & 컴플라이언스 검토      |      |   ✅   |   ✅   |
| **2. 설계**        | 2     | 현재 상황 확인                  |  ✅  |   ✅   |   ✅   |
|                    | 3     | 일상 언어로 풀어보기            |  ✅  |   ✅   |   ✅   |
|                    | 4     | 산출물 정의                     |  ✅  |   ✅   |   ✅   |
|                    | 5     | 팀 패턴 선택                    |  ✅  |   ✅   |   ✅   |
|                    | 6     | Agent 설계                      |  ✅  |   ✅   |   ✅   |
|                    | 7     | Skill 설계                      |  ✅  |   ✅   |   ✅   |
|                    | 8     | Orchestrator 설계               |  ✅  |   ✅   |   ✅   |
| **3. 구현 & 검증** | 9     | 테스트와 개선                   |  ✅  |   ✅   |   ✅   |
|                    | 10    | 보안 검토                       |      |   ✅   |   ✅   |
|                    | 11    | 통합 & 인프라                   |      |   ✅   |   ✅   |
| **4. 배포 & 운영** | 12    | 스테이징 배포                   |      |        |   ✅   |
|                    | 13    | 관찰 가능성 & SLA               |      |        |   ✅   |
|                    | 14    | 인시던트 대응                   |      |        |   ✅   |
|                    | 15    | 변경 관리 & 거버넌스            |      |        |   ✅   |

---

## 사용 방법

### 기본 호출

```
/harness-lab 고객 지원 자동화 하네스를 상업용 수준으로 만들어줘.
/harness-lab 여행 계획 하네스를 학습용으로 만들어줘.
/harness-lab 현재 하네스를 팀 내부 도구에서 상업용으로 업그레이드해줘.
```

### 두 단계 흐름

| 단계         | 내용                                    | 사용자 행동                |
| ------------ | --------------------------------------- | -------------------------- |
| 1. 청사진    | 수준 확인 → Phase 범위 결정 → 구조 제안 | 내용 확인 후 피드백        |
| 2. 파일 생성 | 승인 후 `.github/` + `docs/` 파일 생성  | "좋아, 이 구조로 만들어줘" |

---

## 생성되는 파일 구조

### 학습 / POC

```
.github/
  {project-name}/
    overview.md
    roles.md
    flow.md
    templates.md
  instructions/
    {harness-name}-orchestrator.instructions.md
    {harness-name}-{task-skill}.instructions.md
  prompts/
    {harness-name}-orchestrator.prompt.md
artifacts/
  01-*.md  02-*.md  03-review.md  final.md
```

### 상업용 (Phase 0-15 전체)

```
.github/
  {project-name}/
    overview.md
    roles.md
    flow.md
    templates.md
    operations.md
  instructions/
    {harness-name}-orchestrator.instructions.md  ← applyTo: ".github/**"
    {harness-name}-{task-skill}.instructions.md
  prompts/
    {harness-name}-orchestrator.prompt.md        ← agent: 'agent'
artifacts/
docs/
  00-business-objectives.md
  01-risk-register.md
  01-compliance-checklist.md
  10-security-checklist.md
  10-threat-model.md
  11-infra-spec.md
  11-cost-budget.md
  12-deployment-plan.md
  12-rollback-plan.md
  13-slo-definition.md
  13-alert-rules.md
  14-runbook-{scenario}.md
  15-change-log.md
```

---

## 다른 환경과의 대응

| Claude Code                 | Codex CLI                   | GitHub Copilot                           |
| --------------------------- | --------------------------- | ---------------------------------------- |
| `/harness-lab`              | `$harness-lab`              | `/harness-lab`                           |
| `CLAUDE.md`                 | `AGENTS.md`                 | `.github/copilot-instructions.md`        |
| `.claude/skills/*.SKILL.md` | `.agents/skills/*.SKILL.md` | `.github/instructions/*.instructions.md` |
| 실행 Skill                  | 실행 Skill                  | `.github/prompts/*.prompt.md`            |

---

## 설계 규칙 요약

### instruction 파일 `applyTo` 범위

| 용도                    | 권장 설정               | 이유                       |
| ----------------------- | ----------------------- | -------------------------- |
| 라우팅 힌트 (10줄 이하) | `applyTo: "**"`         | 모든 요청에 경량 힌트 포함 |
| 하네스 작업 지시문      | `applyTo: ".github/**"` | 하네스 작업 시에만 포함    |
| 참조 문서               | 없음 (prompt에서 링크)  | 명시적 호출 시만 로드      |

### prompt 파일 frontmatter

```yaml
---
agent: "agent" # 'mode'가 아닌 'agent' 키
description: "..."
tools: ["search/codebase", "editFiles", "vscode/askQuestions"]
---
```

### 파일명 규칙

- Orchestrator: 반드시 `-orchestrator`로 끝남
- 프로젝트별 실제 내용: `.github/{project-name}/` 폴더 아래에 배치
- 상업용 문서: `docs/{phase번호}-{이름}.md` 형식
- 중간 산출물: `artifacts/{순번}-{이름}.md` 형식

---

## 트러블슈팅

| 증상                          | 원인                            | 해결                            |
| ----------------------------- | ------------------------------- | ------------------------------- |
| `/harness-lab`이 인식 안 됨   | `chat.promptFiles: true` 미설정 | VS Code 설정에서 활성화         |
| `/harness-lab`이 목록에 없음  | VS Code 재시작 필요             | 창 닫고 다시 열기               |
| instruction 파일이 느리게 함  | `applyTo: "**"` 파일이 너무 큼  | `.github/**`로 범위 축소        |
| Orchestrator가 파일을 못 찾음 | Markdown 링크 경로 오류         | prompt 위치 기준 상대 경로 확인 |
| GitHub.com에서 prompt 안 됨   | GitHub.com은 prompt 미지원      | VS Code에서 사용                |
