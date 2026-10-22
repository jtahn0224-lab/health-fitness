// ============================================================================
// 중학교 건강체력교실 웹앱 (학생 기록 + 참여 달력 + 교사 통계·관리 + Firebase 연동)
// ============================================================================
import { DEFAULT_FIREBASE_CONFIG } from "./firebase-config.js";

const STORAGE_KEY = "middle_school_fitness_records_v2";
const FB_CONFIG_STORAGE_KEY = "middle_school_fitness_fb_config_v1";
const GOALS_STORAGE_KEY = "middle_school_fitness_goals_v1";
const TODAY_STR = "2026-10-22";

let goals = loadGoals();

// 5명의 중학생 예시 데이터 (1~3학년 다양한 참여 패턴 포함)
const INITIAL_DEMO_DATA = {
  student1: {
    id: "student1",
    grade: 2,
    classNum: 3,
    studentNum: 7,
    name: "김민준",
    records: {
      "2026-10-02": { run: 3, jump: 200, mood: "💦 숨차지만 완주!", note: "체력교실 첫날! 끝까지 걸어가지 않고 뛰었다." },
      "2026-10-05": { run: 5, jump: 300, mood: "😄 상쾌해요", note: "목표 첫 100% 달성!" },
      "2026-10-07": { run: 4, jump: 250, mood: "💪 뿌듯해요", note: "점심시간에 친구들이랑 줄넘기 연습" },
      "2026-10-08": { run: 5, jump: 350, mood: "😄 상쾌해요", note: "2단 뛰기 10개 성공" },
      "2026-10-12": { run: 6, jump: 300, mood: "💪 뿌듯해요", note: "달리기 6바퀴 신기록!" },
      "2026-10-14": { run: 3, jump: 150, mood: "💦 숨차지만 완주!", note: "조금 피곤했지만 출석 성공" },
      "2026-10-15": { run: 5, jump: 400, mood: "😄 상쾌해요", note: "줄넘기 400개 돌파!" },
      "2026-10-19": { run: 5, jump: 300, mood: "😄 상쾌해요", note: "월요일 아침 상쾌하게 시작" },
      "2026-10-20": { run: 4, jump: 300, mood: "💪 뿌듯해요", note: "줄넘기 안 걸리고 100개 연속 성공" },
      "2026-10-21": { run: 5, jump: 320, mood: "😄 상쾌해요", note: "3일 연속 참여 중!" },
      "2026-10-22": { run: 5, jump: 350, mood: "😄 상쾌해요", note: "오늘도 달리기랑 줄넘기 목표 완주!" }
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
      "2026-10-08": { run: 3, jump: 350, mood: "💪 뿌듯해요", note: "달리기 한 바퀴 더 늘렸다" },
      "2026-10-13": { run: 5, jump: 300, mood: "😄 상쾌해요", note: "드디어 5바퀴 완주 성공" },
      "2026-10-16": { run: 4, jump: 400, mood: "💪 뿌듯해요", note: "체육 선생님께 칭찬받음!" },
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
      "2026-10-07": { run: 2, jump: 150, mood: "💦 숨차지만 완주!", note: "오랜만에 뛰어서 숨이 찼다" },
      "2026-10-14": { run: 3, jump: 200, mood: "💪 뿌듯해요", note: "지난주보다 반 바퀴 더 뜀!" }
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

// Firebase 실시간 연동 상태 객체
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
  try {
    const raw = localStorage.getItem(GOALS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // ignore
  }
  return { run: 5, jump: 300 };
}

function saveGoals() {
  try {
    localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals));
  } catch (e) {
    // ignore
  }
}

function loadStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Object.keys(parsed).length > 0) return parsed;
    }
  } catch (e) {
    console.warn("로컬 스토리지 접근 불가, 메모리 모드로 동작합니다.", e);
  }
  return JSON.parse(JSON.stringify(INITIAL_DEMO_DATA));
}

function saveStore() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (e) {
    // ignore
  }
}

