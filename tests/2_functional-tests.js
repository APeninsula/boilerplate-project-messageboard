const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const server = require('../server');
const BoardData = require('../shared/boarddata');
const SingletonBoardData = new BoardData();

chai.use(chaiHttp);

suite('Functional Tests', ()=> {
    describe('Thread api should function as expected', function done(){
        var thread = {
            board:"testBoard",
            text:"test text",
            delete_password: "pw"
        };
        var thread2 = {
            board:"testBoard",
            text:"dupeTest",
            delete_password:"pw"
        };
        it("Should be able to post a thread to a new board", (done)=>{
            chai.request(server).post("/api/threads/testBoard").send(thread).end((err,res) =>{
                if(err){
                    done(err);
                }
                assert.deepEqual(res.status, 200);
                done();
            });
        });
        it('Should be able to get an array of up to 10 threads from a board', (done)=>{
            chai.request(server).get("/api/threads/testBoard/").end((err,res) =>{
                if(err){
                    done(err);
                }
                assert.equal(res.status, 200);
                expect(res.body).to.be.an( 'array', 'the result should be an array');
                assert.equal(res.body.length, 1, 'There should be one thread on the board');
                expect(res.body[0]).to.have.property('text');
                assert.equal(res.body[0].text, thread.text, "thread text from GET should be the same as the sent thread");
                expect(res.body[0]).to.have.property('_id');
                expect(res.body[0]).to.have.property('created_on');
                expect(res.body[0]).to.have.property('bumped_on');
                expect(res.body[0]).to.have.property('replycount');
                expect(res.body[0]).not.to.have.property('reported');
                expect(res.body[0]).not.to.have.property('delete_password');
                done();
            });
        });
        it('Should be able to post a thread to an existing board', (done)=>{
            chai.request(server).post("/api/threads/testBoard").send(thread2).end((err,res) =>{
                if(err){
                    done(err);
                }
                assert.deepEqual(res.status, 200);
                done();
            })
        });
        it('Should not show more than 10 threads when viewing a board', (done)=>{
            var spamThread = {
                board:"spamBoard",
                text:"spamTest",
                delete_password:"pw"
            };
            for(i=0;i<12; i++){
                spamThread.text += " " + i;
                chai.request(server).post("/api/threads/spamBoard").send(spamThread).end((err,res)=>{
                    if(err){
                        done(err);
                    }
                    assert.deepEqual(res.status, 200);
                });
            }
            chai.request(server).get("/api/threads/spamBoard/").end((err,res)=>{
                if(err){
                    done(err);
                }
                assert.deepEqual(res.status, 200);
                expect(res.body).to.be.an( 'array', 'the result should be an array');
                assert.isBelow(res.body.length, 11, 'The returned array should have 10 elements');
                assert.equal(res.body.length, 10, 'should have 10 elementes in the array');
                done();
            })
        })
        it('Should tell you when you put in an incorrect password for a thread', (done)=>{
            new Promise((resolve,reject) =>{chai.request(server).get("/api/threads/spamBoard/").end((err,res)=>{
                if(err){
                    reject(done(err));
                }
                assert.deepEqual(res.status, 200);
                
                const id = res.body[0]._id;
                resolve(id);
            });
            }).then( id_val =>{
                chai.request(server).delete("/api/threads/spamBoard").send({thread_id:id_val,delete_password:"wrong PW"}).end((err,res)=>{
                    if(err){
                        done(err);
                    }
                    assert.deepEqual(res.status, 200);
                    expect(res.text).to.be.a('string');
                    assert.deepEqual(res.text, "incorrect password");
                    done();
                });
            });
        });
        it('Should tell you when you put in the correct password for a thread', (done)=>{
            new Promise((resolve,reject) =>{chai.request(server).get("/api/threads/spamBoard/").end((err,res)=>{
                if(err){
                    reject(done(err));
                }
                assert.deepEqual(res.status, 200);
                
                const id = res.body[0]._id;
                resolve(id);
            });
            }).then( id_val =>{
                chai.request(server).delete("/api/threads/spamBoard").send({thread_id:id_val,delete_password:"pw"}).end((err,res)=>{
                    if(err){
                        done(err);
                    }
                    assert.deepEqual(res.status, 200);
                    expect(res.text).to.be.a('string');
                    assert.deepEqual(res.text, "success");
                    done();
                });
            });
        });

        it('Should tell you when you report a thread', (done)=>{
            new Promise((resolve,reject) =>{chai.request(server).get("/api/threads/testBoard/").end((err,res)=>{
                if(err){
                    reject(done(err));
                }
                assert.deepEqual(res.status, 200);
                
                const id = res.body[0]._id;
                resolve(id);
            });
            }).then( id_val =>{
                chai.request(server).put("/api/threads/testBoard").send({thread_id:id_val, board:"testBoard"}).end((err,res)=>{
                    if(err){
                        done(err);
                    }
                    assert.deepEqual(res.status, 200);
                    expect(res.text).to.be.a('string');
                    assert.deepEqual(res.text, "reported");
                    done();
                });
            });
        });
    });

    describe('Reply API should function as expected', function done(){
        var thread = {
            board:"testBoardReply",
            text:"test text",
            delete_password: "pw"
        };
        var thread2 = {
            board:"testBoardReply",
            text:"dupeTest",
            delete_password:"pw"
        };
        it("Should be able to post a reply to a thread", (done)=>{
            chai.request(server).post("/api/threads/testBoardReply").send(thread).end((err,res) =>{
                if(err){
                    done(err);
                }
                assert.deepEqual(res.status, 200);
            });
            new Promise((resolve,reject) =>{chai.request(server).get("/api/threads/testBoardReply/").end((err,res) =>{
                if(err){
                    reject(done(err));
                }
                assert.deepEqual(res.status, 200);
                const id = res.body[0]._id;
                resolve(id);
            });
            }).then(thread_id_val=>{
                var replyDataReq = {
                    thread_id:thread_id_val,
                    text:"reply test text",
                    delete_password:"reply pw"
                };
                chai.request(server).post("/api/threads/testBoardReply/").send(replyDataReq).end((err,res)=>{
                    if(err){
                        done(err);
                    }
                    assert.deepEqual(res.status, 200);
                    done();
                });
            });
        });
        it("Should be able to show you all replies to a single thread", (done)=>{
            new Promise((resolve,reject) =>{chai.request(server).get("/api/threads/testBoardReply/").send(thread).end((err,res) =>{
                if(err){
                    reject(done(err));
                }
                assert.deepEqual(res.status, 200);
                const id = res.body[0]._id;
                resolve(id);
            });
            }).then(thread_id_val=>{
                var replyDataReq = {
                    thread_id:thread_id_val,
                    text:"reply test text two",
                    delete_password:"reply pw"
                };
                chai.request(server).post("/api/threads/testBoardReply/").send(replyDataReq).end((err,res)=>{
                    if(err){
                        done(err);
                    }
                    assert.deepEqual(res.status, 200);
                });
                chai.request(server).get("/api/threads/testBoardReply/").query({
                    board:"testBoardReply",
                    thread_id: thread_id_val
                }).end((err,res)=>{
                    if(err){
                        done(err);
                    }
                    assert.deepEqual(res.status, 200);
                    expect(res.body).to.be.an('Array');
                    assert.isAtLeast(res.body.length, 2, 'There should be at least 2 replies in this thread');
                    done();
                })
            });
        });
        it('Should tell you when you put in an incorrect password for a reply',(done)=>{
            new Promise((resolve,reject) =>{chai.request(server).get("/api/threads/testBoardReply/").end((err,res) =>{
                if(err){
                    reject(done(err));
                }
                assert.deepEqual(res.status, 200);
                const id = res.body[0]._id;
                resolve(id);
            });
            }).then(thread_id_val=>{
                new Promise((resolve,reject) => {chai.request(server).get("/api/threads/testBoardReply/").query({board:"testBoardReply",thread_id:thread_id_val}).end((err,res)=>{
                    if(err){
                        reject(done(err));
                    }
                    assert.deepEqual(res.status, 200);
                    expect(res.body).to.be.an('Array');
                    assert.isAtLeast(res.body.length,1,'there should be at least 1 reply in the thread');
                    const id = res.body[0]._id;
                    resolve([thread_id_val,id]);
                });
            }).then(ids =>{
                chai.request(server).delete("/api/threads/testBoardReply/").send({
                    board:"testBoardReply", thread_id:ids[0],reply_id:ids[1],delete_password:"wrong pw"
                }).end((err,res)=>{
                    if(err){
                        done(err);
                    }
                    assert.deepEqual(res.status, 200);
                    expect(res.text).to.be.a('string');
                    assert.deepEqual(res.text, "incorrect password");
                    done();
                });
            });
            });
        
        });
        it('Should tell you when you put in a correct password for a reply',(done)=>{
            new Promise((resolve,reject) =>{chai.request(server).get("/api/threads/testBoardReply/").end((err,res) =>{
                if(err){
                    reject(done(err));
                }
                assert.deepEqual(res.status, 200);
                const id = res.body[0]._id;
                resolve(id);
            });
            }).then(thread_id_val=>{
                new Promise((resolve,reject) => {chai.request(server).get("/api/threads/testBoardReply/").query({board:"testBoardReply",thread_id:thread_id_val}).end((err,res)=>{
                    if(err){
                        reject(done(err));
                    }
                    assert.deepEqual(res.status, 200);
                    expect(res.body).to.be.an('Array');
                    assert.isAtLeast(res.body.length,1,'there should be at least 1 reply in the thread');
                    const id = res.body[0]._id;
                    resolve([thread_id_val,id]);
                });
            }).then(ids =>{
                chai.request(server).delete("/api/threads/testBoardReply/").send({
                    board:"testBoardReply", thread_id:ids[0],reply_id:ids[1],delete_password:"reply pw"
                }).end((err,res)=>{
                    if(err){
                        done(err);
                    }
                    assert.deepEqual(res.status, 200);
                    expect(res.text).to.be.a('string');
                    assert.deepEqual(res.text, "success");
                    done();
                });
            });
            });
        
        });
        it('Should tell you when you report a reply',(done)=>{
            new Promise((resolve,reject) =>{chai.request(server).get("/api/threads/testBoardReply/").end((err,res) =>{
                if(err){
                    reject(done(err));
                }
                assert.deepEqual(res.status, 200);
                const id = res.body[0]._id;
                resolve(id);
            });
            }).then(thread_id_val=>{
                new Promise((resolve,reject) => {chai.request(server).get("/api/threads/testBoardReply/").query({board:"testBoardReply",thread_id:thread_id_val}).end((err,res)=>{
                    if(err){
                        reject(done(err));
                    }
                    assert.deepEqual(res.status, 200);
                    expect(res.body).to.be.an('Array');
                    assert.isAtLeast(res.body.length,1,'there should be at least 1 reply in the thread');
                    const id = res.body[0]._id;
                    resolve([thread_id_val,id]);
                });
            }).then(ids =>{
                chai.request(server).put("/api/threads/testBoardReply/").send({
                    board:"testBoardReply", thread_id:ids[0],reply_id:ids[1]
                }).end((err,res)=>{
                    if(err){
                        done(err);
                    }
                    assert.deepEqual(res.status, 200);
                    expect(res.text).to.be.a('string');
                    assert.deepEqual(res.text, "reported");
                    done();
                });
            });
            });
        
        });
    });
});
