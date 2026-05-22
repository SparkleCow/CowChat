# 🐮 What is CowChat

CowChat is a real-time chat application built with **Spring** and **Angular**, designed to provide a modern, responsive, and secure messaging experience.  
It combines **websocket-based communication**, **JWT authentication**, and **RESTful APIs** to create a fast, scalable, and user-friendly chat platform.

Users can register, authenticate through JWT, send real-time messages, and manage conversations dynamically, all within an interface optimized for desktop and mobile.

<img width="1538" height="947" alt="Captura de pantalla 2025-10-03 182725" src="https://github.com/user-attachments/assets/ddeca13b-61ec-4437-9d30-087b5ecabe77" />
<img width="1543" height="953" alt="Captura de pantalla 2025-10-03 182733" src="https://github.com/user-attachments/assets/16a60e73-9fde-4022-9b93-129dcf3fa6b5" />

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

<img width="1871" height="1002" alt="Captura de pantalla 2025-11-04 204308" src="https://github.com/user-attachments/assets/405996f3-74ea-41ac-ab56-4cb41561e111" />

---

## 💡 Key Features

### Authentication & Authorization
- JWT authentication with refresh token rotation

<img width="1535" height="940" alt="Captura de pantalla 2025-10-03 182759" src="https://github.com/user-attachments/assets/7c5f982e-ec9c-448a-8a52-a6a6a4082743" />
<img width="1522" height="940" alt="Captura de pantalla 2025-10-03 182750" src="https://github.com/user-attachments/assets/c35a3e54-c93f-455b-b6aa-211b14406e1a" />

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

## Architecture

<img width="1064" height="902" alt="image" src="https://github.com/user-attachments/assets/6ee3ff13-a0a5-4086-a595-799ada26960f" />

## Messaging system

Built to feel lightweight, fast and responsive across desktop and mobile devices.
<table>
  <tr>
    <td>
      <img width="408" alt="CowChat mobile conversation"
      src="https://github.com/user-attachments/assets/7f7760d6-3196-4f77-854b-c4dd3b1d6cb9" />
    </td>
    <td>
      <img width="474" alt="CowChat mobile UI"
      src="https://github.com/user-attachments/assets/8f3edbf6-1b2c-4596-9594-da1673d587b7" />
    </td>
  </tr>
</table>

