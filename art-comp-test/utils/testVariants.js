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
		  name: 'LinuxT.x64-gcc-4.x',
		  script: 'targetPlatform.js',
		  args: ['LinuxT.x64-gcc-4.x'],
		  description: 'Linux 64bit with GCC 4 (for testing with old TargetRTS from 11.0_2020.22)'
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
	  },
	  {
		name: 'MacT.x64-Clang-14.x',
		script: 'targetPlatform.js',
		args: ['MacT.x64-Clang-14.x'],
		description: 'MacOS 64bit with Clang 14'
	  },
	  {
		name: 'MacT.AArch64-Clang-15.x',
		script: 'targetPlatform.js',
		args: ['MacT.AArch64-Clang-15.x'],
		description: 'MacOS AArch64 with Clang 15'
	  },
	  {
		name: 'VxWorks7T.simnt-Clang-15.x',
		script: 'targetPlatform.js',
		args: ['VxWorks7T.simnt-Clang-15.x'],
		description: 'VxWorks simulator with WindRiver Clang 15'
	  }
  ]
}

let debug = {
  name: 'Debug',
  script: 'debug.js',
  description: 'Set if the test application should be debugged',
  defaultValue: false
}

let cppDialect = {
	name: 'C++ Dialect',
	alternatives: [
		{
			name: 'Default',
			defaultValue: true,
			description: 'Latest version of C++ supported by compiler'
		},
		{
			name: 'C++ 98 (ANSI)',
			script: 'cppDialect.js',
			args: [ 'c++98' ],
			description: 'The 1998 ISO C++ standard plus the 2003 technical corrigendum and some additional defect reports (-std=c++98)'
		}
	]
}

function initBuildVariants(tc) {
	BVF.add(targetPlatform);
	BVF.add(cppDialect);
	BVF.add(debug);
}
