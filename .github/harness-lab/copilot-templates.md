# GitHub Copilot 산출물 템플릿

실행 하네스 생성 시 사용한다. 수준에 따라 필요한 템플릿만 사용한다.

---

## 수준별 생성 파일 목록

### 학습 / POC (Phase 2-9)

```
.github/
  copilot-instructions.md          ← 라우팅 섹션 추가
  {project-name}/
    overview.md
    roles.md
    flow.md
    templates.md
  instructions/
    {harness-name}-orchestrator.instructions.md  ← applyTo: ".github/**"
    {harness-name}-{task-skill}.instructions.md
  prompts/
    {harness-name}-orchestrator.prompt.md
artifacts/
```

### 팀 내부 도구 (Phase 1-11)

위에 추가:

```
docs/
  01-risk-register.md
  01-compliance-checklist.md
  10-security-checklist.md
  11-infra-spec.md
  11-cost-budget.md
```

### 상업용 서비스 (Phase 0-15)

위에 추가:

```
docs/
  00-business-objectives.md
  12-deployment-plan.md
  12-rollback-plan.md
  13-slo-definition.md
  13-alert-rules.md
  14-runbook-{scenario}.md
  15-change-log.md
```

---

## `.github/instructions/{skill-name}.instructions.md`

프로젝트별 실제 내용은 `.github/{project-name}/` 아래에 두고,
이 파일은 그 내용을 읽는 얇은 엔트리로 사용한다.

```md
---
applyTo: ".github/**"
---

# {Skill 이름}

## 목적

이 지시문은 {역할}이 {작업}을 일관되게 수행하도록 돕는다.

## 역할 정의

당신은 {역할 이름}입니다.

### 책임

-

### 입력

-

### 출력

-

### 하지 말아야 할 일

- 역할 밖의 결정을 대신 확정하지 않는다.
- 확인하지 않은 사실을 단정하지 않는다.

## 절차

1. `.github/{project-name}/` 아래의 역할 정의와 템플릿을 먼저 확인한다.
2. 입력 자료를 확인한다.
3. 빠진 조건을 표시한다.
4. 결과를 작성한다.
5. 품질 기준으로 점검한다.

## 에러 처리 (상업용)

- 타임아웃: {N}초 초과 시 재시도, 최대 {N}회
- 폴백: 재시도 실패 시 {동작}
- 사람 확인 조건: {조건}이면 처리를 멈추고 알린다.

## 품질 기준

- 결과가 사용자의 원래 목표와 연결되어야 한다.
- 근거와 추측을 구분해야 한다.
- 다음 단계에서 바로 사용할 수 있어야 한다.
```

---

## `.github/instructions/{harness-name}-orchestrator.instructions.md`

Orchestrator 지시문. 파일명은 반드시 `-orchestrator`로 끝난다.
프로젝트별 실제 흐름 설명은 `.github/{project-name}/flow.md` 등에 둔다.

```md
---
applyTo: ".github/**"
---

# {하네스 이름} Orchestrator 지시문

## 목적

{업무 이름}을 여러 역할로 나누고, 중간 산출물을 이어서 최종 결과를 만든다.

## 입력

- 사용자 요청:
- 참고 자료: `.github/{project-name}/`
- 제약 조건:

## 실행 흐름

1. `.github/{project-name}/overview.md`, `roles.md`, `flow.md`를 먼저 확인한다.
2. 요청 목적과 최종 산출물을 확인한다.
3. {역할 A}가 {중간 산출물 A}를 만든다. → `artifacts/01-{name}.md`
4. {역할 B}가 이를 바탕으로 {중간 산출물 B}를 만든다. → `artifacts/02-{name}.md`
5. {검토 역할}이 누락, 충돌, 수준 불일치를 확인한다. → `artifacts/03-review.md`
6. 최종 결과를 보고한다. → `artifacts/final.md`

## 상태 관리 (상업용)

- 각 단계 완료 시 `artifacts/{단계}-status.json`에 상태 기록
- 재시작 시 완료된 단계는 건너뛴다.

## 재시도 정책 (상업용)

- 일시적 오류 (타임아웃, API 오류): 최대 3회 재시도, 지수 백오프
- 영구 오류 (잘못된 입력, 권한 없음): 즉시 중단 후 사용자에게 보고

## 폴백 (상업용)

- 외부 API 실패: {대안 동작}
- LLM 응답 품질 미달: 사람 검토 요청

## 실패 처리

- 입력이 부족하면 생성 전에 빠진 정보를 질문한다.
- 품질 기준 미달 시 수정 목록을 먼저 제시한다.
- 재시도 한계 초과 시 현재까지의 결과와 함께 실패 원인을 보고한다.
```

