# Part 4 project
This page contains all the information you will need in oredr to setup our Facebook clone, from scratch.
The project is split into 4 repositories:
1) This repository which contains the main server our apps use
2) The react repository: https://github.com/orijer/AdvancedSystemsProgrammingProject_2_WEB
3) The android repository: https://github.com/orijer/AdvancedSystemsProgrammingProject_2_ANDROID
4) The bloom filter repository: https://github.com/harel-creator/project2024

This server, which we also refer to as the main server, allows connections from users using the specified api we had in the assignment, which the android app uses, and the react part which we already built and put in here uses. 

This server also connects to the bloom filter server, which we wrote in c++ as a tcp linux server. It is used during each post and comment creation/change, to make sure no link to a blacklisted website is allowed.

# Setup
We first download the bloom filter repository (in linux!) and this repository.

## BloomFilter Server
We go to bloomFilter folder, then to src folder where we run the following line in terminal (can also be found in the readme file):

`g++ -o server ./TCP_Server/TCPEchoServer.cpp ./BloomFilter.cpp ./BloomFilterApp.cpp ./HashFunc.cpp ./HelpFunctions.cpp ./NumHashFunc.cpp ./VectorBlacklist.cpp ./SetupParser.cpp`

![1](https://github.com/orijer/AdvancedSystemsProgrammingProject_3_Server/assets/73998172/62433c3e-3b63-408d-8157-3c9c80b19476)

It will output a file named server that you can run with ./server
![2](https://github.com/orijer/AdvancedSystemsProgrammingProject_3_Server/assets/73998172/ad2967a0-7b2e-49f9-8bb5-c6b48aeb6d62)

The bloomfilter server is now up and running in port 5555.

## Main Server
Now, in order to run the main server we first need to give it the ip address of the linux machine that runs the bloom filter server.
In the server folder there is config folder with a file name .env in it.
In this file change the variable `BLOOMFILTER_IP` (the first line) to the ip of the linux machine that runs the bloom filter server (use ifconfig to find it).
Step back one directory and follow the orders in the readme (do: npm install, and then: node app.js)

![3](https://github.com/orijer/AdvancedSystemsProgrammingProject_3_Server/assets/73998172/7cca058e-0542-470c-9f84-f2dfd15ded30)
The server is now ready to go at port 80. You can also see that this server has successfully connected to the bloomFilter server.

![4](https://github.com/orijer/AdvancedSystemsProgrammingProject_3_Server/assets/73998172/6eff3152-31a8-4dc9-ab1e-d75abf5d2218)

* Note: There are more advanced features in the .env file inside the config folder, like settings for the bloomfilter server.

If you want, you can also use our dockerhub in order to run the main server. Type: `sudo docker pull orijer/project2024:latest` and wait for it to download everything. When it finishes, run the docker container using: `sudo docker run -p 5555:5555 -d orijer/project2024:latest`. this will output a value in hex when it finishes, copy it. lets called that value \<ip>. Now type `sudo docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' <ip>`. This will output an ip address. Go to the .env file in the main server copy ad change the BOOMFILTER_IP to this value. Now you can run the main server like before. Note that you might not need sudo ta all, but I did. When you are done with the bloomfilter server, type `sudo docker stop <ip>`. 
![docker1](https://github.com/orijer/AdvancedSystemsProgrammingProject_3_Server/assets/65181366/2920cc3b-21f3-4e58-8d56-06e5e510508f)
![docker2](https://github.com/orijer/AdvancedSystemsProgrammingProject_3_Server/assets/65181366/054c3bf7-89d7-4434-8c5d-084bb5a44fca)
![docker3](https://github.com/orijer/AdvancedSystemsProgrammingProject_3_Server/assets/65181366/b17bf6d0-3af5-4f3e-8f9e-27ba60b9a599)


### fill the databases
But ho, no! We have no data in the server yet! Don't you worry- we got you.
We included two databases you can add, one for users and one for posts (if you use the posts, you must also use the users!).
With a tool like mongoDBCompass you can connect to the database and import the test databases from the server folder.
They are called `test.posts` and `test.users` (should be clear which is which).
So, you import them and get something like this:

![5](https://github.com/orijer/AdvancedSystemsProgrammingProject_3_Server/assets/73998172/3b7e0fe6-96b3-4c78-bc1b-1aeff29ffcad)

## React app
You can now enter localhost in the machine that runs the main server, in the search bar of your browser of choice, and be greeted with our great react app.

Choose one of the users we created just for you, or create one of your on to login.
I use orijer (password abc123456) for now, and I will show how to create a new user later.
![7](https://github.com/orijer/AdvancedSystemsProgrammingProject_3_Server/assets/73998172/81534372-597e-40da-8a46-19a12d9665a7)
and you see the feed.

You can add new posts by clicking on the `על מה אתם חושבים` button, which will open this window:

![9](https://github.com/orijer/AdvancedSystemsProgrammingProject_3_Server/assets/73998172/7c5db178-d19a-49a9-886f-ce1e4ed91d64)
![10](https://github.com/orijer/AdvancedSystemsProgrammingProject_3_Server/assets/73998172/c263f850-cfd4-41e2-be6d-8b69940fe6e9)

You can also edit and delete your own posts by clicking on the 3 points button on the left of your posts:

![18](https://github.com/orijer/AdvancedSystemsProgrammingProject_3_Server/assets/73998172/cd5f6d6d-15a1-446d-95d6-bffa48e742b5)
![19](https://github.com/orijer/AdvancedSystemsProgrammingProject_3_Server/assets/73998172/8e023a2e-8f4f-4c4f-aeaa-57ce32796ab6)
![20](https://github.com/orijer/AdvancedSystemsProgrammingProject_3_Server/assets/73998172/6f3e9d56-3a21-48c6-bc8f-6a1cc61dd90f)
![21](https://github.com/orijer/AdvancedSystemsProgrammingProject_3_Server/assets/73998172/6e2de8bc-7ee6-4662-8af2-981e40c33877)

You can add or remove likes to posts, and get live visual feedback:

![11](https://github.com/orijer/AdvancedSystemsProgrammingProject_3_Server/assets/73998172/eebac865-d0f7-448d-ab60-0590830b84f8)

![12](https://github.com/orijer/AdvancedSystemsProgrammingProject_3_Server/assets/73998172/52a05e84-c290-4e75-b3f5-ac5742044ad5)

You can add comments on every post, and join various discussions:
![13](https://github.com/orijer/AdvancedSystemsProgrammingProject_3_Server/assets/73998172/89e5e207-deb8-40be-b65b-90a361c0f88f)

You can also remove comments or edit them, by clicking on the 3 dots at the left of a comment you posted:

![14](https://github.com/orijer/AdvancedSystemsProgrammingProject_3_Server/assets/73998172/c2cedd35-11f4-416e-961e-12813197be9a)
![15](https://github.com/orijer/AdvancedSystemsProgrammingProject_3_Server/assets/73998172/98eab231-e732-422a-9eec-305a7da5ee1d)

To see my posts you can click on your profile picture, on the right above above the feed button.

If I see someone, I can send them a friend request by clicking on their picture, and then pressing `שליחת בקשת חברות`. If they accept your request, you will be able to see all the posts they posted simply by clicking on a post they created.

![16](https://github.com/orijer/AdvancedSystemsProgrammingProject_3_Server/assets/73998172/cd0c3e5d-e83e-4543-ab5f-ea23570b2924)

Click the "חברים" button to see your friends and incoming friend requests. You can of course accept or reject incoming friend requests, and unfriend any of your friends:

![17](https://github.com/orijer/AdvancedSystemsProgrammingProject_3_Server/assets/73998172/8d83b176-34f5-4729-8c20-7300442f1ae9)

You can also logout by clicking your profile picture at the top left and clicking on `התנתק`(but i'm not sure why someone will ever want to do so):

![22](https://github.com/orijer/AdvancedSystemsProgrammingProject_3_Server/assets/73998172/beff87b4-ae3e-405b-bc0b-df9205becaf6)

Lets do that and go over how to create a new user:
enter a username, which will only appear to you. Other users will see you as the name you chose in the show name, below the username.
choose a good password, must contains both letters and numbers, and be at least 8 characters long. You must also choose a profile picture.
![23](https://github.com/orijer/AdvancedSystemsProgrammingProject_3_Server/assets/73998172/f3d6a751-4729-4edd-bf7f-c1272f8ebdef)
![24](https://github.com/orijer/AdvancedSystemsProgrammingProject_3_Server/assets/73998172/2d09d35d-fe5f-4262-9d7a-86fa7d5cc96f)

If you are unhappy with your current showname or password, you can change them by clicking on your profile ppicture at the top left, and click on `הגדרות`:

![25](https://github.com/orijer/AdvancedSystemsProgrammingProject_3_Server/assets/73998172/9ceeb637-82c0-410d-9a81-1edef1af55e5)
![26](https://github.com/orijer/AdvancedSystemsProgrammingProject_3_Server/assets/73998172/14695f8c-c014-4a8a-b912-f56f8180dedc)

So the next time I'll try to login I'll have to use the new password.

If bright colors are not for you, you might consider switching to the dark theme, by clicking on the small switch at the top of the screen.

![27](https://github.com/orijer/AdvancedSystemsProgrammingProject_3_Server/assets/73998172/ecd09bdc-150a-42dd-b29c-37eb4f257add)

What you can't do is edit or delete posts of other users, or add to a post or to a comment a blaclisted URL.
You can see the URL that we defind as blocked in the .env file we mentioned earlier.
For instance, lets try to add the url "http://ynet.co.il" to a post or comment (create new or edit):


![28](https://github.com/orijer/AdvancedSystemsProgrammingProject_3_Server/assets/73998172/bc64f6ae-f7d8-469b-8012-3a43bf320f01)
![29](https://github.com/orijer/AdvancedSystemsProgrammingProject_3_Server/assets/73998172/eda55d0f-aa96-47bb-b5fa-c36f151d202f)
![30](https://github.com/orijer/AdvancedSystemsProgrammingProject_3_Server/assets/73998172/6d76d429-890d-4237-9731-8c71c23e7554)
![31](https://github.com/orijer/AdvancedSystemsProgrammingProject_3_Server/assets/73998172/ec3f4aa2-9532-4def-8817-357dd075e7d0)

either way, you get a message with information about the problem and the change isn't saved on server.

## Androide app
And now the app. It has the exact same functionality as the react app, just packaged as an app.
Open the project in android studio, choose your device, build and run it.

![Screenshot_2024-04-30-15-20-14-091_com example myapplication](https://github.com/orijer/AdvancedSystemsProgrammingProject_3_Server/assets/73998172/e29f0395-b6e9-4d96-b599-b80369eb6cda)


![Screenshot_2024-04-30-15-21-50-946_com example myapplication](https://github.com/orijer/AdvancedSystemsProgrammingProject_3_Server/assets/73998172/d2c9ef1b-71a0-4a8d-99bc-986579956ea4)


![Screenshot_2024-04-30-15-43-26-891_com example myapplication](https://github.com/orijer/AdvancedSystemsProgrammingProject_3_Server/assets/73998172/f2ba8df3-0ddf-41cf-af5f-0118e0444dee)


![Screenshot_2024-04-30-15-43-40-063_com example myapplication](https://github.com/orijer/AdvancedSystemsProgrammingProject_3_Server/assets/73998172/7cea7c57-875f-4b25-9882-9454a5b83854)


![Screenshot_2024-04-30-15-43-46-895_com example myapplication](https://github.com/orijer/AdvancedSystemsProgrammingProject_3_Server/assets/73998172/73d72db6-48d6-482e-bc24-0cd96d812d94)


![Screenshot_2024-04-30-15-43-57-970_com example myapplication](https://github.com/orijer/AdvancedSystemsProgrammingProject_3_Server/assets/73998172/20a3eb8a-c124-4f20-a05a-2bd0577d7ba1)


![Screenshot_2024-04-30-15-45-02-001_com example myapplication](https://github.com/orijer/AdvancedSystemsProgrammingProject_3_Server/assets/73998172/ab5474af-55c5-4e68-8cce-785c43022373)


![Screenshot_2024-04-30-15-45-15-264_com example myapplication](https://github.com/orijer/AdvancedSystemsProgrammingProject_3_Server/assets/73998172/cb2b0f74-909f-438a-9321-b7dbc8f3014d)


![Screenshot_2024-04-30-15-45-39-112_com example myapplication](https://github.com/orijer/AdvancedSystemsProgrammingProject_3_Server/assets/73998172/ed48f7f7-629c-4b86-82b5-c496b88fd6da)


![Screenshot_2024-04-30-15-45-48-706_com example myapplication](https://github.com/orijer/AdvancedSystemsProgrammingProject_3_Server/assets/73998172/e0eecf88-5558-4a5a-b7d1-ff5bfc80fa28)


![Screenshot_2024-04-30-15-46-20-393_com example myapplication](https://github.com/orijer/AdvancedSystemsProgrammingProject_3_Server/assets/73998172/708c1138-2ec8-4d65-9efb-0fb23b65c808)
