function postProcess(topTC, allTCs) {
    MSG.formatInfo("custom value BV");
    topTC.compileArguments = "-DCUSTOM_VALUE";
    topTC.targetProject = 'top_target';
}
