let custom_value = {
    name: 'custom_value',
    script: 'custom_value.js',
    defaultValue: false,
    description: 'Flag for setting the CUSTOM_VALUE macro'
};

function initBuildVariants(tc) {
    BVF.add(custom_value);
}