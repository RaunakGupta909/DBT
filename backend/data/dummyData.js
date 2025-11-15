// Dummy data seeder for DBT Portal demo
const mongoose = require('mongoose');
const Student = require('../models/Student');
const Parent = require('../models/Parent');
const Volunteer = require('../models/Volunteer');
const Teacher = require('../models/Teacher');
const Admin = require('../models/Admin');
const Campaign = require('../models/Campaign');
const DBTStatus = require('../models/DBTStatus');
const VerificationLog = require('../models/VerificationLog');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/dbt_portal_demo';

async function seed(){
  await mongoose.connect(MONGO_URI);
  await mongoose.connection.db.dropDatabase();

  const students = await Student.create([
    {name:'Asha Sharma', aadhaar:'111122223333', fatherName:'Ramesh Sharma', fatherAadhaar:'999988887777', mobile:'9000000001', linkedWithBank:true, dbtEnabled:true, schoolId:'SCH1'},
    {name:'Rahul Gupta', aadhaar:'222233334444', fatherName:'Suresh Gupta', fatherAadhaar:'888877776666', mobile:'9000000002', linkedWithBank:true, dbtEnabled:false, schoolId:'SCH1'},
    {name:'Meena Patil', aadhaar:'333344445555', fatherName:'Vijay Patil', fatherAadhaar:'777766665555', mobile:'9000000003', linkedWithBank:false, dbtEnabled:false, schoolId:'SCH2'}
  ]);

  const parents = await Parent.create([
    {name:'Ramesh Sharma', aadhaar:'999988887777', mobile:'9000000011', children:[students[0]._id]},
    {name:'Suresh Gupta', aadhaar:'888877776666', mobile:'9000000012', children:[students[1]._id]}
  ]);

  const volunteers = await Volunteer.create([
    {name:'Volunteer One', aadhaar:'555566667777', mobile:'9000000100', verified:true, credits:40},
    {name:'Volunteer Two', aadhaar:'444455556666', mobile:'9000000101', verified:false, credits:0}
  ]);

  const teachers = await Teacher.create([{name:'Mrs. Rao', mobile:'9000000200', teacherId:'T1', classes:['6A','6B'], schoolId:'SCH1'}]);
  const admins = await Admin.create([{name:'Principal A', mobile:'9000000300', schoolId:'SCH1'}]);

  const campaigns = await Campaign.create([
    {title:'Free Health Camp - Current', description:'Health checkups', startDate:new Date(), endDate:new Date(Date.now()+7*24*3600*1000), status:'current'},
    {title:'Scholarship Drive - Upcoming', description:'Scholarships', startDate:new Date(Date.now()+10*24*3600*1000), endDate:new Date(Date.now()+20*24*3600*1000), status:'upcoming'}
  ]);

  await DBTStatus.create([
    {aadhaar:'111122223333', linkedWithBank:true, dbtEnabled:true, lastUpdated:new Date(), amount:5000},
    {aadhaar:'222233334444', linkedWithBank:true, dbtEnabled:false, lastUpdated:new Date(), amount:0}
  ]);

  await VerificationLog.create([{aadhaar:'111122223333', checkedBy:volunteers[0]._id, role:'volunteer', date:new Date(), result:'DBT Enabled'}]);

  console.log('Seeded demo data');
  process.exit(0);
}

seed().catch(e=>{console.error(e);process.exit(1)});
