# than-average

This is hosted on Digital Ocean as a Dokku instance on a droplet.

It runs Postgres as the database, and a node server using express as the main application, with typeorm acting as the api between the two.

It responds to two endpoints. 
 
- GET on backstuff.thanaverage.xyz/questions, which gives a list of questions in the form of an array.
- POST on backstuff.thanaverage.xyz/answer which allows people to submit answers to questions.

## Run locally

### First install
You'll need to get a local postgres db up and running. This is can be done with
```
docker-compose up -d
npm i
npm run typeorm -- schema:sync
```

### Run
```
npm run build
npm run start
# Open another terminal
curl http://localhost:5000/questions
```
You should see a list of questions.

```
[[1,"Do you walk faster","I'm faster","I'm slower","walk faster","walk slower",3697,2658,1039],[11,"Are you better at washing up dishes","I'm better","I'm worse","are better at washing up","are worse at washing up",5155,2497,2658],[12,"Are you more curious","I'm more","I'm less","are more curious","are less curious",5386,4503,883],[5,"Are you smarter","I'm smarter","I'm less smart ","are smarter","are less smart",5257,4490,767],[13,"Are you happier","I'm happier","I'm less happy","are happier","are less happy",5209,2582,2627],[16,"Are you more conservative","I'm more","I'm less","are more conservative","are less conservative",5334,963,4371],[17,"Do you complain more","I complain more","I complain less","complain more","complain less",5352,2247,3105],[9,"Do you smell better","I smell better","I smell worse","smell better","smell worse",5175,2705,2470],[49,"Do you have more friends ","I have more","I have less","have more friends","have fewer friends",4352,920,3432],[19,"Do you have a better music taste","It's better","It's worse","have a better music taste","have a worse music taste",6248,3124,3124],[20,"Do you give better gifts","they're better","they're worse","give better gifts","give worse gifts",5028,1906,3122],[21,"Are you a better friend","I'm better","I'm worse","are a better friend","are a worse friend",5305,2481,2824],[10,"Are you a better communicator","I'm better","I'm worse","are a better communicator","are a worse communicator",5291,2746,2545],[6,"Are your feet looking better","they're better","they're worse","have better looking feet","have worse looking feet",5085,2256,2829],[2,"Do you eat healthier food","healthier","less healthy","eat healthier","eat less healthy",5155,2369,2786],[24,"Are you more interesting","I'm more","I'm less","are more interesting","are less interesting",4980,2314,2666],[25,"Are you better at your work","I'm better","I'm worse","are better at their work","are worse at their work",5028,3302,1726],[26,"Are you more ambitious","I'm more","I'm less","are more ambitious","are less ambitious",5244,2201,3043],[27,"Are you more creative","I'm more","I'm less","are more creative","are less creative",5289,2658,2631],[28,"Are you better at sex","I'm better","I'm worse","are better at sex","are worse at sex",3340,1350,1990],[29,"Are you more patient","I'm more","I'm less","are more patient","are less patient",5046,3133,1913],[23,"Are you better looking","I'm better","I'm worse","are better looking","are worse looking",5347,2659,2688],[30,"Do you have better dental hygiene","better","worse","have better dental hygiene","have worse dental hygiene",4701,1968,2733],[31,"Do you procrastinate more","more","less","procrastinate more","procrastinate less",4558,3476,1082],[7,"Are you a better listener","I'm better","I'm worse","are a better listener","are a worse listener",5214,3244,1970],[32,"Are you a better driver","I'm better","I'm worse","are a better driver","are a worse driver",4594,2947,1647],[33,"Did you have a better childhood","it was better","it was worse","had a better childhood","had a worse childhood",4439,3190,1249],[34,"Are you a better hugger","I'm better","I'm worse","are a better hugger","are a worse hugger",4367,2234,2133],[36,"Are you better at maths","I'm better","I'm worse","are better at maths","are worse at maths",4578,2997,1581],[38,"Are you more narcissistic","I'm more","I'm less","are more narcissistic","are less narcissistic",4745,1644,3101],[39,"Are you more stereotypically your gender","I'm more","I'm less","are more stereotypically their gender","are less stereotypically their gender",4734,1410,3324],[40,"Do you have a better memory","it's better","it's worse","have a better memory","have a worse memory",4659,2120,2539],[41,"Are you more humble","I'm more","I'm less","are more humble","are less humble",4483,2556,1927],[42,"Are you better at cooking","I'm better","I'm worse","are better at cooking","are worse at cooking",4222,2204,2018],[43,"Do you change your bed sheets more","more","less","change their bed sheets more","change their bed sheets less",4491,961,3530],[44,"Do you have more common sense","I have more","I have less","have more common sense","have less common sense",4405,3633,772],[45,"Are more confident ","I'm more","I'm less","are more confident","are less confident",4581,1926,2655],[46,"Do you exercise more","more","less","exercise more","exercise less",4516,1556,2960],[47,"Do you read more","more","less","read more","read less",4342,1749,2593],[48,"Do you sleep more","more","less","sleep more","sleep less",4452,1966,2486],[50,"Are you healthier","I'm healthier","I'm less healthy","are healthier","are less healthy",4354,2347,2007],[51,"Are you more religious","I'm more","I'm less","are more religious","are less religious",4347,390,3957],[52,"Are you more optimistic","I'm more","I'm less","are more optimistic","are less optimistic",2757,1373,1384],[18,"Do you give more to homeless  people","I give more","I give less","give more to homeless people","give less to homeless people",4925,783,4142],[35,"Are you funnier","I'm funnier","I'm less funny","are funnier","are less funny",4382,2736,1646],[4,"Are you better at keeping your home tidy","I'm better","I'm worse","are better at keeping their home tidy","are worse at keeping their home tidy",5129,1874,3255],[14,"Are you kinder","I'm kinder","I'm less kind","are kinder","are less kind",5210,3703,1507],[22,"Are you more progressive","I'm more","I'm less","are more progressive","are less progressive",5020,3937,1083],[15,"Do you have better ideas","they're better","they're worse","have better ideas","have worse ideas",5208,3481,1727],[8,"Are you more privileged","I'm more","I'm less","are more privileged","are less privileged",5197,4374,823],[37,"Do you spend more time on your phone","more","less","spend more time on their phone","spend less time on their phone",4551,2451,2100],[3,"Do you care more about the environment","I care more","I care less","care more about the environment","care less about the environment",5265,3452,1813]]
```

