# Copilot Instructions

이 파일은 항상 로드될 수 있으므로 짧은 프로젝트 라우팅만 둔다.
하네스 설계 규칙, Phase 설명, 템플릿, 예시는 `.github/harness-lab/` 아래 문서를 기준으로 본다.

## 항상 유지할 원칙

- 이 파일에는 전역적으로 필요한 짧은 규칙만 둔다.
- 하네스 상세 설명은 `.github/harness-lab/` 문서로 이동한다.
- 새 규칙을 추가할 때는 먼저 이 파일에 항상 필요한 내용인지 검토한다.

## 범용 유지 원칙

- 하네스 코어 문서는 특정 저장소 구조, 프레임워크, 빌드 도구를 전제하지 않는다.
- 프로젝트별 규칙이 필요하면 하네스 코어에 섞지 말고 별도 `.github/instructions/*.instructions.md` 파일로 분리한다.
- 반복적으로 길어질 설명이나 작업 전용 규칙은 이 파일 대신 `.github/instructions/` 또는 `.github/harness-lab/`로 분리한다.

## Harness Lab 라우팅

- 하네스 설계, Agent/Skill/Orchestrator 구조 설계, 업무 자동화 팀 구성 요청은 `/harness-lab`을 우선 사용한다.
- 생성된 하네스 실행 요청은 해당 `/{harness-name}-orchestrator` 프롬프트를 우선 사용한다.
- 상세 참조 문서 위치:
  - 개요: `.github/README-commercial.md`
  - 참조 문서: `.github/harness-lab/`
  - 실행 프롬프트: `.github/prompts/harness-lab.prompt.md`
  - 라우팅 힌트: `.github/instructions/harness-lab.instructions.md`

## 사용 전 확인

- VS Code에서 `chat.promptFiles`를 켜야 prompt 파일이 보인다.
- 설정 경로: `Ctrl+Shift+P` → `Preferences: Open Settings (UI)` → `chat.promptFiles` 검색 → 활성화
