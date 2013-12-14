# Starting DB Server
echo -e "Starting database server ...."
mongod --dbpath ./data/ --port 27063 --logpath ./data/mylog.log --fork --smallfiles --oplogSize 50
echo -e "done!"
