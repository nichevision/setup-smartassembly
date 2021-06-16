# setup-smartassembly action

This action installs and activates Red Gate SmartAssembly with a serial number provided by the action user. It places the command line tool ```SmartAssembly.com``` on the system path. The serial number is automatically deactivated on cleanup so that it may be reused.

It is recommended to mount a fileshare where SmartAssembly can save its map files. This path is specified in the SmartAssembly Database in the Information table, under the MapFolderNetworkPath column.

### Requirements:
- A SQL Server database is required for use with SmartAssembly.
- A SmartAssembly Professional license.
- nuget.exe must be on the path before this action runs, in order to retrieve the RedGate.SmartAssembly.Installer package. This can be done by running the ```nuget/setup-nuget@v1``` action before this action.

# Usage

### Basic:
```yaml
steps
    - uses: nichevision/setup-smartassembly@v1
      with:
        connectionstring: 'Data Source=${{ secrets.SMARTASSEMBLY_DATABASE_HOST }};Initial Catalog=${{ secrets.SMARTASSEMBLY_DATABASE_NAME }};uid=${{ secrets.SMARTASSEMBLY_DATABASE_USER }};password=${{ secrets.SMARTASSEMBLY_DATABASE_PASS }};'
        db-server: ${{ secrets.SMARTASSEMBLY_DATABASE_HOST }}
        serial-number: ${{ secrets.SMARTASSEMBLY_SERIAL_NUMBER }}
        version: '7.5.2.4508'

    - shell: powershell
      run: |
        SmartAssembly.com /build <path_to_saproj>
```
