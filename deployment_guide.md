# Shopez E-Commerce Deployment Guide

This document outlines the steps to deploy your full-stack MERN Shopez application to production servers using standard, free-tier hosting providers:
* **Database**: MongoDB Atlas (Cloud database)
* **Backend API**: Render (Node.js web service hosting)
* **Frontend UI**: Vercel (Fast static site hosting with edge networks)

---

## 🗄️ Step 1: Deploy MongoDB Database (MongoDB Atlas)
Before hosting the application, you need to set up a production database cluster.

1. Sign up/Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new **Free Tier (M0) Cluster** (select any region closest to you).
3. Create a **Database User**:
   * Set a username and secure password (copy these down).
4. Configure **Network Access**:
   * Add your IP address to allow local development connections.
   * To ensure the Render backend can connect, you should add `0.0.0.0/0` (access from anywhere) temporarily or connect via Peering/Private endpoints if on a paid tier.
5. Get your **Connection String**:
   * Click **Connect** on your cluster dashboard.
   * Choose **Drivers** (Node.js).
   * Copy the connection string (looks like `mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/shopez?retryWrites=true&w=majority`).
   * Replace `<username>` and `<password>` with your created database user details.

---

## 🚀 Step 2: Deploy Backend API (Render)
Render is perfect for hosting the Express/Node.js backend.

1. Push your code folder (`shopez`) to a private or public repository on **GitHub** or **GitLab**.
2. Sign up/Log in to [Render.com](https://render.com).
3. On the dashboard, click **New +** and select **Web Service**.
4. Connect your GitHub/GitLab account and select the `shopez` repository.
5. Configure the Web Service settings:
   * **Name**: `shopez-api` (or custom name)
   * **Region**: Choose the region closest to your MongoDB Atlas cluster.
   * **Root Directory**: `backend` (This points Render to the backend folder)
   * **Runtime**: `Node`
   * **Build Command**: `npm install`
   * **Start Command**: `node server.js`
6. Add the **Environment Variables** (click *Advanced* ➔ *Add Environment Variable*):
   * `MONGODB_URI` = `your_actual_mongodb_atlas_connection_string` (from Step 1)
   * `JWT_SECRET` = `a_very_long_random_secure_string_for_signing_tokens`
   * `PORT` = `5000`
7. Click **Create Web Service**.
8. Once the build finishes and says "Live", copy the Web Service URL at the top of the page (looks like `https://shopez-api.onrender.com`).

---

## 💻 Step 3: Deploy Frontend Client (Vercel)
Vercel is the industry standard for Vite/React web apps.

1. Sign up/Log in to [Vercel.com](https://vercel.com).
2. Click **Add New** ➔ **Project**.
3. Import your `shopez` repository from GitHub/GitLab.
4. Configure the Project settings:
   * **Framework Preset**: `Vite` (Vercel will auto-detect this)
   * **Root Directory**: Click *Edit* and select `frontend`.
   * **Build and Output Settings**: Leave as default (Vercel auto-configures `npm run build` and the `dist` directory).
5. Add **Environment Variables**:
   * **Key**: `VITE_API_URL`
   * **Value**: `https://shopez-api.onrender.com` (Your live Render backend URL from Step 2, without a trailing slash)
6. Click **Deploy**.
7. Vercel will build and deploy the frontend in under a minute and provide you with a live domain (e.g. `https://shopez.vercel.app`).

---

## 🔍 Step 4: Verification
1. Open your Vercel URL.
2. Open the browser dev tools (F12) and check the **Network** tab to ensure the frontend is communicating with your Render API (`https://shopez-api.onrender.com/api/products`).
3. Create a test account and complete a checkout flow. Check your MongoDB Atlas Collections tab to see the new `users` and `orders` populated in the database.
