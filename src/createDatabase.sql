create table promotion(
id int primary key,
code text
);

create table qrcode(
id int primary key,
promotionId int,
constraint fk_promotion_qrcode foreign key (promotionID) references promotion(id)
);














































































