// ============================================================================
// 중학교 건강체력교실 모바일 최적화 웹앱 (학생 학번 로그인 + 교사 통계 + Firebase)
// ============================================================================
const DEFAULT_FIREBASE_CONFIG = window.DEFAULT_FIREBASE_CONFIG || {};

const STORAGE_KEY = "middle_school_fitness_records_v2";
const FB_CONFIG_STORAGE_KEY = "middle_school_fitness_fb_config_v1";
const GOALS_STORAGE_KEY = "middle_school_fitness_goals_v1";
const TEACHER_PW_STORAGE_KEY = "middle_school_fitness_teacher_pw_v1";
const SESSION_STORAGE_KEY = "middle_school_fitness_session_v1";
const TODAY_STR = "2026-10-22";

let goals = loadGoals();
let teacherPassword = loadTeacherPassword();

// 5명의 중학생 예시 데이터
const INITIAL_DEMO_DATA = {
  student1: {
    id: "student1",
    grade: 1,
    classNum: 1,
    studentNum: 11,
    name: "김양주",
    records: {
      "2026-10-02": { run: 3, jump: 200, mood: "💦 숨차지만 완주!", note: "체력교실 첫날 완주!" },
      "2026-10-05": { run: 5, jump: 300, mood: "😄 상쾌해요", note: "목표 첫 100% 달성!" },
      "2026-10-07": { run: 4, jump: 250, mood: "💪 뿌듯해요", note: "점심시간 줄넘기 연습" },
      "2026-10-08": { run: 5, jump: 350, mood: "😄 상쾌해요", note: "2단 뛰기 10개 성공" },
      "2026-10-12": { run: 6, jump: 300, mood: "💪 뿌듯해요", note: "달리기 6바퀴 신기록!" },
      "2026-10-14": { run: 3, jump: 150, mood: "💦 숨차지만 완주!", note: "조금 피곤했지만 출석" },
      "2026-10-15": { run: 5, jump: 400, mood: "😄 상쾌해요", note: "줄넘기 400개 돌파!" },
      "2026-10-19": {
        morning: { run: 3, jump: 150, mood: "😄 상쾌해요", note: "월요일 아침 상쾌하게" },
        lunch: { run: 2, jump: 150, mood: "💪 뿌듯해요", note: "점심 줄넘기 추가" },
        run: 5,
        jump: 300,
        mood: "😄 상쾌해요",
        note: "[아침] 월요일 아침 상쾌하게 / [점심] 점심 줄넘기 추가"
      },
      "2026-10-20": {
        lunch: { run: 4, jump: 300, mood: "💪 뿌듯해요", note: "점심시간 줄넘기 100개 연속 성공" },
        run: 4,
        jump: 300,
        mood: "💪 뿌듯해요",
        note: "[점심] 점심시간 줄넘기 100개 연속 성공"
      },
      "2026-10-21": {
        morning: { run: 5, jump: 320, mood: "😄 상쾌해요", note: "아침 체력교실 3일 연속 참여!" },
        run: 5,
        jump: 320,
        mood: "😄 상쾌해요",
        note: "[아침] 아침 체력교실 3일 연속 참여!"
      },
      "2026-10-22": {
        morning: { run: 3, jump: 150, mood: "😄 상쾌해요", note: "아침 트랙 달리기 3바퀴" },
        lunch: { run: 2, jump: 200, mood: "💪 뿌듯해요", note: "점심시간 친구들과 줄넘기 200개!" },
        run: 5,
        jump: 350,
        mood: "😄 상쾌해요",
        note: "[아침] 아침 트랙 달리기 3바퀴 / [점심] 점심시간 친구들과 줄넘기 200개!"
      }
    }
  },
  student2: {
    id: "student2",
    grade: 1,
    classNum: 1,
    studentNum: 12,
    name: "이서연",
    records: {
      "2026-10-06": { run: 2, jump: 300, mood: "😄 상쾌해요", note: "줄넘기가 제일 재밌다!" },
      "2026-10-08": { run: 3, jump: 350, mood: "💪 뿌듯해요", note: "달리기 한 바퀴 추가" },
      "2026-10-13": { run: 5, jump: 300, mood: "😄 상쾌해요", note: "드디어 5바퀴 완주 성공" },
      "2026-10-16": { run: 4, jump: 400, mood: "💪 뿌듯해요", note: "체육 선생님께 칭찬받음" },
      "2026-10-20": { run: 5, jump: 300, mood: "😄 상쾌해요", note: "친구와 함께 완주" },
      "2026-10-22": { run: 5, jump: 320, mood: "😄 상쾌해요", note: "오늘도 목표 달성 완료!" }
    }
  },
  student3: {
    id: "student3",
    grade: 3,
    classNum: 2,
    studentNum: 19,
    name: "박지호",
    records: {
      "2026-10-01": { run: 5, jump: 300, mood: "💪 뿌듯해요", note: "10월 첫 스타트" },
      "2026-10-05": { run: 7, jump: 200, mood: "💦 숨차지만 완주!", note: "오래달리기 집중 훈련" },
      "2026-10-12": { run: 6, jump: 300, mood: "😄 상쾌해요", note: "호흡이 훨씬 편해졌다" },
      "2026-10-19": { run: 8, jump: 350, mood: "💪 뿌듯해요", note: "PAPS 2등급 목표!" },
      "2026-10-21": { run: 6, jump: 300, mood: "😄 상쾌해요", note: "방과후 트랙 달리기" },
      "2026-10-22": { run: 5, jump: 300, mood: "💪 뿌듯해요", note: "꾸준히 참여 중" }
    }
  },
  student4: {
    id: "student4",
    grade: 2,
    classNum: 1,
    studentNum: 4,
    name: "최하은",
    records: {
      "2026-10-07": { run: 2, jump: 150, mood: "💦 숨차지만 완주!", note: "오랜만에 뛰어서 숨찼다" },
      "2026-10-14": { run: 3, jump: 200, mood: "💪 뿌듯해요", note: "반 바퀴 더 뜀!" }
    }
  },
  student5: {
    id: "student5",
    grade: 1,
    classNum: 4,
    studentNum: 21,
    name: "정현우",
    records: {
      "2026-10-12": { run: 2, jump: 100, mood: "💦 숨차지만 완주!", note: "천천히 시작하기" },
      "2026-10-15": { run: 3, jump: 200, mood: "💪 뿌듯해요", note: "줄넘기 200개 성공" },
      "2026-10-20": { run: 4, jump: 250, mood: "😄 상쾌해요", note: "다음엔 5바퀴 도전!" }
    }
  }
};

let store = loadStore();
let currentStudentId = Object.keys(store)[0] || "student1";
let currentDateStr = TODAY_STR;
let currentSession = "morning"; // "morning" (🌅 아침 시간) | "lunch" (☀️ 점심시간)
let currentCalYear = 2026;
let currentCalMonth = 10;
let currentMood = "😄 상쾌해요";

let authSession = {
  role: "student",
  studentId: "student1"
};

let fbState = {
  connected: false,
  app: null,
  auth: null,
  db: null,
  sdk: null,
  uid: null,
  unsubStudents: null,
  unsubRecordsMap: {}
};

function loadGoals() {
  const defaults = { weeklyDays: 3, weeklyRun: 15, weeklyJump: 1000, run: 5, jump: 300 };
  try {
    const raw = localStorage.getItem(GOALS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        weeklyDays: Number(parsed.weeklyDays || defaults.weeklyDays),
        weeklyRun: Number(parsed.weeklyRun || defaults.weeklyRun),
        weeklyJump: Number(parsed.weeklyJump || defaults.weeklyJump),
        run: Number(parsed.run || defaults.run),
        jump: Number(parsed.jump || defaults.jump)
      };
    }
  } catch (e) {}
  return defaults;
}

function saveGoals() {
  try {
    localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals));
  } catch (e) {}
}

function loadTeacherPassword() {
  try {
    return localStorage.getItem(TEACHER_PW_STORAGE_KEY) || "1234";
  } catch (e) {
    return "1234";
  }
}

function saveTeacherPassword(pw) {
  teacherPassword = pw;
  try {
    localStorage.setItem(TEACHER_PW_STORAGE_KEY, pw);
  } catch (e) {}
}

function loadStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Object.keys(parsed).length > 0) return parsed;
    }
  } catch (e) {}
  return JSON.parse(JSON.stringify(INITIAL_DEMO_DATA));
}

function saveStore() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (e) {}
}

function formatStudentCode(s) {
  return `${s.grade}${String(s.classNum).padStart(2, "0")}${String(s.studentNum).padStart(2, "0")}`;
}

function formatStudentLabel(s) {
  return `${formatStudentCode(s)} ${s.name}`;
}

function getStudentRecords(studentId = currentStudentId) {
  return store[studentId]?.records || {};
}

function isGoalMet(rec) {
  if (!rec) return false;
  return Number(rec.run) >= goals.run && Number(rec.jump) >= goals.jump;
}

function isParticipated(rec) {
  if (!rec) return false;
  return Number(rec.run) > 0 || Number(rec.jump) > 0;
}

// 하루 기록 객체를 아침(morning) / 점심(lunch) 구조로 정규화
function normalizeDayRecord(rec) {
  const emptySession = { run: 0, jump: 0, mood: "😄 상쾌해요", note: "" };
  if (!rec) {
    return {
      morning: { ...emptySession },
      lunch: { ...emptySession },
      run: 0,
      jump: 0,
      mood: "😄 상쾌해요",
      note: ""
    };
  }

  let morning = rec.morning ? { ...emptySession, ...rec.morning } : null;
  let lunch = rec.lunch ? { ...emptySession, ...rec.lunch } : null;

  // 기존 단일 기록 데이터 호환 처리
  if (!morning && !lunch) {
    const rawNote = String(rec.note || "");
    if (rawNote.includes("점심")) {
      morning = { ...emptySession };
      lunch = {
        run: Number(rec.run || 0),
        jump: Number(rec.jump || 0),
        mood: rec.mood || "😄 상쾌해요",
        note: rawNote
      };
    } else {
      morning = {
        run: Number(rec.run || 0),
        jump: Number(rec.jump || 0),
        mood: rec.mood || "😄 상쾌해요",
        note: rawNote
      };
      lunch = { ...emptySession };
    }
  } else {
    if (!morning) morning = { ...emptySession };
    if (!lunch) lunch = { ...emptySession };
  }

  morning.run = Number(morning.run || 0);
  morning.jump = Number(morning.jump || 0);
  lunch.run = Number(lunch.run || 0);
  lunch.jump = Number(lunch.jump || 0);

  const totalRun = Number((morning.run + lunch.run).toFixed(1));
  const totalJump = Math.round(morning.jump + lunch.jump);
  const hasM = morning.run > 0 || morning.jump > 0;
  const hasL = lunch.run > 0 || lunch.jump > 0;

  const noteParts = [];
  if (hasM && morning.note) noteParts.push(`[아침운동] ${morning.note}`);
  if (hasL && lunch.note) noteParts.push(`[점심운동] ${lunch.note}`);
  const combinedNote = noteParts.length > 0 ? noteParts.join(" / ") : rec.note || "";
  const combinedMood = hasL ? lunch.mood : hasM ? morning.mood : rec.mood || "😄 상쾌해요";

  return {
    morning,
    lunch,
    run: totalRun,
    jump: totalJump,
    mood: combinedMood,
    note: combinedNote
  };
}

function getSessionTagsHtml(rec) {
  const norm = normalizeDayRecord(rec);
  const hasM = isParticipated(norm.morning);
  const hasL = isParticipated(norm.lunch);
  let tags = "";
  if (hasM) tags += `<span class="session-tag morning">🌅 아침운동 완료</span> `;
  if (hasL) tags += `<span class="session-tag lunch">☀️ 점심운동 완료</span>`;
  return tags.trim();
}

function buildSessionDetailStackHtml(rec, includePending = false) {
  const norm = normalizeDayRecord(rec);
  const hasM = isParticipated(norm.morning);
  const hasL = isParticipated(norm.lunch);
  let html = `<div class="session-detail-stack">`;

  if (hasM || includePending) {
    html += `
      <div class="session-detail-box ${hasM ? "morning-done" : "pending"}">
        <div class="session-detail-top">
          <span class="session-detail-badge">
            ${hasM ? "🌅 ✅ 아침운동 완료!" : "🌅 아침운동 미기록"}
          </span>
          <span class="session-detail-metrics">
            ${hasM ? `🏃 달리기 ${norm.morning.run}바퀴 · 🪢 줄넘기 ${norm.morning.jump.toLocaleString()}개` : "기록 없음"}
          </span>
        </div>
        ${
          hasM
            ? `<div class="session-detail-note">${escapeHtml(norm.morning.mood || "😄 상쾌해요")} · 💬 ${escapeHtml(norm.morning.note || "아침운동 완료!")}</div>`
            : ""
        }
      </div>
    `;
  }

  if (hasL || includePending) {
    html += `
      <div class="session-detail-box ${hasL ? "lunch-done" : "pending"}">
        <div class="session-detail-top">
          <span class="session-detail-badge">
            ${hasL ? "☀️ ✅ 점심운동 완료!" : "☀️ 점심운동 미기록"}
          </span>
          <span class="session-detail-metrics">
            ${hasL ? `🏃 달리기 ${norm.lunch.run}바퀴 · 🪢 줄넘기 ${norm.lunch.jump.toLocaleString()}개` : "기록 없음"}
          </span>
        </div>
        ${
          hasL
            ? `<div class="session-detail-note">${escapeHtml(norm.lunch.mood || "😄 상쾌해요")} · 💬 ${escapeHtml(norm.lunch.note || "점심운동 완료!")}</div>`
            : ""
        }
      </div>
    `;
  }

  html += `</div>`;
  return html;
}

