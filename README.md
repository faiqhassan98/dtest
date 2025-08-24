DTest - A React/Next.js Test Preparation App
DTest is a full-stack React/Next.js application with admin and user dashboards for test preparation, focusing on reading skills. Admins manage users and test content, while users take reading tests with instant evaluations. Data is stored in a local MongoDB database.
Prerequisites
Ensure the following are installed on your system:

Node.js (v18 or later): Required for installing frontend and backend dependencies.
Docker: Required to build and run the application containers.
Docker Compose: Required to manage multi-container setup.
NGINX: Used as the web server (included in the Docker setup).

Verify installations:
node --version
docker --version
docker-compose --version

Project Structure

dtest-frontend/app/: Frontend Next.js application.
dtest-backend/: Backend Node.js/Express application.
nginx/: NGINX configuration (default.conf).
docker-compose.yml: Docker Compose configuration for all services.
.env: Environment variables for backend (ensure it exists in dtest-backend/).

Setup Instructions

Clone the Repository
git clone <repository-url>
cd dtest


Install Frontend DependenciesNavigate to the frontend directory and install dependencies:
cd dtest-frontend/app
npm install


Install Backend DependenciesNavigate to the backend directory and install dependencies:
cd ../../dtest-backend
npm install


Configure Environment Variables

Ensure a .env file exists in dtest-backend/ with the following (adjust as needed):PORT=5000
MONGO_URI=mongodb://mongo:27017/dtest
JWT_SECRET=your_jwt_secret
SMTP_HOST=mailhog
SMTP_PORT=1025
SMTP_FROM=no-reply@dtest.local
DEFAULT_ADMIN_EMAIL=admin@dtest.local
DEFAULT_ADMIN_PASSWORD=Admin123!
DEFAULT_ADMIN_FIRST=System
DEFAULT_ADMIN_LAST=Admin


The backend automatically creates a bootstrap admin user with these credentials on first run.


Build the Docker ImagesBuild the Docker images for all services (frontend, backend, NGINX, MongoDB, Mailhog) without cache:
cd ..
sudo docker-compose build --no-cache


Run the ApplicationStart all containers in detached mode:
sudo docker-compose up -d


Verify Running ContainersCheck the status of all containers to ensure they are running:
sudo docker-compose ps -a



Accessing the Application

Login Page: Open http://localhost (or http://localhost:80) in your browser.
Default Admin Credentials:
Email: admin@dtest.local (or as set in .env)
Password: Admin123! (or as set in .env)


Available Pages:
Login: http://localhost/
User Dashboard: http://localhost/user/dashboard (after login as user)
Admin Dashboard: http://localhost/admin/dashboard (after login as admin)
Test Page: http://localhost/test?id=<testId> (accessed via user dashboard after starting a test)



Troubleshooting

Login Issues:
Check backend logs for bootstrap admin creation:sudo docker-compose logs backend


Verify MongoDB users:sudo docker-compose exec mongo mongosh -u root -p example --eval "db.users.find()" dtest


Ensure .env credentials match login attempt (email is lowercase).


NGINX Errors:
Check logs: sudo docker-compose logs nginx
Test proxy: curl http://localhost/api/auth/login


Frontend/Backend Issues:
Check logs: sudo docker-compose logs frontend or sudo docker-compose logs backend


MongoDB Connection:
Ensure MONGO_URI in .env is correct and MongoDB container is running.



Notes

The application uses NGINX to proxy requests: / to frontend (port 3000), /api/ to backend (port 5000).
Mailhog is used for email testing (view at http://localhost:8025).
Create tests/users via Postman (e.g., POST http://localhost:5000/api/users with admin token) or implement missing admin UI.
Documentation of credentials is in dtest-backend/.env.

For further assistance, check logs or consult the project requirements.