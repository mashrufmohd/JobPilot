# Remove comments from backend JavaScript files
$files = Get-ChildItem -Path "C:\Users\Mashr\Desktop\JobPilot\backend\src" -Recurse -Include *.js

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Remove JSDoc style comments /** ... */
    $content = $content -replace '(?s)/\*\*.*?\*/', ''
    
    # Remove single line comments that start with *
    $content = $content -replace '(?m)^\s*\*\s.*$', ''
    
    # Remove multi-line comments /* ... */
    $content = $content -replace '(?s)/\*.*?\*/', ''
    
    # Remove extra blank lines (3 or more blank lines become 2)
    $content = $content -replace '(\r?\n){4,}', "`n`n`n"
    
    Set-Content -Path $file.FullName -Value $content -NoNewline
    Write-Host "Processed: $($file.Name)"
}

Write-Host "`nAll backend comments removed successfully!"
