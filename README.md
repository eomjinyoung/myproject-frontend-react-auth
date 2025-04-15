# myproject-frontend-react-auth

## 공통 모듈 가져오기

### git 저장소를 처음 clone 했을 때

다음을 실행하여 공통 모듈을 가져온다.

```bash
git submodule update --init --recursive
```

### git 저장소를 가져온 후

공통 모듈을 최신 버전으로 갱신한다.

```bash
git submodule update --remote
```

## 설정

### `.env.local`, `env.production` 파일

`.env.local` : 로컬에서 개발할 때 사용하는 환경 변수

```properties
# Backend Server
NEXT_PUBLIC_AUTH_REST_API_URL=http://localhost:8010
NEXT_PUBLIC_BOARD_REST_API_URL=http://localhost:8020

# Frontend Server
NEXT_PUBLIC_AUTH_UI_URL=http://localhost:3010
NEXT_PUBLIC_BOARD_UI_URL=http://localhost:3020
```

`.env.production` : 서버에 배포할 때 사용하는 환경 변수

```properties
# Backend Server
NEXT_PUBLIC_AUTH_REST_API_URL=http://110.165.18.171:8010
NEXT_PUBLIC_BOARD_REST_API_URL=http://110.165.18.171:8020

# Frontend Server
NEXT_PUBLIC_AUTH_UI_URL=http://110.165.18.171:3010
NEXT_PUBLIC_BOARD_UI_URL=http://110.165.18.171:3020
```

`NEXT_PUBLIC_` 접두사를 붙여야 웹브라우저에서 접근 가능

#### 환경변수 사용

```js
fetch(`${NEXT_PUBLIC_AUTH_REST_API_URL}/auth/login`, ...)
```

#### next.js 에서 `.env` 파일을 읽는 순서

1. `.env.local` : 로컬 개발 환경 전용(git에서 제외)
2. `.env.development` : 개발 환경
3. `.env.production` : 배포 환경
4. `.env` : 모든 환경(기본 값)

## 모듈 설치

```bash
npm install
```

## 도커 이미지 생성

### `.dockerignore`

Docker 빌드 시 포함하지 않을 파일/디렉터리를 지정.

- 이미지 크기 줄이기
  - 불필요한 파일은 빌드 컨텍스트에서 제외되니까 최종 이미지가 가벼워짐.
- 빌드 속도 향상
  - Docker는 .dockerignore에 포함된 파일은 전송하지 않아서 복사 속도 빨라짐.
- 보안 강화
  - .env.local, 인증 키, 개발용 설정파일 등이 이미지에 포함되지 않게 막을 수 있음.

```
node_modules
.env
.env.local
Dockerfile
.dockerignore
.git
.gitignore
*.log
```

### `Dockerfile`

```
FROM node:lts

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3010

CMD ["npm", "run", "start"]
```

### 이미지 생성

```bash
docker build -t myproject-frontend-auth .
docker run -p 3010:3010 --env-file .env.production --name auth-app myproject-frontend-auth
```

## 도커 컨테이너 실행

##

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
