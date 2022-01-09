# Node Challenge

This challenge has been designed to measure your knowledge of Node.js, Express and Typescript. 

The premise of this challenge is to see the approach you take to:

- Use an ORM to interact with a simple database model
- Create a basic routing mechanism for HTTP requests
- Authenticate a user’s access to a route
- Respond to a request in a consistent and logical manner
- Test your work with both unit tests and integration tests.

Your objective is to write some models and manipulate them through routes. Please make sure that the endpoints scales adequately and supports paging, sorting and filtering. Additionally, we would also like you to write some tests for your routes.

## Challenge
1. Use [Sequelize](http://docs.sequelizejs.com/manual/installation/getting-started), [TypeORM](https://typeorm.io/) or [Mongoose](https://mongoosejs.com/) to define:

   1.1. A **`User`** model which should have basic identifying information:
      - Name
      - Email address
      - Role (Acceptable entries: ‘student’, ‘academic’, ‘administrator’)
      - Password.

   1.2. An **`Institution`** model which stores information about a school:
      - Name
      - URL
      - Email domain.
      
   1.3. A **`Book`** model which stores information about books:
      - ISBN
      - Title
      - Author.
      
   1.4. Relationships between **`Users`** and **`Institutions`**, and **`Books`** and **`Institutions`** (Consider #4.3 in the relationships you create).
2. Use [Express](https://expressjs.com/) to respond to requests.

3. Create routes:

    4.1 `POST /users/signin` Use the passport library to authenticate a user.
    
    4.2 `POST /users/create` Creates a user and based on the user’s email domain links them to an institution. Denies creation of a user if their domain does not exist.
    
    4.3 `GET /books` Once authenticated, responds with a JSON object containing a list of Books that the user has access to via their Institution.
    
4. (Optional) Provide a [Postman](https://www.getpostman.com/) collection which performs some basically functionality on the routes you've created.

## Things to keep in mind
- Security
- Scalability
- Consistency
- Testing.

## Instructions

Fork this repo with your solution. Ideally, we'd like to see your progression through commits, and don't forget to update the README.md to explain your thought process.

Please let us know how long the challenge takes you. We're not looking for how speedy or lengthy you are. It's just really to give us a clearer idea of what you've produced in the time you decided to take. Feel free to go as big or as small as you want.

Happy hacking 😁!
