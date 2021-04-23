const request = require('supertest')
const bcrypt = require('bcryptjs')
const server = require('./server.js')
const db = require('../data/dbConfig.js')

const User = require('../api/auth/auth-model.js')


// Write your tests here
test('sanity', () => {
  expect(true).toBe(true)
})

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});
beforeEach(async () => {
  await db("users").truncate();
});
afterAll(async () => {
  await db.destroy();
});

describe('[POST] api/auth/register', () => {
  it('(1)registers user to database', async () => {
    // const user = { username: "CourtneyCooper", password: "ayvamabry"}
    const res = await request(server).post('api/auth/register').send({ username: "Courtney", password: "ayvamabry"})
    // const expected = {id:1, username: "CourtneyCooper"}

    expect(res.body).toMatchObject({id: 1, username: "Courtney"})
    expect(response.status).toBe(201)
  })

  it('bcrypt password', async () => {
    const user2 = { username: "Emma", password: "ayvamabry"}
    const response = await request(server).post('api/auth/register').send(user2)

    await User.findById(response.body.id)
    .then(newUser => {
      expect(bcrypt.compareSync(user2.password, newUser.password)).toBeTruthy()
    })
})
})

describe('[POST] /api/auth/login', () => {
  it('missing user info', async () => {
    const response = await request(server).post('/api/auth/login').send({ username: "CourtneyCooper" });

    expect(response.body.message).toEqual('username and password required')
  })

  it('can successfully login', async () => {
    const response = await request(server).post('/api/auth/login').send({ username: "CourtneyCooper", password: "ayvamabry" });

    expect(response.body.message).toEqual('welcome, CourtneyCooper');
  })
})
