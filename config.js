require('dotenv').config();

console.log(process.env.NEXT_PUBLIC_BASE_URL)

export const config = {
 baseURL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:10600',
  };