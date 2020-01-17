const assert = require('chai').assert;
const CodePromoController = require('../src/Controllers/CodePromoController');
var db = new CodePromoController(':memory:');

describe('API REST', function () {
    before(async () => {
        await db.dbclient.open(':memory:');
        await db.dbclient.run('create table promotion(id int primary key,code text);');
        await db.dbclient.run('create table qrcode(id int primary key,promotionId int,constraint fk_promotion_qrcode foreign key (promotionId) references promotion(id));');
        await db.dbclient.run('insert into promotion values(0,"TEST1"),(1,"TEST2"),(2,"TEST3")');
        await db.dbclient.run('insert into qrcode values(0,1),(1,2),(2,0)');
    });
    after(async () => {
        await db.dbclient.close();
    });

    describe('get coupon', () => {
        it('when id is 1 result should be TEST3', async () => {
            const queryToGetCodePromo = `SELECT promotion.code
                                          FROM qrcode 
                                          INNER JOIN promotion ON qrcode.promotionId = promotion.id
                                          WHERE qrcode.id = ?`;
            const result = await db.dbclient.get(queryToGetCodePromo, 1);
            assert.equal(result.code, "TEST3");
        });
        it('when id is empty string result should be undefined', async () => {
            const queryToGetCodePromo = `SELECT promotion.code
                                          FROM qrcode 
                                          INNER JOIN promotion ON qrcode.promotionId = promotion.id
                                          WHERE qrcode.id = ?`;
            const result = await db.dbclient.get(queryToGetCodePromo, '');
            assert.equal(result, undefined);
        });
        it('when id is not in database result should be undefined', async () => {
            const queryToGetCodePromo = `SELECT promotion.code
                                          FROM qrcode 
                                          INNER JOIN promotion ON qrcode.promotionId = promotion.id
                                          WHERE qrcode.id = ?`;
            const result = await db.dbclient.get(queryToGetCodePromo, '12');
            assert.equal(result, undefined);
        });
        it('when id is null result should be undefined', async () => {
            const queryToGetCodePromo = `SELECT promotion.code
                                          FROM qrcode 
                                          INNER JOIN promotion ON qrcode.promotionId = promotion.id
                                          WHERE qrcode.id = ?`;
            const result = await db.dbclient.get(queryToGetCodePromo, null);
            assert.equal(result, undefined);
        });
    });
});


