# REACT + NEXT

- Framework

```
   Database : MySQL
   Front-end: Antd, React-hooks, next JS, Redux-saga
   Back-end : node JS, node Sequelize
```

## 개발 일지

### 1일차

- styled components class name 변경되어 style이 적용 안되는 증상

= 적용하고자하는 프로젝트 루트에 babel 적용

- next svg 파일 미적용 현상

= webpack 적용 (프로젝트 전체)

### 2일차

- 회원가입 기능 검사 로직 고도화, 가입하기 버튼 disable 기능추가
- next + redux 적용 및 redux 구조분해 적용 (계속 추가 예정)

### 3일차

- saga 적용(댓글, 게시판글, 로그인, 로그아웃), 해시태그 적용, slick silder 적용

### 4일차

- front 마무리 작업 (언팔로우, 팔로우, 닉네임 수정 추가, infinite scroll)
- 시간되면... react-virtualized 확인후 infinite scroll 최적화
- 불변성 관리 immer 추가
- 가짜 데이터 faker data 추가
- id generator npm 추가

### 5일차

- node 라우터 설정
- MySQL 도입, 테이블 create, 관계형 테이블 생성
- MySQL Workbench 도입
- 로그인 로그아웃 정책 (node passport, cookie parser)
- 비밀번호 암호화 (bcrypt)
- config 관리 (dotenv)
- gitignore 변경
- 회원가입 후 회원가입 버튼 누를때 버그 수정
- db로 부터 잘못된 정보 에러 반환 오류 처리 수정

### 6일차

- credentials 쿠키 공유
- 라우터 인증여부 isAutenticated 미들웨어 추가
- 로그인 풀리는 현상 수정
- 전체적인 정리 (https://blog.naver.com/qhanfckwsmsd/222481257808)

### 7일차

- addPost dispatch시 scucess 안되는 현상 back 소스 수정
- 좋아요 버튼 및 좋아요 해제 버튼 라우터 , api 추가
- 게시판 댓글 달기 라우터, api 추가

### 8일차
 - 이미지 업로드 (multer)
 - 닉네임 수정, 팔로우/언팔로우 변경 api추가, 프로필 팔로우 리스트/언팔로우리스트 load api 추가

### 9일차
 - 리트윗 등록/해쉬태그 조회 api 추가, 무한스크롤링 10개씩 가져올수 있도록 수정
 - polyfill.io 적용 (ie)
 - SSR 라이브러리 사용시 메소드 네이밍 문제로 인한 next 6 버젼 교체
 - CSS SSR 추가 (_document.js)
 - SSR 적용 후 프로필에서 팔로우리스트/언팔로우리스트에서 라우터 파라메터로 이상한 값 들어가는 내용 back 라우터 메소드 위치 수정
 - next SSR debugger package.json + cross_env 내용 추가 (윈도우는 cross_env 필요..)

### 10일차
 - 다이나믹 라우팅, SWR get, moment 라이브러리 등 사용
 - 검색 결과 (해시태그, user별 포스팅 조회, user 정보 조회에 따라 다이나믹 라우터 값 전달)
 - 끝~
