const config = {
    development: {
        apiUrl: 'http://localhost:3000',
        isDevelopment: true,
    },
    production: {
        apiUrl: 'https://your-heroku-app.herokuapp.com',
        isDevelopment: false,
    }
};

export default config[import.meta.env.MODE] || config.development; 