[CmdletBinding()]
param(
    [Parameter(Mandatory=$True)]
    [string] $SerialNumber,

    [Parameter(Mandatory=$True)]
    [string] $ConnectionString,

    [Parameter(Mandatory=$True)]
    [string] $DbServer,

    [Parameter()]
    [string] $Version
)

Write-Verbose "Installing SmartAssembly..."

$NugetArgs = [System.Collections.ArrayList] @(
    "install";
    "RedGate.SmartAssembly.Installer";
    "-OutputDirectory";
    ".\";
)

if ($Version) {
    $NugetArgs.Add("-Version") | Out-Null
    $NugetArgs.Add("$Version") | Out-Null
}

nuget.exe @NugetArgs

if (!$?) {
    throw "Failed to install RedGate SmartAssembly with arguments: $NugetArgs"
}

$saExtractPath = ".\RedGate.SmartAssembly.Installer*\tools\"
$saInstallLocation = ".\tools\SA\"
if (!(Test-Path $saInstallLocation)) {
    New-Item -ItemType Directory $saInstallLocation
}
$saInstallLocation = (Get-Item $saInstallLocation).FullName

$msiPath = (Get-ChildItem "$saExtractPath\SmartAssembly_*_x64.msi").FullName

Write-Verbose "Installing SmartAssembly from $msiPath into $saInstallLocation"
$p = Start-Process -FilePath msiexec -Args "/i `"$msiPath`" /qn INSTALLDIR=`"$saInstallLocation`" RG_LICENSE=`"$SerialNumber`" RG_WARNING=`"Ignore`" REBOOT=`"ReallySuppress`" RG_I=`"Red Gate Software Ltd.`"" -Wait -Verbose -PassThru

if ($p.ExitCode -ne 0) {
    throw "SmartAssembly installation failed. Installer exited with code: $($p.ExitCode)"
}

$env:PATH += ";$saInstallLocation"

SmartAssembly.com /settings /dbType="SQLServer" /dbConn="$ConnectionString" /dbServer="$DbServer"

# Github Actions syntax for modifying the system path
# https://docs.github.com/en/actions/reference/workflow-commands-for-github-actions#adding-a-system-path
echo "$saInstallLocation" | Out-File -FilePath $env:GITHUB_PATH -Encoding utf8 -Append