function formatStudentLabel(s) {
  return `${s.grade}학년 ${s.classNum}반 ${s.studentNum}번 ${s.name}`;
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
document.addEventListener("DOMContentLoaded", async () => {
  initTabs();
  initStudentSelector();
  initRecordForm();
  initCalendarControls();
  initTeacherControls();
  initFirebaseModal();
  updateGoalTexts();
  syncAllUI();

  // 저장된 Firebase 설정 또는 firebase-config.js 기본 설정이 있으면 자동 연결
  const savedConfig = loadSavedFirebaseConfig();
  if (savedConfig && savedConfig.apiKey && savedConfig.projectId) {
    await connectToFirebase(savedConfig, true);
  }
});

function updateGoalTexts() {
  document.getElementById("runGoalText").textContent = `${goals.run}바퀴`;
  document.getElementById("jumpGoalText").textContent = `${goals.jump}개`;
  document.getElementById("coachGoalDesc").textContent = `달리기 ${goals.run}바퀴, 줄넘기 ${goals.jump}개`;
  document.getElementById("cfgRunGoal").value = goals.run;
  document.getElementById("cfgJumpGoal").value = goals.jump;
}

// ============================================================================
// 탭 전환
// ============================================================================
function initTabs() {
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      switchTab(btn.dataset.tab);
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
// 학생 선택 드롭다운
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
      return `<option value="${id}" ${id === currentStudentId ? "selected" : ""}>${escapeHtml(formatStudentLabel(s))}</option>`;
    })
    .join("");
}

function initStudentSelector() {
  const select = document.getElementById("studentSelect");
  select.addEventListener("change", (e) => {
    currentStudentId = e.target.value;
    syncAllUI();
    const s = store[currentStudentId];
    if (s) showToast(`${formatStudentLabel(s)} 학생 화면으로 전환되었습니다.`);
  });

  document.getElementById("resetDemoBtn").addEventListener("click", () => {
    store = JSON.parse(JSON.stringify(INITIAL_DEMO_DATA));
    currentStudentId = "student1";
    saveStore();
    syncAllUI();
    showToast("5명의 학생 예시 데이터가 초기 상태로 복원되었습니다.");
  });
}

// ============================================================================
// [탭 1] 운동 기록 입력/수정/삭제
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
      showToast("달리기 또는 줄넘기 기록을 1 이상 입력해 주세요!");
      return;
    }

    const recordObj = {
      run: runVal,
      jump: jumpVal,
      mood: currentMood,
      note: noteVal || "오늘도 건강체력교실 참여 완료!"
    };

    if (!store[currentStudentId].records) {
      store[currentStudentId].records = {};
    }
    store[currentStudentId].records[currentDateStr] = recordObj;
    saveStore();
    syncAllUI();

    if (fbState.connected) {
      await syncRecordToFirestore(currentStudentId, currentDateStr, recordObj);
      showToast(`☁️ ${currentDateStr} 기록이 Firebase 서버에 실시간 저장되었습니다!`);
    } else {
      showToast(`🎉 ${currentDateStr} 운동 기록이 저장되었습니다!`);
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
      showToast(`${currentDateStr} 기록이 삭제되었습니다.`);
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
      badge.textContent = "⭐ 목표 100% 달성";
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

  document.getElementById("runPercentBadge").textContent = `${runPct}%`;
  document.getElementById("jumpPercentBadge").textContent = `${jumpPct}%`;

  document.getElementById("runProgressBar").style.width = `${runPct}%`;
  document.getElementById("jumpProgressBar").style.width = `${jumpPct}%`;
}

// ============================================================================
// 학생별 통계 계산 헬퍼
// ============================================================================
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
      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }
  }

  const lastDate = activeDates.length > 0 ? activeDates[activeDates.length - 1] : "-";
  const participatedToday = Boolean(records[TODAY_STR] && isParticipated(records[TODAY_STR]));

  return {
    monthDays,
    goalDays,
    totalRun,
    totalJump,
    streak,
    lastDate,
    participatedToday
  };
}

function renderSummaryStats() {
  const st = computeStudentStats(currentStudentId);
  document.getElementById("statDays").textContent = `${st.monthDays}일`;
  document.getElementById("statStreak").textContent = `${st.streak}일째`;
  document.getElementById("statRunTotal").textContent = `${st.totalRun}바퀴`;
  document.getElementById("statJumpTotal").textContent = `${st.totalJump.toLocaleString()}개`;
}

