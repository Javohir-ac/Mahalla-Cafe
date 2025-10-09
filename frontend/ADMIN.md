# Admin Panel Documentation

## Admin Authentication

### Login

- **URL**: `/admin/login`
- **Method**: POST
- **Fields**: username, password

### Registration

- **URL**: `/admin/register`
- **Method**: POST
- **Fields**: username, password, secretCode

## Admin Routes

All admin routes are protected and require authentication:

- `/admin` - Admin Dashboard
- `/admin/orders` - Order Management (to be implemented)
- `/admin/menu` - Menu Management (to be implemented)

## Authentication

Admin tokens are stored in localStorage as `adminToken`. The AdminRoute component checks for the presence of this token to allow access to protected routes.

## Environment Variables

The frontend expects the backend to be running on `http://localhost:5000`. Update the `API_BASE_URL` in `src/services/admin.service.ts` if your backend is running on a different port.
