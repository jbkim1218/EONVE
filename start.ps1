$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
$runtimeRoot = Join-Path $env:USERPROFILE '.cache\codex-runtimes\codex-primary-runtime\dependencies'
$bundledNodeDirectory = Join-Path $runtimeRoot 'node\bin'
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    if (Test-Path -LiteralPath (Join-Path $bundledNodeDirectory 'node.exe')) {
        $env:PATH = $bundledNodeDirectory + ';' + $env:PATH
    } else {
        throw 'Install Node.js 24 and pnpm 11.25.0 first. See README.md.'
    }
}
$packageManagerCommand = Get-Command pnpm -ErrorAction SilentlyContinue
if ($packageManagerCommand) {
    $eonvePackageManager = $packageManagerCommand.Source
} else {
    $eonvePackageManager = Join-Path $runtimeRoot 'bin\fallback\pnpm.cmd'
    if (-not (Test-Path -LiteralPath $eonvePackageManager)) {
        throw 'Install pnpm 11.25.0 first. See README.md.'
    }
}
& $eonvePackageManager install --frozen-lockfile
if ($LASTEXITCODE -ne 0) { throw 'Dependency installation failed.' }
Write-Host 'EONVE: http://127.0.0.1:3000   Admin: http://127.0.0.1:3000/admin'
Get-NetIPConfiguration -ErrorAction SilentlyContinue | Where-Object {
    $_.IPv4DefaultGateway -and $_.NetAdapter.Status -eq 'Up'
} | ForEach-Object {
    foreach ($address in $_.IPv4Address.IPAddress) {
        Write-Host ('Phone (same Wi-Fi): http://' + $address + ':3000')
    }
}
Write-Host 'Press Ctrl+C to stop the server.'
& $eonvePackageManager exec next dev --hostname 0.0.0.0
