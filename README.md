<div align="center">



# MaMa Care
**AI-powered maternal health platform for personalized care, proactive risk insights, and a calmer pregnancy journey.**

<br/>

<!-- Tech Stack Shields (flat-square) -->
<img src="https://img.shields.io/badge/MongoDB-0b0f1a?style=flat-square&logo=mongodb&logoColor=47A248" />
<img src="https://img.shields.io/badge/Express-0b0f1a?style=flat-square&logo=express&logoColor=white" />
<img src="https://img.shields.io/badge/React-0b0f1a?style=flat-square&logo=react&logoColor=61DAFB" />
<img src="https://img.shields.io/badge/Node.js-0b0f1a?style=flat-square&logo=nodedotjs&logoColor=3C873A" />
<img src="https://img.shields.io/badge/FastAPI-0b0f1a?style=flat-square&logo=fastapi&logoColor=009688" />
<img src="https://img.shields.io/badge/Scikit--learn-0b0f1a?style=flat-square&logo=scikitlearn&logoColor=F7931E" />
<img src="https://img.shields.io/badge/Vite-0b0f1a?style=flat-square&logo=vite&logoColor=646CFF" />

<br/><br/>

<!-- Optional dynamic stats -->
<a href="#"><img src="https://github-readme-stats.vercel.app/api?username=karthiksai2000&show_icons=true&theme=tokyonight" height="140"/></a>
<a href="#"><img src="https://streak-stats.demolab.com/?user=your-karthiksai2000&theme=tokyonight" height="140"/></a>

</div>

---

## Why This Exists
Modern pregnancy care is fragmented. Data lives across apps, visits, and paper notes. **MaMa Care** unifies health tracking, AI-assisted insights, and personalized guidance into a single, secure, developer-friendly platform.

---

## Architecture (System Flow)
```mermaid
%%{init: {"theme":"dark", "themeVariables":{"primaryColor":"#0b0f1a","primaryTextColor":"#e6edf3","primaryBorderColor":"#8be9fd","lineColor":"#8be9fd","secondaryColor":"#161b22","tertiaryColor":"#0b0f1a"}}}%%
sequenceDiagram
    autonumber
    participant UI as React UI
    participant API as Node/Express API
    participant DB as MongoDB
    participant AI as FastAPI AI Services
    participant LLM as Gemini LLM

    UI->>API: Auth, health inputs, chat
    API->>DB: Store and fetch patient data
    API->>AI: Diet plan and symptom analysis
    API->>LLM: Contextual health assistant
    AI-->>API: Predictions and recommendations
    LLM-->>API: Conversational response
    API-->>UI: Unified response payload
```

---

## Key Features
<div align="center">
<table>
  <tr>
    <td align="center" width="240">
      <img src="https://img.icons8.com/fluency/48/health-checkup.png"/><br/>
      <b>Health Tracking</b><br/>
      Metrics, trends, and journaling.
    </td>
    <td align="center" width="240">
      <img src="https://img.icons8.com/fluency/48/artificial-intelligence.png"/><br/>
      <b>AI Guidance</b><br/>
      Smart diet and symptom insights.
    </td>
    <td align="center" width="240">
      <img src="https://img.icons8.com/fluency/48/chatbot.png"/><br/>
      <b>Maternal Chatbot</b><br/>
      Context-aware support, 24/7.
    </td>
  </tr>
  <tr>
    <td align="center" width="240">
      <img src="https://img.icons8.com/fluency/48/baby.png"/><br/>
      <b>Baby Growth</b><br/>
      Weekly progress and milestones.
    </td>
    <td align="center" width="240">
      <img src="https://img.icons8.com/fluency/48/heart-with-pulse.png"/><br/>
      <b>Risk Insights</b><br/>
      Predictive scoring and alerts.
    </td>
    <td align="center" width="240">
      <img src="https://img.icons8.com/fluency/48/lock.png"/><br/>
      <b>Secure by Design</b><br/>
      Auth, privacy, and clean APIs.
    </td>
  </tr>
</table>
</div>

---

## Core Logic (Risk Scoring Example)
We model pregnancy risk as a weighted composite from vitals, history, and symptoms:

$$
\text{RiskScore} = \sigma\left(
W_1 \cdot \text{BP} +
W_2 \cdot \text{BMI} +
W_3 \cdot \text{Glucose} +
W_4 \cdot \text{Age} +
W_5 \cdot \text{Symptoms}
\right)
$$

Where $\sigma(x)=\frac{1}{1+e^{-x}}$ ensures a stable, interpretable 0 to 1 risk score.

---

## Quick Start (3 Steps)
1) **Clone and install**
```bash
git clone https://github.com/your-username/mama-care.git
cd mama-care
```

2) **Install dependencies**
```bash
# backend
cd backend && npm install

# frontend
cd ../frontend && npm install

# ai services
cd ../ai_services && pip install -r requirements.txt
```

3) **Run services**
```bash
# backend
cd backend && npm run dev

# frontend
cd ../frontend && npm run dev

# ai services
cd ../ai_services && uvicorn app:app --reload --port 8001
```

---

## Folder Structure
```
mama-care/
├─ ai_services/
│  ├─ app.py
│  ├─ diet_service.py
│  └─ symptom_service.py
├─ backend/
│  ├─ src/
│  │  ├─ routes/
│  │  ├─ models/
│  │  └─ services/
├─ frontend/
│  ├─ src/
│  │  ├─ pages/
│  │  ├─ components/
│  │  └─ context/
```

---

## Tech Stack (Mouth-Watering Grid)
<div align="center">
<table>
  <tr>
    <td><img src="https://img.shields.io/badge/Frontend-React+Vite-0b0f1a?style=flat-square&logo=react&logoColor=61DAFB"/></td>
    <td><img src="https://img.shields.io/badge/Backend-Node+Express-0b0f1a?style=flat-square&logo=express&logoColor=white"/></td>
    <td><img src="https://img.shields.io/badge/DB-MongoDB-0b0f1a?style=flat-square&logo=mongodb&logoColor=47A248"/></td>
  </tr>
  <tr>
    <td><img src="https://img.shields.io/badge/AI-FastAPI-0b0f1a?style=flat-square&logo=fastapi&logoColor=009688"/></td>
    <td><img src="https://img.shields.io/badge/ML-Scikit--learn-0b0f1a?style=flat-square&logo=scikitlearn&logoColor=F7931E"/></td>
    <td><img src="https://img.shields.io/badge/Cloud-Optional-0b0f1a?style=flat-square&logo=vercel&logoColor=white"/></td>
  </tr>
</table>
</div>

---

## Roadmap
- [x] Auth and onboarding flow
- [x] Health tracking and trends
- [x] AI diet planning
- [x] Symptom analysis
- [ ] LLM personalization feedback loop
- [ ] Doctor portal integrations
- [ ] Offline-first mobile experience

---

## Screenshot
<div align="center">
<img src="home.png" width="90%" style="border-radius:16px; box-shadow:0 20px 60px rgba(0,0,0,0.35);" />
</div>

---

## License
MIT - build responsibly and care for patients.
