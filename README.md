<div align="center">
    <img src="./logo.png" width="100" style="margin-bottom: 20px;" alt="MaMa Care Logo" />
    <div><strong>MaMa Care</strong></div>
    <div>The AI-driven nexus for personalized maternal health, proactive risk synthesis, and a calmer pregnancy odyssey.</div>
    <div>
        <img src="https://img.shields.io/badge/Status-Operational-0b0f1a?style=for-the-badge&logo=codestream&logoColor=00FF7F" />
        <img src="https://img.shields.io/badge/Backend-FastAPI+%20Node.js-0b0f1a?style=for-the-badge&logo=fastapi&logoColor=009688" />
        <img src="https://img.shields.io/badge/AI_Model-RandomForest-0b0f1a?style=for-the-badge&logo=scikitlearn&logoColor=F7931E" />
        <img src="https://img.shields.io/badge/Security-AES--256-0b0f1a?style=for-the-badge&logo=data-theorems&logoColor=red" />
    </div>
</div>

🖥️ The Interface (Mouth-Watering UI)
<div align="center">
    <a href="#">
        <img src="./home.png" width="95%" style="border-radius:24px; box-shadow:0 30px 90px rgba(0,0,0,0.6), 0 0 10px rgba(139, 233, 253, 0.2); transition: all 0.5s ease; border: 1px solid rgba(139, 233, 253, 0.1);" alt="MaMa Care Home Dashboard Mockup" />
    </a>
    <em>A glassmorphic dashboard showcasing real-time vitals, AI insights, and maternal alerts.</em>
</div>

💡 The Problem
Modern pregnancy care is fragmented, analog, and reactive. Vital health data is scattered across apps, physical notes, and clinical records, creating a massive information gap. MaMa Care synthesizes tracking, intelligence, and guidance into a single, cohesive, developer-friendly ecosystem.

⚙️ System Intelligence Architecture
```mermaid
%%{init: {"theme":"dark", "themeVariables":{"primaryColor":"#0b0f1a","primaryTextColor":"#e6edf3","primaryBorderColor":"#8be9fd","lineColor":"#8be9fd","secondaryColor":"#161b22","tertiaryColor":"#0b0f1a"}}}%%
sequenceDiagram
        autonumber
        participant UI as 📱 React UI (Vite)
        participant API as 🛡️ Express Gateway
        participant DB as 🗄️ MongoDB
        participant AI as 🧠 FastAPI ML (Scikit)
        participant LLM as 🤖 Gemini LLM

        note over UI,AI: All connections via Secure JWT/REST

        UI->>API: User Vitals / Symptoms
        critical Secure Storage
                API->>DB: Write Encrypted Health Metrics
        end

        par Async Processing
                API->>AI: Vectorize Data & Run Risk Scoring
                API->>LLM: Generate Tailored Care Plan
        end

        AI-->>API: (Risk_Score = σ(Σ W·x))
        LLM-->>API: Dynamic Response Payload

        API-->>UI: Optimized UI Update (JSON)
```

🌟 Mind-Bending Capabilities
<div align="center">
    <table style="border: 1px solid rgba(139, 233, 253, 0.1); border-radius: 12px; overflow: hidden; background-color: #0b0f1a;">
        <tr>
            <td align="center" width="260" style="padding: 20px;"><img src="https://img.icons8.com/bubbles/100/hospital.png"/><b>Precision Tracking</b><em>Unified, granular vitals monitoring.</em></td>
            <td align="center" width="260" style="padding: 20px;"><img src="https://img.icons8.com/bubbles/100/mind-map.png"/><b>Cognitive Insights</b><em>Symptom clustering and interpretation.</em></td>
            <td align="center" width="260" style="padding: 20px;"><img src="https://img.icons8.com/bubbles/100/chatbot.png"/><b>24/7 Care Agent</b><em>Context-aware clinical support.</em></td>
        </tr>
        <tr>
            <td align="center" width="260" style="padding: 20px;"><img src="https://img.icons8.com/bubbles/100/heart-health.png"/><b>Predictive Scoring</b><em>Real-time Multi-Factor Risk Index.</em></td>
            <td align="center" width="260" style="padding: 20px;"><img src="https://img.icons8.com/bubbles/100/database.png"/><b>Privacy-First DB</b><em>Encrypted, granular data control.</em></td>
            <td align="center" width="260" style="padding: 20px;"><img src="https://img.icons8.com/bubbles/100/graph.png"/><b>Trend Analysis</b><em>Deep learning on vital history.</em></td>
        </tr>
    </table>
</div>

🔬 Core Mathematics: Risk Matrix
We calculate maternal risk using a weighted sigmoid projection, normalizing diverse health indicators into a unified 0-1 risk coefficient for clinical actionability:
$$\text{RiskScore} = \underbrace{\sigma\left(
\mathbf{w}^\top \mathbf{x}
\right)}_{\text{Sigmoid Activation}} =
\frac{1}{1+e^{-\left(
W_1 \text{BP} +
W_2 \text{Age} +
W_3 \text{BMI} +
W_4 \text{Glucose} +
W_5 \text{Symptoms}
\right)}}$$

⚡ Quick Start & Matrix Structure
Installation (3 Steps)

Repository Setup
```bash
git clone https://github.com/your-username/mama-care.git && cd mama-care
```

Backend Services
```bash
(cd backend && npm install) && (cd ai_services && pip install -r requirements.txt)
```

Frontend Application
```bash
(cd frontend && npm install)
```

Launch Sequence
```bash
# Gateway
cd backend && npm run dev
```
```bash
# ML Engine
cd ai_services && uvicorn app:app --reload --port 8001
```
```bash
# Application
cd frontend && npm run dev
```

Folder Matrix
```bash
# Run this to view the clean project tree
tree -I 'node_modules|__pycache__'

mama-care/
├─ ai_services/ # FastAPI, ML Models, Vectorization
│  ├─ core/ # Core algorithms & preprocessing
│  ├─ app.py # FastAPI Entrypoint
├─ backend/ # Node/Express API Gateway
│  ├─ src/ # Routes, Models (Mongoose), Controllers
├─ frontend/ # React + Vite (Tailwind UI)
│  ├─ src/ # Pages, Hooks, Context, Components
```

🛠️ The Tech Ecosystem
<div align="center">
    <table>
        <tr>
            <td align="center"><b>UI/UX (Matrix)</b></td>
            <td align="center"><b>Data Nexus</b></td>
            <td align="center"><b>Backend</b></td>
            <td align="center"><b>Intelligence</b></td>
        </tr>
        <tr>
            <td><img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB"/></td>
            <td><img src="https://img.shields.io/badge/MongoDB-4EAA25?style=for-the-badge&logo=mongodb&logoColor=white"/></td>
            <td><img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"/></td>
            <td><img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white"/></td>
        </tr>
        <tr>
            <td><img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white"/></td>
            <td><img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white"/></td>
            <td><img src="https://img.shields.io/badge/Scikit--Learn-F7931E?style=for-the-badge&logo=scikitlearn&logoColor=white"/></td>
            <td><img src="https://img.shields.io/badge/Gemini_LLM-1E90FF?style=for-the-badge&logo=google&logoColor=white"/></td>
        </tr>
    </table>
</div>

👨‍💻 Engineering Core
<div align="center">
    <a href="#"><img src="https://github-readme-stats.vercel.app/api?username=your-username&show_icons=true&theme=tokyonight" height="150"/></a>
    <a href="#"><img src="https://streak-stats.demolab.com/?user=your-username&theme=tokyonight" height="150"/></a>
</div>

License: MIT - Built responsibly, deployed ethically.
