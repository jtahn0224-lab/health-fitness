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
    grade: 2,
    classNum: 3,
    studentNum: 7,
    name: "김민준",
    records: {
      "2026-10-02": { run: 3, jump: 200, mood: "💦 숨차지만 완주!", note: "체력교실 첫날 완주!" },
      "2026-10-05": { run: 5, jump: 300, mood: "😄 상쾌해요", note: "목표 첫 100% 달성!" },
      "2026-10-07": { run: 4, jump: 250, mood: "💪 뿌듯해요", note: "점심시간 줄넘기 연습" },
      "2026-10-08": { run: 5, jump: 350, mood: "😄 상쾌해요", note: "2단 뛰기 10개 성공" },
      "2026-10-12": { run: 6, jump: 300, mood: "💪 뿌듯해요", note: "달리기 6바퀴 신기록!" },
      "2026-10-14": { run: 3, jump: 150, mood: "💦 숨차지만 완주!", note: "조금 피곤했지만 출석" },
      "2026-10-15": { run: 5, jump: 400, mood: "😄 상쾌해요", note: "줄넘기 400개 돌파!" },
      "2026-10-19": { run: 5, jump: 300, mood: "😄 상쾌해요", note: "월요일 아침 상쾌하게" },
      "2026-10-20": { run: 4, jump: 300, mood: "💪 뿌듯해요", note: "줄넘기 100개 연속 성공" },
      "2026-10-21": { run: 5, jump: 320, mood: "😄 상쾌해요", note: "3일 연속 참여 중!" },
      "2026-10-22": { run: 5, jump: 350, mood: "😄 상쾌해요", note: "오늘도 목표 완주!" }
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
      syncCodeFromFields();
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
  const tabs = ["record", "calendar", "teacher"];
  const mapBtn = {
    record: "tabBtnRecord",
    calendar: "tabBtnCalendar",
    teacher: "tabBtnTeacher"
  };
  const mapPanel = {
    record: "panelRecord",
    calendar: "panelCalendar",
    teacher: "panelTeacher"
  };

  tabs.forEach((t) => {
    const active = t === tabName;
    const btn = document.getElementById(mapBtn[t]);
    const panel = document.getElementById(mapPanel[t]);
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-selected", String(active));
    panel.hidden = !active;
  });

  if (tabName === "calendar") {
    renderCalendar();
    renderSelectedDayDetail(currentDateStr);
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
// [탭 1] 오늘 운동 기록하기
// ============================================================================
function initRecordForm() {
  const dateInput = document.getElementById("recordDate");
  const runInput = document.getElementById("runCount");
  const jumpInput = document.getElementById("jumpCount");

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

    if (runVal === 0 && jumpVal === 0) {
      showToast("달리기나 줄넘기를 1 이상 입력해 주세요!");
      return;
    }

    const recordObj = {
      run: runVal,
      jump: jumpVal,
      mood: currentMood,
      note: noteVal || "운동 참여 완료!"
    };

    if (!store[currentStudentId].records) {
      store[currentStudentId].records = {};
    }
    store[currentStudentId].records[currentDateStr] = recordObj;
    saveStore();
    syncAllUI();

    if (fbState.connected) {
      await syncRecordToFirestore(currentStudentId, currentDateStr, recordObj);
      showToast(`☁️ ${currentDateStr.slice(5)} 기록 클라우드 저장 완료!`);
    } else {
      showToast(`🎉 ${currentDateStr.slice(5)} 운동 기록 저장 완료!`);
    }
  });

  document.getElementById("deleteRecordBtn").addEventListener("click", async () => {
    const records = getStudentRecords();
    if (records[currentDateStr]) {
      delete records[currentDateStr];
      saveStore();
      syncAllUI();
      if (fbState.connected) {
        await deleteRecordFromFirestore(currentStudentId, currentDateStr);
      }
      showToast(`${currentDateStr.slice(5)} 기록이 삭제되었습니다.`);
    }
  });
}

