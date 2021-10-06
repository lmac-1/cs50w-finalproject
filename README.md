# CS50 Final Project - Dance App

- [CS50 Final Project - Dance App](#cs50-final-project---dance-app)
  - [Overview](#overview)
  - [Distinctiveness and Complexity](#distinctiveness-and-complexity)
  - [Models](#models)
  - [Routes](#routes)
    - [Login `/login`](#login-login)
    - [Register Student `/register`](#register-student-register)
    - [Register Teacher `/register_teacher`](#register-teacher-register_teacher)
    - [Change Password `/change_password`](#change-password-change_password)
    - [Logout `/logout`](#logout-logout)
    - [Index `/`](#index-)
    - [New Video `/new_video`](#new-video-new_video)
    - [Video `/video/<videoId>`](#video-videovideoid)
    - [Saved Videos `/saved_videos`](#saved-videos-saved_videos)
    - [Notifications](#notifications)
      - [Notifications menu](#notifications-menu)
      - [Notification creation](#notification-creation)
  - [Files and directories](#files-and-directories)
  - [How to run the application](#how-to-run-the-application)
    - [API key set up](#api-key-set-up)
    - [Running the application](#running-the-application)
  - [Important note](#important-note)
  - [Features I would like to improve/add](#features-i-would-like-to-improveadd)

## Overview

During the pandemic, my partner and I have been teaching salsa caleña on Zoom for an online dance school. After every class, we send short videos to our students showing what we have taught via Whatsapp. However, after more than a year of classes, these videos are taking up too much space. I built my final project to create a solution for this problem.

I have built an online platform for teachers and students, where teachers can add unlisted YouTube videos and make them visible to selected students. The website has lots of different features, which I will summarise below (see [Routes](#routes)).

My web application was built using Django, JavaScript and Bootstrap.

## Distinctiveness and Complexity

According the the specification, my project must adhere to the following guidelines: 

> Your web application must be sufficiently distinct from the other projects in this course (and, in addition, may not be based on the old CS50W Pizza project), and more complex than those.

I believe that my project meets this requirement for the following reasons: 

1. My project is based on an original idea, that solves a real-life personal problem which has no similarity to any of the projects built as part of the CS50W course. 
2. The website is built with different user types: admin, student and teacher.
3. The [New Video](#new-video-new_video) page uses the Youtube Data API from Google and `fetch` in JavaScript to get the YouTube video data and dynamically prepopulate the form. I have built this in such a way that the real API key is hidden on my public deployment to GitHub.
4. I built a simple [notification](#notifications) system, which notifies students of new videos and teachers when a new comment is added to one of their videos. The notifications section is completely responsive and updates dynamically using JavaScript.
5. The filter on [Index](#index-) (homepage) was built completely from scratch and uses a JavaScript function to update the page to display videos that meet the criteria selected by the different filters on the page. 
6. On the [New Video](#new-video-new_video)  page I challenged myself to build functionality that allows users to add a new field to the `CalenaStep` model using JavaScript and update a `CheckboxSelectMultiple` field on a Django form dynamically. 

> Your web application must utilize Django (including at least one model) on the back-end and JavaScript on the front-end.

My application was built using Django, including 8 models on the back-end and uses 8 different JavaScript scripts to make dynamic updates on the front-end. All generated information is saved in a database (SQLite by default).

> Your web application must be mobile-responsive

Every page and feature of the web application is mobile-responsive and this is achieved using Bootstrap and custom CSS. 

`resize.js` is used when the screen is resized to create more complex responsive layouts for [Index](#index-) and [Notifications](#notifications).

[Back to Top](#cs50-final-project---dance-app)


## Models

There are 8 models for the DanceApp database:

1. `User` - An extension of Django's `AbstractUser` model. Stores the logic for account type (staff, student or teacher). Stores the profile picture URL and total unread notifications for the user.
2. `Student` - Creates a `OneToOne` relationship with `User` for student users.
3. `Teacher` - Creates a `OneToOne` relationship with `User` for teacher users.
4. `Style` - Stores names of video styles.
5. `CalenaStep` - Stores names of salsa caleña steps.
6. `Video` - Stores videos uploaded by teachers. Holds many relationships with other models (`Style`, `Teacher`, `Student`, `User`, `CalenaStep`). The `student_access` field determines which videos are visible to each student. This model is used in the `/videos` API route, when we make a `GET` request.
7. `Comment` - Stores comments made by users on a video and creates a relationship with `Video` and `User`.
8. `Notifications` - Stores notifications for users and creates a relationship with `Video` and `User`. Holds logic for whether a notification has been read or not.

[Back to Top](#cs50-final-project---dance-app) 

## Routes

### Login `/login`

User can log into the website using a valid username and password.

### Register Student `/register`

User must enter their username, email address, first name, surname, password and confirm password. The page has the following validation:

1. The password must match the confirm password field
2. There is no existing user with the username provided

If the details are valid, a new user is created in the `User` model with `is_student` flag set to `True`. A student instance of the user is created using the `Student` model.

### Register Teacher `/register_teacher`

This page is exactly the same as the [Register Student](#register-student-register) page, only instead it creates a user in the `User` model with the `is_teacher` flag set to `True` and creates a teacher instance of the user using the `Teacher` model.

All logic is stored in `util.py` as it's shared between both pages.

### Change Password `/change_password`

The user can change their password, and the page has the following validation: 

1. Your password can’t be too similar to your other personal information.
2. Your password must contain at least 8 characters.
3. Your password can’t be a commonly used password.
4. Your password can’t be entirely numeric.

If the details are valid, the password will be changed, and the user is redirected to [Index](#index-) with a success message.

This page uses the `PasswordChangeForm` from Django, which I have customised to include Bootstrap styling in `forms.py`. 

### Logout `/logout`

If the user clicks 'Logout' in the navigation bar, it will log the user out and redirect to the [Login](#login-login) page

### Index `/`

This page makes a `GET` request to the `/videos` API route to get all available videos for the logged in user (logic for this is stored in `utils.py`). Then, the page uses `fetch` in JavaScript to get the JSON video data to display the videos using HTML. The API route uses the following logic:

1. Teacher and admin users can see all videos in the database
2. Students can only see the videos which teachers have made available to them

This page also contains a filter which uses a JavaScript function to filter the videos returned by the `/videos` API. The user can search on name and filter on style, teacher, level and for salsa calena videos: salsa calena step names.

This page is completely responsive and uses the `resize.js` file to change the page according to the device size and whether the user has resized the screen. 

### New Video `/new_video`

This page is visible only to teachers and is used to add a new video to the database. The user enters a YouTube URL and using JavaScript, we extract the YouTube ID and make a `GET` request to the YouTube Data API. 

If no video is found, or the video URL is invalid, an error message is displayed. If a video is found, the form is shown and the `YouTube ID`, `Title`, `Thumbnail URL` and `Description` fields are prepopulated using the JSON data returned by the API.

The teacher must fill in the `Style`, `Level`, `Teacher(s)`, `Student access` and `Class date` fields. The `Student access` field holds the logic for which videos each student can see. 

If the teacher selects `Salsa Calena` as the video's style, the `Calena Step` field will dynamically appear which displays all steps that are currently saved in the `CalenaStep` model. The teacher is able to add a new step by making a `POST` request to the `add-step` API route, which adds the new step name to the database. This entire process is done using JavaScript `fetch` to update the page dynamically.

When the teacher submits the form, a new instance in the `Video` model is saved.

### Video `/video/<videoId>`

This page can be accessed by clicking on a video from the [Index](#index-) page. It includes an embedded YouTube video and basic information about the video, and the user is able to carry out the following actions:

- Student users can add or remove the video from their 'Saved Videos', by clicking the heart icon. This makes a `POST` request to the `/update_favourites/{videoId}` API route and `fetch` is used to update the heart icon using JavaScript. 
- All users can add and delete their own comments:
  - Comments are added with a full page reload after submitting the form (using the `/add_comment` route)  
  - Comments are deleted using  `fetch` which makes a `POST` request to the `delete_comment/{videoId}` API route and then updates the page using JavaScript based on the response.

The embedded video, and entire page are completely responsive. 

### Saved Videos `/saved_videos`

This page is only visible for student users and displays the videos they have selected to be part of their saved videos on the [Video](#video-videovideoid) page. It works in a similar way to the homepage, but instead it makes a GET request to the `videos/saved` API route to get the JSON data to update the page.

[Back to Top](#cs50-final-project---dance-app) 

### Notifications

When the user logs in, they can see a notification icon in the navigation bar. This number displays the number of 'new' notifications they have, and comes from the `unread_notifications` field on the `User` model. 

#### Notifications menu

When the user clicks on the notification icon, the `unread_notifications` field is set to 0 using a `POST` request to the API route `/reset_notifications_counter` and JavaScript is used to update the notification icon and show the notifications display. For medium and smaller devices, the page will be redirected to the `/notifications` route.

In the notifications display, unread notifications are marked in bold. The user can carry out the following actions: 

1. If the user clicks on a notification, we make a `POST` request to `/read_notification/{notificationId}` using JavaScript fetch to mark the individual notification as read in the database and then we take the user to the [Video](#video-videovideoid) page associated with the notification.
2. If the user clicks 'Mark all as read', we make a `POST` request to the `read_all_notifications` API route and use JavaScript to update the page to show the notifications as read. 
3. On large devices, if the user clicks on 'Notifications', they will be taken to the `/notifications` route, which has the exact same content, but it's displayed on a page rather than a small section overlaying the page.

####  Notification creation

There are two types of notifications that can be raised on the platform: 

1. When a user comments on a video on the [Video](#video-videovideoid) page, the following notification will be raised for the teachers associated with that video: *"{User first name} added a new comment on your video {Video title}"*. If the user that commented is one of the teachers of the video, a notification will not be raised for that user.
2. When a teacher uploads a video on the [New Video](#new-video-new_video) page, the following notification will be raised for all students who have been given access to that video: *"{User first name} added a new video: {Video title}"*. 

[Back to Top](#cs50-final-project---dance-app) 

## Files and directories 

Summary of files created by me:

- `danceapp` - main application directory.
  - `static/danceapp` contains all static content.
    - `images` contains 'no profile picture' image, logo and login icon.
    - `css` contains CSS file.
    - `js` - all JavaScript files used in project.
      - `comments.js` - script that is used in `video.html` template.
      - `getvideos.js` - shared script that is imported into `videos.js` and `saved_videos.js` to retrieve all available videos for logged in user.
      - `likevideo.js` - script that is used in `video.html` template.
      - `newvideo.js` - script that is used in `newvideo.html` template.
      - `notifications.js` - script that is used in every template as it's part of the base `layout.html` template. Holds logic for [notification](#notifications) updates.
      - `resize.js` - script that is used in every template as it's part of the base `layout.html` template. Holds logic for some responsive behaviour.
      - `saved_videos.js` - script that is used in `saved_videos.html` template.
      - `videos.js` - script that is used in `index.html` template.
  - `templates/danceapp` contains all application templates.
    - `change_password.html` - template for [Change Password](#change-password-change_password) page.
    - `error.html` - template for generic error page.
    - `index.html` - template for [Index](#index-) (homepage) which displays all available videos for logged-in user.
    - `layout.html` - base template. All other templates extend it.
    - `login.html` - template for [Login](#login-login) page.
    - `newvideo.html` - template for [New Video](#new-video-new_video) page where teachers can add a new video using YouTube Data API.
    - `notifications_block.html` - subtemplate that is used in a couple of other templates with `include` directive. Contains HTML for [notifications](#notifications).
    - `notifications.html` - template for [notifications](#notifications) display on medium and smaller devices.
    - `register.html` - template for [Register Student](#register-student-register) and [Register Teacher](#register-teacher-register_teacher) page.
    - `saved_videos.html` - template for [Saved Videos](#saved-videos-saved_videos) (students only).
    - `video.html` - template for individual [Video](#video-videovideoid) page with embedded YouTube video.
  - `__init__.py` - generated by Django.
  - `admin.py` - used to determine models which will be used in the Django Admin Interface.
  - `apps.py` - generated by Django.
  - `context_processors.py` - `notification_processor` creates global context variable `notifications` which is used in the navigation bar defined in the `layout.html` template.
  - `forms.py` - defines the model forms used as part of the application (`PasswordChangeForm`, `NewVideoForm`, `CommentForm`).
  - `models.py` defines the models used to add to and update the database using Django.
  - `tests.py` - generated by Django.
  - `urls.py` - defines all application URLs.
  - `util.py` - holds logic for getting user videos and registering a new account.
  - `views.py` - contains all application views.
- `finalproject` - project directory
  - `__init__.py`
  - `.env` - not commited to GitHub, but required to set up locally to store the API key for YouTube Data API
  - `asgi.py` - generated by Django
  - `settings.py` - generated by Django, also contains logic for messages, `notification_processor`, obtaining the API key from the .env file
  - `urls.py` - contains project URLs.
  - `wsgi.py` - generated by Django
- `.gitignore` - defines files to be ignored by Git
- `db.sqlite3` - database
- `manage.py` - generated by Django.
- `requirements.txt` - packages required in order for the application to run successfully.

[Back to Top](#cs50-final-project---dance-app)

## How to run the application

### API key set up

First, you will need to set up an API key for the YouTube Data API: 
1. Sign in or create an account here https://console.developers.google.com/
2. Create a project in the dashboard
3. Click 'Credentials' in the left sidebar
4. Click 'Create Credentials' at the top of the middle section, and then "API key"
5. Copy this API key
6. In the `finalproject` folder, create an file called `.env`
7. Suppose my API key is xxx, this file should contain (with no spaces or apostrophes):
   ```
   YOUTUBE_API_KEY=xxx
   ```

8. The Google API should now work successfully. If it doesn't, try another browser.

### Running the application

1. Copy the repo to your system.
2. Verify you have Python and Django installed on your system. If not you will need to install them.
3. Make sure that you have the packages installed from the `requirements.txt` file.
4. Run the following to start up the Django web server:
   ```python
   python manage.py runserver 
   ```
5. Visit the website in your browser. 
   - Use the following credentials to log in as a teacher:
     ```
     username: lucy
     password: password
     ```
   - Use the following credentials to log in a student with available videos: 
     ```
     username: becky
     password: password
     ```
   - Or, create a new student account by clicking Register in the nav bar.

[Back to Top](#cs50-final-project---dance-app) 

## Important note

The solution I have built isn't perfect, as it displays unlisted YouTube videos on the website. The student users can easily go and watch the videos on YouTube and share the links with others. This project is a 'low-cost' solution for teachers with a few students that they trust. It's for people who don't have enough students to make it worthwhile paying for an expensive video-hosting subscription.

[Back to Top](#cs50-final-project---dance-app) 

## Features I would like to improve/add

- [ ] Add student filter on homepage for teachers
- [ ] Add clear filters button
- [ ] Allow different sorting on index page (most recent, oldest)
- [ ] Date validation on New Video form
- [ ] Deploy application somewhere
- [ ] Edit comment
- [ ] Able to edit saved videos list from index / saved videos page
- [ ] Make 'Add Comment' work using JavaScript only
- [ ] Make notifications icon (total notifications) update in real time
- [ ] Change register student to be a single sign on link with email
- [ ] Change register student to be a single sign on link with email (and remove register teacher page)

[Back to Top](#cs50-final-project---dance-app) 
