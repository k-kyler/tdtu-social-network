# School Web App - TDTU
@Authors:
To Vinh Khang, Bui Quang Khai, Ha Nguyen Hai Dang

## Description
A social network for the community of Ton Duc Thang University (TDTU). This is a university project in building a private social network only for TDTU residents, the main purpose of this project is to build up a place for students and university can communicate with each other through news feed, self wall and announcements. My team and I have been creating a realtime protocol by Socket.io to allow everyone can post anything like text, image and Youtube video or comment on this site in realtime. We also have allowed university's staffs to have permission in creating announcements and managing information of students and teachers. Additionally, we also have integrated the Google Sign In feature for student to sign in and File.io API to handle almost all uploading processes.

## Demo
<p align="center">
  <img src="public/images/tdtu.gif" />
</p>

## Main Packages Using
- NodeJS 14.15.0
- ExpressJS 4.17.1
- MongoDB 5.11.17
- SocketIO 3.1.2
- GoogleAuthLibrary 7.0.2
- PugEngine 3.0.0

## Run Project Local Step-by-Step

#### 1. Clone project

```bash
git clone https://github.com/K-Kyler/school-web-app.git
```

#### 2. Install packages

```bash
cd school-web-app
npm install
```

#### 3. Setup MongoDB database named **_school-web-app_**

#### 4. Import all collections in folder **_db_** to the created database

```
ListOfficeFaculty.json
notifications.json
posts.json
users.json
```

#### 5. Run project

```bash
npm start
```

## Live Product

```
http://tdtu-social-network-05.herokuapp.com/
```

## System Roles

### Admin

```
# Given account
adminsocialnetwork@tdtu.edu.vn
admin01
```

### Faculty staff

```
# Given account
staff01@tdtu.edu.vn
123456
```

### Student

Sign in through Google Education Account for student of Ton Duc Thang university

---

Producted by KKD Software Team