## Updating code remotely
Dokku is heroku-ish. You git push your repository to it, it will build it automatically and then run.

To set this up:

1. Add your SSH key to droplet
```
ssh-copy-id root@backstuff.thanaverage.xyz
# Validate it works. This should not ask you for a password:
ssh root@backstuff.thanaverage.xyz
```
2. Add your ssh key to the dokku instance
```
cat ~/.ssh/id_rsa.pub | ssh root@backstuff.thanaverage.xyz "sudo sshcommand acl-add dokku <write-here-a-computer-name>"
# Validate it works:
ssh dokku@backstuff.thanaverage.xyz 

Primary help options, type "dokku COMMAND:help" for more details, or dokku help --all to see all commands.
Commands:

    apps                     Manage apps
... etc
```
3. Add a remote to your git project locally. This allows you to push your git project to the server
```
git remote add dokku dokku@backstuff.thanaverage.xyz:backend
```
4. Push your changes to the dokku server
```
git push dokku master
```

## Updating database remotely
1. ssh into Droplet
```
ssh root@backstuff.thanaverage.xyz
```
2. Expose the postgres server so you can connect to it externally, and get the port
```
dokku postgres:expose database
-----> Service your-database-db exposed on port(s) 17825
```
3. Get the username and password of the postgres server
```
dokku postgres:info database
#Look at the dns entry for the string of form
[database type]://[username]:[password]@[host]:[port]/[database name]
```

4. Install pgadmin on your computer https://www.pgadmin.org/download/
5. Open pgadmin and enter the details username (from step 3), password (from step 3), hostname (backstuff.thanaverage.xyz) and port (from step 2). Click connect
6. Go to pgadmin -> database -> schema -> public -> tables -> question. Right click -> view/edit data -> all rows.
7. Here you can edit the data :)


