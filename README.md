# Atom linter systemverilog
## Intro
This is a atom-linter provider that parses vcs output so that it can be used as a linter. This means it is compatible with everything vcs is, incl. systemverilog, verilog and vhdl.

## Requirements
* A makefile with a silent target ```linter```  (add ```.SILENT: linter``` to the makefile) that:
  1. Prints the directory in which vcs is run. This is necessary as the makefile can ```cd``` into another directory and this directory should be known. This should be the first output of ```make linter```. (For this reason, the target should be silent)
  2. Runs vcs, with ``` 2>&1 || true``` appended to the command so that errors are not considered as a failed linter run.
  3. Is located in the directory of the source (rtl) files, or any parent directory.
* vcs, available in ```PATH```
* python (tested with 3.6), available in ```PATH```
* [Atom text editor](https://atom.io/) with [linter package](https://atom.io/packages/linter) installed. You probably want language packages for your hdl languages as well.

## Installation
1. copy code into atom-vcs-linter subdirectory (create it, or let git do it) of atom's packages directory (linux: ~/.atom/packages)
2. ```cd``` into folder
3. run ```apm``` install. With portable atom, this is available in ```<atom_install_dir>/resources/app/apm/bin```

## TODO
* clean up unused template code
* support more errors and warnings
* support displaying of line-breaks in error messages. This might be something to fix at a higher level (atom-linter / atom).
* normal installation process
## FAQ
* Q: Why is it slow? A: it is about as fast as ```make linter```, so speed up that. If you're not doing already, make sure you use incremental builds with ```vcs```.
* Q: Why do I have to do this complex installation procedure? A: because I don't know how to simplify it and am too lazy to find out. If you know, please tell me or fix it yourself and send a pull request.
* Q: It shows an error/warning/... on the first line of a wrong file, instead of at the correct location mentioned in the error. A: Please file an issue with the output of ```make linter``` (you can strip confidential parts if you want, just make sure the lines with and around the error/warning/... are still in there) and mention where you would like the error/warning/... to be shown (file and line). The code uses general regexes to extract this data, which might fail sometimes as ```vcs``` errors/warnings/... do not follow a strict template that I can parse.