// ============================================================================
// 초기화
// ============================================================================
async function bootApp() {
  initTabs();
  initStudentSelector();
  initLoginModal();
  initRecordForm();
  initCalendarControls();
  initTeacherControls();
  initCalorieCalculator();
  initFirebaseModal();
  updateGoalTexts();

  try {
    const savedSession = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (savedSession) {
      const parsed = JSON.parse(savedSession);
      if (parsed.role === "teacher") {
        applyTeacherLogin(true);
        closeLoginModal();
      } else if (parsed.studentId && store[parsed.studentId]) {
        applyStudentLogin(parsed.studentId, true);
        closeLoginModal();
      }
    }
  } catch (e) {}

  syncAllUI();

  const savedConfig = loadSavedFirebaseConfig();
  if (savedConfig && (savedConfig.databaseURL || savedConfig.projectId)) {
    await connectToFirebase(savedConfig, true);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootApp);
} else {
  bootApp();
}

function updateGoalTexts() {
  const rDesc = document.getElementById("coachGoalDescRun");
  const jDesc = document.getElementById("coachGoalDescJump");
  const wRunDesc = document.getElementById("weeklyGoalDescRun");
  const wJumpDesc = document.getElementById("weeklyGoalDescJump");
  if (rDesc) rDesc.textContent = goals.run;
  if (jDesc) jDesc.textContent = goals.jump.toLocaleString();
  if (wRunDesc) wRunDesc.textContent = goals.weeklyRun;
  if (wJumpDesc) wJumpDesc.textContent = goals.weeklyJump.toLocaleString();

  const wDaysIn = document.getElementById("cfgWeeklyDaysGoal");
  const wRunIn = document.getElementById("cfgWeeklyRunGoal");
  const wJumpIn = document.getElementById("cfgWeeklyJumpGoal");
  if (wDaysIn) wDaysIn.value = goals.weeklyDays;
  if (wRunIn) wRunIn.value = goals.weeklyRun;
  if (wJumpIn) wJumpIn.value = goals.weeklyJump;

  document.getElementById("cfgRunGoal").value = goals.run;
  document.getElementById("cfgJumpGoal").value = goals.jump;
}

// ============================================================================
// 🔐 로그인 모달 제어
// ============================================================================
function closeLoginModal() {
  const modal = document.getElementById("loginModal");
  if (!modal) return;
  modal.hidden = true;
  modal.style.display = "none";
}

function openLoginModal(defaultMode = "student") {
  const modal = document.getElementById("loginModal");
  if (!modal) return;
  modal.hidden = false;
  modal.style.display = "flex";
  switchLoginMode(defaultMode);
}

function switchLoginMode(mode) {
  const isStudent = mode === "student";
  const btnStudent = document.getElementById("modeBtnStudent");
  const btnTeacher = document.getElementById("modeBtnTeacher");
  const studentForm = document.getElementById("studentLoginForm");
  const teacherForm = document.getElementById("teacherLoginForm");
  const errBox = document.getElementById("teacherLoginError");

  btnStudent.classList.toggle("active", isStudent);
  btnTeacher.classList.toggle("active", !isStudent);

  studentForm.hidden = !isStudent;
  studentForm.style.display = isStudent ? "block" : "none";

  teacherForm.hidden = isStudent;
  teacherForm.style.display = isStudent ? "none" : "block";

  errBox.hidden = true;
  errBox.style.display = "none";

  if (!isStudent) {
    setTimeout(() => document.getElementById("loginTeacherPw")?.focus(), 50);
  }
}

function initLoginModal() {
  const modal = document.getElementById("loginModal");
  const openBtn = document.getElementById("openLoginModalBtn");
  const closeBtn = document.getElementById("closeLoginModalBtn");

  const modeBtnStudent = document.getElementById("modeBtnStudent");
  const modeBtnTeacher = document.getElementById("modeBtnTeacher");
  const studentForm = document.getElementById("studentLoginForm");
  const teacherForm = document.getElementById("teacherLoginForm");

  const codeInput = document.getElementById("loginStudentCode");
  const gradeSelect = document.getElementById("loginGrade");
  const classInput = document.getElementById("loginClass");
  const numInput = document.getElementById("loginNumber");
  const nameInput = document.getElementById("loginName");

  openBtn.addEventListener("click", () => openLoginModal("student"));
  closeBtn.addEventListener("click", closeLoginModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeLoginModal();
  });

  modeBtnStudent.addEventListener("click", () => switchLoginMode("student"));
  modeBtnTeacher.addEventListener("click", () => switchLoginMode("teacher"));

  codeInput.addEventListener("input", () => {
    const digits = codeInput.value.replace(/\D/g, "");
    if (digits.length === 5) {
      const g = Number(digits[0]);
      const c = Number(digits.slice(1, 3));
      const n = Number(digits.slice(3, 5));
      if (g >= 1 && g <= 3) gradeSelect.value = String(g);
      if (c >= 1 && c <= 20) classInput.value = String(c);
      if (n >= 1 && n <= 50) numInput.value = String(n);
    } else if (digits.length === 4) {
      const g = Number(digits[0]);
      const c = Number(digits[1]);
      const n = Number(digits.slice(2, 4));
      if (g >= 1 && g <= 3) gradeSelect.value = String(g);
      if (c >= 1 && c <= 20) classInput.value = String(c);
      if (n >= 1 && n <= 50) numInput.value = String(n);
    }
  });

  const syncCodeFromFields = () => {
    const g = Number(gradeSelect.value || 1);
    const c = Math.max(1, Number(classInput.value || 1));
    const n = Math.max(1, Number(numInput.value || 1));
    codeInput.value = `${g}${String(c).padStart(2, "0")}${String(n).padStart(2, "0")}`;
  };
  gradeSelect.addEventListener("change", syncCodeFromFields);
  classInput.addEventListener("input", syncCodeFromFields);
  numInput.addEventListener("input", syncCodeFromFields);

  document.querySelectorAll(".preset-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      gradeSelect.value = chip.dataset.grade;
      classInput.value = chip.dataset.class;
      numInput.value = chip.dataset.num;
      nameInput.value = chip.dataset.name;
      if (chip.dataset.code) {
        codeInput.value = chip.dataset.code;
      } else {
        syncCodeFromFields();
      }
    });
  });

  const handleStudentLogin = async (e) => {
    if (e) e.preventDefault();
    const grade = Math.min(3, Math.max(1, Number(gradeSelect.value || 2)));
    const classNum = Math.min(20, Math.max(1, Number(classInput.value || 1)));
    const studentNum = Math.min(50, Math.max(1, Number(numInput.value || 1)));
    const name = nameInput.value.trim();

    if (!name) {
      showToast("학생 이름을 입력해 주세요!");
      nameInput.focus();
      return;
    }

    let foundId = Object.keys(store).find((id) => {
      const s = store[id];
      return (
        Number(s.grade) === grade &&
        Number(s.classNum) === classNum &&
        Number(s.studentNum) === studentNum
      );
    });

    if (foundId) {
      store[foundId].name = name;
    } else {
      foundId = `s_${grade}_${classNum}_${studentNum}`;
      store[foundId] = {
        id: foundId,
        grade,
        classNum,
        studentNum,
        name,
        records: {}
      };
      if (fbState.connected) {
        await syncStudentDocToFirestore(foundId, store[foundId]);
      }
    }

    saveStore();
    applyStudentLogin(foundId, false);
    closeLoginModal();
  };

  studentForm.addEventListener("submit", handleStudentLogin);

  const handleTeacherLogin = (e) => {
    if (e) e.preventDefault();
    const pwInput = document.getElementById("loginTeacherPw");
    const errBox = document.getElementById("teacherLoginError");
    const entered = pwInput.value.trim();

    if (entered === teacherPassword) {
      errBox.hidden = true;
      errBox.style.display = "none";
      pwInput.value = "";
      applyTeacherLogin(false);
      closeLoginModal();
    } else {
      errBox.hidden = false;
      errBox.style.display = "block";
      showToast("❌ 비밀번호가 일치하지 않습니다. (초기: 1234)");
      pwInput.focus();
      pwInput.select();
    }
  };

  teacherForm.addEventListener("submit", handleTeacherLogin);
}

function applyStudentLogin(studentId, isSilent = false) {
  authSession = { role: "student", studentId };
  currentStudentId = studentId;
  try {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(authSession));
  } catch (e) {}

  updateAuthHeaderUI();
  syncAllUI();
  switchTab("record");

  if (!isSilent && store[studentId]) {
    showToast(`🎒 ${formatStudentLabel(store[studentId])} 로그인 완료!`);
  }
}

function applyTeacherLogin(isSilent = false) {
  authSession = { role: "teacher", studentId: currentStudentId };
  try {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(authSession));
  } catch (e) {}

  updateAuthHeaderUI();
  syncAllUI();
  switchTab("teacher");

  if (!isSilent) {
    showToast("👩‍🏫 교사 관리자 모드로 로그인되었습니다.");
  }
}

function updateAuthHeaderUI() {
  const chipBtn = document.getElementById("openLoginModalBtn");
  const badge = document.getElementById("currentUserBadge");
  const switcher = document.getElementById("teacherStudentSwitcher");
  const lockIcon = document.getElementById("teacherLockIcon");
  const summaryLabel = document.getElementById("summaryStudentLabel");

  if (authSession.role === "teacher") {
    chipBtn.classList.add("teacher");
    badge.textContent = "👩‍🏫 교사 관리자";
    switcher.hidden = false;
    lockIcon.textContent = "🔓";
    const s = store[currentStudentId];
    summaryLabel.textContent = s ? `${s.name} 참여일` : "이번 달 참여";
  } else {
    chipBtn.classList.remove("teacher");
    const s = store[currentStudentId];
    badge.textContent = s ? `🎒 ${formatStudentLabel(s)}` : "🎒 학생 로그인";
    switcher.hidden = true;
    lockIcon.textContent = "🔒";
    summaryLabel.textContent = "이번 달 참여";
  }
}

// ============================================================================
// 하단 네비게이션 탭 전환
// ============================================================================
function initTabs() {
  document.querySelectorAll(".b-nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetTab = btn.dataset.tab;
      if (targetTab === "teacher" && authSession.role !== "teacher") {
        showToast("🔒 교사 비밀번호를 입력해 주세요 (초기: 1234)");
        openLoginModal("teacher");
        return;
      }
      switchTab(targetTab);
    });
  });

  document.getElementById("goCalendarLink").addEventListener("click", () => {
    switchTab("calendar");
  });
}

function switchTab(tabName) {
  const tabs = ["record", "calendar", "calorie", "teacher"];
  const mapBtn = {
    record: "tabBtnRecord",
    calendar: "tabBtnCalendar",
    calorie: "tabBtnCalorie",
    teacher: "tabBtnTeacher"
  };
  const mapPanel = {
    record: "panelRecord",
    calendar: "panelCalendar",
    calorie: "panelCalorie",
    teacher: "panelTeacher"
  };

  tabs.forEach((t) => {
    const active = t === tabName;
    const btn = document.getElementById(mapBtn[t]);
    const panel = document.getElementById(mapPanel[t]);
    if (btn) {
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-selected", String(active));
    }
    if (panel) {
      panel.hidden = !active;
    }
  });

  if (tabName === "calendar") {
    renderCalendar();
    renderSelectedDayDetail(currentDateStr);
  } else if (tabName === "calorie") {
    renderCalorieTab();
  } else if (tabName === "teacher") {
    renderTeacherDashboard();
  }
}

// ============================================================================
// 학생 선택 드롭다운 (교사 모드용)
// ============================================================================
function renderStudentSelectOptions() {
  const select = document.getElementById("studentSelect");
  const ids = Object.keys(store);
  if (!ids.includes(currentStudentId)) {
    currentStudentId = ids[0] || "";
  }

  select.innerHTML = ids
    .map((id) => {
      const s = store[id];
      return `<option value="${id}" ${id === currentStudentId ? "selected" : ""}>${escapeHtml(formatStudentLabel(s))} (${s.grade}-${s.classNum})</option>`;
    })
    .join("");
}

function initStudentSelector() {
  const select = document.getElementById("studentSelect");
  select.addEventListener("change", (e) => {
    currentStudentId = e.target.value;
    syncAllUI();
    const s = store[currentStudentId];
    if (s) showToast(`${formatStudentLabel(s)} 학생 화면 조회 중`);
  });

  document.getElementById("resetDemoBtn").addEventListener("click", () => {
    store = JSON.parse(JSON.stringify(INITIAL_DEMO_DATA));
    currentStudentId = "student1";
    saveStore();
    syncAllUI();
    showToast("예시 데이터가 초기화되었습니다.");
  });
}

