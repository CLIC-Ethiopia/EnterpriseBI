
import React, { useState } from 'react';
import { 
  ArrowLeft, Book, Zap, LayoutGrid, Users, Mail, HelpCircle, 
  Server, Shield, Monitor, Smartphone, Lock, Database, Wifi, Laptop,
  Layers, Key, Network, Cpu, Box, X, Terminal, Code, Globe, 
  ChevronRight, CheckCircle2, FileJson, Settings
} from 'lucide-react';

interface InfoPageProps {
  onBack: () => void;
}

interface StackItemDetails {
  role: string;
  requirements: string[];
  installation: string[];
  integration: string;
  configTips: string[];
}

interface StackItem {
  id: string;
  title: string;
  tool: string;
  desc: string;
  icon: React.ElementType;
  color: string; // Tailwind color class base (e.g. 'orange', 'blue')
  details: StackItemDetails;
}

const InfoPage: React.FC<InfoPageProps> = ({ onBack }) => {
  const [selectedStackItem, setSelectedStackItem] = useState<StackItem | null>(null);

  const stackItems: StackItem[] = [
    {
      id: 'infra',
      title: 'Bare Metal Virtualization',
      tool: 'Proxmox VE',
      desc: 'Enterprise virtualization platform managing VMs and containers on physical hardware.',
      icon: Server,
      color: 'orange',
      details: {
        role: 'Acts as the Type-1 Hypervisor, converting the physical micro-datacenter server into a flexible private cloud. It hosts the VMs for the OS, Database, and Application logic.',
        requirements: ['64-bit CPU (Intel VT-x or AMD-V support)', '8GB+ RAM (16GB recommended)', 'SSD Storage for OS + Data', 'Static IP Address'],
        installation: [
          'Download Proxmox VE ISO from official site.',
          'Flash to USB drive using Etcher/Rufus.',
          'Boot server from USB and follow installation wizard.',
          'Access web interface at https://[IP]:8006.'
        ],
        integration: 'Serves as the foundation layer. All other components (Ubuntu, Docker, Postgres) run as Virtual Machines or LXC containers inside Proxmox.',
        configTips: ['Create a bridge network (vmbr0) for local LAN access.', 'Schedule nightly backups of VMs to a secondary drive.', 'Enable firewall at the datacenter level.']
      }
    },
    {
      id: 'os',
      title: 'Operating System',
      tool: 'Ubuntu Server LTS',
      desc: 'Stable Linux foundation optimized for running Docker workloads and services.',
      icon: Layers,
      color: 'slate',
      details: {
        role: 'The Guest Operating System running inside the main Virtual Machine. It provides the kernel and environment for the container runtime.',
        requirements: ['2 vCPU cores allocated', '4GB RAM allocated', '20GB Disk Space', 'Virtualization enabled in BIOS/Proxmox'],
        installation: [
          'Create new VM in Proxmox.',
          'Mount Ubuntu Server LTS ISO.',
          'Run installer (Select "Minimal Install").',
          'Enable OpenSSH Server during setup.'
        ],
        integration: 'Hosts the Docker engine. Connected to the network via Proxmox bridge.',
        configTips: ['Disable root login via SSH.', 'Set up UFW (Uncomplicated Firewall) to allow only ports 22, 80, 443.', 'Configure automatic security updates.']
      }
    },
    {
      id: 'container',
      title: 'Container Orchestration',
      tool: 'Docker + Portainer',
      desc: 'Containerizes applications for isolation and manages them via GUI.',
      icon: Box,
      color: 'blue',
      details: {
        role: 'Docker runs the application, database, and proxy as isolated containers. Portainer provides a web UI to manage these containers without using CLI.',
        requirements: ['Ubuntu Server installed', 'Sudo privileges', 'Internet connection for pulling images'],
        installation: [
          'Run: curl -fsSL https://get.docker.com | sh',
          'Run: docker volume create portainer_data',
          'Run: docker run -d -p 9000:9000 --name portainer ... portainer/portainer-ce',
          'Access Portainer at http://[VM-IP]:9000'
        ],
        integration: 'Manages the lifecycle of Keycloak, Postgres, Nginx, and the Custom App containers.',
        configTips: ['Use Docker Compose for defining multi-container stacks.', 'Limit container resources (CPU/RAM) to prevent crashes.', 'Prune unused images regularly.']
      }
    },
    {
      id: 'backend',
      title: 'Backend Logic',
      tool: 'Node.js Runtime',
      desc: 'High-performance JavaScript runtime executing business rules and API logic.',
      icon: Cpu,
      color: 'emerald',
      details: {
        role: 'Executes the server-side code. It handles data processing, communicates with the database, and enforces business logic before sending data to the frontend.',
        requirements: ['Node.js v18 or v20 (LTS)', 'NPM or Yarn package manager', 'Container environment (Docker)'],
        installation: [
          'Define in Dockerfile: FROM node:18-alpine',
          'Copy package.json and install dependencies.',
          'Expose internal port (e.g., 3000).',
          'Command: npm start'
        ],
        integration: 'Connects to PostgreSQL via Sequelize/TypeORM. Validates tokens via Keycloak public keys.',
        configTips: ['Use PM2 or Docker restart policies for uptime.', 'Enable compression middleware.', 'Use environment variables for secrets (DB creds).']
      }
    },
    {
      id: 'api',
      title: 'API Connectivity',
      tool: 'REST / Express.js',
      desc: 'Standardized API layer connecting Frontend to Backend securely.',
      icon: Code,
      color: 'violet',
      details: {
        role: 'The communication interface. Defines endpoints (GET, POST) that the React frontend calls to fetch or submit data.',
        requirements: ['Express.js framework', 'CORS enabled for local domain', 'JSON body parser'],
        installation: [
          'Install: npm install express cors helmet',
          'Setup routes: app.use("/api/v1", routes)',
          'Secure: app.use(helmet())'
        ],
        integration: 'Acts as the glue between UI and Data. Responses are formatted as standard JSON. Errors use standard HTTP codes (401, 404, 500).',
        configTips: ['Version your API (e.g., /api/v1/).', 'Implement rate limiting to prevent abuse.', 'Use Swagger for documentation.']
      }
    },
    {
      id: 'frontend',
      title: 'User Interface',
      tool: 'React + Vite',
      desc: 'Modern, responsive web application served to client devices.',
      icon: Monitor,
      color: 'pink',
      details: {
        role: 'The client-side application users interact with. It renders dashboards, forms, and visuals in the browser.',
        requirements: ['Modern Web Browser (Chrome/Edge)', 'Network access to BI Server'],
        installation: [
          'Build: npm run build',
          'Output: /dist folder with static assets',
          'Serve: Use Nginx container to serve /dist folder'
        ],
        integration: 'Consumes the REST API. Authenticates users by redirecting to Keycloak login page.',
        configTips: ['Implement code splitting for faster loads.', 'Use PWA (Progressive Web App) capabilities for offline support.', 'Cache static assets efficiently.']
      }
    },
    {
      id: 'db',
      title: 'Data Persistence',
      tool: 'PostgreSQL',
      desc: 'Relational database storing inventory, logs, and financial records.',
      icon: Database,
      color: 'indigo',
      details: {
        role: 'Primary data store. chosen for its reliability, ACID compliance, and support for complex queries needed for BI.',
        requirements: ['Docker Volume for persistence', '1GB+ RAM allocated'],
        installation: [
          'Pull image: docker pull postgres:15',
          'Run with environment vars: POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB',
          'Map port 5432 internally.'
        ],
        integration: 'Accessed only by the Backend Node.js container. Not exposed directly to the network.',
        configTips: ['Perform regular pg_dump backups.', 'Use connection pooling in the backend.', 'Index frequently queried columns (e.g., SKU, Date).']
      }
    },
    {
      id: 'auth',
      title: 'Identity Access',
      tool: 'Keycloak',
      desc: 'Centralized authentication server enforcing Role-Based Access Control.',
      icon: Key,
      color: 'yellow',
      details: {
        role: 'Single Sign-On (SSO) provider. Handles user logins, password resets, and issues JWT tokens containing user roles (e.g., "Manager", "Warehouse").',
        requirements: ['Java/OpenJDK (included in container)', 'Dedicated Database (can use Postgres)'],
        installation: [
          'Run Keycloak container.',
          'Create Realm "GlobalTrade".',
          'Define Clients (Frontend App) and Roles.',
          'Create Users and assign roles.'
        ],
        integration: 'Frontend redirects here for login. Backend verifies the JWT token signature against Keycloak.',
        configTips: ['Enable HTTPS required.', 'Set short token lifespans (e.g., 5 mins) with refresh tokens.', 'Customize login theme to match company brand.']
      }
    },
    {
      id: 'network',
      title: 'Internal Routing',
      tool: 'Nginx Proxy Manager',
      desc: 'Reverse proxy handling SSL, domain routing, and firewalling.',
      icon: Network,
      color: 'green',
      details: {
        role: 'The traffic cop. It sits at the edge of the container network, receiving all requests and routing them to the correct container (Frontend vs Backend) based on path.',
        requirements: ['Port 80 and 443 exposed on host'],
        installation: [
          'Deploy Nginx Proxy Manager container.',
          'Login to admin UI (default port 81).',
          'Create Proxy Host: bi.local -> Frontend Container:80.',
          'Create Custom Location: /api -> Backend Container:3000.'
        ],
        integration: 'The only entry point for user traffic. Manages SSL certificates (even self-signed for local LAN).',
        configTips: ['Force SSL/HTTPS.', 'Enable HSTS.', 'Block common exploit paths.']
      }
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      
      {/* Sticky Header with Return Button */}
      <div className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center">
          <button 
            onClick={onBack}
            className="group flex items-center gap-3 text-lg font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-all transform hover:-translate-x-1"
          >
            <div className="p-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 transition-colors shadow-sm ring-1 ring-indigo-100 dark:ring-indigo-800">
               <ArrowLeft className="w-6 h-6" />
            </div>
            <span>Return to Application</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 pt-8">
        
        <div className="flex flex-col md:flex-row gap-12 mb-16">
          <div className="flex-1">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider mb-6">
                <HelpCircle className="w-3 h-3" /> Documentation v2.4
             </div>
             <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
                GlobalTrade BI <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Knowledge Base</span>
             </h1>
             <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                Welcome to the centralized help portal. Here you'll find guides on navigating dashboards, understanding KPI metrics, and leveraging our AI analysis tools.
             </p>
          </div>
          <div className="w-full md:w-1/3 bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
             <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Mail className="w-4 h-4" /> Need direct support?
             </h3>
             <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Our IT support team is available 24/7 for critical system issues.
             </p>
             <button className="w-full py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                Contact IT Support
             </button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
           <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                 <LayoutGrid className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Navigating Dashboards</h3>
              <p className="text-gray-500 dark:text-gray-400">
                 Learn how to interpret main KPI cards, switch between departmental views, and use the filter controls to drill down into specific data sets.
              </p>
           </div>
           
           <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4">
                 <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">AI Analyst Features</h3>
              <p className="text-gray-500 dark:text-gray-400">
                 Our Gemini-powered AI Analyst can generate insights, forecast trends, and answer natural language queries about your data.
              </p>
           </div>

           <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
                 <Users className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">User Roles & Security</h3>
              <p className="text-gray-500 dark:text-gray-400">
                 Understanding access levels. Department heads have full write access, while staff roles may be limited to view-only or specific data entry points.
              </p>
           </div>

           <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center text-orange-600 dark:text-orange-400 mb-4">
                 <Book className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Report Generation</h3>
              <p className="text-gray-500 dark:text-gray-400">
                 How to export monthly and quarterly PDF reports. Customizing report parameters for board meetings and external audits.
              </p>
           </div>
        </div>

        {/* System Architecture Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">System Architecture</h2>
          
          <div className="bg-gray-900 rounded-3xl p-8 overflow-hidden relative shadow-2xl border border-gray-800">
            {/* Background Grid/Network Effect */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f46e5_1px,transparent_1px),linear-gradient(to_bottom,#4f46e5_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              {/* Visual Diagram */}
              <div className="relative h-[500px] bg-gray-800/50 rounded-2xl border border-gray-700 p-6 flex items-center justify-center overflow-hidden">
                
                {/* Local Network Boundary Ring */}
                <div className="absolute inset-4 border-2 border-dashed border-gray-700 rounded-3xl opacity-50"></div>
                <div className="absolute top-6 right-6 flex items-center gap-2 text-xs font-mono text-gray-400 bg-gray-800 px-2 py-1 rounded border border-gray-700 z-30">
                   <Lock className="w-3 h-3 text-emerald-400" /> LOCAL INTRANET ONLY
                </div>

                {/* Connection Lines (CSS) */}
                <div className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                    {/* Line to Top Left (Sys Admin) */}
                    <div className="absolute top-[20%] left-[20%] w-[30%] h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-indigo-500 transform rotate-[35deg]"></div>
                    {/* Line to Top Right (Manager) */}
                    <div className="absolute top-[20%] right-[20%] w-[30%] h-[1px] bg-gradient-to-l from-transparent via-indigo-500/50 to-indigo-500 transform -rotate-[35deg]"></div>
                    
                    {/* Line to Bottom Right (Warehouse) */}
                    <div className="absolute bottom-[20%] right-[20%] w-[30%] h-[1px] bg-gradient-to-l from-transparent via-indigo-500/50 to-indigo-500 transform rotate-[35deg]"></div>
                    {/* Line to Bottom Left (Finance) */}
                    <div className="absolute bottom-[20%] left-[20%] w-[30%] h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-indigo-500 transform -rotate-[35deg]"></div>

                    {/* Line to Middle Left (HR) */}
                    <div className="absolute top-[50%] left-[10%] w-[40%] h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-indigo-500"></div>
                    {/* Line to Middle Right (Sales) */}
                    <div className="absolute top-[50%] right-[10%] w-[40%] h-[1px] bg-gradient-to-l from-transparent via-indigo-500/50 to-indigo-500"></div>
                </div>

                {/* Central Micro-Datacenter */}
                <div className="relative z-20 flex flex-col items-center">
                   {/* Radar Scan Effect */}
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-indigo-500/10 rounded-full animate-[spin_8s_linear_infinite]">
                      <div className="w-1/2 h-1/2 bg-gradient-to-tl from-indigo-500/20 to-transparent rounded-tl-full"></div>
                   </div>
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-indigo-500/20 rounded-full animate-ping [animation-duration:3s]"></div>

                   <div className="w-20 h-20 bg-indigo-600 rounded-xl shadow-[0_0_30px_rgba(79,70,229,0.3)] flex items-center justify-center relative z-10">
                      <Server className="w-10 h-10 text-white" />
                      {/* Activity Indicator */}
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                      </span>
                   </div>
                   <div className="mt-4 text-center bg-gray-900/80 backdrop-blur px-3 py-1 rounded-lg border border-gray-700">
                     <p className="font-bold text-white text-xs">Micro-Datacenter</p>
                     <p className="text-indigo-300 text-[10px] uppercase tracking-wide">Primary Host</p>
                   </div>
                </div>

                {/* Connecting Clients */}
                
                {/* 1. System Admin PC (Top Left) */}
                <div className="absolute top-12 left-8 sm:left-12 flex flex-col items-center z-20">
                   <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center border border-gray-600 shadow-lg relative group hover:scale-110 transition-transform cursor-default bg-gradient-to-b from-gray-700 to-gray-800">
                      <Monitor className="w-5 h-5 text-gray-300" />
                      <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-500 rounded-full border border-gray-700"></div>
                   </div>
                   <p className="mt-2 text-[10px] text-white font-semibold bg-gray-800/90 px-2 py-0.5 rounded border border-gray-600 shadow-sm whitespace-nowrap">System Admin PC</p>
                </div>
                
                {/* 2. Manager Laptop (Top Right) */}
                <div className="absolute top-12 right-8 sm:right-12 flex flex-col items-center z-20">
                   <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center border border-gray-600 shadow-lg relative group hover:scale-110 transition-transform cursor-default bg-gradient-to-b from-gray-700 to-gray-800">
                      <Laptop className="w-5 h-5 text-gray-300" />
                      <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-500 rounded-full border border-gray-700"></div>
                   </div>
                   <p className="mt-2 text-[10px] text-white font-semibold bg-gray-800/90 px-2 py-0.5 rounded border border-gray-600 shadow-sm whitespace-nowrap">Manager Laptop</p>
                </div>

                 {/* 3. Finance Workstation (Bottom Left) */}
                 <div className="absolute bottom-12 left-8 sm:left-12 flex flex-col items-center z-20">
                   <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center border border-gray-600 shadow-lg relative group hover:scale-110 transition-transform cursor-default bg-gradient-to-b from-gray-700 to-gray-800">
                      <Monitor className="w-5 h-5 text-gray-300" />
                      <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-500 rounded-full border border-gray-700"></div>
                   </div>
                   <p className="mt-2 text-[10px] text-white font-semibold bg-gray-800/90 px-2 py-0.5 rounded border border-gray-600 shadow-sm whitespace-nowrap">Finance Workstation</p>
                </div>
                
                {/* 4. Warehouse Tablet (Bottom Right) */}
                <div className="absolute bottom-12 right-8 sm:right-12 flex flex-col items-center z-20">
                   <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center border border-gray-600 shadow-lg relative group hover:scale-110 transition-transform cursor-default bg-gradient-to-b from-gray-700 to-gray-800">
                      <Smartphone className="w-5 h-5 text-gray-300" />
                      <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-500 rounded-full border border-gray-700"></div>
                   </div>
                   <p className="mt-2 text-[10px] text-white font-semibold bg-gray-800/90 px-2 py-0.5 rounded border border-gray-600 shadow-sm whitespace-nowrap">Warehouse Tablet</p>
                </div>

                {/* 5. HR Desktop (Middle Left) */}
                <div className="absolute top-1/2 -translate-y-1/2 left-2 sm:left-6 flex flex-col items-center z-20">
                   <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center border border-gray-600 shadow-lg relative group hover:scale-110 transition-transform cursor-default bg-gradient-to-b from-gray-700 to-gray-800">
                      <Users className="w-5 h-5 text-gray-300" />
                      <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-500 rounded-full border border-gray-700"></div>
                   </div>
                   <p className="mt-2 text-[10px] text-white font-semibold bg-gray-800/90 px-2 py-0.5 rounded border border-gray-600 shadow-sm whitespace-nowrap">HR Desktop</p>
                </div>

                {/* 6. Sales Tablet (Middle Right) */}
                <div className="absolute top-1/2 -translate-y-1/2 right-2 sm:right-6 flex flex-col items-center z-20">
                   <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center border border-gray-600 shadow-lg relative group hover:scale-110 transition-transform cursor-default bg-gradient-to-b from-gray-700 to-gray-800">
                      <Smartphone className="w-5 h-5 text-gray-300" />
                      <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-500 rounded-full border border-gray-700"></div>
                   </div>
                   <p className="mt-2 text-[10px] text-white font-semibold bg-gray-800/90 px-2 py-0.5 rounded border border-gray-600 shadow-sm whitespace-nowrap">Sales Tablet</p>
                </div>
                
              </div>

              {/* Description */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <Server className="w-5 h-5 text-indigo-400" />
                    Micro-Datacenter Hardware
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                     The entire BI platform runs on a high-performance, dedicated workstation acting as an on-premise server. 
                     This "Micro-Datacenter" ensures data sovereignty—keeping sensitive import/export records physically within the office.
                  </p>
                </div>

                <div>
                   <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                     <Wifi className="w-5 h-5 text-emerald-400" />
                     Local Network Deployment
                   </h3>
                   <p className="text-gray-400 text-sm leading-relaxed">
                      Designed for offline-first security. Access is restricted to devices connected to the secure office Intranet. 
                      No external cloud dependencies for core operations, reducing exposure to cyber threats.
                   </p>
                </div>

                <div>
                   <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                     <Shield className="w-5 h-5 text-purple-400" />
                     Zero-Trust Local Access
                   </h3>
                   <p className="text-gray-400 text-sm leading-relaxed">
                      Even within the local network, every request is authenticated. 
                      Firewall rules isolate the database from direct employee access, routing traffic exclusively through the application layer.
                   </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Software Architecture Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Software Architecture & Stack</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-4xl">
             We employ a full "Local Cloud" architecture. Below is the complete stack map. Click on any component to view detailed configuration manuals and installation procedures.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {stackItems.map((item) => {
               // Dynamic color class mapping
               const colorClasses: Record<string, string> = {
                  orange: 'text-orange-500 bg-orange-100 dark:bg-orange-900/30',
                  slate: 'text-slate-500 bg-slate-100 dark:bg-slate-900/30',
                  blue: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30',
                  yellow: 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30',
                  green: 'text-green-500 bg-green-100 dark:bg-green-900/30',
                  indigo: 'text-indigo-500 bg-indigo-100 dark:bg-indigo-900/30',
                  emerald: 'text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30',
                  violet: 'text-violet-500 bg-violet-100 dark:bg-violet-900/30',
                  pink: 'text-pink-500 bg-pink-100 dark:bg-pink-900/30',
               };
               const theme = colorClasses[item.color] || colorClasses.blue;

               return (
                  <div 
                    key={item.id}
                    onClick={() => setSelectedStackItem(item)}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer group"
                  >
                     <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-lg ${theme}`}>
                           <item.icon className="w-6 h-6" />
                        </div>
                        <span className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                           Details
                        </span>
                     </div>
                     <div>
                        <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{item.title}</h4>
                        <p className="text-lg font-bold text-gray-900 dark:text-white mb-2">{item.tool}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2">
                           {item.desc}
                        </p>
                     </div>
                  </div>
               );
             })}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-12">
           <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Frequently Asked Questions</h2>
           <div className="space-y-4">
              {/* Existing FAQs */}
              <details className="group bg-gray-50 dark:bg-gray-800/50 rounded-xl overflow-hidden">
                 <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-5 text-gray-900 dark:text-white">
                    <span>How often is the data updated?</span>
                    <span className="transition group-open:rotate-180">
                       <ArrowLeft className="w-5 h-5 transform -rotate-90" />
                    </span>
                 </summary>
                 <div className="text-gray-500 dark:text-gray-400 px-5 pb-5">
                    Data is synced in real-time from the warehouse management system and financial ledgers. External market data updates every 15 minutes.
                 </div>
              </details>
              <details className="group bg-gray-50 dark:bg-gray-800/50 rounded-xl overflow-hidden">
                 <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-5 text-gray-900 dark:text-white">
                    <span>Can I customize my dashboard view?</span>
                    <span className="transition group-open:rotate-180">
                       <ArrowLeft className="w-5 h-5 transform -rotate-90" />
                    </span>
                 </summary>
                 <div className="text-gray-500 dark:text-gray-400 px-5 pb-5">
                    Yes, use the "Settings" button on your dashboard to toggle visibility of specific widgets and arrange the layout to your preference.
                 </div>
              </details>
           </div>
        </div>
      </div>

      {/* Manual Modal */}
      {selectedStackItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/60">
           <div className="bg-white dark:bg-gray-900 w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in duration-200">
              
              {/* Header */}
              <div className="p-6 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center sticky top-0">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                       <selectedStackItem.icon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                       <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedStackItem.tool}</h3>
                       <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{selectedStackItem.title}</p>
                    </div>
                 </div>
                 <button 
                   onClick={() => setSelectedStackItem(null)}
                   className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-gray-500 dark:text-gray-400 transition-colors"
                 >
                    <X className="w-6 h-6" />
                 </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 scroll-smooth">
                 
                 {/* Role Description */}
                 <section>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                       <Globe className="w-5 h-5 text-blue-500" /> System Role
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                       {selectedStackItem.details.role}
                    </p>
                 </section>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Requirements */}
                    <section>
                       <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-500" /> Prerequisites
                       </h4>
                       <ul className="space-y-2">
                          {selectedStackItem.details.requirements.map((req, i) => (
                             <li key={i} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                                <div className="min-w-[6px] h-[6px] rounded-full bg-green-500 mt-2"></div>
                                {req}
                             </li>
                          ))}
                       </ul>
                    </section>

                    {/* Config Tips */}
                    <section>
                       <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                          <Settings className="w-5 h-5 text-orange-500" /> Configuration Tips
                       </h4>
                       <ul className="space-y-2">
                          {selectedStackItem.details.configTips.map((tip, i) => (
                             <li key={i} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                                <div className="min-w-[6px] h-[6px] rounded-full bg-orange-500 mt-2"></div>
                                {tip}
                             </li>
                          ))}
                       </ul>
                    </section>
                 </div>

                 {/* Installation Steps */}
                 <section>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                       <Terminal className="w-5 h-5 text-gray-600 dark:text-gray-400" /> Installation Guide
                    </h4>
                    <div className="bg-gray-900 rounded-xl p-6 font-mono text-sm text-gray-300 shadow-inner overflow-x-auto">
                       {selectedStackItem.details.installation.map((step, i) => (
                          <div key={i} className="mb-3 last:mb-0">
                             <div className="flex gap-3">
                                <span className="text-gray-600 select-none">{(i + 1).toString().padStart(2, '0')}</span>
                                <span className="text-green-400">$</span>
                                <span>{step}</span>
                             </div>
                          </div>
                       ))}
                    </div>
                 </section>

                 {/* Integration */}
                 <section>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                       <Network className="w-5 h-5 text-indigo-500" /> Integration Context
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed border-l-4 border-indigo-500 pl-4">
                       {selectedStackItem.details.integration}
                    </p>
                 </section>

              </div>
              
              {/* Footer */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                 <button 
                   onClick={() => setSelectedStackItem(null)}
                   className="px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-lg hover:opacity-90 transition-opacity"
                 >
                    Close Manual
                 </button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default InfoPage;
