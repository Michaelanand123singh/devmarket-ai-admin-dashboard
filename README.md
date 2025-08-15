# DevMarket AI Admin Dashboard

A comprehensive admin dashboard for managing the DevMarket AI platform, built with React.js, Vite, and Tailwind CSS.

## 🚀 Features

### Core Functionality
- **User Management**: View, edit, suspend, and delete user accounts
- **Project Management**: Monitor all generated projects with detailed analytics
- **Knowledge Base Management**: Upload, manage, and regenerate AI training data
- **System Monitoring**: Real-time system health, performance metrics, and logs
- **Deployment Management**: Track and manage project deployments across platforms
- **Analytics & Reporting**: Comprehensive insights with customizable date ranges
- **Settings Management**: Configure system preferences and security settings

### Advanced Features
- **Real-time Dashboard**: Live updates with auto-refresh capabilities
- **Responsive Design**: Mobile-first approach with modern UI components
- **Role-based Access Control**: Secure admin authentication system
- **Bulk Operations**: Manage multiple items simultaneously
- **Export Functionality**: Download data in multiple formats
- **Search & Filtering**: Advanced search with multiple filter options
- **Interactive Charts**: Visual data representation using Canvas API

## 🛠️ Technical Stack

### Frontend
- **React 18**: Modern React with hooks and functional components
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework with custom components
- **React Router**: Client-side routing with protected routes
- **Lucide React**: Beautiful and consistent icon library

### State Management
- **React Context API**: Global state management for authentication
- **Custom Hooks**: Reusable logic for API calls and data management

### API Integration
- **Axios**: HTTP client with interceptors for authentication
- **RESTful API**: Full integration with backend admin endpoints
- **Error Handling**: Comprehensive error handling and user feedback

### UI Components
- **Custom Design System**: Consistent component library with Tailwind
- **Responsive Layout**: Mobile-first responsive design
- **Loading States**: Skeleton loaders and progress indicators
- **Modal System**: Reusable modal components for detailed views

## 📁 Project Structure

```
admin-dashboard/
├── src/
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── AnalyticsCards.jsx      # Dashboard statistics cards
│   │   │   ├── RecentActivity.jsx      # Recent activity feed
│   │   │   ├── SystemStatus.jsx        # System health indicators
│   │   │   └── Chart.jsx               # Custom chart component
│   │   └── layout/
│   │       └── AdminLayout.jsx         # Main layout with sidebar
│   ├── contexts/
│   │   └── AuthContext.jsx             # Authentication context
│   ├── pages/
│   │   ├── Dashboard.jsx               # Main dashboard overview
│   │   ├── Users.jsx                   # User management
│   │   ├── Projects.jsx                # Project management
│   │   ├── KnowledgeBase.jsx           # Knowledge base management
│   │   ├── Deployments.jsx             # Deployment monitoring
│   │   ├── Analytics.jsx               # Detailed analytics
│   │   ├── Reports.jsx                 # Report generation
│   │   ├── System.jsx                  # System monitoring
│   │   └── Settings.jsx                # System configuration
│   ├── services/
│   │   └── adminAPI.js                 # API service layer
│   ├── App.jsx                         # Main application component
│   └── main.jsx                        # Application entry point
├── tailwind.config.js                  # Tailwind configuration
├── package.json                        # Dependencies and scripts
└── README.md                           # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Backend API running (see backend setup)
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   cd admin-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file
   cp .env.example .env
   
   # Edit .env with your configuration
   VITE_API_URL=http://localhost:8000
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173
   ```

### Build for Production

```bash
npm run build
npm run preview
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Backend API URL
VITE_API_URL=http://localhost:8000

# App Configuration
VITE_APP_NAME=DevMarket AI Admin
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_LOGGING=true
VITE_ENABLE_DEBUG=false
```

### Tailwind Configuration

The dashboard uses a custom Tailwind configuration with:
- Extended color palette (primary, secondary, success, warning, danger)
- Custom component classes (buttons, cards, inputs, tables)
- Responsive breakpoints and spacing

### API Configuration

The admin API service (`src/services/adminAPI.js`) handles:
- Authentication headers
- Request/response interceptors
- Error handling and redirects
- Base URL configuration

## 🔐 Authentication

### Admin Access
- JWT-based authentication
- Protected routes with role-based access
- Automatic token refresh
- Secure logout functionality

### User Roles
- **Admin**: Full access to all features
- **Moderator**: Limited access to user and project management
- **Viewer**: Read-only access to dashboard and analytics

## 📊 Dashboard Features

### Main Dashboard
- **Overview Cards**: Key metrics and statistics
- **Recent Activity**: Latest user and project activities
- **System Status**: Real-time health indicators
- **Quick Actions**: Common administrative tasks

### User Management
- **User List**: Paginated user table with search and filters
- **User Actions**: Edit, suspend, activate, and delete users
- **Bulk Operations**: Manage multiple users simultaneously
- **User Details**: Comprehensive user information and activity

### Project Management
- **Project Grid/Table**: Dual view modes for projects
- **Project Analytics**: Individual project performance metrics
- **Deployment Status**: Track project deployment progress
- **Project Actions**: View, download, and delete projects

### Knowledge Base
- **Content Overview**: Statistics and collection information
- **File Management**: Upload, edit, and delete content files
- **Embedding Status**: Monitor AI training data processing
- **Content Upload**: Drag-and-drop file upload interface

