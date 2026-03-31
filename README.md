# CampusGuard - KNUST Safety System

A comprehensive campus safety web application for KNUST students, security personnel, and guardians.

## Features

### For Students
- **SOS Alerts**: One-tap emergency alert system with live location tracking
- **Safe Walk**: Request companions for walking across campus
- **Incident Reporting**: Report safety incidents with location and details
- **Guardian System**: Add trusted contacts who receive notifications during emergencies

### For Security Personnel
- **Security Dashboard**: Monitor all campus safety activities
- **Alert Management**: View and respond to SOS alerts and incidents
- **Safe Walk Coordination**: Manage and respond to safe walk requests
- **Broadcast System**: Send campus-wide safety announcements

### For Guardians
- **Real-time Notifications**: Receive alerts when your student is in need
- **Location Tracking**: Monitor student's location during emergencies

## Technology Stack

- **Frontend**: React 18 + Vite
- **Backend**: JSON Server (for development)
- **Routing**: React Router v6
- **Styling**: Custom CSS with CSS variables
- **Icons**: Custom SVG icons
- **State Management**: React Context API

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd campusguard
```

2. Install dependencies
```bash
npm install
```

3. Start the development servers
```bash
npm run dev
```

This will start:
- Frontend dev server at `http://localhost:5173`
- JSON API server at `http://localhost:3001`

## Available Scripts

- `npm run dev` - Start development servers
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run server` - Start JSON server only

## Project Structure

```
src/
├── components/          # Reusable UI components
├── context/            # React context providers
├── pages/              # Page components
│   ├── security/       # Security-specific pages
│   └── ...            # Other pages
├── styles/             # Global styles and CSS
└── utils/              # Utility functions and API calls
```

## Features Implemented

### ✅ Core Features
- User authentication (Student, Security, Guardian roles)
- SOS alert system with location tracking
- Safe walk request system
- Incident reporting
- Guardian notifications
- Security dashboard
- Dark mode support
- Responsive design

### 🔄 API Endpoints
- Users management
- SOS alerts
- Safe walks
- Incidents
- Broadcasts
- Notifications
- Contacts
- Guardians
- Security IDs

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3001
VITE_SECURITY_PHONE=0501347350
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

- Security Hotline: 0501347350
- Project Repository: [GitHub URL]

---

**CampusGuard** - Keeping KNUST Campus Safe 🛡️
