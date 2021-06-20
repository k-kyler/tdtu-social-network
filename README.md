# School Web App - TDTU
@Authors:
To Vinh Khang, Bui Quang Khai, Ha Hai Dang

# Description
A social network for the community of Ton Duc Thang University (TDTU). This is a school project in building a private social network only for TDTU residents, the main purpose of this project is to build up a place for students and school can easily communicate with each other through news feed, self wall and school's announcements.  My team and I have been creating a realtime protocol by Socket.io to allow everyone can post anything like text, image and Youtube video or comment on this site in realtime. We also have allowed school's staffs to have permission in creating school's announcements and managing students and teachers information. Additionally, we have integrated the Google Sign In feature for student to sign in and File.io API to handle almost all uploading processes.

# Main Packages Using:
<br />• NodeJS 14.15.0
<br />• ExpressJS 4.17.1
<br />• MongoDB 5.11.17
<br />• SocketIO 3.1.2
<br />• GoogleAuthLibrary 7.0.2
<br />• PugEngine 3.0.0

# Run Project Local Step-by-Step:
<br />1/ Clone project: 
```
git clone https://github.com/K-Kyler/school-web-app.git
```
<br />2/ Import node_modules:
```
cd school-web-app
npm install
```
<br />3/ Setup database by MongoDB with name "school-web-app"

<br />4/ Import all these file in folder "db" to database just created
```
ListOfficeFaculty.json
notifications.json
posts.json
users.json
```

<br />5/ Run:
```
npm start
```

# Link Hosting:
```
http://tdtu-social-network-05.herokuapp.com/
```
<br /> Given Accounts:
<br /> adminsocialnetwork@tdtu.edu.vn
<br /> admin01
<br /> staff01@tdtu.edu.vn
<br /> 123456

Producted by KKD Software Team
