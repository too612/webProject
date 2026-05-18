# 일상 업무 예시

하네스를 일상 업무와 연결해 설명할 때 사용한다.

## 여행 계획 하네스

사람의 업무: 목적·예산 확정 → 후보지·숙소 조사 → 이동 동선 → 예산 검토 → 최종 일정

| 구성 | 예시 |
| --- | --- |
| Agent | 조사 담당, 일정 설계 담당, 예산 검토 담당, 최종 정리 담당 |
| Skill | 후보 조사법, 일정표 작성법, 예산 점검법 |
| Orchestrator | 조사 결과 → 일정표 → 예산 검토 → 최종안 |
| Test | "2박 3일 부산 여행, 1인 40만원 이하" |

추천 패턴: Pipeline 또는 Producer-Reviewer

Copilot 파일 구조:
```
.github/
  instructions/
    trip-research-guide.instructions.md   ← applyTo: ".github/**"
    trip-planning-orchestrator.instructions.md
  prompts/
    trip-planning-orchestrator.prompt.md
artifacts/
  01-research.md / 02-itinerary.md / 03-review.md / final.md
```

## 블로그 글 작성 하네스

사람의 업무: 주제·독자 확정 → 자료 수집 → 목차 → 초안 → 문장 다듬기

| 구성 | 예시 |
| --- | --- |
| Agent | 자료 조사, 목차 설계, 초안 작성, 톤 검토 |
| Skill | 자료 요약법, 목차 작성법, 문체 검토법 |
| Orchestrator | 조사 노트 → 목차 → 초안 → 검토본 |
| Test | "입문 독자를 위한 MCP 설명 글" |

추천 패턴: Pipeline + Producer-Reviewer

## 회의록 정리 하네스

사람의 업무: 내용 읽기 → 결정 사항 추출 → 할 일 배분 → 리스크 정리 → 공유 요약

추천 패턴: Fan-out/Fan-in

## 기술 문서 작성 하네스

사람의 업무: 소스 분석 → 독자 수준 설정 → 목차 → 예제 → 정확성 검토

추천 패턴: Pipeline + Producer-Reviewer

## 개인 학습 계획 하네스

사람의 업무: 현재 수준 진단 → 목표 세분화 → 주간 계획 → 퀴즈 → 회고

추천 패턴: Supervisor 또는 Pipeline

## 작은 개발 프로젝트 하네스

사람의 업무: 요구사항 정리 → 파일 구조 파악 → 구현 → 테스트 → 변경 설명

추천 패턴: Producer-Reviewer 또는 Supervisor
