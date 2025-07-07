function appendValue(tc, fieldName, value) {
  var fieldValue = tc.eval.get(fieldName);

  if (fieldValue == null || fieldValue.trim().length == 0)
    tc.put(fieldName, value);
  else
    tc.put(fieldName, fieldValue + ' ' + value);
}

function postProcess(topTC, allTCs, cppDialect) {
	if (TCF.globals().visualStudio) {
		MSG.formatError('C++ Dialect setting is not supported with Visual Studio compiler');
		return;
	}
	
	let env = java.lang.System.getenv();
	let targetRTS = 'TARGET_RTS_' + cppDialect.replace(/\+/g, 'p');
	let updateTargetRTS = false;
	if (env.get(targetRTS) && env.get(targetRTS) !== '') {
		MSG.formatInfo('TargetRTS location for ' + cppDialect + ' is specified in env, ' + targetRTS + ' = ' + env.get(targetRTS));
		updateTargetRTS = true;
	}

	for (i = 0; i < allTCs.length; ++i) {
		let tc = allTCs[i];
		if (tc.eval.type == CppTransformType.ExternalLibrary)
			continue;
		appendValue(tc, 'compileArguments', '-std=' + cppDialect + ' -pedantic-errors -Wno-long-long');
		if (tc.targetServicesLibraryAutoUpdate !== false && updateTargetRTS)
			tc.targetServicesLibrary = env.get(targetRTS);
	}
}