function loadDateIntoForm(dateStr) {
  const records = getStudentRecords();
  const rec = records[dateStr];

  document.getElementById("recordDate").value = dateStr;
  document.getElementById("runCount").value = rec ? rec.run : 0;
  document.getElementById("jumpCount").value = rec ? rec.jump : 0;
  document.getElementById("recordNote").value = rec ? rec.note : "";

  currentMood = rec?.mood || "😄 상쾌해요";
  document.querySelectorAll(".mood-btn").forEach((b) =>
    b.classList.toggle("active", b.dataset.mood === currentMood)
  );

  const badge = document.getElementById("recordStatusBadge");
  const deleteBtn = document.getElementById("deleteRecordBtn");

  if (rec && isParticipated(rec)) {
    deleteBtn.hidden = false;
    if (isGoalMet(rec)) {
      badge.textContent = "⭐ 목표 달성";
      badge.className = "status-badge gold";
    } else {
      badge.textContent = "✅ 참여 완료";
      badge.className = "status-badge done";
    }
  } else {
    deleteBtn.hidden = true;
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
      const rec = records[dateStr];
      const stamp = isGoalMet(rec) ? "⭐" : "✅";
      return `
        <li class="recent-item" data-date="${dateStr}">
          <div>
            <div class="recent-date">${stamp} ${dateStr.slice(5)} <small>${escapeHtml(rec.mood || "")}</small></div>
            <div class="recent-note">${escapeHtml(rec.note || "")}</div>
          </div>
          <div class="recent-badges">
            <span class="pill-run">🏃 ${rec.run}</span>
            <span class="pill-jump">🪢 ${rec.jump}</span>
          </div>
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

    html += `
      <button type="button" class="${cellClasses}" data-date="${dateStr}">
        <div class="cal-cell-top">
          <span class="cal-day-num">${day}</span>
          <span class="cal-stamp">${stamp}</span>
        </div>
        ${
          participated
            ? `<div class="cal-mini-summary">
                <div>🏃${rec.run}</div>
                <div>🪢${rec.jump}</div>
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
  const rec = records[dateStr];
  const titleEl = document.getElementById("selectedDayTitle");
  const badgeEl = document.getElementById("selectedDayBadge");
  const bodyEl = document.getElementById("selectedDayContent");

  titleEl.textContent = `${dateStr} 기록 상세`;

  if (rec && isParticipated(rec)) {
    const goalMet = isGoalMet(rec);
    badgeEl.textContent = goalMet ? "⭐ 목표 달성" : "✅ 참여 완료";
    badgeEl.className = goalMet ? "status-badge gold" : "status-badge done";

    bodyEl.innerHTML = `
      <div class="detail-row">
        <span>🏃 달리기</span>
        <strong class="text-run">${rec.run} 바퀴 (목표 ${goals.run}바퀴)</strong>
      </div>
      <div class="detail-row">
        <span>🪢 줄넘기</span>
        <strong class="text-jump">${rec.jump} 개 (목표 ${goals.jump}개)</strong>
      </div>
      <div class="detail-row">
        <span>컨디션</span>
        <strong>${escapeHtml(rec.mood || "-")}</strong>
      </div>
      <div class="detail-note">💬 "${escapeHtml(rec.note || "메모 없음")}"</div>
    `;
  } else {
    badgeEl.textContent = "미참여";
    badgeEl.className = "status-badge";
    bodyEl.innerHTML = `<div style="color:var(--text-muted)">기록된 운동이 없습니다. 아래 버튼으로 기록해 보세요!</div>`;
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
                <button type="button" class="btn-table view-student-btn" data-id="${s.id}">📅 달력</button>
                <button type="button" class="btn-table del del-student-btn" data-id="${s.id}">삭제</button>
              </div>
            </div>
          </div>
        `;
      })
      .join("");
  }

  cardContainer.querySelectorAll(".view-student-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentStudentId = btn.dataset.id;
      syncAllUI();
      switchTab("calendar");
      showToast(`${formatStudentLabel(store[currentStudentId])} 달력으로 이동`);
    });
  });

  cardContainer.querySelectorAll(".del-student-btn").forEach((btn) => {
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
        const badge = goalMet ? "⭐" : "✅";
        return `
          <div class="t-day-std-item">
            <div class="t-day-std-info">
              <div class="t-day-std-title">
                <span class="student-code-tag">${formatStudentCode(student)}</span>
                <span>${badge} ${escapeHtml(student.name)}</span>
                <small style="color:var(--text-muted)">${escapeHtml(rec.mood || "")}</small>
              </div>
              <div class="t-day-std-note">💬 ${escapeHtml(rec.note || "메모 없음")}</div>
            </div>
            <div class="t-day-std-right">
              <span class="pill-run">🏃 ${rec.run}</span>
              <span class="pill-jump">🪢 ${rec.jump}</span>
              <button type="button" class="btn-table edit-day-std-btn" data-id="${student.id}" data-date="${dateStr}">수정</button>
            </div>
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
  const apiKey = (rawCfg.apiKey || "").trim();

  if (!projectId && databaseURL) {
    const m = databaseURL.match(/https?:\/\/([a-zA-Z0-9-]+?)(?:-default-rtdb)?\./);
    if (m) projectId = m[1];
  }
  if (!databaseURL && projectId) {
    databaseURL = `https://${projectId}-default-rtdb.firebaseio.com`;
  }
  if (!databaseURL) return null;

  const authDomain = (rawCfg.authDomain || "").trim() || (projectId ? `${projectId}.firebaseapp.com` : "");
  const appId = (rawCfg.appId || "").trim();

  return { apiKey, authDomain, databaseURL, projectId: projectId || "rtdb-project", appId };
}

function loadSavedFirebaseConfig() {
  try {
    const raw = localStorage.getItem(FB_CONFIG_STORAGE_KEY);
    if (raw) {
      const parsed = normalizeRtdbConfig(JSON.parse(raw));
      if (parsed) return parsed;
    }
  } catch (e) {}
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
  await set(ref(fbState.db, `fitnessClassroom/students/${studentId}/records/${dateStr}`), {
    run: Number(rec.run),
    jump: Math.round(Number(rec.jump)),
    mood: String(rec.mood || "😄 상쾌해요").slice(0, 30),
    note: String(rec.note || "").slice(0, 100),
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
  renderTeacherDashboard();
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
