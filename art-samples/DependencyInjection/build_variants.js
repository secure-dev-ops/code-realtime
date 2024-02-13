let pinger = {
    name: 'Pinger',
    alternatives: [
      { name: 'Slow',  script: 'pinger.js', args: ['slow'],  description: 'Slow pings (2 sec intervals)', defaultValue: true },
      { name: 'Fast',  script: 'pinger.js', args: ['fast'],  description: 'Fast pings (0.5 sec intervals)'}
    ]
};

let logger = {
    name: 'Logger',
    alternatives: [
      { name: 'Without timestamps',  script: 'logger.js', args: ['without'],  description: 'Log without timestamps', defaultValue: true },
      { name: 'With timestamps',  script: 'logger.js', args: ['with'],  description: 'Log with timestamps'}
    ]
};

function initBuildVariants(tc) {
    BVF.add(pinger);
    BVF.add(logger);
}
