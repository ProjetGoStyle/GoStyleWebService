const expect = require('chai').expect;
const DatabaseHandler = require('../src/Dal/DatabaseHandler');
var db = null;

describe('API REST', function () {
    beforeEach(() => {
        db = new DatabaseHandler(':memory:');
        db.dbclient.serialize(() => {
            db.dbclient.run(`create table promotion(
                id int primary key,
                code text
                );`);

            db.dbclient.run(`create table qrcode(
                id int primary key,
                promotionId int,
                constraint fk_promotion_qrcode foreign key (promotionId) references promotion(id)
            );`);
            db.dbclient.run('insert into promotion values(0,"TEST1"),(1,"TEST2"),(2,"TEST3")');
            db.dbclient.run('insert into qrcode values(0,1),(1,2),(2,0)');
        });

    });
    afterEach(() => {
        db.dbclient.close();
    });

    describe('get coupon', function () {
        it('a', () => {
            db.getCodePromoByQrCodeId('1', (row) => {
                row.code.should.equal("TEST2");
                done();
            }, (error) => {
                done();
            });
        });
    });
});
