# ToDo List App

This is a ToDo List application created using HTML, CSS, JavaScript, Node.js, Express, and MongoDB database.

## Overview

This ToDo List app allows users to keep track of their tasks in an organized manner. Users can add new tasks, mark tasks as completed, delete tasks, and view their entire task list.

## Features

- **Sign-in/Sign-up**: User can sign up using their email address and password.
- **Social Authentication**: user can sign-in/sign-up using google.
- **Password Reset**: User can reset their password if they forget their password.
- **Add Task**: Users can add new tasks to their list by entering task details and clicking the "Add" button.
- **Delete Task**: Users can delete tasks from the list by clicking the delete button associated with each task.
- **Update Task**: User can update their task info
- **View Task List**: Users can view their entire task list, including completed and pending tasks.
- **Persist Data**: Task data is stored in a MongoDB database, ensuring that tasks are retained even after the user closes the application.
- **Pop up Notification**: Notifications for signing and signing out.
- **Proifle Page**: User will have their profile page where they can manage their preferences.
- **Delayed Job handling**: Kue and Redis database is used for handling Delyed jobs. 

## Technologies Used

- **HTML**: Used for structuring the web page.
- **CSS**: Used for styling the user interface.
- **JavaScript**: Used for implementing client-side functionality.
- **Node.js**: Backend JavaScript runtime environment.
- **Express.js**: Web application framework for Node.js used for building the server.
- **MongoDB**: NoSQL database used for storing task data.

## Setup Instructions

1. Clone the repository to your local machine.
   ```
   git clone https://github.com/kanishy/todo-list.git
   ```

2. Install dependencies.
   ```
   npm install
   ```

3. Make sure MongoDB is installed and running on your machine.

4. Start the server.
   ```
   npm start
   ```

5. Open your web browser and navigate to `http://localhost:8000` to access the ToDo List app.

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please fork the repository and submit a pull request. For major changes, please open an issue first to discuss what you would like to change.

## Contact

For any inquiries or feedback, please contact kanhaiya2004yadav@gmail.com.
