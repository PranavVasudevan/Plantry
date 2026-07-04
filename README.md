# Plantry

> **A behavior-aware grocery planning assistant that learns from your household's shopping habits to suggest what you might forget.**

Plantry helps users create smarter shopping lists by learning from their own purchase history instead of relying on generic recommendations. It combines lightweight machine learning models with a modern web application to identify frequently bought-together items, forgotten products, and recurring shopping patterns.

---

## Features

*  Smart shopping list creation from natural language input
*  Frequently bought-together item suggestions
*  Forgotten item prediction using probability-based scoring
*  Recurring item reminders based on purchase history
*  User feedback to improve future recommendations
*  Shopping history and household insights
*  Secure authentication with Firebase Authentication

---

##  Architecture

```text
                React + TypeScript Frontend
                           │
                           ▼
                 Express.js Backend API
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
 Firebase Auth      Firestore Database    ML Models
                                          • Association Mining
                                          • Bayesian Scoring
                                          • Temporal Patterns
```

---

##  Machine Learning

Plantry generates recommendations by combining three lightweight and explainable models:

| Model               | Purpose                                   |
| ------------------- | ----------------------------------------- |
| Association Mining  | Suggests items frequently bought together |
| Bayesian Scoring    | Predicts items commonly forgotten         |
| Temporal Heuristics | Identifies items due for repurchase       |

Models are trained **per household**, making recommendations personalized rather than based on global shopping trends.

---

##  Tech Stack

| Category       | Technologies                                        |
| -------------- | --------------------------------------------------- |
| Frontend       | React, TypeScript, Vite, Tailwind CSS               |
| Backend        | Node.js, Express                                    |
| Database       | Firebase Firestore                                  |
| Authentication | Firebase Authentication                             |
| AI             | Google Gemini *(optional natural-language parsing)* |
| Analytics      | Looker Studio                                       |

---

##  Project Structure

```text
Plantry/
│
├── backend/
│   ├── jobs/              # Scheduled background jobs
│   ├── middleware/        # Authentication & error handling
│   ├── routes/            # REST API endpoints
│   ├── services/          # Business logic
│   ├── utils/
│   ├── firebaseAdmin.js
│   └── index.js
│
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # Authentication context
│   │   ├── lib/           # Firebase configuration
│   │   ├── pages/         # Application pages
│   │   ├── services/      # API client
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── vite.config.ts
│
├── ml-training/
│   ├── models/            # ML models
│   ├── trainAll.js        # Train all recommendation models
│   ├── testInference.js   # Test inference pipeline
│   └── fetchData.js
│
├── firestore.rules
├── render.yaml
├── package.json
└── README.md
```


---

##  Installation

Clone the repository:

```bash
git clone <repository-url>
cd Plantry
```

Install dependencies:

```bash
npm install
```

Create the required `.env` files from the provided `.env.example` files and configure your Firebase credentials.

---

##  Running the Project

Start the backend:

```bash
npm run dev:backend
```

Start the frontend:

```bash
npm run dev:frontend
```

The application will be available locally after both services are running.

---

##  Training the Models

After generating shopping history through the application, retrain the recommendation models:

```bash
cd ml-training
node trainAll.js <firebase-user-uid>
```

To test model predictions:

```bash
node testInference.js <firebase-user-uid> milk bread
```

---

##  Security

* Firebase Authentication for user sign-in
* Backend verifies every Firebase ID token
* Firestore is accessed only through the backend
* Each user's data is isolated using their Firebase UID

---

##  Future Improvements

* Multi-user household support
* Automatic model retraining
* Better seasonal and contextual recommendations
* Cross-household pattern learning while preserving privacy
* Smarter natural language understanding

---

