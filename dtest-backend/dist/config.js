import 'dotenv/config';
export const config = {
    port: Number(process.env.PORT) || 5000,
    mongoUri: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET || 'dev_secret',
    tokenExpiresIn: process.env.TOKEN_EXPIRES_IN || '7d',
    smtp: {
        host: process.env.SMTP_HOST || 'mailhog',
        port: Number(process.env.SMTP_PORT) || 1025,
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
        from: process.env.SMTP_FROM || 'no-reply@dtest.local'
    },
    bootstrapAdmin: {
        email: process.env.DEFAULT_ADMIN_EMAIL || 'admin@dtest.local',
        password: process.env.DEFAULT_ADMIN_PASSWORD || 'Admin123!',
        first: process.env.DEFAULT_ADMIN_FIRST || 'System',
        last: process.env.DEFAULT_ADMIN_LAST || 'Admin'
    }
};
