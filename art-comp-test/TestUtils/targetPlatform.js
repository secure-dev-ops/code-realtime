function getTCJSName(tc) {
    let tcID = tc.getId();

    tcID = tcID.substring(tcID.lastIndexOf("/") + 1);
    if (tcID.endsWith(".tcjs")) {
      tcID = tcID.substring(0, tcID.length - 5);
    }

    return tcID.replaceAll("%20", "_");
}

function getTestCaseName(tc) {
	let tcID = tc.getId();

	tcID = tcID.substring(0, tcID.lastIndexOf("/"));
	tcID = tcID.substring(tcID.lastIndexOf("/") + 1);

	return tcID.replaceAll("%20", "_");
}

function preProcess( targetPlatform ) {
	MSG.formatInfo("Building for target platform %s", targetPlatform);
	TCF.globals().targetPlatform = targetPlatform;
	TCF.globals().visualStudio = targetPlatform.indexOf('Visual') !== -1;
}

function postProcess(topTC, allTCs, targetPlatform) {
	// If the TargetRTS is specified using an environment variable, set it
	let env = java.lang.System.getenv();
	if (env.TARGET_RTS_DIR && env.TARGET_RTS_DIR != '') {
		MSG.formatInfo("Set up TargetRTS to %s", env.TARGET_RTS_DIR);
	}
	
	for (i = 0; i < allTCs.length; ++i) {
		let tc = allTCs[i];
		tc.targetConfiguration = targetPlatform;

		if (tc.compilationMakeType) {
			// update make type only if it was explicitly set in the TC (relevant only for ModelRT TCs)
			tc.compilationMakeType = TCF.globals().visualStudio ? MakeType.MS_nmake : MakeType.GNU_make;
		}

		if (tc.targetServicesLibraryAutoUpdate !== false && env.TARGET_RTS_DIR && env.TARGET_RTS_DIR != '') {
			tc.targetServicesLibrary = env.TARGET_RTS_DIR;
		}

        let tcjsName = getTCJSName(tc);

        if (tc.unitName == null && tc.unitNameAutoUpdate !== false)
            tc.unitName = tcjsName + '_UnitName';

		if (tc.targetProject == null)
			tc.targetProject = getTestCaseName(tc) + '_target';
		//if (tc.targetProjectAutoUpdate !== false)
			//tc.targetProject = tcjsName + '_target';

        /*
        // Extract project name from the source property and set the target project name based on it
        let tcSources = tc.eval.sources;
        let anySource = null;
        if (tcSources != null && tcSources.length > 0)
            anySource = tcSources[0];
        else if (tc.topCapsule != null)
            anySource = tc.topCapsule;
        
        if (anySource) {
            let s = anySource.split('/');
            if (s.length > 2) {
                tc.targetProject = '/' + s[2] + '_' + tcjsName + '_target';
            }
        } else {
            tc.targetProject = '/' + tcjsName + '_target';
        }
        */

	}
	
}
