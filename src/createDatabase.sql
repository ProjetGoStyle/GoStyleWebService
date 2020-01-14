create table promotion(
id int primary key,
label text
);

create table qrcode(
id int primary key,
promotionID int,
constraint fk_promotion_qrcode foreign key (promotionID) references promotion(id)
);














































































