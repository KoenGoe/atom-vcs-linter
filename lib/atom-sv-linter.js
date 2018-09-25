'use babel';
'use strict';
/* jshint
 browser: false,
 curly: true,
 esnext: true,
 strict: true
 */
/* jslint
 es6: true,
 fudge: true,
 maxlen: 80,
 single: true,
 -W097
 */
/* global
 atom,
 console
 */
import {
  exec,
} from 'atom-linter';

export function activate() {
  // Fill something here, optional
}

export function deactivate() {
  // Fill something here, optional
}

NamedRegexp=null;

function parse(data, regex) {

  if (NamedRegexp === null) {
    NamedRegexp = require('named-js-regexp');
  }


  var messages = [];
  var compiledRegexp = new NamedRegexp(regex, 'gm');
  var rawMatch = compiledRegexp.exec(data);

  while (rawMatch !== null) {
    var match = rawMatch.groups();
    var severity = match.severity;
    var excerpt = match.excerpt;
    var file = match.file || null;

    var lineStart = parseInt(match.lineStart || match.line || 0);
    var colStart = parseInt(match.colStart || match.col || 0);
    var lineEnd = parseInt(match.lineEnd || match.line || 0);
    var colEnd = parseInt(match.colEnd || match.col || 1);

    messages.push({
      severity: severity.toLowerCase(),
      excerpt: excerpt,
      location:{
        file:file,
        position: [[lineStart-1, colStart], [lineEnd-1, colEnd]]
      }
    });

    rawMatch = compiledRegexp.exec(data);
  }

  return messages;
}

export function provideLinter() {
  return {
    name: 'atom-sv-linter',
    scope: 'project', // or 'project'
    lintsOnChange: false, // or true
    grammarScopes: ['source.verilog', 'source.systemverilog'],
    lint(textEditor) {
      const editorPath = textEditor.getPath()

      /*return parse('/users/micas/kgoetsch/Documents/ddic/alu_probeersel/src/tb.sv:1:Error:testerrorlksjf\nd\n\n',
                   '(?<file>.+?):(?<line>[0-9]+):(?<severity>.+?):(?<excerpt>(?:.|[\n\r])+?)\n\n');
       return [{
         severity:'error',
         location:{
           file:'/users/micas/kgoetsch/Documents/ddic/alu_probeersel/src/tb.sv',
           position: [[0, 0], [0, 1]]
         },
         excerpt:``+out[0].type
       }]*/

      return exec(
        'python',
        [__dirname+'/core.py', textEditor.getPath()],
        {
          stream: 'both',
          throwOnStderr: false,
        }
      ).then((output) => {
        if (output.exitCode != 0) {
          atom.notifications.addError(
            'SV linter failed:\n'+output.stderr,
            {
              detail: output.stdout,
              dismissable: true,
              icon: 'alert',
            }
          );
        }
        //NORMAL CASE
        return parse(output.stdout+'\n\n',
                     '(?<file>.+?):(?<line>[0-9]+):(?<severity>.+?):(?<excerpt>(?:.|[\n\r])+?)\n\n');

      });
    }
  }
}
