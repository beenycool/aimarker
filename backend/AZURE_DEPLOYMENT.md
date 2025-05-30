# Deploying Backend to Azure App Service

## Prerequisites
- Azure account (free tier available)
- GitHub repository with your backend code
- Azure CLI installed (optional, for command line deployment)

## Deployment Methods

### Method 1: Azure Portal (Recommended for beginners)

#### 1. Create Azure App Service
1. Go to [Azure Portal](https://portal.azure.com)
2. Click "Create a resource" → "Web App"
3. Configure the web app:
   - **Subscription**: Your Azure subscription
   - **Resource Group**: Create new or use existing
   - **Name**: `beenycool-backend` (must be globally unique)
   - **Publish**: `Code`
   - **Runtime stack**: `Node 20 LTS`
   - **Operating System**: `Linux`
   - **Region**: Choose closest to your users
   - **Pricing plan**: `Free F1` (for free tier)

#### 2. Configure Deployment
1. After creation, go to your App Service
2. In left sidebar, click "Deployment Center"
3. Choose "GitHub" as source
4. Authorize Azure to access your GitHub
5. Select your repository and branch
6. Choose "GitHub Actions" for build provider
7. Configure build:
   - **Runtime stack**: Node.js
   - **Version**: 20.x
   - **Build command**: `npm install`
   - **Start command**: `npm start`
   - **App location**: `/backend` (if backend is in subdirectory)

#### 3. Set Environment Variables
1. Go to "Configuration" in left sidebar
2. Click "Application settings"
3. Add the following environment variables:

**Required:**
- `NODE_ENV`: `production`
- `PORT`: `8080` (Azure default)
- `WEBSITE_NODE_DEFAULT_VERSION`: `20.x`

**Optional (for AI functionality):**
- `OPENAI_API_KEY`: Your OpenAI API key
- `OPENROUTER_API_KEY`: Your OpenRouter API key
- `GEMINI_API_KEY`: Your Gemini API key
- `GITHUB_API_KEY`: Your GitHub Models API key
- `AZURE_OPENAI_API_KEY`: Your Azure OpenAI API key
- `AZURE_OPENAI_ENDPOINT`: Your Azure OpenAI endpoint
- `OPENAI_API_VERSION`: `2024-10-01-preview`
- `JWT_SECRET`: Random generated string

4. Click "Save"

### Method 2: Azure CLI Deployment

#### Prerequisites
Install Azure CLI:
```bash
# Windows
winget install Microsoft.AzureCLI

# macOS
brew install azure-cli

# Linux (Ubuntu/Debian)
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
```

#### Deploy Steps
```bash
# 1. Login to Azure
az login

# 2. Create resource group
az group create --name beenycool-rg --location "East US"

# 3. Create App Service plan (free tier)
az appservice plan create \
  --name beenycool-plan \
  --resource-group beenycool-rg \
  --sku F1 \
  --is-linux

# 4. Create web app
az webapp create \
  --resource-group beenycool-rg \
  --plan beenycool-plan \
  --name beenycool-backend \
  --runtime "NODE:20-lts" \
  --deployment-local-git

# 5. Configure app settings
az webapp config appsettings set \
  --resource-group beenycool-rg \
  --name beenycool-backend \
  --settings NODE_ENV=production WEBSITE_NODE_DEFAULT_VERSION=20.x

# 6. Set startup command
az webapp config set \
  --resource-group beenycool-rg \
  --name beenycool-backend \
  --startup-file "npm start"

# 7. Deploy from GitHub (replace with your repo)
az webapp deployment source config \
  --resource-group beenycool-rg \
  --name beenycool-backend \
  --repo-url https://github.com/yourusername/yourrepo \
  --branch main \
  --manual-integration
```

### Method 3: GitHub Actions Deployment

Create `.github/workflows/azure-deploy.yml`:

```yaml
name: Deploy to Azure App Service

on:
  push:
    branches: [ main ]
    paths: [ 'backend/**' ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'
        cache: 'npm'
        cache-dependency-path: backend/package-lock.json
    
    - name: Install dependencies
      run: |
        cd backend
        npm ci
    
    - name: Deploy to Azure
      uses: azure/webapps-deploy@v2
      with:
        app-name: 'beenycool-backend'
        publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
        package: './backend'
```

To get the publish profile:
1. Go to your App Service in Azure Portal
2. Click "Get publish profile" in the overview
3. Add the downloaded content as `AZURE_WEBAPP_PUBLISH_PROFILE` secret in GitHub

## Azure-Specific Configuration

### Update package.json
Ensure your `backend/package.json` has:
```json
{
  "scripts": {
    "start": "node server-start.js"
  },
  "engines": {
    "node": "20.x"
  }
}
```

### Create web.config (Optional)
For better Azure compatibility, create `backend/web.config`:
```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <webSocket enabled="false" />
    <handlers>
      <add name="iisnode" path="server-start.js" verb="*" modules="iisnode"/>
    </handlers>
    <rewrite>
      <rules>
        <rule name="NodeInspector" patternSyntax="ECMAScript" stopProcessing="true">
          <match url="^server-start.js\/debug[\/]?" />
        </rule>
        <rule name="StaticContent">
          <action type="Rewrite" url="public{REQUEST_URI}"/>
        </rule>
        <rule name="DynamicContent">
          <conditions>
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="True"/>
          </conditions>
          <action type="Rewrite" url="server-start.js"/>
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
```

## Environment Variables Setup

Add these in Azure Portal → App Service → Configuration → Application settings:

### Core Settings
- `NODE_ENV`: `production`
- `PORT`: `8080`
- `WEBSITE_NODE_DEFAULT_VERSION`: `20.x`

### AI API Keys
- `OPENAI_API_KEY`: Your OpenAI API key
- `OPENROUTER_API_KEY`: Your OpenRouter API key  
- `GEMINI_API_KEY`: Your Gemini API key
- `GITHUB_API_KEY`: Your GitHub Models API key

### Azure OpenAI (if using Azure AI services)
- `AZURE_OPENAI_API_KEY`: Your Azure OpenAI key
- `AZURE_OPENAI_ENDPOINT`: Your Azure OpenAI endpoint
- `OPENAI_API_VERSION`: `2024-10-01-preview`

### Security
- `JWT_SECRET`: Generate with `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

## Testing Deployment

Once deployed, your backend will be available at:
`https://beenycool-backend.azurewebsites.net`

Test these endpoints:
- `GET /health` - Health check
- `GET /api/` - Your API endpoints

## Azure Free Tier Limitations

### Quotas
- **Compute**: 60 CPU minutes/day
- **Storage**: 1 GB
- **Bandwidth**: 165 MB/day outbound
- **Custom domains**: Not available on free tier

### Auto-sleep
- App sleeps after 20 minutes of inactivity
- First request after sleep may take 10-30 seconds

### Optimization Tips
1. **Minimize cold starts**: Keep app warm with ping requests
2. **Optimize dependencies**: Remove unused packages
3. **Use CDN**: For static assets
4. **Monitor usage**: Check quotas in Azure Portal

## Troubleshooting

### Common Issues
1. **Build failures**: Check Node.js version compatibility
2. **App won't start**: Verify start command in Configuration
3. **Environment variables**: Ensure all required vars are set
4. **Path issues**: Use absolute paths or proper path joining

### Debugging
- View logs: Azure Portal → App Service → Log stream
- Enable Application Insights for detailed monitoring
- Use Kudu console: `https://your-app.scm.azurewebsites.net`

## Cost Management
- Monitor usage in Azure Portal
- Set up billing alerts
- Consider upgrading to paid tier if limits are exceeded

## Security Best Practices
- [ ] Enable HTTPS only
- [ ] Set up custom domain with SSL (paid tiers)
- [ ] Use Azure Key Vault for secrets (paid tiers)
- [ ] Enable authentication if needed
- [ ] Configure CORS properly
- [ ] Review network access restrictions