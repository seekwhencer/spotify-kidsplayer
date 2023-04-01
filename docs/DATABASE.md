# spotify-kidsplayer | *Database* | [back](https://github.com/seekwhencer/spotify-kidsplayer/blob/master/README.md)

## Run
```bash
docker-compose -f docker-compose-mysql.yml up -d
```
## First run
- After the first run, import from the file: `mysql/structure.sql`
- Run on the docker host:
```bash
chmod +x ./dbSetup.sh
./dbSetup.sh
```
- This creates the needed tables