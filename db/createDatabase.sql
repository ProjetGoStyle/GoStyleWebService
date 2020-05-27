-- SQLite
create table promotion(
id INTEGER PRIMARY KEY autoincrement,
code text,
description text
);

create table utilisation(
id integer primary key autoincrement,
promotionId int,
dateUtilisation date,
constraint fk_promotion_utilisation foreign key (promotionId) references promotion(id)
);


create table qrcode(
id INTEGER PRIMARY KEY autoincrement,
promotionId int,
constraint fk_promotion_qrcode foreign key (promotionId) references promotion(id)
);


create table administrateur(
id INTEGER PRIMARY KEY autoincrement,
login text,
email text,
password text
);

insert  into administrateur ("login", "email", "password") values ('jeanpascal','alexandre.leclercq1@epsi.fr', 'sha1$7f69c39d$1$2fd5ce69c45126b1eee0f9ecfec1f5e7c519ee5d')

select avg("nombreUtilisation") as "moyenneUtilisation"
from (select promotion.id as "promotionId",count(utilisation.id) as "nombreUtilisation"
from promotion
inner join utilisation on utilisation.promotionId = promotion.id
where utilisation.dateUtilisation between '2020-05-24' and '2020-05-30'
group by "promotionId")

insert into utilisation ("promotionId", "dateUtilisation") values ((select promotion.id from promotion inner join qrcode on qrcode.promotionId = promotion.id where qrcode.id = 3),'25-05-2020')