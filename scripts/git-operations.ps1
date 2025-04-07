# In your backup repository
# 1. Get the commit hashes you want to transfer
git log --oneline

# 2. Copy those hashes, then switch to your main repository
cd path/to/main/repo

# 3. Create a new branch for the changes
git checkout -b import-backup

# 4. Cherry-pick the commits you want
# Usage: git cherry-pick [hash1] [hash2]
git cherry-pick $args[0] $args[1]

# 5. Push the changes to your main repository
git push origin import-backup

function Import-FromBackup {
    Write-Host "Import changes from backup repository"
    Write-Host "1: Add main repository as remote"
    Write-Host "2: Push current branch to main repository"
    Write-Host "3: Cherry-pick specific commits"
    Write-Host "4: Back"
    
    $importChoice = Read-Host "Choose import method"
    switch ($importChoice) {
        '1' {
            $mainRepoUrl = Read-Host "Enter main repository URL"
            git remote add main $mainRepoUrl
            Write-Host "Main repository added as remote"
        }
        '2' {
            $branchName = git rev-parse --abbrev-ref HEAD
            $targetBranch = Read-Host "Enter target branch name for main repository"
            git push main "${branchName}:${targetBranch}"
        }
        '3' {
            Write-Host "Recent commits:"
            git log --oneline -n 10
            $commits = Read-Host "Enter commit hashes to cherry-pick (space-separated)"
            $commits.Split(' ') | ForEach-Object {
                git cherry-pick $_
            }
        }
    }
    Pause
}

function Show-GitMenu {
    Clear-Host
    Write-Host "================ Git Operations Menu ================"
    Write-Host "1: Initialize Git repository"
    Write-Host "2: Add files to staging"
    Write-Host "3: Commit changes"
    Write-Host "4: Push changes"
    Write-Host "5: Pull changes"
    Write-Host "6: View status"
    Write-Host "7: View log"
    Write-Host "8: Create branch"
    Write-Host "9: Switch branch"
    Write-Host "10: Merge branch"
    Write-Host "11: Import from backup repository"
    Write-Host "12: View/manage remotes"
    Write-Host "13: Reset to a specific commit"
    Write-Host "14: Stash operations"
    Write-Host "Q: Quit"
    Write-Host "=================================================="
}

function Initialize-Git {
    git init
    Write-Host "Git repository initialized"
    Pause
}

function Add-Files {
    Write-Host "Current status:"
    git status
    Write-Host "`nOptions:"
    Write-Host "1: Add specific file"
    Write-Host "2: Add all files"
    Write-Host "3: Back"
    
    $choice = Read-Host "`nEnter choice"
    switch ($choice) {
        "1" {
            $file = Read-Host "Enter file path"
            git add $file
        }
        "2" {
            git add .
        }
    }
    Write-Host "Files added to staging"
    Pause
}

function Commit-Changes {
    Write-Host "Current staged files:"
    git status
    $message = Read-Host "`nEnter commit message"
    if (![string]::IsNullOrWhiteSpace($message)) {
        git commit -m $message
    }
    Pause
}

function Push-Changes {
    Write-Host "1: Push to current branch"
    Write-Host "2: Push to specific branch"
    Write-Host "3: Back"
    
    $choice = Read-Host "`nEnter choice"
    switch ($choice) {
        "1" {
            git push
        }
        "2" {
            $branch = Read-Host "Enter branch name"
            git push origin $branch
        }
    }
    Pause
}

function Pull-Changes {
    Write-Host "1: Pull from current branch"
    Write-Host "2: Pull from specific branch"
    Write-Host "3: Back"
    
    $choice = Read-Host "`nEnter choice"
    switch ($choice) {
        "1" {
            git pull
        }
        "2" {
            $branch = Read-Host "Enter branch name"
            git pull origin $branch
        }
    }
    Pause
}

function Show-Status {
    git status
    Pause
}

function Show-Log {
    Write-Host "1: Show recent commits"
    Write-Host "2: Show detailed log"
    Write-Host "3: Back"
    
    $choice = Read-Host "`nEnter choice"
    switch ($choice) {
        "1" {
            git log --oneline -n 10
        }
        "2" {
            git log
        }
    }
    Pause
}

function Create-Branch {
    $branch = Read-Host "Enter new branch name"
    if (![string]::IsNullOrWhiteSpace($branch)) {
        git checkout -b $branch
    }
    Pause
}

function Switch-Branch {
    Write-Host "Available branches:"
    git branch
    $branch = Read-Host "`nEnter branch name to switch to"
    if (![string]::IsNullOrWhiteSpace($branch)) {
        git checkout $branch
    }
    Pause
}