function renderRecentList() {
  const listEl = document.getElementById("recentList");
  const records = getStudentRecords();
  const sortedDates = Object.keys(records)
    .filter((d) => isParticipated(records[d]))
    .sort((a, b) => b.localeCompare(a))
    .slice(0, 6);

  if (sortedDates.length === 0) {
    listEl.innerHTML = `<li class="recent-item"><span>아직 기록된 운동이 없어요. 첫 기록을 남겨보세요!</span></li>`;
    return;
  }

  listEl.innerHTML = sortedDates
    .map((dateStr) => {
      const rec = records[dateStr];
      const stamp = isGoalMet(rec) ? "⭐" : "✅";
      return `
        <li class="recent-item" data-date="${dateStr}">
          <div>
            <div class="recent-date">${stamp} ${dateStr} <small>${escapeHtml(rec.mood || "")}</small></div>
            <div class="recent-note">${escapeHtml(rec.note || "")}</div>
          </div>
          <div class="recent-badges">
            <span class="pill-run">🏃 ${rec.run}바퀴</span>
            <span class="pill-jump">🪢 ${rec.jump}개</span>
          </div>
        </li>
      `;
    })
    .join("");

  listEl.querySelectorAll(".recent-item[data-date]").forEach((item) => {
    item.addEventListener("click", () => {
      currentDateStr = item.dataset.date;
      loadDateIntoForm(currentDateStr);
      showToast(`${currentDateStr} 기록을 불러왔습니다.`);
    });
  });
}

