
export function extractErrorMessage(err: any, defaultMessage: string = 'An error occurred. Please try again later.'): string {
    if (err.status === 503 || err.status === 500) {
        const url = err.url || '';
        if (url.includes('/api/manager/technicians') || url.includes('/api/auth') || url.includes('/api/admin')) {
            return 'User Service is currently unavailable. Please try again later.';
        } else if (url.includes('/api/parts') || url.includes('/api/inventory')) {
            return 'Inventory Service is currently unavailable. Please try again later.';
        } else if (url.includes('/api/vehicles')) {
            return 'Vehicle Service is currently unavailable. Please try again later.';
        } else if (url.includes('/api/service-requests') || url.includes('/api/billing') || url.includes('/api/bays')) {
            return 'Service Request Service is currently unavailable. Please try again later.';
        }
        return 'Service is currently unavailable. Please try again later.';
    }

    if (typeof err.error === 'string') {
        return err.error;
    }
    if (err.error?.message) {
        return err.error.message;
    }
    if (err.message) {
        return err.message;
    }

    return defaultMessage;
}
