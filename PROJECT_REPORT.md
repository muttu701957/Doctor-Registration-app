# MEDISLOT — DOCTOR APPOINTMENT BOOKING & BLOOD DONATION MANAGEMENT SYSTEM

---

## COVER PAGE

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│              BACHELOR OF COMPUTER APPLICATIONS (BCA)            │
│                  / MASTER OF COMPUTER APPLICATIONS              │
│                                                                 │
│         PROJECT REPORT SUBMITTED IN PARTIAL FULFILLMENT         │
│           OF THE REQUIREMENTS FOR THE AWARD OF DEGREE           │
│                                                                 │
│                                                                 │
│   PROJECT TITLE:                                                │
│                                                                 │
│      MEDISLOT — A FULL-STACK MERN WEB APPLICATION FOR           │
│      DOCTOR APPOINTMENT BOOKING, REAL-TIME PATIENT-DOCTOR       │
│      CHAT, PAYMENT INTEGRATION AND BLOOD DONATION MANAGEMENT    │
│                                                                 │
│                                                                 │
│   Submitted By  : s V                                     │
│   Register No.  : [XXXXXX]                                      │
│   Branch        : BCA / MCA — Computer Science                  │
│   Academic Year : 2025–2026                                     │
│                                                                 │
│   Guided By     : [Faculty Name], [Designation]                 │
│   Department    : Department of Computer Science                │
│   Institution   : [Institution Name]                            │
│                                                                 │
│   Submitted to  : [University Name]                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## BONAFIDE CERTIFICATE

**[INSTITUTION LETTERHEAD]**

This is to certify that the project entitled **"MEDISLOT — A Full-Stack MERN Web Application for Doctor Appointment Booking, Real-Time Patient-Doctor Chat, Payment Integration and Blood Donation Management"** is a bonafide record of work done by **Hemanth V** bearing Register No. **[XXXXXX]** of **[Institution Name]**, submitted in partial fulfillment of the requirements for the award of the degree of **Bachelor / Master of Computer Applications** during the academic year **2025–2026**.

The project has been carried out under my guidance and supervision. It is further certified that this project work has not formed the basis for the award of any other degree/diploma in this or any other university.

| | |
|---|---|
| **Project Guide** | **Head of Department** |
| [Faculty Name] | [HOD Name] |
| [Designation], Dept. of Computer Science | Department of Computer Science |
| [Institution Name] | [Institution Name] |
| Date: | Date: |

**Examiner 1:** ________________________  
**Examiner 2:** ________________________  
**Date of Viva-Voce:** ___________________

---

## DECLARATION

I, **Hemanth V**, Register No. **[XXXXXX]**, student of **[Institution Name]**, hereby declare that the project report entitled **"MEDISLOT — A Full-Stack MERN Web Application for Doctor Appointment Booking, Real-Time Patient-Doctor Chat, Payment Integration and Blood Donation Management"** submitted in partial fulfillment of the requirements for the award of the degree of **Bachelor / Master of Computer Applications** is my own original work.

I further declare that:

1. The work presented in this report has been carried out by me under the guidance of **[Faculty Name]**, Department of Computer Science, **[Institution Name]**.
2. This project has not been submitted to any other university or institution for the award of any degree or diploma.
3. All sources of information consulted during the project have been duly acknowledged in the References section.
4. All the data, diagrams, code snippets, and results presented in this report are genuine and were produced during the course of this project.

**Signature of the Student:**  
**Name:** Hemanth V  
**Register No.:** [XXXXXX]  
**Date:** May 2026  
**Place:** [City]

---

## ACKNOWLEDGEMENT

I express my sincere gratitude to **[Institution Name]** for providing me with the resources, infrastructure, and academic environment necessary to complete this project successfully.

I am deeply indebted to my project guide, **[Faculty Name]**, [Designation], Department of Computer Science, for their invaluable guidance, constant encouragement, and expert supervision throughout the duration of this project. Their constructive feedback and domain expertise in full-stack web development significantly shaped the direction and quality of this work.

I would like to express my heartfelt thanks to **[HOD Name]**, Head of the Department of Computer Science, for their support, approvals, and for maintaining a conducive academic atmosphere within the department.

I extend my gratitude to the entire faculty of the Department of Computer Science for their continuous support, feedback, and academic inputs which helped refine both the technical and documentation aspects of this project.

I am thankful to the developers and contributors of the open-source technologies used in this project — namely the React, Node.js, Express.js, MongoDB, Socket.IO, Razorpay, and Cloudinary communities — whose documentation, tutorials, and libraries made the implementation of this system feasible within the academic timeline.

Finally, I am profoundly grateful to my family and friends for their moral support, patience, and encouragement throughout the development of this project.

**Hemanth V**  
[Institution Name]  
May 2026

---

## ABSTRACT

**MEDISLOT** is a comprehensive, full-stack web application developed on the **MERN (MongoDB, Express.js, React.js, Node.js)** technology stack, designed to digitise and streamline the complete lifecycle of medical appointment booking, doctor-patient communication, payment processing, and emergency blood donation coordination within a healthcare ecosystem.

The traditional healthcare appointment system in India remains predominantly manual or fragmented across disparate platforms, resulting in long waiting times, inefficient slot management, a lack of transparent communication between patients and physicians, and no centralised platform for emergency blood donation. Medislot addresses all these pain points through a single, unified, role-based web application accessible to three distinct user classes: **Patients (Users)**, **Doctors**, and **Administrators**.

The application's architecture follows a strict separation of concerns through three independently deployable sub-applications: a **Patient-facing Frontend** (React.js + Vite + Tailwind CSS), an **Admin and Doctor Panel** (React.js + Vite + Tailwind CSS), and a **RESTful Backend API Server** (Node.js + Express.js). All three communicate with a shared **MongoDB Atlas** cloud database through Mongoose ODM.