---

## `.github/prompts/{harness-name}-orchestrator.prompt.md`

파일명은 반드시 `-orchestrator`로 끝난다.
이 프롬프트는 얇은 실행 입구만 담당하고, 실제 설명은 `.github/{project-name}/`를 읽는다.

```md
---
agent: "agent"
description: "{업무 이름} 하네스의 전체 흐름을 실행하는 Orchestrator"
tools: ["search/codebase", "editFiles", "vscode/askQuestions"]
---

# {하네스 이름} Orchestrator

[실행 지시문](./../instructions/{harness-name}-orchestrator.instructions.md) 참고.

프로젝트별 실제 내용은 `.github/{project-name}/` 아래 문서를 우선 참고한다.

## 시작 전 확인

필요한 정보가 부족하면 #tool:vscode/askQuestions 으로 한 가지 질문을 먼저 한다.

## 실행

지시문의 흐름에 따라 단계별로 진행하고,
각 단계의 결과를 `artifacts/` 폴더에 저장합니다.
```

---

## `.github/copilot-instructions.md` 추가 섹션

기존 파일에 내용을 지우지 말고, 항상 필요한 짧은 라우팅만 추가한다.
상세 설명, Phase 표, 예시, 템플릿은 `.github/harness-lab/` 문서에 둔다.

```md
## {하네스 이름} 하네스

- Orchestrator 프롬프트: `.github/prompts/{harness-name}-orchestrator.prompt.md`
- 작업 지시문: `.github/instructions/`
- 프로젝트별 실제 내용: `.github/{project-name}/`
- 산출물: `artifacts/`
- 상업용 문서: `docs/`
- 상세 가이드: `.github/harness-lab/`

아래 요청이 오면 `/{harness-name}-orchestrator` 프롬프트를 우선 실행한다:

- "{업무} 계획을 만들어줘"
- "{업무} 초안을 정리해줘"
- "{업무}를 역할별로 나눠서 진행해줘"
```

---

## 상업용 문서 템플릿

### `docs/00-business-objectives.md`

```md
# 비즈니스 목표 — {하네스 이름}

## 해결하는 문제

-

## 성공 지표 (KPI)

| 지표 | 현재 | 목표 | 측정 방법 |
| ---- | ---- | ---- | --------- |

## 이해관계자

| 역할        | 이름 | 관심사 |
| ----------- | ---- | ------ |
| 의사결정자  |      |        |
| 운영자      |      |        |
| 최종 사용자 |      |        |

## 예산 및 타임라인

- 예산:
- MVP 목표일:
- 전체 출시 목표일:
```

### `docs/13-slo-definition.md`

```md
# SLO 정의 — {하네스 이름}

## 가용성

- SLI: 성공 응답 수 / 전체 요청 수
- SLO: {N}%
- SLA: {N}%

## 응답 시간

- SLI: 요청부터 최종 응답까지 (p95)
- SLO: p95 < {N}초
- SLA: p95 < {N}초

## 에러율

- SLI: 에러 응답 수 / 전체 요청 수
- SLO: < {N}%

## 에러 예산

- 월 허용 다운타임: {N}시간
- 에러 예산 소진 80% 시: 신규 배포 중단
```

---

## 개선 기록 템플릿

```md
## 개선 기록

- 날짜:
- 하네스 이름:
- 버전: v{N}
- 발견 경위: 테스트 / 운영 중 감지 / 포스트모템
- 변경 대상: Agent / Skill / Orchestrator / 인프라
- 변경 내용:
- 검증 방법:
- 다음 버전에서 바꿀 규칙:
```
