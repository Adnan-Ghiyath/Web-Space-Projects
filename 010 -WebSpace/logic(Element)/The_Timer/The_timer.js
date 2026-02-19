// The_Timer.js - النسخة المصححة
(function () {
  const CONFIG = {
    timeLimit: 60, // الوقت بالثواني
    warningTime: 10, // وقت إظهار التحذير
  };

  let timeLeft = CONFIG.timeLimit;
  let timerInterval;
  let isPaused = false;
  let warningShown = false;
  let isCancelled = false;

  // إغلاق الصفحة
  function closePage() {
    try {
      window.close();
    } catch (error) {
      showCloseMessage();
    }
  }

  // عرض رسالة الإغلاق
  function showCloseMessage() {
    clearInterval(timerInterval);

    const closeMessage = document.createElement("div");
    closeMessage.id = "closeMessage";
    closeMessage.innerHTML = `
      <div class="close-message-content">
        <div class="close-icon">⏰</div>
        <h2>انتهى الوقت</h2>
        <p>تم إغلاق الجلسة تلقائياً</p>
        <p>يمكنك إغلاق هذه النافذة يدوياً</p>
        <div class="close-actions">
          <button id="closeNowBtn" class="close-action-btn">إغلاق النافذة</button>
          <button id="reloadBtn" class="close-action-btn secondary">إعادة التحميل</button>
        </div>
      </div>
    `;

    document.body.appendChild(closeMessage);

    document.getElementById("closeNowBtn")?.addEventListener("click", () => {
      try {
        window.close();
      } catch (e) {}
    });

    document.getElementById("reloadBtn")?.addEventListener("click", () => {
      window.location.reload();
    });
  }

  // إلغاء العداد
  function cancelTimer() {
    isCancelled = true;
    clearInterval(timerInterval);

    const closeBtn = document.getElementById("closeBtn");
    if (closeBtn) {
      closeBtn.innerHTML = `
        <span class="countdown">✕</span>
        <span>تم إلغاء العداد</span>
        <div class="timer-circle cancelled"></div>
      `;
      closeBtn.onclick = null;
      closeBtn.style.background = "#4b5563";
      closeBtn.style.cursor = "default";
    }

    const warningMsg = document.getElementById("warningMsg");
    if (warningMsg) warningMsg.style.display = "none";
  }

  // تحديث نص الزمن
  function updateTimeText() {
    const closeBtn = document.getElementById("closeBtn");
    if (!closeBtn) return;

    const spans = closeBtn.querySelectorAll("span");
    for (let span of spans) {
      if (
        span.textContent &&
        span.textContent.includes("ثانية حتى الإغلاق التلقائي")
      ) {
        span.textContent =
          timeLeft === 1
            ? "ثانية حتى الإغلاق التلقائي"
            : "ثواني حتى الإغلاق التلقائي";
        break;
      }
    }
  }

  // تحديث العداد
  function updateCountdown() {
    if (isPaused || isCancelled) return;

    const countdownElement = document.getElementById("countdown");
    const warningMsg = document.getElementById("warningMsg");
    const warningTime = document.getElementById("warningTime");
    const closeBtn = document.getElementById("closeBtn");

    // إذا لم توجد العناصر، توقف
    if (!countdownElement || !warningMsg || !warningTime || !closeBtn) {
      clearInterval(timerInterval);
      return;
    }

    // تحديث الوقت المتبقي
    countdownElement.textContent = timeLeft;
    updateTimeText();

    // التحكم في الألوان والتحذيرات
    if (timeLeft <= 5) {
      countdownElement.style.color = "#fca5a5";
      closeBtn.style.background = "rgba(220, 38, 38, 0.3)";
    } else if (timeLeft <= CONFIG.warningTime) {
      countdownElement.style.color = "#fef3c7";
      closeBtn.style.background = "#f59e0b";

      if (!warningShown) {
        warningMsg.style.display = "block";
        warningMsg.style.opacity = "1";
        warningShown = true;
      }
      warningTime.textContent = timeLeft;
    } else if (timeLeft <= 30) {
      countdownElement.style.color = "#fed7aa";
      closeBtn.style.background = "#dc2626";
    }

    timeLeft--;

    if (timeLeft < 0) {
      clearInterval(timerInterval);
      closePage();
    }
  }

  // إيقاف/تشغيل العداد
  function togglePause() {
    if (isCancelled) return;

    isPaused = !isPaused;
    const pauseBtn = document.getElementById("pauseBtn");
    const closeBtn = document.getElementById("closeBtn");

    if (!pauseBtn || !closeBtn) return;

    if (isPaused) {
      pauseBtn.textContent = "▶️ استئناف";
      pauseBtn.style.background = "#22c55e";
      closeBtn.style.opacity = "0.5";
    } else {
      pauseBtn.textContent = "⏸️ إيقاف مؤقت";
      pauseBtn.style.background = "#3b82f6";
      closeBtn.style.opacity = "1";
    }
  }

  // إضافة زر الإلغاء
  function addCancelButton() {
    if (document.getElementById("cancelBtn")) return;

    const cancelBtn = document.createElement("button");
    cancelBtn.id = "cancelBtn";
    cancelBtn.className = "cancel-button";
    cancelBtn.innerHTML = "✕ إلغاء العداد";
    cancelBtn.onclick = cancelTimer;
  }

  // تهيئة التايمر
  function initializeTimer() {
    // التأكد من وجود العناصر الأساسية
    const closeBtn = document.getElementById("closeBtn");
    const countdownElement = document.getElementById("countdown");
    const warningMsg = document.getElementById("warningMsg");

    if (!closeBtn || !countdownElement) {
      console.error("❌ العناصر الأساسية غير موجودة في HTML");
      return false;
    }

    // إعادة تعيين القيم
    timeLeft = CONFIG.timeLimit;
    warningShown = false;
    isPaused = false;
    isCancelled = false;

    // تحديث العرض
    countdownElement.textContent = CONFIG.timeLimit;
    updateTimeText();

    // إعادة تعيين زر الإغلاق
    closeBtn.onclick = closePage;
    closeBtn.style.background = "rgba(220, 38, 38, 0.3)";
    closeBtn.style.opacity = "1";
    closeBtn.style.display = "flex";

    // إعادة تعيين رسالة التحذير
    if (warningMsg) {
      warningMsg.style.display = "none";
      warningMsg.style.opacity = "0";
    }

    // إضافة زر الإلغاء
    addCancelButton();

    return true;
  }

  // إضافة الأنماط الإضافية
  function addAdditionalStyles() {
    // التحقق إذا كانت الأنماط موجودة بالفعل
    if (document.getElementById("timer-additional-styles")) return;

    const style = document.createElement("style");
    style.id = "timer-additional-styles";
    style.textContent = `
      .cancel-button {
  position: fixed;
  top: 20px;
  right: 180px;
  z-index: 10000;
  background: rgba(75, 85, 99, 0.3);  /* تم التعديل هنا */
  backdrop-filter: blur(10px);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 12px 24px;
  border-radius: 50px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(75, 85, 99, 0.2);  /* وهنا أيضاً */
  font-family: system-ui, -apple-system, sans-serif;
}
      
      .cancel-button:hover {
        background: rgba(107, 114, 128, 1);
        transform: translateY(-2px);
      }
      
      .timer-circle.cancelled {
        border: 3px solid rgba(255, 255, 255, 0.5);
        animation: none;
      }
      
      #closeMessage {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 99999;
        font-family: system-ui, -apple-system, sans-serif;
      }
      
      .close-message-content {
        background: rgba(255, 255, 255, 0.95);
        padding: 40px;
        border-radius: 20px;
        text-align: center;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        animation: fadeIn 0.5s ease;
      }
      
      .close-icon {
        font-size: 80px;
        margin-bottom: 20px;
        animation: pulse 2s infinite;
      }
      
      .close-message-content h2 {
        color: #333;
        margin-bottom: 10px;
        font-size: 2rem;
      }
      
      .close-message-content p {
        color: #666;
        margin-bottom: 10px;
        font-size: 1.1rem;
      }
      
      .close-actions {
        margin-top: 30px;
        display: flex;
        gap: 15px;
        justify-content: center;
        flex-wrap: wrap;
      }
      
      .close-action-btn {
        padding: 12px 30px;
        border: none;
        border-radius: 50px;
        font-size: 1rem;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
        background: #667eea;
        color: white;
        min-width: 150px;
      }
      
      .close-action-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
      }
      
      .close-action-btn.secondary {
        background: #764ba2;
      }
      
      .close-action-btn.secondary:hover {
        box-shadow: 0 10px 20px rgba(118, 75, 162, 0.4);
      }
      
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes pulse {
        0%, 100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.1);
        }
      }
    `;

    document.head.appendChild(style);
  }

  // بدء التشغيل
  function init() {
    // انتظر حتى يتم تحميل الصفحة بالكامل
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", startTimer);
    } else {
      startTimer();
    }
  }

  function startTimer() {
    console.log("🚀 بدء تشغيل العداد...");

    // إضافة الأنماط الإضافية
    addAdditionalStyles();

    // تهيئة التايمر
    if (!initializeTimer()) {
      console.error("❌ فشل في تهيئة العداد");
      return;
    }

    // إيقاف أي عداد سابق
    if (timerInterval) clearInterval(timerInterval);

    // بدء العداد الجديد
    timerInterval = setInterval(updateCountdown, 1000);

    console.log("✅ تم تشغيل العداد بنجاح");

    // إضافة مستمع للأحداث
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !isCancelled) {
        if (confirm("هل تريد إغلاق الصفحة الآن؟")) {
          clearInterval(timerInterval);
          closePage();
        }
      }
    });
  }

  // بدء التطبيق
  init();
})();
