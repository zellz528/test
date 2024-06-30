
If this project is downloaded then it is necessary to install modules as well with npm install
1. download pgadmin
2. create database in there
3. add config.js file and add password for database login
4. in cmd run node create_database.js
5. in cmd run node create_residents.js, it will add data into resident table
6. in cmd run index.js : node index.js
7. Now it is possible to do API requests 
I used postman
example json body for changing industry change application POST /resident-register/industry-change-applications
127.0.0.1:16555/resident-register/industry-change-applications
(don't forget to add config.user.hash data into authorization (I used JWT Bearer with HS256) )
  and body:
  {
  "residentSub":"resident1",
  "willWorkInPhysicalJurisdiction": true,
  "industry":"FOOD",
  "regulatoryElection":"AUSTRALIA",
"regulatoryElectionSub": "Wien"
}

example for getting industry change application 127.0.0.1:16555/resident-register/industry-change-applications/1

example json for filtering/quering industry change applications GET 127.0.0.1:16555/resident-register/industry-change-applications
 {
  "residentSub":"resident1",
  "statuses": ["APPROVED", "IN_REVIEW"]
}

example for deleteing POST 127.0.0.1:16555/resident-register/delete-industry-change-applications/1