-- ucr user create
-- dcr datetime create
-- icr IP Client create
-- uch user change
-- dch datetime change
-- ich IP Client change
-- ulm user last modified
-- dlm datetime last modified
-- ilm IP Client last modified;
-- drop database if exists {db_client}; 
create database if not exists {db_client}; 
create table if not exists {db_client}.menu(
  menuid varchar(50),
  menulabel varchar(100),
  parentmenu varchar(50),
  levelmenu integer,
  menuicon varchar(200),
  target varchar(200),
  menuorder integer,
  isleaf integer,
  primary key(menuid)
);
delete from {db_client}.menu;
insert into {db_client}.menu values ('1','Sales','0','1','nav-icon fas fa-tachometer-alt',null,1,0);
insert into {db_client}.menu values ('11','Marketplace','1','2','nav-icon fas fa-edit','/hydakur/jualbeli/form_marketplace/index',1,1);
insert into {db_client}.menu values ('9','Master Data','0','1','nav-icon fas fa-briefcase',null,1,0);
insert into {db_client}.menu values ('91','Loyal Member','9','2','nav-icon fas fa-user-edit','/hydakur/datamaster/mastercust/index',1,1);
insert into {db_client}.menu values ('92','Master Produk','9','2','nav-icon ion ion-clipboard mr-1','/hydakur/datamaster/masterbarang/index',1,1);

create table if not exists {db_client}.userorg(
  userid varchar(50),
  packageid varchar(50),
  username varchar(200),
  userfullname varchar(200),
  orgid varchar(50),
  password varchar(200),
  lastlogin datetime,
  iplogin varchar(200),
  email varchar(200),
  emaillinkdt datetime,
  emaillink varchar(200),
  emailverified char(1),
  emaildtverified datetime,
  emailipverified varchar(100),
  phone varchar(50),
  phoneotpdt datetime,
  phoneotp varchar(20),
  phoneverified char(1),
  phonedtverified datetime,
  phoneipverified varchar(100),
  roleid varchar(50),
  islocked char(1),
  failedlogin integer,
  failedloginip varchar(200),
  failedlogin2 integer,
  failedloginip2 varchar(200),
  failedlogin3 integer,
  failedloginip3 varchar(200),
  primary key(userid)
);
delete from {db_client}.userorg;
insert into {db_client}.userorg (userid,packageid,username,userfullname,orgid,password,lastlogin,iplogin,email,emailverified,phoneverified,roleid) 
values ('admin','AA00000008','admin','administrator core','AA00000001',md5('hydapps^&*90'),null,null,'haris.yuniarsa@gmail.com','V','V','admin');

create table if not exists {db_client}.rolemenu(
  ucr varchar(100),
  dcr datetime,
  icr varchar(100),
  uch varchar(100),
  dch datetime,
  ich varchar(100),
  ulm varchar(100),
  dlm datetime,
  roleid varchar(50),
  menuid varchar(50),
  primary key(roleid,menuid)
);
delete from {db_client}.rolemenu;
insert into {db_client}.rolemenu (roleid,menuid) values ('oprinput',11);
insert into {db_client}.rolemenu (roleid,menuid) values ('admin',11);
insert into {db_client}.rolemenu (roleid,menuid) values ('superadmin',11);
insert into {db_client}.rolemenu (roleid,menuid) values ('admin',91);
insert into {db_client}.rolemenu (roleid,menuid) values ('superadmin',91);
insert into {db_client}.rolemenu (roleid,menuid) values ('admin',92);
insert into {db_client}.rolemenu (roleid,menuid) values ('superadmin',92);