// ============================================================================
// [탭 1] 오늘 운동 기록하기 (🌅 아침 시간 / ☀️ 점심시간 구분 기록)
// ============================================================================
function initRecordForm() {
  const dateInput = document.getElementById("recordDate");
  const runInput = document.getElementById("runCount");
  const jumpInput = document.getElementById("jumpCount");
  const btnMorning = document.getElementById("sessionBtnMorning");
  const btnLunch = document.getElementById("sessionBtnLunch");

  dateInput.value = currentDateStr;
  dateInput.addEventListener("change", (e) => {
    if (e.target.value) {
      currentDateStr = e.target.value;
      const [y, m] = currentDateStr.split("-").map(Number);
      currentCalYear = y;
      currentCalMonth = m;
      loadDateIntoForm(currentDateStr);
    }
  });

  document.getElementById("todayBtn").addEventListener("click", () => {
    currentDateStr = TODAY_STR;
    dateInput.value = TODAY_STR;
    currentCalYear = 2026;
    currentCalMonth = 10;
    loadDateIntoForm(TODAY_STR);
  });

  if (btnMorning && btnLunch) {
    btnMorning.addEventListener("click", () => {
      currentSession = "morning";
      loadDateIntoForm(currentDateStr);
    });
    btnLunch.addEventListener("click", () => {
      currentSession = "lunch";
      loadDateIntoForm(currentDateStr);
    });
  }

  runInput.addEventListener("input", updateProgressBars);
  jumpInput.addEventListener("input", updateProgressBars);

  document.querySelectorAll(".quick-buttons").forEach((group) => {
    const targetId = group.dataset.target;
    const inputEl = document.getElementById(targetId);

    group.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.dataset.clear) {
          inputEl.value = 0;
        } else {
          const addVal = Number(btn.dataset.add || 0);
          inputEl.value = Math.max(0, Number(inputEl.value || 0) + addVal);
        }
        updateProgressBars();
      });
    });
  });

  document.querySelectorAll(".mood-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentMood = btn.dataset.mood;
      document.querySelectorAll(".mood-btn").forEach((b) =>
        b.classList.toggle("active", b.dataset.mood === currentMood)
      );
    });
  });

  document.getElementById("recordForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const runVal = Math.max(0, Math.min(500, Number(runInput.value || 0)));
    const jumpVal = Math.max(0, Math.min(50000, Math.round(Number(jumpInput.value || 0))));
    const noteVal = document.getElementById("recordNote").value.trim().slice(0, 100);
    const sessionLabel = currentSession === "lunch" ? "☀️ 점심시간" : "🌅 아침 시간";

    if (runVal === 0 && jumpVal === 0) {
      showToast(`${sessionLabel}의 달리기나 줄넘기를 1 이상 입력해 주세요!`);
      return;
    }

    if (!store[currentStudentId].records) {
      store[currentStudentId].records = {};
    }

    const norm = normalizeDayRecord(store[currentStudentId].records[currentDateStr]);
    norm[currentSession] = {
      run: runVal,
      jump: jumpVal,
      mood: currentMood,
      note: noteVal || `${sessionLabel} 운동 완료!`
    };

    const updatedDayObj = normalizeDayRecord(norm);
    store[currentStudentId].records[currentDateStr] = updatedDayObj;
    saveStore();
    syncAllUI();

    if (fbState.connected) {
      try {
        await syncRecordToFirestore(currentStudentId, currentDateStr, updatedDayObj);
        showToast(`☁️ ${currentDateStr.slice(5)} [${sessionLabel}] 실시간 서버 저장 완료!`);
      } catch (err) {
        showToast(`⚠️ 서버 쓰기 실패: Firebase [규칙(Rules)] 탭에서 read/write를 true로 설정해 주세요!`);
      }
    } else {
      showToast(`📱 ${currentDateStr.slice(5)} [${sessionLabel}] 기기 내부 저장됨 (서버 미연결 상태)`);
    }
  });

  document.getElementById("deleteRecordBtn").addEventListener("click", async () => {
    const records = getStudentRecords();
    if (!records[currentDateStr]) return;

    const sessionLabel = currentSession === "lunch" ? "☀️ 점심시간" : "🌅 아침 시간";
    const norm = normalizeDayRecord(records[currentDateStr]);
    norm[currentSession] = { run: 0, jump: 0, mood: "😄 상쾌해요", note: "" };
    const updatedDayObj = normalizeDayRecord(norm);

    if (!isParticipated(updatedDayObj)) {
      delete records[currentDateStr];
      saveStore();
      syncAllUI();
      if (fbState.connected) {
        await deleteRecordFromFirestore(currentStudentId, currentDateStr);
      }
    } else {
      records[currentDateStr] = updatedDayObj;
      saveStore();
      syncAllUI();
      if (fbState.connected) {
        await syncRecordToFirestore(currentStudentId, currentDateStr, updatedDayObj);
      }
    }
    showToast(`${currentDateStr.slice(5)} [${sessionLabel}] 기록이 삭제되었습니다.`);
  });
}

function loadDateIntoForm(dateStr) {
  const records = getStudentRecords();
  const rawRec = records[dateStr];
  const norm = normalizeDayRecord(rawRec);
  const sessRec = norm[currentSession] || { run: 0, jump: 0, mood: "😄 상쾌해요", note: "" };

  document.getElementById("recordDate").value = dateStr;
  document.getElementById("runCount").value = sessRec.run || 0;
  document.getElementById("jumpCount").value = sessRec.jump || 0;
  document.getElementById("recordNote").value = sessRec.note || "";

  currentMood = sessRec.mood || "😄 상쾌해요";
  document.querySelectorAll(".mood-btn").forEach((b) =>
    b.classList.toggle("active", b.dataset.mood === currentMood)
  );

  const hasM = isParticipated(norm.morning);
  const hasL = isParticipated(norm.lunch);

  // 아침 / 점심 완료 뱃지 및 요약 텍스트 갱신
  const btnMorning = document.getElementById("sessionBtnMorning");
  const btnLunch = document.getElementById("sessionBtnLunch");
  const badgeMorning = document.getElementById("sessionBadgeMorning");
  const badgeLunch = document.getElementById("sessionBadgeLunch");
  const sumMorning = document.getElementById("sessionSummaryMorning");
  const sumLunch = document.getElementById("sessionSummaryLunch");
  const noteMorning = document.getElementById("sessionNoteMorning");
  const noteLunch = document.getElementById("sessionNoteLunch");
  const morningDonePill = document.getElementById("morningDonePill");
  const lunchDonePill = document.getElementById("lunchDonePill");
  const activeBanner = document.getElementById("activeSessionBanner");
  const dailyTotalEl = document.getElementById("sessionDailyTotalText");
  const saveMainBtn = document.getElementById("saveRecordMainBtn");

  if (btnMorning && btnLunch) {
    btnMorning.classList.toggle("active", currentSession === "morning");
    btnLunch.classList.toggle("active", currentSession === "lunch");
    btnMorning.classList.toggle("is-done", hasM);
    btnLunch.classList.toggle("is-done", hasL);
  }

  if (morningDonePill) {
    morningDonePill.textContent = hasM ? "🌅 ✅ 아침운동 완료!" : "🌅 아침운동 미기록";
    morningDonePill.className = hasM ? "session-top-pill done-morning" : "session-top-pill pending";
  }
  if (lunchDonePill) {
    lunchDonePill.textContent = hasL ? "☀️ ✅ 점심운동 완료!" : "☀️ 점심운동 미기록";
    lunchDonePill.className = hasL ? "session-top-pill done-lunch" : "session-top-pill pending";
  }

  if (badgeMorning) {
    badgeMorning.textContent = hasM ? "✅ 아침운동 완료" : "미기록";
    badgeMorning.className = hasM ? "session-state-badge done" : "session-state-badge";
  }
  if (badgeLunch) {
    badgeLunch.textContent = hasL ? "✅ 점심운동 완료" : "미기록";
    badgeLunch.className = hasL ? "session-state-badge done" : "session-state-badge";
  }

  if (sumMorning) {
    sumMorning.textContent = hasM
      ? `🏃 달리기 ${norm.morning.run}바퀴 · 🪢 줄넘기 ${norm.morning.jump.toLocaleString()}개`
      : "아침운동 기록 전";
  }
  if (sumLunch) {
    sumLunch.textContent = hasL
      ? `🏃 달리기 ${norm.lunch.run}바퀴 · 🪢 줄넘기 ${norm.lunch.jump.toLocaleString()}개`
      : "점심운동 기록 전";
  }

  if (noteMorning) {
    noteMorning.textContent = hasM
      ? `💬 ${norm.morning.note || "아침운동 완료!"} (${norm.morning.mood || "😄 상쾌해요"})`
      : "클릭하여 아침 시간 운동을 입력해 보세요";
  }
  if (noteLunch) {
    noteLunch.textContent = hasL
      ? `💬 ${norm.lunch.note || "점심운동 완료!"} (${norm.lunch.mood || "😄 상쾌해요"})`
      : "클릭하여 점심시간 운동을 입력해 보세요";
  }

  if (activeBanner) {
    if (currentSession === "morning") {
      activeBanner.className = "active-session-banner morning";
      activeBanner.innerHTML = hasM
        ? `<span>🌅 현재 <strong>[아침운동]</strong> 선택됨</span><span>✅ 아침운동 완료됨 (수정 가능)</span>`
        : `<span>🌅 현재 <strong>[아침운동]</strong> 입력 중입니다</span><span>운동량을 입력 후 아래 저장 버튼을 눌러주세요</span>`;
    } else {
      activeBanner.className = "active-session-banner lunch";
      activeBanner.innerHTML = hasL
        ? `<span>☀️ 현재 <strong>[점심운동]</strong> 선택됨</span><span>✅ 점심운동 완료됨 (수정 가능)</span>`
        : `<span>☀️ 현재 <strong>[점심운동]</strong> 입력 중입니다</span><span>운동량을 입력 후 아래 저장 버튼을 눌러주세요</span>`;
    }
  }

  if (dailyTotalEl) {
    dailyTotalEl.textContent = `🏃 총 ${norm.run}바퀴 · 🪢 총 ${norm.jump.toLocaleString()}개`;
  }
  if (saveMainBtn) {
    saveMainBtn.textContent =
      currentSession === "lunch"
        ? "💾 ☀️ 점심운동 완료 저장하기"
        : "💾 🌅 아침운동 완료 저장하기";
  }

  const badge = document.getElementById("recordStatusBadge");
  const deleteBtn = document.getElementById("deleteRecordBtn");

  deleteBtn.hidden = !isParticipated(sessRec);

  if (isParticipated(norm)) {
    const doneLabel =
      hasM && hasL
        ? "🌅아침·☀️점심 모두 완료!"
        : hasM
        ? "🌅 아침운동 완료"
        : "☀️ 점심운동 완료";
    if (isGoalMet(norm)) {
      badge.textContent = `⭐ 목표달성 (${doneLabel})`;
      badge.className = "status-badge gold";
    } else {
      badge.textContent = `✅ ${doneLabel}`;
      badge.className = "status-badge done";
    }
  } else {
    badge.textContent = "미기록";
    badge.className = "status-badge";
  }

  updateProgressBars();
}

function updateProgressBars() {
  const runVal = Math.max(0, Number(document.getElementById("runCount").value || 0));
  const jumpVal = Math.max(0, Number(document.getElementById("jumpCount").value || 0));

  const runPct = Math.min(100, Math.round((runVal / goals.run) * 100));
  const jumpPct = Math.min(100, Math.round((jumpVal / goals.jump) * 100));

  document.getElementById("runProgressBar").style.width = `${runPct}%`;
  document.getElementById("jumpProgressBar").style.width = `${jumpPct}%`;
}

// ============================================================================
// 요약 통계 & 최근 기록
// ============================================================================
function getWeekDates(baseDateStr = currentDateStr || TODAY_STR) {
  const [y, m, d] = baseDateStr.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  const dayOfWeek = dt.getDay(); // 0(일) ~ 6(토)
  const diffToMon = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const mon = new Date(y, m - 1, d + diffToMon);
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const cur = new Date(mon.getFullYear(), mon.getMonth(), mon.getDate() + i);
    const yy = cur.getFullYear();
    const mm = String(cur.getMonth() + 1).padStart(2, "0");
    const dd = String(cur.getDate()).padStart(2, "0");
    dates.push(`${yy}-${mm}-${dd}`);
  }
  return dates;
}

function computeStudentStats(studentId, year = currentCalYear, month = currentCalMonth) {
  const records = getStudentRecords(studentId);
  const monthPrefix = `${year}-${String(month).padStart(2, "0")}`;

  let monthDays = 0;
  let goalDays = 0;
  let totalRun = 0;
  let totalJump = 0;

  Object.entries(records).forEach(([dateKey, rec]) => {
    if (!isParticipated(rec)) return;
    if (dateKey.startsWith(monthPrefix)) {
      monthDays += 1;
      if (isGoalMet(rec)) goalDays += 1;
      totalRun += Number(rec.run || 0);
      totalJump += Number(rec.jump || 0);
    }
  });

  // 선택한 날짜가 속한 주(월~일) 기준 1주당 운동량 계산
  const weekDates = getWeekDates(currentDateStr || TODAY_STR);
  let weekDays = 0;
  let weekRun = 0;
  let weekJump = 0;
  weekDates.forEach((dStr) => {
    const rec = records[dStr];
    if (isParticipated(rec)) {
      weekDays += 1;
      weekRun += Number(rec.run || 0);
      weekJump += Number(rec.jump || 0);
    }
  });

  const weeklyGoalMet =
    weekDays >= goals.weeklyDays && weekRun >= goals.weeklyRun && weekJump >= goals.weeklyJump;
  const weekRangeLabel = `${weekDates[0].slice(5).replace("-", "/")}~${weekDates[6].slice(5).replace("-", "/")}`;

  const activeDates = Object.keys(records)
    .filter((d) => isParticipated(records[d]))
    .sort();

  let streak = 0;
  if (activeDates.length > 0) {
    streak = 1;
    for (let i = activeDates.length - 1; i > 0; i--) {
      const curr = new Date(activeDates[i]);
      const prev = new Date(activeDates[i - 1]);
      const diffDays = Math.round((curr - prev) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) streak++;
      else break;
    }
  }

  const lastDate = activeDates.length > 0 ? activeDates[activeDates.length - 1] : "-";
  const participatedToday = Boolean(records[TODAY_STR] && isParticipated(records[TODAY_STR]));

  return {
    monthDays,
    goalDays,
    totalRun,
    totalJump,
    weekDays,
    weekRun,
    weekJump,
    weeklyGoalMet,
    weekRangeLabel,
    streak,
    lastDate,
    participatedToday
  };
}

