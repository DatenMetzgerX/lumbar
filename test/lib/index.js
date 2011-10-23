var fs = require('fs'),
    glob = require('glob'),
    path = require('path'),
    wrench = require('wrench');

var counter = 0;
try { fs.mkdirSync('/tmp/lumbar-test', 0755); } catch (err) {}

exports.testDir = function(testName, configFile) {
  var outdir = '/tmp/lumbar-test/' + testName + '-' + path.basename(configFile) + '-' + Date.now() + '-' + (counter++);
  console.log('Creating test directory ' + outdir + ' for ' + configFile);
  fs.mkdirSync(outdir, 0755);
  return outdir;
};
exports.assertExpected = function(outdir, expectedDir, configFile, assert) {
  var expectedFiles = glob.globSync(expectedDir + '/**/*.{js,css}').map(function(fileName) { return fileName.substring(expectedDir.length); }),
      generatedFiles = glob.globSync(outdir + '/**/*.{js,css}').map(function(fileName) { return fileName.substring(outdir.length); });
  assert.deepEqual(generatedFiles, expectedFiles, configFile + ': file list matches');

  generatedFiles.forEach(function(fileName) {
    var generatedContent = fs.readFileSync(outdir + fileName, 'utf8'),
        expectedContent = fs.readFileSync(expectedDir + fileName, 'utf8');
    assert.equal(generatedContent, expectedContent, configFile + ':' + fileName + ': content matches');
  });
};
