import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Student from '../models/Student.js';
import Parent from '../models/Parent.js';
import Teacher from '../models/Teacher.js';
import Admission from '../models/Admission.js';
import Announcement from '../models/Announcement.js';
import Gallery from '../models/Gallery.js';
import Fee from '../models/Fee.js';
import Query from '../models/Query.js';
import { protect, authorize } from '../middleware/auth.js';
import mockStore from '../config/mockStore.js';
import { uploadGallery, uploadAdmissions } from '../middleware/upload.js';

const router = express.Router();

// Apply auth protection & role check to all admin routes
router.use(protect);
router.use(authorize('admin'));

// @desc    Get Admin Dashboard Analytics
// @route   GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    if (mockStore.isMock) {
      const studentCount = (await mockStore.find('students')).length;
      const parentCount = (await mockStore.find('parents')).length;
      const teacherCount = (await mockStore.find('teachers')).length;
      
      const admissions = await mockStore.find('admissions');
      const pendingAdmissions = admissions.filter(a => a.status === 'pending').length;

      const queries = await mockStore.find('queries');
      const unreadQueries = queries.filter(q => q.status === 'unread').length;

      const totalRevenue = (await mockStore.find('fees'))
        .filter(f => f.status === 'paid')
        .reduce((sum, f) => sum + f.amount, 0);

      return res.json({
        success: true,
        stats: {
          students: studentCount,
          parents: parentCount,
          teachers: teacherCount,
          pendingAdmissions,
          unreadQueries,
          totalRevenue
        }
      });
    }

    // MongoDB
    const studentCount = await Student.countDocuments();
    const parentCount = await Parent.countDocuments();
    const teacherCount = await Teacher.countDocuments();
    const pendingAdmissions = await Admission.countDocuments({ status: 'pending' });
    const unreadQueries = await Query.countDocuments({ status: 'unread' });
    
    const paidFees = await Fee.find({ status: 'paid' });
    const totalRevenue = paidFees.reduce((sum, f) => sum + f.amount, 0);

    res.json({
      success: true,
      stats: {
        students: studentCount,
        parents: parentCount,
        teachers: teacherCount,
        pendingAdmissions,
        unreadQueries,
        totalRevenue
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// ADMISSIONS MANAGEMENT
// ==========================================

// @desc    Get all admission applications
// @route   GET /api/admin/admissions
router.get('/admissions', async (req, res) => {
  try {
    if (mockStore.isMock) {
      const list = await mockStore.find('admissions');
      return res.json({ success: true, count: list.length, data: list });
    }
    const list = await Admission.find().sort({ submissionDate: -1 });
    res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update admission status (Approve/Reject)
// @route   PUT /api/admin/admissions/:id
router.put('/admissions/:id', async (req, res) => {
  const { status, remarks, password } = req.body;

  try {
    if (mockStore.isMock) {
      const admission = await mockStore.findById('admissions', req.params.id);
      if (!admission) return res.status(404).json({ success: false, message: 'Application not found' });

      admission.status = status;
      admission.remarks = remarks || '';
      await mockStore.findByIdAndUpdate('admissions', req.params.id, admission);

      // If approved, provision a Parent User account and Student record
      if (status === 'approved') {
        // Check if Parent User already exists
        let parentUser = await mockStore.findOne('users', { email: admission.parentDetails.email });
        let parentProfile;

        if (!parentUser) {
          const salt = bcrypt.genSaltSync(10);
          const defaultPasswordHash = bcrypt.hashSync(password || 'parent123', salt);
          
          parentUser = await mockStore.create('users', {
            name: admission.parentDetails.fatherName || admission.parentDetails.motherName,
            email: admission.parentDetails.email,
            password: defaultPasswordHash,
            role: 'parent',
            profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'
          });

          parentProfile = await mockStore.create('parents', {
            userId: parentUser._id,
            name: parentUser.name,
            email: parentUser.email,
            phone: admission.parentDetails.phone,
            address: admission.parentDetails.address,
            children: []
          });
        } else {
          parentProfile = await mockStore.findOne('parents', { userId: parentUser._id });
        }

        // Get an available teacher
        const teachers = await mockStore.find('teachers');
        const teacherId = teachers[0]?._id || null;

        // Create the Student
        const newStudent = await mockStore.create('students', {
          name: admission.studentDetails.name,
          dateOfBirth: admission.studentDetails.dateOfBirth,
          gender: admission.studentDetails.gender,
          class: admission.studentDetails.class,
          parentId: parentProfile._id,
          teacherId,
          attendance: [],
          progressReports: [],
          activities: []
        });

        // Link child to Parent
        parentProfile.children.push(newStudent._id);
        await mockStore.findByIdAndUpdate('parents', parentProfile._id, { children: parentProfile.children });

        // Add 12 monthly fee invoices (first paid, rest pending)
        for (let i = 1; i <= 12; i++) {
          const dueDate = new Date();
          dueDate.setMonth(dueDate.getMonth() + (i - 1));
          await mockStore.create('fees', {
            studentId: newStudent._id,
            amount: 150,
            term: `Month ${i} Tuition Fee`,
            dueDate: dueDate,
            status: i === 1 ? 'paid' : 'pending',
            paymentDate: i === 1 ? new Date() : null,
            transactionId: i === 1 ? `TXN-INIT-${Math.floor(100000 + Math.random() * 900000)}` : '',
            paymentMethod: i === 1 ? 'Admission Desk Cash' : ''
          });
        }
      }

      return res.json({ success: true, message: `Admission application status updated to ${status}!`, data: admission });
    }

    // MongoDB Mongoose
    const admission = await Admission.findById(req.params.id);
    if (!admission) return res.status(404).json({ success: false, message: 'Application not found' });

    admission.status = status;
    admission.remarks = remarks || '';
    await admission.save();

    if (status === 'approved') {
      // 1. Check if user already exists
      let user = await User.findOne({ email: admission.parentDetails.email });
      let parent;

      if (!user) {
        // Create user credentials
        user = await User.create({
          name: admission.parentDetails.fatherName || admission.parentDetails.motherName,
          email: admission.parentDetails.email,
          password: password || 'parent123', // Admin-provided password
          role: 'parent'
        });

        parent = await Parent.create({
          userId: user._id,
          name: user.name,
          email: user.email,
          phone: admission.parentDetails.phone,
          address: admission.parentDetails.address,
          children: []
        });
      } else {
        parent = await Parent.findOne({ userId: user._id });
      }

      // Assign first available teacher if any
      const firstTeacher = await Teacher.findOne();

      // 2. Create student
      const student = await Student.create({
        name: admission.studentDetails.name,
        dateOfBirth: admission.studentDetails.dateOfBirth,
        gender: admission.studentDetails.gender,
        class: admission.studentDetails.class,
        parentId: parent._id,
        teacherId: firstTeacher ? firstTeacher._id : null
      });

      // 3. Link child
      parent.children.push(student._id);
      await parent.save();

      // 4. Create 12 monthly invoices (first paid, rest pending)
      for (let i = 1; i <= 12; i++) {
        const dueDate = new Date();
        dueDate.setMonth(dueDate.getMonth() + (i - 1));
        await Fee.create({
          studentId: student._id,
          amount: 150,
          term: `Month ${i} Tuition Fee`,
          dueDate: dueDate,
          status: i === 1 ? 'paid' : 'pending',
          paymentDate: i === 1 ? new Date() : null,
          transactionId: i === 1 ? `TXN-INIT-${Math.floor(100000 + Math.random() * 900000)}` : '',
          paymentMethod: i === 1 ? 'Admission Desk Cash' : ''
        });
      }
    }

    res.json({ success: true, message: `Admission application status updated to ${status}!`, data: admission });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// ==========================================
// USER REGISTRY MANAGEMENT (STUDENTS, TEACHERS)
// ==========================================

// Get all students
router.get('/students', async (req, res) => {
  try {
    if (mockStore.isMock) {
      const list = await mockStore.find('students');
      return res.json({ success: true, count: list.length, data: list });
    }
    const list = await Student.find().populate('parentId teacherId');
    res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete a student
router.delete('/students/:id', async (req, res) => {
  try {
    if (mockStore.isMock) {
      await mockStore.findByIdAndDelete('students', req.params.id);
      return res.json({ success: true, message: 'Student removed successfully' });
    }
    await Student.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Student removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create Admission & Student directly (Admin-only)
router.post('/admissions/create', uploadAdmissions.fields([
  { name: 'birthCertificate', maxCount: 1 },
  { name: 'photo', maxCount: 1 }
]), async (req, res) => {
  let { studentDetails, parentDetails, password } = req.body;
  
  try {
    if (typeof studentDetails === 'string') studentDetails = JSON.parse(studentDetails);
    if (typeof parentDetails === 'string') parentDetails = JSON.parse(parentDetails);

    const appNo = `PRN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const generatedStudentId = `STD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const birthCertificateFile = req.files?.['birthCertificate']?.[0];
    const photoFile = req.files?.['photo']?.[0];

    const documents = {
      birthCertificate: birthCertificateFile ? `/uploads/${birthCertificateFile.filename}` : 'birth_cert_uploaded.pdf',
      photo: photoFile ? `/uploads/${photoFile.filename}` : 'passport_photo_uploaded.jpg',
      parentIdProof: 'id_proof_uploaded.pdf'
    };

    if (mockStore.isMock) {
      let parentUser = await mockStore.findOne('users', { email: parentDetails.email });
      let parentProfile;
      if (!parentUser) {
        const salt = bcrypt.genSaltSync(10);
        parentUser = await mockStore.create('users', {
          name: parentDetails.fatherName || parentDetails.motherName,
          email: parentDetails.email,
          password: bcrypt.hashSync(password || 'parent123', salt),
          role: 'parent'
        });
        parentProfile = await mockStore.create('parents', {
          userId: parentUser._id,
          name: parentUser.name,
          email: parentUser.email,
          phone: parentDetails.phone,
          address: parentDetails.address,
          children: []
        });
      } else {
        parentProfile = await mockStore.findOne('parents', { userId: parentUser._id });
      }

      const teachers = await mockStore.find('teachers');
      const teacherId = teachers[0]?._id || null;

      const newStudent = await mockStore.create('students', {
        name: studentDetails.name,
        studentId: generatedStudentId,
        dateOfBirth: studentDetails.dateOfBirth,
        gender: studentDetails.gender,
        class: studentDetails.class,
        parentId: parentProfile._id,
        teacherId,
        attendance: [],
        progressReports: [],
        activities: []
      });

      parentProfile.children.push(newStudent._id);
      await mockStore.findByIdAndUpdate('parents', parentProfile._id, { children: parentProfile.children });

      const admission = await mockStore.create('admissions', {
        applicationNumber: appNo,
        studentDetails,
        parentDetails,
        documents,
        status: 'approved',
        remarks: 'Direct Admin Admission',
        submissionDate: new Date()
      });

      for (let i = 1; i <= 12; i++) {
        const dueDate = new Date();
        dueDate.setMonth(dueDate.getMonth() + (i - 1));
        await mockStore.create('fees', {
          studentId: newStudent._id,
          amount: 150,
          term: `Month ${i} Tuition Fee`,
          dueDate,
          status: i === 1 ? 'paid' : 'pending',
          paymentDate: i === 1 ? new Date() : null,
          transactionId: i === 1 ? `TXN-INIT-${Math.floor(100000 + Math.random() * 900000)}` : '',
          paymentMethod: i === 1 ? 'Admission Desk Cash' : ''
        });
      }

      return res.status(201).json({ success: true, message: 'Admission created and student registered successfully!', data: admission });
    }

    // MongoDB
    let parentUser = await User.findOne({ email: parentDetails.email });
    let parent;
    if (!parentUser) {
      parentUser = await User.create({
        name: parentDetails.fatherName || parentDetails.motherName,
        email: parentDetails.email,
        password: password || 'parent123',
        role: 'parent'
      });
      parent = await Parent.create({
        userId: parentUser._id,
        name: parentUser.name,
        email: parentUser.email,
        phone: parentDetails.phone,
        address: parentDetails.address,
        children: []
      });
    } else {
      parent = await Parent.findOne({ userId: parentUser._id });
    }

    const firstTeacher = await Teacher.findOne();

    const student = await Student.create({
      name: studentDetails.name,
      studentId: generatedStudentId,
      dateOfBirth: studentDetails.dateOfBirth,
      gender: studentDetails.gender,
      class: studentDetails.class,
      parentId: parent._id,
      teacherId: firstTeacher ? firstTeacher._id : null
    });

    parent.children.push(student._id);
    await parent.save();

    const admission = await Admission.create({
      applicationNumber: appNo,
      studentDetails,
      parentDetails,
      documents,
      status: 'approved',
      remarks: 'Direct Admin Admission'
    });

    for (let i = 1; i <= 12; i++) {
      const dueDate = new Date();
      dueDate.setMonth(dueDate.getMonth() + (i - 1));
      await Fee.create({
        studentId: student._id,
        amount: 150,
        term: `Month ${i} Tuition Fee`,
        dueDate,
        status: i === 1 ? 'paid' : 'pending',
        paymentDate: i === 1 ? new Date() : null,
        transactionId: i === 1 ? `TXN-INIT-${Math.floor(100000 + Math.random() * 900000)}` : '',
        paymentMethod: i === 1 ? 'Admission Desk Cash' : ''
      });
    }

    res.status(201).json({ success: true, message: 'Admission created and student registered successfully!', data: admission });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Direct Student Registration (Admin-only)
router.post('/students/register', async (req, res) => {
  const { name, dateOfBirth, gender, studentClass, parentName, parentEmail, parentPhone, parentAddress, password } = req.body;
  
  try {
    const generatedStudentId = `STD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    if (mockStore.isMock) {
      let parentUser = await mockStore.findOne('users', { email: parentEmail });
      let parentProfile;
      if (!parentUser) {
        const salt = bcrypt.genSaltSync(10);
        parentUser = await mockStore.create('users', {
          name: parentName,
          email: parentEmail,
          password: bcrypt.hashSync(password || 'parent123', salt),
          role: 'parent'
        });
        parentProfile = await mockStore.create('parents', {
          userId: parentUser._id,
          name: parentUser.name,
          email: parentUser.email,
          phone: parentPhone,
          address: parentAddress,
          children: []
        });
      } else {
        parentProfile = await mockStore.findOne('parents', { userId: parentUser._id });
      }

      const teachers = await mockStore.find('teachers');
      const teacherId = teachers[0]?._id || null;

      const student = await mockStore.create('students', {
        name,
        studentId: generatedStudentId,
        dateOfBirth,
        gender,
        class: studentClass,
        parentId: parentProfile._id,
        teacherId,
        attendance: [],
        progressReports: [],
        activities: []
      });

      parentProfile.children.push(student._id);
      await mockStore.findByIdAndUpdate('parents', parentProfile._id, { children: parentProfile.children });

      for (let i = 1; i <= 12; i++) {
        const dueDate = new Date();
        dueDate.setMonth(dueDate.getMonth() + (i - 1));
        await mockStore.create('fees', {
          studentId: student._id,
          amount: 150,
          term: `Month ${i} Tuition Fee`,
          dueDate,
          status: i === 1 ? 'paid' : 'pending',
          paymentDate: i === 1 ? new Date() : null,
          transactionId: i === 1 ? `TXN-INIT-${Math.floor(100000 + Math.random() * 900000)}` : '',
          paymentMethod: i === 1 ? 'Admission Desk Cash' : ''
        });
      }

      return res.status(201).json({ success: true, message: 'Student registered directly successfully!', data: student });
    }

    // MongoDB
    let parentUser = await User.findOne({ email: parentEmail });
    let parent;
    if (!parentUser) {
      parentUser = await User.create({
        name: parentName,
        email: parentEmail,
        password: password || 'parent123',
        role: 'parent'
      });
      parent = await Parent.create({
        userId: parentUser._id,
        name: parentUser.name,
        email: parentUser.email,
        phone: parentPhone,
        address: parentAddress,
        children: []
      });
    } else {
      parent = await Parent.findOne({ userId: parentUser._id });
    }

    const firstTeacher = await Teacher.findOne();

    const student = await Student.create({
      name,
      studentId: generatedStudentId,
      dateOfBirth,
      gender,
      class: studentClass,
      parentId: parent._id,
      teacherId: firstTeacher ? firstTeacher._id : null
    });

    parent.children.push(student._id);
    await parent.save();

    for (let i = 1; i <= 12; i++) {
      const dueDate = new Date();
      dueDate.setMonth(dueDate.getMonth() + (i - 1));
      await Fee.create({
        studentId: student._id,
        amount: 150,
        term: `Month ${i} Tuition Fee`,
        dueDate,
        status: i === 1 ? 'paid' : 'pending',
        paymentDate: i === 1 ? new Date() : null,
        transactionId: i === 1 ? `TXN-INIT-${Math.floor(100000 + Math.random() * 900000)}` : '',
        paymentMethod: i === 1 ? 'Admission Desk Cash' : ''
      });
    }

    res.status(201).json({ success: true, message: 'Student registered directly successfully!', data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update Student Profile (Admin-only)
router.put('/students/:id', async (req, res) => {
  const { name, dateOfBirth, gender, studentClass, parentName, parentPhone, parentAddress } = req.body;
  
  try {
    if (mockStore.isMock) {
      const student = await mockStore.findById('students', req.params.id);
      if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
      
      const updatedStudent = await mockStore.findByIdAndUpdate('students', req.params.id, {
        name: name || student.name,
        dateOfBirth: dateOfBirth || student.dateOfBirth,
        gender: gender || student.gender,
        class: studentClass || student.class
      });

      if (student.parentId) {
        const parent = await mockStore.findById('parents', student.parentId);
        if (parent) {
          await mockStore.findByIdAndUpdate('parents', student.parentId, {
            name: parentName || parent.name,
            phone: parentPhone || parent.phone,
            address: parentAddress || parent.address
          });
        }
      }
      return res.json({ success: true, message: 'Student updated successfully', data: updatedStudent });
    }

    // MongoDB
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    
    student.name = name || student.name;
    student.dateOfBirth = dateOfBirth || student.dateOfBirth;
    student.gender = gender || student.gender;
    student.class = studentClass || student.class;
    await student.save();

    if (student.parentId) {
      const parent = await Parent.findById(student.parentId);
      if (parent) {
        parent.name = parentName || parent.name;
        parent.phone = parentPhone || parent.phone;
        parent.address = parentAddress || parent.address;
        await parent.save();
      }
    }

    res.json({ success: true, message: 'Student updated successfully', data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all teachers
router.get('/teachers', async (req, res) => {
  try {
    if (mockStore.isMock) {
      const list = await mockStore.find('teachers');
      return res.json({ success: true, count: list.length, data: list });
    }
    const list = await Teacher.find();
    res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create a teacher
router.post('/teachers', async (req, res) => {
  const { name, email, password, phone, specialization, qualifications, classesAssigned } = req.body;
  try {
    if (mockStore.isMock) {
      const userExists = await mockStore.findOne('users', { email });
      if (userExists) return res.status(400).json({ success: false, message: 'Teacher email already registered' });

      const salt = bcrypt.genSaltSync(10);
      const passHash = bcrypt.hashSync(password || 'teacher123', salt);

      const newUser = await mockStore.create('users', {
        name,
        email,
        password: passHash,
        role: 'teacher',
        profileImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150'
      });

      const newTeacher = await mockStore.create('teachers', {
        userId: newUser._id,
        name,
        email,
        phone,
        specialization: specialization || 'Early Childhood Education',
        qualifications,
        classesAssigned: classesAssigned || ['Nursery']
      });

      return res.status(201).json({ success: true, message: 'Teacher registered successfully!', data: newTeacher });
    }

    // MongoDB
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ success: false, message: 'Teacher email already registered' });

    const newUser = await User.create({
      name,
      email,
      password: password || 'teacher123',
      role: 'teacher'
    });

    const newTeacher = await Teacher.create({
      userId: newUser._id,
      name,
      email,
      phone,
      specialization: specialization || 'Early Childhood Education',
      qualifications,
      classesAssigned: classesAssigned || ['Nursery']
    });

    res.status(201).json({ success: true, message: 'Teacher registered successfully!', data: newTeacher });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// ==========================================
// OTHER PORTAL MANAGERS (FEES, ANNOUNCEMENTS, GALLERY, QUERIES)
// ==========================================

// Create a fee invoice
router.post('/fees', async (req, res) => {
  const { studentId, amount, term, dueDate } = req.body;
  try {
    if (mockStore.isMock) {
      const fee = await mockStore.create('fees', { studentId, amount: Number(amount), term, dueDate: new Date(dueDate), status: 'pending' });
      return res.status(201).json({ success: true, message: 'Fee invoice created!', data: fee });
    }
    const fee = await Fee.create({ studentId, amount, term, dueDate });
    res.status(201).json({ success: true, message: 'Fee invoice created!', data: fee });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all fees
router.get('/fees', async (req, res) => {
  try {
    if (mockStore.isMock) {
      const fees = await mockStore.find('fees');
      return res.json({ success: true, data: fees });
    }
    const fees = await Fee.find().populate({ path: 'studentId', select: 'name class' }).sort({ dueDate: 1 });
    res.json({ success: true, data: fees });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create announcement
router.post('/announcements', async (req, res) => {
  const { title, content, category, targetAudience } = req.body;
  try {
    if (mockStore.isMock) {
      const ann = await mockStore.create('announcements', { title, content, category, targetAudience, date: new Date() });
      return res.status(201).json({ success: true, message: 'Announcement created!', data: ann });
    }
    const ann = await Announcement.create({ title, content, category, targetAudience });
    res.status(201).json({ success: true, message: 'Announcement created!', data: ann });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete announcement
router.delete('/announcements/:id', async (req, res) => {
  try {
    if (mockStore.isMock) {
      await mockStore.findByIdAndDelete('announcements', req.params.id);
      return res.json({ success: true, message: 'Announcement deleted' });
    }
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Announcement deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create gallery item
router.post('/gallery', uploadGallery.single('file'), async (req, res) => {
  const { title, description, category, type } = req.body;
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image file (jpg/jpeg/png)' });
    }
    const url = `/uploads/${req.file.filename}`;

    if (mockStore.isMock) {
      const gal = await mockStore.create('gallery', { title, description, url, category, type: type || 'image', date: new Date() });
      return res.status(201).json({ success: true, message: 'Media added to gallery!', data: gal });
    }
    const gal = await Gallery.create({ title, description, url, category, type: type || 'image' });
    res.status(201).json({ success: true, message: 'Media added to gallery!', data: gal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete gallery item
router.delete('/gallery/:id', async (req, res) => {
  try {
    if (mockStore.isMock) {
      await mockStore.findByIdAndDelete('gallery', req.params.id);
      return res.json({ success: true, message: 'Gallery item removed' });
    }
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Gallery item removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get queries
router.get('/queries', async (req, res) => {
  try {
    if (mockStore.isMock) {
      const list = await mockStore.find('queries');
      return res.json({ success: true, count: list.length, data: list });
    }
    const list = await Query.find().sort({ createdAt: -1 });
    res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update query status (Resolve)
router.put('/queries/:id', async (req, res) => {
  const { status } = req.body;
  try {
    if (mockStore.isMock) {
      const q = await mockStore.findByIdAndUpdate('queries', req.params.id, { status });
      if (!q) return res.status(404).json({ success: false, message: 'Query not found' });
      return res.json({ success: true, message: 'Query status updated!', data: q });
    }
    const q = await Query.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!q) return res.status(404).json({ success: false, message: 'Query not found' });
    res.json({ success: true, message: 'Query status updated!', data: q });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
