// المتغيرات العامة
let messages = [];
let selectedTopic = null;
let isLoading = false;
let topics = []; // سيتم ملؤها من XML
let defaultPersonality = ""; // الشخصية الافتراضية

// ضع API Key هنا مباشرة
const API_KEY = "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"; // غيّر هذا بمفتاحك

// العناصر
const elements = {
  messagesContainer: document.getElementById("messagesContainer"),
  messageInput: document.getElementById("messageInput"),
  sendButton: document.getElementById("sendButton"),
  topicButton: document.getElementById("topicButton"),
  topicButtonText: document.getElementById("topicButtonText"),
  topicMenu: document.getElementById("topicMenu"),
  categoryLabel: document.getElementById("categoryLabel"),
};

// دالة قراءة ملف XML
async function loadPersonalitiesFromXML() {
  try {
    const response = await fetch("personalities.xml");
    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");

    // قراءة الشخصية الافتراضية
    const defaultNode = xmlDoc.querySelector("default personality");
    if (defaultNode) {
      defaultPersonality = defaultNode.textContent.trim();
    }

    // قراءة المواضيع
    const topicNodes = xmlDoc.querySelectorAll("topics > topic");
    topics = Array.from(topicNodes).map((node) => {
      return {
        id: parseInt(node.getAttribute("id")),
        name: node.querySelector("name")?.textContent.trim() || "",
        icon: node.querySelector("icon")?.textContent.trim() || "📌",
        context: node.querySelector("context")?.textContent.trim() || "",
      };
    });

    console.log("✅ تم تحميل الشخصيات من XML بنجاح!");
    console.log(`📚 عدد المواضيع: ${topics.length}`);

    // ملء القائمة بعد التحميل
    populateTopicMenu();

    // اختيار موضوع افتراضي
    if (topics.length > 0) {
      selectTopic(topics[topics.length - 1]); // اختيار آخر موضوع (عام)
    }
  } catch (error) {
    console.error("❌ خطأ في تحميل ملف XML:", error);

    // في حالة الخطأ، استخدم بيانات افتراضية
    alert(
      "⚠️ لم يتم العثور على ملف personalities.xml\nسيتم استخدام الشخصيات الافتراضية"
    );

    // بيانات افتراضية بسيطة
    topics = [
      {
        id: 1,
        name: "كوكب الأرض",
        icon: "🌍",
        context: "أنت خبير في علوم الأرض.",
      },
      {
        id: 2,
        name: "القمر",
        icon: "🌙",
        context: "أنت خبير في علم الفلك، متخصص في القمر.",
      },
      { id: 14, name: "عام", icon: "💬", context: "أنت مساعد ذكي ومفيد." },
    ];

    populateTopicMenu();
    selectTopic(topics[topics.length - 1]);
  }
}

// ملء قائمة المواضيع
function populateTopicMenu() {
  elements.topicMenu.innerHTML = "";
  topics.forEach((topic) => {
    const button = document.createElement("button");
    button.className = "topic-item";
    button.innerHTML = `<span class="topic-icon">${topic.icon}</span> ${topic.name}`;
    button.addEventListener("click", () => selectTopic(topic));
    elements.topicMenu.appendChild(button);
  });
}

// فتح/إغلاق القائمة
elements.topicButton.addEventListener("click", (e) => {
  e.stopPropagation();
  elements.topicMenu.classList.toggle("show");
  elements.topicButton.classList.toggle("active");
});

// إغلاق القائمة عند الضغط خارجها
document.addEventListener("click", () => {
  elements.topicMenu.classList.remove("show");
  elements.topicButton.classList.remove("active");
});

