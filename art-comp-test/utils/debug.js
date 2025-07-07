function postProcess(topTC, allTCs) {
	for (i = 0; i < allTCs.length; ++i) {
		let tc = allTCs[i];
		tc.compileArguments = '$(DEBUG_TAG)';
		if (TCF.globals().visualStudio) {
			tc.linkArguments = '/DEBUG';
		}	
	}
}
