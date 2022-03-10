const chai = require('chai')
const chaiHttp = require('chai-http')

const request = require('supertest')
const app = require('../app')

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

                                                done()
                                            })
                                    })
                            })
                    })
            })
    })
})

describe('Short URL POST validation test', () => {
    it('should login POST, check status, check token. Validate Add url POST.', done => {
        request(app)
            .post('/auth/login')
            .send({
                username: 'superadmin',
                password: 'superadmin'
            })
            .end((error, response) => {
                response.should.have.status(200)
                response.body.should.have.property('status')

                let token = response.body.data.token
                request(app)
                    .post(`/short-url`)
                    .set('x-access-token',token)
                    .end((error, response) => {
                        response.should.have.status(400)
                        response.should.be.json
                        response.body.should.have.property('errors')

                        done()
                    })
            })
    })
})

describe('Short URL PUT validation test', () => {
    it('should login POST, check status, check token. Validate Edit url PUT.', done => {
        request(app)
            .post('/auth/login')
            .send({
                username: 'superadmin',
                password: 'superadmin'
            })
            .end((error, response) => {
                response.should.have.status(200)
                response.body.should.have.property('status')

                let token = response.body.data.token
                request(app)
                    .put(`/short-url`)
                    .set('x-access-token',token)
                    .send({
                        name: 'gtestfailed',
                        short_url: 'gtestfailed'
                    })
                    .end((error, response) => {
                        response.should.have.status(400)
                        response.should.be.json
                        response.body.should.have.property('errors')

                        done()
                    })
            })
    })
})

describe('Short URL PUT validation test', () => {
    it('should login POST, check status, check token. Validate Add url POST.', done => {
        request(app)
            .post('/auth/login')
            .send({
                username: 'superadmin',
                password: 'superadmin'
            })
            .end((error, response) => {
                response.should.have.status(200)
                response.body.should.have.property('status')

                let token = response.body.data.token
                request(app)
                    .post(`/short-url`)
                    .set('x-access-token',token)
                    .send({
                        name: 'gtestfailed',
                        short_url: 'gtestfailed',
                        original_url: 'https://google.com'
                    })
                    .end((error, response) => {
                        response.should.have.status(406)
                        response.should.be.json
                        response.body.should.have.property('status')
                        response.body.status.should.equal('failed')

                        done()
                    })
            })
    })
})