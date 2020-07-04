

export const port = process.env.port || 3003;
export const mongoUrl = process.env.MONGO_URI || 'mongodb://localhost:27017/wakecap';
export const emailCredentials = {
    email: process.env.email || 'a62cfbc5196b90',
    password: process.env.email || '434ee9d4f76bbc',
    host: 'smtp.mailtrap.io',
    port: 2525
}