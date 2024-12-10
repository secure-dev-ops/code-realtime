function postProcess(topTC, allTCs, speed) {   
	for (i = 0; i < allTCs.length; ++i) {
		let tc = allTCs[i];
		let def = (tc.targetConfiguration && tc.targetConfiguration.indexOf('Visual') != -1) ? '/D' : '-D'; 
		let compileFlag = ' ' + def + 'FAST_PINGER ';
		if (speed == 'fast') {
			if (tc.compileArguments) 
				tc.compileArguments += compileFlag;
			else
				tc.compileArguments = compileFlag;
				
			MSG.formatInfo("Compile arguments: '%s'", tc.compileArguments);
		}
	}
}