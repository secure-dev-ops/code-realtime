let targetPlatform = {
  name : 'Target Platform',
  alternatives: [
	  { 
		  name: 'WinT.x64-VisualC++-17.0',
		  script: 'targetPlatform.js',
		  args: ['WinT.x64-VisualC++-17.0'],
		  defaultValue: true,
		  description: 'Windows 64bit with Visual Studio 2022'
	  },
	  { 
		  name: 'WinT.x86-VisualC++-17.0',
		  script: 'targetPlatform.js',
		  args: ['WinT.x86-VisualC++-17.0'],
		  description: 'Windows 32bit with Visual Studio 2022'
	  },
	  { 
		  name: 'WinT.x64-MinGw-12.2.0',
		  script: 'targetPlatform.js',
		  args: ['WinT.x64-MinGw-12.2.0'],
		  description: 'Windows 64bit with MinGw 12.2'
	  },
	  { 
		  name: 'LinuxT.x64-gcc-12.x',
		  script: 'targetPlatform.js',
		  args: ['LinuxT.x64-gcc-12.x'],
		  description: 'Linux 64bit with GCC 12'
	  },
	  {
		name: 'WinT.x64-Clang-16.x',
		script: 'targetPlatform.js',
		args: ['WinT.x64-Clang-16.x'],
		description: 'Windows 64bit with Clang 16'
	}
  ]
}

function initBuildVariants(tc) {
	BVF.add(targetPlatform);
}
