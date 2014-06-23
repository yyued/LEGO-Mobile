var outline = require('spritesmith-engine-test').outline;

// If we are on Windows, skip over performance test (it cannot handle the long argument string)
if (process.platform === 'win32') {
  delete outline['interpretting a ridiculous amount of images'];
}

module.exports = {
  'gmsmith': outline
};