function renderSummaryStats() {
  const st = computeStudentStats(currentStudentId);
  document.getElementById("statDays").textContent = `${st.monthDays}일`;
  document.getElementById("statStreak").textContent = `1주 ${st.weekDays}/${goals.weeklyDays}일 · 🔥${st.streak}일`;
  document.getElementById("statRunTotal").textContent = `${st.totalRun}바퀴`;
  document.getElementById("statJumpTotal").textContent = `${st.totalJump.toLocaleString()}개`;

  const runGoalEl = document.getElementById("runGoalText");
  const jumpGoalEl = document.getElementById("jumpGoalText");
  if (runGoalEl) runGoalEl.textContent = `${st.weekRun}/${goals.weeklyRun}바퀴`;
  if (jumpGoalEl) jumpGoalEl.textContent = `${st.weekJump.toLocaleString()}/${goals.weeklyJump.toLocaleString()}개`;

  const wgRange = document.getElementById("weeklyRangeLabel");
  const wgBadge = document.getElementById("weeklyStatusBadge");
  const wgDays = document.getElementById("wgDaysText");
  const wgRun = document.getElementById("wgRunText");
  const wgJump = document.getElementById("wgJumpText");

  if (wgRange) wgRange.textContent = `(${st.weekRangeLabel})`;
  if (wgDays) wgDays.textContent = `${st.weekDays} / ${goals.weeklyDays}일`;
  if (wgRun) wgRun.textContent = `${st.weekRun} / ${goals.weeklyRun}바퀴`;
  if (wgJump) wgJump.textContent = `${st.weekJump.toLocaleString()} / ${goals.weeklyJump.toLocaleString()}개`;

  if (wgBadge) {
    if (st.weeklyGoalMet) {
      wgBadge.textContent = "🏆 1주 목표 달성!";
      wgBadge.className = "status-badge gold";
    } else if (st.weekDays > 0) {
      const pct = Math.min(
        99,
        Math.round(
          ((Math.min(1, st.weekDays / goals.weeklyDays) +
            Math.min(1, st.weekRun / goals.weeklyRun) +
            Math.min(1, st.weekJump / goals.weeklyJump)) /
            3) *
            100
        )
      );
      wgBadge.textContent = `🏃 주간 ${pct}% 진행중`;
      wgBadge.className = "status-badge done";
    } else {
      wgBadge.textContent = "이번 주 미참여";
      wgBadge.className = "status-badge";
    }
  }
}

function renderRecentList() {
  const listEl = document.getElementById("recentList");
  const records = getStudentRecords();
  const sortedDates = Object.keys(records)
    .filter((d) => isParticipated(records[d]))
    .sort((a, b) => b.localeCompare(a))
    .slice(0, 4);

  if (sortedDates.length === 0) {
    listEl.innerHTML = `<li class="recent-item"><span>아직 기록이 없어요. 오늘 첫 운동을 기록해 보세요!</span></li>`;
    return;
  }

  listEl.innerHTML = sortedDates
    .map((dateStr) => {
      const norm = normalizeDayRecord(records[dateStr]);
      const stamp = isGoalMet(norm) ? "⭐ 목표달성" : "✅ 참여완료";
      const sessionBadges = getSessionTagsHtml(norm);
      const detailStack = buildSessionDetailStackHtml(norm, false);
      return `
        <li class="recent-item" data-date="${dateStr}">
          <div class="recent-item-header">
            <div class="recent-date">
              <span>📅 ${dateStr.slice(5)} (${stamp})</span>
              ${sessionBadges}
            </div>
            <div class="recent-badges">
              <span class="pill-run">합산 🏃 ${norm.run}바퀴</span>
              <span class="pill-jump">합산 🪢 ${norm.jump.toLocaleString()}개</span>
            </div>
          </div>
          ${detailStack}
        </li>
      `;
    })
    .join("");

  listEl.querySelectorAll(".recent-item[data-date]").forEach((item) => {
    item.addEventListener("click", () => {
      currentDateStr = item.dataset.date;
      loadDateIntoForm(currentDateStr);
      showToast(`${currentDateStr.slice(5)} 기록을 불러왔습니다.`);
    });
  });
}

// ============================================================================
// [탭 2] 참여 달력 (모바일 한눈에 보기)
// ============================================================================
function initCalendarControls() {
  document.getElementById("prevMonthBtn").addEventListener("click", () => {
    currentCalMonth--;
    if (currentCalMonth < 1) {
      currentCalMonth = 12;
      currentCalYear--;
    }
    syncAllUI();
  });

  document.getElementById("nextMonthBtn").addEventListener("click", () => {
    currentCalMonth++;
    if (currentCalMonth > 12) {
      currentCalMonth = 1;
      currentCalYear++;
    }
    syncAllUI();
  });

  document.getElementById("editSelectedDayBtn").addEventListener("click", () => {
    loadDateIntoForm(currentDateStr);
    switchTab("record");
  });
}

function renderCalendar() {
  document.getElementById("calendarMonthTitle").textContent = `${currentCalYear}년 ${currentCalMonth}월`;
  const gridEl = document.getElementById("calendarGrid");
  const records = getStudentRecords();

  const firstDay = new Date(currentCalYear, currentCalMonth - 1, 1).getDay();
  const daysInMonth = new Date(currentCalYear, currentCalMonth, 0).getDate();

  let html = "";
  for (let i = 0; i < firstDay; i++) {
    html += `<div class="cal-cell empty"></div>`;
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${currentCalYear}-${String(currentCalMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const rec = records[dateStr];
    const participated = isParticipated(rec);
    const goalMet = isGoalMet(rec);
    const isSelected = dateStr === currentDateStr;

    let cellClasses = "cal-cell";
    if (goalMet) cellClasses += " goal-met";
    else if (participated) cellClasses += " participated";
    if (isSelected) cellClasses += " selected";

    const stamp = goalMet ? "⭐" : participated ? "✅" : "";
    const norm = participated ? normalizeDayRecord(rec) : null;
    const hasM = norm ? isParticipated(norm.morning) : false;
    const hasL = norm ? isParticipated(norm.lunch) : false;

    html += `
      <button type="button" class="${cellClasses}" data-date="${dateStr}">
        <div class="cal-cell-top">
          <span class="cal-day-num">${day}</span>
          <span class="cal-stamp">${stamp}</span>
        </div>
        ${
          participated
            ? `<div class="cal-mini-summary">
                <div class="cal-session-badges">
                  ${hasM ? `<span class="cal-sess-pill morning">🌅아침완료</span>` : ""}
                  ${hasL ? `<span class="cal-sess-pill lunch">☀️점심완료</span>` : ""}
                </div>
                <div>🏃${norm.run} · 🪢${norm.jump}</div>
              </div>`
            : `<div class="cal-mini-summary"></div>`
        }
      </button>
    `;
  }

  gridEl.innerHTML = html;

  gridEl.querySelectorAll(".cal-cell[data-date]").forEach((cell) => {
    cell.addEventListener("click", () => {
      currentDateStr = cell.dataset.date;
      renderCalendar();
      renderSelectedDayDetail(currentDateStr);
    });
  });
}

function renderSelectedDayDetail(dateStr) {
  const records = getStudentRecords();
  const rawRec = records[dateStr];
  const norm = normalizeDayRecord(rawRec);
  const titleEl = document.getElementById("selectedDayTitle");
  const badgeEl = document.getElementById("selectedDayBadge");
  const bodyEl = document.getElementById("selectedDayContent");

  titleEl.textContent = `${dateStr} 기록 상세 (아침·점심)`;

  if (rawRec && isParticipated(norm)) {
    const goalMet = isGoalMet(norm);
    const hasM = isParticipated(norm.morning);
    const hasL = isParticipated(norm.lunch);
    const doneLabel =
      hasM && hasL
        ? "🌅아침·☀️점심 모두 완료"
        : hasM
        ? "🌅 아침운동 완료"
        : "☀️ 점심운동 완료";
    badgeEl.textContent = goalMet ? `⭐ 목표 달성 (${doneLabel})` : `✅ ${doneLabel}`;
    badgeEl.className = goalMet ? "status-badge gold" : "status-badge done";

    bodyEl.innerHTML = `
      ${buildSessionDetailStackHtml(norm, true)}
      <div class="detail-row" style="padding-top:8px; margin-top:4px; border-top:1px dashed var(--border); font-size:0.9rem; font-weight:900;">
        <span>📊 하루 총 합산 운동량</span>
        <span>
          <strong class="text-run">🏃 달리기 ${norm.run}바퀴</strong> ·
          <strong class="text-jump">🪢 줄넘기 ${norm.jump.toLocaleString()}개</strong>
        </span>
      </div>
    `;
  } else {
    badgeEl.textContent = "미참여";
    badgeEl.className = "status-badge";
    bodyEl.innerHTML = `<div style="color:var(--text-muted)">기록된 아침·점심 운동이 없습니다. 아래 버튼으로 기록해 보세요!</div>`;
  }
}

// ============================================================================
// [탭 3] 교사용 모바일 카드형 대시보드
// ============================================================================
function initTeacherControls() {
  document.getElementById("filterGrade").addEventListener("change", renderTeacherDashboard);
  document.getElementById("sortBySelect").addEventListener("change", renderTeacherDashboard);
  document.getElementById("studentSearchInput").addEventListener("input", renderTeacherDashboard);

  const addPanel = document.getElementById("addStudentPanel");
  const goalPanel = document.getElementById("goalConfigPanel");
  const pwPanel = document.getElementById("pwChangePanel");

  const closeAllPanels = () => {
    addPanel.hidden = true;
    goalPanel.hidden = true;
    pwPanel.hidden = true;
  };

  document.getElementById("openAddStudentBtn").addEventListener("click", () => {
    const willOpen = addPanel.hidden;
    closeAllPanels();
    addPanel.hidden = !willOpen;
  });
  document.getElementById("closeAddStudentBtn").addEventListener("click", closeAllPanels);

  document.getElementById("openGoalConfigBtn").addEventListener("click", () => {
    const willOpen = goalPanel.hidden;
    closeAllPanels();
    goalPanel.hidden = !willOpen;
  });
  document.getElementById("closeGoalConfigBtn").addEventListener("click", closeAllPanels);

  document.getElementById("openPwChangeBtn").addEventListener("click", () => {
    const willOpen = pwPanel.hidden;
    closeAllPanels();
    pwPanel.hidden = !willOpen;
  });
  document.getElementById("closePwChangeBtn").addEventListener("click", closeAllPanels);

  document.getElementById("addStudentForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const grade = Math.min(3, Math.max(1, Number(document.getElementById("newGrade").value)));
    const classNum = Math.min(20, Math.max(1, Number(document.getElementById("newClass").value)));
    const studentNum = Math.min(50, Math.max(1, Number(document.getElementById("newNumber").value)));
    const name = document.getElementById("newName").value.trim();

    if (!name) {
      showToast("학생 이름을 입력해 주세요.");
      return;
    }

    const newId = `s_${grade}_${classNum}_${studentNum}`;
    const newStudent = {
      id: newId,
      grade,
      classNum,
      studentNum,
      name,
      records: store[newId]?.records || {}
    };

    store[newId] = newStudent;
    currentStudentId = newId;
    saveStore();
    document.getElementById("newName").value = "";
    addPanel.hidden = true;
    syncAllUI();

    if (fbState.connected) {
      await syncStudentDocToFirestore(newId, newStudent);
    }
    showToast(`➕ ${formatStudentLabel(newStudent)} 등록 완료!`);
  });

  document.querySelectorAll(".goal-preset-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.getElementById("cfgWeeklyDaysGoal").value = btn.dataset.wdays;
      document.getElementById("cfgWeeklyRunGoal").value = btn.dataset.wrun;
      document.getElementById("cfgWeeklyJumpGoal").value = btn.dataset.wjump;
      document.getElementById("cfgRunGoal").value = btn.dataset.drun;
      document.getElementById("cfgJumpGoal").value = btn.dataset.djump;
    });
  });

  document.getElementById("goalConfigForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    goals.weeklyDays = Math.min(7, Math.max(1, Math.round(Number(document.getElementById("cfgWeeklyDaysGoal").value || 3))));
    goals.weeklyRun = Math.max(1, Number(document.getElementById("cfgWeeklyRunGoal").value || 15));
    goals.weeklyJump = Math.max(50, Math.round(Number(document.getElementById("cfgWeeklyJumpGoal").value || 1000)));
    goals.run = Math.max(0.5, Number(document.getElementById("cfgRunGoal").value || 5));
    goals.jump = Math.max(10, Math.round(Number(document.getElementById("cfgJumpGoal").value || 300)));
    saveGoals();
    updateGoalTexts();
    goalPanel.hidden = true;
    syncAllUI();

    if (fbState.connected && fbState.sdk) {
      try {
        const { ref, set } = fbState.sdk;
        await set(ref(fbState.db, "fitnessClassroom/goals"), goals);
      } catch (err) {}
    }

    showToast(`🎯 1주 목표(주${goals.weeklyDays}일·달리기 ${goals.weeklyRun}바퀴·줄넘기 ${goals.weeklyJump}개) 적용 완료!`);
  });

  document.getElementById("pwChangeForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const newPw = document.getElementById("newTeacherPw").value.trim();
    if (!newPw) return;
    saveTeacherPassword(newPw);
    document.getElementById("newTeacherPw").value = "";
    pwPanel.hidden = true;
    showToast("🔑 교사 비밀번호가 변경되었습니다!");
  });

  document.getElementById("exportCsvBtn").addEventListener("click", exportClassStatsToCSV);

  const tPrevBtn = document.getElementById("teacherPrevMonthBtn");
  const tNextBtn = document.getElementById("teacherNextMonthBtn");
  if (tPrevBtn) {
    tPrevBtn.addEventListener("click", () => {
      currentCalMonth--;
      if (currentCalMonth < 1) {
        currentCalMonth = 12;
        currentCalYear--;
      }
      syncAllUI();
    });
  }
  if (tNextBtn) {
    tNextBtn.addEventListener("click", () => {
      currentCalMonth++;
      if (currentCalMonth > 12) {
        currentCalMonth = 1;
        currentCalYear++;
      }
      syncAllUI();
    });
  }

  const viewTableBtn = document.getElementById("viewModeTableBtn");
  const viewCardBtn = document.getElementById("viewModeCardBtn");
  const tableWrap = document.getElementById("rosterTableWrap");
  const cardWrap = document.getElementById("teacherStudentCards");

  if (viewTableBtn && viewCardBtn && tableWrap && cardWrap) {
    viewTableBtn.addEventListener("click", () => {
      viewTableBtn.classList.add("active");
      viewCardBtn.classList.remove("active");
      tableWrap.hidden = false;
      cardWrap.hidden = true;
    });
    viewCardBtn.addEventListener("click", () => {
      viewCardBtn.classList.add("active");
      viewTableBtn.classList.remove("active");
      tableWrap.hidden = true;
      cardWrap.hidden = false;
    });
  }
}

