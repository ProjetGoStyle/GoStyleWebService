-- SQLite
create table promotion(
id INTEGER PRIMARY KEY autoincrement,
code text,
description text
);


create table qrcode(
id INTEGER PRIMARY KEY autoincrement,
promotionId int,
constraint fk_promotion_qrcode foreign key (promotionId) references promotion(id)
);














































