function Merge-Branch {
    Write-Host "Available branches:"
    git branch
    $branch = Read-Host "`nEnter branch name to merge from"
    if (![string]::IsNullOrWhiteSpace($branch)) {
        git merge $branch
    }
    Pause
}

function Manage-Remotes {
    Write-Host "1: List remotes"
    Write-Host "2: Add remote"
    Write-Host "3: Remove remote"
    Write-Host "4: Back"
    
    $choice = Read-Host "`nEnter choice"
    switch ($choice) {
        "1" {
            git remote -v
        }
        "2" {
            $name = Read-Host "Enter remote name"
            $url = Read-Host "Enter remote URL"
            git remote add $name $url
        }
        "3" {
            git remote -v
            $name = Read-Host "`nEnter remote name to remove"
            git remote remove $name
        }
    }
    Pause
}

function Manage-Stash {
    Write-Host "1: Stash changes"
    Write-Host "2: List stashes"
    Write-Host "3: Apply stash"
    Write-Host "4: Drop stash"
    Write-Host "5: Back"
    
    $choice = Read-Host "`nEnter choice"
    switch ($choice) {
        "1" {
            $message = Read-Host "Enter stash message (optional)"
            if ([string]::IsNullOrWhiteSpace($message)) {
                git stash
            } else {
                git stash push -m $message
            }
        }
        "2" {
            git stash list
        }
        "3" {
            git stash list
            $index = Read-Host "`nEnter stash index to apply"
            git stash apply stash@{$index}
        }
        "4" {
            git stash list
            $index = Read-Host "`nEnter stash index to drop"
            git stash drop stash@{$index}
        }
    }
    Pause
}

function Reset-ToCommit {
    while ($true) {
        Clear-Host
        Write-Host "================ Reset to Commit ================"
        Write-Host "1: View recent commits"
        Write-Host "2: View reflog"
        Write-Host "3: Return to main menu"
        Write-Host "================================================"
        
        $choice = Read-Host "`nEnter your choice"
        
        switch ($choice) {
            "1" {
                Clear-Host
                Write-Host "How many commits to show?"
                Write-Host "1: Last 15 commits"
                Write-Host "2: Last 30 commits"
                Write-Host "3: Last 50 commits"
                Write-Host "4: Custom number"
                Write-Host "5: Back"
                
                $countChoice = Read-Host "`nEnter your choice"
                if ($countChoice -eq "5") { continue }
                
                $commitCount = switch ($countChoice) {
                    "1" { 15 }
                    "2" { 30 }
                    "3" { 50 }
                    "4" { 
                        Read-Host "Enter number of commits to show"
                    }
                    default { 30 }
                }
                
                Clear-Host
                Write-Host "Last $commitCount commits:`n"
                git log --oneline -n $commitCount
                Write-Host "`nPress Enter to continue..."
                Read-Host
            }
            "2" {
                Clear-Host
                Write-Host "Reflog entries:`n"
                git reflog --date=iso
                Write-Host "`nPress Enter to continue..."
                Read-Host
            }
            "3" {
                return
            }
            default {
                Write-Host "Invalid choice. Press Enter to continue..."
                Read-Host
                continue
            }
        }

        $doReset = Read-Host "`nDo you want to reset to a commit? (y/N)"
        if ($doReset -ne "y") { continue }

        Write-Host "`nReset types:"
        Write-Host "1: Soft  - Keep changes staged"
        Write-Host "2: Mixed - Keep changes unstaged"
        Write-Host "3: Hard  - Discard all changes (WARNING: destroys local changes)"
        Write-Host "4: Cancel"
        
        $resetType = Read-Host "`nChoose reset type"
        if ($resetType -eq "4") { continue }
        
        $commitHash = Read-Host "`nEnter commit hash to reset to (or 'q' to cancel)"
        if ($commitHash -eq 'q' -or [string]::IsNullOrWhiteSpace($commitHash)) {
            Write-Host "Reset cancelled"
            Start-Sleep -Seconds 2
            continue
        }
        
        $resetFlag = switch ($resetType) {
            "1" { "--soft" }
            "2" { "--mixed" }
            "3" { "--hard" }
            default { 
                Write-Host "Invalid choice"
                Start-Sleep -Seconds 2
                continue
            }
        }
        
        if ($resetType -eq "3") {
            $confirm = Read-Host "WARNING: This will permanently delete all changes after commit $commitHash. Continue? (y/N)"
            if ($confirm -ne "y") {
                Write-Host "Reset cancelled"
                Start-Sleep -Seconds 2
                continue
            }
        }
        
        Write-Host "`nExecuting: git reset $resetFlag $commitHash"
        git reset $resetFlag $commitHash
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Reset to commit $commitHash completed successfully"
        } else {
            Write-Host "Error during reset operation"
        }
        
        Write-Host "`nCurrent status:"
        git status
        
        Write-Host "`nPress Enter to return to reset menu..."
        Read-Host
    }
}