// ============================================================================
// [탭 2] 참여 달력 렌더링
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
    const isToday = dateStr === TODAY_STR;

    let cellClasses = "cal-cell";
    if (goalMet) cellClasses += " goal-met";
    else if (participated) cellClasses += " participated";
    if (isSelected) cellClasses += " selected";

    const stamp = goalMet ? "⭐" : participated ? "✅" : "";

    html += `
      <button type="button" class="${cellClasses}" data-date="${dateStr}">
        <div class="cal-cell-top">
          <span class="cal-day-num">${day} ${isToday ? '<span class="cal-today-tag">오늘</span>' : ""}</span>
          <span class="cal-stamp">${stamp}</span>
        </div>
        ${
          participated
            ? `<div class="cal-metrics">
                <span class="cal-chip run">🏃 ${rec.run}바퀴</span>
                <span class="cal-chip jump">🪢 ${rec.jump}개</span>
              </div>`
            : `<div class="cal-metrics"></div>`
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

  titleEl.textContent = `${dateStr} 기록`;

  if (rec && isParticipated(rec)) {
    const goalMet = isGoalMet(rec);
    badgeEl.textContent = goalMet ? "⭐ 목표 달성" : "✅ 참여 완료";
    badgeEl.className = goalMet ? "status-badge gold" : "status-badge done";

    bodyEl.innerHTML = `
      <div class="detail-row">
        <span>🏃 달리기</span>
        <strong>${rec.run} 바퀴 (목표 ${goals.run}바퀴)</strong>
      </div>
      <div class="detail-row">
        <span>🪢 줄넘기</span>
        <strong>${rec.jump} 개 (목표 ${goals.jump}개)</strong>
      </div>
      <div class="detail-row">
        <span>컨디션</span>
        <strong>${escapeHtml(rec.mood || "-")}</strong>
      </div>
      <div class="detail-note">
        💬 "${escapeHtml(rec.note || "메모 없음")}"
      </div>
    `;
  } else {
    badgeEl.textContent = "미참여";
    badgeEl.className = "status-badge";
    bodyEl.innerHTML = `
      <p style="color: var(--text-muted); font-size: 0.9rem;">
        이 날짜에는 아직 기록된 운동이 없습니다.<br/>
        아래 버튼을 눌러 달리기와 줄넘기 개수를 기록해 보세요!
      </p>
    `;
  }
}

// ============================================================================
// [탭 3] 교사용 학급 관리·통계 대시보드
// ============================================================================
function initTeacherControls() {
  document.getElementById("filterGrade").addEventListener("change", renderTeacherDashboard);
  document.getElementById("sortBySelect").addEventListener("change", renderTeacherDashboard);
  document.getElementById("studentSearchInput").addEventListener("input", renderTeacherDashboard);

  // 신규 학생 등록 패널 토글
  const addPanel = document.getElementById("addStudentPanel");
  document.getElementById("openAddStudentBtn").addEventListener("click", () => {
    addPanel.hidden = !addPanel.hidden;
    document.getElementById("goalConfigPanel").hidden = true;
  });
  document.getElementById("closeAddStudentBtn").addEventListener("click", () => {
    addPanel.hidden = true;
  });

  // 신규 학생 저장
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

    const newId = `s_${grade}_${classNum}_${studentNum}_${Date.now().toString().slice(-4)}`;
    const newStudent = {
      id: newId,
      grade,
      classNum,
      studentNum,
      name,
      records: {}
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
    showToast(`➕ ${formatStudentLabel(newStudent)} 학생이 등록되었습니다!`);
  });

  // 목표 설정 패널 토글
  const goalPanel = document.getElementById("goalConfigPanel");
  document.getElementById("openGoalConfigBtn").addEventListener("click", () => {
    goalPanel.hidden = !goalPanel.hidden;
    addPanel.hidden = true;
  });
  document.getElementById("closeGoalConfigBtn").addEventListener("click", () => {
    goalPanel.hidden = true;
  });

  document.getElementById("goalConfigForm").addEventListener("submit", (e) => {
    e.preventDefault();
    goals.run = Math.max(0.5, Number(document.getElementById("cfgRunGoal").value || 5));
    goals.jump = Math.max(10, Math.round(Number(document.getElementById("cfgJumpGoal").value || 300)));
    saveGoals();
    updateGoalTexts();
    goalPanel.hidden = true;
    syncAllUI();
    showToast(`🎯 일일 목표가 달리기 ${goals.run}바퀴, 줄넘기 ${goals.jump}개로 변경되었습니다.`);
  });

  // 엑셀(CSV) 내보내기
  document.getElementById("exportCsvBtn").addEventListener("click", exportClassStatsToCSV);
}

function renderTeacherDashboard() {
  const allStudents = Object.values(store);
  const totalCount = allStudents.length;

  let todayParticipants = 0;
  let sumMonthDays = 0;
  let sumGoalDays = 0;
  let sumRun = 0;
  let sumJump = 0;
  const lowStudentNames = [];

  const enriched = allStudents.map((s) => {
    const st = computeStudentStats(s.id, currentCalYear, currentCalMonth);
    if (st.participatedToday) todayParticipants++;
    sumMonthDays += st.monthDays;
    sumGoalDays += st.goalDays;
    sumRun += st.totalRun;
    sumJump += st.totalJump;
    if (st.monthDays < 4) {
      lowStudentNames.push(`${s.grade}-${s.classNum} ${s.name}(${st.monthDays}일)`);
    }
    return { ...s, stats: st };
  });

  // 상단 KPI 업데이트
  const todayRate = totalCount > 0 ? Math.round((todayParticipants / totalCount) * 100) : 0;
  const avgDays = totalCount > 0 ? (sumMonthDays / totalCount).toFixed(1) : "0.0";
  const goalRate = sumMonthDays > 0 ? Math.round((sumGoalDays / sumMonthDays) * 100) : 0;

  document.getElementById("kpiTotalStudents").textContent = `${totalCount}명`;
  document.getElementById("kpiTodayRate").textContent = `오늘(${TODAY_STR.slice(5)}) ${todayParticipants}명 참여 (${todayRate}%)`;
  document.getElementById("kpiMonthLabel").textContent = `${currentCalMonth}월 평균 참여일 / 목표완주율`;
  document.getElementById("kpiAvgDays").textContent = `${avgDays}일`;
  document.getElementById("kpiGoalRate").textContent = `⭐ 참여일 중 목표 완주 비율 ${goalRate}%`;
  document.getElementById("kpiClassRun").textContent = `🏃 총 ${sumRun.toLocaleString()}바퀴`;
  document.getElementById("kpiClassJump").textContent = `🪢 줄넘기 총 ${sumJump.toLocaleString()}개`;

  document.getElementById("kpiLowCount").textContent = `${lowStudentNames.length}명`;
  document.getElementById("kpiLowNames").textContent =
    lowStudentNames.length > 0 ? lowStudentNames.join(", ") : "모든 학생이 월 4일 이상 성실히 참여 중!";

  document.getElementById("teacherTableMonth").textContent = `${currentCalYear}년 ${currentCalMonth}월`;

  // 필터 및 정렬 적용
  const gradeFilter = document.getElementById("filterGrade").value;
  const sortBy = document.getElementById("sortBySelect").value;
  const queryText = document.getElementById("studentSearchInput").value.trim().toLowerCase();

  const filtered = enriched
    .filter((item) => {
      if (gradeFilter !== "all" && String(item.grade) !== gradeFilter) return false;
      if (queryText) {
        const label = `${item.grade}학년 ${item.classNum}반 ${item.name}`.toLowerCase();
        if (!label.includes(queryText)) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "daysDesc") return b.stats.monthDays - a.stats.monthDays;
      if (sortBy === "daysAsc") return a.stats.monthDays - b.stats.monthDays;
      if (sortBy === "runDesc") return b.stats.totalRun - a.stats.totalRun;
      if (sortBy === "jumpDesc") return b.stats.totalJump - a.stats.totalJump;
      return (
        a.grade - b.grade ||
        a.classNum - b.classNum ||
        a.studentNum - b.studentNum
      );
    });

  const tbody = document.getElementById("teacherTableBody");
  const recommendedMonthDays = 12; // 월 권장 수업/자율운동 기준일 (12일)

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding: 24px; color: var(--text-muted);">조건에 맞는 학생이 없습니다.</td></tr>`;
  } else {
    tbody.innerHTML = filtered
      .map((s) => {
        const st = s.stats;
        const attendPct = Math.min(100, Math.round((st.monthDays / recommendedMonthDays) * 100));
        let statusBadge = `<span class="status-badge done">✅ 성실 참여</span>`;
        if (st.monthDays >= 8 && st.goalDays >= 5) {
          statusBadge = `<span class="status-badge gold">🌟 우수 체력왕</span>`;
        } else if (st.monthDays < 4) {
          statusBadge = `<span class="status-badge warn">🚨 독려 필요</span>`;
        }

        return `
          <tr>
            <td>
              <strong>${s.grade}학년 ${s.classNum}반 ${s.studentNum}번 ${escapeHtml(s.name)}</strong>
            </td>
            <td>
              <div class="mini-progress-wrap">
                <div class="mini-progress">
                  <div class="mini-progress-bar" style="width: ${attendPct}%"></div>
                </div>
                <strong>${st.monthDays}일</strong> <small style="color:var(--text-muted)">(${attendPct}%)</small>
              </div>
            </td>
            <td><strong>⭐ ${st.goalDays}회</strong></td>
            <td><strong>🔥 ${st.streak}일</strong></td>
            <td><span class="pill-run">🏃 ${st.totalRun}바퀴</span></td>
            <td><span class="pill-jump">🪢 ${st.totalJump.toLocaleString()}개</span></td>
            <td>${st.lastDate}</td>
            <td>${statusBadge}</td>
            <td>
              <div class="row-actions">
                <button type="button" class="btn-table view-student-btn" data-id="${s.id}">📅 기록/달력</button>
                <button type="button" class="btn-table del del-student-btn" data-id="${s.id}">삭제</button>
              </div>
            </td>
          </tr>
        `;
      })
      .join("");
  }

  tbody.querySelectorAll(".view-student-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentStudentId = btn.dataset.id;
      syncAllUI();
      switchTab("calendar");
      showToast(`${formatStudentLabel(store[currentStudentId])} 학생의 참여 달력으로 이동했습니다.`);
    });
  });

  tbody.querySelectorAll(".del-student-btn").forEach((btn) => {
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
      showToast(`${label} 학생 정보가 삭제되었습니다.`);
    });
  });

  renderDailyAttendanceChart(allStudents);
}

