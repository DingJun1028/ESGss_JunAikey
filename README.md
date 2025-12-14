
# ESGss x JunAiKey: The Universal Core Architecture

**Version:** v15.0.0 (The AIOS Awakening)
**System Status:** ✅ SYSTEM ONLINE | 🧠 NEURAL SYNC ACTIVE
**Core Philosophy:** **"Component as Agent" (元件即代理)**

---

## 1. 執行摘要 (Executive Summary)

ESGss 不僅是一個 SaaS 平台，它是一個運行於 **AIOS (AI Agent Operating System)** 之上的智慧有機體。我們採用 **MCP (Model Context Protocol)** 作為神經連結標準，將系統解構為 **「萬能元件核心 (Universal Component Cores)」**。

每一個核心 (Core) 都是一個獨立的 AI 智能體，透過 **JunAiKey Kernel** 的統一排程與資源虛擬化，在前端即時動態組裝，形成了一個符合 **MECE (Mutually Exclusive, Collectively Exhaustive)** 原則的決策支援系統。

---

## 2. 萬能元件核心矩陣 (Universal Component Cores Matrix)

我們將系統能力解構為五大核心類別，涵蓋 AI 生命週期的每一個環節：

### 👁️ I. 感知核心 (Perception Core)
**職責：** 數據攝取、視覺辨識、訊號監聽 (MCP Resources)。
**關鍵能力：** Vision, OCR, IoT Stream, Web Crawling.

| 萬能元件 (Component) | 對應模組 (Module) | AI/MCP 功能描述 |
| :--- | :--- | :--- |
| **Spectral Scanner** | `ResearchHub` (Scanner) | **[Vision]** 將 PDF/圖片光學折射為結構化數據 (IDP)。 |
| **Neural Ear** | `VoiceControl` | **[Audio]** 接收自然語言指令並導航系統。 |
| **Data Lake Sensor** | `IntegrationHub` | **[Stream]** 透過 MCP 監聽 ERP/IoT 訊號，偵測數據異常 (Anomaly Detection)。 |
| **Global Crawler** | `BusinessIntel` | **[Retrieval]** 全網掃描競爭對手動態與負面新聞。 |

### 🧠 II. 認知核心 (Cognition Core)
**職責：** 深度推理、策略模擬、多代理辯論 (AIOS Scheduler)。
**關鍵能力：** Reasoning, Simulation, Game Theory.

| 萬能元件 (Component) | 對應模組 (Module) | AI/MCP 功能描述 |
| :--- | :--- | :--- |
| **Strategy Oracle** | `StrategyHub` | **[Multi-Agent]** 模擬 CFO 與 CSO 辯論，產出風險熱點圖。 |
| **Carbon Calculator** | `CarbonAsset` | **[Computation]** 依據 GHG Protocol 進行排放量精算與係數匹配。 |
| **ROI Simulator** | `FinanceSim` | **[Prediction]** 執行蒙地卡羅模擬，預測碳稅對財務的衝擊。 |
| **Health Diagnostician**| `HealthCheck` | **[Evaluation]** 針對企業體質進行雙軌 (合規/創價) 深度診斷。 |

### 🧬 III. 記憶核心 (Memory Core)
**職責：** 知識圖譜、資產沉澱、經驗學習 (Context Manager)。
**關鍵能力：** RAG, Vector DB, Asset Minting.

| 萬能元件 (Component) | 對應模組 (Module) | AI/MCP 功能描述 |
| :--- | :--- | :--- |
| **Quantum Lattice** | `ResearchHub` (Quantum) | **[Knowledge Graph]** 將非結構化文本「量子化」為原子知識節點。 |
| **Asset Vault** | `Gamification` (Card) | **[Minting]** 將知識點鑄造為 NFT 卡牌，記錄學習歷程。 |
| **Skill Galaxy** | `TalentPassport` | **[Embedding]** 視覺化呈現技能向量與職涯路徑的匹配度。 |
| **SDR Archive** | `ResearchHub` (SDR) | **[Vector DB]** 連接全球開源數據庫 (CDP/GRI)，建立本地知識庫。 |

### 🗣️ IV. 表達核心 (Expression Core)
**職責：** 內容生成、介面渲染、互動對話 (Generative UI)。
**關鍵能力：** GenAI, GenUI, Visualization.

| 萬能元件 (Component) | 對應模組 (Module) | AI/MCP 功能描述 |
| :--- | :--- | :--- |
| **The Scribe** | `ReportGen` | **[Generation]** 自動撰寫符合 GRI/SASB 標準的永續報告書章節。 |
| **GenUI Canvas** | `UniversalBackend` | **[Rendering]** 依據意圖 (Intent) 即時生成前端 UI 組件 (Charts/Tables)。 |
| **Omni-Cell** | `Dashboard` | **[Micro-Interaction]** 具備自我解釋能力的最小數據單元 (Self-Explaining Data)。 |
| **Intel Prism** | `UniversalCard` | **[Refraction]** 將單一關鍵字折射為多維度的光譜分析報告。 |

### 🔗 V. 連結核心 (Nexus Core)
**職責：** 系統控制、外部串接、權限管理 (MCP Host)。
**關鍵能力：** API Gateway, HITL, Orchestration.

| 萬能元件 (Component) | 對應模組 (Module) | AI/MCP 功能描述 |
| :--- | :--- | :--- |
| **Universal Synapse** | `UniversalAgentContext` | **[Orchestration]** AIOS Kernel，協調上述所有核心的雙向同步。 |
| **API Gateway** | `ApiZone` | **[Interface]** 管理外部系統對內部 AI 引擎的呼叫權限與配額。 |
| **Audit Chain** | `AuditTrail` | **[HITL]** 關鍵決策的人在迴路 (Human-in-the-Loop) 審批與上鏈驗證。 |
| **Role Switcher** | `AlumniZone` | **[Context Switch]** 動態切換系統視角 (學生/顧問/管理員)。 |

---

## 3. 技術架構升級 (AIOS + MCP)

*   **AIOS Kernel:** 負責排程代理請求 (Scheduler)、管理上下文視窗 (Context Manager) 與記憶體置換。
*   **MCP Protocol:** 透過 `tools/call` 與 `resources/read` 標準化所有外部連接。
*   **Generative UI:** 聊天介面不再只是文字，而是根據 MCP 輸出動態渲染 React 組件 (Charts, Approval Cards)。
*   **Zero Hallucination:** L3 驗證層強制所有輸出需經過 Grounding 與 HITL 審批。

---

*本文件由 JunAiKey 系統架構師自動生成，嚴格遵循 MECE 原則。*
