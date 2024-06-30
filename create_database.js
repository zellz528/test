let General = require("./General/general.js");
const async = require("async");
const config = require("./config");

    async.waterfall(
        [
            (callback) => {

                let createQuery = "create sequence industry_change_application_id_seq as integer; ";
                General.postgreQuery(createQuery, (err, data) => {
                    if (err) {
                        callback(err);
                       
                    } else {
                      
                        callback();
                    }
                });
            },
            (callback) => {

                let createQuery = "CREATE TYPE resident_registration AS ENUM ('E_RESIDENCY', 'RESIDENCY', 'LIMITED_E_RESIDENCY');";
                General.postgreQuery(createQuery, (err, data) => {
                    if (err) {
                        callback(err);
                       
                    } else {
                      
                        callback();
                    }
                });
            },
            (callback) => {
                let createQuery = "CREATE TYPE resident_registration_subtype AS ENUM ('HONDURAN', 'INTERNATIONAL');";
                General.postgreQuery(createQuery, (err, data) => {
                    if (err) {
                        callback(err);
                       
                    } else {
                      
                        callback();
                    }
                });
            },
            (callback) => {
                let createQuery = "CREATE TYPE industry AS ENUM ('AGRICULTURAL', 'CONSTRUCTION', 'ENERGY', 'FINANCE_AND_INSURANCE', 'FOOD', 'HEALTH', 'MANUFACTURING', 'MINING_AND_SUBSURFACE', 'PRIVATE_SECURITY', 'WASTE_MANAGEMENT');";
                General.postgreQuery(createQuery, (err, data) => {
                    if (err) {
                        callback(err);
                       
                    } else {
                      
                        callback();
                    }
                });
            },
            (callback) => {
                let createQuery = "CREATE TYPE regulatory_election AS ENUM ('AUSTRALIA', 'AUSTRIA', 'BELGIUM', 'CANADA', 'CHILE', 'ROATAN_COMMON_LAW_CODE', 'DENMARK', 'DUBAI', 'ESTONIA', 'FINLAND', 'FRANCE', 'GERMANY', 'HONDURAS', 'HONG_KONG', 'ICELAND', 'IRELAND', 'ISRAEL', 'ITALY', 'JAPAN', 'LUXEMBOURG', 'MEXICO', 'NETHERLANDS', 'NEW_ZEALAND', 'NORWAY', 'PETITION_FOR_TAILORED_REGULATION_GRANTED', 'PETITION_FOR_TAILORED_REGULATION_PENDING', 'POLAND', 'SINGAPORE', 'SOUTH_KOREA', 'SPAIN', 'SWEDEN', 'SWITZERLAND',  'UK', 'USA');";
                General.postgreQuery(createQuery, (err, data) => {
                    if (err) {
                        callback(err);
                       
                    } else {
                      
                        callback();
                    }
                });
            },
            (callback) => {
                let createQuery = "CREATE TYPE resident_object_status AS ENUM ('ACTIVE','INACTIVE');";
                General.postgreQuery(createQuery, (err, data) => {
                    if (err) {
                        callback(err);
                    } else {
                        callback();
                    }
                });
            },
            (callback) => {
                let createQuery = "CREATE TYPE industry_change_application_object_status AS ENUM ('CURRENT', 'DELETED');";
                General.postgreQuery(createQuery, (err, data) => {
                    if (err) {
                        callback(err);
                    } else {
                        callback();
                    }
                });
            },
            (callback) => {
                let createQuery = "CREATE TYPE industry_change_application_status AS ENUM ('IN_REVIEW', 'APPROVED','REJECTED');";
                General.postgreQuery(createQuery, (err, data) => {
                    if (err) {
                        callback(err);
                    } else {
                        callback();
                    }
                });
            },
            (callback) => {
                let createQuery = ` CREATE TABLE Resident (
                    sub VARCHAR(250) primary key,
                    first_name VARCHAR(200) NOT NULL,
                    last_name VARCHAR(200) NOT NULL,
                    full_name VARCHAR(250) NOT NULL,
                    permit_number BIGINT NOT NULL,
                    permit_number_Qr_Code TEXT,
                    date_Of_Birth DATE NOT NULL,
                    country_Of_Birth VARCHAR(200) NOT NULL,
                    email VARCHAR(200) NOT NULL,
                    citizenship VARCHAR(200) NOT NULL,
                    gender VARCHAR(20) NOT NULL,
                    address json NOT NULL,
                    phone_Number VARCHAR(200) NOT NULL,
                    type_Of_Registration  resident_registration NOT NULL,
                    type_Of_Registration_Sub resident_registration_subtype,
                    industry industry,
                    will_Work_In_Physical_Jurisdiction BOOLEAN NOT NULL,
                    regulatory_Election regulatory_election,
                    regulatory_Election_Sub VARCHAR(250),
                    first_Registration_Date DATE NOT NULL,
                    next_Subscription_Payment_Date DATE NOT NULL,
                    profile_Picture VARCHAR(250) NOT NULL,
                    status resident_object_status NOT NULL,
                    residency_End_Date DATE
                    
                );`
                General.postgreQuery(createQuery, (err, data) => {
                    if (err) {
                        callback(err);
                    } else {
                        callback();
                    }
                });
            },
            (callback) => {
                let createQuery = `CREATE TABLE Industry_change_application (
                    id INTEGER default nextval('industry_change_application_id_seq') NOT NULL,
                    resident_sub VARCHAR(250) NOT NULL,
                    "current" JSON NOT NULL,
                    requested JSON NOT NULL,
                    status industry_change_application_status NOT NULL,
                    submitted_at TIMESTAMP,
                    decision JSON,
                    created_at TIMESTAMP NOT NULL,
                    created_by VARCHAR(250),
                    updated_at TIMESTAMP NOT NULL,
                    updated_by VARCHAR(250),
                    object_status industry_change_application_object_status NOT NULL
                )`;
                General.postgreQuery(createQuery, (err, data) => {
                    if (err) {
                        callback(err);
                    } else {
                        callback();
                    }
                });
            },
          
    ],
    (err) => {
        
    }
    );



