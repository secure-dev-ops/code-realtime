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

function getProjectName(tc) {
    let s = tc.getId().split('/');
    if (s.length >= 2)
        return s[s.length - 2];
}

function preProcess(targetPlatform) {
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
        if (tc.getDescriptorId() === TCF.CPP_TRANSFORM) {
            // update make type only for ModelRT TCs (with TCF.CPP_TRANSFORM descriptor)
            // in CoderRT make type is always computed automatically and we do not have compilationMakeType property there
            tc.compilationMakeType = TCF.globals().visualStudio ? MakeType.MS_nmake : MakeType.GNU_make;
        }

        // VxWorks specific settings
        if (tc.targetConfiguration.startsWith('VxWorks')) {
            if (tc.linkArguments)
                tc.linkArguments += ' -static';
            else
                tc.linkArguments = '-static';
        }

        if (tc.targetServicesLibraryAutoUpdate !== false && env.TARGET_RTS_DIR && env.TARGET_RTS_DIR != '') {
            tc.targetServicesLibrary = env.TARGET_RTS_DIR;
        }

        let baseName = getTCJSName(tc);
        if (tc.unitName == null && tc.unitNameAutoUpdate !== false)
            tc.unitName = baseName + '_UnitName';

        if (tc.targetProjectAutoUpdate !== false) {
            tc.targetProject = baseName + '_target';
            // an alternative: tc.targetProject = getTestCaseName(tc) + '_target';
        }
    }
}
