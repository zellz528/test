let General = require("../General/general.js");
const async = require("async");
const jwt = require('jsonwebtoken');
const config = require("../config");

let industryList = ['AGRICULTURAL', 'CONSTRUCTION', 'ENERGY', 'FINANCE_AND_INSURANCE', 'FOOD', 'HEALTH', 'MANUFACTURING', 'MINING_AND_SUBSURFACE', 'PRIVATE_SECURITY', 'WASTE_MANAGEMENT'];
let electionList = ['AUSTRALIA', 'AUSTRIA', 'BELGIUM', 'CANADA', 'CHILE', 'ROATAN_COMMON_LAW_CODE', 'DENMARK', 'DUBAI', 'ESTONIA', 'FINLAND', 'FRANCE', 'GERMANY', 'HONDURAS', 'HONG_KONG', 'ICELAND', 'IRELAND', 'ISRAEL', 'ITALY', 'JAPAN', 'LUXEMBOURG', 'MEXICO', 'NETHERLANDS', 'NEW_ZEALAND', 'NORWAY', 'PETITION_FOR_TAILORED_REGULATION_GRANTED', 'PETITION_FOR_TAILORED_REGULATION_PENDING', 'POLAND', 'SINGAPORE', 'SOUTH_KOREA', 'SPAIN', 'SWEDEN', 'SWITZERLAND',  'UK', 'USA'];

function validateIndustryChangeApplication(jsonObject, validateCallback) {
    async.waterfall(
        [
            (callback) => {
                if (jsonObject.willWorkInPhysicalJurisdiction == false || jsonObject.willWorkInPhysicalJurisdiction == true) {
                    callback();  
                }
                else {
                    validateCallback('willWorkInPhysicalJurisdiction must be true or false', null)
                }
            
            },
            (callback) => {
                if(jsonObject.willWorkInPhysicalJurisdiction == false) {
                    if (jsonObject.industry === null && jsonObject.regulatoryElection === null) {
                        validateCallback(null, true);
            
                    } else if (jsonObject.industry != null) {
                        validateCallback('industry must be null', null);

                    } else {
                        validateCallback('election must be null', null);
                    }
                } else {
                    callback();
                }
            },
            (callback) => {
                if(jsonObject.willWorkInPhysicalJurisdiction == true ) {
                    if(industryList.includes(jsonObject.industry) && electionList.includes(jsonObject.regulatoryElection)){
                
                        validateCallback(null, true);
            
                    } else {
                        validateCallback("Election or industry is not correct", null)
                    }
                }
            },
    ],
    (err) => {
        
    }
    );
}


function compareIndustryData(newData, oldData, validateCallback) {
    if(newData.willWorkInPhysicalJurisdiction == oldData.will_work_in_physical_jurisdiction
        && newData.industry == oldData.industry
        && newData.regulatoryElection == oldData.regulatory_election
        && newData.regulatoryElectionSub == oldData.regulatory_election_sub) {
         
            validateCallback("Data matches with old data", null)

    } else {
        validateCallback(null, true)
    }
}

function insertIntoIndustryChangeTable(newData, oldData, callback) {

    const decodedUser = jwt.verify(config.user.hash, config.token, { algorithms: ['HS256'] });
    const username = decodedUser.username;

    let current = {};
    current.willWorkInPhysicalJurisdiction = oldData.will_work_in_physical_jurisdiction;
    current.industry = oldData.industry;
    current.regulatoryElection  = oldData.regulatory_election;
    current.regulatoryElectionSub = oldData.regulatory_election_sub;
    
    let requested = {};
    requested.willWorkInPhysicalJurisdiction = newData.willWorkInPhysicalJurisdiction;
    requested.industry = newData.industry;
    requested.regulatoryElection  = newData.regulatoryElection;
    requested.regulatoryElectionSub = newData.regulatoryElectionSub;

    let decision = {};
    if (newData.status == 'APPROVED'){

        decision.decidedAt = new Date().toISOString();
    } else {
            decision.decidedAt = null;
    }
    if (newData.status == 'APPROVED') {
        decision.decidedBy = 'AUTOMATIC';
    } else {
        decision.decidedBy = null;
    }
    decision.rejectionReason = null;
       

   let insertQuery =  `INSERT INTO industry_change_application (
    resident_sub, "current", requested, status, submitted_at, decision, created_at, created_by, updated_at, updated_by, object_status
   ) VALUES (`;
   insertQuery += General.PrepareDbDataNulls(newData.residentSub).substring(2);
   insertQuery += General.PrepareDbDataNulls(JSON.stringify(current));
   insertQuery += General.PrepareDbDataNulls(JSON.stringify(requested));
   insertQuery += General.PrepareDbDataNulls(newData.status);
   insertQuery += General.PrepareDbDataNulls(new Date().toISOString());
   
   insertQuery += General.PrepareDbDataNulls(JSON.stringify(decision));
  
   insertQuery += General.PrepareDbDataNulls(new Date().toISOString());
   insertQuery += General.PrepareDbDataNulls(username);
   insertQuery += General.PrepareDbDataNulls(new Date().toISOString());
   insertQuery += General.PrepareDbDataNulls(username);
   insertQuery += General.PrepareDbDataNulls('CURRENT');
   insertQuery +=  `)`;
   General.postgreQuery(insertQuery, (err, data) => {
    if (err) {
        callback(err);
       
    } else {
      
        callback();
    }
  });
}


