# GlobalTrade BI

**Enterprise Business Intelligence Suite for Import/Export Management**

GlobalTrade BI is a modern, responsive, and comprehensive Business Intelligence application designed for large-scale import/export businesses. It integrates data from various departments—Finance, Inventory, Sales, HR, and Administration—into a unified command center with AI-powered insights.

## 🚀 Features

*   **Executive Command Center:** High-level overview of global net profit, supply chain volume, and operational risks.
*   **Departmental Dashboards:** Dedicated views for Finance, Accounting, Sales, Inventory, HR, and System Administration.
*   **AI Analyst (Prof. Fad):** Integrated Google Gemini AI for real-time data analysis, trend forecasting, and natural language queries.
*   **Warehouse Management:** Real-time inventory tracking, product catalog with specifications, and stock status alerts.
*   **Customer Portal:** B2B client access for checking credit limits, browsing products, and tracking orders.
*   **Accounting Ledger:** General ledger management, tax scheduling, and financial ratio analysis tools.
*   **Role-Based Access Control (RBAC):** Simulated security model with specific views and permissions for different user roles.
*   **Data Administration:** Centralized registry for managing company-wide datasets.
*   **Print-Ready Reports:** CSS-optimized layouts for generating PDF reports directly from dashboards.

## 🛠️ Tech Stack (Application Layer)

*   **Frontend:** React 18, TypeScript, Vite
*   **Styling:** Tailwind CSS
*   **Icons:** Lucide React
*   **Charts:** Recharts
*   **AI Engine:** Google GenAI SDK (Gemini 2.5 Flash)
*   **State Management:** React Hooks & Context

## 📦 Installation & Setup

### Prerequisites

*   Node.js (v18 or higher)
*   npm or yarn
*   A Google Gemini API Key

### Steps

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-org/globaltrade-bi.git
    cd globaltrade-bi
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment:**
    Create a `.env` file in the root directory and add your API key:
    ```env
    API_KEY=your_google_gemini_api_key_here
    ```

4.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    The app will be available at `http://localhost:5173`.

5.  **Build for Production:**
    ```bash
    npm run build
    ```

## 🔐 Security & Architecture

This application is designed to be deployed within a **Micro-Datacenter** on a secure local intranet. While the application code provided here represents the frontend and logic layer, the production environment relies on a specific set of open-source infrastructure tools to ensure data sovereignty and security.

Please refer to [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed infrastructure specifications.

## 📄 License

Proprietary software developed for GlobalTrade Logistics Inc. All rights reserved.