create table if not exists {db_client}.master_cabangIDHYD(
  ucr varchar(100),
  dcr datetime,
  icr varchar(100),
  uch varchar(100),
  dch datetime,
  ich varchar(100),
  ulm varchar(100),
  dlm datetime,
  ilm varchar(100),
  idcabang varchar(20),
  idcabangalias varchar(200),
  namacabang varchar(200),
  idref varchar(100),
  alamat text,
  notelp varchar(100),
  idwa varchar(100),
  idtelegram varchar(100),
  email varchar(200),
  idcabangparent varchar(20),
  statuscabang varchar(10), -- active, suspend
  primary key(idcabang)
);

create table if not exists {db_client}.globalparam(
  ucr varchar(100),
  dcr datetime,
  icr varchar(100),
  uch varchar(100),
  dch datetime,
  ich varchar(100),
  ulm varchar(100),
  dlm datetime,
  ilm varchar(100),
  kodeparam varchar(100),
  ketparam varchar(200),
  nilaiparam varchar(200),
  statusparam char(1), -- E enable to modified, D disable to modified
  primary key(kodeparam)
);
delete from {db_client}.globalparam;
insert into {db_client}.globalparam (kodeparam,ketparam,nilaiparam,statusparam) values ('lociddefault','Lokasi Default','LOC00168','S');
insert into {db_client}.globalparam (kodeparam,ketparam,nilaiparam,statusparam) values ('nama_masjid','Nama Masjid','Masjid Al Ikhlas','S');
insert into {db_client}.globalparam (kodeparam,ketparam,nilaiparam,statusparam) values ('alamat_masjid','Alamat Masjid','Komplek Buana Citra Ciwastra, Bojongsoang, Kab Bandung','S');
insert into {db_client}.globalparam (kodeparam,ketparam,nilaiparam,statusparam) values ('iqamahsubuh','Waktu Tunggu Iqama Subuh','10','S');
insert into {db_client}.globalparam (kodeparam,ketparam,nilaiparam,statusparam) values ('iqamahdzuhur','Waktu Tunggu Iqama Dzuhur','10','S');
insert into {db_client}.globalparam (kodeparam,ketparam,nilaiparam,statusparam) values ('iqamahashar','Waktu Tunggu Iqama Ashar','10','S');
insert into {db_client}.globalparam (kodeparam,ketparam,nilaiparam,statusparam) values ('iqamahmaghrib','Waktu Tunggu Iqama Maghrib','9','S');
insert into {db_client}.globalparam (kodeparam,ketparam,nilaiparam,statusparam) values ('iqamahisya','Waktu Tunggu Iqama Isya','10','S');

create table if not exists {db_client}.globalparam_IDHYD(
  ucr varchar(100),
  dcr datetime,
  icr varchar(100),
  uch varchar(100),
  dch datetime,
  ich varchar(100),
  ulm varchar(100),
  dlm datetime,
  ilm varchar(100),
  kodeparam varchar(100),
  ketparam varchar(200),
  nilaiparam varchar(200),
  statusparam char(1), -- E enable to modified, D disable to modified
  primary key(kodeparam)
);

create table if not exists {db_client}.calculationmethod(
  ucr varchar(100),
  dcr datetime,
  icr varchar(100),
  uch varchar(100),
  dch datetime,
  ich varchar(100),
  ulm varchar(100),
  dlm datetime,
  ilm varchar(100),
  cmid varchar(20),
  cmdesc varchar(200),
  cmtype varchar(20), -- RI kemenag, ALADHAN aladhan API
  primary key(cmid)
);
delete from {db_client}.calculationmethod;
insert into {db_client}.calculationmethod (cmid,cmdesc,cmtype) values ('CM0001','Kemenag','RI');
insert into {db_client}.calculationmethod (cmid,cmdesc,cmtype) values ('CM0002','ALADHAN API','ALADHAN');

