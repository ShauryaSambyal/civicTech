# CivicTech 🏙️

> **A community-driven civic issue reporting and tracking platform that empowers citizens to report local problems, discover existing issues, and collectively improve their neighbourhood.**

CivicTech is a modern web platform designed to make reporting and tracking local civic problems simple, transparent, and community-driven.

Users can report issues such as damaged roads, broken streetlights, garbage accumulation, drainage problems, and other neighbourhood concerns. Reported issues can then be viewed by the community, opened for more details, and upvoted to highlight problems that require greater attention.

---

## ✨ Features

### 🏠 Home Dashboard

The home page provides an overview of the civic issues currently being tracked.

Users can:

* Browse reported civic issues
* View issue information
* Open an issue to see its details
* Upvote issues
* Monitor the total number of tracked issues

---

### 📢 Report an Issue

CivicTech allows users to submit a new civic issue directly through the website.

A report can contain:

* Issue information
* Location/address
* Image of the issue
* Reporter information
* Automatically generated issue date
* Initial issue status

Once submitted, the issue is added to the application's issue list and the user is returned to the home dashboard.

---

### 👍 Community Upvoting

Community members can upvote issues they consider important.

Upvotes can help highlight problems that affect more people and can provide a simple mechanism for prioritising civic complaints.

---

### 🔎 Issue Details

Each issue can be opened to display additional information through an issue-detail interface.

The application supports:

* Issue details
* Location
* Reporter information
* Issue status
* Number of upvotes
* Issue image
* Upvoting directly from the details interface

---

### 📊 Analytics

The Analytics section provides a dedicated view for analysing the reported issues.

It receives the complete issue collection from the application and can be used to present meaningful insights about the current civic issues.

---

### 🔔 Notifications

CivicTech includes a toast notification system for providing feedback to users when actions are performed.

---

### 👤 User Context

The current application maintains a user context for the active user and associates newly reported issues with that user.

---

## 🧭 Website Navigation

The application is organised around three primary sections:

```text
CivicTech
│
├── 🏠 Home
│   ├── View reported issues
│   ├── Open issue details
│   └── Upvote issues
│
├── 📢 Report Issue
│   ├── Enter issue information
│   ├── Provide location
│   ├── Upload issue image
│   └── Submit report
│
└── 📊 Analytics
    └── Analyse tracked civic issues
```

### 1. Home

Start from the **Home** section to browse existing civic issues.

Select an issue to open its details and use the upvote functionality when appropriate.

### 2. Report Issue

Navigate to **Report Issue** from the navigation bar.

Fill in the required information, provide the location, and optionally attach an image before submitting the report.

After submission, the newly created issue is added to the issue list and the application navigates back to Home.

### 3. Analytics

Navigate to **Analytics** to view the application's issue analytics.

---

## 🛠️ Tech Stack

### Frontend

* **React 19** — UI development
* **Vite 7** — Development server and build tool
* **Tailwind CSS 4** — Styling
* **Lucide React** — Icons
* **JavaScript / JSX** — Application logic

### Data / Backend Dependencies

* **MongoDB** — Database dependency included in the project

### Development Tools

* ESLint
* React Hooks ESLint plugin
* React Refresh
* Vite React plugin

The project's `package.json` defines Vite development, production build, linting, and preview scripts.

---

# 📋 Prerequisites

Before running CivicTech locally, make sure you have the following installed:

* **Node.js** — LTS version recommended
* **npm**
* **Git**

You can verify your installation using:

```bash
node --version
npm --version
git --version
```

---

# 🚀 Getting Started

## 1. Clone the Repository

Clone the CivicTech repository:

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

Move into the project directory:

```bash
cd civictech
```

> Replace `<YOUR_GITHUB_REPOSITORY_URL>` with the actual GitHub repository URL.

---

## 2. Install Dependencies

Install all required npm packages:

```bash
npm install
```

The project uses React, React DOM, Tailwind CSS, Lucide React, MongoDB, Vite, and the associated development tooling defined in `package.json`.

---

## 3. Start the Development Server

Run:

```bash
npm run dev
```

This starts the Vite development server.

Vite will provide a local URL, typically similar to:

```text
http://localhost:5173
```

Open the displayed URL in your browser.

The project's `dev` script is configured as:

```json
"dev": "vite"
```

---

# 🏗️ Available npm Scripts

