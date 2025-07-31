# 🎫 Tickr - AI-Powered Ticket Management System

An AI-Powered Ticket Management System that uses AI to automatically categorize, prioritize, and assign support tickets to the most appropriate moderators.



## 🌟 Features

### 🤖 AI-Powered Intelligence
- **Automatic Ticket Analysis**: Uses Google's Gemini 1.5 Flash model to analyze and categorize tickets
- **Smart Priority Assignment**: Intelligent priority assessment (low, medium, high) based on content analysis
- **Skill Matching**: AI identifies required technical skills and matches tickets to qualified moderators
- **Helpful Notes Generation**: Provides detailed technical guidance and resources for moderators

### 👥 Role-Based Access Control
- **Users**: Create and track their own support tickets
- **Moderators**: Manage assigned tickets with AI-enhanced details
- **Admins**: Full system control with user and skill management

### 🔄 Event-Driven Architecture
- **Automated Workflows**: Seamless ticket processing pipeline using Inngest
- **Real-time Processing**: Instant AI analysis and assignment upon ticket creation
- **Email Notifications**: Automatic alerts to assigned moderators

### 📊 Smart Assignment System
- **Skill-Based Matching**: Assigns tickets to moderators with relevant expertise
- **Fallback Logic**: Ensures all tickets are assigned even without perfect skill matches
- **Load Balancing**: Distributes workload efficiently across available moderators

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB
- Google Gemini API Key
- Email service credentials (for notifications)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/SandipM03/Tickr.git
cd Tickr
```

2. **Setup Backend**
```bash
cd Tickr-Backend
npm install
```

3. **Setup Frontend**
```bash
cd ../Tickr-Frontend
npm install
```



## 🤖 AI Processing Workflow

1. **Ticket Creation**: User submits a support ticket
2. **Event Trigger**: `ticket/created` event is fired
3. **AI Analysis**: Gemini AI analyzes the ticket content
4. **Data Extraction**:
   - Summary generation
   - Priority assessment
   - Required skills identification
   - Helpful notes and resources
5. **Smart Assignment**: System matches ticket to best-suited moderator
6. **Notification**: Email sent to assigned moderator
7. **Status Update**: Ticket status updated to "IN_PROGRESS"

## 👤 User Roles & Permissions

### User
- Create support tickets
- View own ticket history
- Track ticket status and progress

### Moderator
- View assigned tickets
- Access AI-generated helpful notes
- Update ticket status
- Receive email notifications for new assignments

### Admin
- Manage all users and their roles
- Assign skills to moderators
- View system-wide ticket analytics
- Full access to all system features

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Event Processing**: Inngest
- **AI Integration**: Google Gemini 1.5 Flash
- **Email Service**: Nodemailer
- **Security**: bcrypt, CORS

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **Styling**: TailwindCSS + DaisyUI
- **HTTP Client**: Fetch API
- **Markdown**: React Markdown


```

### Other Providers
- **Outlook**: smtp-mail.outlook.com:587
- **Yahoo**: smtp.mail.yahoo.com:587
- **Custom SMTP**: Configure according to your provider

## 🔐 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access**: Granular permission system
- **CORS Protection**: Cross-origin request security
- **Input Validation**: Server-side validation for all inputs
- **Environment Variables**: Sensitive data protection

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB (Atlas recommended for production)
2. Configure environment variables
3. Deploy to platform of choice (Heroku, DigitalOcean, AWS)
4. Set up Inngest cloud account for event processing

### Frontend Deployment
1. Build the production bundle: `npm run build`
2. Deploy to static hosting (Vercel, Netlify, Cloudflare Pages)
3. Update `VITE_SERVER_URL` to production backend URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request


## 👨‍💻 Author

**SandipM03**
- GitHub: [@SandipM03](https://github.com/SandipM03)

## 🙏 Acknowledgments

- Google Gemini AI for intelligent ticket analysis
- Inngest for reliable event processing
- React and Node.js communities
- MongoDB for flexible data storage
- TailwindCSS for beautiful UI components

---

<p align="center">
  <b>Built with ❤️ using AI and modern web technologies</b>
</p>
