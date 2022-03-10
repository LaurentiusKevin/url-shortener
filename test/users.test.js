const assert = require('assert')
const chai = require('chai')
const chaiHttp = require('chai-http')

const should = chai.should()

const request = require('supertest')
const app = require('../app')
const db = require('../models')

chai.use(chaiHttp)
describe('User CRUD Process', () => {
    it('should login POST, check status, check token, get user list GET, register user POST, edit user PUT, delete user DELETE, permanent delete user DELETE', done => {
        request(app)
            .post('/auth/login')
            .send({
                username: 'superadmin',
                password: 'superadmin'
            })
            .end((error,response) => {
                response.should.have.status(200)
                response.should.be.json
                response.body.should.have.property('status')
                response.body.should.have.property('data')
                response.body.data.should.have.property('token')
                response.body.status.should.equal('success')

                let token = response.body.data.token

                console.log('should get user list GET.')
                request(app)
                    .get('/users')
                    .end((error,response) => {
                        response.should.have.status(200)
                        response.should.be.json
                        response.body.should.have.property('status')
                        response.body.status.should.equal('success')

                        console.log('should register user POST.')
                        request(app)
                            .post('/users')
                            .set('x-access-token',token)
                            .send({
                                username: 'unittest',
                                password: 'unittest',
                                name: 'unittest'
                            })
                            .end((error,response) => {
                                response.should.have.status(200)
                                response.should.be.json
                                response.body.should.have.property('status')
                                response.body.status.should.equal('success')
                                response.body.data.should.have.property('id')

                                let userID = response.body.data.id

                                request(app)
                                    .put(`/users?id=${userID}&name=unittest trial&username=unittest1&password=unittest`)
                                    .set('x-access-token',token)
                                    .end((error,response) => {
                                        response.should.have.status(200)
                                        response.should.be.json
                                        response.body.should.have.property('status')
                                        response.body.status.should.equal('success')

                                        request(app)
                                            .delete(`/users?id=${userID}`)
                                            .set('x-access-token',token)
                                            .end((error,response) => {
                                                response.should.have.status(200)
                                                response.should.be.json
                                                response.body.should.have.property('status')
                                                response.body.status.should.equal('success')

                                                request(app)
                                                    .delete(`/users/permanent?id=${userID}`)
                                                    .set('x-access-token',token)
                                                    .end((error,response) => {
                                                        response.should.have.status(200)
                                                        response.should.be.json
                                                        response.body.should.have.property('status')
                                                        response.body.status.should.equal('success')

                                                        done()
                                                    })
                                            })
                                    })
                            })
                    })
            })
    })
})