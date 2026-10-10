# 검증 결과

검증일: 2026-10-10 (Asia/Seoul). Windows 환경, Node.js 24.19.0, 프로덕션 Next.js 서버.

| 검사                                     | 최종 결과                                   |
| ---------------------------------------- | ------------------------------------------- |
| TypeScript strict 검사                   | 통과                                        |
| ESLint                                   | 오류·경고 0                                 |
| peer dependency 검사                     | 충돌 0                                      |
| Vitest / Testing Library                 | 10개 통과                                   |
| 프로덕션 빌드                            | 통과                                        |
| Chromium 데스크톱 E2E                    | 8개 통과                                    |
| Chromium 모바일 viewport E2E             | 8개 통과                                    |
| 320 / 768 / 1024 / 1440px 화면 넘침 검사 | 홈·여성 목록·상품 상세·장바구니·관리자 통과 |
| axe-core 4.14 WCAG A/AA 자동 점검        | 아래 8개 조합에서 violations 0              |
| Firefox / WebKit                         | Windows 브라우저 실행 실패로 검증 미완료    |

## 기능 테스트 범위

MEN·WOMEN·NEW 탐색, 조합 필터와 URL 유지, 가격 정렬, Escape와 모달 포커스 복원, 상품 옵션 검증, 찜 유지, 장바구니 수량·합계·새로고침 유지, 모의 주문, 관리자 상품 CRUD, 브라우저 추가 상품 상세 및 noindex, 카테고리 CRUD와 연결 상품 이름 동기화, 사용 중인 카테고리 삭제 차단, 배너 변경, 데모 초기화를 확인했습니다.

최종 실행: `pnpm test:e2e --project=chromium --project=mobile`과 동등한 Playwright CLI 실행에서 **16 passed (29.7초)**. 테스트의 모바일은 실제 iPhone이 아니라 Chromium의 모바일 viewport 에뮬레이션입니다.

## 쇼핑 동작 수정 검증

개발 서버를 PC LAN 주소 `http://192.0.2.10:3010`(설명용 예시 주소)으로 열었을 때 HMR 연결이 차단되고 하트 버튼을 눌러도 상태가 변하지 않는 것을 재현했습니다. `allowedDevOrigins`에 실행 중인 PC의 IPv4 주소와 `127.0.0.1`을 등록한 뒤 같은 주소에서 하트의 선택 상태와 저장이 정상 작동했습니다. 개발 서버의 LAN 주소를 대상으로 데스크톱·모바일의 쇼핑, 반응형 화면 넘침, 신규 구매 흐름 테스트도 통과했습니다.

장바구니 담기 후 `/cart` 자동 이동, 위시리스트 새로고침 유지·해제, 모든 고객 페이지의 플로팅 메뉴, 맨 위 이동, 옵션 미선택 오류, 바로 구매의 주문 확인·새로고침·주문 확정, 바로 구매 후 기존 장바구니 유지, 장바구니 전체 주문 후 비우기를 E2E로 확인했습니다. 모바일 상품 화면에서 플로팅 메뉴와 하단 구매 버튼의 배치도 캡처로 확인했습니다. 실제 결제는 구현하지 않았습니다.

## 최초 버전의 접근성 및 성능 관찰

1280×900와 390×900의 Chromium에서 `/`, `/women`, `/products/sculpted-wool-coat`, `/admin/products/new`를 점검했습니다. axe-core의 WCAG 2 A/AA, 2.1 AA, 2.2 AA 태그 점검에서 violations 0입니다. 이미지 배경의 대비처럼 수동 판단이 필요한 incomplete 항목은 [docs/audit.json](docs/audit.json)에 함께 남겼습니다. 자동 검사 통과는 전체 접근성 인증을 의미하지 않습니다.

같은 로컬 측정에서 기록한 초기 LCP는 32–156ms, CLS는 8개 조합에서 0이었습니다. 네트워크·CPU throttling이 없는 로컬 서버의 짧은 초기 로딩 관찰이며, 실제 사용자 Core Web Vitals나 배포 환경의 성능 점수가 아닙니다. INP와 Lighthouse 점수는 측정하지 않았습니다. 원시 결과는 `docs/audit.json`에 있습니다.

## 발견하고 수정한 문제

- 푸터 보조 텍스트 대비 4.41:1 → 보조 색상을 더 어둡게 조정.
- 관리자 초기화 버튼 터치 영역 → 높이 44px 확보.
- 모바일 스와이프 갤러리 → 키보드 포커스 가능한 region 추가.
- 첫 폰트 로딩에서 홈 레이아웃 이동 → `next/font/local` 사전 로딩 및 대체 폰트 메트릭 적용.
- 모바일 관리자 로딩 전후 레이아웃 이동 → Grid의 빈 높이 분배를 막아 상단 정렬 유지.
- PC 화보 얼굴 일부 잘림 → 이미지 기준점을 상단으로 수정하고 캡처 재검수.
- 테스트에서 Next.js route announcer를 상품 옵션 alert와 함께 선택한 문제 → 상품 오류 문구로 범위 지정.
- textarea/select의 테스트 label 문자열 불일치 → 접근 가능한 textbox/combobox 이름으로 선택.
- IndexedDB 저장·초기화가 완료되기 전에 테스트가 페이지를 떠난 문제 → 저장 완료 피드백·결과 화면을 기다린 뒤 이동.
- 테스트 서버를 공유한 중간 병렬 실행의 종료 영향 → 최종 검증은 하나의 고정 서버에서 순차 실행.

## 검증하지 못한 범위

Firefox는 `mozavutil.dll` 호스트 검증과 실제 실행에서 `spawn UNKNOWN`으로 실패했습니다. WebKit은 `ssl-60.dll`, `JavaScriptCore.dll` 호스트 검증과 실제 실행의 비정상 종료로 실패했습니다. 설치 파일이 존재함을 확인했고, 호스트 검증을 우회한 진단 실행도 성공하지 못했습니다. 이를 웹사이트 기능 실패나 통과로 처리하지 않았습니다.

GitHub Actions에는 Linux에서 Chromium·Firefox·WebKit·모바일 테스트를 수행하도록 설정했으나 이 작업에서 원격 CI를 실행하지 않았습니다. 실제 Edge·Safari·iOS·Android 기기, Vercel 배포, 공개 도메인 SEO 검증은 미실행입니다. 실제 사용자 성능 계측과 독립된 상품 후면·디테일 사진 제작은 향후 보완할 수 있습니다.
