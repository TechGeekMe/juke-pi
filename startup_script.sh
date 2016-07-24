echo "Restarting Mongod server"
sudo mongod --shutdown 2>>/dev/null 1>>/dev/null
sudo mongod --fork --logpath /.mongo.log & 2>>/dev/null 1>>/dev/null
sleep 3

echo "Clearing previous uploads"
cd uploads/
rm -f *.mp3
cd ..

echo "Restarting MPD serivice"
sudo service mpd stop 2>> /dev/null
sudo mpd --kill 2>> /dev/null
sudo mpd .mpdconf 2>> /dev/null

echo "Clearing mongodb"
mongo jukepi --eval "db.songs.remove({})"

echo "Setting single mode and comsume on"
mpc single on 2>>/dev/null 1>>/dev/null
mpc consume on 2>>/dev/null 1>>/dev/null

echo "Starting Node server"
nodejs index.js
