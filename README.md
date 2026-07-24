# NovaBank LoanSphere

A comprehensive digital loan origination and account onboarding system built with modern web technologies. NovaBank LoanSphere provides a complete banking platform for customers to apply for loans, open accounts, and track applications, while offering staff members powerful tools for application management and approval workflows.

## 🌟 Features

### Customer Portal
- **User Authentication**: Secure login and registration with JWT-based authentication
- **Dashboard**: Comprehensive overview of accounts, active loans, pending applications, and notifications
- **Loan Applications**: Multi-step loan application wizard with real-time EMI calculations
- **Account Opening**: Digital account opening with KYC verification
- **Application Tracking**: Real-time status tracking of loan applications
- **Notifications**: In-app notification system for important updates

### Staff Portal
- **Application Queue**: Role-based application queue (Credit Officer, Branch Manager, Risk Officer)
- **Approval Workflow**: Multi-stage approval process with decision tracking
- **Credit Assessment**: Automated credit scoring and risk assessment
- **Document Management**: Upload and review of loan documents
- **Analytics Dashboard**: KPI metrics, application statistics, and performance analytics

### Backend Services
- **RESTful APIs**: Comprehensive REST API with proper error handling
- **JWT Authentication**: Secure token-based authentication system
- **Credit Scoring**: Automated credit assessment with CRIB integration
- **Workflow Management**: Configurable approval workflows
- **Reporting**: Advanced reporting and analytics capabilities
- **Document Storage**: Secure file upload and management

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Fetch API with custom service layer
- **State Management**: React Hooks (useState, useEffect, useMemo)

### Backend
- **Framework**: Spring Boot 3.3.1
- **Language**: Java 17
- **Database**: H2 (Development) / MySQL (Production)
- **ORM**: Spring Data JPA with Hibernate
- **Security**: Spring Security with JWT
- **API Documentation**: SpringDoc OpenAPI (Swagger)
- **Build Tool**: Maven

### Key Libraries
- **JWT**: JJWT (io.jsonwebtoken) 0.11.5
- **Lombok**: Project Lombok for boilerplate reduction
- **Validation**: Jakarta Bean Validation
- **Database**: H2 Database / MySQL Connector

## 🏗 Architecture

### System Architecture
```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   Frontend      │         │   Backend       │         │   Database      │
│   (React)       │◄────────►│   (Spring Boot) │◄────────►│   (MySQL/H2)    │
│   Port: 5176    │  HTTP   │   Port: 8080    │  JDBC   │   Port: 3306    │
└─────────────────┘         └─────────────────┘         └─────────────────┘
```

### Backend Layer Structure
```
┌─────────────────────────────────────────────────────────────┐
│                    Controllers Layer                        │
│  (REST API Endpoints, Request Validation)                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Services Layer                           │
│  (Business Logic, Credit Assessment, Workflows)              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Repository Layer                           │
│  (Data Access, JPA/Hibernate Operations)                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Database Layer                           │
│  (MySQL/H2 Database, Tables, Relationships)                  │
└─────────────────────────────────────────────────────────────┘
```

## 📋 Prerequisites

- **Java**: JDK 17 or higher
- **Node.js**: v18 or higher
- **Maven**: 3.8 or higher
- **MySQL**: 8.0 or higher (for production)
- **Git**: Latest version

## 🚀 Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd NovaBank-LoanSphere
```

### 2. Backend Setup

#### Development (H2 Database)
```bash
cd backend
mvn spring-boot:run
```

The backend will start on `http://localhost:8080` with H2 in-memory database.

#### Production (MySQL Database)
1. Create MySQL database:
```sql
CREATE DATABASE novabank_loansphere;
```

2. Update `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/novabank_loansphere
spring.datasource.username=root
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
```

3. Run the application:
```bash
cd backend
mvn spring-boot:run
```

4. Initialize database schema:
```bash
mysql -u root -p novabank_loansphere < backend/schema.sql
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:5173` (or next available port).

### 4. Access the Application

- **Customer Portal**: http://localhost:5173
- **Staff Portal**: http://localhost:5173/staff
- **API Documentation**: http://localhost:8080/swagger-ui.html
- **H2 Console** (Development): http://localhost:8080/h2-console

## 🔐 Default Credentials

### Staff Users
- **Credit Officer**: `credit_officer` / `password123`
- **Branch Manager**: `branch_manager` / `password123`
- **Risk Officer**: `risk_officer` / `password123`

### Customer Login
- **Username**: Mobile number or NIC number
- **Password**: `password` (for MVP)

## 📁 Project Structure

```
NovaBank-LoanSphere/
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/com/novabank/loansphere/
│   │       │   ├── config/          # Configuration classes
│   │       │   ├── controller/      # REST controllers
│   │       │   ├── dto/             # Data Transfer Objects
│   │       │   ├── model/           # JPA entities
│   │       │   ├── repository/      # JPA repositories
│   │       │   ├── security/        # Security configuration
│   │       │   └── service/         # Business logic
│   │       └── resources/
│   │           ├── application.properties
│   │           └── schema.sql
│   ├── pom.xml
│   └── schema.sql
├── frontend/
│   ├── public/
│   │   └── novabank_logo.jpg
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/          # Page components
│   │   ├── services/        # API service layer
│   │   ├── data/           # Mock data
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🔌 API Documentation

### Authentication Endpoints

#### Register Customer
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "nicNumber": "199234509123",
  "fullName": "John Doe",
  "mobileNumber": "+94771234567",
  "email": "john@example.com",
  "address": "No. 45, Flower Road, Colombo 07",
  "occupation": "Software Engineer",
  "sourceOfFunds": "Salary",
  "monthlyTurnover": 250000
}
```

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "username": "customer_mobile_or_nic",
  "password": "password"
}
```

### Account Endpoints

#### Open Account
```http
POST /api/v1/accounts/open
Authorization: Bearer <token>
Content-Type: application/json

