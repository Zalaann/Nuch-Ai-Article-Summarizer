# Deploying Nuch Summarizer to cPanel

This guide will help you deploy your Next.js application to a cPanel hosting environment.

## Security Precautions (IMPORTANT)

Before deploying your application, take these security measures:

1. **Protect API Keys**: 
   - Never commit your actual API keys to version control
   - Keep your OpenAI API key in `.env.local` on your development machine only
   - Use placeholder values in `.env.production` and `.env.local.example`
   - Add your actual API keys to your production environment manually after deployment

2. **API Routes in Static Exports**:
   - Static exports don't include server-side API routes
   - Consider using external services for API functionality (see Step 5 below)
   - Never expose your OpenAI API key in client-side code

3. **Secure Authentication**:
   - Ensure your Supabase redirect URLs are properly configured for your production domain
   - Use HTTPS for all production traffic

## Step 1: Build and Export Your Application

1. Make sure you have the latest code changes committed
2. Run the export command:
   ```
   npm run export
   ```
3. This will create an `out` directory with your static export

## Step 2: Prepare Your Files for Upload

1. Compress the entire `out` directory into a ZIP file
2. If your application is large, you might want to split it into smaller ZIP files

## Step 3: Upload to cPanel

1. Log in to your cPanel account
2. Navigate to the File Manager
3. Go to the directory where you want to deploy your application (e.g., `public_html` or a subdirectory)
4. Upload your ZIP file(s)
5. Extract the ZIP file(s)
6. Upload the `.htaccess` file to the same directory

## Step 4: Configure Your Domain

If you're deploying to a subdirectory:
1. Make sure you've set the `NEXT_PUBLIC_BASE_PATH` in your `.env.production` file before exporting
2. For example, if your app will be at `example.com/nuch-summarizer`, set `NEXT_PUBLIC_BASE_PATH=/nuch-summarizer`

## Step 5: Set Up API Routes (Required)

Since this is a static export, your API routes won't work directly. You have three options:

1. **Use Supabase Edge Functions**:
   - Move your API functionality to Supabase Edge Functions
   - Update your frontend code to call these functions instead of local API routes

2. **Use a Serverless Platform**:
   - Deploy your API routes to Vercel, Netlify, or AWS Lambda
   - Update your frontend code to point to these external endpoints

3. **Set Up a Separate API Server**:
   - If your cPanel hosting supports Node.js, set up a separate API server
   - Configure CORS to allow requests from your static site

## Step 6: Test Your Deployment

1. Visit your website to ensure everything is working correctly
2. Test all functionality, especially authentication and API-dependent features
3. Check that all links and navigation work properly

## Troubleshooting

### Images Not Loading
- Make sure the paths to your images are correct
- Check that the `unoptimized: true` option is set in your `next.config.js`

### API Routes Not Working
- Static exports don't include API routes
- Verify you've properly set up external API services as described in Step 5

### Authentication Issues
- Ensure your Supabase URL and key are correctly set
- Check that your redirect URLs are properly configured for your production domain
- Verify you're using HTTPS for all authentication requests

### 404 Errors
- Make sure the `trailingSlash: true` option is set in your `next.config.js`
- Check that your `.htaccess` file is properly configured and uploaded

## Additional Resources

- [Next.js Static Exports Documentation](https://nextjs.org/docs/advanced-features/static-html-export)
- [Deploying Next.js to cPanel](https://dev.to/femi_dev/how-to-deploy-your-next-js-app-on-cpanel-shared-hosting-35k5)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Securing Web Applications](https://cheatsheetseries.owasp.org/cheatsheets/Securing_Coding_Practices_Cheat_Sheet.html) 