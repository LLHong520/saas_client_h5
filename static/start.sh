#! /bin/bash
kill 9 `netstat -ntpl | grep :46000 |awk '{print $NF}' | awk -F '/' '{print $1}' | xargs`
echo "kill 46000 process is done"
npm run release:development
exit
echo "all done"