function renderTeacherDashboard() {
  const allStudents = Object.values(store);
  const totalCount = allStudents.length;

  let todayParticipants = 0;
  let sumMonthDays = 0;
  let sumGoalDays = 0;
  let weeklyGoalAchievers = 0;
  let sumRun = 0;
  let sumJump = 0;
  const lowStudentNames = [];

  const enriched = allStudents.map((s) => {
    const st = computeStudentStats(s.id, currentCalYear, currentCalMonth);
    if (st.participatedToday) todayParticipants++;
    if (st.weeklyGoalMet) weeklyGoalAchievers++;
    sumMonthDays += st.monthDays;
    sumGoalDays += st.goalDays;
    sumRun += st.totalRun;
    sumJump += st.totalJump;
    if (st.monthDays < 4) {
      lowStudentNames.push(`${s.name}(${st.monthDays}일)`);
    }
    return { ...s, stats: st };
  });

  const todayRate = totalCount > 0 ? Math.round((todayParticipants / totalCount) * 100) : 0;
  const avgDays = totalCount > 0 ? (sumMonthDays / totalCount).toFixed(1) : "0.0";

  document.getElementById("kpiTotalStudents").textContent = `${totalCount}명`;
  document.getElementById("kpiTodayRate").textContent = `오늘 ${todayParticipants}명 참여 (${todayRate}%)`;
  document.getElementById("kpiMonthLabel").textContent = `${currentCalMonth}월 평균 · 주간달성`;
  document.getElementById("kpiAvgDays").textContent = `${avgDays}일`;
  document.getElementById("kpiGoalRate").textContent = `🏆 1주목표 달성 ${weeklyGoalAchievers}명`;
  document.getElementById("kpiClassRun").textContent = `🏃 ${sumRun.toLocaleString()}바퀴`;
  document.getElementById("kpiClassJump").textContent = `🪢 줄넘기 ${sumJump.toLocaleString()}개`;
  document.getElementById("kpiLowCount").textContent = `${lowStudentNames.length}명`;
  document.getElementById("kpiLowNames").textContent =
    lowStudentNames.length > 0 ? lowStudentNames.join(", ") : "전원 성실 참여 중!";

  document.getElementById("teacherTableMonth").textContent = `${currentCalYear}년 ${currentCalMonth}월`;

  // 학년별 등록 학생 수 집계 배지 표시
  const gradeSummaryEl = document.getElementById("rosterGradeSummary");
  if (gradeSummaryEl) {
    const g1 = allStudents.filter((s) => Number(s.grade) === 1).length;
    const g2 = allStudents.filter((s) => Number(s.grade) === 2).length;
    const g3 = allStudents.filter((s) => Number(s.grade) === 3).length;
    gradeSummaryEl.innerHTML = `
      <span class="grade-cnt-badge total">총 등록 ${totalCount}명</span>
      <span class="grade-cnt-badge">1학년 ${g1}명</span>
      <span class="grade-cnt-badge">2학년 ${g2}명</span>
      <span class="grade-cnt-badge">3학년 ${g3}명</span>
    `;
  }

  const gradeFilter = document.getElementById("filterGrade").value;
  const sortBy = document.getElementById("sortBySelect").value;
  const queryText = document.getElementById("studentSearchInput").value.trim().toLowerCase();

  const filtered = enriched
    .filter((item) => {
      if (gradeFilter !== "all" && String(item.grade) !== gradeFilter) return false;
      if (queryText) {
        const label = `${formatStudentCode(item)} ${item.name}`.toLowerCase();
        if (!label.includes(queryText)) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "daysDesc") return b.stats.monthDays - a.stats.monthDays;
      if (sortBy === "daysAsc") return a.stats.monthDays - b.stats.monthDays;
      if (sortBy === "runDesc") return b.stats.totalRun - a.stats.totalRun;
      if (sortBy === "jumpDesc") return b.stats.totalJump - a.stats.totalJump;
      return a.grade - b.grade || a.classNum - b.classNum || a.studentNum - b.studentNum;
    });

  // 1) 전체 등록 학생 명렬표 (위에서 아래로 쭉 보는 테이블) 렌더링
  const tbodyEl = document.getElementById("teacherTableBody");
  if (tbodyEl) {
    if (filtered.length === 0) {
      tbodyEl.innerHTML = `<tr><td colspan="10" style="text-align:center; padding:18px; color:var(--text-muted);">검색 조건에 맞는 등록 학생이 없습니다.</td></tr>`;
    } else {
      tbodyEl.innerHTML = filtered
        .map((s, idx) => {
          const st = s.stats;
          const todayRec = s.records?.[TODAY_STR];
          const todayBadge = st.participatedToday
            ? getSessionTagsHtml(todayRec) || `<span class="status-badge done">✅ 완료</span>`
            : `<span class="status-badge">미기록</span>`;

          let weekBadge = `<span class="status-badge done">진행 ${st.weekDays}/${goals.weeklyDays}일</span>`;
          if (st.weeklyGoalMet) {
            weekBadge = `<span class="status-badge gold">🏆 달성 (${st.weekDays}/${goals.weeklyDays}일)</span>`;
          } else if (st.weekDays === 0) {
            weekBadge = `<span class="status-badge warn">미참여 (0/${goals.weeklyDays}일)</span>`;
          }

          return `
            <tr>
              <td class="roster-no">${idx + 1}</td>
              <td><span class="student-code-tag">${formatStudentCode(s)}</span></td>
              <td>${s.grade}학년 ${s.classNum}반 ${s.studentNum}번</td>
              <td><span class="roster-name">${escapeHtml(s.name)}</span></td>
              <td>${todayBadge}</td>
              <td>${weekBadge}</td>
              <td><strong>${st.monthDays}일</strong> <small style="color:var(--text-muted)">(⭐${st.goalDays}일)</small></td>
              <td>
                <span class="text-run">🏃 ${st.totalRun}바퀴</span> ·
                <span class="text-jump">🪢 ${st.totalJump.toLocaleString()}개</span>
              </td>
              <td style="color:var(--text-muted)">${st.lastDate === "-" ? "-" : st.lastDate.slice(5)}</td>
              <td>
                <div class="std-actions">
                  <button type="button" class="btn-table edit-student-btn" data-id="${s.id}">✏️ 기록</button>
                  <button type="button" class="btn-table view-student-btn" data-id="${s.id}">📅 달력</button>
                  <button type="button" class="btn-table del del-student-btn" data-id="${s.id}">삭제</button>
                </div>
              </td>
            </tr>
          `;
        })
        .join("");
    }
  }

  // 2) 카드형 보기 렌더링
  const cardContainer = document.getElementById("teacherStudentCards");
  if (filtered.length === 0) {
    cardContainer.innerHTML = `<div style="text-align:center; padding:18px; color:var(--text-muted); font-size:0.84rem;">검색 조건에 맞는 학생이 없습니다.</div>`;
  } else {
    cardContainer.innerHTML = filtered
      .map((s) => {
        const st = s.stats;
        let statusBadge = `<span class="status-badge done">✅ 성실</span>`;
        if (st.weeklyGoalMet) {
          statusBadge = `<span class="status-badge gold">🏆 1주목표 달성</span>`;
        } else if (st.monthDays < 4) {
          statusBadge = `<span class="status-badge warn">🚨 독려필요</span>`;
        }

        return `
          <div class="std-card">
            <div class="std-card-top">
              <div class="std-name-wrap">
                <span class="student-code-tag">${formatStudentCode(s)}</span>
                <span>${escapeHtml(s.name)} <small style="color:var(--text-muted)">(${s.grade}-${s.classNum})</small></span>
              </div>
              ${statusBadge}
            </div>
            <div class="std-card-bottom">
              <div class="std-metrics">
                <span>1주 ${st.weekDays}/${goals.weeklyDays}일 <small>(이달 ${st.monthDays}일)</small></span>
                <span class="text-run">🏃 1주 ${st.weekRun}/${goals.weeklyRun}바퀴</span>
                <span class="text-jump">🪢 1주 ${st.weekJump.toLocaleString()}/${goals.weeklyJump.toLocaleString()}개</span>
              </div>
              <div class="std-actions">
                <button type="button" class="btn-table edit-student-btn" data-id="${s.id}">✏️ 기록</button>
                <button type="button" class="btn-table view-student-btn" data-id="${s.id}">📅 달력</button>
                <button type="button" class="btn-table del del-student-btn" data-id="${s.id}">삭제</button>
              </div>
            </div>
          </div>
        `;
      })
      .join("");
  }

  const rosterSection = document.querySelector(".roster-section-card") || cardContainer;

  rosterSection.querySelectorAll(".edit-student-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentStudentId = btn.dataset.id;
      syncAllUI();
      switchTab("record");
      showToast(`✏️ ${formatStudentLabel(store[currentStudentId])} 기록 입력 화면으로 이동`);
    });
  });

  rosterSection.querySelectorAll(".view-student-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentStudentId = btn.dataset.id;
      syncAllUI();
      switchTab("calendar");
      showToast(`${formatStudentLabel(store[currentStudentId])} 달력으로 이동`);
    });
  });

  rosterSection.querySelectorAll(".del-student-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const targetId = btn.dataset.id;
      if (Object.keys(store).length <= 1) {
        showToast("최소 1명의 학생 데이터는 유지되어야 합니다.");
        return;
      }
      const label = formatStudentLabel(store[targetId]);
      delete store[targetId];
      if (currentStudentId === targetId) {
        currentStudentId = Object.keys(store)[0];
      }
      saveStore();
      syncAllUI();
      if (fbState.connected) {
        await deleteStudentFromFirestore(targetId);
      }
      showToast(`${label} 삭제 완료`);
    });
  });

  renderTeacherCalendar(filtered);
  renderTeacherSelectedDayDetail(currentDateStr, filtered);
  renderDailyAttendanceChart(allStudents);
}

