# SmartInvoice AI - New Vercel Project
# This will create a new project on Vercel

Write-Host "Deploying SmartInvoice AI to Vercel..." -ForegroundColor Cyan

# Deploy with new project settings
$env:VERCEL_ORG_ID = ""
$env:VERCEL_PROJECT_ID = ""

vercel --prod --name smartinvoice-ai