### System Monitoring
- **Health Dashboard**: Service status and uptime metrics
- **Performance Metrics**: CPU, memory, and disk usage
- **Real-time Logs**: System and application logs
- **Auto-refresh**: Configurable automatic updates

### Analytics & Reporting
- **Custom Charts**: Line and bar charts for data visualization
- **Date Range Selection**: Flexible time period analysis
- **Export Options**: Multiple format support (CSV, Excel, PDF)
- **Trend Analysis**: Historical data and growth patterns

## 🎨 UI Components

### Design System
- **Color Palette**: Consistent color scheme with semantic meanings
- **Typography**: Clear hierarchy with readable fonts
- **Spacing**: Consistent spacing using Tailwind's scale
- **Shadows**: Subtle depth and elevation

### Component Library
- **Buttons**: Primary, secondary, success, warning, and danger variants
- **Cards**: Flexible container components with consistent styling
- **Tables**: Responsive data tables with sorting and pagination
- **Forms**: Input fields, selects, checkboxes, and validation
- **Modals**: Overlay dialogs for detailed information
- **Badges**: Status indicators and labels

### Responsive Design
- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: Responsive layouts for all screen sizes
- **Touch Friendly**: Optimized for touch interactions
- **Accessibility**: WCAG compliant design patterns

## 🔌 API Integration

### Backend Endpoints
The dashboard integrates with these backend endpoints:

```
GET    /api/admin/dashboard/overview
GET    /api/admin/dashboard/analytics
GET    /api/admin/dashboard/recent-activity
GET    /api/admin/users
PUT    /api/admin/users/{id}
DELETE /api/admin/users/{id}
GET    /api/admin/projects
DELETE /api/admin/projects/{id}
GET    /api/admin/knowledge-base
POST   /api/admin/knowledge-base/upload
GET    /api/admin/system/health
GET    /api/admin/system/performance
POST   /api/admin/reports/generate
```

### Data Flow
1. **API Calls**: Service layer handles HTTP requests
2. **State Management**: React state stores API responses
3. **UI Updates**: Components re-render with new data
4. **Error Handling**: User-friendly error messages and fallbacks

## 🚀 Deployment

### Build Process
```bash
# Install dependencies
npm install

# Build for production
npm run build

# Preview build
npm run preview
```

### Deployment Options

#### Netlify
```bash
# Deploy to Netlify
netlify deploy --prod --dir=dist
```

#### Vercel
```bash
# Deploy to Vercel
vercel --prod
```

#### Docker
```dockerfile
FROM nginx:alpine
COPY dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🧪 Testing

### Development Testing
```bash
# Run development server
npm run dev

# Check for linting errors
npm run lint

# Build and preview
npm run build && npm run preview
```

### Browser Testing
- **Chrome**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support

## 📱 Mobile Support

### Responsive Features
- **Mobile Navigation**: Collapsible sidebar for mobile
- **Touch Interactions**: Optimized for touch devices
- **Responsive Tables**: Horizontal scrolling on small screens
- **Mobile Modals**: Full-screen modals on mobile devices

## 🔒 Security Features

### Authentication
- **JWT Tokens**: Secure token-based authentication
- **Route Protection**: Protected routes for admin access
- **Token Refresh**: Automatic token renewal
- **Secure Logout**: Proper token cleanup

### Data Protection
- **HTTPS Only**: Secure communication with backend
- **Input Validation**: Client-side input sanitization
- **XSS Prevention**: Safe rendering of user content
- **CSRF Protection**: Built-in CSRF protection

## 🚀 Performance

### Optimization Features
- **Code Splitting**: Lazy loading of route components
- **Bundle Optimization**: Vite's efficient bundling
- **Image Optimization**: Optimized image loading
- **Caching**: Browser caching for static assets

### Performance Metrics
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.5s
- **Bundle Size**: < 500KB gzipped

## 🐛 Troubleshooting

### Common Issues

#### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### API Connection Issues
- Check `VITE_API_URL` in `.env` file
- Verify backend server is running
- Check CORS configuration on backend

#### Styling Issues
- Clear browser cache
- Restart development server
- Check Tailwind CSS compilation

### Debug Mode
Enable debug mode in `.env`:
```env
VITE_ENABLE_DEBUG=true
```

## 🤝 Contributing

### Development Guidelines
1. **Code Style**: Follow ESLint configuration
2. **Component Structure**: Use functional components with hooks
3. **State Management**: Prefer local state over global state
4. **Testing**: Test components and user interactions
5. **Documentation**: Update README for new features

### Pull Request Process
1. Fork the repository
2. Create feature branch
3. Make changes and test
4. Submit pull request
5. Code review and merge

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

### Getting Help
- **Documentation**: Check this README first
- **Issues**: Create GitHub issues for bugs
- **Discussions**: Use GitHub discussions for questions
- **Email**: Contact the development team

### Resources
- **React Documentation**: https://react.dev/
- **Vite Documentation**: https://vitejs.dev/
- **Tailwind CSS**: https://tailwindcss.com/
- **Lucide Icons**: https://lucide.dev/

## 🎯 Roadmap

### Upcoming Features
- **Real-time Notifications**: WebSocket integration
- **Advanced Analytics**: Machine learning insights
- **Multi-language Support**: Internationalization
- **Dark Mode**: Theme switching capability
- **Mobile App**: React Native companion app

### Version History
- **v1.0.0**: Initial release with core features
- **v1.1.0**: Enhanced analytics and reporting
- **v1.2.0**: Advanced user management
- **v2.0.0**: Real-time features and performance improvements

---

**Built with ❤️ by the DevMarket AI Team**