function renderDailyAttendanceChart(allStudents) {
  const chartEl = document.getElementById("dailyAttendanceChart");
  const totalStudents = Math.max(1, allStudents.length);

  // 2026-10-09 ~ 2026-10-22 (최근 14일)
  const days = [];
  for (let d = 9; d <= 22; d++) {
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
        <div class="chart-col" title="${dStr}: ${allStudents.length}명 중 ${count}명 참여">
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
    "학년",
    "반",
    "번호",
    "이름",
    `${currentCalMonth}월_참여일수`,
    "목표달성(완주)일수",
    "연속참여일(스트릭)",
    "누적_달리기(바퀴)",
    "누적_줄넘기(개)",
    "최근_참여일",
    "상태"
  ];

  const rows = Object.values(store).map((s) => {
    const st = computeStudentStats(s.id, currentCalYear, currentCalMonth);
    const statusText =
      st.monthDays >= 8 && st.goalDays >= 5
        ? "우수 체력왕"
        : st.monthDays < 4
        ? "독려 필요"
        : "성실 참여";
    return [
      s.grade,
      s.classNum,
      s.studentNum,
      `"${s.name.replace(/"/g, '""')}"`,
      st.monthDays,
      st.goalDays,
      st.streak,
      st.totalRun,
      st.totalJump,
      st.lastDate,
      statusText
    ].join(",");
  });

  // 한글 엑셀 호환을 위한 UTF-8 BOM 추가
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
  showToast("📥 학급 통계 CSV(엑셀) 파일 다운로드가 시작되었습니다!");
}

