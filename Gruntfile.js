/*
 * Copyright (c) 2014-2023 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

'use strict'

module.exports = function (grunt) {
  const os = grunt.option('os') || process.env.PCKG_OS_NAME || ''
  const platform = grunt.option('platform') || process.env.PCKG_CPU_ARCH || ''
  const node = grunt.option('node') || process.env.nodejs_version || process.env.PCKG_NODE_VERSION || ''

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    replace_json: {
      manifest: {
        src: 'package.json',
        changes: {
          'engines.node': (node || '<%= pkg.engines.node %>'),
          os: (os ? [os] : '<%= pkg.os %>'),
          cpu: (platform ? [platform] : '<%= pkg.cpu %>')
        }
      }
    },

    compress: {
      pckg: {
        options: {
          mode: os === 'linux' ? 'tgz' : 'zip',
          archive: 'dist/<%= pkg.name %>-<%= pkg.version %>' + (node ? ('_node' + node) : '') + (os ? ('_' + os) : '') + (platform ? ('_' + platform) : '') + (os === 'linux' ? '.tgz' : '.zip')
        },
        files: [
          {
            src: [
              'LICENSE',
              '*.md',
              'package.json',
              'ctf.key',
              'swagger.yml',
              'server.ts',
              'config.schema.yml',
              'build/**',
              '!build/reports/**',
              'config/*.yml',
              'data/*.ts',
              'data/static/**',
              'data/chatbot/.gitkeep',
              'encryptionkeys/**',
              'frontend/dist/frontend/**',
              'frontend/src/**/*.ts',
              'ftp/**',
              'i18n/.gitkeep',
              'lib/**',
              'models/*.ts',
              'node_modules/**',
              'routes/*.ts',
              'uploads/complaints/.gitkeep',
              'views/**'
            ],
            dest: 'juice-shop_<%= pkg.version %>/'
          }
        ]
      }
    }
  })

  grunt.registerTask('checksum', 'Create .sha256 checksum files', function () {
    const fs = require('fs')
    const crypto = require('crypto')
    fs.readdirSync('dist/').forEach(file => {
      const buffer = fs.readFileSync('dist/' + file)
      const sha256 = crypto.createHash('sha256')
      md5.update(buffer)
      const sha256Hash = sha256.digest('hex')
      const sha256FileName = 'dist/' + file + '.sha256'
      grunt.file.write(sha256FileName, sha256Hash)
      grunt.log.write(`Checksum ${sha256Hash} written to file ${sha256FileName}.`).verbose.write('...').ok()
      grunt.log.writeln()
    })
  })

  grunt.loadNpmTasks('grunt-replace-json')
  grunt.loadNpmTasks('grunt-contrib-compress')
  grunt.registerTask('package', ['replace_json:manifest', 'compress:pckg', 'checksum'])
}