| Command           | Description                         |
| ----------------- | ----------------------------------- |
| `npm run dev`     | Starts the Vite development server  |
| `npm run build`   | Creates a production build          |
| `npm run lint`    | Runs ESLint                         |
| `npm run preview` | Serves the production build locally |

These scripts are defined directly in the project's `package.json`.

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

### Preview Production Build

```bash
npm run preview
```

---

# 📁 Project Architecture

The main application is structured around reusable React components.

The application entry component imports the following major components:

```text
App.jsx
│
├── NavBar
├── HomePage
├── ReportIssuePage
├── AnalyticsPage
├── IssueDetailModal
├── ToastHost
└── constants / mock issue data
```

These components are explicitly imported and composed by `App.jsx`.

A typical project structure is:

```text
civictech/
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── NavBar.jsx
│   │   ├── HomePage.jsx
│   │   ├── ReportIssuePage.jsx
│   │   ├── AnalyticsPage.jsx
│   │   ├── IssueDetailModal.jsx
│   │   ├── Toast.jsx
│   │   └── constants.jsx
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── ...
│
├── package.json
├── vite.config.js
├── eslint.config.js
└── README.md
```

> The exact file structure may vary depending on the rest of the repository.

---

# 🔄 Application Flow

The core application state is maintained by the main React application component.

The application maintains:

* The currently active navigation tab
* The collection of civic issues
* The currently selected issue
* The current user

The default issue collection is loaded from `MOCK_ISSUES`.

### Reporting an Issue

When a user submits a new report, CivicTech creates an issue containing:

```text
ID
Issue information
Status
Upvotes
Creation date
Reporter
Location
Image
```

New issues initially receive:

```text
status = reported
upvotes = 0
```

The application also records the creation date and reporter information.

After successfully creating an issue, the application returns the user to the Home section.

---

# 👍 Upvote Flow

When an issue is upvoted:

```text
User
  ↓
Selects an issue
  ↓
Clicks Upvote
  ↓
Issue ID is identified
  ↓
Upvote count increases
  ↓
Updated issue is displayed
```

The application updates the selected issue's upvote count and also keeps the open issue-detail view synchronised.

---

# 🖼️ Issue Images

When an image is uploaded with an issue report, the application creates a browser object URL for displaying the uploaded image.

If no image is provided, the application currently falls back to a default image.

---

# 🗃️ Current Data Model

An issue follows the general structure:

```javascript
{
  id,
  ...issueData,
  status,
  upvotes,
  createdAt,
  reportedBy,
  location,
  image
}
```

For newly reported issues, the application sets the initial status to:

```text
reported
```

and the initial upvote count to:

```text
0
```

---

# 🎨 UI & Design

CivicTech uses a modern dark-themed civic-tech interface with:

* Responsive layouts
* Navigation-based application sections
* Animated page transitions
* Ambient visual effects
* Issue cards/details
* Toast notifications
* Responsive spacing and typography

The main application also includes an ambient visual background layer and fade-in animation when switching between sections.

---

# 📊 Issue Tracking

The application maintains a live issue count based on the number of issues currently held in application state.

The footer displays the number of tracked issues dynamically:

```text
X issues tracked
```

---

# 🔧 Configuration

If environment variables or external services are added to the project, create a `.env` file in the project root:

```env
# Example
VITE_API_URL=your_api_url
MONGODB_URI=your_mongodb_connection_string
```

> Do not commit secrets, API keys, database credentials, or private configuration files to GitHub.

For Vite frontend variables that need to be exposed to client-side code, use the `VITE_` prefix.

Example:

```env
VITE_API_URL=https://example.com/api
```

---

# 🧪 Testing the Application Locally

After running:

```bash
npm run dev
```

test the following workflow:

### Home

* [ ] Home page loads
* [ ] Existing issues are displayed
* [ ] Issue details can be opened
* [ ] Issue can be upvoted
* [ ] Upvote count updates correctly

### Report Issue

* [ ] Report Issue page opens
* [ ] Issue information can be entered
* [ ] Location can be provided
* [ ] Image can be selected
* [ ] Report can be submitted
* [ ] New issue appears on Home

### Analytics

* [ ] Analytics page opens
* [ ] Issue data is displayed correctly

### General

* [ ] Navigation works
* [ ] Toast notifications appear correctly
* [ ] Application is responsive
* [ ] No console errors are present