// ============================================================================
// Firebase 클라우드 실시간 연동 (Firestore + Auth)
// ============================================================================
function loadSavedFirebaseConfig() {
  try {
    const raw = localStorage.getItem(FB_CONFIG_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.apiKey && parsed.projectId) return parsed;
    }
  } catch (e) {
    // ignore
  }
  if (DEFAULT_FIREBASE_CONFIG && DEFAULT_FIREBASE_CONFIG.apiKey && DEFAULT_FIREBASE_CONFIG.projectId) {
    return DEFAULT_FIREBASE_CONFIG;
  }
  return null;
}

function initFirebaseModal() {
  const modal = document.getElementById("firebaseModal");
  const openBtn = document.getElementById("firebaseModalBtn");
  const closeBtn = document.getElementById("closeFirebaseModalBtn");
  const jsonInput = document.getElementById("fbJsonInput");

  openBtn.addEventListener("click", () => {
    const saved = loadSavedFirebaseConfig();
    if (saved) {
      document.getElementById("fbApiKey").value = saved.apiKey || "";
      document.getElementById("fbProjectId").value = saved.projectId || "";
      document.getElementById("fbAuthDomain").value = saved.authDomain || "";
      document.getElementById("fbAppId").value = saved.appId || "";
    }
    modal.hidden = false;
  });

  closeBtn.addEventListener("click", () => {
    modal.hidden = true;
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.hidden = true;
  });

  // JSON 붙여넣기 시 자동 파싱하여 개별 필드에 채움
  jsonInput.addEventListener("input", () => {
    const raw = jsonInput.value.trim();
    if (!raw) return;
    try {
      const cleaned = raw
        .replace(/const\s+firebaseConfig\s*=\s*/, "")
        .replace(/;$/, "");
      const obj = JSON.parse(cleaned);
      if (obj.apiKey) document.getElementById("fbApiKey").value = obj.apiKey;
      if (obj.projectId) document.getElementById("fbProjectId").value = obj.projectId;
      if (obj.authDomain) document.getElementById("fbAuthDomain").value = obj.authDomain;
      if (obj.appId) document.getElementById("fbAppId").value = obj.appId;
    } catch (e) {
      // JSON 형태가 아닌 경우 정규식으로 추출 시도
      const extract = (key) => {
        const m = raw.match(new RegExp(`${key}\\s*:\\s*["']([^"']+)["']`));
        return m ? m[1] : "";
      };
      if (extract("apiKey")) document.getElementById("fbApiKey").value = extract("apiKey");
      if (extract("projectId")) document.getElementById("fbProjectId").value = extract("projectId");
      if (extract("authDomain")) document.getElementById("fbAuthDomain").value = extract("authDomain");
      if (extract("appId")) document.getElementById("fbAppId").value = extract("appId");
    }
  });

  document.getElementById("firebaseConfigForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const apiKey = document.getElementById("fbApiKey").value.trim();
    const projectId = document.getElementById("fbProjectId").value.trim();
    const authDomain =
      document.getElementById("fbAuthDomain").value.trim() || `${projectId}.firebaseapp.com`;
    const appId = document.getElementById("fbAppId").value.trim();

    if (!apiKey || !projectId) {
      showToast("apiKey와 projectId는 필수 입력 항목입니다.");
      return;
    }

    const cfg = { apiKey, projectId, authDomain, appId };
    await connectToFirebase(cfg, false);
  });

  document.getElementById("seedToCloudBtn").addEventListener("click", async () => {
    if (!fbState.connected) return;
    await uploadAllLocalDataToFirestore();
    showToast("📤 현재 학생 및 운동 기록 데이터가 Firestore 서버에 업로드되었습니다!");
  });

  document.getElementById("disconnectFirebaseBtn").addEventListener("click", () => {
    disconnectFirebase();
    showToast("로컬 저장소 모드로 전환되었습니다.");
  });
}

