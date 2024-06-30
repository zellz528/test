let General = require("./General/general.js");
const async = require("async");
let residentsList = [];

let resident1 = { sub: "resident1",
    first_name: "Mihkel",
    last_name:"Maasikas",
    full_name:"Mihkel Maasikas",
    permit_number:1234567 ,
	permit_number_Qr_Code:"QR_code 1234567",
	date_Of_Birth:"1990-10-12" ,
	country_Of_Birth:"Latvia",
	email:"mihkel.maasikas@gmail.com",
	citizenship:"Latvia",
	gender:"male",
	address:{
        country:"Estonia",
        city:"Tartu",
        state:"Tartumaa",
        street_address:"Jõe 10",
        zip_code:"12345",
        is_verified_address:true
    },
	phone_Number:"5112233",
	type_Of_Registration:"RESIDENCY",
	type_Of_Registration_Sub:"HONDURAN",
	industry:"HEALTH",
	will_Work_In_Physical_Jurisdiction:true,
	regulatory_Election:"ESTONIA",

	first_Registration_Date:"2021-07-15",
	next_Subscription_Payment_Date:"2024-07-15",
	profile_Picture:"picture1.jpg",
	"status":"ACTIVE",
	residency_End_Date:"2025-04-10"
	
}


let resident2 = { sub: "resident2",
    first_name: "Juuli",
    last_name:"Juss",
    full_name:"Juuli Juss",
    permit_number:789789 ,
	permit_number_Qr_Code:"QR_code 789789",
	date_Of_Birth:"1987-09-18" ,
	country_Of_Birth:"Denmark",
	email:"juuli.juss@gmail.com",
	citizenship:"Denmark",
	gender:"female",
	address:{
        country:"Estonia",
        city:"Tallinn",
        state:"Harjumaa",
        street_address:"Põllu 22",
        zip_code:"12375",
        is_verified_address:true
    },
	phone_Number:"5152243",
	type_Of_Registration:"E_RESIDENCY",
	type_Of_Registration_Sub:"INTERNATIONAL",
	industry:"HEALTH",
	will_Work_In_Physical_Jurisdiction:true,
	regulatory_Election:"DENMARK",

	first_Registration_Date:"2021-07-15",
	next_Subscription_Payment_Date:"2024-07-15",
	profile_Picture:"picture1.jpg",
	"status":"ACTIVE",
	residency_End_Date:"2025-04-10"
	
}

residentsList.push(resident1);
residentsList.push(resident2);

async.forEach(residentsList, (resident, callback) => {
    let insertQuery = `INSERT INTO resident (sub, first_name, last_name, full_name, permit_number,
        permit_number_Qr_Code, date_Of_Birth, country_Of_Birth, email, citizenship,
        gender, address, phone_Number, type_Of_Registration,
        type_Of_Registration_Sub,
        industry, will_Work_In_Physical_Jurisdiction, regulatory_Election,
        regulatory_Election_Sub, first_Registration_Date, next_Subscription_Payment_Date, profile_Picture, status,residency_End_Date)  VALUES (`;

        insertQuery += General.PrepareDbDataNulls(resident.sub).substring(2);
        insertQuery += General.PrepareDbDataNulls(resident.first_name);
        insertQuery += General.PrepareDbDataNulls(resident.last_name);
        insertQuery += General.PrepareDbDataNulls(resident.full_name);
        insertQuery += General.PrepareDbDataNulls(resident.permit_number);
        insertQuery += General.PrepareDbDataNulls(Buffer.from(resident.permit_number_Qr_Code).toString('base64'));
        insertQuery += General.PrepareDbDataNulls(resident.date_Of_Birth);
        insertQuery += General.PrepareDbDataNulls(resident.country_Of_Birth);
        insertQuery += General.PrepareDbDataNulls(resident.email);
        insertQuery += General.PrepareDbDataNulls(resident.citizenship);
        insertQuery += General.PrepareDbDataNulls(resident.gender);
        insertQuery += General.PrepareDbDataNulls(JSON.stringify(resident.address));
        insertQuery += General.PrepareDbDataNulls(resident.phone_Number);
        insertQuery += General.PrepareDbDataNulls(resident.type_Of_Registration);
        insertQuery += General.PrepareDbDataNulls(resident.type_Of_Registration_Sub);
        insertQuery += General.PrepareDbDataNulls(resident.industry);
        insertQuery += General.PrepareDbDataNulls(resident.will_Work_In_Physical_Jurisdiction);
        insertQuery += General.PrepareDbDataNulls(resident.regulatory_Election);
        insertQuery += General.PrepareDbDataNulls(resident.regulatory_Election_Sub);
        insertQuery += General.PrepareDbDataNulls(resident.first_Registration_Date);
        insertQuery += General.PrepareDbDataNulls(resident.next_Subscription_Payment_Date);
        insertQuery += General.PrepareDbDataNulls(Buffer.from(resident.profile_Picture).toString('base64'));
        insertQuery += General.PrepareDbDataNulls(resident.status);
        insertQuery += General.PrepareDbDataNulls(resident.residency_End_Date);
        insertQuery += ')';

    General.postgreQuery(insertQuery, (err, data) => {
        if (err) {
          console.log("Error while inserting data", err)
        } else {
          
          setTimeout(callback, 0);
        }
      });
    
   
  },
  (err) => {

  });