# GitHub Copilot용 Harness Lab

> **감사의 말**
> 이 프로젝트는 [`revfactory/harness`](https://github.com/revfactory/harness)를 만드신 카카오의 황민호 님의 스킬을 기반으로,
> 하네스 엔지니어링을 더 쉽게 실습할 수 있도록 교육용 흐름에 맞게 재구성한 것입니다.
> GitHub Copilot 버전은 Claude Code / Codex 버전과 동일한 교육 목표를 가집니다.

이 폴더는 `harness-lab`을 GitHub Copilot 방식으로 사용할 수 있도록 구성한 배포본입니다.

```text
.github/
  copilot-instructions.md          ← 프로젝트 안내판 (자연어 라우팅 규칙)
  instructions/
    harness-lab.instructions.md    ← 핵심 스킬 지시문
    phase-guide.instructions.md    ← Phase 0-7 진행 가이드
    pattern-catalog.instructions.md ← 팀 패턴 카탈로그
    everyday-examples.instructions.md ← 일상 업무 예시
    testing-improvement.instructions.md ← 테스트와 개선 가이드
    copilot-templates.instructions.md ← 산출물 템플릿
  prompts/
    harness-lab.prompt.md          ← 실행 입구 프롬프트
```

## 다른 환경과의 대응 관계

| Claude Code | Codex CLI | GitHub Copilot |
| --- | --- | --- |
| `/harness-lab` | `$harness-lab` | `#file:.github/prompts/harness-lab.prompt.md` |
| `CLAUDE.md` | `AGENTS.md` | `.github/copilot-instructions.md` |
| `.claude/skills/*.SKILL.md` | `.agents/skills/*.SKILL.md` | `.github/instructions/*.instructions.md` |
| `.claude/agents/*.md` | `.codex/agents/*.toml` | `.github/instructions/{role-section}` |
| `/skill-name` | `$skill-name` | `#file:.github/prompts/{name}.prompt.md` |

## 설치하기

이 `.github/` 폴더 전체를 프로젝트 루트에 복사합니다.

```bash
cp -R .github /path/to/your-project/
```

GitHub Copilot이 활성화된 VS Code나 GitHub.com에서 즉시 사용 가능합니다.

## 사용 방법

### 방법 1: 프롬프트 선택기 (권장)

Copilot Chat에서 `#`을 입력하면 프롬프트 파일 목록이 나타납니다.
`harness-lab`을 선택하고 요청을 입력합니다.

```
[# 입력 후 harness-lab 선택]
1박 2일 가족 여행 계획을 위한 작은 하네스를 만들어줘.
```

### 방법 2: 직접 참조

```
#file:.github/prompts/harness-lab.prompt.md
내 블로그 글쓰기 업무를 작은 에이전트 팀 하네스로 바꿔줘.
처음 보는 사람도 이해할 수 있게 역할과 작업 순서를 설명해줘.
```

## 두 단계 흐름

`harness-lab`은 먼저 청사진을 보여주고, 사용자가 승인하면 실행 가능한 Copilot 하네스 파일을 만듭니다.

| 단계 | 무엇을 하나 | 사용자가 할 일 |
| --- | --- | --- |
| 1. 청사진 제안 | Agent/Skill/Orchestrator 구조, 역할표, 테스트 프롬프트를 제안합니다. | 역할과 흐름이 마음에 드는지 확인합니다. |
| 2. 실행 하네스 생성 | 사용자가 승인하면 기존 `.github/` 설정을 확인한 뒤 실행 가능한 하네스를 만듭니다. | "좋아, 이 구조로 만들어줘"처럼 승인합니다. |

## 생성되는 파일

사용자가 승인하면 프로젝트 안에 보통 아래와 비슷한 구조가 생깁니다.

```text
.github/
  copilot-instructions.md          ← 자연어 라우팅 규칙 추가됨
  instructions/
    trip-planning-orchestrator.instructions.md
    trip-research-guide.instructions.md
  prompts/
    trip-planning-orchestrator.prompt.md
artifacts/
  01-research.md
  02-itinerary.md
  03-review.md
  final.md
```

| 위치 | 쉬운 비유 | 역할 |
| --- | --- | --- |
| `.github/instructions/{task-skill}.instructions.md` | 작업 매뉴얼 | 특정 역할이 어떤 순서로 일하고, 어떤 형식으로 결과를 남기며, 무엇을 확인해야 하는지 적습니다. |
| `.github/instructions/{harness-name}-orchestrator.instructions.md` | 전체 진행 지시문 | 여러 역할과 Skill을 어떤 순서로 실행하고, 중간 산출물을 어떻게 이어받을지 정합니다. |
| `.github/prompts/{harness-name}-orchestrator.prompt.md` | 전체 진행표 입구 | 사용자가 Chat에서 `#`으로 선택하거나 `#file:`로 호출하는 실행 프롬프트입니다. |
| `.github/copilot-instructions.md` | 프로젝트 안내판 | 자연어 요청을 Orchestrator 프롬프트로 먼저 이어주는 라우팅 규칙을 남깁니다. |
| `artifacts/` | 작업 기록지 | 실행 중 조사 노트, 초안, 검토 결과, 최종 결과를 남깁니다. |

## 실행 예시

실행 하네스가 생성된 뒤에는 프롬프트 이름을 꼭 외우지 않아도 됩니다.
`.github/copilot-instructions.md`에 자연어 요청을 Orchestrator 프롬프트로 연결하는 규칙이 있기 때문에,
평소처럼 요청하면 Orchestrator가 전체 입구 역할을 합니다.

```
부모님과 함께 가는 2박 3일 제주 여행 계획을 다시 정리해줘.
예산은 1인 50만원 이하이고, 너무 빡빡하지 않은 일정이면 좋겠어.
```

직접 호출하고 싶을 때는 아래처럼 Orchestrator 프롬프트를 명시합니다.

```
#file:.github/prompts/trip-planning-orchestrator.prompt.md
부모님과 함께 가는 2박 3일 제주 여행 계획을 만들어줘.
예산은 1인 50만원 이하이고, 너무 빡빡하지 않은 일정이면 좋겠어.
```

## 처음 써볼 프롬프트

```
#file:.github/prompts/harness-lab.prompt.md
1박 2일 가족 여행 계획을 위한 작은 하네스를 만들어줘.
Agent, Skill, Orchestrator, Test, Evolution을 일상 언어로 설명해줘.
```

## 주의할 점

- `instructions/` 파일은 `applyTo: "**"` 설정으로 Copilot 컨텍스트에 포함됩니다.
  단, 실제 반영 여부는 VS Code / GitHub Copilot 버전에 따라 다를 수 있습니다.
- 프롬프트 파일 내 `#file:` 참조는 명시적으로 instruction 파일을 포함시킵니다.
  Orchestrator 프롬프트에는 관련 instruction 파일을 반드시 `#file:`로 포함하세요.
- 기존 `.github/copilot-instructions.md`가 있다면 내용을 지우지 말고
  하네스 섹션을 추가하는 방식으로 업데이트합니다.
- Orchestrator 프롬프트와 지시문 파일명은 반드시 `-orchestrator`로 끝나야 합니다.
