var expect = require('chai').expect;
var DatabaseHandler = require('./Dal/DatabaseHandler');

new DatabaseHandler(process.env.DBPATH);

describe('API REST', function () {
    beforeEach(async () => {
        var db = new DatabaseHandler(process.env.DBPATH);
        db.dbclient.run('insert into promotion values(0,"TEST1"),(1,"TEST2"),(2,"TEST3")');
        db.dbclient.run('insert into qrcode values(0,1),(1,2),(2,0)');
    });
    afterEach(() => {
        db.close();
    });

    describe('get coupon', function () {
        it('a', function () {
            db.getCodePromoByQrCodeId('1', (row) => {
                row.code.should.equal("TEST3");
                done();
            }, (error) => {
                done();
            });
        });
    });
});
