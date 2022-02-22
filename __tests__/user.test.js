const request = require('supertest');
const app = require('../app');
const mongoose = require("mongoose")


var token = null

afterAll(done => {
  // Closing the DB connection allows Jest to exit successfully.
  mongoose.connection.close()
  done()
})

describe('POST /users/create', function() {
	test('correctly parse exmaple 1', function(done) {
    request(app)
      .post('/users/create')
			.send({
        "name": "testUser1",
        "emailAddress": "testUser1@testIns.com",
        "role": "academic",
        "password": "testUser1!"
      })
			.expect('Content-Type', /json/)
      .expect(409, done)
  });
  test('correctly parse exmaple 2', function(done) {
    request(app)
      .post('/users/signin')
			.send({
        "emailAddress": "testUser1@testIns.com",
        "password": "testUser1!"
      })
			.expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        token = res.body.token
        console.log(token)
        done()
      })
  });
	test('correct vm_id exmaple 3', function(done) {
    request(app)
      .get('/books')
      .set('Accept', 'application/json')
			.set({ 'Authorization': `${token}`, Accept: 'application/json' })
      .expect(200)
      .end(() => {
        mongoose.connection.close()
        done()
      })
  });
});