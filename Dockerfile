# שלב 1 - בניית קוד
FROM node:20-alpine AS builder

WORKDIR /app

# התקנת תלותים
COPY package*.json ./
RUN npm install

# העתקת הקוד
COPY . .

# בנייה
RUN npm run build

# שלב 2 - הרצה בפרודקשן
FROM node:20-alpine AS runner

WORKDIR /app

# העתק את קבצי ה-build
COPY --from=builder /app ./

EXPOSE 3000

# הפעלת השרת
CMD ["npm", "start"]