create table if not exists {db_client}.locationlonlat(
  ucr varchar(100),
  dcr datetime,
  icr varchar(100),
  uch varchar(100),
  dch datetime,
  ich varchar(100),
  ulm varchar(100),
  dlm datetime,
  ilm varchar(100),
  locid varchar(20), -- id generated
  lockey varchar(20), -- from myquran API
  locname varchar(100),
  locdesc varchar(200),
  timezone varchar(100),
  lon varchar(200),
  lat varchar(200),
  cmtype varchar(20), -- RI kemenag, ALADHAN aladhan API
  primary key(cmid)
);
create table if not exists {db_client}.gregtohijri(
  ucr varchar(100),
  dcr datetime,
  icr varchar(100),
  uch varchar(100),
  dch datetime,
  ich varchar(100),
  ulm varchar(100),
  dlm datetime,
  ilm varchar(100),
  gregdate varchar(20),
  hijridate varchar(20),
  primary key(gregdate,hijridate)
);
create table if not exists {db_client}.scheduleprayer_IDHYD(
  ucr varchar(100),
  dcr datetime,
  icr varchar(100),
  uch varchar(100),
  dch datetime,
  ich varchar(100),
  ulm varchar(100),
  dlm datetime,
  ilm varchar(100),
  hijridate varchar(20),
  hijridatedesc varchar(100),
  gregdate varchar(20),
  gregdatedesc varchar(100),
  cmid varchar(20),
  locid varchar(20),
  lockey varchar(20),
  timezone varchar(100),
  imsak varchar(5),
  subuh varchar(5),
  terbit varchar(5),
  dhuha varchar(5),
  dzuhur varchar(5),
  ashar varchar(5),
  sunset varchar(5),
  maghrib varchar(5),
  isya varchar(5),
  firstthird varchar(5),
  midnight varchar(5),
  lastthird varchar(5),
  primary key(gregdate)
);
create table if not exists {db_client}.scheduleprayer_reference(
  ucr varchar(100),
  dcr datetime,
  icr varchar(100),
  uch varchar(100),
  dch datetime,
  ich varchar(100),
  ulm varchar(100),
  dlm datetime,
  ilm varchar(100),
  hijridate varchar(20),
  hijridatedesc varchar(100),
  gregdate varchar(20),
  gregdatedesc varchar(100),
  cmid varchar(20),
  locid varchar(20),
  lockey varchar(20),
  timezone varchar(100),
  imsak varchar(5),
  subuh varchar(5),
  terbit varchar(5),
  dhuha varchar(5),
  dzuhur varchar(5),
  ashar varchar(5),
  sunset varchar(5),
  maghrib varchar(5),
  isya varchar(5),
  firstthird varchar(5),
  midnight varchar(5),
  lastthird varchar(5),
  primary key(gregdate,cmid)
);
create table if not exists {db_client}.officer_schedule(
  ucr varchar(100),
  dcr datetime,
  icr varchar(100),
  uch varchar(100),
  dch datetime,
  ich varchar(100),
  ulm varchar(100),
  dlm datetime,
  ilm varchar(100),
  hijridate varchar(20),
  hijridatedesc varchar(100),
  gregdate varchar(20),
  gregdatedesc varchar(100),
  daydesc varchar(100),
  muadzin varchar(100),
  imam varchar(100),
  khatib varchar(100),
  adzanmalam varchar(100),
  pjimsak varchar(100),
  adzansubuh varchar(100),
  adzandzuhur varchar(100),
  adzanashar varchar(100),
  adzanmaghrib varchar(100),
  adzanisya varchar(100),  
  imamsubuh varchar(100),
  imamdzuhur varchar(100),
  imamashar varchar(100),
  imammaghrib varchar(100),
  imamisya varchar(100),  
  primary key(gregdate)
);

/*
jadwal shalat
hijridate
hijridatedesc
gregdate
gregdatedesc
method
location
timezone
imsak
subuh
terbit
dhuha
dzuhur
ashar
sunset
maghrib
isya
Firstthird
Midnight
Lastthird

hijridate
gregdate

location
desc
timezone
idlocation
lon
lat

list method

param adjustment shalat (min)
param location
param method
option adjustment hijri date
*/