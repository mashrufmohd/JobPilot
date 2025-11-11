# Remove JSX comments from all JS/JSX files
$files = Get-ChildItem -Path "C:\Users\Mashr\Desktop\JobPilot\frontend\src" -Recurse -Include *.js,*.jsx

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    # Remove JSX comments {/* ... */}
    $content = $content -replace '(?s)\s*\{/\*.*?\*/\}\s*\r?\n?', "`n"
    # Remove extra blank lines
    $content = $content -replace '(\r?\n){3,}', "`n`n"
    Set-Content -Path $file.FullName -Value $content -NoNewline
    Write-Host "Processed: $($file.Name)"
}

Write-Host "`nAll comments removed successfully!"