{
  "customerId": 1,
  "productName": "Savings Account",
  "branch": "COL"
}
```

#### Get Customer Accounts
```http
GET /api/v1/accounts/customer/{customerId}
Authorization: Bearer <token>
```

### Loan Application Endpoints

#### Submit Loan Application
```http
POST /api/v1/loans/apply
Authorization: Bearer <token>
Content-Type: application/json

{
  "customerId": 1,
  "loanProductId": "personal",
  "loanType": "PERSONAL",
  "requestedAmount": 1000000,
  "tenureMonths": 60,
  "purpose": "Home renovation"
}
```

#### Get Customer Applications
```http
GET /api/v1/loans/customer/{customerId}
Authorization: Bearer <token>
```

### Staff Endpoints

#### Get Applications by Status
```http
GET /api/v1/staff/applications?status=SUBMITTED
Authorization: Bearer <token>
```

#### Process Approval
```http
POST /api/v1/staff/approve
Authorization: Bearer <token>
Content-Type: application/json

{
  "applicationId": 1,
  "decision": "APPROVED",
  "comments": "Application approved"
}
```

### Notification Endpoints

#### Get Customer Notifications
```http
GET /api/v1/notifications/customer/{customerId}
Authorization: Bearer <token>
```

#### Mark as Read
```http
PUT /api/v1/notifications/{notificationId}/read
Authorization: Bearer <token>
```

For complete APIdocumentation, visit: http://localhost:8080/swagger-ui.html

## 🔧 Configuration

### Backend Configuration (application.properties)

```properties
# Server Configuration
server.port=8080

# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/novabank_loansphere
spring.datasource.username=root
spring.datasource.password=your_password

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# JWT Configuration
jwt.secret=your-secret-key
jwt.expiration=900000
jwt.refreshExpiration=604800000

# File Upload
spring.servlet.multipart.max-file-size=5MB
spring.servlet.multipart.max-request-size=5MB
```

### Frontend Configuration

The frontend API base URL is configured in `frontend/src/services/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:8080/api/v1'
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
mvn test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📊 Database Schema

### Core Tables
- **customers**: Customer information and KYC data
- **users**: Staff user accounts
- **accounts**: Bank accounts
- **account_products**: Available account products
- **loan_applications**: Loan application records
- **loan_products**: Available loan products
- **credit_assessments**: Credit assessment results
- **loan_documents**: Document attachments
- **workflow_approvals**: Approval workflow history
- **disbursements**: Loan disbursement records
- **repayment_schedule_items**: Repayment schedule
- **notifications**: User notifications
- **kyc_records**: KYC verification records

## 🔒 Security Features

- **JWT Authentication**: Token-based authentication for all API endpoints
- **Password Encryption**: BCrypt password hashing
- **CORS Configuration**: Cross-origin resource sharing for frontend integration
- **Input Validation**: Bean validation for all API requests
- **SQL Injection Prevention**: JPA/Hibernate parameterized queries
- **Role-Based Access Control**: Different access levels for staff roles

## 🚀 Deployment

### Backend Deployment

1. **Build the application**:
```bash
cd backend
mvn clean package
```

2. **Run the JAR file**:
```bash
java -jar target/loansphere-1.0.0.jar
```

3. **Configure production database** in `application.properties`

### Frontend Deployment

1. **Build the application**:
```bash
cd frontend
npm run build
```

2. **Deploy the dist folder** to your web server or hosting platform

### Docker Deployment (Optional)

Create `Dockerfile` for backend:
```dockerfile
FROM openjdk:17-jdk-slim
COPY target/loansphere-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

Build and run:
```bash
docker build -t loansphere-backend .
docker run -p 8080:8080 loansphere-backend
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Development Guidelines

### Backend
- Follow Spring Boot best practices
- Use proper exception handling
- Write unit tests for business logic
- Document API endpoints with Swagger annotations
- Follow RESTful API conventions

### Frontend
- Use functional components with hooks
- Follow React best practices
- Implement proper error handling
- Use Tailwind CSS for styling
- Ensure responsive design

### Code Style
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused
- Follow DRY (Don't Repeat Yourself) principle

## 🐛 Troubleshooting

### Common Issues

**Backend won't start**
- Check if port 8080 is available
- Verify database connection settings
- Check Java version (requires JDK 17)

**Frontend won't start**
- Check if port 5173 is available
- Verify Node.js version (requires v18+)
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

**Database connection errors**
- Verify MySQL is running
- Check database credentials
- Ensure database exists

**API errors**
- Check backend is running
- Verify CORS configuration
- Check JWT token validity

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check API documentation at `/swagger-ui.html`

## 📄 License

This project is proprietary software. All rights reserved by NovaBank.

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- React team for the frontend library
- Tailwind CSS for the utility-first CSS framework
- All contributors to this project

---

**Version**: 1.0.0  
**Last Updated**: July 2024  
**Status**: Production Ready