function Compare-Branches {
    # First fetch all branches from remote
    Write-Host "Fetching latest branches from remote..."
    git fetch --all

    # Show available branches
    Write-Host "`nAvailable branches (local and remote):"
    git branch -a

    $sourceBranch = Read-Host "`nEnter first branch name"
    $targetBranch = Read-Host "Enter second branch name"
    
    # Validate branches exist
    $sourceExists = git rev-parse --verify $sourceBranch 2>$null
    $targetExists = git rev-parse --verify $targetBranch 2>$null
    
    if (-not $sourceExists -or -not $targetExists) {
        Write-Host "`nError: One or both branches not found. Please check the branch names."
        Write-Host "Note: For remote branches, use 'origin/branchname' format"
        return
    }

    Write-Host "`nShowing diff between ${sourceBranch} and ${targetBranch}:"
    Write-Host "------------------------------------------------`n"
    
    Write-Host "View options:"
    Write-Host "1: Show only file names"
    Write-Host "2: Show files with status (Added/Modified/Deleted)"
    Write-Host "3: Show detailed diff"
    
    $viewChoice = Read-Host "`nChoose view option"
    
    switch ($viewChoice) {
        '1' {
            Write-Host "`nChanged files:"
            git diff --name-only "${sourceBranch}..${targetBranch}"
        }
        '2' {
            Write-Host "`nFiles changed with status:"
            git diff --name-status "${sourceBranch}..${targetBranch}"
        }
        '3' {
            Write-Host "`nDetailed diff:"
            git diff "${sourceBranch}..${targetBranch}"
        }
    }
}

function Show-GitMenu {
    Clear-Host
    Write-Host "================ Git Operations Menu ================"
    Write-Host "1: List all branches"
    Write-Host "2: Switch branch"    
    Write-Host "3: Create and switch to new branch"
    Write-Host "4: Pull latest changes"    
    Write-Host "5: Reset changes"
    Write-Host "6: Stash operations"    
    Write-Host "7: Clean working directory"
    Write-Host "8: View status"    
    Write-Host "9: Push changes"
    Write-Host "10: View commit history"
    Write-Host "11: Overwrite main with backup branch"
    Write-Host "12: Switch Environment (Dev/Prod)"
    Write-Host "13: Overwrite specified branch"
    Write-Host "14: Compare branches (diff)"
    Write-Host "Q: Quit"
    Write-Host "=================================================="
}

# Main loop
do {
    Show-GitMenu
    $selection = Read-Host "Please make a selection"
    switch ($selection) {
        '1' { Get-BranchList }
        '2' { Switch-Branch }
        '3' { New-Branch }
        '4' { git pull }
        '5' { Reset-Changes }
        '6' { Invoke-StashOperations }
        '7' { Clean-WorkingDirectory }
        '8' { git status }
        '9' { Push-Changes }
        '10' {
            Write-Host "`nAll Commits (including local):"
            Write-Host "Format: [Hash] [Date] [Author] [Message] [Branch/HEAD info]"
            Write-Host "--------------------------------------------------------"
            git log --pretty=format:"%h %ad %an %s %d" --date=short --all -n 15
            Write-Host "`n"
            Write-Host "Local unpushed commits on current branch:"
            Write-Host "----------------------------------------"
            $unpushedCommits = git log '@{u}..' --pretty=format:"%h %ad %an %s" --date=short 2>$null
            if ($LASTEXITCODE -ne 0) {
                $unpushedCommits = git log 'origin/main..HEAD' --pretty=format:"%h %ad %an %s" --date=short 2>$null
            }
            if ($LASTEXITCODE -eq 0 -and $unpushedCommits) {
                Write-Host $unpushedCommits
            } else {
                Write-Host "All commits are in sync with remote repository."
            }
        }
        '11' { Reset-ToBackupBranch }
        '12' { Switch-Environment }
        '13' { Overwrite-Branch }
        '14' { Compare-Branches }
    }
    if ($selection -ne 'q') {
        Write-Host "`nPress any key to continue..."
        $null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
    }
} while ($selection -ne 'q')
