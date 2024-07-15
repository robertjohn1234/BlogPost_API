# MERN Stack Blog Application

# Access

  For Admin:
    username: admin
    email: admin@mail.com
    password: admin1234

  For Regular User:
    username: user
    email: user@mail.com
    password: user1234

## Objective

The main objective of this project is to develop a MERN stack blog application with comprehensive blog management functionalities including CRUD operations, user authentication, and comments.

## Target Users

The target users of this application are general blog readers and authors.

## Core Features and Functionalities

- **Blog Posts Management:**
  - Authenticated users can create new blog posts.
  - Authenticated users can view, update, and delete their own blog posts.
  - Authenticated admin users can manage all blog posts.
- **Comments:**
  - Users can add comments to blog posts.
  - Authenticated users can delete their comments.
- **User Management:**
  - User registration and login functionalities.
  - Authenticated users can update their profile information.
- **Authentication and Authorization:**
  - Token-based authentication using JWT.
  - Password hashing using bcrypt.

## Data Model

### Blog Post

- **title**: String
- **content**: String
- **author**: ObjectId (references User)
- **comments**: Array of ObjectId (references Comment)
- **isActive**: Boolean

### Comment

- **content**: String
- **author**: ObjectId (references User)
- **post**: ObjectId (references Blog Post)
- **createdAt**: Date

### User

- **email**: String
- **password**: String
- **firstName**: String
- **lastName**: String
- **isAdmin**: Boolean

## Technical Requirements and Constraints

- **Backend**: Express.js API with RESTful architecture.
- **Database**: MongoDB with Mongoose for data storage and management.
- **Frontend**: ReactJS.


## Security and Authentication

- **Authentication**: Token-based authentication using JWT.
- **Password Security**: Passwords are hashed using bcrypt.

## Routes and Controllers

### User Routes

- **POST /users/login** - User login route. -ok
- **POST /users/register** - User registration route. -ok
- **GET /users/details** - User details route. -ok

### Blog Routes

- **GET /blogs/** - Retrieve a list of all blog posts. -ok
- **POST /blogs/** - Add a new blog post. -ok 
- **GET /blogs/:id** - Retrieve a specific blog post by its ID. -ok 
- **PUT /blogs/:id** - Update an existing blog post. -ok
- **DELETE /blogs/:id** - Delete a blog post by its ID. -ok 

### Comment Routes

- **POST /blogs/:id/comments** - Add a comment to a blog post. -ok
- **GET /blogs/:id/Comments** - Retrieve all comments from a blog. - ok
- **GET /blogs/:id/Comments/:commentId** - Retrieve single comment from a blog. - ok
- **PATCH /blogs/:id/Comments/:commentId** - Update single comment from a blog. - ongoing
- **DELETE /blogs/:blogId/comments/:commentId** - Delete a specific comment by its ID. -ok

### Controllers

#### User Controller

- **loginUser** - Handles user login.
- **registerUser** - Handles user registration.
- **getUserDetails** - Handles pulling user details.

#### Blog Controller

- **getAllBlogPs** - Retrieves all blog posts.
- **addBlog** - Adds a new blog post.
- **getBlogById** - Retrieves a blog post by ID.
- **updateBlog** - Updates an existing blog post.
- **deleteBlog** - Deletes a blog post by ID.

#### Comment Controller

- **addBlogComment** - Adds a comment to a blog post.


- **deleteCommentById** - Deletes a comment by ID.

## Installation and Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd <repository-directory>
