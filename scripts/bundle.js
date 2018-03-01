'use strict';
const ora = require('ora');
const rm = require('rimraf');
const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const config = require('../config/build.config');
const webpackConfig = require('../webpack.config');
let spinner = ora('Building for production...');
const packageJson = require('../package.json');
const archiver = require('archiver');
const fs = require('fs');

spinner.start();

// step 1: clear build directory
rm(path.join(__dirname, config.outDir), err => {
  if (err) throw err;

  // step 2: build project with webpack
  webpack(webpackConfig, function(err, stats) {
    spinner.stop();
    spinner = ora('Building The Application...');
    console.log('\n');
    spinner.start();
    if (err) throw err;
    process.stdout.write(
      stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false,
      }) + '\n\n',
    );

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'));
      process.exit(1);
    }

    console.log(chalk.cyan('  Build complete.\n'));
    spinner.stop();

    // step 4: archive dist folder as zip
    const packageName = `${packageJson.name}@${
      config.version
    }_${new Date().toLocaleDateString()}_${Math.round(new Date().getTime() / 1000)}.zip`;

    rm(path.join(config.archivesDir, packageName), err => {
      if (err) {
        spinner.stop();
        console.log(chalk.red('  Error While Build.\n' + err));
        throw err;
      }

      if (!fs.existsSync(config.archivesDir)) {
        fs.mkdirSync(config.archivesDir);
      }
      const output = fs.createWriteStream(path.join(config.archivesDir, packageName));
      spinner.stop();
      spinner = ora('Archiving the application...');
      const archive = archiver('zip');
      archive.on('error', err => {
        if (err) throw err;
      });
      archive.on('close', () => {
        console.log(
          chalk.green(`created archive: ${path.join(config.archivesDir, packageName)}\n`),
        );
      });
      archive.pipe(output);
      archive.directory(config.outDir, false);
      archive.finalize();
      console.log(chalk.cyan('  Bundled.\n'));
      spinner.stop();
    });
  });
});