function changeResident(newData, callback) {
  
    let updateQuery =  `UPDATE resident SET
    will_work_in_physical_jurisdiction = ` + General.PrepareDbDataNulls(newData.willWorkInPhysicalJurisdiction).substring(2) + `
    ,  industry = ` + General.PrepareDbDataNulls(newData.industry).substring(2) + `
    ,  regulatory_election = ` + General.PrepareDbDataNulls(newData.regulatoryElection).substring(2) + `
    ,  regulatory_election_sub = ` + General.PrepareDbDataNulls(newData.regulatoryElectionSub).substring(2) + `
    WHERE sub = ` +  General.PrepareDbDataNulls(newData.residentSub).substring(2);
      
       General.postgreQuery(updateQuery, (err, data) => {
        if (err) {
            callback(err);
           
        } else {
          
            callback();
        }
      });

}


let nest = {
    getIndustryChangeApplicationById: (req, res) => {
      
        if(req.params.id){
            let selectQuery = `SELECT *  FROM industry_change_application
            WHERE id = '` + req.params.id +`'
            AND object_status = 'CURRENT' `
            General.postgreQuery(selectQuery, (err, data) => {
                if (err) {
                    res.status(400).json({ error: err });
                } else {
                    res.json(data.rows);
                }
              });
            
        } else {
            res.status(400).json({ error: "ID parameter is missing" });
        }
    }, 
    getIndustryChangeApplication: (req, res) => {
     
        let reqData = req.body;
        let selectQuery;
        let resultData;
        if(reqData) {
            async.waterfall(
                [
                    (callback) => {
                        if(reqData && reqData.statuses && reqData.statuses.length > 0) {
                            let statusString = "(";
            
                            async.forEachLimit(reqData.statuses, 1, (status, statusCallback) => {
                                statusString += "'" + status + "' ,";
                                setTimeout(statusCallback, 0);
                            },
                            (err) => {
                                statusString = statusString.slice(0, -2);
                              
                                statusString += ")";
                                selectQuery = `SELECT *  FROM industry_change_application
                                    WHERE resident_sub = '` + reqData.residentSub +`'
                                    AND status IN ` + statusString + `
                                    AND object_status = 'CURRENT' `
                                    
                                callback();
                            });
            
                            
                        } else {
                            selectQuery = `SELECT *  FROM industry_change_application
                            WHERE resident_sub = '` + reqData.residentSub +`'
                            AND object_status = 'CURRENT' `
                            callback();
                        }
                        
                    },
                    (callback) => {
                        General.postgreQuery(selectQuery, (err, data) => {
                            if (err) {
                                res.status(400).json({ error: err });
                            } else {
                                resultData = data.rows;
                                callback();
                            }
                          });
                    },
                ],
                (err, result) => {
                  
                    res.json(resultData);
                }
                )
            } else {
            res.status(400).json({ error: "Body is missing" });
        }
    },
    addIndustryChangeApplication: (req, res) => {
        let reqData = req.body;
        reqData.token = req.header('Authorization')?.split(' ')[1];
    
        if(reqData) {
            validateIndustryChangeApplication(reqData ,(error, isValid) => {
             
                if(error) {
                    res.status(400).json({ error: error });
                } else {
                    let selectQuery = `select *  from resident
                    WHERE sub = '` + reqData.residentSub +`'`;
                   
                    General.postgreQuery(selectQuery, (err, data) => {
                        if (err) {
                            res.status(400).json({ error: err });
                        } else {
                            let residentData =  { ...data.rows[0] };
                   
                            if(residentData.status == 'ACTIVE' && (residentData.type_of_registration == 'E_RESIDENCY' || residentData.type_of_registration == 'RESIDENCY' )) {
                                compareIndustryData(reqData, residentData, (error, isCompValid) => {
                                    if(error) {
                                        res.status(400).json({ error: error });
                                    } else {
                                        if(reqData.willWorkInPhysicalJurisdiction) {
                                            reqData.status = "IN_REVIEW"
                                        } else {
                                            reqData.status = "APPROVED"
                                        }
                                        insertIntoIndustryChangeTable(reqData, residentData, (error, result) => {

                                            if(error) {
                                                res.status(400).json({ error: error });
                                            } else {
                                                if(reqData.status = "APPROVED") {
                                                    changeResident(reqData, (error, result) => {
                                                        if(error){
                                                            res.status(400).json({ error: error });
                                                        } else {
                                                            res.status(200).json({ message: 'Success! Industry change application and resident has been changed' });
                                            
                                                        }
                                                    })
                                                } else {
                                                    res.status(200).json({ message: 'Success! Industry change application has been changed' });
                                                }
                                            }
                                        });
                                    }
                                })
                            } else if (residentData.status != 'ACTIVE') {
                                res.status(400).json({ error: "Resident is inactive" });
                            } else {
                                res.status(400).json({ error: "Type of residency is wrong" });
                            }
                        }
                    });
                }
            })
        } else {
            res.status(400).json({ error: "Body is missing" });
        }
    },
    deleteIndustryChangeApplicationById: (req, res) => {
      
        if(req.params.id) {
            let selectQuery = `SELECT *  FROM industry_change_application
            WHERE id = '` + req.params.id +`'
            AND status = 'IN_REVIEW' 
            AND object_status != 'DELETED'`
            General.postgreQuery(selectQuery, (err, data) => {

                if (err) {
                    res.status(400).json({ error: err });
                } else {
                    if(data && data.rows && data.rows.length > 0) {

                        let updateQuery = "UPDATE industry_change_application SET object_status = 'DELETED' WHERE id = " + req.params.id;
                        General.postgreQuery(updateQuery, (err, data) => { 
                            if (err) {
                                res.status(400).json({ error: err });
                            } else {
                                res.status(200).json({ message: 'Success! Industry change application deleted' });
                            }
                        });
                   } else {
                    res.status(400).json({ error: "Can't delete this object" });
                   }
                }
              });
            
        } else {
            res.status(400).json({ error: "ID parameter is missing" });
        }
    }, 
}

module.exports = nest;

