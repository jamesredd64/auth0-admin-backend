# 1. Create backup
$backupDir = "..\repo-backup-$(Get-Date -Format 'yyyyMMdd')"
New-Item -ItemType Directory -Force -Path $backupDir
Copy-Item -Path ".\*" -Destination $backupDir -Recurse

# 2. Remove all files except .git
Get-ChildItem -Path . -Exclude .git | Remove-Item -Recurse -Force

# 3. Copy new backend code
Copy-Item -Path "C:\Users\james\Downloads\free-react-tailwind-admin-dashboard-main\TailAdmin-Main\auth0-admin-backend\*" -Destination . -Recurse

# 4. Stage and commit
git add .
git commit -m "Replace with new auth0-admin-backend code"

# 5. Push changes
git push origin main