# Initialize fresh Git repository
function Initialize-GitRepo {
    Write-Host "Initializing fresh Git repository..." -ForegroundColor Green

    # Remove existing Git configuration
    if (Test-Path ".git") {
        Write-Host "Removing existing Git configuration..." -ForegroundColor Yellow
        Remove-Item ".git" -Recurse -Force
    }

    # Initialize Git
    git init

    # Configure user information
    $gitEmail = Read-Host "Enter your Git email"
    $gitName = Read-Host "Enter your Git username"
    
    git config user.email $gitEmail
    git config user.name $gitName

    # Create initial .gitignore if it doesn't exist
    if (-not (Test-Path .gitignore)) {
        Copy-Item "scripts\.gitignore" .gitignore -ErrorAction SilentlyContinue
    }

    # Initial commit
    git add .
    git commit -m "Initial commit"

    # Create and switch to main branch
    git branch -M main

    # Set up remote repository
    do {
        $remoteUrl = Read-Host "Enter your GitHub repository URL (https://github.com/username/repo.git)"
        
        # Validate URL format
        if (-not ($remoteUrl -match "^https://github\.com/[\w-]+/[\w-]+\.git$")) {
            Write-Host "Invalid URL format. Please use HTTPS format: https://github.com/username/repo.git" -ForegroundColor Red
            continue
        }

        # Remove existing remote if it exists
        git remote remove origin
        
        # Add new remote
        git remote add origin $remoteUrl

        # Set the remote HEAD reference
        git remote set-head origin -a

        # Configure branch tracking
        git branch --set-upstream-to=origin/main main

        # Test the connection
        $testConnection = git ls-remote --exit-code $remoteUrl 2>&1
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Failed to connect to repository. Please check the URL and your GitHub credentials." -ForegroundColor Red
            Write-Host "Error: $testConnection" -ForegroundColor Red
            continue
        }
        break
    } while ($true)

    # Force push to remote repository
    $forcePush = Read-Host "Do you want to force push to remote repository? This will overwrite remote history (y/N)"
    if ($forcePush -eq 'y' -or $forcePush -eq 'Y') {
        Write-Host "Attempting force push..." -ForegroundColor Yellow
        $pushResult = git push -u origin main --force 2>&1
    } else {
        Write-Host "Attempting normal push..." -ForegroundColor Green
        $pushResult = git push -u origin main 2>&1
    }

    if ($LASTEXITCODE -ne 0) {
        Write-Host "Push failed. Error: $pushResult" -ForegroundColor Red
        Write-Host "Please ensure you have the correct access rights and the repository exists." -ForegroundColor Yellow
    } else {
        # Fetch and set up remote tracking
        git fetch origin
        git remote set-head origin -a
        
        Write-Host "`nGit repository initialized successfully!" -ForegroundColor Green
        Write-Host "Remote repository set to: $remoteUrl" -ForegroundColor Cyan
    }
}

# Run the initialization
Initialize-GitRepo


