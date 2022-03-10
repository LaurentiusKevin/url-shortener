const assert = require('assert')
const chai = require('chai')
const chaiHttp = require('chai-http')

const should = chai.should()

const request = require('supertest')
const app = require('../app')
const db = require('../models')

chai.use(chaiHttp)
describe('Short URL CRUD Process', () => {
    it('should login POST, check status, check token. Get url list GET. Add url POST. edit url PUT. delete url DELETE.', done => {
        request(app)
            .post('/auth/login')
            .send({
                username: 'superadmin',
                password: 'superadmin'
            })
            .end((error, response) => {
                response.should.have.status(200)
                response.should.be.json
                response.body.should.have.property('status')
                response.body.should.have.property('data')
                response.body.data.should.have.property('token')
                response.body.status.should.equal('success')

                let token = response.body.data.token

                console.log('Get url list GET')
                request(app)
                    .get('/short-url')
                    .set('x-access-token',token)
                    .end((error, response) => {
                        response.should.have.status(200)
                        response.should.be.json
                        response.body.should.have.property('status')
                        response.body.should.have.property('data')
                        response.body.status.should.equal('success')


                        request(app)
                            .post('/short-url')
                            .set('x-access-token',token)
                            .send({
                                name: 'trial',
                                short_url: 'goo',
                                original_url: 'https://google.com'
                            })
                            .end((error, response) => {
                                response.should.have.status(200)
                                response.should.be.json
                                response.body.should.have.property('status')
                                response.body.should.have.property('data')
                                response.body.status.should.equal('success')
                                response.body.data.should.have.property('id')

                                let dataID = response.body.data.id

                                request(app)
                                    .put(`/short-url?id=${dataID}&name=trial&short_url=google&original_url=https://google.com`)
                                    .set('x-access-token',token)
                                    .end((error, response) => {
                                        response.should.have.status(200)
                                        response.should.be.json
                                        response.body.should.have.property('status')
                                        response.body.should.have.property('data')
                                        response.body.status.should.equal('success')

                                        request(app)
                                            .delete(`/short-url?id=${dataID}`)
                                            .set('x-access-token',token)
                                            .end((error, response) => {
                                                response.should.have.status(200)
                                                response.should.be.json
                                                response.body.should.have.property('status')
                                                response.body.should.have.property('data')
                                                response.body.status.should.equal('success')

                                                request(app)
                                                    .delete(`/s_google`)
                                                    .end((error, response) => {
                                                        response.should.have.status(200)
                                                        response.should.be.json
                                                        response.body.should.have.property('status')
                                                        response.body.should.have.property('data')
                                                        response.body.status.should.equal('success')
                                                        response.should.redirect('https://google.com')

                                                        done()
                                                    })
                                            })
                                    })
                            })
                    })
            })
    })
})