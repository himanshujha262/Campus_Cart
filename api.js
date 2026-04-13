const BASE_URL = 'http://localhost:8080';

const api = {
    async request(endpoint, method = 'GET', body = null, authenticated = true) {
        const headers = {
            'Content-Type': 'application/json',
        };

        if (authenticated) {
            const token = localStorage.getItem('token');
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }

        const config = {
            method,
            headers,
        };

        if (body) {
            config.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(`${BASE_URL}${endpoint}`, config);
            
            if (response.status === 401) {
                // Potential token expiry
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                // You might want to trigger a logout UI update here
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Request failed with status ${response.status}`);
            }

            if (response.status === 204) return null;
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    auth: {
        login: (credentials) => api.request('/auth/login', 'POST', credentials, false),
        register: (userData) => api.request('/auth/register', 'POST', userData, false),
    },

    user: {
        getMe: () => api.request('/users/me'),
        updateMe: (userData) => api.request('/users/me', 'PUT', userData),
    },

    tenants: {
        getAll: () => api.request('/tenants', 'GET', null, false),
        create: (tenantData) => api.request('/tenants', 'POST', tenantData, false),
    },

    products: {
        getAll: () => api.request('/products'),
        getById: (id) => api.request(`/products/${id}`),
        create: (productData) => api.request('/products', 'POST', productData),
        update: (id, productData) => api.request(`/products/${id}`, 'PUT', productData),
        delete: (id) => api.request(`/products/${id}`, 'DELETE'),
    }
};