// اختيار موضوع
function selectTopic(topic) {
  selectedTopic = topic;
  elements.topicButtonText.textContent = topic.name;
  elements.categoryLabel.textContent = `الموضوع: ${topic.name}`;
  elements.topicMenu.classList.remove("show");
  elements.topicButton.classList.remove("active");

  // تحديث الأزرار النشطة
  const buttons = elements.topicMenu.querySelectorAll(".topic-item");
  buttons.forEach((btn) => {
    const btnText = btn.textContent.trim();
    if (btnText.includes(topic.name)) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

// إضافة رسالة إلى الشاشة
function addMessageToUI(role, content) {
  const emptyState = elements.messagesContainer.querySelector(".empty-state");
  if (emptyState) {
    emptyState.remove();
  }

  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${role}`;

  const avatarDiv = document.createElement("div");
  avatarDiv.className = `message-avatar ${role === "user" ? "user" : "bot"}`;

  if (role === "user") {
    avatarDiv.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
            </svg>
        `;
  } else {
    avatarDiv.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <rect x="3" y="11" width="18" height="10" rx="2"></rect>
                <circle cx="12" cy="2" r="1"></circle>
                <path d="M12 3v5"></path>
            </svg>
        `;
  }

  const contentDiv = document.createElement("div");
  contentDiv.className = `message-content ${role === "user" ? "user" : "bot"}`;
  contentDiv.textContent = content;

  if (role === "user") {
    messageDiv.appendChild(contentDiv);
    messageDiv.appendChild(avatarDiv);
  } else {
    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);
  }

  elements.messagesContainer.appendChild(messageDiv);
  elements.messagesContainer.scrollTop =
    elements.messagesContainer.scrollHeight;
}

// مؤشر الكتابة
function showTypingIndicator() {
  const typingDiv = document.createElement("div");
  typingDiv.className = "typing-indicator";
  typingDiv.id = "typingIndicator";

  const avatarDiv = document.createElement("div");
  avatarDiv.className = "message-avatar bot";
  avatarDiv.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <rect x="3" y="11" width="18" height="10" rx="2"></rect>
            <circle cx="12" cy="2" r="1"></circle>
            <path d="M12 3v5"></path>
        </svg>
    `;

  const dotsDiv = document.createElement("div");
  dotsDiv.className = "typing-dots";
  dotsDiv.innerHTML = `
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
    `;

  typingDiv.appendChild(avatarDiv);
  typingDiv.appendChild(dotsDiv);
  elements.messagesContainer.appendChild(typingDiv);
  elements.messagesContainer.scrollTop =
    elements.messagesContainer.scrollHeight;
}

function hideTypingIndicator() {
  const typingIndicator = document.getElementById("typingIndicator");
  if (typingIndicator) {
    typingIndicator.remove();
  }
}

// إرسال رسالة إلى Groq AI
async function sendMessage() {
  const message = elements.messageInput.value.trim();
  if (!message || isLoading) return;

  if (!API_KEY || API_KEY === "ضع_مفتاح_API_هنا") {
    addMessageToUI("assistant", "⚠️ يرجى وضع API Key في ملف script.js أولاً!");
    return;
  }

  // إضافة رسالة المستخدم
  const displayMessage = selectedTopic
    ? `[${selectedTopic.name}] ${message}`
    : message;

  addMessageToUI("user", displayMessage);
  messages.push({ role: "user", content: message });
  elements.messageInput.value = "";
  isLoading = true;
  elements.sendButton.disabled = true;
  elements.messageInput.disabled = true;

  // إظهار مؤشر الكتابة
  showTypingIndicator();

  try {
    // إعداد الرسائل مع سياق الموضوع من XML
    const systemMessage =
      selectedTopic && selectedTopic.context
        ? { role: "system", content: selectedTopic.context }
        : {
            role: "system",
            content: defaultPersonality || "أنت مساعد ذكي ومفيد.",
          };

    const apiMessages = [systemMessage, ...messages];

    // إرسال الطلب
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: apiMessages,
          temperature: 0.7,
          max_tokens: 2048,
          top_p: 1,
          stream: false,
        }),
      }
    );

    hideTypingIndicator();

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `خطأ ${response.status}`);
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error("استجابة غير صحيحة من API");
    }

    const aiResponse = data.choices[0].message.content;
    addMessageToUI("assistant", aiResponse);
    messages.push({ role: "assistant", content: aiResponse });
  } catch (error) {
    hideTypingIndicator();
    console.error("خطأ:", error);
    const errorMessage = `❌ حدث خطأ: ${error.message}\n\nتأكد من:\n1. صحة API Key\n2. وجود رصيد في حسابك\n3. الاتصال بالإنترنت`;
    addMessageToUI("assistant", errorMessage);
    messages.push({ role: "assistant", content: errorMessage });
  } finally {
    isLoading = false;
    elements.sendButton.disabled = false;
    elements.messageInput.disabled = false;
    elements.messageInput.focus();
  }
}

// زر الإرسال
elements.sendButton.addEventListener("click", sendMessage);

// الإرسال بالضغط على Enter
elements.messageInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// تحميل الشخصيات من XML عند فتح الصفحة
loadPersonalitiesFromXML();