---

# 🏭 Production Build

To create a production-ready build:

```bash
npm run build
```

Vite will generate the production output.

You can locally preview the production build using:

```bash
npm run preview
```

---

# ☁️ Deployment

CivicTech can be deployed to modern frontend hosting platforms such as:

* Render
* Vercel
* Netlify
* Cloudflare Pages

For a Vite application, the typical deployment configuration is:

### Build Command

```bash
npm run build
```

### Output Directory

```text
dist
```

### Development Command

```bash
npm run dev
```

For production hosting, use the platform's recommended configuration for Vite rather than exposing the development server.

---

# 🔐 Security Considerations

If CivicTech is extended with a production backend, consider implementing:

* User authentication
* Authorisation
* Input validation
* API rate limiting
* Secure image uploads
* File type validation
* Database access controls
* Environment-variable based secrets
* HTTPS
* Protection against spam reports
* Protection against duplicate reports
* Server-side validation of all submitted data

Never expose database credentials or private API keys in the frontend.

---

# 🚧 Current Implementation Notes

The current frontend implementation maintains the issue collection in React state and initially loads issue information from `MOCK_ISSUES`.

This means the current frontend behaviour should be understood as a client-side prototype unless the rest of the repository contains a backend/data-persistence layer.

Although MongoDB is included as a project dependency, the supplied `App.jsx` does not itself establish a database connection; database integration should therefore be documented separately once the backend implementation is included.

---

# 🔮 Future Enhancements

Potential improvements for CivicTech include:

* [ ] Real MongoDB persistence
* [ ] User authentication
* [ ] Citizen profiles
* [ ] Government/municipality accounts
* [ ] Issue assignment to authorities
* [ ] Issue status workflow
* [ ] Email/SMS notifications
* [ ] Real-time issue updates
* [ ] Interactive maps
* [ ] GPS-based issue reporting
* [ ] Duplicate issue detection
* [ ] Image-based issue classification
* [ ] AI-powered issue categorisation
* [ ] Priority scoring
* [ ] Advanced analytics dashboard
* [ ] Admin dashboard
* [ ] Authority response tracking
* [ ] Public issue heatmaps
* [ ] Mobile/PWA support

---

# 🤝 Contributing

Contributions are welcome.

### 1. Fork the repository

Create your own fork of the project.

### 2. Clone your fork

```bash
git clone <YOUR_FORK_URL>
cd civictech
```

### 3. Create a feature branch

```bash
git checkout -b feature/your-feature
```

### 4. Install dependencies

```bash
npm install
```

### 5. Start the development server

```bash
npm run dev
```

### 6. Make your changes

Implement and test your changes locally.

### 7. Run linting

```bash
npm run lint
```

### 8. Build the project

```bash
npm run build
```

### 9. Commit your changes

```bash
git add .
git commit -m "Add: your feature"
```

### 10. Push your branch

```bash
git push origin feature/your-feature
```

Then open a Pull Request.

---

# 🐛 Troubleshooting

## `npm` is not recognised

Install Node.js and restart your terminal.

Verify:

```bash
node --version
npm --version
```

---

## Dependencies are missing

Run:

```bash
npm install
```

Then:

```bash
npm run dev
```

---

## Port 5173 is already in use

Stop the existing Vite process or allow Vite to select another available port.

---

## Build fails

Try reinstalling dependencies:

```bash
rm -rf node_modules
npm install
npm run build
```

On Windows PowerShell:

```powershell
Remove-Item -Recurse -Force node_modules
npm install
npm run build
```

---

# 📌 Project Status

**Status:** Active Development 🚀

CivicTech currently provides the core frontend experience for reporting, viewing, analysing, and upvoting local civic issues.

The project can be further extended into a complete citizen-to-authority civic issue management platform by introducing persistent storage, authentication, authority workflows, maps, notifications, and advanced analytics.

---

# 🌐 Live Demo

**CivicTech:**
https://civictech-pedk.onrender.com

---

# 👨‍💻 Development

CivicTech was built as a civic technology project focused on making local issue reporting more accessible and community-driven.

The core philosophy is simple:

> **Identify problems. Report them. Bring the community together. Make neighbourhoods better.**

---
## ⭐ Support

If you find CivicTech useful, consider giving the repository a ⭐ on GitHub.

Contributions, suggestions, bug reports, and feature requests are welcome.
