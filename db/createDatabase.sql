-- SQLite
create table promotion(
id INTEGER PRIMARY KEY autoincrement,
code text,
description text
);

create table utilisation(
id integer primary key autoincrement,
promotionId int,
dateUtilisation datetime,
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

select count(utilisation.id)
from promotion
inner join utilisation on utilisation.promotionId = promotion.id
where utilisation.dateUtilisation between utilisation.dateUtilisation and DATE(utilisation.dateUtilisation,'-7 day')
group by date(utilisation.dateUtilisation)

insert into utilisation ("promotionId", "dateUtilisation") values ((select promotion.id from promotion inner join qrcode on qrcode.promotionId = promotion.id where qrcode.id = 3),'25-05-2020')