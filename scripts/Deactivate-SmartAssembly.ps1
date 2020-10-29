[CmdletBinding()]
param()

Write-Verbose "Deactivate SmartAssembly..."

$saComPath = Get-Command "SmartAssembly.com" -ErrorAction Stop

$process = Start-Process -FilePath $saComPath -Args "/deactivateSerial" -PassThru -NoNewWindow -Wait

if ($process.ExitCode -ne 0) {
    Write-Host "::warning::Unable to deactivate SmartAssembly."
}
