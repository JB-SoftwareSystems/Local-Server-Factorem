# Server-Factorem
A local server/network creation tool used to create and link servers to resources such as files, databases, webpages, and more.
You can do a lot of things with Server Factorem, namely:

-Make file transfer from your PC to other devices wireless
-Deploy a server with minimal setup
-Make your files accessible from any device connected to your WiFi network (or without, but that will require port forwarding), kind of making a "cloud service"
-Deploy a database within yor server

# Instructions
Setup is very simple for this program, and launching your server is even easier. Just follow the steps below
## GitHub CLI
gh repo clone JB-SoftwareSystems/Local-Server-Factorem
## Download ZIP
Simply download the repository, and extract the contents into a folder.
If you want to install directly into the folder you want to deploy,
just extract the zip into the folder locally, copy all files in /ServerFactorem
locally to your folder.
## Deployement of Server
Server Factorem is very easy to deploy, but there are a few short steps:
1) Install all npm package dependencies listed in Prerequisites
2) Go into servermain.js and change the value of the variable 'ip4' to your private ipv4, so that you can make your server deployable,
   at least in your private network. If you port forward, then it'll become publicly deployed.
3) runserver.bat, run the batch file and your server will be deployed. Your files can be accessed at yourprivateipv4:8080/serverindex2.html,
   and your database can be accessed on yourprivateipv4:8080/dbrequestservice.html (when installed, there will be a sample database, but you
   can change the contents of your database by going into serverdb.json).
You can move around the source files to any folder and run runserver.bat to deploy other folders after this basic setup.

# Prerequisites
This will require many node modules. Run the following npm commands during setup within the folder you're deploying:
npm install taffy (-save, or -g)
npm install create-html (-save, or -g)
npm install jsdom (-save, or -g)
npm install jquery (-save, or -g)

