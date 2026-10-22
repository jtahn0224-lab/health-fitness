// ============================================================================
// Firebase Realtime Database (실시간 데이터베이스) 연동 설정 파일 (firebase-config.js)
// ============================================================================
// [연동 방법 요약]
// 1. Firebase 콘솔(https://console.firebase.google.com/)에서 프로젝트를 생성합니다.
// 2. 왼쪽 메뉴 [빌드] -> [Realtime Database] -> [데이터베이스 만들기]를 클릭합니다.
//    (처음 테스트할 때는 '테스트 모드에서 시작'을 선택하면 가장 간편합니다.)
// 3. [프로젝트 설정(⚙️)] -> [일반] -> [내 앱]에서 웹(</>) 앱을 추가하고
//    firebaseConfig 값(특히 apiKey, projectId, databaseURL)을 복사합니다.
// 4. 아래 DEFAULT_FIREBASE_CONFIG에 붙여넣거나,
//    웹앱 상단의 [로컬 모드 · 서버설정] 버튼을 눌러 화면에서 바로 붙여넣어도 됩니다!
// ============================================================================

window.DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyBcGcKzlX2ul2YPlyL1624lwtDP2PU3-FU",
  authDomain: "paps-7b8bf.firebaseapp.com",
  databaseURL: "https://paps-7b8bf-default-rtdb.firebaseio.com",
  projectId: "paps-7b8bf",
  storageBucket: "paps-7b8bf.firebasestorage.app",
  messagingSenderId: "1042198758333",
  appId: "1:1042198758333:web:cdc3fc9254de164e7108d4",
  measurementId: "G-V2JXQFR031"
};

