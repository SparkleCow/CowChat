# 🐮 What is CowChat

CowChat is a real-time chat application built with **Spring** and **Angular**, designed to provide a modern, responsive, and secure messaging experience.  
It combines **websocket-based communication**, **JWT authentication**, and **RESTful APIs** to create a fast, scalable, and user-friendly chat platform.

Users can register, authenticate (via JWT), send real-time messages, and manage conversations dynamically, all within an interface optimized for desktop and mobile.

---

## ✨ The system introduces:

- **Real-Time Messaging:** WebSocket integration for instant communication  
- **User Authentication:** JWT-based session handling with OAuth2 compatibility  
- **Responsive Design:** Fully functional interface across desktop and mobile  
- **User Presence Tracking:** Online/offline status updates for active users  
- **Persistent Storage:** Messages and user data stored securely in PostgreSQL
- **Persistent Images:** Profile images are stored in AWS (S3 buckets)
- **Role System:** Permissions and access levels managed through Spring Security  
- **Modern UI:** Angular frontend styled with Tailwind CSS for speed and aesthetics  

---

## 🧰 Technologies Used in CowChat

### **Backend**
- **Java** → Runtime environment  
- **Spring** → Backend framework and dependency injection  
- **Spring WebSocket** → Real-time bidirectional communication  
- **Spring Security** → Authentication and authorization  
- **JJWT** → JSON Web Token handling  
- **Spring Data JPA + PostgreSQL** → ORM and data persistence  
- **Amazon S3** → Cloud storage for user-uploaded media (e.g., images, files)  
- **Docker** → Containerized environment for backend and database  
- **AWS EC2** → Cloud server for deployment  
- **Lombok 1.18.32** → Boilerplate code reduction  
- **Maven** → Build and dependency management  
- **Postman** → API testing and documentation  

### **Frontend**
- **Angular** → Frontend framework  
- **TypeScript** → Strongly-typed JavaScript superset  
- **RxJS** → Reactive event handling  
- **WebSocket Client** → Real-time connection to the backend  

---

## 💡 Key Features

### Authentication & Authorization
- JWT authentication with refresh token rotation  

### Real-Time Chat System
- WebSocket integration for low-latency messaging  
- User presence tracking (online/offline)  
- Message persistence and delivery confirmation  
- Private chats and future support for group chats  

### Frontend Experience
- Clean, responsive UI
- Reactive user list and message feed  
- User-friendly interface for mobile and desktop  

### Technical Highlights
- RESTful API design following clean architecture  
- Exception handling with `@ControllerAdvice`  
- DTO conversion through manual mappers  
- Comprehensive validation and error responses  
- Optimized performance using reactive programming  

---

<img width="1064" height="902" alt="image" src="https://github.com/user-attachments/assets/6ee3ff13-a0a5-4086-a595-799ada26960f" />
<img width="1643" height="420" alt="image" src="https://github.com/user-attachments/assets/aa32de96-4708-49d1-809a-3e40a29c37d7" />