function renderTeacherCalendar(studentsList) {
  const titleEl = document.getElementById("teacherCalendarMonthTitle");
  const gridEl = document.getElementById("teacherCalendarGrid");
  if (!gridEl) return;

  if (titleEl) {
    titleEl.textContent = `${currentCalYear}년 ${currentCalMonth}월 전체 참여 달력`;
  }

  const firstDay = new Date(currentCalYear, currentCalMonth - 1, 1).getDay();
  const daysInMonth = new Date(currentCalYear, currentCalMonth, 0).getDate();

  let html = "";
  for (let i = 0; i < firstDay; i++) {
    html += `<div class="cal-cell empty"></div>`;
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${currentCalYear}-${String(currentCalMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const isSelected = dateStr === currentDateStr;

    // 이 날짜에 참여한 모든 학생 수집
    const participants = [];
    let allGoalsMet = true;
    studentsList.forEach((s) => {
      const rec = s.records?.[dateStr];
      if (isParticipated(rec)) {
        const gMet = isGoalMet(rec);
        if (!gMet) allGoalsMet = false;
        participants.push({ student: s, rec, goalMet: gMet });
      }
    });

    const hasAny = participants.length > 0;
    let cellClasses = "cal-cell";
    if (hasAny) {
      cellClasses += allGoalsMet ? " goal-met" : " participated";
    }
    if (isSelected) cellClasses += " selected";

    const maxVisibleInCell = 4;
    const visibleItems = participants.slice(0, maxVisibleInCell);
    const hiddenCount = participants.length - visibleItems.length;
    const tooltipNames = participants
      .map((p) => `${formatStudentLabel(p.student)} (달리기 ${p.rec.run}바퀴, 줄넘기 ${p.rec.jump}개)`)
      .join("\n");

    const namesHtml = visibleItems
      .map(
        (p) =>
          `<span class="t-std-pill ${p.goalMet ? "gold" : ""}">${p.goalMet ? "⭐" : "✅"}${escapeHtml(p.student.name)}</span>`
      )
      .join("");

    const moreHtml = hiddenCount > 0 ? `<span class="t-std-more">+${hiddenCount}명 더보기</span>` : "";

    html += `
      <button type="button" class="${cellClasses}" data-date="${dateStr}" title="${escapeHtml(tooltipNames)}">
        <div class="cal-cell-top">
          <span class="cal-day-num">${day}</span>
          ${hasAny ? `<span class="t-cal-count">${participants.length}명</span>` : ""}
        </div>
        <div class="t-cal-names">
          ${namesHtml}
          ${moreHtml}
        </div>
      </button>
    `;
  }

  gridEl.innerHTML = html;

  gridEl.querySelectorAll(".cal-cell[data-date]").forEach((cell) => {
    cell.addEventListener("click", () => {
      currentDateStr = cell.dataset.date;
      renderTeacherCalendar(studentsList);
      renderTeacherSelectedDayDetail(currentDateStr, studentsList);
    });
  });
}

function renderTeacherSelectedDayDetail(dateStr, studentsList) {
  const titleEl = document.getElementById("teacherSelectedDayTitle");
  const badgeEl = document.getElementById("teacherSelectedDayBadge");
  const listEl = document.getElementById("teacherSelectedDayList");
  if (!listEl) return;

  const [, m, d] = dateStr.split("-");
  if (titleEl) {
    titleEl.textContent = `🗓️ ${Number(m)}월 ${Number(d)}일 참여 학생 명단`;
  }

  const participants = [];
  const absentees = [];

  studentsList.forEach((s) => {
    const rec = s.records?.[dateStr];
    if (isParticipated(rec)) {
      participants.push({ student: s, rec, goalMet: isGoalMet(rec) });
    } else {
      absentees.push(s);
    }
  });

  if (badgeEl) {
    badgeEl.textContent = `${participants.length} / ${studentsList.length}명 참여`;
    badgeEl.className = participants.length > 0 ? "status-badge done" : "status-badge";
  }

  let html = "";
  if (participants.length === 0) {
    html += `<div style="padding:14px; text-align:center; color:var(--text-muted); font-size:0.82rem; background:var(--surface-soft); border-radius:10px;">이 날짜에 운동을 기록한 학생이 없습니다.</div>`;
  } else {
    html += participants
      .map(({ student, rec, goalMet }) => {
        const norm = normalizeDayRecord(rec);
        const badge = goalMet ? "⭐ 목표달성" : "✅ 참여완료";
        const sTags = getSessionTagsHtml(norm);
        const detailStack = buildSessionDetailStackHtml(norm, false);

        return `
          <div class="t-day-std-item">
            <div class="t-day-std-header">
              <div class="t-day-std-title">
                <span class="student-code-tag">${formatStudentCode(student)}</span>
                <span>${escapeHtml(student.name)} (${badge})</span>
                ${sTags}
              </div>
              <div class="t-day-std-right">
                <span class="pill-run">합산 🏃 ${norm.run}바퀴</span>
                <span class="pill-jump">합산 🪢 ${norm.jump.toLocaleString()}개</span>
                <button type="button" class="btn-table edit-day-std-btn" data-id="${student.id}" data-date="${dateStr}">✏️ 수정</button>
              </div>
            </div>
            ${detailStack}
          </div>
        `;
      })
      .join("");
  }

  if (absentees.length > 0) {
    html += `
      <div class="t-absent-box">
        <span class="t-absent-label">미참여 학생 ${absentees.length}명 (터치 시 대리 기록 입력)</span>
        <div class="t-absent-chips">
          ${absentees
            .map(
              (s) =>
                `<button type="button" class="t-absent-chip edit-day-std-btn" data-id="${s.id}" data-date="${dateStr}">➕ ${formatStudentCode(s)} ${escapeHtml(s.name)}</button>`
            )
            .join("")}
        </div>
      </div>
    `;
  }

  listEl.innerHTML = html;

  listEl.querySelectorAll(".edit-day-std-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentStudentId = btn.dataset.id;
      currentDateStr = btn.dataset.date;
      syncAllUI();
      switchTab("record");
      const s = store[currentStudentId];
      if (s) showToast(`✏️ ${formatStudentLabel(s)} 학생의 ${currentDateStr.slice(5)} 기록 화면으로 이동`);
    });
  });
}

function renderDailyAttendanceChart(allStudents) {
  const chartEl = document.getElementById("dailyAttendanceChart");
  const totalStudents = Math.max(1, allStudents.length);

  // 모바일 화면에서 한눈에 보이도록 최근 7일 표시
  const days = [];
  for (let d = 16; d <= 22; d++) {
    days.push(`2026-10-${String(d).padStart(2, "0")}`);
  }

  chartEl.innerHTML = days
    .map((dStr) => {
      let count = 0;
      allStudents.forEach((s) => {
        if (s.records && isParticipated(s.records[dStr])) count++;
      });
      const heightPct = Math.round((count / totalStudents) * 100);
      return `
        <div class="chart-col">
          <span class="chart-count">${count}명</span>
          <div class="chart-bar-wrap">
            <div class="chart-bar" style="height: ${heightPct}%"></div>
          </div>
          <span class="chart-date">${dStr.slice(5).replace("-", "/")}</span>
        </div>
      `;
    })
    .join("");
}

function exportClassStatsToCSV() {
  const headers = [
    "학번",
    "학년",
    "반",
    "번호",
    "이름",
    `${currentCalMonth}월_참여일수`,
    "목표달성(완주)일수",
    "연속참여일(스트릭)",
    "누적_달리기(바퀴)",
    "누적_줄넘기(개)",
    "최근_참여일"
  ];

  const rows = Object.values(store).map((s) => {
    const st = computeStudentStats(s.id, currentCalYear, currentCalMonth);
    return [
      formatStudentCode(s),
      s.grade,
      s.classNum,
      s.studentNum,
      `"${s.name.replace(/"/g, '""')}"`,
      st.monthDays,
      st.goalDays,
      st.streak,
      st.totalRun,
      st.totalJump,
      st.lastDate
    ].join(",");
  });

  const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `건강체력교실_학급통계_${currentCalYear}년${currentCalMonth}월.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  showToast("📥 엑셀(CSV) 파일 다운로드 완료!");
}

// ============================================================================
// Firebase Realtime Database (실시간 데이터베이스) 연동
// ============================================================================
function normalizeRtdbConfig(rawCfg) {
  if (!rawCfg) return null;
  let databaseURL = (rawCfg.databaseURL || "").trim().replace(/\/+$/, "");
  let projectId = (rawCfg.projectId || "").trim();
  let apiKey = (rawCfg.apiKey || "").trim();

  // 예시(placeholder) 텍스트 필터링
  if (
    databaseURL.includes("여기에-복사한") ||
    databaseURL.includes("프로젝트ID") ||
    databaseURL === "https://"
  ) {
    databaseURL = "";
  }
  if (projectId === "프로젝트ID" || projectId === "project-id") {
    projectId = "";
  }
  if (apiKey === "AIzaSy..." || apiKey === "AIza...") {
    apiKey = "";
  }

  if (!projectId && databaseURL) {
    const m = databaseURL.match(/https?:\/\/([a-zA-Z0-9-]+?)(?:-default-rtdb)?\./);
    if (m) projectId = m[1];
  }
  if (!databaseURL && projectId) {
    databaseURL = `https://${projectId}-default-rtdb.firebaseio.com`;
  }
  if (!databaseURL) return null;

  const authDomain =
    (rawCfg.authDomain && !rawCfg.authDomain.includes("프로젝트ID") ? rawCfg.authDomain.trim() : "") ||
    (projectId ? `${projectId}.firebaseapp.com` : "");
  const appId = (rawCfg.appId || "").trim();

  return { apiKey, authDomain, databaseURL, projectId: projectId || "rtdb-project", appId };
}

function loadSavedFirebaseConfig() {
  // 1순위: 학생이 공유 링크(?db=...)로 접속한 경우 주소창 파라미터에서 즉시 읽어 기기에 저장
  try {
    const params = new URLSearchParams(window.location.search);
    const urlDb = params.get("db") || params.get("databaseURL");
    const urlPid = params.get("pid") || params.get("projectId");
    const urlKey = params.get("key") || params.get("apiKey");
    if (urlDb || urlPid) {
      const fromUrl = normalizeRtdbConfig({
        databaseURL: urlDb || "",
        projectId: urlPid || "",
        apiKey: urlKey || ""
      });
      if (fromUrl) {
        localStorage.setItem(FB_CONFIG_STORAGE_KEY, JSON.stringify(fromUrl));
        return fromUrl;
      }
    }
  } catch (e) {}

  // 2순위: 브라우저 localStorage에 저장된 설정
  try {
    const raw = localStorage.getItem(FB_CONFIG_STORAGE_KEY);
    if (raw) {
      const parsed = normalizeRtdbConfig(JSON.parse(raw));
      if (parsed) return parsed;
    }
  } catch (e) {}

  // 3순위: firebase-config.js 파일에 직접 입력된 DEFAULT_FIREBASE_CONFIG
  return normalizeRtdbConfig(DEFAULT_FIREBASE_CONFIG);
}

function initFirebaseModal() {
  const modal = document.getElementById("firebaseModal");
  const openBtn = document.getElementById("firebaseModalBtn");
  const closeBtn = document.getElementById("closeFirebaseModalBtn");
  const jsonInput = document.getElementById("fbJsonInput");
  const dbUrlInput = document.getElementById("fbDatabaseUrl");

  openBtn.addEventListener("click", () => {
    const saved = loadSavedFirebaseConfig();
    if (saved) {
      if (dbUrlInput) dbUrlInput.value = saved.databaseURL || "";
      document.getElementById("fbApiKey").value = saved.apiKey || "";
      document.getElementById("fbProjectId").value = saved.projectId || "";
      document.getElementById("fbAuthDomain").value = saved.authDomain || "";
      document.getElementById("fbAppId").value = saved.appId || "";
    }
    modal.hidden = false;
    modal.style.display = "flex";
  });

  const closeFb = () => {
    modal.hidden = true;
    modal.style.display = "none";
  };

  closeBtn.addEventListener("click", closeFb);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeFb();
  });

  jsonInput.addEventListener("input", () => {
    const raw = jsonInput.value.trim();
    if (!raw) return;

    // URL만 단독으로 붙여넣은 경우
    if (/^https?:\/\/[^\s"']+$/.test(raw)) {
      if (dbUrlInput) dbUrlInput.value = raw.replace(/\/+$/, "");
      const m = raw.match(/https?:\/\/([a-zA-Z0-9-]+?)(?:-default-rtdb)?\./);
      if (m && !document.getElementById("fbProjectId").value) {
        document.getElementById("fbProjectId").value = m[1];
      }
      return;
    }

    const extract = (key) => {
      const m = raw.match(new RegExp(`${key}\\s*:\\s*["']([^"']+)["']`));
      return m ? m[1] : "";
    };

    try {
      const cleaned = raw.replace(/^[^{]*=/, "").replace(/;?\s*$/, "");
      const obj = JSON.parse(cleaned);
      if (obj.databaseURL && dbUrlInput) dbUrlInput.value = obj.databaseURL;
      if (obj.apiKey) document.getElementById("fbApiKey").value = obj.apiKey;
      if (obj.projectId) document.getElementById("fbProjectId").value = obj.projectId;
      if (obj.authDomain) document.getElementById("fbAuthDomain").value = obj.authDomain;
      if (obj.appId) document.getElementById("fbAppId").value = obj.appId;
    } catch (e) {
      if (extract("databaseURL") && dbUrlInput) dbUrlInput.value = extract("databaseURL");
      if (extract("apiKey")) document.getElementById("fbApiKey").value = extract("apiKey");
      if (extract("projectId")) document.getElementById("fbProjectId").value = extract("projectId");
      if (extract("authDomain")) document.getElementById("fbAuthDomain").value = extract("authDomain");
      if (extract("appId")) document.getElementById("fbAppId").value = extract("appId");
    }

    if (dbUrlInput && !dbUrlInput.value && document.getElementById("fbProjectId").value) {
      dbUrlInput.value = `https://${document.getElementById("fbProjectId").value.trim()}-default-rtdb.firebaseio.com`;
    }
  });

  document.getElementById("firebaseConfigForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const databaseURL = dbUrlInput ? dbUrlInput.value.trim() : "";
    const apiKey = document.getElementById("fbApiKey").value.trim();
    const projectId = document.getElementById("fbProjectId").value.trim();
    const authDomain = document.getElementById("fbAuthDomain").value.trim();
    const appId = document.getElementById("fbAppId").value.trim();

    const normalized = normalizeRtdbConfig({ apiKey, projectId, databaseURL, authDomain, appId });
    if (!normalized) {
      showToast("Realtime Database 주소(databaseURL) 또는 projectId를 입력해 주세요.");
      return;
    }

    await connectToFirebase(normalized, false);
  });

  const copyShareBtn = document.getElementById("copyStudentShareUrlBtn");
  if (copyShareBtn) {
    copyShareBtn.addEventListener("click", async () => {
      const saved = loadSavedFirebaseConfig();
      if (!saved || !saved.databaseURL) {
        showToast("먼저 실시간 DB 연결을 완료해 주세요.");
        return;
      }
      const shareUrl = new URL(window.location.href);
      shareUrl.searchParams.set("db", saved.databaseURL);
      if (saved.projectId) shareUrl.searchParams.set("pid", saved.projectId);
      if (saved.apiKey) shareUrl.searchParams.set("key", saved.apiKey);

      try {
        await navigator.clipboard.writeText(shareUrl.toString());
        showToast("📲 학생 휴대폰 자동연동 링크가 복사되었습니다! 카톡이나 QR로 공유하세요.");
      } catch (e) {
        window.prompt("아래 주소를 복사하여 학생들에게 공유하세요:", shareUrl.toString());
      }
    });
  }

  document.getElementById("seedToCloudBtn").addEventListener("click", async () => {
    if (!fbState.connected) return;
    await uploadAllLocalDataToFirestore();
    showToast("📤 현재 데이터를 Realtime DB에 업로드했습니다!");
  });

  document.getElementById("disconnectFirebaseBtn").addEventListener("click", () => {
    disconnectFirebase();
    showToast("로컬 모드로 전환되었습니다.");
  });
}

