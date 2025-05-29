# Deployment Setup Guide

This guide explains how to set up automatic deployment from GitHub to Cloudflare Pages with a custom domain.

## Prerequisites

1. **Cloudflare Account**: Sign up at [cloudflare.com](https://cloudflare.com)
2. **GitHub Repository**: Your code should be in a GitHub repository
3. **Custom Domain** (optional): A domain you own

## Step 1: Get Cloudflare Credentials

### Get your Account ID:
1. Log into Cloudflare Dashboard
2. Go to the right sidebar and copy your **Account ID**

### Create API Token:
1. Go to [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. Click "Create Token"
3. Use "Custom token" template
4. Set permissions:
   - **Account** - Cloudflare Pages:Edit
   - **Zone** - Zone Settings:Read, Zone:Read (if using custom domain)
5. Set Account Resources: Include - Your Account
6. Set Zone Resources: Include - Your Domain (if using custom domain)
7. Copy the generated token

## Step 2: Configure GitHub Secrets

In your GitHub repository:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add these repository secrets:
   - `CLOUDFLARE_API_TOKEN`: Your API token from Step 1
   - `CLOUDFLARE_ACCOUNT_ID`: Your Account ID from Step 1

## Step 3: Create Cloudflare Pages Project

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Pages**
3. Click **Create a project**
4. Choose **Direct Upload** (not Git integration)
5. Name your project: `beenycool-github-io`
6. Click **Create project**

## Step 4: Set Up Custom Domain (Optional)

### If your domain is NOT on Cloudflare:
1. In your domain registrar, add these CNAME records:
   ```
   www.yourdomain.com → beenycool-github-io.pages.dev
   yourdomain.com → beenycool-github-io.pages.dev
   ```

### If your domain IS on Cloudflare:
1. In your Pages project, go to **Custom domains**
2. Click **Set up a custom domain**
3. Enter your domain name
4. Cloudflare will automatically create the necessary DNS records

## Step 5: Deploy

1. Push your code to the `main` or `master` branch
2. GitHub Actions will automatically:
   - Build your Next.js application
   - Deploy it to Cloudflare Pages
3. Your site will be available at:
   - `https://beenycool-github-io.pages.dev`
   - `https://yourdomain.com` (if custom domain configured)

## Build Configuration

The workflow uses these build commands:
```bash
npm install
npx rimraf backend/.next
npx next build
npx next export
```

The built files are deployed from the `out` directory.

## Environment Variables

If your app needs environment variables:

1. In Cloudflare Pages project settings
2. Go to **Settings** → **Environment variables**
3. Add your variables for Production/Preview environments

## Troubleshooting

### Build Fails
- Check the GitHub Actions logs
- Ensure all dependencies are in `package.json`
- Verify your Next.js configuration

### Deployment Fails
- Verify your Cloudflare API token has correct permissions
- Check that the project name matches exactly
- Ensure your account ID is correct

### Custom Domain Issues
- DNS changes can take up to 24 hours to propagate
- Use [DNS Checker](https://dnschecker.org) to verify propagation
- Ensure CNAME records point to `beenycool-github-io.pages.dev`

## Security Notes

- Never commit API tokens to your repository
- Use GitHub Secrets for all sensitive information
- Regularly rotate your API tokens
- Set appropriate IP restrictions on tokens if needed