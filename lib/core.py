from __future__ import print_function
import sys, os
from subprocess import check_output, CalledProcessError, STDOUT
from os import path
import re


args = sys.argv
filelist=args[1:]
filelist[0] = path.abspath(filelist[0])
searchdir = filelist[0] if path.isdir(filelist[0]) else path.split(filelist[0])[0]
ans=None
while True:
    files = [f for f in os.listdir(searchdir) if path.isfile(path.join(searchdir, f))]
    files = dict([[f.lower(), f] for f in files])
    if 'makefile' in files:
        ans = files['makefile']
        break


    newsearchdir = path.split(searchdir)[0]
    if newsearchdir==searchdir:
        print('\n\n'.join(f +':1:Error:Could not find makefile. Went up to: '+searchdir for f in filelist))
        print('\n\n')
        sys.exit(0)
    searchdir = newsearchdir

os.chdir(searchdir)
try:
    make_output = check_output(['make', 'linter'],stderr=STDOUT).decode()
    lines = make_output.split('\n')
    basedir = lines[0]
    lines=lines[1:]
    i=0
    out = ""
    while i<len(lines):
        #print(lines[i])
        startline=False
        if lines[i].startswith("Error"):
            type = "Error"
            startline=True
        if lines[i].startswith("Warning"):
            type = "Warning"
            startline=True
        if lines[i].startswith("Info"):
            type = "Info"
            startline=True
        if startline:
            #print('parsing')
            message = lines[i] + "\n"
            file = filelist[0]
            line=str(1)
            errorlines = [lines[i]]
            i+=1
            while i<len(lines) and lines[i]!='':
                errorlines.append(lines[i])
                i+=1

            reans = re.search("\s*\"([^\"]+)\"\s*,\s*([0-9]*):(.*)", '\n'.join(errorlines))
            if reans:
                #print('match')
                file = os.path.join(basedir, reans.group(1))
                line = reans.group(2)

            else:
                reans=re.search('\s*The first driver is at \"([^\"]+)\"\s*,\s*([0-9]*):(.*)','\n'.join(errorlines))
                if reans:
                    file=os.path.join(basedir, reans.group(1))
                    line = reans.group(2)


            out += file +":"+line +":"+ type +":"+'\n'.join(errorlines)+"\n\n"
        i+=1
    print(out)

except CalledProcessError as cpe:
    print( '\n\n'.join(f +':1:Error: Error when running \'make linter\': ' + str(cpe.output.decode()) for f in filelist))
    sys.exit(0)