async function connectToFirebase(rawConfig, isSilent = false) {
  const statusBox = document.getElementById("fbConnectionDetail");
  const config = normalizeRtdbConfig(rawConfig);
  if (!config) return;

  try {
    statusBox.textContent = "⏳ Firebase Realtime Database 연결 중...";

    const [appMod, dbMod] = await Promise.all([
      import("https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js")
    ]);

    const app = appMod.initializeApp(config, "fitnessRtdbApp_" + Date.now());
    let uid = "rtdb_user";

    // apiKey가 있고 익명 로그인이 켜져 있으면 로그인 시도 (꺼져 있어도 테스트 모드에서 정상 작동)
    if (config.apiKey) {
      try {
        const authMod = await import("https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js");
        const auth = authMod.getAuth(app);
        const cred = await authMod.signInAnonymously(auth);
        uid = cred.user.uid;
      } catch (authErr) {
        // 익명 로그인이 비활성화된 경우에도 Realtime DB 테스트 모드로 계속 진행
      }
    }

    const db = dbMod.getDatabase(app, config.databaseURL);

    if (fbState.unsubStudents) fbState.unsubStudents();

    fbState = {
      connected: true,
      app,
      auth: null,
      db,
      sdk: { ...appMod, ...dbMod },
      uid,
      unsubStudents: null,
      unsubRecordsMap: {}
    };

    localStorage.setItem(FB_CONFIG_STORAGE_KEY, JSON.stringify(config));
    updateCloudBadgeUI(true, config.projectId);
    startRealtimeListeners();

    statusBox.textContent = `✅ 실시간 DB 연결됨 (${config.databaseURL})`;
    const shareBtn = document.getElementById("copyStudentShareUrlBtn");
    if (shareBtn) shareBtn.hidden = false;
    document.getElementById("seedToCloudBtn").hidden = false;
    document.getElementById("disconnectFirebaseBtn").hidden = false;

    if (!isSilent) showToast(`☁️ 실시간 데이터베이스 연결 완료!`);
  } catch (err) {
    statusBox.textContent = `❌ 연결 실패: databaseURL 주소와 데이터베이스 규칙(테스트 모드)을 확인하세요.`;
    updateCloudBadgeUI(false);
    if (!isSilent) showToast("Realtime DB 연결 실패");
  }
}

function disconnectFirebase() {
  if (fbState.unsubStudents) fbState.unsubStudents();
  fbState = {
    connected: false,
    app: null,
    auth: null,
    db: null,
    sdk: null,
    uid: null,
    unsubStudents: null,
    unsubRecordsMap: {}
  };
  localStorage.removeItem(FB_CONFIG_STORAGE_KEY);
  updateCloudBadgeUI(false);
  document.getElementById("fbConnectionDetail").textContent = "현재: 로컬 저장소 모드로 동작 중";
  const shareBtn = document.getElementById("copyStudentShareUrlBtn");
  if (shareBtn) shareBtn.hidden = true;
  document.getElementById("seedToCloudBtn").hidden = true;
  document.getElementById("disconnectFirebaseBtn").hidden = true;
}

function updateCloudBadgeUI(isOnline, projectId = "") {
  const btn = document.getElementById("firebaseModalBtn");
  const textEl = document.getElementById("cloudStatusText");
  if (isOnline) {
    btn.className = "cloud-mini-btn online";
    textEl.textContent = `실시간 DB 연동중 (${projectId})`;
  } else {
    btn.className = "cloud-mini-btn offline";
    textEl.textContent = "로컬 모드 · 서버설정";
  }
}

function startRealtimeListeners() {
  if (!fbState.connected) return;
  const { ref, onValue } = fbState.sdk;
  const studentsRef = ref(fbState.db, "fitnessClassroom/students");
  const goalsRef = ref(fbState.db, "fitnessClassroom/goals");

  onValue(goalsRef, (snapshot) => {
    const gVal = snapshot.val();
    if (gVal) {
      goals = {
        weeklyDays: Number(gVal.weeklyDays || goals.weeklyDays),
        weeklyRun: Number(gVal.weeklyRun || goals.weeklyRun),
        weeklyJump: Number(gVal.weeklyJump || goals.weeklyJump),
        run: Number(gVal.run || goals.run),
        jump: Number(gVal.jump || goals.jump)
      };
      saveGoals();
      updateGoalTexts();
      syncAllUI();
    }
  });

  fbState.unsubStudents = onValue(
    studentsRef,
    async (snapshot) => {
      const val = snapshot.val();
      if (!val) {
        // 서버가 비어 있으면 현재 로컬 데이터를 최초 1회 자동 업로드
        await uploadAllLocalDataToFirestore();
        return;
      }

      const nextStore = {};
      Object.entries(val).forEach(([sId, data]) => {
        nextStore[sId] = {
          id: sId,
          grade: Number(data.grade || 1),
          classNum: Number(data.classNum || 1),
          studentNum: Number(data.studentNum || 1),
          name: data.name || "이름없음",
          records: data.records || {}
        };
      });

      store = nextStore;
      if (!store[currentStudentId]) {
        currentStudentId = Object.keys(store)[0] || "student1";
      }
      saveStore();
      syncAllUI();
    },
    (err) => {
      const statusBox = document.getElementById("fbConnectionDetail");
      if (statusBox) {
        statusBox.textContent = `⚠️ 권한 오류: Firebase 콘솔 -> Realtime Database -> [규칙] 탭에서 read/write를 true로 설정해 주세요.`;
      }
    }
  );
}

async function syncStudentDocToFirestore(studentId, studentObj) {
  if (!fbState.connected) return;
  const { ref, update } = fbState.sdk;
  await update(ref(fbState.db, `fitnessClassroom/students/${studentId}`), {
    id: studentId,
    name: String(studentObj.name).slice(0, 40),
    grade: Number(studentObj.grade),
    classNum: Number(studentObj.classNum),
    studentNum: Number(studentObj.studentNum),
    updatedAt: Date.now()
  });
}

async function syncRecordToFirestore(studentId, dateStr, rec) {
  if (!fbState.connected) return;
  const { ref, set } = fbState.sdk;
  if (store[studentId]) {
    await syncStudentDocToFirestore(studentId, store[studentId]);
  }
  const norm = normalizeDayRecord(rec);
  await set(ref(fbState.db, `fitnessClassroom/students/${studentId}/records/${dateStr}`), {
    morning: norm.morning,
    lunch: norm.lunch,
    run: Number(norm.run),
    jump: Math.round(Number(norm.jump)),
    mood: String(norm.mood || "😄 상쾌해요").slice(0, 30),
    note: String(norm.note || "").slice(0, 100),
    updatedBy: fbState.uid,
    updatedAt: Date.now()
  });
}

async function deleteRecordFromFirestore(studentId, dateStr) {
  if (!fbState.connected) return;
  const { ref, remove } = fbState.sdk;
  await remove(ref(fbState.db, `fitnessClassroom/students/${studentId}/records/${dateStr}`));
}

async function deleteStudentFromFirestore(studentId) {
  if (!fbState.connected) return;
  const { ref, remove } = fbState.sdk;
  await remove(ref(fbState.db, `fitnessClassroom/students/${studentId}`));
}

async function uploadAllLocalDataToFirestore() {
  if (!fbState.connected) return;
  const { ref, set } = fbState.sdk;
  await set(ref(fbState.db, "fitnessClassroom/students"), store);
}

function syncAllUI() {
  renderStudentSelectOptions();
  updateAuthHeaderUI();
  loadDateIntoForm(currentDateStr);
  renderSummaryStats();
  renderRecentList();
  renderCalendar();
  renderSelectedDayDetail(currentDateStr);
  renderCalorieTab();
  renderTeacherDashboard();
}

// ============================================================================
// [탭 4] 🍔 음식 평균 열량 & 소모 운동량 계산기
// ============================================================================
const FOOD_CALORIE_DB = [
  { name: "떡볶이", icon: "🌶️", unit: "1인분", kcal: 500, popular: true, keywords: ["떡볶이", "엽떡", "로제떡볶이", "국물떡볶이"] },
  { name: "라면", icon: "🍜", unit: "1봉지", kcal: 500, popular: true, keywords: ["라면", "신라면", "진라면", "짜파게티", "불닭볶음면", "불닭"] },
  { name: "컵라면 (소컵)", icon: "🥡", unit: "1개", kcal: 300, popular: false, keywords: ["컵라면", "소컵", "육개장"] },
  { name: "치킨 (후라이드 2조각)", icon: "🍗", unit: "2조각", kcal: 460, popular: true, keywords: ["치킨", "후라이드", "통닭", "순살치킨"] },
  { name: "양념치킨 (2조각)", icon: "🍗", unit: "2조각", kcal: 540, popular: false, keywords: ["양념치킨", "뿌링클", "간장치킨"] },
  { name: "햄버거 (단품)", icon: "🍔", unit: "1개", kcal: 520, popular: true, keywords: ["햄버거", "버거", "불고기버거", "싸이버거", "새우버거", "치즈버거"] },
  { name: "햄버거 세트", icon: "🍔", unit: "1세트", kcal: 920, popular: false, keywords: ["햄버거세트", "버거세트"] },
  { name: "피자 (1조각)", icon: "🍕", unit: "1조각", kcal: 300, popular: true, keywords: ["피자", "페퍼로니피자", "콤비네이션피자", "치즈피자", "고구마피자"] },
  { name: "마라탕", icon: "🍲", unit: "1인분", kcal: 650, popular: true, keywords: ["마라탕", "마라샹궈"] },
  { name: "삼각김밥", icon: "🍙", unit: "1개", kcal: 200, popular: true, keywords: ["삼각김밥", "주먹밥"] },
  { name: "김밥", icon: "🍙", unit: "1줄", kcal: 450, popular: true, keywords: ["김밥", "참치김밥", "치즈김밥"] },
  { name: "핫도그", icon: "🌭", unit: "1개", kcal: 280, popular: true, keywords: ["핫도그", "명랑핫도그", "콘도그"] },
  { name: "탕후루", icon: "🍡", unit: "1꼬치", kcal: 200, popular: true, keywords: ["탕후루", "과일탕후루"] },
  { name: "버블티 (타로/흑당)", icon: "🧋", unit: "1잔", kcal: 350, popular: true, keywords: ["버블티", "밀크티", "공차", "흑당버블티", "타로밀크티"] },
  { name: "감자튀김", icon: "🍟", unit: "1개", kcal: 330, popular: false, keywords: ["감자튀김", "포테이토"] },
  { name: "순대", icon: "🍽️", unit: "1인분", kcal: 400, popular: false, keywords: ["순대"] },
  { name: "튀김 (3개)", icon: "🍤", unit: "3개", kcal: 300, popular: false, keywords: ["튀김", "김말이", "오징어튀김", "고구마튀김"] },
  { name: "어묵 (1꼬치)", icon: "🍢", unit: "1꼬치", kcal: 70, popular: false, keywords: ["어묵", "오뎅"] },
  { name: "토스트", icon: "🥪", unit: "1개", kcal: 350, popular: false, keywords: ["토스트", "이삭토스트"] },
  { name: "샌드위치", icon: "🥪", unit: "1개", kcal: 320, popular: false, keywords: ["샌드위치"] },
  { name: "짜장면", icon: "🍜", unit: "1그릇", kcal: 700, popular: false, keywords: ["짜장면", "자장면", "간짜장"] },
  { name: "짬뽕", icon: "🍜", unit: "1그릇", kcal: 680, popular: false, keywords: ["짬뽕"] },
  { name: "탕수육 (1인분)", icon: "🍖", unit: "1인분", kcal: 600, popular: false, keywords: ["탕수육", "꿔바로우"] },
  { name: "돈까스", icon: "🍱", unit: "1인분", kcal: 750, popular: false, keywords: ["돈까스", "돈가스", "치즈돈까스"] },
  { name: "삼겹살 (1인분)", icon: "🥩", unit: "1인분(200g)", kcal: 660, popular: false, keywords: ["삼겹살", "목살", "고기"] },
  { name: "떡갈비/함박스테이크", icon: "🥩", unit: "1인분", kcal: 450, popular: false, keywords: ["떡갈비", "함박스테이크", "스테이크"] },
  { name: "공기밥 (쌀밥)", icon: "🍚", unit: "1공기", kcal: 300, popular: false, keywords: ["공기밥", "밥", "쌀밥", "잡곡밥"] },
  { name: "볶음밥 / 김치볶음밥", icon: "🍛", unit: "1그릇", kcal: 580, popular: false, keywords: ["볶음밥", "김치볶음밥", "새우볶음밥"] },
  { name: "비빔밥", icon: "🥗", unit: "1그릇", kcal: 550, popular: false, keywords: ["비빔밥", "돌솥비빔밥"] },
  { name: "카레라이스", icon: "🍛", unit: "1그릇", kcal: 580, popular: false, keywords: ["카레", "카레라이스"] },
  { name: "제육덮밥", icon: "🍛", unit: "1그릇", kcal: 680, popular: false, keywords: ["제육덮밥", "제육볶음"] },
  { name: "만두 (고기/김치 6개)", icon: "🥟", unit: "1인분(6개)", kcal: 360, popular: false, keywords: ["만두", "군만두", "찐만두"] },
  { name: "감자칩 / 과자", icon: "🥔", unit: "1봉지", kcal: 340, popular: false, keywords: ["감자칩", "포카칩", "과자", "새우깡", "스낵"] },
  { name: "초코파이 / 초코과자", icon: "🍪", unit: "1개", kcal: 170, popular: false, keywords: ["초코파이", "쿠키", "초코송이", "빼빼로"] },
  { name: "초콜릿", icon: "🍫", unit: "1개", kcal: 220, popular: false, keywords: ["초콜릿", "가나초콜릿", "초코바"] },
  { name: "아이스크림", icon: "🍦", unit: "1개", kcal: 220, popular: true, keywords: ["아이스크림", "메로나", "월드콘", "붕어싸만코", "구슬아이스크림"] },
  { name: "붕어빵 (2개)", icon: "🐟", unit: "2개", kcal: 240, popular: false, keywords: ["붕어빵", "잉어빵"] },
  { name: "호떡 / 와플", icon: "🧇", unit: "1개", kcal: 280, popular: false, keywords: ["호떡", "와플", "크로플"] },
  { name: "도넛 / 빵", icon: "🍩", unit: "1개", kcal: 260, popular: false, keywords: ["도넛", "빵", "소보로빵", "단팥빵", "포켓몬빵"] },
  { name: "조각케이크", icon: "🍰", unit: "1조각", kcal: 380, popular: false, keywords: ["케이크", "초코케이크", "치즈케이크"] },
  { name: "콜라 / 사이다", icon: "🥤", unit: "1캔(250ml)", kcal: 110, popular: true, keywords: ["콜라", "사이다", "탄산음료", "환타"] },
  { name: "초코우유 / 바나나우유", icon: "🥛", unit: "1팩", kcal: 195, popular: false, keywords: ["초코우유", "바나나우유", "딸기우유"] },
  { name: "흰우유", icon: "🥛", unit: "1팩(200ml)", kcal: 130, popular: false, keywords: ["우유", "흰우유"] },
  { name: "삶은 계란", icon: "🥚", unit: "1개", kcal: 80, popular: false, keywords: ["계란", "달걀", "구운계란"] },
  { name: "바나나", icon: "🍌", unit: "1개", kcal: 100, popular: false, keywords: ["바나나"] },
  { name: "사과", icon: "🍎", unit: "1개", kcal: 120, popular: false, keywords: ["사과", "과일"] }
];

