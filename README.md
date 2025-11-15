# DBT Portal — Demo

This repository is a demo government-style portal (frontend + backend) with role-based dashboards, multilingual toggle, campaign carousel, background video, and a simple Express + MongoDB backend with dummy data.

Quick overview:
- Frontend: `frontend/index.html`, `frontend/styles.css`, `frontend/script.js`
- Backend: `backend/app.js`, routes in `backend/routes/`, models in `backend/models/`
- Dummy data seeder: `backend/data/dummyData.js`

Prerequisites
- Node.js installed
- MongoDB running locally (default URI used: `mongodb://127.0.0.1:27017/dbt_portal_demo`)

Run (PowerShell)
1. Install backend dependencies (from project root or backend folder):

```powershell
cd "C:\Users\Raunak gupta\Desktop\DBT\backend"
npm install
```

2. Seed dummy data (connects to local MongoDB and inserts sample documents):

```powershell
node .\data\dummyData.js
```

3. Start the backend (which also serves the frontend static files):

```powershell
node .\app.js
# or: npm start
```

4. Open the frontend in your browser:

```
http://localhost:4000/
```

Notes & sample API calls
- Authentication (demo):

```powershell
# Login (demo user stored in backend/routes/auth.js)
curl -X POST http://localhost:4000/api/auth/login -H "Content-Type: application/json" -d '{"username":"admin@example.com","password":"admin123"}'
```

- Check student DBT status by Aadhaar:

```powershell
curl -X POST http://localhost:4000/api/students/check -H "Content-Type: application/json" -d '{"aadhaar":"111122223333"}'
```

- Volunteer check (credits):

```powershell
# Replace VOLUNTEER_ID with an actual ObjectId from seeded volunteers
curl -X POST http://localhost:4000/api/volunteers/check -H "Content-Type: application/json" -d '{"volunteerId":"VOLUNTEER_ID","aadhaar":"111122223333"}'
```

- Admin campaign management (create):

```powershell
curl -X POST http://localhost:4000/api/admin/campaigns -H "Content-Type: application/json" -d '{"title":"New Camp","description":"Demo","startDate":"2025-11-15","endDate":"2025-11-20","status":"upcoming"}'
```

Important implementation notes
- JWT secret: demo value used in `backend/routes/auth.js` (`demo-secret`) — replace in production.
- SMS/WhatsApp: demo 'forgot' endpoint logs to console and does not call real providers.
- Multilingual support: frontend provides a language switcher UI but translation data loading is not implemented (placeholder). Replace with i18n solution (e.g., i18next) for production.
- Accessibility: `A+` button toggles larger font; contrast toggles and further features can be added.
- Heatmap and real-time analytics: placeholders only — integrate a charting library + geo-data for production.

If you'd like, I can:
- Run `npm install` in `backend` for you and start the server now.
- Seed the database and open the frontend in a browser (if you allow terminal commands here).