async function connectToFirebase(config, isSilent = false) {
  const statusBox = document.getElementById("fbConnectionDetail");
  try {
    statusBox.textContent = "⏳ Firebase SDK 로드 및 서버 연결 중...";

    const [appMod, authMod, fsMod] = await Promise.all([
      import("https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js"),
      import("https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js")
    ]);

    const app = appMod.initializeApp(config, "fitnessApp_" + Date.now());
    const auth = authMod.getAuth(app);
    const db = fsMod.getFirestore(app);

    // 익명 인증 로그인 수행 (firestore.rules의 request.auth != null 충족)
    const cred = await authMod.signInAnonymously(auth);

    fbState = {
      connected: true,
      app,
      auth,
      db,
      sdk: { ...appMod, ...authMod, ...fsMod },
      uid: cred.user.uid,
      unsubStudents: null,
      unsubRecordsMap: {}
    };

    localStorage.setItem(FB_CONFIG_STORAGE_KEY, JSON.stringify(config));
    updateCloudBadgeUI(true, config.projectId);
    startRealtimeListeners();

    statusBox.textContent = `✅ 연결 완료! (프로젝트: ${config.projectId}, 인증 UID: ${cred.user.uid.slice(0, 8)}...)`;
    document.getElementById("seedToCloudBtn").hidden = false;
    document.getElementById("disconnectFirebaseBtn").hidden = false;

    if (!isSilent) {
      showToast(`☁️ Firebase (${config.projectId}) 실시간 연동이 활성화되었습니다!`);
    }
  } catch (err) {
    console.error("Firebase 연결 실패:", err);
    statusBox.textContent = `❌ 연결 실패: ${err.message || "설정 값과 익명 로그인 활성화 여부를 확인하세요."}`;
    updateCloudBadgeUI(false);
    if (!isSilent) {
      showToast("Firebase 연결에 실패했습니다. 설정 값과 콘솔 익명 로그인을 확인해 주세요.");
    }
  }
}

function disconnectFirebase() {
  if (fbState.unsubStudents) fbState.unsubStudents();
  Object.values(fbState.unsubRecordsMap).forEach((unsub) => unsub && unsub());
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
  document.getElementById("fbConnectionDetail").textContent =
    "현재 상태: 로컬 브라우저 저장소(localStorage) 모드로 동작 중입니다.";
  document.getElementById("seedToCloudBtn").hidden = true;
  document.getElementById("disconnectFirebaseBtn").hidden = true;
}

function updateCloudBadgeUI(isOnline, projectId = "") {
  const btn = document.getElementById("firebaseModalBtn");
  const textEl = document.getElementById("cloudStatusText");
  if (isOnline) {
    btn.className = "cloud-badge online";
    textEl.textContent = `실시간 클라우드 연동 중 (${projectId})`;
  } else {
    btn.className = "cloud-badge offline";
    textEl.textContent = "로컬 체험 모드 (Firebase 연결 설정)";
  }
}

