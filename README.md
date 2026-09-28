# CareerSync

CareerSync is a full-stack career and recruitment platform that connects students/job seekers with recruiters through professional profiles, job discovery, applications, candidate discovery, invitations, and recruitment workflows.

The project was built as a production-ready portfolio project using React, Django REST Framework, PostgreSQL, JWT authentication, and cloud deployment.

---

## Live Application

### Frontend
https://career-sync-sepia.vercel.app

### Backend API
https://careersync-api-o77s.onrender.com

### Example API Endpoint
https://careersync-api-o77s.onrender.com/api/jobs/

---

## Tech Stack

### Frontend

- React
- Vite
- JavaScript
- Tailwind CSS
- React Router
- Fetch API

### Backend

- Python
- Django
- Django REST Framework
- Simple JWT
- Gunicorn
- WhiteNoise

### Database

- PostgreSQL
- Neon PostgreSQL in production
- SQLite for local development

### Cloud / Deployment

- Vercel — frontend
- Render — backend
- Neon — PostgreSQL database
- Cloudinary — profile images, resumes and company logos
- GitHub — source control

---

## Main Features

### Authentication

- Student registration
- Recruiter registration
- Login
- JWT access token
- JWT refresh token
- Protected routes
- Role-based authorization
- Session expiration handling

---

## Student Features

Students can:

- Create and manage a professional profile
- Add a professional headline
- Add biography/about information
- Add location
- Add skills
- Add education
- Add work experience
- Upload profile photo
- Upload resume
- Add GitHub profile
- Add LinkedIn profile
- Browse available jobs
- Search and filter jobs
- View job details
- Apply for jobs
- Track application status
- Withdraw eligible applications
- Save jobs
- Receive recruiter invitations
- Accept or reject invitations
- View student dashboard

---

## Recruiter Features

Recruiters can:

- Create recruiter accounts
- Access recruiter dashboard
- Post jobs
- Edit their own jobs
- Delete their own jobs
- Upload company logos
- View applicants
- Review candidate applications
- Update application status
- Search candidates
- Filter talent
- View complete candidate profiles
- View candidate education
- View candidate experience
- View candidate resume
- Contact candidates
- Invite candidates to jobs

---

## Application Workflow

CareerSync supports the following application statuses:

```text
Applied
Under Review
Shortlisted
On Hold
Accepted
Rejected
Withdrawn