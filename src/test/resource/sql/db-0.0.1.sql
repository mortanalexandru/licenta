BEGIN;
create table UserConnection (
    userId varchar(255) not null,
    providerId varchar(255) not null,
    providerUserId varchar(255),
    rank int not null,
    displayName varchar(255),
    profileUrl varchar(512),
    imageUrl varchar(512),
    accessToken varchar(255) not null,
    secret varchar(255),
    refreshToken varchar(255),
    expireTime bigint,
    primary key (userId, providerId, providerUserId));
create unique index UserConnectionRank on UserConnection(userId, providerId, rank);
COMMIT;


BEGIN;
create table User (
    idUser int auto_increment not null,
    email varchar(150),
    password varchar(150),
    display_name varchar(45),
    birthdate date,
    gender varchar(45),
    country varchar(45),
    providerId varchar(255),
    primary key (idUser)
);
COMMIT;


BEGIN;
create table User_Role (
    idUser int not null,
    idRole int not null,
    primary key (idUser, idRole)
);
COMMIT;


BEGIN;
create table Role (
    idRole int not null,
    role_name varchar(45),
    primary key (idRole)
);
COMMIT;

CREATE TABLE persistent_logins (
    username VARCHAR(64) NOT NULL,
    series VARCHAR(64) NOT NULL,
    token VARCHAR(64) NOT NULL,
    last_used TIMESTAMP NOT NULL,
    PRIMARY KEY (series)
);


BEGIN;
create table Language (
    idLanguage int auto_increment not null,
    language_name varchar(45),
    primary key (idLanguage)
COMMIT;


BEGIN;
create table Level (
    idLevel int auto_increment not null,
    level_name varchar(45),
    primary key (idLevel)
);
COMMIT;


BEGIN;
create table Interest (
    idInterest int auto_increment not null,
    interest_name varchar(45),
    primary key (idInterest)
);
COMMIT;

BEGIN;
create table User_Interest (
    idUser int not null,
    idInterest int not null,
    primary key (idUser, idInterest)
);
COMMIT;

BEGIN;
create table User_Language_Level (
    idUser int not null,
    idLanguage int not null,
    idLevel int not null,
    primary key (idUser, idLanguage, idLevel)
);
COMMIT;


BEGIN;
create table Invitation (
    email varchar(64) not null UNIQUE,
    invite_token varchar(200) not null,
    primary key (invite_token)
);
COMMIT;



delete from user_role where idUser > 0
delete from user where idUser > 0
delete from userconnection where userId is not null
insert into Role (idRole, role_name) values (1, "Role_User");
insert into Role (idRole, role_name) values (2, "Role_Admin");
