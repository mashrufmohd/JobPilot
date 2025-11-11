# 🚀 Vercel Deployment Guide

## ✅ Issue Fixed: 404 on Page Refresh

The `vercel.json` file has been added to handle client-side routing properly. This ensures that when you refresh pages like `/login` or `/register`, Vercel will serve `index.html` instead of returning a 404 error.

## 📝 What Was Added

**`frontend/vercel.json`**
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This configuration tells Vercel to:
- Intercept ALL route requests
- Serve the `index.html` file
- Let React Router handle the routing on the client side

## 🔧 Deployment Steps

### 1. **Vercel Project Settings**

Make sure your Vercel project is configured with:

- **Framework Preset**: Vite
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 2. **Environment Variables on Vercel**

Add these environment variables in Vercel Dashboard (Settings → Environment Variables):

```env
VITE_API_URL=https://your-backend-url.com/api
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
VITE_CLOUDINARY_CLOUD_NAME=du9fswvzu
VITE_CLOUDINARY_UPLOAD_PRESET=jobpilot_preset
```

### 3. **Deploy Backend First**

Before deploying frontend, make sure your backend is deployed and accessible:

**Options for Backend Deployment:**
- **Render.com** (Free tier available)
- **Railway.app**
- **Heroku**
- **DigitalOcean App Platform**

**Backend Environment Variables Needed:**
```env
DATABASE_URL=your_production_database_url
JWT_SECRET=your_production_jwt_secret
CLOUDINARY_CLOUD_NAME=du9fswvzu
CLOUDINARY_API_KEY=914781376348278
CLOUDINARY_API_SECRET=HJYSUwmKfvH3ecv6gNgrf2BOJhs
CLOUDINARY_UPLOAD_PRESET=jobpilot_preset
CORS_ORIGINS=https://your-vercel-app.vercel.app
```

### 4. **Update Frontend API URL**

Once backend is deployed, update `VITE_API_URL` in Vercel environment variables:
```
VITE_API_URL=https://your-backend-url.com/api
```

### 5. **Redeploy**

After adding environment variables:
1. Go to Vercel Dashboard
2. Click **"Redeploy"** 
3. Check "Use existing Build Cache" is unchecked
4. Click **"Redeploy"**

## 🐛 Troubleshooting

### Issue: Still Getting 404
**Solution:** 
- Clear browser cache
- Hard refresh (Ctrl + Shift + R)
- Wait 1-2 minutes for Vercel to propagate changes
- Check that `vercel.json` is in the `frontend` folder

### Issue: API Calls Failing
**Solution:**
- Verify `VITE_API_URL` is set correctly in Vercel
- Check backend CORS settings include your Vercel URL
- Ensure backend is running and accessible

### Issue: Firebase Not Working
**Solution:**
- Verify all `VITE_FIREBASE_*` variables are set in Vercel
- Check Firebase console for allowed domains
- Add your Vercel domain to Firebase authorized domains

### Issue: Images Not Loading
**Solution:**
- Check Cloudinary credentials in Vercel environment variables
- Verify upload preset is correct
- Test image URLs directly in browser

## 🔍 Testing After Deployment

1. ✅ Visit homepage
2. ✅ Navigate to `/login` - should work
3. ✅ Refresh the `/login` page - should NOT show 404
4. ✅ Navigate to `/register` and refresh
5. ✅ Test registration flow
6. ✅ Test login flow
7. ✅ Test protected routes

## 📊 Vercel Build Logs

If deployment fails, check build logs:
1. Go to Vercel Dashboard
2. Click on your deployment
3. Click **"Building"** tab
4. Look for error messages

Common build errors:
- **Missing environment variables**: Add them in Settings
- **Node version mismatch**: Add `engines` in `package.json`
- **Build command failed**: Check `package.json` scripts

## 🎯 Quick Commands

```bash
# Push changes to trigger new deployment
git add .
git commit -m "Update: Fix deployment issues"
git push

# Check deployment status
vercel --prod

# View logs
vercel logs
```

## 📞 Need Help?

If issues persist:
1. Check Vercel build logs
2. Check browser console for errors
3. Verify all environment variables are set
4. Test API endpoints directly with Postman
5. Check backend logs

---

**Status:** ✅ Configuration pushed to GitHub
**Next Step:** Wait for Vercel to auto-deploy or manually redeploy from Vercel Dashboard

The 404 error should be fixed after Vercel rebuilds your project! 🎉
