
## Installing

{$product.name$} can be installed on top of Visual Studio Code or Eclipse Theia.

The latest version of {$product.name$} is available on the [Visual Studio Marketplace](https://marketplace.visualstudio.com/search?term=%22rtist%20in%20code%22&target=VSCode&category=All%20categories&sortBy=Relevance) and on the [Open VSX Registry](https://open-vsx.org/). To install that version into Visual Studio Code or Eclipse Theia follow these steps:

1) Click "Extensions" in the activity bar to open the Extensions view.

![](images/extensions_in_sidebar.png)

2) Type "rtist" in the search field.

3) Click the "Install" button to install the {$product.name$} extension

![](images/rtistic_ce_extension.png)

Once the installation is finished you will see {$product.name$} appear in the "Installed" section of the Extensions view:

![](images/installed_extension.png)

The screenshot above also shows that an extension for working with C/C++ has been installed. See [Setup C++ Build Tools](#setup-c-build-tools) for more information.

After you have installed {$product.name$} it's recommended to restart Visual Studio Code or Eclipse Theia, or at least to perform the command `Developer: Reload Window` which is available in the Command Palette (++ctrl+shift+"P"++).

### Install from VSIX
Another way to install {$product.name$} is to use a .vsix file. This can be useful if you want to install another version than the latest. You can download .vsix files for all released versions of {$product.name$} from both the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=HCLTechnologies.hcl-rtistic-ce) and the [Open VSX Registry](https://open-vsx.org/). Once you have downloaded the .vsix file follow these steps to install it:

1) If you already have a version of {$product.name$} installed, you can manually uninstall it first (see [Uninstalling](#uninstalling)). Note that this step is usually not required since the newly installed version of the extension will automatically replace the old one.

2) Open the menu of the Extensions view and select the command "Install from VSIX". 

![](images/vsix_install.png)

3) In the file dialog that appears, select the .vsix file to install.

If the installation completes successfully you should see the following message (the "Reload Now" button will only show if you already had another version of {$product.name$} installed):

![](images/vsix_installation_completed.png)

If instead the installation fails, this message will tell you the reason. One common reason for failure is that your version of Visual Studio Code or Eclipse Theia is not compatible (i.e. too old) for {$product.name$}.

It should also be noted that it's possible to directly install any published version of {$product.name$} by using the "Install Another Version" command that is available in the context menu of an extension shown in the "Installed" section.

### Viewing Installation Information
If you are unsure about which version of {$product.name$} you have installed, you can see the version in the extension's tooltip, and the full build version is available in the page that appears if you double-click the extension:

![](images/extension_tooltip.png)

You can also see the version and the exact date of the installed {$product.name$} in the Changelog that is present on the extension's page. There you can also see what has been fixed and improved compared to older releases.

![](images/extension_changelog.png)

### Portable Mode Installation
You can install multiple versions of {$product.name$} by using the portable mode of Visual Studio Code. See [Portable Mode](https://code.visualstudio.com/docs/editor/portable) for how to install Visual Studio code in portable mode, which will allow you to install a version of {$product.name$} that won't affect other Visual Studio Code installations on the machine. Portable mode also allows to move or copy an installation from one machine to another, which makes it useful in scenarios where installs should be centralized in an organization.

### Post-Installation Configuration
After a successful installation you need to perform a few configuration steps before you can start to use {$product.name$}.

#### Setup Java
{$product.name$} uses a Java language server and hence needs a Java Virtual Machine (JVM). It's required to use a Java 17 JVM. If an appropriate JVM cannot be found when the {$product.name$} extension is activated (which for example happens the first time you open an Art file), you will receive an error message.

{$product.name$} follows the steps below in priority order when it looks for an appropriate JVM to use:

1) The configuration setting `rtistic.languageServer.jvm` is examined. If it specifies a path to a JVM it will be used. You can edit this configuration setting by invoking **File - Preferences - Settings** and then type the configuration setting id mentioned above in the filter box. This setting needs to be edited in the `settings.json` file.

![](images/jvm_setting.png)

2) The environment variable `JAVA_HOME` is examined. If it specifies a path to a JVM it will be used.
   
3) An attempt is made to launch the `java` command without using a path. The first JVM found in the system path, if any, will be used.

When the {$product.name$} extension is activated information about which Java that is used is printed to the Art Server output channel.

![](images/art-server-log.png)

You may also need to adjust the arguments for the JVM. By default the JVM is launched with the below arguments:

`-Xverify:none -Xmx4024m`

To change the JVM arguments set the configuration setting `rtistic.languageServer.jvmArgs`.

#### Setup License
If you want to use all features of {$product.name$} you need a license. The {$product.name$} Community Edition doesn't require a license, but can on the other hand not be used for commercial purposes.

#### Setup C++ Build Tools
When {$product.name$} builds generated C++ code it uses C++ build tools such as a make tool, a C++ compiler, a C++ linker etc. These tools need to be in the path when you start Visual Studio Code or Eclipse Theia. If you have multiple C++ build tools installed, make sure the correct ones are present in the path before launching Visual Studio Code or Eclipse Theia. For example, if you use the Microsoft C++ compiler, it's recommended to launch from a Visual Studio native tools command prompt with the correct version (e.g. 32 bit or 64 bit). Build errors caused by inconsistent versions of C++ build tools being used can be tricky to find.

You also need to install an extension for C/C++ development into Visual Studio Code or Eclipse Theia. [C/C++ for Visual Studio Code](https://code.visualstudio.com/docs/languages/cpp) is recommended.

## Uninstalling
To uninstall {$product.name$} follow these steps:

1) Click "Extensions" in the left side-bar.

![](images/extensions_in_sidebar.png)

2) Find the {$product.name$} extension in the "Installed" section, right-click on it, and select the command "Uninstall".

![](images/uninstall.png)

Once the uninstallation is finished you will no longer see {$product.name$} in the "Installed" section.
