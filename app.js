const { createApp } = Vue;

createApp({
    data() {
        return {
            
            // Authentication
            isLoggedIn: false,
            userName: '',
            currentPage: 'landing', 
            currentAuthPage: 'login', 
            currentAppPage: 'dashboard', 
            loading: false,
            
            // Toast Notification
            toast: {
                show: false,
                message: '',
                type: 'info'
            },

            showCreateModal: false,
            showEditModal: false,
            
            // Login Data & Errors
            loginData: {
                email: '',
                password: ''
            },
            loginErrors: {},
            
            // Signup Data & Errors
            signupData: {
                name: '',
                email: '',
                password: '',
                confirmPassword: ''
            },
            signupErrors: {},
            
            // Tickets
            tickets: [],
            statusFilter: 'all',
            priorityFilter: 'all',
            
            // Ticket Modal
            ticketForm: {
                id: null,
                title: '',
                description: '',
                status: 'open',
                priority: 'medium'
            },
            ticketErrors: {},

            // Landing Page Data
            features: [
                {
                    id: 1,
                    icon: '⚡',
                    title: 'Lightning Fast',
                    description: 'Experience blazing fast ticket management with real-time updates and instant search.'
                },
                {
                    id: 2,
                    icon: '🔒',
                    title: 'Secure & Reliable',
                    description: 'Enterprise-grade security with 99.9% uptime guarantee and data encryption.'
                },
                {
                    id: 3,
                    icon: '🔄',
                    title: 'Seamless Integration',
                    description: 'Connect with your favorite tools and automate your workflow effortlessly.'
                },
                {
                    id: 4,
                    icon: '📊',
                    title: 'Advanced Analytics',
                    description: 'Gain insights with detailed reports and customizable dashboards.'
                },
                {
                    id: 5,
                    icon: '👥',
                    title: 'Team Collaboration',
                    description: 'Work together efficiently with shared boards, comments, and mentions.'
                },
                {
                    id: 6,
                    icon: '🎯',
                    title: 'Smart Automation',
                    description: 'Automate repetitive tasks and focus on what matters most.'
                }
            ],
            stats: [
                { id: 1, number: '50K', label: 'Active Users' },
                { id: 2, number: '1M', label: 'Tickets Processed' },
                { id: 3, number: '99', label: 'Uptime Percentage' },
                { id: 4, number: '24/7', label: 'Customer Support' }
            ],
            testimonials: [
                {
                    id: 1,
                    text: 'Ticflow transformed how our team handles support tickets. We are 3x more efficient now!',
                    author: 'Sarah Chen',
                    position: 'CTO at TechCorp'
                },
                {
                    id: 2,
                    text: 'The intuitive interface and powerful features made onboarding our team a breeze.',
                    author: 'Marcus Johnson',
                    position: 'Product Manager at StartupXYZ'
                },
                {
                    id: 3,
                    text: 'Outstanding customer support and constantly improving features. Highly recommended!',
                    author: 'Emily Davis',
                    position: 'Team Lead at DesignCo'
                }
            ]
        }
    },
    computed: {
        // Ticket Statistics
        ticketStats() {
            const total = this.tickets.length;
            const open = this.tickets.filter(t => t.status === 'open').length;
            const inProgress = this.tickets.filter(t => t.status === 'in-progress').length;
            const resolved = this.tickets.filter(t => t.status === 'resolved').length;
            
            return { total, open, inProgress, resolved };
        },
        
        // Recent Tickets (last 5)
        recentTickets() {
            return this.tickets
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 5);
        },
        
        // Filtered Tickets
        filteredTickets() {
            let filtered = this.tickets;
            
            if (this.statusFilter !== 'all') {
                filtered = filtered.filter(ticket => ticket.status === this.statusFilter);
            }
            
            if (this.priorityFilter !== 'all') {
                filtered = filtered.filter(ticket => ticket.priority === this.priorityFilter);
            }
            
            return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
    },
    methods: {
        testCreateButton() {
            console.log('Create button clicked!');
            console.log('showCreateModal before:', this.showCreateModal);
            this.showCreateModal = true;
            console.log('showCreateModal after:', this.showCreateModal);
        },
        editTicket(ticket) {
        this.ticketForm = { ...ticket };
        this.showEditModal = true;
        },
        
        deleteTicket(ticketId) {
            if (confirm('Are you sure you want to delete this ticket?')) {
                this.tickets = this.tickets.filter(t => t.id !== ticketId);
                this.saveTickets();
                this.showToast('Ticket deleted successfully!', 'success');
            }
        },
        
        formatDate(dateString) {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        },
        // Toast Notification
        showToast(message, type = 'info') {
            this.toast = { show: true, message, type };
            setTimeout(() => {
                this.toast.show = false;
            }, 3000);
        },
        
        // Page Navigation
        switchToAuth(page) {
            this.currentPage = 'auth';
            this.currentAuthPage = page;
            this.loginErrors = {};
            this.signupErrors = {};
        },
        
        goToLanding() {
            this.currentPage = 'landing';
            this.loginErrors = {};
            this.signupErrors = {};
            this.loginData = { email: '', password: '' };
            this.signupData = { name: '', email: '', password: '', confirmPassword: '' };
        },
        
        // Authentication Methods
        switchAuthPage(page) {
            this.currentAuthPage = page;
            this.loginErrors = {};
            this.signupErrors = {};
        },
        
        validateLogin() {
            this.loginErrors = {};
            
            if (!this.loginData.email) {
                this.loginErrors.email = 'Email is required';
            } else if (!this.isValidEmail(this.loginData.email)) {
                this.loginErrors.email = 'Please enter a valid email address';
            }
            
            if (!this.loginData.password) {
                this.loginErrors.password = 'Password is required';
            } else if (this.loginData.password.length < 6) {
                this.loginErrors.password = 'Password must be at least 6 characters';
            }
            
            return Object.keys(this.loginErrors).length === 0;
        },
        
        validateSignup() {
            this.signupErrors = {};
            
            if (!this.signupData.name) {
                this.signupErrors.name = 'Full name is required';
            }
            
            if (!this.signupData.email) {
                this.signupErrors.email = 'Email is required';
            } else if (!this.isValidEmail(this.signupData.email)) {
                this.signupErrors.email = 'Please enter a valid email address';
            }
            
            if (!this.signupData.password) {
                this.signupErrors.password = 'Password is required';
            } else if (this.signupData.password.length < 6) {
                this.signupErrors.password = 'Password must be at least 6 characters';
            }
            
            if (!this.signupData.confirmPassword) {
                this.signupErrors.confirmPassword = 'Please confirm your password';
            } else if (this.signupData.password !== this.signupData.confirmPassword) {
                this.signupErrors.confirmPassword = 'Passwords do not match';
            }
            
            return Object.keys(this.signupErrors).length === 0;
        },
        
        isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },
        
        async handleLogin() {
            if (!this.validateLogin()) return;
            
            this.loading = true;
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Check if user exists in localStorage
            const users = JSON.parse(localStorage.getItem('ticflowUsers') || '[]');
            const user = users.find(u => u.email === this.loginData.email && u.password === this.loginData.password);
            
            if (user) {
                this.isLoggedIn = true;
                this.userName = user.name;
                this.currentPage = 'app';
                this.currentAppPage = 'dashboard';
                this.showToast('Login successful!', 'success');
                
                this.loadTickets();
            } else {
                this.showToast('Invalid email or password', 'error');
            }
            
            this.loading = false;
        },
        
        async handleSignup() {
            if (!this.validateSignup()) return;
            
            this.loading = true;
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const users = JSON.parse(localStorage.getItem('ticflowUsers') || '[]');
            
            // Check if email already exists
            if (users.find(u => u.email === this.signupData.email)) {
                this.showToast('Email already registered', 'error');
                this.loading = false;
                return;
            }
            
            // Create new user
            const newUser = {
                id: Date.now(),
                name: this.signupData.name,
                email: this.signupData.email,
                password: this.signupData.password,
                createdAt: new Date().toISOString()
            };
            
            users.push(newUser);
            localStorage.setItem('ticflowUsers', JSON.stringify(users));
            
            this.isLoggedIn = true;
            this.userName = newUser.name;
            this.currentPage = 'app';
            this.currentAppPage = 'dashboard';
            this.showToast('Account created successfully!', 'success');
            
            // Initialize empty tickets for new user
            this.tickets = [];
            this.saveTickets();
            
            this.loading = false;
        },
        
        logout() {
            this.isLoggedIn = false;
            this.userName = '';
            this.currentPage = 'landing';
            this.currentAuthPage = 'login';
            this.tickets = [];
            this.showToast('Logged out successfully', 'info');
        },
        
        // Ticket Methods 
        loadTickets() {
            const userTickets = localStorage.getItem(`ticflowTickets_${this.userName}`);
            if (userTickets) {
                this.tickets = JSON.parse(userTickets);
            }
        },
        
        saveTickets() {
            localStorage.setItem(`ticflowTickets_${this.userName}`, JSON.stringify(this.tickets));
        },
        
        validateTicket() {
            this.ticketErrors = {};
            
            if (!this.ticketForm.title) {
                this.ticketErrors.title = 'Title is required';
            } else if (this.ticketForm.title.length < 3) {
                this.ticketErrors.title = 'Title must be at least 3 characters';
            }
            
            if (!this.ticketForm.description) {
                this.ticketErrors.description = 'Description is required';
            } else if (this.ticketForm.description.length < 10) {
                this.ticketErrors.description = 'Description must be at least 10 characters';
            }
            
            return Object.keys(this.ticketErrors).length === 0;
        },
        
        createTicket() {
            if (!this.validateTicket()) return;
            
            const newTicket = {
                id: Date.now(),
                title: this.ticketForm.title,
                description: this.ticketForm.description,
                status: this.ticketForm.status,
                priority: this.ticketForm.priority,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            this.tickets.push(newTicket);
            this.saveTickets();
            this.closeModal();
            this.showToast('Ticket created successfully!', 'success');
        },
        
        editTicket(ticket) {
            this.ticketForm = { ...ticket };
            this.showEditModal = true;
        },
        
        updateTicket() {
            if (!this.validateTicket()) return;
            
            const index = this.tickets.findIndex(t => t.id === this.ticketForm.id);
            if (index !== -1) {
                this.tickets[index] = {
                    ...this.ticketForm,
                    updatedAt: new Date().toISOString()
                };
                this.saveTickets();
                this.closeModal();
                this.showToast('Ticket updated successfully!', 'success');
            }
        },
        
        deleteTicket(ticketId) {
            if (confirm('Are you sure you want to delete this ticket?')) {
                this.tickets = this.tickets.filter(t => t.id !== ticketId);
                this.saveTickets();
                this.showToast('Ticket deleted successfully!', 'success');
            }
        },
        
        closeModal() {
            this.showCreateModal = false;
            this.showEditModal = false;
            this.ticketForm = {
                id: null,
                title: '',
                description: '',
                status: 'open',
                priority: 'medium'
            };
            this.ticketErrors = {};
        },
        
        filterTickets() {
            // Filtering is handled by computed property
        },
        
        formatDate(dateString) {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }
    },
    mounted() {
        // Check if user is logged in
        const savedUser = localStorage.getItem('ticflowCurrentUser');
        if (savedUser) {
            const userData = JSON.parse(savedUser);
            this.isLoggedIn = true;
            this.userName = userData.name;
            this.currentPage = 'app';
            this.loadTickets();
        } else {
            // Show landing page for new visitors
            this.currentPage = 'landing';
        }
    },
    watch: {
        isLoggedIn(newVal) {
            if (newVal) {
                const userData = {
                    name: this.userName,
                    loginTime: new Date().toISOString()
                };
                localStorage.setItem('ticflowCurrentUser', JSON.stringify(userData));
            } else {
                localStorage.removeItem('ticflowCurrentUser');
                // Reset forms
                this.loginData = { email: '', password: '' };
                this.signupData = { name: '', email: '', password: '', confirmPassword: '' };
                this.loginErrors = {};
                this.signupErrors = {};
            }
        }
    }
}).mount('#app');