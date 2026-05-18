# GitHub Copilot용 Harness Lab

> 이 프로젝트는 [`revfactory/harness`](https://github.com/revfactory/harness)의 황민호 님 스킬을 기반으로,
> GitHub Copilot 환경에 맞게 재구성한 교육용 배포본입니다.

## 설치

`.github/` 폴더를 프로젝트 루트에 복사합니다.

```bash
cp -R .github /path/to/your-project/
```

## 필수 설정 (VS Code)

prompt 파일은 VS Code에서 `chat.promptFiles` 설정을 활성화해야 동작합니다.

**방법 1 — UI:**
```
Ctrl+Shift+P → "Preferences: Open Settings (UI)" → "chat.promptFiles" 검색 → 활성화
```

**방법 2 — settings.json:**
```json
{
  "chat.promptFiles": true
}
```

> prompt 파일은 **VS Code, Visual Studio, JetBrains IDE**에서만 지원됩니다.  
> `.github/copilot-instructions.md`와 `instructions/` 파일은 모든 환경에서 지원됩니다.

## 파일 구조

```
.github/
  copilot-instructions.md              ← 프로젝트 라우팅 (항상 주입됨)
  instructions/
    harness-lab.instructions.md        ← 라우팅 힌트, 13줄 (applyTo: "**")
  prompts/
    harness-lab.prompt.md              ← 실행 입구 (agent: 'agent')
  harness-lab/                         ← 참조 문서 (수동 호출 시만 로드됨)
    phase-guide.md
    pattern-catalog.md
    everyday-examples.md
    testing-improvement.md
    copilot-templates.md
```

### 다른 환경과의 대응

| Claude Code | Codex CLI | GitHub Copilot |
| --- | --- | --- |
| `/harness-lab` | `$harness-lab` | `/harness-lab` |
| `CLAUDE.md` | `AGENTS.md` | `.github/copilot-instructions.md` |
| `.claude/skills/*.SKILL.md` | `.agents/skills/*.SKILL.md` | `.github/instructions/*.instructions.md` |
| `.claude/agents/*.md` | `.codex/agents/*.toml` | 역할을 instruction 파일 섹션으로 정의 |
| 실행 Skill | 실행 Skill | `.github/prompts/*.prompt.md` |

## 사용 방법

### 1. 새 하네스 만들기

VS Code Copilot Chat 입력창에 `/harness-lab`을 입력합니다.

```
/harness-lab 1박 2일 가족 여행 계획을 위한 작은 하네스를 만들어줘.
```

또는 Chat 입력창에서 `#`을 누른 뒤 `harness-lab`을 선택합니다.

### 2. 두 단계 흐름

| 단계 | 내용 | 사용자 행동 |
| --- | --- | --- |
| 1. 청사진 제안 | Agent/Skill/Orchestrator 구조, 역할표, 테스트 프롬프트 제안 | 내용 확인 후 피드백 |
| 2. 파일 생성 | 승인 후 `.github/` 하위 실행 파일 생성 | "좋아, 이 구조로 만들어줘" |

### 3. 생성된 하네스 사용

harness-lab이 새 하네스를 만들면 직접 호출하거나, 자연어로 요청합니다.

```
# 직접 호출
/trip-planning-orchestrator 제주 2박 3일 여행 계획을 만들어줘.

# 자연어 (copilot-instructions.md 라우팅 규칙 적용)
부모님과 제주 여행 계획을 만들어줘.
```

## 생성되는 파일 구조 (예: 여행 계획 하네스)

```
.github/
  copilot-instructions.md          ← 라우팅 섹션 추가됨
  instructions/
    trip-planning-orchestrator.instructions.md   ← applyTo: ".github/**"
    trip-research-guide.instructions.md          ← applyTo: ".github/**"
  prompts/
    trip-planning-orchestrator.prompt.md         ← agent: 'agent'
artifacts/
  01-research.md
  02-itinerary.md
  03-review.md
  final.md
```

| 위치 | 비유 | 역할 |
| --- | --- | --- |
| `instructions/{skill}.instructions.md` | 작업 매뉴얼 | 역할별 절차, 산출물 형식, 품질 기준 |
| `instructions/{name}-orchestrator.instructions.md` | 진행 지시문 | 전체 흐름, 단계별 담당, 실패 처리 |
| `prompts/{name}-orchestrator.prompt.md` | 호출 입구 | Chat에서 `/name`으로 실행 |
| `copilot-instructions.md` | 안내판 | 자연어 라우팅 규칙 |
| `artifacts/` | 작업 기록지 | 단계별 산출물 |

## 설계 규칙

### instruction 파일의 `applyTo` 범위

`applyTo: "**"` 는 **모든 Copilot 요청에 자동 주입**됩니다.
파일이 크면 모든 요청이 느려지고 토큰이 낭비됩니다.

| 용도 | 권장 설정 |
| --- | --- |
| 라우팅 힌트 (짧은 파일) | `applyTo: "**"` |
| 하네스 작업 지시문 | `applyTo: ".github/**"` |
| 참조 문서 | prompt에서 Markdown 링크로 로드 |

### prompt 파일 frontmatter 정확한 형식

```yaml
---
agent: 'agent'              # ← 'mode'가 아닌 'agent' 키 사용
description: '...'          # ← Chat picker에 표시될 설명
tools: ['search/codebase', 'editFiles', 'vscode/askQuestions']
---
```

### prompt 파일에서 다른 파일 참조

```md
[Phase 가이드](../harness-lab/phase-guide.md)
```

`#file:` 문법은 Chat 입력창에서만 동작하고, prompt 파일 내부에서는 Markdown 링크를 사용합니다.

### prompt 파일 호출

```
/harness-lab           ← 파일명에서 .prompt.md 제거
/trip-planning-orchestrator
```

## 트러블슈팅

| 증상 | 원인 | 해결 |
| --- | --- | --- |
| `/harness-lab`이 인식 안 됨 | `chat.promptFiles: true` 미설정 | VS Code 설정에서 활성화 |
| `/harness-lab`이 목록에 없음 | VS Code 재시작 필요 | 창 닫고 다시 열기 |
| instruction 파일이 느리게 함 | `applyTo: "**"` 파일이 너무 큼 | `applyTo: ".github/**"` 로 범위 축소 |
| Orchestrator가 파일을 못 찾음 | Markdown 링크 경로 오류 | prompt 파일 위치 기준 상대 경로 확인 |
| GitHub.com에서 prompt 안 됨 | GitHub.com은 prompt 미지원 | VS Code에서 사용 |
