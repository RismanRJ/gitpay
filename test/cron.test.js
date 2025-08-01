const expect = require('chai').expect
const Promise = require('bluebird')
const api = require('../server')
const models = require('../models')
const { truncateModels, createTask, createOrder } = require('./helpers')
const nock = require('nock')
const request = require('supertest')
const agent = request.agent(api)
const { TaskCron, OrderCron } = require('../cron')
const MockDate = require('mockdate')
const paypalOrder = require('./data/paypal/paypal.order')

describe('Crons', () => {
  beforeEach(async () => {
    await truncateModels(models.Task);
    await truncateModels(models.User);
    await truncateModels(models.Assign);
    await truncateModels(models.Order);
    await truncateModels(models.Transfer);
  })

  afterEach(async () => {
    nock.cleanAll()
  })

  describe('Order', () => {
    it('should update order status when payment expired on Paypal', async () => {
      const task = await createTask(agent)
      const taskData = task.dataValues
      const order = await createOrder({source_id: '123', userId: taskData.userId, taskId: taskData.id, provider: 'paypal', status: 'succeeded', paid: true})
      const orderData = order.dataValues
      nock('https://api.sandbox.paypal.com')
          .persist()  
          .post(`/v1/oauth2/token`)
          .reply(200, '{"access_token": "123"}' )

      nock('https://api.sandbox.paypal.com')
          .persist()  
          .get(`/v2/checkout/orders/${orderData.source_id}`)
          .reply(200, paypalOrder.resource_not_found );

      await OrderCron.checkExpiredPaypalOrders()
      await models.Order.findOne({ where: { id: orderData.id } }).then( updatedOrder => {
        expect(updatedOrder.dataValues.status).to.equal('expired')
        expect(updatedOrder.dataValues.paid).to.equal(false)
      })
    })
    it('should update order status when payment authorization expired after one month on Paypal', async () => {
      const task = await createTask(agent)
      const taskData = task.dataValues
      const order = await createOrder({source_id: '123', userId: taskData.userId, taskId: taskData.id, provider: 'paypal', status: 'succeeded', paid: true})
      const orderData = order.dataValues
      nock('https://api.sandbox.paypal.com')
          .persist()  
          .post(`/v1/oauth2/token`)
          .reply(200, '{"access_token": "123"}' )

      nock('https://api.sandbox.paypal.com')
          .persist()  
          .get(`/v2/checkout/orders/${orderData.source_id}`)
          .reply(200, paypalOrder.authorization_expired );

      await OrderCron.checkExpiredPaypalOrders()
      await models.Order.findOne({ where: { id: orderData.id } }).then( updatedOrder => {
        expect(updatedOrder.dataValues.status).to.equal('expired')
        expect(updatedOrder.dataValues.paid).to.equal(false)
      })
    })
  })
  describe('Task', () => {
    xit('Remember about tasks with bounty invested weekly', (done) => {
      agent
        .post('/auth/register')
        .send({email: 'testcronbasic@gmail.com', password: 'teste'})
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          MockDate.set('2000-11-25')
          Promise.all([
            models.Task.build({url: 'https://github.com/worknenjoy/truppie/issues/7363', userId: res.body.id}).save(),
            models.Task.build({url: 'https://github.com/worknenjoy/truppie/issues/7364', userId: res.body.id, status: 'in_progress'}).save(),
            models.Task.build({url: 'https://github.com/worknenjoy/truppie/issues/7365', userId: res.body.id, status: 'closed', value: 100}).save(),
            models.Task.build({url: 'https://github.com/worknenjoy/truppie/issues/7366', userId: res.body.id}).save(),
            models.Task.build({url: 'https://github.com/worknenjoy/truppie/issues/7367', userId: res.body.id, value: 50}).save()
          ]).then( tasks => {
            expect(tasks[0].dataValues.url).to.equal('https://github.com/worknenjoy/truppie/issues/7363')
            expect(tasks[2].dataValues.value).to.equal('100')
            TaskCron.weeklyBounties().then( r => {
              expect(r.length).to.equal(1)
              expect(r[0]).to.exist;
              expect(r[0].dataValues.url).to.equal('https://github.com/worknenjoy/truppie/issues/7367')
              MockDate.reset()
              done()
            })
          })
        })
      })
    })
    xit('Remember about latest tasks weekly', (done) => {
      agent
        .post('/auth/register')
        .send({email: 'testcronbasic@gmail.com', password: 'teste'})
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          Promise.all([
            models.Task.build({url: 'https://github.com/worknenjoy/truppie/issues/7363', userId: res.body.id}).save(),
            models.Task.build({url: 'https://github.com/worknenjoy/truppie/issues/7364', userId: res.body.id, status: 'in_progress'}).save(),
            models.Task.build({url: 'https://github.com/worknenjoy/truppie/issues/7365', userId: res.body.id, status: 'closed', value: 100}).save(),
            models.Task.build({url: 'https://github.com/worknenjoy/truppie/issues/7366', userId: res.body.id}).save(),
            models.Task.build({url: 'https://github.com/worknenjoy/truppie/issues/7367', userId: res.body.id, value: 50}).save()
          ]).then( tasks => {
            expect(tasks[0].dataValues.url).to.equal('https://github.com/worknenjoy/truppie/issues/7363')
            expect(tasks[2].dataValues.value).to.equal('100')
            TaskCron.latestTasks().then( r => {
              expect(r.length).to.equal(3)
              expect(r[0]).to.exist;
              expect(r[0].dataValues.url).to.equal('https://github.com/worknenjoy/truppie/issues/7367')
              expect(r[2].dataValues.url).to.equal('https://github.com/worknenjoy/truppie/issues/7363')
              done(err)
            }).catch(done)
          }).catch(done)
        })
    })
    xit('Paypal payment was canceled notification when we cannot fetch order', (done) => {
      agent
        .post('/auth/register')
        .send({email: 'testcronbasic@gmail.com', password: 'teste'})
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          models.Task.build({url: 'https://github.com/worknenjoy/truppie/issues/7363', userId: res.body.id}).save()
          .then(task => {
            Promise.all([
              models.Order.build({amount: 60, userId: res.body.id, status: 'open', taskId: task.dataValues.id}).save(),
              models.Order.build({amount: 80, userId: res.body.id, taskId: task.dataValues.id, status: 'canceled'}).save(),
              models.Order.build({amount: 20, userId: res.body.id, source_id: 'foo', taskId: task.dataValues.id, status: 'succeeded', paid: true, provider: 'paypal'}).save(),
              models.Order.build({amount: 20, userId: res.body.id}).save(),
              models.Order.build({amount: 20, userId: res.body.id}).save()
            ]).then( orders => {
              expect(orders[0].dataValues.id).to.exist
              OrderCron.verify().then( r => {
                expect(r.length).to.equal(1)
                expect(r[0]).to.exist;
                expect(r[0].dataValues.status).to.equal('canceled')
                // expect(mailSpySuccess).to.have.been.called()
                // mailSpyCancelError.reset()
                done()
              }).catch(done)
            })
          })
        })
    })
    xit('Send email about bounties', (done) => {
      agent
        .post('/auth/register')
        .send({email: 'testcronbasic@gmail.com', password: 'teste'})
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          models.Task.build({url: 'https://github.com/worknenjoy/truppie/issues/7363', userId: res.body.id}).save().then( task => {
            expect(task.dataValues.url).to.equal('https://github.com/worknenjoy/truppie/issues/7363')
            done()
          })
      })
    })
    xit('remember deadline 2 days left', (done) => {
      agent
        .post('/auth/register')
        .send({email: 'testcrondeadline@gmail.com', password: 'teste'})
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          MockDate.set('2000-11-25')
          models.Task.build({deadline: new Date('2000-11-24'), url: 'https://github.com/worknenjoy/truppie/issues/7336', userId: res.body.id, status: 'in_progress'}).save().then( task => {
            task.createAssign({userId: res.body.id}).then((assign) => {
                task.update({
                  assigned: assign.dataValues.id
                }).then( taskUpdated => {
                  TaskCron.rememberDeadline().then( r => {
                    expect(r[0]).to.exist;
                    expect(r[0].dataValues.url).to.equal('https://github.com/worknenjoy/truppie/issues/7336')
                    MockDate.reset()
                    done()
                }).catch(done)
          }).catch(done)
        }).catch(done)
      }).catch(done)
    })
    xit('remember deadline 2 days past', (done) => {
      agent
        .post('/auth/register')
        .send({email: 'testcrondeadline2@gmail.com', password: 'teste'})
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          MockDate.set('2000-11-25')
          models.Task.build({deadline: new Date('2000-11-27'), url: 'https://github.com/worknenjoy/truppie/issues/7336', userId: res.body.id, status: 'in_progress'}).save().then( task => {
            task.createAssign({userId: res.body.id}).then((assign) => {
                task.update({
                  assigned: assign.dataValues.id
                }).then( taskUpdated => {
                  TaskCron.rememberDeadline().then( r => {
                    expect(r[0]).to.exist;
                    expect(r[0].dataValues.url).to.equal('https://github.com/worknenjoy/truppie/issues/7336')
                    MockDate.reset()
                    done()
                })
            })
          })
        })
      })
    })
  })
})
