# Deployment Guide

## Vercel Deployment

This API is configured for seamless deployment on Vercel.

### Prerequisites

- A [Vercel account](https://vercel.com/signup)
- Git repository (GitHub, GitLab, or Bitbucket)

### Deployment Options

#### Option 1: Vercel CLI (Recommended for first-time deployment)

1. Install Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy from the project root:
   ```bash
   vercel
   ```

4. Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N** (for first deployment)
   - Project name? Press Enter to use default or enter custom name
   - In which directory is your code located? **.**

5. For production deployment:
   ```bash
   vercel --prod
   ```

#### Option 2: Vercel Dashboard (Easiest)

1. Push your code to a Git repository (GitHub/GitLab/Bitbucket)

2. Go to [Vercel Dashboard](https://vercel.com/new)

3. Click "Import Project"

4. Select your Git provider and repository

5. Configure the project:
   - **Framework Preset**: Other
   - **Root Directory**: ./
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

6. Click "Deploy"

#### Option 3: Deploy Button (For repositories)

Add this button to your repository README:

```markdown
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=YOUR_REPO_URL)
```

Replace `YOUR_REPO_URL` with your repository URL.

### Configuration Files

The project includes these Vercel-specific files:

#### `vercel.json`
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/api"
    }
  ]
}
```

- **rewrites**: Routes all requests to the serverless function
- **buildCommand**: Compiles TypeScript to JavaScript
- **outputDirectory**: Where compiled files are stored

#### `api/index.ts`
```typescript
import { handle } from 'hono/vercel'
import { createApp } from '../src/app.js'

const app = createApp()

export default handle(app)
```

This is the serverless function entry point that Vercel invokes.

### After Deployment

Once deployed, Vercel will provide you with URLs:

- **Production URL**: `https://your-project.vercel.app`
- **Preview URLs**: Generated for each pull request

#### Test your deployment:

1. **API Endpoints**:
   ```bash
   # Create application
   curl -X POST https://your-project.vercel.app/applications \
     -H "Content-Type: application/json" \
     -d '{"first_name":"Jane","last_name":"Doe","email":"jane@example.com","loan_amount":25000}'
   
   # Get application
   curl https://your-project.vercel.app/applications/{id}
   ```

2. **OpenAPI Documentation**:
   - OpenAPI JSON: `https://your-project.vercel.app/doc`
   - Swagger UI: `https://your-project.vercel.app/swagger`

### Environment Variables

If you need to add environment variables:

1. **Via Vercel Dashboard**:
   - Go to Project Settings → Environment Variables
   - Add variables (e.g., `DATABASE_URL`, `API_KEY`)

2. **Via Vercel CLI**:
   ```bash
   vercel env add PORT production
   ```

### Continuous Deployment

Vercel automatically deploys:

- **Production**: Pushes to `main` or `master` branch
- **Preview**: Pushes to any other branch or pull requests

### Custom Domain

To add a custom domain:

1. Go to Project Settings → Domains
2. Add your domain
3. Configure DNS records as instructed
4. SSL certificate is automatically provisioned

### Monitoring

Monitor your deployment:

- **Logs**: View in Vercel Dashboard → Deployments → Function Logs
- **Analytics**: Enable Web Analytics in Project Settings
- **Performance**: Monitor serverless function execution times

### Troubleshooting

#### Build Failures

Check:
1. Build logs in Vercel Dashboard
2. Ensure all dependencies are in `dependencies` (not `devDependencies`)
3. Run `npm run build` locally to verify

#### Runtime Errors

1. Check function logs in Vercel Dashboard
2. Verify environment variables are set
3. Test locally with `npm run dev`

#### Cold Starts

Serverless functions have cold starts. To minimize:
- Keep dependencies small
- Use Vercel Pro for faster cold start regions
- Consider keeping functions warm with ping services

### Local Development

Test Vercel deployment locally:

```bash
npm install -g vercel
vercel dev
```

This simulates the Vercel environment locally.

### Rollback

To rollback to a previous deployment:

1. Go to Vercel Dashboard → Deployments
2. Find the working deployment
3. Click "Promote to Production"

Or via CLI:
```bash
vercel rollback
```

## Alternative: Traditional Hosting

If you prefer traditional hosting (VPS, cloud VM):

1. Build the project:
   ```bash
   npm run build
   ```

2. Copy these files to your server:
   - `dist/` folder
   - `package.json`
   - `node_modules/` (or run `npm install --production`)

3. Start the server:
   ```bash
   NODE_ENV=production node dist/index.js
   ```

4. Use a process manager:
   ```bash
   # PM2
   pm2 start dist/index.js --name loan-api
   
   # Or systemd service
   sudo systemctl start loan-api
   ```

5. Set up a reverse proxy (nginx/caddy) for HTTPS

## Docker Deployment

For containerized deployments, create a `Dockerfile`:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY dist ./dist
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

Build and run:
```bash
docker build -t loan-api .
docker run -p 3000:3000 loan-api
```

Deploy to:
- AWS ECS/Fargate
- Google Cloud Run
- Azure Container Instances
- Kubernetes
