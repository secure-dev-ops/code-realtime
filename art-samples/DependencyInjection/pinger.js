function postProcess(topTC, allTCs, speed) {   
	let def = (topTC.targetConfiguration && topTC.targetConfiguration.indexOf('Visual') != -1) ? '/D' : '-D'; 
	let compileFlag = ' ' + def + 'FAST_PINGER ';
	if (speed == 'fast') {
		if (topTC.compileArguments) 
			topTC.compileArguments += compileFlag;
		else
			topTC.compileArguments = compileFlag;
			
		MSG.formatInfo("Compile arguments: '%s'", topTC.compileArguments);
	}
}