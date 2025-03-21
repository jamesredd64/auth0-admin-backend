# 1. First backup your current code (safety measure)
mkdir ../repo-backup-$(date +%Y%m%d)
cp -r . ../repo-backup-$(date +%Y%m%d)

# 2. Remove all files EXCEPT .git directory and specific config files
find . -not -path "./.git/*" -not -name ".git" -not -name ".gitignore" -delete

# 3. Copy new backend code
cp -r "C:\Users\james\Downloads\free-react-tailwind-admin-dashboard-main\TailAdmin-Main\auth0-admin-backend/"* .

# 4. Stage and commit
git add .
git commit -m "Replace with new auth0-admin-backend code"

# 5. Push changes
git push origin main