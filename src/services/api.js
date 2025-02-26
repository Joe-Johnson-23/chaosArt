import config from '../config';

export const apiService = {
    configurations: {
        async save(configData) {
            const response = await fetch(`${config.apiUrl}/configurations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(configData)
            });
            return await response.json();
        }
    }
}; 