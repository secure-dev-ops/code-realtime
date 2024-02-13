function postProcess(topTC, allTCs, timestamps) {   
	let def = (topTC.targetConfiguration && topTC.targetConfiguration.indexOf('Visual') != -1) ? '/D' : '-D'; 
	let compileFlag = ' ' + def + 'TIMESTAMP_LOGGER ';
	if (timestamps == 'with') {
		if (topTC.compileArguments)
			topTC.compileArguments += compileFlag;
		else
			topTC.compileArguments = compileFlag;
			
		MSG.formatInfo("Compile arguments: '%s'", topTC.compileArguments);
	}
}