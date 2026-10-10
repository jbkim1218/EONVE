# 실행 방법

프로젝트의 `package.json`이 있는 폴더에서 실행합니다. Node.js 24와 pnpm 11.25.0으로 검증했습니다.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

브라우저에서 `http://localhost:3000`을 엽니다. 관리자 데모는 `/admin`입니다. Windows에서는 `START-EONVE.cmd`를 실행할 수도 있습니다.

## 휴대폰에서 확인

PC와 휴대폰을 같은 Wi-Fi에 연결하고, 실행 창에 표시된 PC 주소와 포트를 사용합니다. `http://192.0.2.10:3000`은 설명용 예시이며 실제 접속 주소가 아닙니다.

개발 서버는 `0.0.0.0`으로 연결을 받으며 `next.config.ts`는 실행 시 현재 PC의 IPv4 주소를 개발용 허용 주소에 등록합니다. Wi-Fi 변경 후 서버를 재시작하고 새 주소를 확인하세요. 방화벽이나 기기 간 연결을 차단하는 네트워크 설정에 따라 접속이 제한될 수 있습니다.

## 프로덕션 실행

```sh
pnpm build
pnpm start
```

배포 시 `NEXT_PUBLIC_SITE_URL`을 실제 공개 주소로 설정합니다. 예: `https://eonve.example.com`. 이 값은 canonical과 sitemap 등에 사용되며 비밀키가 아닙니다.

## 검증 명령

```sh
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm exec playwright install
pnpm test:e2e
```

테스트는 별도의 프로덕션 서버를 자동 실행합니다. 로컬 Windows에서 확인한 브라우저 범위와 제한 사항은 [검증 결과](../VERIFICATION.md)에 기록했습니다.
