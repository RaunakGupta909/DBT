// Enhanced dummy data seeder for DBT Portal demo
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Student = require('../models/Student');
const Parent = require('../models/Parent');
const Volunteer = require('../models/Volunteer');
const Teacher = require('../models/Teacher');
const Admin = require('../models/Admin');
const Campaign = require('../models/Campaign');
const DBTStatus = require('../models/DBTStatus');
const VerificationLog = require('../models/VerificationLog');
const User = require('../models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/dbt_portal_demo';

function makeAadhaar(start, i){
  // Generate a 12-digit Aadhaar-like number using a seed
  const base = start + i;
  return base.toString().padStart(12, '0');
}

async function seed(){
  await mongoose.connect(MONGO_URI);
  await mongoose.connection.db.dropDatabase();

  // Create some schools
  const schools = ['SCH1','SCH2','SCH3','SCH4','SCH5'];

  // Create 120 students (>=100 as requested)
  const total = 120;
  const studentDocs = [];
  const parentDocs = [];
  const usersToCreate = [];
  for(let i=1;i<=total;i++){
    const aadhaar = makeAadhaar(600000000000, i);
    const fatherAad = makeAadhaar(700000000000, i);
    const name = `Student ${i}`;
    const fatherName = `Father ${i}`;
    const mobile = `9${(800000000 + i).toString().slice(1)}`;
    const schoolId = schools[i % schools.length];

    studentDocs.push({
      name,
      aadhaar,
      fatherName,
      fatherAadhaar: fatherAad,
      mobile,
      linkedWithBank: i % 3 === 0,
      dbtEnabled: i % 4 === 0,
      schoolId
    });

    parentDocs.push({
      name: fatherName,
      aadhaar: fatherAad,
      mobile: mobile.replace(/^9/,'8'),
      children: []
    });

    // Users: username will be aadhaar, default password 'password123'
    usersToCreate.push({ username: aadhaar, password: 'password123', role: 'student' });
    usersToCreate.push({ username: fatherAad, password: 'password123', role: 'parent' });
  }

  const createdStudents = await Student.create(studentDocs);
  // assign children refs to parents
  for(let i=0;i<createdStudents.length;i++){
    parentDocs[i].children = [createdStudents[i]._id];
  }
  const createdParents = await Parent.create(parentDocs);

  // Create volunteers, teachers, admins
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

  // DBT status and verification logs for some students
  const dbtStatuses = [];
  const verifications = [];
  for(let i=0;i<createdStudents.length;i+=10){
    dbtStatuses.push({ aadhaar: createdStudents[i].aadhaar, linkedWithBank: createdStudents[i].linkedWithBank, dbtEnabled: createdStudents[i].dbtEnabled, lastUpdated: new Date(), amount: createdStudents[i].dbtEnabled ? 5000 : 0 });
    verifications.push({ aadhaar: createdStudents[i].aadhaar, checkedBy: volunteers[0]._id, role: 'volunteer', date: new Date(), result: createdStudents[i].dbtEnabled ? 'DBT Enabled' : 'DBT Not Enabled' });
  }
  await DBTStatus.create(dbtStatuses);
  await VerificationLog.create(verifications);

  // Create user records with hashed password
  for(const u of usersToCreate){
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(u.password, salt);
    try{
      await User.create({ username: u.username, passwordHash: hash, role: u.role });
    }catch(e){
      // ignore duplicates
    }
  }

  console.log(`Seeded ${createdStudents.length} students, ${createdParents.length} parents, volunteers, teachers, admins, and user accounts.`);
  process.exit(0);
}

seed().catch(e=>{console.error(e);process.exit(1)});