function startRealtimeListeners() {
  if (!fbState.connected) return;
  const { collection, onSnapshot } = fbState.sdk;

  const studentsCol = collection(fbState.db, "students");
  fbState.unsubStudents = onSnapshot(
    studentsCol,
    (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const sId = change.doc.id;
        const data = change.doc.data();
        if (change.type === "removed") {
          delete store[sId];
          if (fbState.unsubRecordsMap[sId]) {
            fbState.unsubRecordsMap[sId]();
            delete fbState.unsubRecordsMap[sId];
          }
        } else {
          const existingRecords = store[sId]?.records || {};
          store[sId] = {
            id: sId,
            grade: Number(data.grade || 1),
            classNum: Number(data.classNum || 1),
            studentNum: Number(data.studentNum || 1),
            name: data.name || "이름없음",
            records: existingRecords
          };
          if (!fbState.unsubRecordsMap[sId]) {
            listenToStudentRecords(sId);
          }
        }
      });
      saveStore();
      syncAllUI();
    },
    (err) => {
      console.warn("Firestore students 실시간 구독 권한/오류:", err);
    }
  );
}

function listenToStudentRecords(studentId) {
  if (!fbState.connected) return;
  const { collection, onSnapshot } = fbState.sdk;
  const recordsCol = collection(fbState.db, "students", studentId, "records");

  fbState.unsubRecordsMap[studentId] = onSnapshot(
    recordsCol,
    (snapshot) => {
      if (!store[studentId]) return;
      const nextRecords = { ...(store[studentId].records || {}) };
      snapshot.docChanges().forEach((change) => {
        const dateStr = change.doc.id;
        if (change.type === "removed") {
          delete nextRecords[dateStr];
        } else {
          const d = change.doc.data();
          nextRecords[dateStr] = {
            run: Number(d.run || 0),
            jump: Number(d.jump || 0),
            mood: d.mood || "😄 상쾌해요",
            note: d.note || ""
          };
        }
      });
      store[studentId].records = nextRecords;
      saveStore();
      syncAllUI();
    },
    (err) => {
      console.warn(`학생(${studentId}) 기록 구독 오류:`, err);
    }
  );
}

// firestore.rules 스키마 준수 저장 함수들
async function syncStudentDocToFirestore(studentId, studentObj) {
  if (!fbState.connected) return;
  const { doc, setDoc, serverTimestamp } = fbState.sdk;
  const ref = doc(fbState.db, "students", studentId);
  await setDoc(
    ref,
    {
      name: String(studentObj.name).slice(0, 40),
      grade: Number(studentObj.grade),
      classNum: Number(studentObj.classNum),
      studentNum: Number(studentObj.studentNum),
      ownerUid: fbState.uid,
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );
}

async function syncRecordToFirestore(studentId, dateStr, rec) {
  if (!fbState.connected) return;
  const { doc, setDoc, serverTimestamp } = fbState.sdk;
  // 부모 학생 문서가 먼저 존재하도록 보장
  if (store[studentId]) {
    await syncStudentDocToFirestore(studentId, store[studentId]);
  }
  const recRef = doc(fbState.db, "students", studentId, "records", dateStr);
  await setDoc(recRef, {
    run: Number(rec.run),
    jump: Math.round(Number(rec.jump)),
    mood: String(rec.mood || "😄 상쾌해요").slice(0, 30),
    note: String(rec.note || "").slice(0, 100),
    updatedBy: fbState.uid,
    updatedAt: serverTimestamp()
  });
}

async function deleteRecordFromFirestore(studentId, dateStr) {
  if (!fbState.connected) return;
  const { doc, deleteDoc } = fbState.sdk;
  await deleteDoc(doc(fbState.db, "students", studentId, "records", dateStr));
}

async function deleteStudentFromFirestore(studentId) {
  if (!fbState.connected) return;
  const { doc, deleteDoc } = fbState.sdk;
  await deleteDoc(doc(fbState.db, "students", studentId));
}

async function uploadAllLocalDataToFirestore() {
  if (!fbState.connected) return;
  for (const [sId, sObj] of Object.entries(store)) {
    await syncStudentDocToFirestore(sId, sObj);
    const records = sObj.records || {};
    for (const [dateStr, rec] of Object.entries(records)) {
      await syncRecordToFirestore(sId, dateStr, rec);
    }
  }
}

// ============================================================================
// 전체 UI 동기화 및 유틸리티
// ============================================================================
function syncAllUI() {
  renderStudentSelectOptions();
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
  }, 2600);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