let eatenFoods = [
  { name: "떡볶이", icon: "🌶️", portion: 1, unit: "1인분", kcal: 500 }
];

function findFoodItemByQuery(query) {
  const q = query.trim().toLowerCase();
  if (!q) return null;

  // 1. 정확히 일치하는 이름 또는 키워드
  let found = FOOD_CALORIE_DB.find(
    (item) => item.name.toLowerCase() === q || item.keywords.some((k) => k.toLowerCase() === q)
  );
  if (found) return found;

  // 2. 부분 일치 검색
  found = FOOD_CALORIE_DB.find(
    (item) =>
      item.name.toLowerCase().includes(q) ||
      q.includes(item.name.split(" ")[0].toLowerCase()) ||
      item.keywords.some((k) => q.includes(k.toLowerCase()) || k.toLowerCase().includes(q))
  );
  return found || null;
}

function initCalorieCalculator() {
  const dataList = document.getElementById("foodDataList");
  const chipsContainer = document.getElementById("popularFoodChips");
  const searchForm = document.getElementById("foodSearchForm");
  const searchInput = document.getElementById("foodSearchInput");
  const portionSelect = document.getElementById("foodPortionSelect");
  const clearBtn = document.getElementById("clearFoodListBtn");
  const customKcalInput = document.getElementById("customKcalInput");
  const goRecordBtn = document.getElementById("goRecordFromCalorieBtn");

  if (!searchForm) return;

  if (dataList) {
    dataList.innerHTML = FOOD_CALORIE_DB.map(
      (f) => `<option value="${escapeHtml(f.name)}">${f.icon} ${escapeHtml(f.name)} (${f.unit} 평균 ${f.kcal}kcal)</option>`
    ).join("");
  }

  if (chipsContainer) {
    const popularItems = FOOD_CALORIE_DB.filter((f) => f.popular);
    chipsContainer.innerHTML = popularItems
      .map(
        (f) =>
          `<button type="button" class="food-chip" data-name="${escapeHtml(f.name)}">${f.icon} ${escapeHtml(f.name)} <small>${f.kcal}</small></button>`
      )
      .join("");

    chipsContainer.querySelectorAll(".food-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        const foodObj = findFoodItemByQuery(chip.dataset.name);
        if (foodObj) {
          addFoodToBasket(foodObj, 1);
        }
      });
    });
  }

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const rawName = searchInput.value.trim();
    const portion = Number(portionSelect.value || 1);
    if (!rawName) {
      showToast("먹은 음식 이름을 입력해 주세요! (예: 떡볶이, 치킨)");
      searchInput.focus();
      return;
    }

    const matched = findFoodItemByQuery(rawName);
    if (matched) {
      addFoodToBasket(matched, portion);
      searchInput.value = "";
    } else {
      // 사전에 없는 음식은 보편적 1인분 간식/식사 평균(350kcal)으로 추가하고 안내
      const customItem = {
        name: rawName,
        icon: "🍽️",
        unit: "1인분",
        kcal: 350
      };
      addFoodToBasket(customItem, portion);
      searchInput.value = "";
      showToast(`🍽️ '${rawName}' 평균 추정치(${Math.round(350 * portion)}kcal)로 추가됨! 직접 열량 수정도 가능해요.`);
    }
  });

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      eatenFoods = [];
      if (customKcalInput) customKcalInput.value = 0;
      renderCalorieTab();
      showToast("선택한 음식 목록을 비웠습니다.");
    });
  }

  if (customKcalInput) {
    customKcalInput.addEventListener("input", () => {
      const manualKcal = Math.max(0, Number(customKcalInput.value || 0));
      renderCalorieCalculations(manualKcal, "직접 입력한 열량");
    });
  }

  if (goRecordBtn) {
    goRecordBtn.addEventListener("click", () => {
      switchTab("record");
      showToast("✍️ 오늘 운동 기록 화면으로 이동했습니다!");
    });
  }
}

function addFoodToBasket(foodObj, portion = 1) {
  const calcKcal = Math.round(foodObj.kcal * portion);
  eatenFoods.push({
    name: foodObj.name,
    icon: foodObj.icon || "🍽️",
    portion,
    unit: foodObj.unit || "1인분",
    kcal: calcKcal
  });
  renderCalorieTab();
  showToast(`${foodObj.icon} ${foodObj.name} (${calcKcal}kcal) 추가!`);
}

function renderCalorieTab() {
  const listEl = document.getElementById("eatenFoodList");
  const customKcalInput = document.getElementById("customKcalInput");
  if (!listEl) return;

  if (eatenFoods.length === 0) {
    listEl.innerHTML = `<li style="padding:10px; text-align:center; color:var(--text-muted); font-size:0.8rem; background:var(--surface-soft); border-radius:10px;">위에서 먹은 음식을 검색하거나 인기 음식 버튼을 눌러 추가해 보세요!</li>`;
    const fallbackKcal = Number(customKcalInput?.value || 0);
    renderCalorieCalculations(fallbackKcal, "선택된 음식 없음");
    return;
  }

  let totalKcal = 0;
  listEl.innerHTML = eatenFoods
    .map((item, idx) => {
      totalKcal += item.kcal;
      const portionText = item.portion === 1 ? item.unit : `${item.portion}인분(개)`;
      return `
        <li class="eaten-food-item" data-idx="${idx}" title="클릭하여 삭제">
          <span>${item.icon} ${escapeHtml(item.name)} <small style="color:var(--text-muted)">(${escapeHtml(portionText)})</small></span>
          <div style="display:flex; align-items:center; gap:6px;">
            <span class="eaten-kcal-badge">${item.kcal.toLocaleString()} kcal</span>
            <small style="color:var(--text-muted)">✕</small>
          </div>
        </li>
      `;
    })
    .join("");

  listEl.querySelectorAll(".eaten-food-item").forEach((li) => {
    li.addEventListener("click", () => {
      const idx = Number(li.dataset.idx);
      eatenFoods.splice(idx, 1);
      renderCalorieTab();
    });
  });

  if (customKcalInput) {
    customKcalInput.value = totalKcal;
  }

  const summaryTitle =
    eatenFoods.length === 1
      ? `${eatenFoods[0].icon} ${eatenFoods[0].name} 평균 열량`
      : `🍽️ 선택한 음식 ${eatenFoods.length}종 총 평균 열량`;

  renderCalorieCalculations(totalKcal, summaryTitle);
}

function renderCalorieCalculations(totalKcal, summaryTitle) {
  const titleEl = document.getElementById("selectedFoodSummaryTitle");
  const totalEl = document.getElementById("totalFoodKcal");
  const runLapsEl = document.getElementById("burnRunLaps");
  const runMinsEl = document.getElementById("burnRunMins");
  const jumpCountEl = document.getElementById("burnJumpCount");
  const jumpMinsEl = document.getElementById("burnJumpMins");
  const walkMinsEl = document.getElementById("burnWalkMins");
  const sportMinsEl = document.getElementById("burnSportMins");
  const stairMinsEl = document.getElementById("burnStairMins");

  const todaySummaryEl = document.getElementById("todayWorkoutSummaryText");
  const todayBurnedEl = document.getElementById("todayBurnedKcal");
  const burnBarEl = document.getElementById("calorieBurnProgressBar");
  const remainTextEl = document.getElementById("calorieRemainText");

  if (!totalEl) return;

  if (titleEl) titleEl.textContent = summaryTitle;
  totalEl.textContent = `${totalKcal.toLocaleString()} kcal`;

  // 중학생 평균 체중(약 52kg) 기준 운동별 소모 칼로리 환산
  // 1) 운동장 트랙 달리기 1바퀴(200m) ≈ 15 kcal (분당 약 9 kcal)
  const neededLaps = totalKcal > 0 ? (totalKcal / 15).toFixed(1).replace(/\.0$/, "") : "0";
  const neededRunMins = Math.round(totalKcal / 9);

  // 2) 줄넘기 100개 ≈ 12 kcal (분당 약 110개 = 13.2 kcal)
  const neededJumps = Math.round((totalKcal / 12) * 10) * 10;
  const neededJumpMins = Math.round(totalKcal / 13);

  // 3) 빠르게 걷기 (분당 4.5 kcal), 축구·농구 (분당 8 kcal), 계단 오르기 (분당 7 kcal)
  const walkMins = Math.round(totalKcal / 4.5);
  const sportMins = Math.round(totalKcal / 8);
  const stairMins = Math.round(totalKcal / 7);

  if (runLapsEl) runLapsEl.textContent = `${neededLaps}바퀴`;
  if (runMinsEl) runMinsEl.textContent = `약 ${neededRunMins}분 달리기`;
  if (jumpCountEl) jumpCountEl.textContent = `${neededJumps.toLocaleString()}개`;
  if (jumpMinsEl) jumpMinsEl.textContent = `약 ${neededJumpMins}분 줄넘기`;
  if (walkMinsEl) walkMinsEl.textContent = `약 ${walkMins}분`;
  if (sportMinsEl) sportMinsEl.textContent = `약 ${sportMins}분`;
  if (stairMinsEl) stairMinsEl.textContent = `약 ${stairMins}분`;

  // 오늘 현재 로그인 학생이 기록한 운동량으로 소모한 칼로리 계산
  const records = getStudentRecords(currentStudentId);
  const todayRec = records[currentDateStr] || { run: 0, jump: 0 };
  const todayRun = Number(todayRec.run || 0);
  const todayJump = Number(todayRec.jump || 0);
  const burnedToday = Math.round(todayRun * 15 + (todayJump / 100) * 12);

  if (todaySummaryEl) {
    todaySummaryEl.textContent = `${currentDateStr.slice(5)} 달리기 ${todayRun}바퀴·줄넘기 ${todayJump.toLocaleString()}개`;
  }
  if (todayBurnedEl) {
    todayBurnedEl.textContent = `${burnedToday.toLocaleString()} kcal 소모`;
  }

  const burnPct = totalKcal > 0 ? Math.min(100, Math.round((burnedToday / totalKcal) * 100)) : 0;
  if (burnBarEl) burnBarEl.style.width = `${burnPct}%`;

  if (remainTextEl) {
    const remainKcal = Math.max(0, totalKcal - burnedToday);
    if (totalKcal === 0) {
      remainTextEl.textContent = "음식을 선택하면 소모에 필요한 달리기·줄넘기 운동량을 알려드려요!";
    } else if (remainKcal === 0) {
      remainTextEl.textContent = "🎉 대단해요! 오늘 한 운동으로 먹은 음식 칼로리를 100% 모두 태웠어요!";
    } else {
      const remLaps = (remainKcal / 15).toFixed(1).replace(/\.0$/, "");
      const remJumps = (Math.round((remainKcal / 12) * 10) * 10).toLocaleString();
      remainTextEl.textContent = `🔥 남은 ${remainKcal.toLocaleString()} kcal를 더 태우려면 달리기 ${remLaps}바퀴 또는 줄넘기 ${remJumps}개가 필요해요!`;
    }
  }
}

let toastTimer = null;
function showToast(msg) {
  const toastEl = document.getElementById("toast");
  toastEl.textContent = msg;
  toastEl.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastEl.hidden = true;
  }, 2200);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
