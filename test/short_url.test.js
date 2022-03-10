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

                        done()
                    })
            })
    })
})