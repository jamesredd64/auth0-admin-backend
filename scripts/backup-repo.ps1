# Create a backup of the current repository
$date = Get-Date -Format "yyyyMMdd_HHmmss"
$backupDir = "repo_backup_$date"
Copy-Item -Path "." -Destination "../$backupDir" -Recurse