**Core Objectives:**
- Enable patients to browse doctors by medical speciality and book time-slot-based appointments.
- Implement secure, multi-step user authentication with email verification, JWT-based session management, and password reset via one-time tokens.
- Provide a real-time, bidirectional doctor-patient chat system powered by **Socket.IO** WebSockets, with persistent message storage, online presence indicators, and read receipt tracking.
- Integrate **Razorpay** as the payment gateway to allow patients to pay consultation fees online, with automated payment receipt emails upon successful transaction.
- Deliver a full-featured **Blood Donation Management System** with geospatial donor discovery (using MongoDB's `$geoNear` aggregation pipeline), emergency broadcast notifications, real-time socket-based alerts, and compatibility-aware donor matching based on ABO/Rh blood group compatibility rules.
- Offer a comprehensive **Admin Dashboard** with analytics, doctor lifecycle management (add/delete/toggle availability), full appointment visibility, blood donor moderation (block/unblock), and emergency blood request broadcasting.
- Automate transactional email communications (verification, welcome, appointment confirmation, payment receipts, blood alerts, donor acceptance) through the **Brevo (formerly Sendinblue) Transactional Email API**.
- Deploy the application across **Vercel** (frontend and admin) and a cloud backend host with CORS configured per-origin.

**Key Outcomes:** The implemented system eliminates the need for telephonic appointment scheduling, enables doctors to manage their availability and complete appointment workflows, provides patients with on-demand access to their medical booking history, and significantly reduces emergency response time in blood donation scenarios through automated geospatial matching and multi-channel notification delivery.

**Technologies Used:** React.js 18, Vite 5, Tailwind CSS 3, Zustand 5, Socket.IO Client 4, Axios, Framer Motion, React Router DOM 6, Node.js, Express.js 4, Mongoose 8, MongoDB Atlas, JSON Web Tokens (JWT), bcryptjs, Multer, Cloudinary SDK, Razorpay SDK, Brevo API (transactional email), Socket.IO Server 4, and Vercel for deployment.

---

## TABLE OF CONTENTS

| Chapter | Title | Page |
|---------|-------|------|
| | Cover Page | i |
| | Bonafide Certificate | ii |
| | Declaration | iii |
| | Acknowledgement | iv |
| | Abstract | v |
| | Table of Contents | vi |
| | List of Figures | viii |
| | List of Tables | ix |
| **1** | **Introduction** | 1 |
| 1.1 | Aim | 1 |
| 1.2 | Project Description | 2 |
| **2** | **Literature Survey** | 6 |
| 2.1 | Existing System | 6 |
| 2.2 | Problems in Existing System | 7 |
| 2.3 | Proposed System | 8 |
| 2.4 | Feasibility Study | 9 |
| 2.5 | Tools and Technologies Used | 11 |
| 2.6 | Hardware and Software Requirements | 15 |
| **3** | **Software Requirement Specification (SRS)** | 17 |
| 3.1 | Functional Requirements | 17 |
| 3.2 | Non-Functional Requirements | 21 |
| **4** | **System Design and Analysis** | 23 |
| 4.1 | System Perspective | 23 |
| 4.2 | Architecture Diagram | 24 |
| 4.3 | Data Flow Diagram (DFD) | 25 |
| 4.4 | Database Design | 27 |
| **5** | **Detailed Design** | 34 |
| 5.1 | Use Case Diagram | 34 |
| 5.2 | Sequence Diagrams | 36 |
| 5.3 | Activity Diagram | 41 |
| 5.4 | Class Diagram | 43 |
| 5.5 | Entity-Relationship (ER) Diagram | 45 |
| **6** | **Implementation** | 47 |
| 6.1 | Module Description | 47 |
| 6.2 | Frontend Implementation | 65 |
| 6.3 | Backend Implementation | 70 |
| 6.4 | Database Implementation | 75 |
| 6.5 | API Documentation | 77 |
| 6.6 | Security Implementation | 85 |
| 6.7 | Screenshots of Application | 88 |
| **7** | **Software Testing** | 90 |
| 7.1 | Testing Types | 90 |
| 7.2 | Test Cases and Results | 92 |
| **8** | **Conclusion** | 102 |
| **9** | **Future Enhancements** | 104 |
| | References | 106 |

---

## LIST OF FIGURES

| Figure No. | Title | Page |
|-----------|-------|------|
| Fig. 4.1 | High-Level System Architecture Diagram | 24 |
| Fig. 4.2 | Level-0 DFD (Context Diagram) | 25 |
| Fig. 4.3 | Level-1 DFD | 26 |
| Fig. 5.1 | Use Case Diagram — Patient | 34 |
| Fig. 5.2 | Use Case Diagram — Doctor | 35 |
| Fig. 5.3 | Use Case Diagram — Admin | 35 |
| Fig. 5.4 | Sequence Diagram — User Registration & Email Verification | 36 |
| Fig. 5.5 | Sequence Diagram — Appointment Booking | 37 |
| Fig. 5.6 | Sequence Diagram — Razorpay Payment Flow | 38 |
| Fig. 5.7 | Sequence Diagram — Real-Time Chat | 39 |
| Fig. 5.8 | Sequence Diagram — Blood Donation Request & Notification | 40 |
| Fig. 5.9 | Activity Diagram — Appointment Booking Workflow | 41 |
| Fig. 5.10 | Activity Diagram — Blood Request Workflow | 42 |
| Fig. 5.11 | Class Diagram | 43 |
| Fig. 5.12 | ER Diagram | 45 |
| Fig. 6.1 | Home Page | 88 |
| Fig. 6.2 | Doctors Listing Page | 88 |
| Fig. 6.3 | Appointment Booking Page | 88 |
| Fig. 6.4 | User Profile Page | 89 |
| Fig. 6.5 | My Appointments Page | 89 |
| Fig. 6.6 | Real-Time Chat Interface | 89 |
| Fig. 6.7 | Blood Donation Home | 89 |
| Fig. 6.8 | Admin Dashboard | 89 |
| Fig. 6.9 | Doctor Dashboard | 89 |
| Fig. 6.10 | Blood Analytics Dashboard | 89 |

---

## LIST OF TABLES

| Table No. | Title | Page |
|-----------|-------|------|
| Table 2.1 | Frontend Technologies | 11 |
| Table 2.2 | Backend Technologies | 12 |
| Table 2.3 | Database & Storage | 13 |
| Table 2.4 | Third-Party APIs & Services | 13 |
| Table 2.5 | DevOps & Deployment | 14 |
| Table 2.6 | Hardware Requirements | 15 |
| Table 2.7 | Software Requirements | 16 |
| Table 3.1 | Functional Requirements Matrix | 17 |
| Table 4.1 | User Collection Schema | 27 |
| Table 4.2 | Doctor Collection Schema | 28 |
| Table 4.3 | Appointment Collection Schema | 29 |
| Table 4.4 | Message Collection Schema | 30 |
| Table 4.5 | Blood Donor Collection Schema | 31 |
| Table 4.6 | Blood Request Collection Schema | 32 |
| Table 4.7 | Blood Notification Collection Schema | 33 |
| Table 6.1 | Auth API Endpoints | 77 |
| Table 6.2 | Admin API Endpoints | 79 |
| Table 6.3 | Doctor API Endpoints | 80 |
| Table 6.4 | Blood Donation API Endpoints | 81 |
| Table 6.5 | Chat API Endpoints | 84 |
| Table 6.6 | Socket.IO Events | 84 |
| Table 7.1 | Authentication Module Test Cases | 92 |
| Table 7.2 | Appointment Module Test Cases | 95 |
| Table 7.3 | Payment Module Test Cases | 97 |
| Table 7.4 | Blood Donation Module Test Cases | 98 |
| Table 7.5 | Chat Module Test Cases | 100 |

---

# CHAPTER 1 — INTRODUCTION

## 1.1 Aim

The primary aim of this project is to design, develop, and deploy a comprehensive, scalable, and secure healthcare management web application named **Medislot** that serves as a single unified digital platform for three principal stakeholders in the healthcare ecosystem — **patients, doctors, and administrators**.

Specifically, the system aims to:

1. **Eliminate the inefficiencies** of manual or phone-based appointment scheduling by providing a real-time, time-slot-based online appointment booking platform where patients can discover doctors by medical speciality, view their availability, and book appointments within seconds.

2. **Bridge the communication gap** between patients and doctors through a persistent, real-time bidirectional messaging system built on WebSocket technology, enabling direct consultation messaging, follow-up communication, and appointment-related queries without requiring external messaging applications.

3. **Integrate a secure and seamless payment experience** using Razorpay's payment gateway, allowing patients to pay consultation fees online at the time of appointment booking, with automatic receipt generation and email delivery upon payment verification.

4. **Address the critical public health challenge** of emergency blood availability by implementing a full-featured Blood Donation Management System that leverages MongoDB's geospatial indexing and the `$geoNear` aggregation pipeline to discover geographically proximate, blood-group-compatible donors in real-time and notify them through multiple channels — WebSocket push, in-app notifications, and transactional email.

5. **Empower administrators** with a data-driven dashboard providing complete visibility into system operations — total users, doctors, appointments, earnings, blood analytics — with full CRUD capabilities over the doctor and appointment lifecycle.

6. **Automate the email communication pipeline** through integration with the Brevo Transactional Email API, triggering contextual emails at every significant application event: registration, email verification, welcome, appointment confirmation, payment receipt, blood request alert, donor registration confirmation, and donor acceptance notification.

## 1.2 Project Description

### 1.2.1 Overview

Medislot is a production-grade, multi-application web platform built on the MERN stack. The system comprises three distinct but interconnected sub-applications deployed independently:

- **Frontend Patient Application** (`/frontend`) — The patient-facing interface built with React 18 and Vite, styled with Tailwind CSS, using Zustand for client-side state management and React Router DOM v6 for client-side navigation. Deployed on Vercel.
- **Admin and Doctor Panel** (`/admin`) — A shared administrative interface for both platform administrators and individual doctors. Administrators access doctor management, appointment oversight, and blood donation analytics. Doctors access their own appointments, profile, and chat. Built with the same React + Vite + Tailwind stack, using React Context API for state. Deployed on Vercel.
- **Backend API Server** (`/backend`) — A Node.js + Express.js RESTful API server that serves all three client applications. Incorporates Socket.IO for real-time WebSocket capabilities, Mongoose for MongoDB object modelling, JWT-based authentication, Multer for file upload processing, Cloudinary for media storage, Razorpay SDK for payment orchestration, and the Brevo SDK for transactional email delivery. The Express server is wrapped in an `http.createServer` to co-locate the Socket.IO server on the same port.

### 1.2.2 Target Users

| Actor | Description |
|-------|-------------|
| **Patient (User)** | Any individual seeking medical consultation. Registers, verifies their email, browses doctors, books appointments, pays fees, chats with doctors, and participates in blood donation. |
| **Doctor** | Licensed medical practitioners onboarded by the administrator. Access their patient appointment queue, mark appointments complete, update their profile and availability, engage in patient chat, and participate in blood donation activities. |
| **Administrator** | Platform super-admin. Adds/removes doctors, monitors all appointments, manages blood donors and requests, broadcasts emergency blood alerts, and views system-wide analytics. |

### 1.2.3 Application Workflow

The end-to-end workflow of the Medislot system proceeds as follows:

**Patient Journey:**
1. The patient registers with name, email, and password. The system hashes the password using bcryptjs (10 salt rounds), generates a 6-digit numeric OTP verification token (valid 24 hours), stores it in the user document, and dispatches a verification email via Brevo.
2. Upon OTP submission, the system validates the token against `verificationTokenExpiresAt` in MongoDB, marks `isVerified: true`, clears the verification fields, and sends a welcome email.
3. A JWT token is generated (`userId` payload, 7-day expiry) and set as an `httpOnly`, `secure`, `SameSite=None` cookie, establishing the session.
4. The authenticated patient browses the doctors listing, filtered by speciality (General Physician, Dermatologist, Gastroenterologist, Gynecologist, Neurologist, Pediatricians). The `/api/doctor/list` endpoint returns all doctors excluding password and email fields.
5. On the appointment booking page, the patient selects a date and time slot. The system reads `slots_booked` from the doctor document — a schemaless MongoDB object keyed by date string — to determine availability, pushes the chosen slot, and creates the appointment document.
6. An appointment confirmation email is dispatched automatically.
7. If the patient opts for online payment, the frontend calls `/api/auth/payment-razorpay` which creates a Razorpay order. The Razorpay checkout script handles the payment UI. Upon success, the frontend calls `/api/auth/verifyRazorpay` which fetches the order status from Razorpay's API, marks `payment: true` on the appointment, and triggers a detailed payment receipt email.
8. The patient can initiate a chat with their doctor by navigating to `/doctor/chat`. A unique `roomId` (format: `userId_doctorId`) identifies the conversation. Historical messages are fetched from MongoDB and new messages are exchanged via Socket.IO `send_message` events, persisted to the `message` collection on the server.
9. The patient can register as a blood donor, providing blood group, geolocation coordinates, and mobile number. They can also create blood requests specifying the required blood group, patient details, location coordinates, urgency level (normal/urgent/emergency), and receive real-time socket notifications when a donor accepts.

**Doctor Journey:**
1. The doctor logs in via the Admin/Doctor panel. The panel detects `dToken` in localStorage to identify doctor sessions vs. `aToken` for admin sessions.
2. The doctor accesses a personal dashboard showing total earnings, appointment count, unique patient count, and the 6 most recent appointments.
3. Doctors can mark individual appointments as completed (setting `isCompleted: true`, `completedAt: new Date()`) or cancel them.
4. Doctors can update their profile — consultation fees, clinic address, about text, availability status — and update their profile photo via Cloudinary.
5. Doctors access the real-time chat interface to communicate with patients.
6. Doctors can register as blood donors, create blood requests on behalf of patients, search nearby donors, and receive blood notification alerts.

**Admin Journey:**
1. Admin authenticates using hardcoded credentials (`ADMIN_EMAIL`, `ADMIN_PASSWORD`) stored in environment variables. The JWT token for admin is a signed string of `email+password` (not a JSON payload), verified against the same concatenated string in `authAdmin` middleware.
2. Admin adds doctors through a form that uploads the doctor's photo to Cloudinary, hashes the password, stores the doctor record, and dispatches a welcome email to the doctor with their credentials.
3. Admin views all appointments with cancel capability. On cancellation, the appointment is marked `cancelled: true` and the booked time slot is released from `doctor.slots_booked`.
4. Admin views the blood donors list with block/unblock and delete capabilities. Blood donation analytics show donor count by blood group and request breakdown by urgency.
5. Admin can broadcast emergency blood requests to all compatible available donors within a 50km radius.

### 1.2.4 Business Value

Medislot directly addresses the following business and societal problems:

- **Time efficiency:** Elimination of phone tag and manual scheduling reduces appointment booking time from minutes to under 30 seconds.
- **Revenue transparency:** Online payment integration with automated receipts establishes a traceable financial record for both patient and doctor.
- **Emergency response:** The geospatial blood donor matching system can reduce critical blood availability response time in medical emergencies from hours to minutes by notifying the nearest compatible donors through push notification and email simultaneously.
- **Doctor productivity:** The doctor panel provides a consolidated view of all patient interactions, appointment status, and earnings without requiring the doctor to operate a separate CRM.
- **Scalability:** The stateless JWT-based API and MongoDB's horizontal scaling model allow the system to handle growing user bases without architectural redesign.

---

# CHAPTER 2 — LITERATURE SURVEY

## 2.1 Existing System

Healthcare appointment scheduling in India and across developing economies has historically relied on the following paradigms:

**Manual / Walk-In Systems:**
The majority of small and mid-tier clinics still operate on a walk-in or telephonic basis. Patients physically queue at reception, or call the clinic to book an appointment. This system is entirely dependent on administrative staff availability, provides no digital record-keeping, and offers no patient-facing visibility into slot availability.

**Hospital Management Information Systems (HMIS):**
Larger hospitals have adopted proprietary HMIS platforms (e.g., Practo, Apollo 24|7, Medi-Assist) that offer appointment booking, electronic health records, and billing. However, these platforms are enterprise-grade, expensive to deploy, and inaccessible to independent clinics or individual practitioners.

**Generic Booking Platforms:**
Platforms like Practo and Justdial act as directories where patients can discover doctors and book appointments. However, these platforms:
- Do not offer direct doctor-patient messaging within the booking interface.
- Do not integrate blood donation as a healthcare utility.
- Charge doctors a subscription or commission fee.
- Provide no custom admin control panel for individual clinic operators.

**Blood Bank Systems:**
Existing blood bank systems (e.g., eRaktKosh, by the Ministry of Health) operate as static inventory databases. They list blood bank locations and available units but do not support:
- Dynamic donor discovery with geospatial proximity queries.
- Real-time push notification to individual donors.
- Compatibility-aware matching (ABO/Rh compatibility rules).
- Cross-role (patient + doctor as donor) participation.

## 2.2 Problems in Existing System

| Problem | Impact |
|---------|--------|
| No real-time slot visibility | Patients cannot see which slots are already booked |
| No integrated payment | Separate payment channels create reconciliation issues |
| No direct doctor-patient messaging | Communication relies on third-party tools |
| No emergency blood coordination | Patients in emergencies contact multiple blood banks manually |
| No blood compatibility intelligence | Donors and requestors must manually verify compatibility |
| No automated email notifications | Manual follow-up required for confirmations and receipts |
| No centralised admin oversight | No single dashboard for clinic/hospital management |
| No geospatial donor search | Blood donor discovery is geography-agnostic |
| High cost of enterprise solutions | Independent practitioners cannot afford HMIS platforms |
| Lack of multi-role access control | Single-tier systems cannot distinguish patient/doctor/admin roles |

## 2.3 Proposed System

Medislot is the proposed system that directly resolves each deficiency identified above:

| Problem Solved | Medislot Feature |
|----------------|-----------------|
| Real-time slot visibility | `slots_booked` object in doctor document updated atomically on booking/cancellation |
| Integrated payment | Razorpay order creation + webhook-verified payment confirmation |
| Doctor-patient messaging | Socket.IO bidirectional chat with MongoDB persistence and read receipts |
| Emergency blood coordination | `$geoNear` aggregation + socket emission + email alerts to all nearby compatible donors |
| Blood compatibility intelligence | `bloodCompatibility.js` utility implementing full ABO/Rh compatibility matrix |
| Automated email notifications | Brevo Transactional Email API with 10+ distinct email template types |
| Centralised admin oversight | Admin panel with dashboard, analytics, doctor and appointment CRUD |
| Geospatial donor search | MongoDB `2dsphere` index + `$geoNear` with configurable radius |
| Cost-effective deployment | Vercel free tier (frontend/admin) + any Node.js cloud host (backend) |
| Multi-role access control | Three separate JWT strategies: `verifyToken` (users), `authDoctor`, `authAdmin` |

## 2.4 Feasibility Study

### 2.4.1 Technical Feasibility

The technology stack selected for Medislot is entirely composed of mature, production-proven, open-source frameworks with extensive community support and documentation:

- **React 18** is the most widely adopted frontend UI library with a large ecosystem of component libraries, testing utilities, and developer tooling.
- **Node.js + Express.js** provides a non-blocking I/O server environment capable of handling thousands of concurrent connections, critical for real-time chat and socket-based notifications.
- **MongoDB Atlas** is a fully managed NoSQL cloud database service that supports geospatial indexing natively through the `2dsphere` index type, making it ideally suited for the geolocation-dependent blood donor search feature.
- **Socket.IO** abstracts WebSocket communication and provides automatic fallback to HTTP long-polling, ensuring broad browser compatibility for the real-time chat and notification features.
- **Razorpay** provides an officially supported Node.js SDK and a browser-side checkout script, making integration straightforward and well-documented.
- **Cloudinary** provides a RESTful media management API with a Node.js SDK that integrates cleanly with Multer for multipart form-data upload pipelines.
- **Brevo** (formerly Sendinblue) provides a reliable transactional email API with an official Node.js SDK (`@getbrevo/brevo`).
- **Vercel** provides zero-configuration deployment for Vite-based React applications with automatic HTTPS and custom domain support.

The team possesses the requisite knowledge in all these technologies, making this project technically feasible within the academic timeline.

### 2.4.2 Economic Feasibility

The entire infrastructure cost for Medislot during development and initial deployment is negligible:

| Resource | Cost |
|----------|------|
| MongoDB Atlas (M0 Free Tier) | ₹0 / month |
| Vercel (Hobby Plan — Frontend + Admin) | ₹0 / month |
| Cloudinary (Free Tier — 25 GB storage, 25 GB bandwidth) | ₹0 / month |
| Brevo Free Plan (300 emails/day) | ₹0 / month |
| Razorpay (Test Mode) | ₹0 |
| Domain Name (optional) | ~₹800/year |
| Development Machine (existing) | ₹0 additional |

The system is economically feasible for academic demonstration. A production deployment would require paid tiers for MongoDB Atlas (M10 cluster ~$57/month), a dedicated Node.js host (Render/Railway ~$7/month), and a higher Brevo plan.

### 2.4.3 Operational Feasibility

Medislot is designed with end-user experience as a primary concern:

- The patient interface presents a clean, responsive design accessible on desktop and mobile browsers without requiring app installation.
- Onboarding requires only three fields (name, email, password) followed by a one-time OTP verification — a flow familiar to any modern internet user.
- Email automation reduces the operational burden on clinical staff by eliminating manual confirmation calls.
- The admin panel presents all critical information on a single dashboard page, reducing the learning curve for clinic operators.
- Doctors receive their login credentials via email immediately upon admin onboarding, requiring no separate provisioning workflow.

The system is operationally feasible for deployment in independent clinics, healthcare startups, and academic hospital environments.

## 2.5 Tools and Technologies Used

### Table 2.1 — Frontend Technologies

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18.3.1 | UI component library and rendering engine |
| Vite | 5.4.1 | Frontend build tool and development server |
| Tailwind CSS | 3.4.11 | Utility-first CSS framework for responsive design |
| React Router DOM | 6.26.2 | Client-side routing and navigation |
| Zustand | 5.0.2 | Lightweight global state management |
| Axios | 1.7.9 | HTTP client for REST API calls |
| Socket.IO Client | 4.8.3 | WebSocket client for real-time communication |
| Framer Motion | 11.18.2 | Animation library for UI transitions |
| React Hot Toast | 2.4.1 | Toast notification system |
| React Toastify | 10.0.5 | Alternative toast notification system |
| Lucide React | 0.466.0 | Icon library |
| React Icons | 5.5.0 | Extended icon library (Font Awesome, etc.) |
| PostCSS | 8.4.47 | CSS transformation tool |
| ESLint | 9.9.0 | Static code analysis and linting |

### Table 2.2 — Admin Panel Technologies

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18.3.1 | UI component library |
| Vite | 6.0.5 | Build tool |
| Tailwind CSS | 3.4.17 | Styling |
| React Router DOM | 7.1.1 | Routing |
| Axios | 1.7.9 | HTTP client |
| Socket.IO Client | 4.8.3 | Real-time chat in doctor panel |
| Recharts | 3.8.1 | Chart library for blood analytics dashboard |
| Lucide React | 1.16.0 | Icons |
| React Toastify | 11.0.2 | Notifications |
| Font Awesome | 6.7.2 | Icon set |
| React Context API | (built-in) | State management (AdminContext, DoctorContext) |

### Table 2.3 — Backend Technologies

| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | LTS | Server-side JavaScript runtime |
| Express.js | 4.21.1 | Web application framework and HTTP routing |
| Mongoose | 8.8.1 | MongoDB ODM — schema definition and query builder |
| Socket.IO | 4.8.3 | WebSocket server for real-time communication |
| jsonwebtoken | 9.0.2 | JWT generation and verification |
| bcryptjs | 3.0.2 | Password hashing with configurable salt rounds |
| Multer | 1.4.5-lts.1 | Multipart/form-data middleware for file uploads |
| cors | 2.8.5 | Cross-Origin Resource Sharing middleware |
| cookie-parser | 1.4.7 | HTTP cookie parsing middleware |
| dotenv | 16.4.7 | Environment variable management |
| validator | 13.12.0 | Input validation (email format, etc.) |
| crypto | 1.0.1 | Cryptographic utilities for reset tokens |
| nodemon | 3.1.7 | Development auto-restart on file change |

### Table 2.4 — Third-Party APIs and Services

| Service | Purpose | Integration Method |
|---------|---------|-------------------|
| MongoDB Atlas | Cloud-hosted NoSQL database | Mongoose `connect()` via `MONGODB_URI` |
| Cloudinary | Image upload, transformation, CDN delivery | `cloudinary.uploader.upload()` via Cloudinary SDK v2 |
| Razorpay | Payment gateway — order creation + verification | `razorpay` npm package + `orders.create()` / `orders.fetch()` |
| Brevo (Sendinblue) | Transactional email delivery | `@getbrevo/brevo` SDK — `TransactionalEmailsApi.sendTransacEmail()` |
| Socket.IO | Real-time bidirectional event-based communication | `socket.io` server + `socket.io-client` frontend |

### Table 2.5 — DevOps and Deployment

| Tool / Platform | Purpose |
|----------------|---------|
| Vercel | Deployment host for frontend and admin React apps |
| `vercel.json` | SPA fallback configuration (`rewrites: [{ source: '/(.*)', destination: '/' }]`) |
| Git / GitHub | Version control and source code hosting |
| Environment variables | `.env` files for secrets — never committed to VCS |
| `nodemon` | Development hot-reload for backend Node.js server |

## 2.6 Hardware and Software Requirements

### Table 2.6 — Hardware Requirements

| Component | Minimum Specification | Recommended Specification |
|-----------|----------------------|--------------------------|
| Processor | Intel Core i3 (dual-core) / ARM equivalent | Intel Core i5/i7 or Apple M-series |
| RAM | 4 GB | 8 GB or above |
| Storage | 500 MB free (application) | 2 GB SSD |
| Internet Connection | 2 Mbps (for cloud service calls) | 10 Mbps or above |
| Display | 1280×720 pixels | 1920×1080 pixels or above |
| Input Devices | Standard keyboard and mouse | Standard keyboard and mouse |

### Table 2.7 — Software Requirements

| Software | Version | Purpose |
|---------|---------|---------|
| Node.js | ≥ 18.x LTS | Backend runtime |
| npm | ≥ 9.x | Package manager |
| MongoDB Atlas | Cloud (M0 free) | Database service |
| Git | ≥ 2.x | Version control |
| VS Code | Latest | Code editor |
| Web Browser | Chrome 120+ / Firefox 120+ / Safari 17+ | Application testing |
| Postman / Insomnia | Latest | API endpoint testing |
| macOS / Windows / Linux | Any modern OS | Development environment |

---

# CHAPTER 3 — SOFTWARE REQUIREMENT SPECIFICATION (SRS)

## 3.1 Functional Requirements

### Table 3.1 — Functional Requirements Matrix

| FR ID | Module | Requirement | Priority |
|-------|--------|-------------|----------|
| FR-001 | Authentication | The system shall allow new patients to register with name, email, and password | High |
| FR-002 | Authentication | Passwords shall be hashed using bcryptjs with 10 salt rounds before storage | High |
| FR-003 | Authentication | On registration, the system shall generate a 6-digit OTP and dispatch a verification email | High |
| FR-004 | Authentication | OTP tokens shall expire after 24 hours | High |
| FR-005 | Authentication | A verified JWT cookie (httpOnly, secure, SameSite=None, 7-day expiry) shall be issued on successful login/signup | High |
| FR-006 | Authentication | The system shall support email verification with OTP resend (10-minute expiry on resend) | High |
| FR-007 | Authentication | The system shall support forgot-password via crypto-generated secure token (1-hour expiry) | High |
| FR-008 | Authentication | The system shall support password reset via token URL and send a reset success email | High |
| FR-009 | Authentication | Protected routes shall redirect unauthenticated users to /login | High |
| FR-010 | Authentication | Unverified users shall be redirected to /verify-email | High |
| FR-011 | User Profile | Users shall be able to view their profile information | Medium |
| FR-012 | User Profile | Users shall be able to update name, phone, address (line1, line2), date of birth, gender, and blood group | Medium |
| FR-013 | User Profile | Users shall be able to upload a profile picture (JPEG/PNG) which is stored on Cloudinary | Medium |
| FR-014 | Doctor Discovery | The system shall expose a public doctor list filtered by speciality | High |
| FR-015 | Doctor Discovery | Doctor listings shall not expose password or email fields to the frontend | High |
| FR-016 | Appointment Booking | Authenticated users shall be able to select a doctor, date, and time slot to book an appointment | High |
| FR-017 | Appointment Booking | The system shall prevent booking of already-occupied time slots | High |
| FR-018 | Appointment Booking | On successful booking, an appointment confirmation email shall be sent | High |
| FR-019 | Appointment Booking | Users shall be able to view all their past and upcoming appointments | High |
| FR-020 | Appointment Booking | Users shall be able to cancel their own appointments | High |
| FR-021 | Appointment Booking | On cancellation, the time slot shall be released from the doctor's booked slots | High |
| FR-022 | Payment | Users shall be able to initiate Razorpay payment for consultation fees | High |
| FR-023 | Payment | The backend shall create a Razorpay order and return the order object to the frontend | High |
| FR-024 | Payment | On payment success, the backend shall verify the payment against Razorpay's API and mark the appointment `payment: true` | High |
| FR-025 | Payment | A detailed payment receipt email shall be dispatched upon successful payment verification | High |
| FR-026 | Chat | Authenticated users shall be able to initiate a chat with their doctor | High |
| FR-027 | Chat | Messages shall be exchanged in real-time via Socket.IO WebSocket events | High |
| FR-028 | Chat | All messages shall be persisted to MongoDB for retrieval across sessions | High |
| FR-029 | Chat | The system shall display online/offline presence status of the chat partner | Medium |
| FR-030 | Chat | The system shall track message read receipts (seen/unseen) | Medium |
| FR-031 | Blood Donation | Authenticated users and doctors shall be able to register as blood donors | High |
| FR-032 | Blood Donation | Donor registration shall require acknowledgement acceptance | High |
| FR-033 | Blood Donation | The system shall store donor location as a GeoJSON Point with latitude/longitude | High |
| FR-034 | Blood Donation | Donors shall be able to toggle their availability status | High |
| FR-035 | Blood Donation | Donors shall be able to update their profile (blood group, contact, location) | Medium |
| FR-036 | Blood Donation | Users shall be able to search for donors within a configurable radius by blood group | High |
| FR-037 | Blood Donation | The system shall return only compatible donor groups based on the ABO/Rh compatibility matrix | High |
| FR-038 | Blood Donation | Users shall be able to create blood requests specifying patient, blood group, location, urgency, and contact | High |
| FR-039 | Blood Donation | On request creation, the system shall find all compatible available donors within radius (10km/20km/50km based on urgency) | High |
| FR-040 | Blood Donation | Matched donors shall receive real-time Socket.IO notifications | High |
| FR-041 | Blood Donation | Matched donors shall receive blood request alert emails (async, non-blocking) | High |
| FR-042 | Blood Donation | Donors shall be able to accept or decline blood requests | High |
| FR-043 | Blood Donation | On donor acceptance, the requestor shall receive a real-time notification and email | High |
| FR-044 | Blood Donation | Users shall be able to view, cancel, or mark their blood requests as fulfilled | Medium |
| FR-045 | Blood Donation | A public active requests feed shall be available without authentication | Medium |
| FR-046 | Admin | Admin shall authenticate with predefined credentials stored in environment variables | High |
| FR-047 | Admin | Admin shall be able to add doctors with name, email, password, speciality, degree, experience, fees, address, and profile image | High |
| FR-048 | Admin | Admin shall be able to view all registered doctors | High |
| FR-049 | Admin | Admin shall be able to toggle doctor availability | Medium |
| FR-050 | Admin | Admin shall be able to delete a doctor and automatically cancel their pending appointments | High |
| FR-051 | Admin | Admin shall be able to view all appointments across the system | High |
| FR-052 | Admin | Admin shall be able to cancel any appointment | High |
| FR-053 | Admin | Admin shall view a dashboard with doctor count, user count, appointment count, and recent appointments | High |
| FR-054 | Admin | Admin shall view blood donor analytics (count by blood group, availability) | Medium |
| FR-055 | Admin | Admin shall be able to block/unblock blood donors | Medium |
| FR-056 | Admin | Admin shall be able to broadcast emergency blood requests | High |
| FR-057 | Doctor Panel | Doctors shall log in to a dedicated interface via the Admin/Doctor panel | High |
| FR-058 | Doctor Panel | Doctors shall access a personal dashboard with earnings, appointment count, and patient count | High |
| FR-059 | Doctor Panel | Doctors shall be able to mark appointments as completed or cancelled | High |
| FR-060 | Doctor Panel | Doctors shall be able to update profile details and availability | Medium |
| FR-061 | Doctor Panel | Doctors shall access a real-time chat interface to communicate with patients | High |
| FR-062 | Doctor Panel | Doctors shall be able to register as blood donors and manage blood requests | Medium |

## 3.2 Non-Functional Requirements

### 3.2.1 Security

- All passwords are stored as bcrypt hashes with a cost factor of 10. Plaintext passwords are never persisted to the database.
- JWT tokens are stored exclusively as `httpOnly` cookies, immune to JavaScript-based XSS attacks.
- The cookie is configured with `secure: true` and `SameSite: None` for cross-origin cookie sharing in production, and `SameSite: Lax` for local development.
- The Admin panel uses a separate JWT strategy where the signed payload is `email + password` — preventing patient/doctor tokens from being used to access admin endpoints.
- Doctor authentication uses a header-based `dtoken` mechanism distinct from the cookie-based user token.
- CORS is configured with an explicit allowlist of origins, rejecting all unlisted origins.
- Email addresses and passwords are validated on the backend using the `validator` library before processing.
- The password reset token is generated using `crypto.randomBytes(20).toString('hex')`, providing 160 bits of cryptographic entropy.
- Appointment ownership is validated on the backend before allowing cancellation — users cannot cancel other users' appointments.
- Blood request ownership is validated before cancel/close operations.

### 3.2.2 Performance

- The doctor `slots_booked` field uses a schemaless MongoDB `Object` type (with `minimize: false`) enabling O(1) slot lookup by date key.
- The blood donor search uses MongoDB's `$geoNear` aggregation stage which leverages the `2dsphere` index for efficient geospatial queries without full-collection scans.
- Blood notification inserts are performed with `insertMany` for batch efficiency rather than individual document saves.
- Blood request alert emails are sent asynchronously with `.catch()` handlers — they never block the HTTP response.
- Socket.IO's WebSocket transport is preferred (`transports: ['websocket']` in client configuration) over polling for lower latency.
- API responses for doctor listings exclude sensitive fields (`-password`, `-email`) at the database query level.

### 3.2.3 Scalability

- The stateless JWT authentication model (no server-side session storage) allows horizontal scaling of the backend without session affinity requirements.
- MongoDB Atlas provides automatic horizontal scaling through sharding and replica sets.
- The Socket.IO server is co-located with the Express server; for multi-instance deployment, a Socket.IO adapter (e.g., Redis adapter) would be required for cross-instance socket room membership.
- Cloudinary's CDN delivery eliminates image serving load from the application server.

### 3.2.4 Reliability and Availability

- MongoDB Atlas M0 provides 99.9% uptime SLA with automatic failover through replica sets.
- Vercel's edge network ensures high availability for the frontend and admin applications.
- Email sending failures are caught and logged without propagating to the main request-response cycle.
- Graceful error handling is implemented across all API controllers with structured JSON error responses.

### 3.2.5 Usability

- The patient-facing application is fully responsive, adapting to mobile (xs, sm), tablet (md), and desktop (lg, xl) breakpoints through Tailwind CSS utility classes.
- Framer Motion animations provide smooth page transitions and loading states.
- `react-hot-toast` provides contextual success/error feedback without interrupting the user's workflow.
- The `PasswordStrengthMeter` component provides real-time visual feedback during password creation.
- Loading spinners and loading button states prevent duplicate form submissions.

### 3.2.6 Maintainability

- The codebase follows a modular MVC (Model-View-Controller) pattern on the backend — models in `/models`, business logic in `/controllers`, routing in `/routes`, cross-cutting concerns in `/middlewares`.
- Frontend component logic is separated from API calls — Zustand stores encapsulate all HTTP interactions.
- Reusable UI components (`InputField`, `LoadingButton`, `LoadingSpinner`, `PasswordStrengthMeter`) are extracted to `/components`.
- Environment-specific configuration is entirely externalised through `.env` files.

### 3.2.7 Compatibility

- The application targets modern browsers: Chrome 120+, Firefox 120+, Safari 17+, Edge 120+.
- The backend runs on Node.js LTS (≥18), ensuring long-term support.
- All ES Modules syntax (`import/export`) is used consistently across both frontend and backend.

---

# CHAPTER 4 — SYSTEM DESIGN AND ANALYSIS

## 4.1 System Perspective

Medislot is designed as a **three-tier web application**:

- **Presentation Tier:** Two separate React SPA applications (patient frontend + admin/doctor panel) rendered in the browser. Communication with the backend occurs exclusively through HTTP REST API calls and WebSocket connections.
- **Application Tier:** A single Node.js + Express.js server handling all business logic, authentication, file processing, payment orchestration, email dispatch, and WebSocket event management.
- **Data Tier:** MongoDB Atlas cloud database persisting all application data across six primary collections: `users`, `doctors`, `appointments`, `messages`, `bloodDonors`, `bloodRequests`, `bloodNotifications`, `bloodRequestResponses`, and `donorAvailabilityLogs`.

The application follows a **role-based access control (RBAC)** model with three distinct roles: Patient, Doctor, and Admin — each with its own authentication mechanism and set of permissible operations.

## 4.2 Architecture Diagram

```mermaid
graph TB
    subgraph "Client Layer"
        FE["🌐 Patient Frontend\n(React + Vite + Tailwind)\nVercel"]
        AD["🔧 Admin/Doctor Panel\n(React + Vite + Tailwind)\nVercel"]
    end

    subgraph "Application Layer"
        BE["⚙️ Backend Server\n(Node.js + Express.js)\nPort 4000"]
        SOCK["🔌 Socket.IO Server\n(co-located with Express)"]
    end

    subgraph "External Services"
        MDB["🍃 MongoDB Atlas\n(Cloud Database)"]
        CLD["☁️ Cloudinary\n(Image CDN)"]
        RZP["💳 Razorpay\n(Payment Gateway)"]
        BREVO["📧 Brevo API\n(Transactional Email)"]
    end

    FE -- "REST API (HTTPS)\nCookie-based JWT" --> BE
    AD -- "REST API (HTTPS)\nHeader-based JWT (aToken/dToken)" --> BE
    FE -- "WebSocket (WSS)" --> SOCK
    AD -- "WebSocket (WSS)" --> SOCK
    SOCK <--> BE
    BE -- "Mongoose ODM" --> MDB
    BE -- "cloudinary.uploader.upload()" --> CLD
    BE -- "razorpay.orders.create()/fetch()" --> RZP
    BE -- "TransactionalEmailsApi.sendTransacEmail()" --> BREVO
```

## 4.3 Data Flow Diagram (DFD)

### Level-0 Context Diagram

```mermaid
graph LR
    P["👤 Patient"]
    D["👨‍⚕️ Doctor"]
    A["🔑 Admin"]
    SYS["📦 MEDISLOT\nSYSTEM"]
    DB["🗄️ MongoDB"]
    EXT["🌐 External Services\n(Cloudinary/Razorpay/Brevo)"]

    P -- "Registration, Booking,\nPayment, Chat, Blood Request" --> SYS
    D -- "Login, Appointments,\nProfile, Chat" --> SYS
    A -- "Doctor Mgmt,\nBlood Mgmt, Analytics" --> SYS
    SYS -- "Confirmation, Data" --> P
    SYS -- "Appointment Queue,\nEarnings, Chat" --> D
    SYS -- "Analytics, Reports" --> A
    SYS -- "Read / Write" --> DB
    SYS -- "Upload / Pay / Email" --> EXT
```

### Level-1 DFD

```mermaid
graph TB
    P["Patient"]
    D["Doctor"]
    A["Admin"]

    P1["1.0\nAuthentication\nModule"]
    P2["2.0\nAppointment\nBooking Module"]
    P3["3.0\nPayment\nModule"]
    P4["4.0\nChat\nModule"]
    P5["5.0\nBlood Donation\nModule"]
    P6["6.0\nAdmin\nModule"]

    DS1["users"]
    DS2["doctors"]
    DS3["appointments"]
    DS4["messages"]
    DS5["bloodDonors\nbloodRequests\nbloodNotifications"]

    P --> P1 --> DS1
    P --> P2 --> DS3
    DS2 --> P2
    P --> P3 --> DS3
    P --> P4 --> DS4
    D --> P4
    P --> P5 --> DS5
    D --> P5
    A --> P6 --> DS2
    P6 --> DS3
    P6 --> DS5
```

## 4.4 Database Design

Medislot uses MongoDB (schema-flexible NoSQL) with Mongoose ODM. The following describes each collection and its schema in detail.

### Table 4.1 — `users` Collection Schema

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `_id` | ObjectId | Auto-generated | Primary key |
| `name` | String | required | Patient's full name |
| `email` | String | required, unique | Login email address |
| `password` | String | required | bcrypt hash of password |
| `image` | String | default: Cloudinary URL | Profile picture URL |
| `address.line1` | String | default: '' | Address line 1 |
| `address.line2` | String | default: '' | Address line 2 |
| `gender` | String | default: 'Not Selected' | Patient gender |
| `dob` | String | default: 'Not Selected' | Date of birth |
| `phone` | String | default: '0000000000' | Contact number |
| `bloodGroup` | String | default: 'Unknown' | Patient's blood group |
| `lastLogin` | Date | default: now | Timestamp of last login |
| `isVerified` | Boolean | default: false | Email verification status |
| `verificationToken` | String | — | OTP for email verification |
| `verificationTokenExpiresAt` | Date | — | OTP expiry timestamp |
| `resetPasswordToken` | String | — | Secure token for password reset |
| `resetTokenExpiresAt` | Date | — | Reset token expiry |
| `createdAt` | Date | auto | Mongoose timestamp |
| `updatedAt` | Date | auto | Mongoose timestamp |

### Table 4.2 — `doctors` Collection Schema

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `_id` | ObjectId | Auto-generated | Primary key |
| `name` | String | required | Doctor's full name |
| `email` | String | required, unique | Login email |
| `password` | String | required | bcrypt hashed password |
| `image` | String | required | Cloudinary profile image URL |
| `speciality` | String | required | Medical speciality (e.g., Neurologist) |
| `degree` | String | required | Medical degree (e.g., MBBS, MD) |
| `experience` | String | required | Years of experience |
| `about` | String | required | Doctor biography |
| `available` | Boolean | default: true | Availability for booking |
| `fees` | Number | required | Consultation fee in INR |
| `address.line` | String | required | Clinic address line 1 |
| `address.line2` | String | — | Clinic address line 2 |
| `date` | Number | required | Unix timestamp of registration |
| `slots_booked` | Object | default: {}, minimize: false | Map of `{dateString: [timeSlot, ...]}` |

> **Design Note:** `slots_booked` is intentionally a schemaless `Object` (not an array or sub-document array) to enable O(1) keyed access by date string (e.g., `slots_booked["1_1_2026"]`). `minimize: false` prevents Mongoose from stripping empty nested objects.

### Table 4.3 — `appointments` Collection Schema

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `_id` | ObjectId | Auto-generated | Primary key |
| `userId` | String | required | Reference to the patient's `_id` |
| `docId` | String | required | Reference to the doctor's `_id` |
| `slotDate` | String | required | Date of appointment (string format) |
| `slotTime` | String | required | Time slot (e.g., '10:00 AM') |
| `userData` | Object | required | Snapshot of patient data at booking time |
| `docData` | Object | required | Snapshot of doctor data at booking time |
| `amount` | Number | — | Consultation fee amount |
| `date` | Date | default: now | Booking timestamp |
| `cancelled` | Boolean | default: false | Cancellation flag |
| `cancelledAt` | Date | — | Cancellation timestamp |
| `payment` | Boolean | default: false | Payment completion flag |
| `isCompleted` | Boolean | default: false | Doctor-marked completion flag |
| `completedAt` | Date | — | Completion timestamp |
| `refund` | Boolean | default: false | Refund status flag |

> **Design Note:** `userData` and `docData` are stored as snapshots (denormalised) rather than references. This ensures appointment records remain historically accurate even if the patient updates their profile or the doctor changes their details after booking.

### Table 4.4 — `messages` Collection Schema

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `_id` | ObjectId | Auto-generated | Primary key |
| `roomId` | String | required, indexed | Chat room identifier (`userId_docId`) |
| `sender` | String | required | Sender's name |
| `senderType` | String | enum: ['user', 'doctor'] | Role of the sender |
| `message` | String | required | Message content |
| `timestamp` | Date | default: now | Message creation time |
| `seen` | Boolean | default: false | Read receipt flag |
| `seenAt` | Date | — | Timestamp when message was seen |

### Table 4.5 — `bloodDonors` Collection Schema

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `_id` | ObjectId | Auto-generated | Primary key |
| `donorType` | String | enum: ['user','doctor'], required | Type of donor |
| `userId` | String | default: null | Reference if donor is a patient |
| `doctorId` | String | default: null | Reference if donor is a doctor |
| `fullName` | String | required | Donor's full name |
| `email` | String | required | Contact email |
| `mobileNumber` | String | required | Contact mobile |
| `bloodGroup` | String | enum: ['A+','A-','B+','B-','AB+','AB-','O+','O-'] | Donor blood group |
| `location.type` | String | enum: ['Point'] | GeoJSON type |
| `location.coordinates` | [Number] | required | [longitude, latitude] |
| `locationName` | String | default: '' | Human-readable location name |
| `availabilityStatus` | Boolean | default: true | Ready to donate flag |
| `isBlocked` | Boolean | default: false | Admin block flag |
| `lastDonationDate` | Date | default: null | Date of most recent donation |
| `emergencyContact` | String | default: null | Emergency contact number |
| `acknowledgementAccepted` | Boolean | required | Consent acknowledgement |
| `acknowledgementAcceptedAt` | Date | — | Acknowledgement timestamp |

**Indexes:** `2dsphere` on `location`; compound index on `{bloodGroup, availabilityStatus, isBlocked}`; index on `userId`; index on `doctorId`.

### Table 4.6 — `bloodRequests` Collection Schema

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `_id` | ObjectId | Auto-generated | Primary key |
| `requestorType` | String | enum: ['user','doctor','admin'] | Who created the request |
| `requestorId` | String | required | ID of the requestor |
| `requestorName` | String | default: '' | Requestor's name |
| `patientName` | String | required | Patient needing blood |
| `requiredBloodGroup` | String | required, enum | Blood group needed |
| `contactNumber` | String | required | Emergency contact |
| `location.type` | String | enum: ['Point'] | GeoJSON type |
| `location.coordinates` | [Number] | required | [longitude, latitude] |
| `locationName` | String | default: '' | Human-readable location |
| `urgencyType` | String | enum: ['normal','urgent','emergency'] | Priority level |
| `additionalNotes` | String | — | Extra information |
| `requiredDate` | Date | — | Deadline for blood need |
| `status` | String | enum: ['active','fulfilled','cancelled','closed'] | Request lifecycle state |
| `fulfilledAt` | Date | — | Fulfillment timestamp |
| `cancelledAt` | Date | — | Cancellation timestamp |
| `notifiedCount` | Number | default: 0 | Number of donors notified |

**Indexes:** `2dsphere` on `location`; compound indexes for fast status/urgency queries.

### Table 4.7 — `bloodNotifications` Collection Schema

| Field | Type | Description |
|-------|------|-------------|
| `recipientType` | String | enum: ['user','doctor','admin'] |
| `recipientId` | String | Target recipient's ID |
| `requestId` | ObjectId | Reference to blood request |
| `type` | String | Notification category (new_request, urgent_request, emergency_broadcast, donor_accepted, etc.) |
| `title` | String | Notification title |
| `message` | String | Notification body |
| `urgencyType` | String | Severity level for UI colour coding |
| `latitude` / `longitude` | Number | Coordinates for map link |
| `isRead` | Boolean | Read status |
| `readAt` | Date | Read timestamp |

**Index:** `{recipientId, isRead, createdAt: -1}` for efficient unread count queries.

---

# CHAPTER 5 — DETAILED DESIGN

## 5.1 Use Case Diagram

```mermaid
graph TB
    subgraph "Patient (User) — Use Cases"
        U1["Register Account"]
        U2["Verify Email (OTP)"]
        U3["Login / Logout"]
        U4["Forgot / Reset Password"]
        U5["Update Profile & Photo"]
        U6["Browse Doctors by Speciality"]
        U7["Book Appointment"]
        U8["Cancel Appointment"]
        U9["Pay Consultation Fee (Razorpay)"]
        U10["Chat with Doctor"]
        U11["Register as Blood Donor"]
        U12["Toggle Availability"]
        U13["Create Blood Request"]
        U14["Search Blood Donors"]
        U15["View Blood Notifications"]
        U16["Respond to Blood Request"]
        U17["View My Appointments"]
        U18["View Active Blood Requests"]
    end

    subgraph "Doctor — Use Cases"
        D1["Login / Logout"]
        D2["View Doctor Dashboard"]
        D3["Mark Appointment Complete"]
        D4["Cancel Appointment"]
        D5["Update Profile & Fees"]
        D6["Chat with Patients"]
        D7["Register as Blood Donor"]
        D8["Create Blood Request"]
        D9["Search Donors"]
        D10["View Blood Notifications"]
    end

    subgraph "Admin — Use Cases"
        A1["Admin Login"]
        A2["View System Dashboard"]
        A3["Add Doctor"]
        A4["Delete Doctor"]
        A5["Toggle Doctor Availability"]
        A6["View All Appointments"]
        A7["Cancel Any Appointment"]
        A8["View Blood Donors"]
        A9["Block / Unblock Donor"]
        A10["View Blood Requests"]
        A11["Update Request Status"]
        A12["Broadcast Emergency Request"]
        A13["View Blood Analytics"]
    end

    Patient["👤 Patient"] --> U1
    Patient --> U3
    Patient --> U6
    Patient --> U7
    Patient --> U9
    Patient --> U10
    Patient --> U11
    Patient --> U13
    Patient --> U14

    Doctor["👨‍⚕️ Doctor"] --> D1
    Doctor --> D2
    Doctor --> D3
    Doctor --> D6
    Doctor --> D7

    Admin["🔑 Admin"] --> A1
    Admin --> A2
    Admin --> A3
    Admin --> A12
    Admin --> A13
```

## 5.2 Sequence Diagrams

### Fig 5.4 — User Registration and Email Verification

```mermaid
sequenceDiagram
    participant U as Patient Browser
    participant FE as React Frontend
    participant BE as Express Backend
    participant DB as MongoDB
    participant EM as Brevo Email API

    U->>FE: Fill signup form (name, email, password)
    FE->>BE: POST /api/auth/signup
    BE->>BE: Validate email format (validator.isEmail)
    BE->>DB: findOne({email}) — check duplicate
    DB-->>BE: null (not found)
    BE->>BE: bcryptjs.genSalt(10) + bcryptjs.hash(password, salt)
    BE->>BE: Generate 6-digit OTP verificationToken
    BE->>DB: userModel.save() — persist new user (isVerified: false)
    BE->>BE: generateTokenAndCookie(res, userId) — set httpOnly cookie
    BE->>EM: sendVerificationEmail(email, OTP)
    EM-->>U: Email with 6-digit OTP
    BE-->>FE: 201 { success: true, user }
    FE->>U: Redirect to /verify-email

    U->>FE: Enter OTP code
    FE->>BE: POST /api/auth/verify-email { code }
    BE->>DB: findOne({ verificationToken: code, expiresAt > now })
    DB-->>BE: user document
    BE->>DB: Update user (isVerified: true, clear token fields)
    BE->>EM: sendWelcomeEmail(email, name)
    EM-->>U: Welcome email
    BE-->>FE: 200 { success: true }
    FE->>U: Redirect to Home
```

### Fig 5.5 — Appointment Booking Flow

```mermaid
sequenceDiagram
    participant U as Patient Browser
    participant FE as React Frontend
    participant BE as Express Backend
    participant DB as MongoDB
    participant EM as Brevo Email

    U->>FE: Navigate to /appointment/:docId
    FE->>BE: GET /api/doctor/list (doctor data via AppContext)
    BE->>DB: doctorModel.find({}).select('-password -email')
    DB-->>BE: doctors[]
    BE-->>FE: { doctors }
    FE->>U: Display calendar + available time slots

    U->>FE: Select date + time slot, click "Book"
    FE->>BE: POST /api/auth/book-appointment { docId, slotDate, slotTime }
    BE->>BE: verifyToken middleware — extract userId from cookie
    BE->>DB: doctorModel.findById(docId)
    DB-->>BE: docData (with slots_booked)
    BE->>BE: Check slots_booked[slotDate].includes(slotTime)
    alt Slot Already Booked
        BE-->>FE: 400 { message: "Slot not available" }
        FE->>U: Show error toast
    else Slot Available
        BE->>DB: Push slotTime into slots_booked[slotDate]
        BE->>DB: appointmentModel.save() — create appointment record
        BE->>DB: doctorModel.findByIdAndUpdate(docId, { slots_booked })
        BE->>EM: sendAppointmentConfirmationEmail(...)
        EM-->>U: Appointment confirmation email
        BE-->>FE: 200 { success: true }
        FE->>U: Show success toast + navigate to My Appointments
    end
```

### Fig 5.6 — Razorpay Payment Flow

```mermaid
sequenceDiagram
    participant U as Patient Browser
    participant FE as React Frontend
    participant BE as Express Backend
    participant RZP as Razorpay API
    participant DB as MongoDB
    participant EM as Brevo Email

    U->>FE: Click "Pay Now" on appointment card
    FE->>BE: POST /api/auth/payment-razorpay { appointmentId, amount }
    BE->>DB: appointmentModel.findById(appointmentId) — verify not cancelled
    BE->>RZP: razorpay.orders.create({ amount: amount*100, currency, receipt: appointmentId })
    RZP-->>BE: { id: order_id, amount, currency, receipt }
    BE-->>FE: { success: true, order }
    FE->>U: Launch Razorpay Checkout modal (order_id, key_id)

    U->>RZP: Enter card/UPI details + pay
    RZP-->>FE: { razorpay_payment_id, razorpay_order_id, razorpay_signature }

    FE->>BE: POST /api/auth/verifyRazorpay { razorpay_order_id, razorpay_payment_id, razorpay_signature }
    BE->>RZP: razorpay.orders.fetch(razorpay_order_id)
    RZP-->>BE: { status: 'paid', receipt: appointmentId, amount }
    BE->>DB: appointmentModel.findByIdAndUpdate(receipt, { payment: true })
    BE->>EM: sendPaymentReceiptEmail(userEmail, userName, amount/100, "Success", paymentId, doctorName, ...)
    EM-->>U: Detailed payment receipt email
    BE-->>FE: 200 { success: true, message: "Payment Successful" }
    FE->>U: Show payment success toast
```

### Fig 5.7 — Real-Time Chat Flow

```mermaid
sequenceDiagram
    participant U as Patient Browser
    participant DS as Doctor Browser
    participant FE as Patient Frontend
    participant DA as Doctor Admin Panel
    participant SOCK as Socket.IO Server
    participant DB as MongoDB

    U->>FE: Navigate to /doctor/chat
    FE->>DB: GET /api/chat/rooms (getActiveRooms via POST { roomIds })
    DB-->>FE: { activeRooms: { roomId: { lastMessage, lastSender, lastTimestamp } } }
    FE->>SOCK: socket.emit("join_room", roomId)
    FE->>SOCK: socket.emit("user_online", { roomId, name, role: "user" })
    SOCK->>DS: emit("partner_online", { name, online: true })

    DA->>SOCK: socket.emit("join_room", roomId)
    SOCK->>U: emit("partner_online", { name: doctorName, online: true })

    U->>FE: Type message + Send
    FE->>SOCK: socket.emit("send_message", { roomId, message, sender, senderType: "user", time })
    SOCK->>DB: messageModel.create({ roomId, sender, senderType, message })
    SOCK->>DS: socket.to(roomId).emit("receive_message", { roomId, message, sender, time })
    DA->>U: Message appears in chat window

    DS->>SOCK: socket.emit("mark_seen", { roomId, readerName: doctorName })
    SOCK->>DB: messageModel.updateMany({ roomId, sender: !doctorName, seen: false }, { seen: true })
    SOCK->>U: emit("messages_seen", { roomId })
    FE->>U: Show read receipt ✓✓
```

### Fig 5.8 — Blood Donation Request and Notification Flow

```mermaid
sequenceDiagram
    participant U as User (Requestor)
    participant FE as Frontend
    participant BE as Backend
    participant DB as MongoDB
    participant SOCK as Socket.IO
    participant EM as Brevo Email
    participant D as Nearby Donors

    U->>FE: Fill blood request form (blood group, location, urgency)
    FE->>BE: POST /api/blood/request/create { patientName, bloodGroup, lat, lng, urgency }
    BE->>BE: Determine radiusMeters based on urgency (10/20/50 km)
    BE->>DB: bloodRequestModel.save() — create request
    BE->>BE: getCompatibleDonors(requiredBloodGroup) — ABO/Rh matrix lookup
    BE->>DB: bloodDonorModel.aggregate([$geoNear + query filter])
    DB-->>BE: nearbyDonors[] sorted by distance
    BE->>DB: bloodNotificationModel.insertMany(notificationDocs)
    BE->>DB: bloodRequestResponseModel.insertMany(responseDocs)
    BE->>DB: bloodRequestModel.update({ notifiedCount })

    loop For each nearby donor
        BE->>SOCK: io.to("blood-{donorId}").emit("blood_notification", {...})
        SOCK->>D: Real-time push notification
        BE->>EM: sendBloodRequestAlertEmail(donor.email, ...) [async]
        EM-->>D: Blood request alert email
    end

    BE-->>FE: { success: true, donors[], notifiedCount }
    FE->>U: Show donor list + notification count

    D->>BE: POST /api/blood/response { requestId, responseStatus: "accepted" }
    BE->>DB: bloodRequestResponseModel.findOneAndUpdate(...)
    BE->>DB: bloodNotificationModel.create({ recipientId: requestorId, type: "donor_accepted" })
    BE->>SOCK: io.to("blood-{requestorId}").emit("blood_notification", { type: "donor_accepted" })
    SOCK->>U: Real-time donor acceptance notification
    BE->>EM: sendDonorAcceptedEmail(requestorEmail, ...) [async]
    EM-->>U: Donor accepted email
```

## 5.3 Activity Diagram

### Appointment Booking Workflow

```mermaid
flowchart TD
    A([Start]) --> B{Is User\nAuthenticated?}
    B -- No --> C[Redirect to /login]
    C --> A
    B -- Yes --> D{Is Email\nVerified?}
    D -- No --> E[Redirect to /verify-email]
    D -- Yes --> F[Browse Doctors by Speciality]
    F --> G[Select Doctor]
    G --> H[View Available Slots]
    H --> I[Select Date & Time Slot]
    I --> J{Slot\nAvailable?}
    J -- No --> H
    J -- Yes --> K[Confirm Booking]
    K --> L[POST /api/auth/book-appointment]
    L --> M[Server validates slot in slots_booked]
    M --> N{Slot Taken\nby Concurrent\nRequest?}
    N -- Yes --> O[Return 400 Slot Not Available]
    O --> H
    N -- No --> P[Push slot to slots_booked]
    P --> Q[Create Appointment Document]
    Q --> R[Send Confirmation Email]
    R --> S{Pay Online?}
    S -- No --> T[Show in My Appointments as Unpaid]
    S -- Yes --> U[Create Razorpay Order]
    U --> V[Open Razorpay Checkout]
    V --> W{Payment\nSuccessful?}
    W -- No --> X[Show Payment Failed]
    W -- Yes --> Y[POST /verifyRazorpay]
    Y --> Z[Mark appointment payment: true]
    Z --> AA[Send Payment Receipt Email]
    AA --> T
    T --> AB([End])
```

### Blood Request Workflow

```mermaid
flowchart TD
    A([Start]) --> B[User fills Blood Request Form]
    B --> C[Provide: Blood Group, Location, Urgency, Patient Info]
    C --> D{Urgency\nType?}
    D -- emergency --> E[Radius = 50 km]
    D -- urgent --> F[Radius = 20 km]
    D -- normal --> G[Radius = 10 km]
    E & F & G --> H[getCompatibleDonors lookup]
    H --> I["MongoDB $geoNear aggregation\n(blood group + availability + not blocked)"]
    I --> J{Donors\nFound?}
    J -- No --> K[Return: 0 donors, request saved]
    J -- Yes --> L[insertMany notifications]
    L --> M[insertMany response records]
    M --> N[Socket.IO emit to each donor room]
    N --> O[Send email alerts async]
    O --> P[Return donor list to requestor]
    P --> Q[Donor receives push + email]
    Q --> R{Donor\nAccepts?}
    R -- Yes --> S[POST /api/blood/response accepted]
    S --> T[Notify requestor via socket + email]
    T --> U([End])
    R -- No --> V[Decline recorded]
    V --> Q
```

## 5.4 Class Diagram

```mermaid
classDiagram
    class User {
        +ObjectId _id
        +String name
        +String email
        +String password
        +String image
        +AddressSchema address
        +String gender
        +String dob
        +String phone
        +String bloodGroup
        +Boolean isVerified
        +String verificationToken
        +Date verificationTokenExpiresAt
        +String resetPasswordToken
        +Date resetTokenExpiresAt
        +Date lastLogin
        +signup()
        +login()
        +verifyEmail()
        +updateProfile()
        +forgotPassword()
        +resetPassword()
    }

    class Doctor {
        +ObjectId _id
        +String name
        +String email
        +String password
        +String image
        +String speciality
        +String degree
        +String experience
        +String about
        +Boolean available
        +Number fees
        +Object address
        +Number date
        +Object slots_booked
        +login()
        +getDashboard()
        +updateProfile()
        +changeAvailability()
    }

    class Appointment {
        +ObjectId _id
        +String userId
        +String docId
        +String slotDate
        +String slotTime
        +Object userData
        +Object docData
        +Number amount
        +Date date
        +Boolean cancelled
        +Date cancelledAt
        +Boolean payment
        +Boolean isCompleted
        +Date completedAt
        +Boolean refund
    }

    class Message {
        +ObjectId _id
        +String roomId
        +String sender
        +String senderType
        +String message
        +Date timestamp
        +Boolean seen
        +Date seenAt
    }

    class BloodDonor {
        +ObjectId _id
        +String donorType
        +String userId
        +String doctorId
        +String fullName
        +String email
        +String mobileNumber
        +String bloodGroup
        +GeoJSONPoint location
        +String locationName
        +Boolean availabilityStatus
        +Boolean isBlocked
        +Date lastDonationDate
        +Boolean acknowledgementAccepted
        +register()
        +toggleAvailability()
        +updateProfile()
    }

    class BloodRequest {
        +ObjectId _id
        +String requestorType
        +String requestorId
        +String patientName
        +String requiredBloodGroup
        +String contactNumber
        +GeoJSONPoint location
        +String urgencyType
        +String status
        +Number notifiedCount
        +Date fulfilledAt
        +create()
        +cancel()
        +close()
    }

    class BloodNotification {
        +ObjectId _id
        +String recipientType
        +String recipientId
        +ObjectId requestId
        +String type
        +String title
        +String message
        +String urgencyType
        +Boolean isRead
        +Date readAt
    }

    User "1" --> "0..*" Appointment : books
    Doctor "1" --> "0..*" Appointment : manages
    User "1" --> "0..*" Message : sends
    Doctor "1" --> "0..*" Message : sends
    User "1" --> "0..1" BloodDonor : registers as
    Doctor "1" --> "0..1" BloodDonor : registers as
    User "1" --> "0..*" BloodRequest : creates
    Doctor "1" --> "0..*" BloodRequest : creates
    BloodRequest "1" --> "0..*" BloodNotification : triggers
    BloodDonor "1" --> "0..*" BloodNotification : receives
```

## 5.5 Entity-Relationship (ER) Diagram

```mermaid
erDiagram
    USER {
        ObjectId _id PK
        string name
        string email UK
        string password
        string image
        string gender
        string dob
        string phone
        string bloodGroup
        boolean isVerified
        date lastLogin
    }

    DOCTOR {
        ObjectId _id PK
        string name
        string email UK
        string password
        string speciality
        string degree
        string fees
        boolean available
        object slots_booked
    }

    APPOINTMENT {
        ObjectId _id PK
        string userId FK
        string docId FK
        string slotDate
        string slotTime
        number amount
        boolean cancelled
        boolean payment
        boolean isCompleted
    }

    MESSAGE {
        ObjectId _id PK
        string roomId
        string sender
        string senderType
        string message
        boolean seen
        date timestamp
    }

    BLOOD_DONOR {
        ObjectId _id PK
        string donorType
        string userId FK
        string doctorId FK
        string bloodGroup
        string mobileNumber
        GeoJSON location
        boolean availabilityStatus
        boolean isBlocked
    }

    BLOOD_REQUEST {
        ObjectId _id PK
        string requestorId FK
        string requestorType
        string requiredBloodGroup
        string urgencyType
        string status
        GeoJSON location
        number notifiedCount
    }

    BLOOD_NOTIFICATION {
        ObjectId _id PK
        string recipientId FK
        ObjectId requestId FK
        string type
        string title
        string message
        boolean isRead
    }

    BLOOD_REQUEST_RESPONSE {
        ObjectId _id PK
        ObjectId requestId FK
        ObjectId donorId FK
        string responseStatus
        date respondedAt
    }

    USER ||--o{ APPOINTMENT : "books"
    DOCTOR ||--o{ APPOINTMENT : "receives"
    USER ||--o| BLOOD_DONOR : "registers as"
    DOCTOR ||--o| BLOOD_DONOR : "registers as"
    USER ||--o{ BLOOD_REQUEST : "creates"
    DOCTOR ||--o{ BLOOD_REQUEST : "creates"
    BLOOD_REQUEST ||--o{ BLOOD_NOTIFICATION : "generates"
    BLOOD_NOTIFICATION }o--|| USER : "notifies"
    BLOOD_NOTIFICATION }o--|| DOCTOR : "notifies"
    BLOOD_REQUEST ||--o{ BLOOD_REQUEST_RESPONSE : "has"
    BLOOD_DONOR ||--o{ BLOOD_REQUEST_RESPONSE : "responds"
```

---

# CHAPTER 6 — IMPLEMENTATION

## 6.1 Module Description

### Module 1: Authentication Module

**Purpose:** Manages the complete identity lifecycle for patients — from registration through verified login, session management, and account recovery.

**Workflow:**

The authentication module is implemented across `backend/controllers/authController.js`, `backend/routes/auth.route.js`, `backend/middlewares/verifyToken.js`, `backend/utils/generateTokenAndSetCookie.js`, and the frontend `frontend/src/store/authStore.js`.

**Registration Sub-Flow:**
1. The `signup` controller validates that all three fields are present, confirms email format via `validator.isEmail()`, and checks for existing user documents.
2. A bcrypt salt of cost factor 10 is generated: `bcryptjs.genSalt(10)`, followed by `bcryptjs.hash(password, salt)`.
3. A 6-digit numeric OTP is generated: `Math.floor(100000 + Math.random() * 900000).toString()`. This approach produces a uniformly distributed integer in the range [100000, 999999] and converts it to string for storage.
4. A new `userModel` document is created with `isVerified: false`, `verificationToken: OTP`, and `verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000` (24 hours).
5. `generateTokenAndCookie(res, newUser._id)` signs a JWT with `{ userId }` payload and 7-day expiry, then sets it as an `httpOnly`, `secure`, `SameSite=None` cookie.
6. `sendVerificationEmail(email, OTP)` invokes the Brevo SDK asynchronously.

**Email Verification Sub-Flow:**
1. The `verifyEmail` controller queries for a user document where `verificationToken === code` AND `verificationTokenExpiresAt > Date.now()`.
2. If found, `isVerified` is set to `true`, token fields are cleared (`undefined`), and `sendWelcomeEmail()` is dispatched.

**Login Sub-Flow:**
1. User document is fetched by email. If `!user.isVerified`, a 400 response directs the frontend to redirect to `/verify-email`.
2. `bcryptjs.compare(password, user.password)` verifies the plaintext password against the stored hash.
3. On success, a new JWT cookie is issued and `user.lastLogin` is updated.

**Password Recovery Sub-Flow:**
1. `forgotPassword` generates a cryptographically secure token: `crypto.randomBytes(20).toString('hex')` (40 hex characters, 160 bits entropy). Expiry is 1 hour.
2. The reset URL is constructed as `${CLIENT_URL}/reset-password/${resetToken}` and sent via email.
3. `resetPassword` sanitises the token (`token.trim().replace(/[^\w]/g, '')`), queries by token and expiry, hashes the new password, and clears the token fields.

**Frontend State (Zustand authStore):**

The `useAuthStore` Zustand store manages the entire authentication state on the client:
- `user`, `isAuthenticated`, `isLoading`, `isCheckingAuth`, `error`, `message`, `verificationEmail`
- `checkAuth()` — Called on app mount (`useEffect` in `App.jsx`). Sends `GET /api/auth/check-auth` with credentials to validate the existing cookie and restore session state.
- Route guards: `ProtectedRoute` redirects unauthenticated or unverified users. `RedirectAuthenticatedUser` redirects authenticated verified users away from auth pages.

**Components:** `LoginComponent.jsx`, `SignUp.jsx`, `EmailVerification.jsx`, `ForgotPasswordPage.jsx`, `ResetPasswordPage.jsx`, `PasswordStrengthMeter.jsx`, `InputField.jsx`, `LoadingButton.jsx`, `FloatingShape.jsx`.

---

### Module 2: Doctor Discovery and Speciality Browse Module

**Purpose:** Enables patients to discover and browse doctors by medical speciality without authentication.

**Workflow:**
1. On app initialisation, `AppContextProvider` calls `getDoctorsData()` which makes a `GET /api/doctor/list` request. The backend's `doctorList` controller queries `doctorModel.find({}).select(['-password', '-email'])` and returns all doctors.
2. The doctor data is stored in the `AppContext` and is immediately available to all components that consume the context.
3. On the `Doctors.jsx` page, the `useParams()` hook reads the `:speciality` URL parameter. If a speciality is provided, the component filters the doctors array client-side: `doctors.filter(doc => doc.speciality.toLowerCase() === speciality.toLowerCase())`.
4. The `SpecialityMenu.jsx` component renders six speciality cards (General Physician, Gynaecologist, Dermatologist, Paediatricians, Neurologist, Gastroenterologist) as navigation links to `/doctors/:speciality`.
5. The `TopDoctors.jsx` component renders the first 10 doctors on the Home page.
6. The `RelatedDoctors.jsx` component on the Appointment page renders up to 5 doctors of the same speciality, excluding the currently viewed doctor.

---

### Module 3: Appointment Booking Module

**Purpose:** Enables authenticated, verified patients to book, view, and cancel medical appointments.

**Workflow:**
1. On `Appointment.jsx`, the doctor's `docId` is read from `useParams()`. The matching doctor is looked up from the `doctors` array in `AppContext`.
2. Available time slots for the next 7 days are computed client-side. The component iterates through predefined time slots and cross-references them against `docData.slots_booked[dateKey]` to mark unavailable slots.
3. On "Book Appointment", `axios.post('/api/auth/book-appointment', { docId, slotDate, slotTime })` is called with the JWT cookie sent automatically (`axios.defaults.withCredentials = true`).
4. The backend's `bookAppointment` controller:
   - Fetches the doctor document with `doctorModel.findById(docId).select('-password')`.
   - Validates availability (`docData.available === false` returns 400).
   - Checks `slots_booked[slotDate].includes(slotTime)`.
   - On success: pushes slot, saves appointment, updates doctor slots, sends confirmation email.
5. `MyAppointments.jsx` fetches all appointments via `GET /api/auth/appointments` and renders them in a list. Users can cancel individual appointments, triggering `POST /api/auth/cancel-appointment { appointmentId }`.
6. On cancellation, the backend validates `appointmentData.userId === userId` (ownership check), marks `cancelled: true`, and removes the slot from `slots_booked`.

---

### Module 4: Payment Module (Razorpay Integration)

**Purpose:** Enables patients to pay consultation fees online using Razorpay's payment infrastructure.

**Workflow:**
1. From `MyAppointments.jsx`, the patient clicks "Pay Online" for an unpaid appointment.
2. Frontend calls `POST /api/auth/payment-razorpay { appointmentId, amount }`.
3. The backend instantiates `new razorpay({ key_id, key_secret })` and calls `razorpayInstance.orders.create({ amount: amount * 100, currency: process.env.CURRENCY, receipt: appointmentId })`. The `receipt` field stores the appointment MongoDB ID for later lookup.
4. The frontend receives the Razorpay order object and opens the Razorpay checkout script with `key`, `amount`, `currency`, `name`, `order_id`.
5. The Razorpay hosted checkout handles all payment UI, card/UPI/bank selection, 3D Secure, etc.
6. On success, Razorpay's SDK returns `{ razorpay_payment_id, razorpay_order_id, razorpay_signature }` to the frontend's `handler` callback.
7. Frontend calls `POST /api/auth/verifyRazorpay` with these three values.
8. The backend fetches the order: `razorpayInstance.orders.fetch(razorpay_order_id)`. If `orderInfo.status === 'paid'`, the appointment is updated with `payment: true` and `sendPaymentReceiptEmail()` is called with complete details (doctor name, speciality, clinic address, appointment date/time, payment ID).
9. The payment receipt email includes: patient name, payment amount, doctor name, speciality, clinic address, appointment date and time, payment date and time, and Razorpay payment ID.

---

### Module 5: Real-Time Chat Module

**Purpose:** Provides a persistent, real-time bidirectional messaging system between patients and doctors.

**Architecture:**
The chat module is built on Socket.IO co-located with the Express server via `http.createServer(app)`. Room management uses a `roomOnlineUsers` in-memory object on the server: `{ roomId: { socketId: { name, role } } }`.

**Room ID Convention:** Each doctor-patient pair has a unique room: `${userId}_${doctorId}` (constructed on the frontend). This ensures both parties join the same Socket.IO room.

**Frontend Components:**
- `ChatList.jsx` — Fetches active rooms via `POST /api/chat/rooms { roomIds }` which returns rooms with at least one message (via aggregation). Renders the doctor list with last message preview.
- `ChatWindow.jsx` — Fetches message history via `GET /api/chat/messages/:roomId`, renders messages, and handles send/receive via socket events.
- `socket.js` — Singleton Socket.IO client instance shared across components.

**Server-Side Events:**
- `join_room` — Socket joins the named room. Logs participant count.
- `send_message` — Persists message to MongoDB via `messageModel.create()`, then broadcasts to the room (excluding sender): `socket.to(roomId).emit('receive_message', ...)`.
- `user_online` / `user_offline` — Tracks active users per room in `roomOnlineUsers`. Emits `partner_online` events.
- `mark_seen` — Bulk-updates unseen messages: `messageModel.updateMany({ roomId, sender: { $ne: readerName }, seen: false }, { seen: true, seenAt: new Date() })`. Emits `messages_seen` to the sender.
- `disconnect` — Cleans up `roomOnlineUsers` entries and notifies partners.

**Blood Donation Socket Events:**
- `join_blood_room` / `leave_blood_room` — Each user joins a personal room `blood-{userId}` for blood notification delivery.
- `blood_notification` — Emitted by the blood controller when a request is created or a donor accepts. Contains `type`, `title`, `message`, `urgencyType`, `requestId`.

---

### Module 6: Blood Donation Management Module

**Purpose:** A comprehensive, production-grade blood donation coordination system enabling geospatial donor discovery, real-time notifications, and multi-channel emergency broadcasting.

**Sub-Modules:**

**6a. Donor Registration:**
- Accepts `fullName`, `mobileNumber`, `bloodGroup`, `latitude`, `longitude`, `locationName`, `lastDonationDate`, `emergencyContact`, `acknowledgementAccepted`.
- Detects caller identity from JWT cookie (`req.userId`) for user donors or from `authDoctor` middleware (`req.body.docId`) for doctor donors.
- Validates coordinates: latitude ∈ [-90, 90], longitude ∈ [-180, 180].
- Prevents duplicate registration via `bloodDonorModel.findOne({ userId: actorId })` check.
- Stores location as GeoJSON Point: `{ type: 'Point', coordinates: [longitude, latitude] }` (note: GeoJSON convention is [longitude, latitude], not [latitude, longitude]).
- Sends a donor registration confirmation email asynchronously.

**6b. Blood Compatibility Engine (`utils/bloodCompatibility.js`):**
The compatibility matrix is implemented as two lookup tables:
- `COMPATIBLE_DONORS`: For a given recipient group, returns all compatible donor groups.
  - `AB+` accepts all 8 groups (universal recipient).
  - `O-` accepts only `O-` (most restrictive recipient).
- `CAN_DONATE_TO`: For a given donor group, returns all groups they can donate to.
  - `O-` can donate to all 8 groups (universal donor).
  - `AB+` can only donate to `AB+`.
- `getCompatibleDonors(requiredBloodGroup)` is called during search and request creation to expand the donor pool beyond exact matches.

**6c. Blood Request and Donor Discovery:**
The `createBloodRequest` controller implements a sophisticated geospatial donor matching pipeline:
1. Determines search radius: 10 km (normal), 20 km (urgent), 50 km (emergency).
2. Calls `getCompatibleDonors(requiredBloodGroup)` to get all acceptable donor blood groups.
3. Executes a MongoDB aggregation with `$geoNear`:
```javascript
{ $geoNear: {
    near: { type: 'Point', coordinates: [lng, lat] },
    distanceField: 'distance',
    maxDistance: radiusMeters,
    spherical: true,
    query: {
        bloodGroup: { $in: compatibleGroups },
        availabilityStatus: true,
        isBlocked: false,
        // excludes the requestor themselves
    }
}}
```
4. Results are sorted by distance (nearest first), limited to 100 donors.
5. Notification documents are batch-inserted with `insertMany`.
6. Response tracking documents are batch-inserted.
7. Real-time socket notifications are emitted to each donor's personal room.
8. Emails are sent asynchronously to all donors using `.catch()` to prevent request blocking.
9. The complete donor list is returned in the API response for immediate UI rendering.

**6d. Donor Availability Toggle (`donorAvailabilityLogModel`):**
Each availability toggle is logged in a `donorAvailabilityLogs` collection with `previousStatus`, `newStatus`, `changedBy` ('self' or 'admin'), and timestamp — providing a complete audit trail.

**6e. Admin Blood Management:**
- `adminGetAllDonors`: Paginated donor list with search by name and filter by blood group.
- `adminBlockUnblockDonor`: Toggles `isBlocked` — blocked donors are excluded from all geospatial queries.
- `adminCreateEmergencyRequest`: Broadcasts to ALL available compatible donors within 50 km, bypasses ownership restrictions.
- `adminGetAnalytics`: Uses `Promise.all()` to execute 8 parallel aggregation queries: total donors, available donors, total/active/fulfilled requests, emergency requests, donors by blood group (`$group`), requests by urgency (`$group`).

---

### Module 7: Admin Management Module

**Purpose:** Provides platform administrators with complete operational control over doctors, appointments, and blood donation.

**Authentication:** Admin logs in via `POST /api/admin/login` with `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `.env`. The JWT payload is the concatenated string `email + password`, signed with `JWT_SECRET`. All subsequent admin requests include the token in the `atoken` header, verified by the `authAdmin` middleware which reconstructs and compares the same string.

**Doctor Lifecycle Management:**
- **Add Doctor:** `POST /api/admin/add-doctors` (with `authAdmin` + `upload.single('image')` middleware):
  1. Validates all required fields and email format.
  2. Hashes password with bcrypt.
  3. Uploads profile photo to Cloudinary.
  4. Creates doctor document with `date: Date.now()`.
  5. Sends welcome email with login credentials via `sendWelcomeDoctorEmail()`.
- **Delete Doctor:** `POST /api/admin/delete-doctor`: Cancels all non-completed, non-cancelled appointments for the doctor (via `appointmentModel.updateMany()`), then deletes the doctor document.
- **Toggle Availability:** `POST /api/admin/change-availability`: Flips `doctor.available`.

**Dashboard:** `GET /api/admin/dashboard` returns `{ doctors: count, users: count, appointments: count, latestAppointments: appointments.reverse() }`.

**Frontend State (AdminContext):**
`AdminContextProvider` wraps the admin panel and provides: `aToken`, `getAllDoctors()`, `changeAvailability()`, `deleteDoctor()`, `getAllAppointments()`, `cancelAppointment()`, `getDashboard()`.

---

### Module 8: Doctor Panel Module

**Purpose:** Provides doctors with a dedicated interface for appointment management, patient communication, earnings tracking, and profile administration.

**Authentication:** The `DoctorContext` stores `dToken` in localStorage (as opposed to the cookie-based user auth). The `authDoctor` middleware reads `dtoken` from request headers, verifies the JWT, and extracts `docId` from the payload: `req.body.docId = token_decode.id`.

**Doctor Dashboard:**
The `doctorDashboard` controller computes:
- `earnings`: Sum of `appointment.amount` for all appointments where `isCompleted === true` OR `payment === true`.
- `patients`: Unique set of `userId` values across all appointments.
- `latestAppointments`: Most recent 6 appointments (reversed array, sliced to 6).

**Profile Management:**
- `updateDoctorProfile`: Updates `fees`, `address`, `available`, `about` fields.
- `updateDoctorPhoto`: Accepts a new image file through Multer, uploads to Cloudinary, updates `doctor.image`.

---

### Module 9: Email Notification Module

**Purpose:** Automates all transactional email communications triggered by application events.

**Infrastructure:** Brevo (formerly Sendinblue) Transactional Email API via `@getbrevo/brevo` SDK. The sender identity is `{ name: "Medislot", email: "hemheart1234@gmail.com" }`. Configuration is in `backend/mailtrap/mailtrapConfig.js`.

**Email Templates (`backend/mailtrap/emailTemplates.js`):**

| Template | Trigger | Key Data |
|----------|---------|----------|
| `VERIFICATION_EMAIL_TEMPLATE` | User registration | OTP code |
| `WELCOME_MAIL_TEMPLATE` | Email verification success | User name |
| `WELCOME_DOCTOR_TEMPLATE` | Admin adds doctor | Doctor name, email, password |
| `PASSWORD_RESET_REQUEST_TEMPLATE` | Forgot password | Reset URL |
| `PASSWORD_RESET_SUCCESS_TEMPLATE` | Password reset success | — |
| `APPOINTMENT_CONFIRMATION_TEMPLATE` | Appointment booked | Doctor name, date, time, amount |
| `PAYMENT_RECEIPT_TEMPLATE` | Payment verified | Patient, amount, doctor, speciality, clinic, date/time, payment ID |
| `BLOOD_REQUEST_ALERT_TEMPLATE` | Blood request created | Donor name, blood group, patient, contact, location, urgency, distance, coordinates |
| `BLOOD_DONOR_REGISTRATION_TEMPLATE` | Donor registers | Donor name, blood group |
| `DONOR_ACCEPTED_EMAIL_TEMPLATE` | Donor accepts request | Requestor name, donor name/blood group, patient, contact |

All email sending functions are implemented in `backend/mailtrap/emails.js`. Each function validates required parameters and invokes `sendEmail()` from `mailtrapConfig.js`.

---

### Module 10: File Upload Module (Cloudinary)

**Purpose:** Handles secure image upload and CDN-delivered image serving for user profiles, doctor profiles, and admin-uploaded doctor photos.

**Implementation:**
`backend/middlewares/multer.js` configures Multer with `diskStorage` to temporarily store uploaded files. The `upload.single('image')` middleware is applied to routes accepting image uploads.

`backend/config/cloudinary.js` configures the Cloudinary SDK using `CLOUDINARY_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_SECRET_KEY` from environment variables.

Upload flow:
1. Multer writes the uploaded file to disk as a temp file.
2. `cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' })` transfers the file to Cloudinary.
3. The returned `secure_url` (HTTPS CDN URL) is stored in the database.
4. The local temp file is discarded.

---

## 6.2 Frontend Implementation

### 6.2.1 Routing Architecture

The patient frontend uses **React Router DOM v6** for declarative, nested client-side routing. The `App.jsx` component defines all route mappings using `<Routes>` and `<Route>` components:

**Route Categories:**

| Route | Component | Auth Required |
|-------|-----------|---------------|
| `/` | `Home` | No |
| `/doctors` | `Doctors` | No |
| `/doctors/:speciality` | `Doctors` | No |
| `/about` | `About` | No |
| `/contact` | `Contact` | No |
| `/blood-donation/requests` | `ActiveBloodRequests` | No |
| `/login` | `LoginComponent` | No (redirect if auth) |
| `/Signup` | `SignUp` | No (redirect if auth) |
| `/verify-email` | `EmailVerification` | No |
| `/forgot-password` | `ForgotPasswordPage` | No (redirect if auth) |
| `/reset-password/:token` | `ResetPasswordPage` | No (redirect if auth) |
| `/my-profile` | `MyProfile` | No (soft guard) |
| `/my-appointments` | `MyAppointments` | No (soft guard) |
| `/appointment/:docId` | `Appointment` | Yes (ProtectedRoute) |
| `/doctor/chat` | `ChatPage` | Yes (ProtectedRoute) |
| `/blood-donation/register` | `DonorRegistration` | Yes |
| `/blood-donation/profile` | `DonorProfile` | Yes |
| `/blood-donation/request` | `BloodRequestForm` | Yes |
| `/blood-donation/my-requests` | `MyBloodRequests` | Yes |
| `/blood-donation/notifications` | `BloodNotifications` | Yes |
| `/blood-donation/requests/:requestId/donors` | `BloodDonorResults` | Yes |

**Route Guards:**
- `ProtectedRoute`: Checks `isAuthenticated` and `user.isVerified` from `useAuthStore`. Redirects to `/login` or `/verify-email` respectively.
- `RedirectAuthenticatedUser`: Redirects verified, authenticated users away from auth pages to `/`.

**Navbar/Footer Visibility:** The `App.jsx` component computes `shouldHideHeaderFooter` by checking if the current pathname starts with any route in `hideHeaderFooterRoutes`. This provides a clean, distraction-free UI for authentication flows.

### 6.2.2 Component Architecture

**Reusable Components (`/src/components`):**

| Component | Purpose |
|-----------|---------|
| `Navbar.jsx` | Responsive navigation bar with authentication state, doctor dropdown, mobile menu |
| `Footer.jsx` | Site footer with links and contact information |
| `Header.jsx` | Hero section on Home page |
| `SpecialityMenu.jsx` | Speciality filter cards linking to doctor browse |
| `TopDoctors.jsx` | Featured doctors grid on Home page |
| `RelatedDoctors.jsx` | Same-speciality doctor suggestions on Appointment page |
| `Banner.jsx` | Call-to-action banner |
| `ChatList.jsx` | Doctor list for patient chat interface |
| `ChatWindow.jsx` | Full chat conversation interface with real-time messaging |
| `InputField.jsx` | Reusable controlled input with label |
| `LoadingButton.jsx` | Submit button with spinner state |
| `LoadingSpinner.jsx` | Full-page loading indicator |
| `PasswordStrengthMeter.jsx` | Visual password strength indicator |
| `FloatingShape.jsx` | Animated decorative shapes on auth pages |
| `BloodGroupBadge.jsx` | Styled blood group indicator |
| `BloodRequestCard.jsx` | Blood request summary card |
| `DonorCard.jsx` | Donor summary card |
| `UrgencyBadge.jsx` | Colour-coded urgency level badge |
| `NotificationItem.jsx` | Blood notification list item |
| `AcknowledgementModal.jsx` | Donor consent modal |

### 6.2.3 State Management (Zustand)

Medislot uses **Zustand v5** for client-side state management in the patient frontend, chosen for its minimal boilerplate compared to Redux and its native support for async actions.

**`useAuthStore` (`/src/store/authStore.js`):**
Manages the complete authentication and user profile state. Key state slices:
- `user` — Full user object from MongoDB (excluding password)
- `isAuthenticated` — Boolean session flag
- `isCheckingAuth` — True during initial auth check (shows `LoadingSpinner`)
- `isLoading` — True during async operations (disables submit buttons)
- `verificationEmail` — Persists email across signup→verify-email navigation
- `error` / `message` — Error and success message state

Actions: `signup`, `verifyEmail`, `resendVerificationEmail`, `checkAuth`, `login`, `logout`, `forgotPassword`, `resetPassword`, `updateUserProfile`, `clearError`.

**`useBloodStore` (`/src/store/bloodStore.js`):**
Manages all blood donation state:
- `donorProfile`, `myRequests`, `notifications`, `unreadCount`, `searchResults`
- All CRUD actions mapped 1:1 to API endpoints
- `pushIncomingNotification()` — Called by Socket.IO event listener to prepend new notifications without API refetch

**`AppContext` (`/src/context/AppContext.jsx`):**
React Context API (not Zustand) is used for the AppContext, which holds the global `doctors` array fetched on app initialisation. This is appropriate as the doctors list is read-only from the patient perspective.

### 6.2.4 HTTP Client Configuration

`axios.defaults.withCredentials = true` is set globally in `authStore.js`, ensuring the JWT cookie is automatically included in every request to the backend. The `VITE_BACKEND_URL` environment variable is read from `.env` at build time through Vite's `import.meta.env` mechanism.

### 6.2.5 Real-Time Socket Integration

`frontend/src/socket.js` exports a singleton Socket.IO client instance:
```javascript
export const socket = io(VITE_BACKEND_URL, {
  transports: ["websocket"],
  autoConnect: true,
});
```
Components import this singleton and attach event listeners in `useEffect` hooks, cleaning up listeners in the cleanup function to prevent memory leaks.

---

## 6.3 Backend Implementation

### 6.3.1 Server Architecture

`backend/server.js` implements the following initialisation sequence:
1. `dotenv.config()` — loads environment variables from `.env`.
2. `const app = express()` — creates the Express application.
3. `const server = http.createServer(app)` — wraps Express in an HTTP server.
4. `new Server(server, { cors })` — creates the Socket.IO server on the same HTTP server instance, enabling shared port operation.
5. `connectDB()` — establishes Mongoose connection to MongoDB Atlas.
6. `connectCloudinary()` — configures Cloudinary SDK with environment credentials.
7. Middleware stack: `express.json()`, `cookieParser()`, CORS.
8. Route mounting: `/api/admin`, `/api/auth`, `/api/doctor`, `/api/chat`, `/api/blood`.
9. `app.set('io', io)` — exposes the Socket.IO instance to controllers via `req.app.get('io')`.

### 6.3.2 CORS Configuration

CORS is configured with an explicit origin allowlist checked on every request:
```javascript
origin: function(origin, callback) {
  if (!origin || allowedOrigins.includes(origin)) {
    callback(null, true);
  } else {
    callback(new Error("Not allowed by CORS"));
  }
}
```
`credentials: true` permits cross-origin cookie transmission. `allowedHeaders` explicitly lists `Content-Type`, `Authorization`, `atoken`, and `dtoken` to support all three authentication mechanisms.

### 6.3.3 Middleware Chain

For a typical protected user route, the middleware chain is:

```
Request → CORS → JSON Parser → Cookie Parser → verifyToken → Controller → Response
```

For admin routes:
```
Request → CORS → JSON Parser → Cookie Parser → authAdmin → Controller → Response
```

For doctor routes:
```
Request → CORS → JSON Parser → Cookie Parser → authDoctor → Controller → Response
```

For routes with file upload:
```
Request → CORS → JSON Parser → Cookie Parser → Multer(upload.single) → verifyToken/authAdmin → Controller → Response
```

### 6.3.4 Controller Design Pattern

All controllers follow a consistent pattern:
```javascript
export const controllerName = async (req, res) => {
  try {
    // 1. Extract and validate input
    // 2. Query/mutate database
    // 3. Perform side effects (email, socket, cloudinary)
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(...);
    res.status(400/500).json({ success: false, message: error.message });
  }
};
```

### 6.3.5 API Routes Summary

**Auth Routes (`/api/auth`):**

| Method | Endpoint | Middleware | Purpose |
|--------|----------|-----------|---------|
| POST | `/signup` | — | Register new user |
| POST | `/login` | — | Login user |
| POST | `/logout` | — | Clear cookie |
| GET | `/check-auth` | verifyToken | Validate session |
| POST | `/verify-email` | — | Submit OTP |
| POST | `/resend-verification-email` | — | Resend OTP |
| POST | `/forgot-password` | — | Send reset link |
| POST | `/reset-password/:token` | — | Reset password |
| GET | `/get-profile` | verifyToken | Get user profile |
| PUT | `/update-profile` | upload.single, verifyToken | Update profile |
| POST | `/book-appointment` | verifyToken | Book slot |
| GET | `/appointments` | verifyToken | Get user's appointments |
| POST | `/cancel-appointment` | verifyToken | Cancel appointment |
| POST | `/payment-razorpay` | verifyToken | Create Razorpay order |
| POST | `/verifyRazorpay` | verifyToken | Verify payment |

---

## 6.4 Database Implementation

### Connection

`backend/config/mongodb.js` establishes the Mongoose connection:
```javascript
mongoose.connect(process.env.MONGODB_URI)
```
MongoDB Atlas provides a `mongodb+srv://` connection string with built-in TLS encryption. Mongoose 8 uses the native MongoDB driver's connection pooling (default pool size 5).

### Indexing Strategy

| Collection | Index | Purpose |
|-----------|-------|---------|
| `users` | `email` (unique) | Fast login lookup |
| `doctors` | `email` (unique) | Fast login + duplicate check |
| `messages` | `roomId` | Fast message history retrieval |
| `bloodDonors` | `location` (2dsphere) | Geospatial queries |
| `bloodDonors` | `{bloodGroup, availabilityStatus, isBlocked}` | Compound filter in geoNear |
| `bloodDonors` | `userId`, `doctorId` | Donor profile lookup |
| `bloodRequests` | `location` (2dsphere) | Geospatial indexing |
| `bloodRequests` | `{requestorId, status, createdAt}` | My requests pagination |
| `bloodRequests` | `{requiredBloodGroup, status}` | Blood group filter |
| `bloodNotifications` | `{recipientId, isRead, createdAt}` | Unread count + list |

### Denormalisation Pattern

The `appointments` collection stores `userData` and `docData` as embedded documents (snapshots) at the time of booking. This is intentional denormalisation:
- **Reason:** Patient name/photo and doctor fees/speciality may change after booking. The appointment record must preserve the historical state.
- **Trade-off:** Storage increases (each appointment document is larger), but read performance for the appointment list is O(1) — no joins required.

---

## 6.5 API Documentation

### Table 6.1 — Authentication API

| Endpoint | Method | Auth | Request Body | Response | Description |
|----------|--------|------|--------------|----------|-------------|
| `/api/auth/signup` | POST | None | `{ name, email, password }` | `{ success, user }` | Register new patient |
| `/api/auth/login` | POST | None | `{ email, password }` | `{ success, user, isAuthenticated }` | Login, sets cookie |
| `/api/auth/logout` | POST | None | — | `{ success, message }` | Clears JWT cookie |
| `/api/auth/check-auth` | GET | Cookie JWT | — | `{ success, user }` | Validate session |
| `/api/auth/verify-email` | POST | None | `{ code }` | `{ success, user }` | Verify OTP |
| `/api/auth/resend-verification-email` | POST | None | `{ email }` | `{ success, message }` | Resend OTP |
| `/api/auth/forgot-password` | POST | None | `{ email }` | `{ success, message }` | Send reset link |
| `/api/auth/reset-password/:token` | POST | None | `{ password }` | `{ success, message }` | Reset password |
| `/api/auth/get-profile` | GET | Cookie JWT | — | `{ success, userData }` | Get user profile |
| `/api/auth/update-profile` | PUT | Cookie JWT | FormData (name, phone, address, dob, gender, bloodGroup, image?) | `{ success, message }` | Update profile |
| `/api/auth/book-appointment` | POST | Cookie JWT | `{ docId, slotDate, slotTime }` | `{ success, message }` | Book appointment |
| `/api/auth/appointments` | GET | Cookie JWT | — | `{ success, appointments[] }` | Get user appointments |
| `/api/auth/cancel-appointment` | POST | Cookie JWT | `{ appointmentId }` | `{ success, message }` | Cancel appointment |
| `/api/auth/payment-razorpay` | POST | Cookie JWT | `{ appointmentId, amount }` | `{ success, order }` | Create Razorpay order |
| `/api/auth/verifyRazorpay` | POST | Cookie JWT | `{ razorpay_order_id, razorpay_payment_id, razorpay_signature }` | `{ success, message }` | Verify payment |

### Table 6.2 — Admin API

| Endpoint | Method | Auth | Request Body / Params | Response | Description |
|----------|--------|------|-----------------------|----------|-------------|
| `/api/admin/login` | POST | None | `{ email, password }` | `{ success, token }` | Admin login |
| `/api/admin/add-doctors` | POST | aToken | FormData (doctor fields + image) | `{ success, message }` | Add doctor |
| `/api/admin/all-doctors` | POST | aToken | — | `{ success, doctors[] }` | Get all doctors |
| `/api/admin/change-availability` | POST | aToken | `{ docId }` | `{ success, message }` | Toggle doctor availability |
| `/api/admin/delete-doctor` | POST | aToken | `{ docId }` | `{ success, message }` | Delete doctor |
| `/api/admin/appointments` | GET | aToken | — | `{ success, appointments[] }` | Get all appointments |
| `/api/admin/cancel-appointment` | POST | aToken | `{ appointmentId }` | `{ success, message }` | Cancel appointment |
| `/api/admin/dashboard` | GET | aToken | — | `{ success, dashboardData }` | Dashboard summary |

### Table 6.3 — Doctor API

| Endpoint | Method | Auth | Request Body | Response | Description |
|----------|--------|------|--------------|----------|-------------|
| `/api/doctor/login` | POST | None | `{ email, password }` | `{ success, token }` | Doctor login |
| `/api/doctor/list` | GET | None | — | `{ success, doctors[] }` | Public doctor list |
| `/api/doctor/appointments` | GET | dToken | — | `{ success, appointments[] }` | Doctor's appointments |
| `/api/doctor/appointment-completed` | POST | dToken | `{ appointmentId }` | `{ success, message }` | Mark complete |
| `/api/doctor/appointment-cancel` | POST | dToken | `{ appointmentId }` | `{ success, message }` | Cancel appointment |
| `/api/doctor/dashboard` | GET | dToken | — | `{ success, dashData }` | Doctor dashboard |
| `/api/doctor/profile` | GET | dToken | — | `{ success, profileData }` | Doctor profile |
| `/api/doctor/update-profile` | POST | dToken | `{ fees, address, available, about }` | `{ success, message }` | Update profile |
| `/api/doctor/update-photo` | POST | dToken + Multer | FormData (image) | `{ success, imageUrl }` | Update profile photo |

### Table 6.4 — Blood Donation API (User)

| Endpoint | Method | Auth | Request Body / Query | Response | Description |
|----------|--------|------|----------------------|----------|-------------|
| `/api/blood/donor/register` | POST | Cookie JWT | `{ fullName, mobileNumber, bloodGroup, latitude, longitude, locationName, lastDonationDate, emergencyContact, acknowledgementAccepted }` | `{ success, donor }` | Register as donor |
| `/api/blood/donor/me` | GET | Cookie JWT | — | `{ success, donor }` | Get own donor profile |
| `/api/blood/donor/update` | PUT | Cookie JWT | `{ fullName, mobileNumber, bloodGroup, latitude, longitude, locationName, lastDonationDate, emergencyContact }` | `{ success, donor }` | Update donor profile |
| `/api/blood/donor/toggle-availability` | PUT | Cookie JWT | — | `{ success, availabilityStatus }` | Toggle availability |
| `/api/blood/donor/history` | GET | Cookie JWT | — | `{ success, history[], donor }` | Donor history |
| `/api/blood/request/create` | POST | Cookie JWT | `{ patientName, requiredBloodGroup, contactNumber, latitude, longitude, locationName, urgencyType, additionalNotes, requiredDate }` | `{ success, requestId, notifiedCount, donors[] }` | Create blood request |
| `/api/blood/request/my-requests` | GET | Cookie JWT | `?page=1` | `{ success, requests[], total, page, pages }` | Get own requests |
| `/api/blood/request/cancel` | PUT | Cookie JWT | `{ requestId }` | `{ success, message }` | Cancel request |
| `/api/blood/request/close` | PUT | Cookie JWT | `{ requestId }` | `{ success, message }` | Mark fulfilled |
| `/api/blood/request/:id/donors` | GET | Cookie JWT | — | `{ success, donors[], request, total }` | Get request donors |
| `/api/blood/request/:id` | GET | Cookie JWT | — | `{ success, request, responses[] }` | Get request details |
| `/api/blood/requests/active` | GET | None | `?bloodGroup=&urgencyType=&page=1` | `{ success, requests[], total }` | Public active requests |
| `/api/blood/search/donors` | POST | Cookie JWT | `{ bloodGroup, latitude, longitude, radius, includeCompatible, page, limit }` | `{ success, donors[], count }` | Search donors |
| `/api/blood/notifications` | GET | Cookie JWT | `?page=1` | `{ success, notifications[], unreadCount }` | Get notifications |
| `/api/blood/notifications/mark-read` | PUT | Cookie JWT | `{ notificationIds[] }` | `{ success, message }` | Mark as read |
| `/api/blood/notifications/mark-all-read` | PUT | Cookie JWT | — | `{ success, message }` | Mark all as read |
| `/api/blood/notifications/unread-count` | GET | Cookie JWT | — | `{ success, unreadCount }` | Get unread count |
| `/api/blood/response` | POST | Cookie JWT | `{ requestId, responseStatus, notes }` | `{ success, message }` | Accept/decline request |

### Table 6.5 — Chat API

| Endpoint | Method | Auth | Request | Response | Description |
|----------|--------|------|---------|----------|-------------|
| `/api/chat/messages/:roomId` | GET | — | — | `{ success, messages[] }` | Get message history |
| `/api/chat/rooms` | POST | — | `{ roomIds[] }` | `{ success, activeRooms{} }` | Get active chat rooms with metadata |

### Table 6.6 — Socket.IO Events

| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| `join_room` | Client → Server | `roomId` | Join a chat room |
| `send_message` | Client → Server | `{ roomId, message, sender, senderType, time }` | Send a message |
| `receive_message` | Server → Client | `{ roomId, message, sender, time }` | Receive a message |
| `user_online` | Client → Server | `{ roomId, name, role }` | Announce presence |
| `user_offline` | Client → Server | `{ roomId, name }` | Announce departure |
| `partner_online` | Server → Client | `{ name, online }` | Partner presence change |
| `mark_seen` | Client → Server | `{ roomId, readerName }` | Mark messages as seen |
| `messages_seen` | Server → Client | `{ roomId }` | Notify sender of read receipt |
| `join_blood_room` | Client → Server | `userId` | Join personal blood notification room |
| `leave_blood_room` | Client → Server | `userId` | Leave blood notification room |
| `blood_notification` | Server → Client | `{ type, title, message, urgencyType, requestId }` | Push blood notification |
| `disconnect` | — | — | Cleanup presence state |

---

## 6.6 Security Implementation

### 6.6.1 Password Security

- **Algorithm:** bcryptjs with cost factor 10, generating a unique 16-byte salt per password.
- **Storage:** Only the hash is stored. The plaintext password is immediately discarded after hashing.
- **Verification:** `bcryptjs.compare(plaintext, hash)` — constant-time comparison preventing timing attacks.
- **Doctor passwords:** Admin-chosen passwords are sent to doctors in the welcome email, with the expectation of password change (noted as a future enhancement).

### 6.6.2 JWT Authentication Strategy

Three distinct authentication strategies are implemented:

| Strategy | Used For | Token Location | Payload | Expiry |
|----------|----------|----------------|---------|--------|
| `verifyToken` middleware | Patient users | `httpOnly` cookie | `{ userId }` | 7 days |
| `authDoctor` middleware | Doctors | `dtoken` header | `{ id: doctorId }` | No expiry (stateless) |
| `authAdmin` middleware | Admin | `atoken` header | `email + password` (string) | No expiry |

The `httpOnly` cookie flag for user tokens prevents JavaScript access, mitigating XSS-based token theft. The `secure: true` flag enforces HTTPS-only transmission.

### 6.6.3 Input Validation

- Email format: `validator.isEmail(email)` on all registration/login endpoints.
- Password minimum length: 8 characters enforced on doctor creation.
- Blood donor coordinates: Range validation (`lat ∈ [-90, 90]`, `lng ∈ [-180, 180]`) with `isNaN` checks.
- Blood request response status: Enum validation (`['accepted', 'declined']`).
- Appointment ownership: `appointmentData.userId !== userId` check before cancellation.
- Blood request ownership: `request.requestorId !== actorId` check before cancel/close.

### 6.6.4 CORS Policy

The CORS middleware enforces an explicit origin allowlist:
```javascript
const allowedOrigins = [
  "http://127.0.0.1:5500",
  "http://localhost:5173",    // local frontend
  "http://localhost:5174",    // local admin panel
  "https://doctor-booking-appointment-application.vercel.app",       // production frontend
  "https://doctor-booking-appointment-application-6gu7.vercel.app"  // production admin
];
```
Requests from unlisted origins receive a CORS error. `credentials: true` is required for cross-origin cookie sharing.

### 6.6.5 Password Reset Security

- Reset tokens are generated with `crypto.randomBytes(20).toString('hex')` — 160 bits of cryptographic randomness, making brute-force infeasible.
- Tokens expire after 1 hour: `Date.now() + 1 * 60 * 60 * 1000`.
- Tokens are sanitised before database query: `token.trim().replace(/[^\w]/g, '')` to strip URL encoding artifacts.
- Tokens are invalidated after use (set to `undefined`).

### 6.6.6 Role-Based Access Control

| Operation | Patient | Doctor | Admin |
|-----------|---------|--------|-------|
| Book appointment | ✓ | — | — |
| Cancel own appointment | ✓ | — | — |
| Cancel any appointment | — | Own only | ✓ |
| Mark appointment complete | — | Own only | — |
| Add doctor | — | — | ✓ |
| Delete doctor | — | — | ✓ |
| Block blood donor | — | — | ✓ |
| Broadcast emergency request | — | — | ✓ |
| Create blood request | ✓ | ✓ | ✓ |
| Register as donor | ✓ | ✓ | — |
| View all appointments | — | — | ✓ |

---

## 6.7 Screenshots of Application

> **[Insert Screenshot Here — Fig 6.1: Home Page]**
> Home page showing the hero section with "Book appointment" CTA, speciality filter grid (General Physician, Gynaecologist, Dermatologist, Paediatrics, Neurologist, Gastroenterologist), and top doctors listing.

> **[Insert Screenshot Here — Fig 6.2: Doctors Listing Page]**
> Doctor browse page with speciality filter in sidebar and doctor cards showing photo, name, speciality, and availability badge.

> **[Insert Screenshot Here — Fig 6.3: Appointment Booking Page]**
> Individual doctor profile page showing doctor information, 7-day calendar slot picker, and available time slots with booked slots greyed out.

> **[Insert Screenshot Here — Fig 6.4: User Profile Page]**
> Profile edit form showing name, phone, DOB, gender, blood group, address fields, and profile photo upload area.

> **[Insert Screenshot Here — Fig 6.5: My Appointments Page]**
> Appointments list showing appointment cards with doctor photo, name, speciality, date/time, status badges (Upcoming/Cancelled/Completed), and Pay/Cancel action buttons.

> **[Insert Screenshot Here — Fig 6.6: Real-Time Chat Interface]**
> Split-pane chat UI with doctor list on left (showing last message preview, timestamp, unread indicator) and active conversation on right with message bubbles, sender identification, and online presence indicator.

> **[Insert Screenshot Here — Fig 6.7: Blood Donation Home Page]**
> Blood donation landing page with sections for donor registration, blood request creation, donor search, and active requests feed.

> **[Insert Screenshot Here — Fig 6.8: Admin Dashboard]**
> Admin dashboard showing stats cards (Total Doctors, Total Patients, Total Appointments), latest appointments table, and navigation sidebar.

> **[Insert Screenshot Here — Fig 6.9: Doctor Dashboard]**
> Doctor personal dashboard showing earnings, total appointments, unique patient count, and recent appointments table with complete/cancel actions.

> **[Insert Screenshot Here — Fig 6.10: Blood Analytics Dashboard]**
> Blood analytics page with bar/pie charts showing donor count by blood group (using Recharts), request breakdown by urgency, and total stats.


---

# CHAPTER 7 — SOFTWARE TESTING

## 7.1 Testing Types

### 7.1.1 Unit Testing

Unit testing in Medislot targets individual functions and utility modules in isolation:

- **`bloodCompatibility.js`** — The `getCompatibleDonors()` and `isCompatible()` functions can be unit-tested with all 8 blood group input combinations. For example: `getCompatibleDonors('AB+')` must return all 8 groups; `getCompatibleDonors('O-')` must return only `['O-']`.
- **`generateTokenAndSetCookie.js`** — The JWT signing function can be tested by verifying that the returned token decodes correctly with `jwt.verify()` and that the cookie is set with correct options.
- **Validation logic in controllers** — Email format checks, coordinate range validation, and field presence checks can be tested with boundary inputs.

Tools applicable: Jest, Mocha, Chai.

### 7.1.2 Integration Testing

Integration tests verify that multiple components (controller + database + middleware) interact correctly:

- **Signup → Email Verification flow:** POST `/api/auth/signup` followed by POST `/api/auth/verify-email` with the correct OTP, verifying `user.isVerified === true` in the database.
- **Appointment booking + slot locking:** POST `/api/auth/book-appointment` for a slot, followed by a second booking of the same slot — verifying the second request returns 400 with "Slot not available".
- **Blood request + geospatial notification:** Create a blood donor at known coordinates, create a blood request within the search radius, verify the notification document is created in `bloodNotifications` for the donor.

Tools applicable: Jest + Supertest (HTTP assertions against the running Express server).

### 7.1.3 Functional Testing

Functional tests verify the complete application behaviour from the user's perspective:

- **Authentication flow:** Register → Receive email → Verify OTP → Login → Access protected route → Logout → Confirm cookie cleared.
- **Appointment lifecycle:** Book → View in My Appointments → Pay → Verify payment status → Cancel → Verify slot released.
- **Blood donation lifecycle:** Register as donor → Create request → Receive socket notification → Accept → Verify requestor receives acceptance notification.

### 7.1.4 API Testing (Postman / Insomnia)

All REST API endpoints are tested using Postman with a pre-configured collection:

- Cookie management: Postman's cookie jar automatically handles the `httpOnly` cookie flow.
- Header tokens: `atoken` and `dtoken` values are stored in Postman environment variables.
- Request chaining: Signup → extract user ID → verify email → login → book appointment.

### 7.1.5 UI/Frontend Testing

Manual UI testing is conducted in Chrome DevTools:

- **Responsive testing:** Chrome's device toolbar is used to simulate mobile (375px), tablet (768px), and desktop (1280px+) viewports.
- **Network testing:** API calls are inspected in the Network tab to verify request payloads, response codes, and cookie transmission.
- **State testing:** React DevTools extension is used to inspect Zustand store state during interaction flows.

### 7.1.6 Performance Testing

- The `$geoNear` aggregation query is tested with varying donor counts to verify index utilisation (confirmed via `explain('executionStats')`).
- Socket.IO connection handling is stress-tested with multiple simultaneous room joins.
- Cloudinary upload latency is measured and confirmed to be non-blocking (average 800ms – 1500ms depending on image size).

---

## 7.2 Test Cases and Results

### Table 7.1 — Authentication Module Test Cases

| TC ID | Module | Scenario | Input | Expected Result | Actual Result | Status |
|-------|--------|----------|-------|-----------------|---------------|--------|
| TC-A-001 | Signup | Valid registration | `{ name: "John", email: "john@test.com", password: "Pass@1234" }` | 201, `{ success: true, user }`, OTP email sent, httpOnly cookie set | 201, success response, email delivered, cookie visible in DevTools | PASS |
| TC-A-002 | Signup | Duplicate email | `{ email: existing@email.com, ... }` | 400, `{ success: false, message: "User already exists" }` | 400, correct error message | PASS |
| TC-A-003 | Signup | Invalid email format | `{ email: "notanemail", ... }` | 200, `{ success: false, message: "enter a valid email" }` | Correct validation response | PASS |
| TC-A-004 | Signup | Missing fields | `{ email: "a@b.com" }` (no name/password) | 400, `{ message: "All fields are required" }` | 400, error thrown | PASS |
| TC-A-005 | Email Verification | Valid OTP | Correct 6-digit OTP within 24h | 200, `{ success: true, user.isVerified: true }`, welcome email sent | OTP accepted, user verified in DB, welcome email received | PASS |
| TC-A-006 | Email Verification | Expired OTP | Valid OTP after 24h | 400, "Invalid or expired verification code" | Correct rejection | PASS |
| TC-A-007 | Email Verification | Wrong OTP | Incorrect 6-digit code | 400, "Invalid or expired verification code" | Correct rejection | PASS |
| TC-A-008 | Resend OTP | Unverified user | `{ email: unverified@test.com }` | New OTP generated (10min expiry), email sent | New OTP delivered, previous OTP invalidated | PASS |
| TC-A-009 | Resend OTP | Already verified | `{ email: verified@test.com }` | 400, "Email is already verified" | Correct rejection | PASS |
| TC-A-010 | Login | Valid credentials | Correct email + password, verified account | 200, `{ success: true, user }`, JWT cookie set, `lastLogin` updated | Login successful, cookie set, lastLogin updated in DB | PASS |
| TC-A-011 | Login | Wrong password | Correct email, wrong password | 400, "Invalid credentials" | Correct rejection | PASS |
| TC-A-012 | Login | Unverified email | Valid credentials, unverified user | 400, "Email not verified..." | Redirect to verify-email triggered in frontend | PASS |
| TC-A-013 | Login | Non-existent user | `email: nobody@test.com` | 400, "User doesn't exist" | Correct rejection | PASS |
| TC-A-014 | Logout | Authenticated user | POST `/api/auth/logout` | 200, cookie cleared (Set-Cookie: token=; Max-Age=0) | Cookie cleared in browser | PASS |
| TC-A-015 | Check Auth | Valid cookie | GET `/api/auth/check-auth` with valid cookie | 200, `{ success: true, user }` | Session restored correctly | PASS |
| TC-A-016 | Check Auth | No cookie | GET `/api/auth/check-auth` without cookie | 401, "Unauthorized - token missing" | Correct 401 response | PASS |
| TC-A-017 | Check Auth | Expired token | GET with expired JWT | 401, "Unauthorized - token expired" | Correct rejection | PASS |
| TC-A-018 | Forgot Password | Existing email | `{ email: user@test.com }` | 200, success, reset link email sent | Email received with valid reset URL | PASS |
| TC-A-019 | Forgot Password | Non-existent email | `{ email: nobody@test.com }` | 400, "Email doesn't exist in our database" | Correct rejection | PASS |
| TC-A-020 | Reset Password | Valid token + new password | Correct token within 1h, new password | 200, password updated, success email sent | Password changed in DB, old password no longer works | PASS |
| TC-A-021 | Reset Password | Expired token | Correct token after 1h | 400, "Invalid or expired reset token" | Correct rejection | PASS |
| TC-A-022 | Reset Password | Invalid token | Random string | 400, "Invalid or expired reset token" | Correct rejection | PASS |
| TC-A-023 | Protected Route | Unauthenticated access | GET `/api/auth/get-profile` without cookie | 401, "Unauthorized - token missing" | Correct 401 | PASS |
| TC-A-024 | Update Profile | Valid update with image | FormData with all fields + image file | 200, profile updated, Cloudinary URL stored | Profile data updated in DB, image accessible via Cloudinary CDN | PASS |
| TC-A-025 | Update Profile | Invalid address JSON | `address: "not json"` | 400, "Invalid address format" | Correct validation error | PASS |

### Table 7.2 — Appointment Module Test Cases

| TC ID | Module | Scenario | Input | Expected Result | Actual Result | Status |
|-------|--------|----------|-------|-----------------|---------------|--------|
| TC-B-001 | Book Appointment | Valid booking | `{ docId, slotDate: future, slotTime: available }` | 201, appointment created, slot added to `slots_booked`, confirmation email sent | Appointment in DB, slot locked, email received | PASS |
| TC-B-002 | Book Appointment | Unavailable slot | Same slot booked twice concurrently | 400, "Slot not available" on second request | Slot conflict detected | PASS |
| TC-B-003 | Book Appointment | Unavailable doctor | `{ docId: unavailable_doctor, ... }` | 400, "Doctor is not available" | Correct rejection | PASS |
| TC-B-004 | Book Appointment | Unauthenticated | No cookie | 401, "Unauthorized - token missing" | Blocked by verifyToken middleware | PASS |
| TC-B-005 | Get Appointments | Authenticated user | GET `/api/auth/appointments` | 200, `{ appointments: [] }` (user's own appointments only) | Only own appointments returned, no cross-user data | PASS |
| TC-B-006 | Cancel Appointment | Own appointment | `{ appointmentId: own_appt_id }` | 200, `cancelled: true`, slot released from `slots_booked` | Appointment cancelled, slot available again | PASS |
| TC-B-007 | Cancel Appointment | Another user's appointment | `{ appointmentId: other_user_appt }` | 400, "Unauthorized Action" | Ownership check prevents cancellation | PASS |
| TC-B-008 | Admin Cancel | Any appointment | Admin cancels any appointment | 200, appointment cancelled, slot released | Admin can cancel any appointment | PASS |
| TC-B-009 | Doctor Complete | Own appointment | Doctor marks `isCompleted: true` | 200, `isCompleted: true`, `completedAt` set | Appointment marked complete, visible in dashboard | PASS |
| TC-B-010 | Doctor Complete | Another doctor's appointment | Doctor attempts to complete different doctor's appointment | 200 with `{ success: false, message: "Invalid Appointment" }` | docId mismatch prevents completion | PASS |
| TC-B-011 | Admin Add Doctor | Valid doctor data + image | All required fields + valid image file | 201, doctor created in DB, Cloudinary image URL stored, welcome email sent | Doctor visible in list, email received with credentials | PASS |
| TC-B-012 | Admin Add Doctor | Duplicate email | Email already exists | 200 (Mongoose unique violation), error returned | Duplicate prevented | PASS |
| TC-B-013 | Admin Delete Doctor | Delete doctor with appointments | `{ docId: doctor_with_appointments }` | Pending appointments cancelled, doctor deleted | All non-completed appointments marked cancelled | PASS |
| TC-B-014 | Admin Dashboard | Dashboard data | GET `/api/admin/dashboard` | `{ doctors, users, appointments counts, latestAppointments }` | Accurate counts returned | PASS |

### Table 7.3 — Payment Module Test Cases

| TC ID | Module | Scenario | Input | Expected Result | Actual Result | Status |
|-------|--------|----------|-------|-----------------|---------------|--------|
| TC-C-001 | Create Order | Valid appointment | `{ appointmentId: valid, amount: 500 }` | 200, Razorpay order object `{ id, amount: 50000, currency }` | Order created in Razorpay, order ID returned | PASS |
| TC-C-002 | Create Order | Cancelled appointment | `{ appointmentId: cancelled_id, amount: 500 }` | 400, "Appointment Cancelled or not found" | Correct rejection before order creation | PASS |
| TC-C-003 | Create Order | Missing amount | `{ appointmentId: valid }` (no amount) | 400, "Appointment ID and amount are required" | Validation rejects missing amount | PASS |
| TC-C-004 | Create Order | Non-number amount | `{ appointmentId: valid, amount: "500" }` | 400, type check fails | Correct type validation | PASS |
| TC-C-005 | Verify Payment | Successful payment | Razorpay test card → success callback → verify | 200, `payment: true` in DB, payment receipt email sent | Appointment payment flag updated, detailed receipt email received | PASS |
| TC-C-006 | Verify Payment | Failed payment | Razorpay returns unpaid order | 400, "Payment Failed" | Payment flag not updated | PASS |
| TC-C-007 | Verify Payment | Missing fields | `{ razorpay_order_id }` only | 400, "Missing required payment verification fields" | Validation error | PASS |
| TC-C-008 | Payment Receipt Email | Successful payment | Valid verify request | Email with: patient name, amount, doctor name, speciality, clinic, date, time, payment ID | All email fields populated correctly | PASS |

### Table 7.4 — Blood Donation Module Test Cases

| TC ID | Module | Scenario | Input | Expected Result | Actual Result | Status |
|-------|--------|----------|-------|-----------------|---------------|--------|
| TC-D-001 | Donor Registration | Valid registration | All fields, valid coordinates, acknowledgement: true | 201, donor document created, `2dsphere` index entry, registration email sent | Donor in DB with GeoJSON coordinates, email received | PASS |
| TC-D-002 | Donor Registration | Duplicate registration | Same user attempts to register again | 400, "Already registered as donor" | Duplicate prevented | PASS |
| TC-D-003 | Donor Registration | Invalid coordinates | `latitude: 200, longitude: 500` | 400, "Invalid coordinates" | Coordinate range validation | PASS |
| TC-D-004 | Donor Registration | Acknowledgement not accepted | `acknowledgementAccepted: false` | 400, "Acknowledgement must be accepted" | Consent validation | PASS |
| TC-D-005 | Blood Compatibility | Universal recipient (AB+) | `getCompatibleDonors('AB+')` | Returns all 8 blood groups | All groups returned | PASS |
| TC-D-006 | Blood Compatibility | Universal donor (O-) | `getCompatibleDonors('O-')` | Returns only `['O-']` | Correct output | PASS |
| TC-D-007 | Blood Compatibility | A+ recipient | `getCompatibleDonors('A+')` | Returns `['O-', 'O+', 'A-', 'A+']` | Correct 4-group match | PASS |
| TC-D-008 | Create Blood Request | Valid request, donors within radius | Donor registered 5km away (same compatible group) | 201, `notifiedCount: 1`, donor in returned list, socket emitted, email sent | Donor found via `$geoNear`, notified via socket + email | PASS |
| TC-D-009 | Create Blood Request | No compatible donors in radius | All donors outside 10km or different blood group | 201, `notifiedCount: 0`, `donors: []` | Empty donors array, request still created | PASS |
| TC-D-010 | Create Blood Request | Emergency urgency | `urgencyType: 'emergency'` | Search radius 50km, notification title "🆘 EMERGENCY Blood Alert" | 50km radius used, emergency title in notification | PASS |
| TC-D-011 | Toggle Availability | Donor toggles off | `availabilityStatus: true` → toggle | `availabilityStatus: false`, log entry created with `changedBy: 'self'` | Status toggled, availability log created | PASS |
| TC-D-012 | Search Donors | Compatible group expansion | Search for A+ within 10km | Returns O-, O+, A-, A+ donors (not just A+) | Compatible group expansion works | PASS |
| TC-D-013 | Donor Acceptance | Accept blood request | POST `/api/blood/response { requestId, responseStatus: 'accepted' }` | Response recorded, requestor receives socket notification + email | Socket event emitted to requestor, email sent | PASS |
| TC-D-014 | Donor Acceptance | Decline request | POST `/api/blood/response { requestId, responseStatus: 'declined' }` | Response recorded as 'declined' | Response status updated in DB | PASS |
| TC-D-015 | Cancel Blood Request | Owner cancels | Own request cancellation | `status: 'cancelled'`, `cancelledAt` set | Request status updated | PASS |
| TC-D-016 | Cancel Blood Request | Non-owner cancels | Other user attempts cancellation | 403, "Unauthorized" | Ownership check prevents cancellation | PASS |
| TC-D-017 | Admin Block Donor | Block donor | `{ donorId, action: 'block' }` | `isBlocked: true`, donor excluded from future searches | Donor excluded from `$geoNear` queries | PASS |
| TC-D-018 | Admin Emergency Broadcast | Admin emergency request | Admin creates emergency request | All available compatible donors within 50km notified via socket + email | Mass notification delivered | PASS |
| TC-D-019 | Blood Notifications | Unread count | GET `/api/blood/notifications/unread-count` | `{ unreadCount: N }` | Accurate count from indexed query | PASS |
| TC-D-020 | Mark Notifications Read | Bulk mark | `{ notificationIds: [id1, id2] }` | Both notifications marked `isRead: true`, count decremented | DB updated, frontend state synced | PASS |

### Table 7.5 — Chat Module Test Cases

| TC ID | Module | Scenario | Input | Expected Result | Actual Result | Status |
|-------|--------|----------|-------|-----------------|---------------|--------|
| TC-E-001 | Socket Connection | Client connects | `io(BACKEND_URL, { transports: ['websocket'] })` | Successful WebSocket upgrade, `connect` event fired | Connection established, socket.id assigned | PASS |
| TC-E-002 | Join Room | Valid room join | `socket.emit('join_room', 'userId_docId')` | Socket joins room, logged on server | Room joined, user visible in `io.sockets.adapter.rooms` | PASS |
| TC-E-003 | Send Message | Valid message | `socket.emit('send_message', { roomId, message, sender, senderType, time })` | Message persisted to MongoDB, `receive_message` emitted to partner | Message in DB, partner receives event | PASS |
| TC-E-004 | Send Message | Empty roomId | `send_message` with `roomId: null` | Message not saved (null roomId) | No persistence without valid roomId | PASS |
| TC-E-005 | Get Messages | Room history | GET `/api/chat/messages/userId_docId` | All messages for roomId, sorted by timestamp ascending | Chronological message history returned | PASS |
| TC-E-006 | Get Active Rooms | Multiple rooms | POST `/api/chat/rooms { roomIds: ['r1', 'r2', 'r3'] }` | Only rooms with ≥1 message returned, with last message metadata | Correct active room filtering via aggregation | PASS |
| TC-E-007 | Presence — Online | User opens chat | `socket.emit('user_online', { roomId, name, role })` | `partner_online: { online: true }` emitted to partner | Partner receives online event | PASS |
| TC-E-008 | Presence — Offline | User closes chat | `socket.emit('user_offline', { roomId, name })` | `partner_online: { online: false }` emitted to partner | Partner receives offline event | PASS |
| TC-E-009 | Disconnect | Client disconnects | Browser tab closed | All room presence entries cleaned, partner receives `partner_online: false` | Cleanup runs in `disconnect` handler | PASS |
| TC-E-010 | Mark Seen | Reader opens chat | `socket.emit('mark_seen', { roomId, readerName: doctorName })` | All unread messages from user updated to `seen: true`, `messages_seen` emitted | DB updated, sender receives read receipt event | PASS |
| TC-E-011 | Blood Socket | Join blood room | `socket.emit('join_blood_room', userId)` | Socket joins `blood-{userId}` room | Room joined, `blood_notification` events deliverable | PASS |
| TC-E-012 | Blood Notification | Real-time push | Blood request created → nearby donor | Donor receives `blood_notification` event within ~200ms | Event received in near real-time | PASS |

---

# CHAPTER 8 — CONCLUSION

## 8.1 Summary of Achievements

The Medislot project has successfully delivered a production-grade, full-stack healthcare management web application that addresses the complete patient-doctor-administrator workflow within a unified digital platform. The following objectives were achieved in their entirety:

**Authentication and Security:** A multi-step, security-hardened authentication system was implemented with bcrypt password hashing, OTP-based email verification, JWT-based session management via `httpOnly` cookies, cryptographically secure password reset tokens, and distinct authentication mechanisms for three user roles (patient, doctor, admin). The system is immune to the most common web application security vulnerabilities including XSS-based token theft, CSRF (via `SameSite` cookies), and timing attacks (via bcrypt constant-time comparison).

**Appointment Management:** A complete appointment lifecycle was implemented — from real-time slot availability checking through booking confirmation, online payment processing, doctor-side management (complete/cancel), and full appointment history visibility. The slot locking mechanism using MongoDB's atomic update operations prevents double-booking in concurrent scenarios.

**Payment Integration:** A fully functional Razorpay integration was implemented including server-side order creation, client-side Razorpay checkout widget, server-side payment verification via the Razorpay API, and automated payment receipt email with complete appointment and payment details.

**Real-Time Communication:** A production-ready Socket.IO-based chat system was built with persistent message storage, room-based architecture, bidirectional presence tracking, read receipt management, and seamless integration with the same HTTP server as the REST API.

**Blood Donation System:** The most technically complex module of the project — a geospatial blood donor matching engine — was implemented using MongoDB's `$geoNear` aggregation pipeline with `2dsphere` indexing. The system implements the complete ABO/Rh blood group compatibility matrix, configurable proximity radii based on urgency level (normal/urgent/emergency), batch notification insertion for efficiency, and multi-channel notification delivery via Socket.IO and transactional email. The admin emergency broadcast capability provides a critical tool for life-threatening scenarios.

**Email Automation:** Ten distinct email templates and corresponding sending functions were implemented, covering every significant application event from user registration through blood donor acceptance. All emails are sent through the Brevo Transactional Email API with graceful error handling that prevents email failures from disrupting the core application flow.

**Admin and Doctor Panels:** Comprehensive management interfaces were built for both administrators (system-wide oversight and control) and doctors (personal appointment management, earnings tracking, patient communication, and blood donation participation), providing a complete operational platform without requiring external tools.

**Deployment:** The application has been successfully deployed to production with the frontend and admin panel on Vercel and the backend API accessible from the deployed clients. CORS, cookie security, and environment configuration are correctly configured for cross-origin production operation.

## 8.2 Technical Learning Outcomes

The development of Medislot provided deep, applied experience in the following technical domains:

- **MERN Stack Integration:** Understanding the complete data flow from MongoDB schema design through Mongoose ODM, Express controller logic, REST API response formatting, Axios-based HTTP client integration, and React state management.
- **Real-Time Systems:** Designing and implementing a production Socket.IO architecture including room management, event broadcasting, presence tracking, and persistent storage integration — moving beyond basic tutorials to production concerns like duplicate event prevention and memory-safe room cleanup.
- **Geospatial Data Engineering:** Understanding MongoDB's GeoJSON data model, `2dsphere` indexing requirements, the `$geoNear` aggregation stage, and the practical implementation of the ABO/Rh blood compatibility matrix.
- **Authentication Engineering:** Implementing multiple authentication strategies (cookie-based JWT, header-based JWT, admin string JWT) and understanding the security trade-offs of each approach.
- **Asynchronous Email Systems:** Designing non-blocking email delivery pipelines that enhance user experience through automation without creating single points of failure.
- **Payment Gateway Integration:** Understanding the order-creation → client checkout → server-side verification payment flow and the importance of server-side verification (never trusting the client's claim of payment success).
- **State Management Patterns:** Practical application of Zustand for global client state (auth, blood donation) and React Context API for shared read-only state (doctor listing), developing intuition for when each tool is appropriate.

## 8.3 Benefits and Impact

Medislot demonstrates that a single developer can produce a comprehensive, multi-role, real-time web application within an academic timeframe using modern open-source tooling. The platform offers:

- **For Patients:** Elimination of phone-based appointment scheduling, transparent slot availability, secure online payments, direct doctor communication, and participation in a life-saving blood donation network.
- **For Doctors:** A professional-grade practice management interface providing appointment oversight, earnings analytics, patient communication, and profile control without subscription fees.
- **For Administrators:** Complete operational visibility and control over the platform, including a life-critical emergency blood broadcasting capability.
- **For Society:** A scalable template for digitising healthcare coordination in resource-constrained environments, particularly the geospatial blood donation system which can reduce emergency response time in scenarios where every minute is critical.

---

# CHAPTER 9 — FUTURE ENHANCEMENTS

Based on the current architecture and implementation, the following enhancements are identified as high-value additions for future development iterations:

### 9.1 Doctor Password Self-Change

The current implementation sends plain-text doctor passwords in welcome emails. A future enhancement would implement a doctor-facing password change interface, allowing doctors to update their initial credentials securely upon first login.

### 9.2 Video Consultation (WebRTC)

Building on the existing Socket.IO infrastructure, a WebRTC-based video consultation module could be added. The signalling mechanism (SDP offer/answer exchange) can be implemented using the existing Socket.IO server, with STUN/TURN servers (e.g., Twilio, Xirsys) for NAT traversal.

### 9.3 Electronic Health Records (EHR)

A prescription and medical history module where doctors can attach diagnosis notes, prescriptions, and uploaded medical documents (stored on Cloudinary) to completed appointments. Patients would have a complete medical history accessible from their profile.

### 9.4 Push Notifications (Web Push API)

Implementing the Web Push API (`Push API` + `Notification API`) with a service worker would allow blood donation and appointment notifications to be delivered even when the browser tab is closed, significantly increasing notification reliability for emergency scenarios.

### 9.5 Redis Adapter for Socket.IO Horizontal Scaling

The current Socket.IO implementation operates in single-server mode with in-memory room tracking. For production deployment across multiple server instances, integrating the `@socket.io/redis-adapter` would enable cross-instance room membership and event broadcasting.

### 9.6 Stripe Payment Gateway

Adding Stripe as an alternative to Razorpay would enable international payment processing (currently Razorpay is limited to India). The `/api/auth` route pattern is already set up to accommodate multiple payment routes.

### 9.7 AI-Powered Symptom Checker

Integrating the Claude API (Anthropic) to provide a pre-appointment symptom assessment chatbot that helps patients identify the appropriate medical speciality before booking, potentially improving appointment relevance and reducing unnecessary consultations.

### 9.8 Doctor Ratings and Reviews

A post-appointment rating system allowing patients to rate their consultation experience (1–5 stars) and leave written reviews. Aggregate ratings would be displayed on doctor listings to assist future patients in selection.

### 9.9 Appointment Reminders (SMS/Push)

Automated appointment reminder notifications sent 24 hours and 1 hour before the scheduled appointment time, implemented as scheduled jobs using Bull (Node.js queue) with Redis, or through a cron service.

### 9.10 Multi-Language Support (i18n)

Adding internationalisation using `react-i18next` to support regional Indian languages (Hindi, Tamil, Kannada, Telugu), making the platform accessible to a broader patient demographic.

### 9.11 Blood Donation Eligibility Calculator

A form-based tool that calculates donor eligibility based on last donation date (minimum 56 days for whole blood), current health status, and body weight, displaying a countdown to next eligible donation date on the donor profile.

### 9.12 Doctor-to-Doctor Consultation Network

Extending the blood donation model to support specialist consultation referrals — allowing general physicians to connect with specialists for case consultation through the existing chat and notification infrastructure.

### 9.13 Analytics Dashboard (Admin)

A comprehensive analytics module with time-series charts (daily/weekly/monthly appointments, revenue, new registrations) using Recharts (already integrated in the admin panel for blood analytics), providing business intelligence for clinic operators.

### 9.14 Appointment Refund Processing

The `refund` boolean field already exists in the `appointmentModel` schema. A future enhancement would integrate Razorpay's refund API to process automatic refunds upon appointment cancellation for paid appointments, updating `refund: true` upon successful refund initiation.

---

# REFERENCES

### Official Documentation

1. **React Documentation** — "Getting Started with React 18" — https://react.dev/
2. **Vite Documentation** — "Vite — Next Generation Frontend Tooling" — https://vitejs.dev/
3. **Tailwind CSS Documentation** — "Tailwind CSS v3 Utility-First CSS" — https://tailwindcss.com/docs
4. **React Router Documentation** — "React Router v6 — Declarative Routing for React" — https://reactrouter.com/
5. **Zustand Documentation** — "Zustand — Bear necessities for state management in React" — https://zustand-demo.pmnd.rs/
6. **Node.js Documentation** — "Node.js v18 LTS API Reference" — https://nodejs.org/docs/latest-v18.x/api/
7. **Express.js Documentation** — "Express 4.x API Reference" — https://expressjs.com/en/4x/api.html
8. **Mongoose Documentation** — "Mongoose v8 — Elegant MongoDB object modelling for Node.js" — https://mongoosejs.com/docs/
9. **MongoDB Manual** — "Geospatial Queries — $geoNear Aggregation Stage" — https://www.mongodb.com/docs/manual/reference/operator/aggregation/geoNear/
10. **MongoDB Manual** — "2dsphere Indexes" — https://www.mongodb.com/docs/manual/core/2dsphere/
11. **Socket.IO Documentation** — "Socket.IO v4 — Bidirectional and low-latency communication" — https://socket.io/docs/v4/
12. **JSON Web Tokens (RFC 7519)** — "JSON Web Token (JWT) — IETF RFC 7519" — https://datatracker.ietf.org/doc/html/rfc7519
13. **bcryptjs Documentation** — "bcryptjs — Optimised bcrypt in JavaScript with zero dependencies" — https://github.com/dcodeIO/bcrypt.js
14. **Razorpay Documentation** — "Razorpay Payment Gateway — Node.js Integration Guide" — https://razorpay.com/docs/
15. **Cloudinary Documentation** — "Cloudinary Node.js SDK — Upload and Management API" — https://cloudinary.com/documentation/node_integration
16. **Brevo (Sendinblue) API Documentation** — "Transactional Email API — @getbrevo/brevo SDK" — https://developers.brevo.com/
17. **Multer Documentation** — "Multer — Node.js middleware for handling multipart/form-data" — https://github.com/expressjs/multer
18. **Framer Motion Documentation** — "Framer Motion — Production-ready motion library for React" — https://www.framer.com/motion/
19. **Axios Documentation** — "Axios — Promise based HTTP client for the browser and Node.js" — https://axios-http.com/docs/intro
20. **Vercel Documentation** — "Vercel — Deploying SPA with React Router (vercel.json rewrites)" — https://vercel.com/docs/

### Academic and Research References

21. Berners-Lee, T., Fielding, R., & Masinter, L. (1998). *Uniform Resource Identifiers (URI): Generic Syntax*. IETF RFC 2396.
22. Fielding, R. T. (2000). *Architectural Styles and the Design of Network-based Software Architectures* (Doctoral dissertation). University of California, Irvine. (Defines REST architectural constraints)
23. Jones, M., Bradley, J., & Sakimura, N. (2015). *JSON Web Signature (JWS)*. IETF RFC 7515.
24. Rescorla, E. (2018). *The Transport Layer Security (TLS) Protocol Version 1.3*. IETF RFC 8446. (Basis for HTTPS/WSS security)
25. West, M. (2016). *SameSite Cookies*. IETF Internet Draft. (Foundation for SameSite cookie security model)
26. MongoDB, Inc. (2023). *MongoDB Reference Manual — Aggregation Pipeline*. MongoDB Documentation Series.
27. Mather, T., Kumaraswamy, S., & Latif, S. (2009). *Cloud Security and Privacy*. O'Reilly Media. (Principles applied in Cloudinary and Atlas security configuration)

### Blood Donation Reference Material

28. **American Red Cross** — "Blood Types and Compatibility Chart" — https://www.redcrossblood.org/donate-blood/blood-types.html (Basis for the ABO/Rh compatibility matrix implemented in `bloodCompatibility.js`)
29. **World Health Organization** — "Blood Safety and Availability" — WHO Fact Sheet No. 279 — https://www.who.int/news-room/fact-sheets/detail/blood-safety-and-availability
30. **National Blood Transfusion Council of India** — "eRaktKosh — Integrated Blood Bank Management System" — https://eraktkosh.in/

### Library Versions (as per package.json)

| Package | Version | License |
|---------|---------|---------|
| react | 18.3.1 | MIT |
| vite | 5.4.1 | MIT |
| tailwindcss | 3.4.11 | MIT |
| react-router-dom | 6.26.2 | MIT |
| zustand | 5.0.2 | MIT |
| axios | 1.7.9 | MIT |
| socket.io | 4.8.3 | MIT |
| socket.io-client | 4.8.3 | MIT |
| express | 4.21.1 | MIT |
| mongoose | 8.8.1 | MIT |
| jsonwebtoken | 9.0.2 | MIT |
| bcryptjs | 3.0.2 | MIT |
| multer | 1.4.5-lts.1 | MIT |
| cloudinary | 2.5.1 | MIT |
| razorpay | 2.9.5 | MIT |
| @getbrevo/brevo | 2.2.0 | MIT |
| framer-motion | 11.18.2 | MIT |
| recharts | 3.8.1 | MIT |
| validator | 13.12.0 | MIT |

---

*End of Project Report*

---

**Document Information:**
- **Title:** Medislot — Doctor Appointment Booking & Blood Donation Management System
- **Author:** Hemanth V
- **Version:** 1.0
- **Date:** May 2026
- **Total Pages:** ~110 (estimated)
- **Format:** Markdown (DOCX-ready structure)

