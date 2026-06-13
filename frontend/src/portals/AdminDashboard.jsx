import React, { useState, useEffect } from 'react';
import { LayoutDashboard, ClipboardList, Users, CreditCard, Bell, Image as ImageIcon, MessageCircle, CheckCircle, XCircle, Trash2, Plus, Clock, Search, FileText, Printer, Edit, Download, Contact } from 'lucide-react';
import confetti from 'canvas-confetti';
import ConfirmModal from '../components/ConfirmModal.jsx';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState(null);

  // Dynamic lists
  const [admissions, setAdmissions] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [fees, setFees] = useState([]);
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(false);

  // Remarks for approval reviews
  const [remarks, setRemarks] = useState('');

  // Subtabs configuration
  const [admissionsSubTab, setAdmissionsSubTab] = useState('review');
  const [usersSubTab, setUsersSubTab] = useState('registry');

  // Form states for New Admission Entry
  const [admStdName, setAdmStdName] = useState('');
  const [admStdDob, setAdmStdDob] = useState('');
  const [admStdGender, setAdmStdGender] = useState('Male');
  const [admStdClass, setAdmStdClass] = useState('Pre-Nursery');
  const [admParentFather, setAdmParentFather] = useState('');
  const [admParentMother, setAdmParentMother] = useState('');
  const [admParentEmail, setAdmParentEmail] = useState('');
  const [admParentPhone, setAdmParentPhone] = useState('');
  const [admParentAddress, setAdmParentAddress] = useState('');
  const [admParentPassword, setAdmParentPassword] = useState('');
  const [admBirthCertificate, setAdmBirthCertificate] = useState(null);
  const [admPhoto, setAdmPhoto] = useState(null);

  // New document fields
  const [admReportCard, setAdmReportCard] = useState(null);
  const [admTransferCertificate, setAdmTransferCertificate] = useState(null);
  const [admAadhaarCard, setAdmAadhaarCard] = useState(null);
  const [admFatherAadhaarCard, setAdmFatherAadhaarCard] = useState(null);
  const [admMotherAadhaarCard, setAdmMotherAadhaarCard] = useState(null);
  const [admAddressProofType, setAdmAddressProofType] = useState('Aadhaar Card');
  const [admAddressProof, setAdmAddressProof] = useState(null);
  const [admissionFee, setAdmissionFee] = useState('');

  // Receipt Modal State
  const [activeReceipt, setActiveReceipt] = useState(null);
  const [activeIdCard, setActiveIdCard] = useState(null);

  // Form states for Direct Student Registration
  const [regStdName, setRegStdName] = useState('');
  const [regStdDob, setRegStdDob] = useState('');
  const [regStdGender, setRegStdGender] = useState('Male');
  const [regStdClass, setRegStdClass] = useState('Pre-Nursery');
  const [regParentName, setRegParentName] = useState('');
  const [regParentEmail, setRegParentEmail] = useState('');
  const [regParentPhone, setRegParentPhone] = useState('');
  const [regParentAddress, setRegParentAddress] = useState('');
  const [regParentPassword, setRegParentPassword] = useState('');

  // Search & Filtering for Student Registry
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [studentClassFilter, setStudentClassFilter] = useState('');

  // Modal control states
  const [selectedStudentProfile, setSelectedStudentProfile] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);

  // Form states for Editing Student
  const [editStdName, setEditStdName] = useState('');
  const [editStdDob, setEditStdDob] = useState('');
  const [editStdGender, setEditStdGender] = useState('Male');
  const [editStdClass, setEditStdClass] = useState('Pre-Nursery');
  const [editParentName, setEditParentName] = useState('');
  const [editParentPhone, setEditParentPhone] = useState('');
  const [editParentAddress, setEditParentAddress] = useState('');

  // Creation forms inputs states
  const [tName, setTName] = useState('');
  const [tEmail, setTEmail] = useState('');
  const [tPassword, setTPassword] = useState('');
  const [tPhone, setTPhone] = useState('');
  const [tQual, setTQual] = useState('');
  const [tClass, setTClass] = useState('Nursery');

  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [parentPassword, setParentPassword] = useState('');

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'submit',
    onConfirm: () => { }
  });

  const triggerConfirm = (title, message, type, onConfirm) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      type,
      onConfirm: () => {
        onConfirm();
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const [feeStdId, setFeeStdId] = useState('');
  const [feeClassFilter, setFeeClassFilter] = useState('');
  const [feeSearchQuery, setFeeSearchQuery] = useState('');
  const [feeTerm, setFeeTerm] = useState('Term 1 (April - June)');
  const [feeAmount, setFeeAmount] = useState('1250');
  const [feeDueDate, setFeeDueDate] = useState('');
  const [listFeeStatusFilter, setListFeeStatusFilter] = useState('all');
  const [listFeeClassFilter, setListFeeClassFilter] = useState('');
  const [listFeeSearchName, setListFeeSearchName] = useState('');

  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annCat, setAnnCat] = useState('general');
  const [annAudience, setAnnAudience] = useState('all');

  const [galTitle, setGalTitle] = useState('');
  const [galDesc, setGalDesc] = useState('');
  const [galFile, setGalFile] = useState(null);
  const [galCat, setGalCat] = useState('classroom');
  const [galItems, setGalItems] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchAdmissions();
    fetchStudents();
    fetchTeachers();
    fetchFees();
    fetchQueries();
    fetchGallery();
  }, [activeTab]);

  const fetchStats = () => {
    fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(res => res.json())
      .then(data => { if (data.success) setStats(data.stats); })
      .catch(err => console.error(err));
  };

  const fetchAdmissions = () => {
    fetch('/api/admin/admissions', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(res => res.json())
      .then(data => { if (data.success) setAdmissions(data.data); })
      .catch(err => console.error(err));
  };

  const fetchStudents = () => {
    fetch('/api/admin/students', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(res => res.json())
      .then(data => { if (data.success) setStudents(data.data); })
      .catch(err => console.error(err));
  };

  const fetchTeachers = () => {
    fetch('/api/admin/teachers', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(res => res.json())
      .then(data => { if (data.success) setTeachers(data.data); })
      .catch(err => console.error(err));
  };

  const fetchFees = () => {
    fetch('/api/admin/fees', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(res => res.json())
      .then(data => { if (data.success) setFees(data.data); })
      .catch(err => console.error(err));
  };

  const fetchQueries = () => {
    fetch('/api/admin/queries', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(res => res.json())
      .then(data => { if (data.success) setQueries(data.data); })
      .catch(err => console.error(err));
  };

  // Admissions Action
  const handleAdmissionDecision = async (id, status, pswd) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/admissions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status, remarks, password: pswd })
      });
      const data = await res.json();
      setLoading(false);
      setRemarks('');
      setParentPassword('');
      setSelectedAdmission(null);
      if (data.success) {
        alert(`Admission application successfully marked ${status}!`);
        fetchAdmissions();
        if (status === 'approved') {
          confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
        }
      } else {
        alert(data.message || 'Operation failed');
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  // Delete Student
  const handleDeleteStudent = (id) => {
    triggerConfirm(
      "Are you sure you want to delete?",
      "This will permanently remove the student record from the database.",
      "delete",
      async () => {
        try {
          const res = await fetch(`/api/admin/students/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          const data = await res.json();
          if (data.success) {
            alert('Student record deleted');
            fetchStudents();
          }
        } catch (err) {
          console.error(err);
        }
      }
    );
  };

  // Register Teacher
  const handleCreateTeacher = (e) => {
    e.preventDefault();
    triggerConfirm(
      "Are you sure you want to submit?",
      `This will hire and register ${tName} as a staff teacher.`,
      "submit",
      async () => {
        try {
          const res = await fetch('/api/admin/teachers', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
              name: tName,
              email: tEmail,
              password: tPassword,
              phone: tPhone,
              qualifications: tQual,
              classesAssigned: [tClass]
            })
          });
          const data = await res.json();
          if (data.success) {
            alert('Teacher hired successfully!');
            setTName(''); setTEmail(''); setTPassword(''); setTPhone(''); setTQual('');
            fetchTeachers();
          } else {
            alert(data.message);
          }
        } catch (err) {
          console.error(err);
        }
      }
    );
  };

  // Generate invoice
  const handleCreateFee = (e) => {
    e.preventDefault();
    if (!feeStdId) return alert('Please select a student');
    triggerConfirm(
      "Are you sure you want to submit?",
      "This will issue a new tuition fee invoice for the student.",
      "submit",
      async () => {
        try {
          const res = await fetch('/api/admin/fees', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ studentId: feeStdId, amount: Number(feeAmount), term: feeTerm, dueDate: feeDueDate })
          });
          const data = await res.json();
          if (data.success) {
            alert('Tuition invoice billed!');
            setFeeStdId(''); setFeeDueDate('');
            fetchFees();
          }
        } catch (err) {
          console.error(err);
        }
      }
    );
  };

  const getStudentInfo = (f) => {
    if (f.studentId && typeof f.studentId === 'object') {
      return { name: f.studentId.name, class: f.studentId.class, id: f.studentId._id };
    }
    const found = students.find(s => s._id === f.studentId);
    if (found) {
      return { name: found.name, class: found.class, id: found._id };
    }
    return { name: 'Unknown Student', class: 'N/A', id: f.studentId };
  };

  const handleViewReceipt = async (feeId) => {
    try {
      const res = await fetch(`/api/admin/receipt/${feeId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (data.success) {
        setActiveReceipt(data);
      } else {
        alert(data.message || 'Receipt not found');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to load receipt');
    }
  };

  const handleCollectPayment = (feeId) => {
    triggerConfirm(
      "Collect Fee Payment?",
      "This will mark the student's invoice as PAID at the admission desk and generate a printable receipt.",
      "submit",
      async () => {
        try {
          const res = await fetch(`/api/admin/fees/${feeId}/pay`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ paymentMethod: 'Admission Desk Cash' })
          });
          const data = await res.json();
          if (data.success) {
            alert('Payment collected successfully!');
            fetchFees(); // refresh fee list
            if (data.receipt) {
              const fee = fees.find(f => f._id === feeId);
              const studentInfo = getStudentInfo(fee);
              setActiveReceipt({
                receipt: data.receipt,
                student: {
                  name: studentInfo.name,
                  class: studentInfo.class,
                  studentId: studentInfo.id
                },
                fee: {
                  term: fee.term
                }
              });
            }
          } else {
            alert(data.message || 'Failed to collect payment');
          }
        } catch (err) {
          console.error(err);
          alert('Failed to collect payment');
        }
      }
    );
  };

  // Create notice
  const handleCreateAnnouncement = (e) => {
    e.preventDefault();
    triggerConfirm(
      "Are you sure you want to submit?",
      "This will post a new bulletin notice to all parents.",
      "submit",
      async () => {
        try {
          const res = await fetch('/api/admin/announcements', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ title: annTitle, content: annContent, category: annCat, targetAudience: annAudience })
          });
          const data = await res.json();
          if (data.success) {
            alert('Circular bulletin published!');
            setAnnTitle(''); setAnnContent('');
          }
        } catch (err) {
          console.error(err);
        }
      }
    );
  };

  // Create gallery item
  const handleCreateGallery = (e) => {
    e.preventDefault();
    if (!galFile) return alert('Please select an image file to upload');
    triggerConfirm(
      "Are you sure you want to submit?",
      "This will upload the image to the public school gallery.",
      "submit",
      async () => {
        try {
          const formData = new FormData();
          formData.append('title', galTitle);
          formData.append('description', galDesc);
          formData.append('category', galCat);
          formData.append('file', galFile);

          const res = await fetch('/api/admin/gallery', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
          });
          const data = await res.json();
          if (data.success) {
            alert('Media added to school gallery!');
            setGalTitle(''); setGalDesc(''); setGalFile(null);
            const fileInput = document.getElementById('gallery-file-input');
            if (fileInput) fileInput.value = '';
            fetchGallery();
          } else {
            alert(data.message || 'Failed to add media');
          }
        } catch (err) {
          console.error(err);
        }
      }
    );
  };

  const fetchGallery = () => {
    fetch('/api/public/gallery')
      .then(res => res.json())
      .then(data => { if (data.success) setGalItems(data.data); })
      .catch(err => console.error(err));
  };

  const handleDeleteGallery = (id) => {
    triggerConfirm(
      "Are you sure you want to delete?",
      "This will remove the media item from the gallery.",
      "delete",
      async () => {
        try {
          const res = await fetch(`/api/admin/gallery/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          const data = await res.json();
          if (data.success) {
            alert('Gallery item removed');
            fetchGallery();
          }
        } catch (err) {
          console.error(err);
        }
      }
    );
  };

  // Resolve query
  const handleResolveQuery = (id) => {
    triggerConfirm(
      "Are you sure you want to submit?",
      "This will mark the query ticket as resolved.",
      "submit",
      async () => {
        try {
          const res = await fetch(`/api/admin/queries/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ status: 'resolved' })
          });
          const data = await res.json();
          if (data.success) {
            alert('Query ticket resolved');
            fetchQueries();
          }
        } catch (err) {
          console.error(err);
        }
      }
    );
  };

  // Submit New Admission Form (Multipart Form Data)
  const handleCreateAdmission = (e) => {
    e.preventDefault();
    triggerConfirm(
      "Submit New Admission?",
      "This will create student and parent records, and generate the admission fee and 12 monthly fee invoices.",
      "submit",
      async () => {
        try {
          const formData = new FormData();
          const studentDetails = {
            name: admStdName,
            dateOfBirth: admStdDob,
            gender: admStdGender,
            class: admStdClass
          };
          const parentDetails = {
            fatherName: admParentFather,
            motherName: admParentMother,
            email: admParentEmail,
            phone: admParentPhone,
            address: admParentAddress
          };

          formData.append('studentDetails', JSON.stringify(studentDetails));
          formData.append('parentDetails', JSON.stringify(parentDetails));
          formData.append('password', admParentPassword);
          formData.append('admissionFee', admissionFee || '0');
          formData.append('addressProofType', admAddressProofType);

          if (admBirthCertificate) {
            formData.append('birthCertificate', admBirthCertificate);
          }
          if (admPhoto) {
            formData.append('photo', admPhoto);
          }
          if (admReportCard) {
            formData.append('reportCard', admReportCard);
          }
          if (admTransferCertificate) {
            formData.append('transferCertificate', admTransferCertificate);
          }
          if (admAadhaarCard) {
            formData.append('aadhaarCard', admAadhaarCard);
          }
          if (admFatherAadhaarCard) {
            formData.append('fatherAadhaarCard', admFatherAadhaarCard);
          }
          if (admMotherAadhaarCard) {
            formData.append('motherAadhaarCard', admMotherAadhaarCard);
          }
          if (admAddressProof) {
            formData.append('addressProof', admAddressProof);
          }

          const res = await fetch('/api/admin/admissions/create', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
          });
          const data = await res.json();
          if (data.success) {
            alert('Admission recorded successfully!');

            // Set active receipt for printing if returned
            if (data.receipt) {
              setActiveReceipt({
                receipt: data.receipt,
                student: {
                  name: studentDetails.name,
                  class: studentDetails.class,
                  studentId: 'New Admission'
                },
                fee: {
                  term: 'Admission Fee'
                }
              });
            }

            // Reset form
            setAdmStdName('');
            setAdmStdDob('');
            setAdmStdGender('Male');
            setAdmStdClass('Pre-Nursery');
            setAdmParentFather('');
            setAdmParentMother('');
            setAdmParentEmail('');
            setAdmParentPhone('');
            setAdmParentAddress('');
            setAdmParentPassword('');
            setAdmBirthCertificate(null);
            setAdmPhoto(null);
            setAdmReportCard(null);
            setAdmTransferCertificate(null);
            setAdmAadhaarCard(null);
            setAdmFatherAadhaarCard(null);
            setAdmMotherAadhaarCard(null);
            setAdmAddressProofType('Aadhaar Card');
            setAdmAddressProof(null);
            setAdmissionFee('');

            const certInput = document.getElementById('adm-cert-input');
            const photoInput = document.getElementById('adm-photo-input');
            const reportInput = document.getElementById('adm-report-input');
            const tcInput = document.getElementById('adm-tc-input');
            const aadhaarInput = document.getElementById('adm-aadhaar-input');
            const fatherAadhaarInput = document.getElementById('adm-father-aadhaar-input');
            const motherAadhaarInput = document.getElementById('adm-mother-aadhaar-input');
            const addressProofInput = document.getElementById('adm-address-proof-input');

            if (certInput) certInput.value = '';
            if (photoInput) photoInput.value = '';
            if (reportInput) reportInput.value = '';
            if (tcInput) tcInput.value = '';
            if (aadhaarInput) aadhaarInput.value = '';
            if (fatherAadhaarInput) fatherAadhaarInput.value = '';
            if (motherAadhaarInput) motherAadhaarInput.value = '';
            if (addressProofInput) addressProofInput.value = '';

            setAdmissionsSubTab('history');
            fetchAdmissions();
            fetchStudents();
            fetchFees();
            confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
          } else {
            alert(data.message || 'Error occurred while creating admission');
          }
        } catch (err) {
          console.error(err);
          alert(err.message || 'Error occurred while creating admission');
        }
      }
    );
  };

  // Submit Direct Student Registration
  const handleRegisterStudent = (e) => {
    e.preventDefault();
    triggerConfirm(
      "Register Student Directly?",
      "This will manually register an existing student and provision their parent credentials.",
      "submit",
      async () => {
        try {
          const res = await fetch('/api/admin/students/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
              name: regStdName,
              dateOfBirth: regStdDob,
              gender: regStdGender,
              studentClass: regStdClass,
              parentName: regParentName,
              parentEmail: regParentEmail,
              parentPhone: regParentPhone,
              parentAddress: regParentAddress,
              password: regParentPassword
            })
          });
          const data = await res.json();
          if (data.success) {
            alert('Student registered directly successfully!');
            // Reset form
            setRegStdName('');
            setRegStdDob('');
            setRegStdGender('Male');
            setRegStdClass('Pre-Nursery');
            setRegParentName('');
            setRegParentEmail('');
            setRegParentPhone('');
            setRegParentAddress('');
            setRegParentPassword('');

            setUsersSubTab('registry');
            fetchStudents();
            confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
          } else {
            alert(data.message || 'Error occurred while registering student');
          }
        } catch (err) {
          console.error(err);
          alert(err.message || 'Error occurred while registering student');
        }
      }
    );
  };

  // Pre-fill fields and start editing student
  const handleStartEditStudent = (std) => {
    setEditingStudent(std);
    setEditStdName(std.name || '');
    const dobFormatted = std.dateOfBirth ? new Date(std.dateOfBirth).toISOString().split('T')[0] : '';
    setEditStdDob(dobFormatted);
    setEditStdGender(std.gender || 'Male');
    setEditStdClass(std.class || 'Pre-Nursery');
    setEditParentName(std.parentId?.name || std.parentDetails?.fatherName || std.parentDetails?.motherName || '');
    setEditParentPhone(std.parentId?.phone || std.parentDetails?.phone || '');
    setEditParentAddress(std.parentId?.address || std.parentDetails?.address || '');
  };

  // Save changes to Student Profile
  const handleEditStudent = (e) => {
    e.preventDefault();
    triggerConfirm(
      "Save Changes?",
      `This will update the profile details of ${editStdName}.`,
      "submit",
      async () => {
        try {
          const res = await fetch(`/api/admin/students/${editingStudent._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
              name: editStdName,
              dateOfBirth: editStdDob,
              gender: editStdGender,
              studentClass: editStdClass,
              parentName: editParentName,
              parentPhone: editParentPhone,
              parentAddress: editParentAddress
            })
          });
          const data = await res.json();
          if (data.success) {
            alert('Student profile updated successfully!');
            setEditingStudent(null);
            fetchStudents();
          } else {
            alert(data.message || 'Error occurred while updating student');
          }
        } catch (err) {
          console.error(err);
          alert(err.message || 'Error occurred while updating student');
        }
      }
    );
  };

  // Export filtered students as CSV
  const handleExportCSV = () => {
    const filtered = students.filter(s => {
      const classMatch = studentClassFilter ? s.class === studentClassFilter : true;
      const nameMatch = s.name.toLowerCase().includes(studentSearchQuery.toLowerCase());
      return classMatch && nameMatch;
    });

    const headers = ['Student ID', 'Student Name', 'Class', 'Gender', 'DOB', 'Parent Name', 'Parent Email', 'Parent Phone', 'Parent Address'];
    const rows = filtered.map(s => [
      s.studentId || '',
      s.name || '',
      s.class || '',
      s.gender || '',
      s.dateOfBirth ? new Date(s.dateOfBirth).toISOString().split('T')[0] : '',
      s.parentId?.name || '',
      s.parentId?.email || '',
      s.parentId?.phone || '',
      s.parentId?.address || ''
    ]);

    const csvContent = "data:text/csv;charset=utf-8,"
      + [headers.join(','), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `student_registry_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Open printable student registry overview
  const handlePrintPDF = () => {
    const filtered = students.filter(s => {
      const classMatch = studentClassFilter ? s.class === studentClassFilter : true;
      const nameMatch = s.name.toLowerCase().includes(studentSearchQuery.toLowerCase());
      return classMatch && nameMatch;
    });
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Student Registry Report</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; margin: 30px; }
            h1 { text-align: center; color: #5B468C; margin-bottom: 5px; }
            p.subtitle { text-align: center; font-size: 13px; color: #666; margin-bottom: 25px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; font-size: 12px; }
            th { background-color: #ECEAFE; font-weight: bold; color: #5B468C; }
            tr:nth-child(even) { background-color: #fcfcfc; }
            .footer { margin-top: 30px; text-align: right; font-size: 10px; color: #999; }
          </style>
        </head>
        <body>
          <h1>Pranidha International School</h1>
          <p class="subtitle">Active Student Database Report — Generated on ${new Date().toLocaleDateString()}</p>
          <table>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Student Name</th>
                <th>Class</th>
                <th>Gender</th>
                <th>DOB</th>
                <th>Parent Contact Info</th>
              </tr>
            </thead>
            <tbody>
              \${filtered.map(s => \`
                <tr>
                  <td><strong>\${s.studentId || 'N/A'}</strong></td>
                  <td>\${s.name}</td>
                  <td>\${s.class}</td>
                  <td>\${s.gender}</td>
                  <td>\${s.dateOfBirth ? new Date(s.dateOfBirth).toLocaleDateString() : 'N/A'}</td>
                  <td>
                    Name: \${s.parentId?.name || 'N/A'}<br/>
                    Phone: \${s.parentId?.phone || 'N/A'}<br/>
                    Email: \${s.parentId?.email || 'N/A'}
                  </td>
                </tr>
              \`).join('')}
            </tbody>
          </table>
          <div class="footer">Page total: \${filtered.length} students</div>
          <script>
            window.onload = function() {
              window.print();
              window.close();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="min-h-screen p-4 -m-4 space-y-6 clay-bg md:-m-8 md:p-8 print:p-0 print:m-0 print:bg-white print:min-h-0">
      <div className="space-y-6 print:hidden">
        {/* Welcome Bar */}
        <div className="flex flex-col items-center justify-between gap-4 p-6 clay-card-purple md:p-8 md:flex-row text-slate-800">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-16 h-16 text-xl font-bold border-4 border-white rounded-full shadow bg-gradient-to-r from-brandYellow to-yellow-400 text-slate-800 font-quicksand">
              PR
            </div>
            <div>
              <span className="text-[#9F92EC] font-bold text-xs uppercase tracking-wider block">ADMIN CONTROL HUB</span>
              <h1 className="text-3xl font-bold leading-tight font-quicksand text-slate-800">Good Morning, Admin! ☀️</h1>
              <p className="text-xs text-slate-500 mt-0.5">Let's manage classes, review admissions, and update bulletins today.</p>
            </div>
          </div>
          <div>
            <button
              onClick={() => setActiveTab('stats')}
              className="clay-button-purple px-6 py-2.5 font-quicksand font-bold text-xs"
            >
              VIEW REPORT OVERVIEW
            </button>
          </div>
        </div>

        {/* Tabs Layout */}
        <div className="grid items-start grid-cols-1 gap-6 lg:grid-cols-12">

          {/* Sidebar tabs */}
          <div className="p-6 space-y-2 text-white lg:col-span-3 clay-sidebar">
            <div className="flex flex-col items-center pb-4 mb-4 space-y-2 border-b border-white/20">
              <div className="flex items-center justify-center w-16 h-16 text-lg font-bold text-white border-4 border-white rounded-full shadow-sm bg-white/25 font-quicksand">
                AD
              </div>
              <span className="block text-sm font-bold text-white font-quicksand">Hi, Admin! 👋</span>
            </div>

            <button
              onClick={() => setActiveTab('stats')}
              className={`w-full text-left font-quicksand font-bold text-xs p-3 flex items-center space-x-3 transition-all ${activeTab === 'stats' ? 'clay-sidebar-item-active' : 'rounded-2xl text-white/80 hover:text-white hover:bg-white/10'
                }`}
            >
              <LayoutDashboard className="w-4.5 h-4.5" />
              <span>Dashboard Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('admissions')}
              className={`w-full text-left font-quicksand font-bold text-xs p-3 flex items-center space-x-3 transition-all ${activeTab === 'admissions' ? 'clay-sidebar-item-active' : 'rounded-2xl text-white/80 hover:text-white hover:bg-white/10'
                }`}
            >
              <ClipboardList className="w-4.5 h-4.5" />
              <span>Enrollment Applications</span>
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`w-full text-left font-quicksand font-bold text-xs p-3 flex items-center space-x-3 transition-all ${activeTab === 'users' ? 'clay-sidebar-item-active' : 'rounded-2xl text-white/80 hover:text-white hover:bg-white/10'
                }`}
            >
              <Users className="w-4.5 h-4.5" />
              <span>Students & Teachers</span>
            </button>

            <button
              onClick={() => setActiveTab('fees')}
              className={`w-full text-left font-quicksand font-bold text-xs p-3 flex items-center space-x-3 transition-all ${activeTab === 'fees' ? 'clay-sidebar-item-active' : 'rounded-2xl text-white/80 hover:text-white hover:bg-white/10'
                }`}
            >
              <CreditCard className="w-4.5 h-4.5" />
              <span>Fees & Billing</span>
            </button>

            <button
              onClick={() => setActiveTab('announcements')}
              className={`w-full text-left font-quicksand font-bold text-xs p-3 flex items-center space-x-3 transition-all ${activeTab === 'announcements' ? 'clay-sidebar-item-active' : 'rounded-2xl text-white/80 hover:text-white hover:bg-white/10'
                }`}
            >
              <Bell className="w-4.5 h-4.5" />
              <span>Notices Board</span>
            </button>

            <button
              onClick={() => setActiveTab('gallery')}
              className={`w-full text-left font-quicksand font-bold text-xs p-3 flex items-center space-x-3 transition-all ${activeTab === 'gallery' ? 'clay-sidebar-item-active' : 'rounded-2xl text-white/80 hover:text-white hover:bg-white/10'
                }`}
            >
              <ImageIcon className="w-4.5 h-4.5" />
              <span>Gallery Manager</span>
            </button>

            <button
              onClick={() => setActiveTab('queries')}
              className={`w-full text-left font-quicksand font-bold text-xs p-3 flex items-center space-x-3 transition-all ${activeTab === 'queries' ? 'clay-sidebar-item-active' : 'rounded-2xl text-white/80 hover:text-white hover:bg-white/10'
                }`}
            >
              <MessageCircle className="w-4.5 h-4.5" />
              <span>Visitor Queries</span>
            </button>
          </div>

          {/* Content panel */}
          <div className="lg:col-span-9 clay-card p-6 md:p-8 min-h-[400px]">

            {/* TAB 1: Overview stats */}
            {activeTab === 'stats' && (
              <div className="space-y-6">
                <h3 className="pb-3 text-lg font-bold border-b font-quicksand text-slate-800 border-orange-50">Analytics Overview</h3>
                {stats ? (
                  <div className="space-y-8">
                    {/* Grid cards */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                      <div className="bg-sky-50 border-4 border-white rounded-[2rem] p-6 shadow-md shadow-sky-100/40 relative overflow-hidden flex flex-col justify-between">
                        <div className="flex items-start justify-between">
                          <span className="block text-xs font-bold tracking-wider uppercase text-sky-500">Total Students</span>
                          <span className="text-sky-400 bg-sky-100/50 px-2 py-0.5 rounded-full text-[10px] font-bold">+18% this week</span>
                        </div>
                        <p className="mt-4 text-3xl font-extrabold text-slate-800 font-quicksand">{stats.students}</p>
                      </div>
                      <div className="bg-rose-50 border-4 border-white rounded-[2rem] p-6 shadow-md shadow-rose-100/40 relative overflow-hidden flex flex-col justify-between">
                        <div className="flex items-start justify-between">
                          <span className="block text-xs font-bold tracking-wider uppercase text-rose-500">Pending Forms</span>
                          <span className="text-rose-400 bg-rose-100/50 px-2 py-0.5 rounded-full text-[10px] font-bold">Admissions</span>
                        </div>
                        <p className="mt-4 text-3xl font-extrabold text-slate-800 font-quicksand">{stats.pendingAdmissions}</p>
                      </div>
                      <div className="bg-emerald-50 border-4 border-white rounded-[2rem] p-6 shadow-md shadow-emerald-100/40 relative overflow-hidden flex flex-col justify-between">
                        <div className="flex items-start justify-between">
                          <span className="block text-xs font-bold tracking-wider uppercase text-emerald-500">Total Revenue</span>
                          <span className="text-emerald-400 bg-emerald-100/50 px-2 py-0.5 rounded-full text-[10px] font-bold">Paid Fees</span>
                        </div>
                        <p className="mt-4 text-3xl font-extrabold text-slate-800 font-quicksand">₹{stats.totalRevenue}</p>
                      </div>
                      <div className="bg-amber-50 border-4 border-white rounded-[2rem] p-6 shadow-md shadow-amber-100/40 relative overflow-hidden flex flex-col justify-between">
                        <div className="flex items-start justify-between">
                          <span className="block text-xs font-bold tracking-wider uppercase text-amber-500">Hired Teachers</span>
                          <span className="text-amber-400 bg-amber-100/50 px-2 py-0.5 rounded-full text-[10px] font-bold">Staff Registry</span>
                        </div>
                        <p className="mt-4 text-3xl font-extrabold text-slate-800 font-quicksand">{stats.teachers}</p>
                      </div>
                      <div className="bg-indigo-50 border-4 border-white rounded-[2rem] p-6 shadow-md shadow-indigo-100/40 relative overflow-hidden flex flex-col justify-between">
                        <div className="flex items-start justify-between">
                          <span className="block text-xs font-bold tracking-wider text-indigo-500 uppercase">Unread Queries</span>
                          <span className="text-indigo-400 bg-indigo-100/50 px-2 py-0.5 rounded-full text-[10px] font-bold">Visitor Tickets</span>
                        </div>
                        <p className="mt-4 text-3xl font-extrabold text-slate-800 font-quicksand">{stats.unreadQueries} unread</p>
                      </div>
                    </div>

                    {/* 3D Charts Split */}
                    <div className="grid grid-cols-1 gap-6 pt-2 md:grid-cols-2">
                      <div className="bg-white border-4 border-slate-50 p-6 rounded-[2.5rem] shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold font-quicksand text-slate-800">Weekly Activity Logs</h4>
                          <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2.5 py-0.5 rounded-full">This Week</span>
                        </div>

                        <div className="flex items-end justify-between h-40 px-2 pt-4">
                          {[
                            { day: 'Mon', val: 'h-[40%]', bg: 'bg-[#9F92EC]' },
                            { day: 'Tue', val: 'h-[60%]', bg: 'bg-[#FFB3D1]' },
                            { day: 'Wed', val: 'h-[50%]', bg: 'bg-[#FCD34D]' },
                            { day: 'Thu', val: 'h-[80%]', bg: 'bg-[#FCD34D]' },
                            { day: 'Fri', val: 'h-[45%]', bg: 'bg-[#86EFAC]' },
                            { day: 'Sat', val: 'h-[70%]', bg: 'bg-[#93C5FD]' },
                            { day: 'Sun', val: 'h-[65%]', bg: 'bg-[#9F92EC]' }
                          ].map((item, idx) => (
                            <div key={idx} className="flex flex-col items-center w-full gap-2">
                              <div className="flex items-end w-5 overflow-hidden rounded-full shadow-inner h-28 bg-slate-100">
                                <div className={`w-full ${item.val} ${item.bg} clay-bar`} />
                              </div>
                              <span className="text-[9px] text-slate-400 font-bold uppercase">{item.day}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-white border-4 border-slate-50 p-6 rounded-[2.5rem] shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold font-quicksand text-slate-800">Enrolled Programs Split</h4>
                          <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2.5 py-0.5 rounded-full">All Students</span>
                        </div>

                        <div className="flex items-center justify-around h-40 pt-2">
                          <div className="relative flex items-center justify-center border-8 rounded-full shadow-inner w-28 h-28 border-slate-100">
                            <div className="absolute inset-0 rounded-full border-8 border-[#9F92EC] border-t-transparent border-r-transparent" />
                            <div className="absolute inset-0 rounded-full border-8 border-[#FFB3D1] border-b-transparent border-l-transparent" />
                            <div className="text-center">
                              <span className="text-slate-400 text-[8px] font-bold uppercase block leading-none">Total</span>
                              <span className="text-sm font-bold text-slate-800 font-quicksand block mt-0.5">{stats?.students || 0}</span>
                            </div>
                          </div>

                          <div className="space-y-1.5 text-[9px] font-bold text-slate-500">
                            <div className="flex items-center gap-1.5">
                              <div className="w-2.5 h-2.5 rounded-full bg-[#9F92EC] shadow-sm" />
                              <span>Preschool / Nursery: 45%</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className="w-2.5 h-2.5 rounded-full bg-[#FFB3D1] shadow-sm" />
                              <span>Junior KG: 35%</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className="w-2.5 h-2.5 rounded-full bg-[#FCD34D] shadow-sm" />
                              <span>Senior KG: 20%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">Loading metrics...</p>
                )}
              </div>
            )}

            {/* TAB 2: Admissions reviews */}
            {activeTab === 'admissions' && (
              <div className="space-y-6">
                <div className="flex flex-col justify-between gap-4 pb-4 border-b sm:flex-row sm:items-center border-orange-50">
                  <h3 className="text-lg font-bold font-quicksand text-slate-800">Enrollment & Admissions Manager</h3>

                  {/* Sub-tabs selection */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setAdmissionsSubTab('review')}
                      className={`px-4 py-2 text-xs font-bold font-quicksand rounded-xl transition-all ${admissionsSubTab === 'review'
                          ? 'bg-[#9F92EC] text-white shadow'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                      Pending Reviews ({admissions.filter(a => a.status === 'pending').length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdmissionsSubTab('new')}
                      className={`px-4 py-2 text-xs font-bold font-quicksand rounded-xl transition-all ${admissionsSubTab === 'new'
                          ? 'bg-[#9F92EC] text-white shadow'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                      New Admission Entry
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdmissionsSubTab('history')}
                      className={`px-4 py-2 text-xs font-bold font-quicksand rounded-xl transition-all ${admissionsSubTab === 'history'
                          ? 'bg-[#9F92EC] text-white shadow'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                      Admissions History ({admissions.filter(a => a.status !== 'pending').length})
                    </button>
                  </div>
                </div>

                {/* Sub-tab 1: Pending Reviews */}
                {admissionsSubTab === 'review' && (
                  <div className="space-y-4">
                    {admissions.filter(adm => adm.status === 'pending').length === 0 ? (
                      <p className="py-10 text-xs font-medium text-center text-slate-500">No pending admission applications to review.</p>
                    ) : (
                      admissions.filter(adm => adm.status === 'pending').map(adm => (
                        <div key={adm._id} className="flex flex-col items-start justify-between gap-4 p-5 text-xs border bg-slate-50 border-slate-100 rounded-2xl sm:flex-row sm:items-center">
                          <div className="space-y-1">
                            <span className="block font-mono font-bold text-brandCoral">{adm.applicationNumber}</span>
                            <h4 className="text-sm font-bold font-quicksand text-slate-800">{adm.studentDetails?.name}</h4>
                            <p className="font-medium text-slate-500">Class: <span className="font-bold text-slate-800">{adm.studentDetails?.class}</span> | Parent: <span className="font-bold text-slate-800">{adm.parentDetails?.fatherName || adm.parentDetails?.motherName}</span></p>
                          </div>
                          <div className="flex items-center justify-between w-full gap-3 sm:w-auto sm:justify-end">
                            <span className="text-[10px] uppercase font-bold px-2.5 py-1 rounded-full border bg-brandYellow/10 text-brandYellow-dark border border-brandYellow/30">
                              {adm.status}
                            </span>
                            <button
                              onClick={() => {
                                setSelectedAdmission(adm);
                                setParentPassword('');
                                setRemarks(adm.remarks || '');
                              }}
                              className="font-quicksand font-bold text-xs bg-[#9F92EC] hover:bg-[#8C7EB5] text-white px-4 py-2.5 rounded-xl shadow cursor-pointer transition-all active:scale-[0.98]"
                            >
                              REVIEW & DECIDE
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Sub-tab 2: New Admission Entry Form */}
                {admissionsSubTab === 'new' && (
                  <form onSubmit={handleCreateAdmission} className="p-5 space-y-6 text-xs border bg-slate-50/50 border-slate-100 rounded-3xl">
                    <div>
                      <h4 className="text-sm font-bold font-quicksand text-[#5B468C] mb-1">Record New Admission Application</h4>
                      <p className="text-slate-500">Submit student credentials, parent details, and upload documents directly. This will automatically approve the admission, generate a Student ID, and provision the parent portal.</p>
                    </div>

                    {/* Student Details Section */}
                    <div className="space-y-3">
                      <h5 className="pb-1 font-bold border-b text-slate-800 font-quicksand">1. Student Details</h5>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                        <div className="space-y-1">
                          <label className="font-bold text-slate-600">Student Name</label>
                          <input
                            type="text" required placeholder="e.g. Tommy Jenkins"
                            value={admStdName} onChange={e => setAdmStdName(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-slate-600">Date of Birth</label>
                          <input
                            type="date" required
                            value={admStdDob} onChange={e => setAdmStdDob(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 outline-none text-slate-600 font-semibold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-slate-600">Gender</label>
                          <select
                            value={admStdGender} onChange={e => setAdmStdGender(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 outline-none font-semibold text-slate-600"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-slate-600">Class Program</label>
                          <select
                            value={admStdClass} onChange={e => setAdmStdClass(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 outline-none font-semibold text-slate-600"
                          >
                            <option value="Pre-Nursery">Pre-Nursery</option>
                            <option value="Nursery">Nursery</option>
                            <option value="Junior KG">Junior KG</option>
                            <option value="Senior KG">Senior KG</option>
                            <option value="1st">1st</option>
                            <option value="2nd">2nd</option>
                            <option value="3rd">3rd</option>
                            <option value="4th">4th</option>
                            <option value="5th">5th</option>
                            <option value="6th">6th</option>
                            <option value="7th">7th</option>
                            <option value="8th">8th</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Parent Details Section */}
                    <div className="space-y-3">
                      <h5 className="pb-1 font-bold border-b text-slate-800 font-quicksand">2. Parent / Guardian Details</h5>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div className="space-y-1">
                          <label className="font-bold text-slate-600">Father's Full Name</label>
                          <input
                            type="text" required placeholder="e.g. John Jenkins"
                            value={admParentFather} onChange={e => setAdmParentFather(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-slate-600">Mother's Full Name</label>
                          <input
                            type="text" required placeholder="e.g. Clara Jenkins"
                            value={admParentMother} onChange={e => setAdmParentMother(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-slate-600">Email Address (Login Username)</label>
                          <input
                            type="email" required placeholder="e.g. parent@email.com"
                            value={admParentEmail} onChange={e => setAdmParentEmail(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-slate-600">Phone Number</label>
                          <input
                            type="text" required placeholder="e.g. +91 98765 43210"
                            value={admParentPhone} onChange={e => setAdmParentPhone(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 outline-none"
                          />
                        </div>
                        <div className="space-y-1 sm:col-span-2">
                          <label className="font-bold text-slate-600">Home Address</label>
                          <input
                            type="text" required placeholder="e.g. 123 Sunshine Street, Sector 5"
                            value={admParentAddress} onChange={e => setAdmParentAddress(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 outline-none"
                          />
                        </div>
                        <div className="space-y-1 sm:col-span-3">
                          <label className="font-bold text-slate-600">Provision Portal Password (defaults to "parent123" if empty)</label>
                          <input
                            type="text" placeholder="Provision login password for the parent..."
                            value={admParentPassword} onChange={e => setAdmParentPassword(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Document Upload Section */}
                    <div className="space-y-3">
                      <h5 className="pb-1 font-bold border-b text-slate-800 font-quicksand">3. Required Documents & Identity Proofs</h5>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-slate-600">
                        <div className="space-y-1">
                          <label className="font-bold text-slate-600">Birth Certificate (PDF / Image)</label>
                          <input
                            id="adm-cert-input"
                            type="file" accept=".pdf,.png,.jpg,.jpeg"
                            onChange={e => setAdmBirthCertificate(e.target.files[0])}
                            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 outline-none text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-slate-600">Student Passport Size Photo (Image)</label>
                          <input
                            id="adm-photo-input"
                            type="file" accept=".png,.jpg,.jpeg"
                            onChange={e => setAdmPhoto(e.target.files[0])}
                            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 outline-none text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-slate-600">Previous School Report Card / Marksheet (PDF / Image)</label>
                          <input
                            id="adm-report-input"
                            type="file" accept=".pdf,.png,.jpg,.jpeg"
                            onChange={e => setAdmReportCard(e.target.files[0])}
                            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 outline-none text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-slate-600">Transfer Certificate (TC) (PDF / Image) (if applicable)</label>
                          <input
                            id="adm-tc-input"
                            type="file" accept=".pdf,.png,.jpg,.jpeg"
                            onChange={e => setAdmTransferCertificate(e.target.files[0])}
                            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 outline-none text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-slate-600">Student Aadhaar Card (PDF / Image) (if available)</label>
                          <input
                            id="adm-aadhaar-input"
                            type="file" accept=".pdf,.png,.jpg,.jpeg"
                            onChange={e => setAdmAadhaarCard(e.target.files[0])}
                            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 outline-none text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-slate-600">Father's Aadhaar Card (PDF / Image)</label>
                          <input
                            id="adm-father-aadhaar-input"
                            type="file" accept=".pdf,.png,.jpg,.jpeg"
                            onChange={e => setAdmFatherAadhaarCard(e.target.files[0])}
                            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 outline-none text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-slate-600">Mother's Aadhaar Card (PDF / Image)</label>
                          <input
                            id="adm-mother-aadhaar-input"
                            type="file" accept=".pdf,.png,.jpg,.jpeg"
                            onChange={e => setAdmMotherAadhaarCard(e.target.files[0])}
                            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 outline-none text-xs"
                          />
                        </div>

                        <div className="grid grid-cols-1 gap-3 p-3 space-y-1 border sm:col-span-2 sm:grid-cols-2 bg-slate-100/50 rounded-2xl border-slate-200/50">
                          <div className="space-y-1">
                            <label className="font-bold text-slate-600">Address Proof Document Type</label>
                            <select
                              value={admAddressProofType}
                              onChange={e => setAdmAddressProofType(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-xl p-2.5 outline-none font-semibold text-slate-600 text-xs"
                            >
                              <option value="Aadhaar Card">Aadhaar Card</option>
                              <option value="Electricity Bill">Electricity Bill</option>
                              <option value="Water Bill">Water Bill</option>
                              <option value="Rent Agreement">Rent Agreement</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="font-bold text-slate-600">Upload Selected Address Proof (PDF / Image)</label>
                            <input
                              id="adm-address-proof-input"
                              type="file" accept=".pdf,.png,.jpg,.jpeg"
                              onChange={e => setAdmAddressProof(e.target.files[0])}
                              className="w-full bg-white border border-slate-200 rounded-xl p-2.5 outline-none text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Admission Fees Section */}
                    <div className="space-y-3">
                      <h5 className="pb-1 font-bold border-b text-slate-800 font-quicksand">4. Admission Fees Collection</h5>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="space-y-1">
                          <label className="font-bold text-slate-600">Admission Fee Amount (₹) (Not a dropdown)</label>
                          <input
                            type="number"
                            placeholder="Enter fee amount (e.g. 5000)"
                            value={admissionFee}
                            onChange={e => setAdmissionFee(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 outline-none font-semibold text-slate-700 text-xs"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 text-xs font-bold text-white transition-all shadow bg-slate-900 hover:bg-slate-800 font-quicksand rounded-xl"
                    >
                      CREATE ADMISSION RECORD & PROVISION STUDENT
                    </button>
                  </form>
                )}

                {/* Sub-tab 3: Admissions History */}
                {admissionsSubTab === 'history' && (
                  <div className="space-y-4">
                    {admissions.filter(adm => adm.status !== 'pending').length === 0 ? (
                      <p className="py-10 text-xs font-medium text-center text-slate-500">No historic admission entries found.</p>
                    ) : (
                      admissions.filter(adm => adm.status !== 'pending').map(adm => (
                        <div key={adm._id} className="flex flex-col items-start justify-between gap-4 p-5 text-xs border bg-slate-50 border-slate-100 rounded-2xl sm:flex-row sm:items-center">
                          <div className="space-y-1">
                            <span className="block font-mono font-bold text-brandCoral">{adm.applicationNumber}</span>
                            <h4 className="text-sm font-bold font-quicksand text-slate-800">{adm.studentDetails?.name}</h4>
                            <p className="font-medium text-slate-500">Class: <span className="font-bold text-slate-800">{adm.studentDetails?.class}</span> | Parent: <span className="font-bold text-slate-800">{adm.parentDetails?.fatherName || adm.parentDetails?.motherName}</span></p>
                          </div>
                          <div className="flex items-center justify-between w-full gap-3 sm:w-auto sm:justify-end">
                            <span className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full border ${adm.status === 'approved' ? 'bg-brandMint/10 text-brandMint-dark border-brandMint/30' :
                                'bg-red-50 text-red-600 border border-red-100'
                              }`}>
                              {adm.status}
                            </span>
                            <button
                              onClick={() => {
                                setSelectedAdmission(adm);
                                setParentPassword('');
                                setRemarks(adm.remarks || '');
                              }}
                              className="font-quicksand font-bold text-xs bg-[#9F92EC] hover:bg-[#8C7EB5] text-white px-4 py-2.5 rounded-xl shadow cursor-pointer transition-all active:scale-[0.98]"
                            >
                              VIEW DETAILS
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: Users catalog */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                <div className="flex flex-col justify-between gap-4 pb-4 border-b sm:flex-row sm:items-center border-orange-50">
                  <h3 className="text-lg font-bold font-quicksand text-slate-800">Students & Teachers Hub</h3>

                  {/* Sub-tabs selection */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setUsersSubTab('registry')}
                      className={`px-4 py-2 text-xs font-bold font-quicksand rounded-xl transition-all ${usersSubTab === 'registry'
                          ? 'bg-[#9F92EC] text-white shadow'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                      Student Registry ({students.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setUsersSubTab('direct')}
                      className={`px-4 py-2 text-xs font-bold font-quicksand rounded-xl transition-all ${usersSubTab === 'direct'
                          ? 'bg-[#9F92EC] text-white shadow'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                      Direct Registration
                    </button>
                    <button
                      type="button"
                      onClick={() => setUsersSubTab('teacher_form')}
                      className={`px-4 py-2 text-xs font-bold font-quicksand rounded-xl transition-all ${usersSubTab === 'teacher_form'
                          ? 'bg-[#9F92EC] text-white shadow'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                      Staff Teachers ({teachers.length})
                    </button>
                  </div>
                </div>

                {/* Sub-tab 1: Student Registry Database */}
                {usersSubTab === 'registry' && (
                  <div className="space-y-4">
                    {/* Search and Filters panel */}
                    <div className="flex flex-col gap-3 p-4 text-xs border bg-slate-50 border-slate-100 rounded-3xl sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex flex-col flex-1 gap-2 sm:flex-row sm:items-center">
                        <div className="relative flex-1">
                          <Search className="absolute w-4 h-4 text-slate-400 left-3 top-3" />
                          <input
                            type="text"
                            placeholder="Search student by name..."
                            value={studentSearchQuery}
                            onChange={e => setStudentSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none"
                          />
                        </div>
                        <select
                          value={studentClassFilter}
                          onChange={e => setStudentClassFilter(e.target.value)}
                          className="bg-white border border-slate-200 rounded-xl p-2.5 outline-none font-semibold text-slate-600"
                        >
                          <option value="">-- All Classes --</option>
                          <option value="Pre-Nursery">Pre-Nursery</option>
                          <option value="Nursery">Nursery</option>
                          <option value="Junior KG">Junior KG</option>
                          <option value="Senior KG">Senior KG</option>
                          <option value="1st">1st</option>
                          <option value="2nd">2nd</option>
                          <option value="3rd">3rd</option>
                          <option value="4th">4th</option>
                          <option value="5th">5th</option>
                          <option value="6th">6th</option>
                          <option value="7th">7th</option>
                          <option value="8th">8th</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleExportCSV}
                          className="px-4 py-2.5 bg-slate-900 text-white font-quicksand font-bold rounded-xl flex items-center space-x-1.5 shadow hover:bg-slate-800 transition-all cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Export CSV</span>
                        </button>
                        <button
                          type="button"
                          onClick={handlePrintPDF}
                          className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-quicksand font-bold rounded-xl flex items-center space-x-1.5 shadow hover:bg-slate-50 transition-all cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Print List</span>
                        </button>
                      </div>
                    </div>

                    {/* Student Grid / List Table */}
                    <div className="overflow-x-auto bg-white border shadow-sm border-slate-100 rounded-3xl">
                      <table className="w-full text-xs text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                            <th className="p-4">Student ID</th>
                            <th className="p-4">Student Name</th>
                            <th className="p-4">Class</th>
                            <th className="p-4">Gender</th>
                            <th className="p-4">Parent Details</th>
                            <th className="p-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="font-medium divide-y divide-slate-100 text-slate-700">
                          {students.filter(s => {
                            const classMatch = studentClassFilter ? s.class === studentClassFilter : true;
                            const nameMatch = s.name.toLowerCase().includes(studentSearchQuery.toLowerCase());
                            return classMatch && nameMatch;
                          }).length === 0 ? (
                            <tr>
                              <td colSpan="6" className="p-10 text-center text-slate-400">
                                No matching students found in the database.
                              </td>
                            </tr>
                          ) : (
                            students.filter(s => {
                              const classMatch = studentClassFilter ? s.class === studentClassFilter : true;
                              const nameMatch = s.name.toLowerCase().includes(studentSearchQuery.toLowerCase());
                              return classMatch && nameMatch;
                            }).map(std => (
                              <tr key={std._id} className="transition-all hover:bg-slate-50/50">
                                <td className="p-4 font-mono font-bold text-slate-850">
                                  {std.studentId || 'N/A'}
                                </td>
                                <td className="p-4">
                                  <span className="block text-sm font-bold text-slate-800 font-quicksand">{std.name}</span>
                                  <span className="text-[10px] text-slate-450 block mt-0.5">
                                    DOB: {std.dateOfBirth ? new Date(std.dateOfBirth).toLocaleDateString() : 'N/A'}
                                  </span>
                                </td>
                                <td className="p-4">
                                  <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-[#EAE8FC] text-[#7C3AED] border border-[#DEDAFB]">
                                    {std.class}
                                  </span>
                                </td>
                                <td className="p-4">{std.gender}</td>
                                <td className="p-4">
                                  <span className="block font-bold text-slate-800">
                                    {std.parentId?.name || std.parentDetails?.fatherName || std.parentDetails?.motherName || 'N/A'}
                                  </span>
                                  <span className="text-[10px] text-slate-450 block mt-0.5 font-mono">
                                    {std.parentId?.phone || std.parentDetails?.phone || 'N/A'}
                                  </span>
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      onClick={() => setSelectedStudentProfile(std)}
                                      className="px-3 py-1.5 font-bold text-[10px] rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer"
                                    >
                                      View
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setActiveIdCard(std)}
                                      className="px-3 py-1.5 font-bold text-[10px] rounded-lg bg-[#FAF8F5] hover:bg-orange-50 text-brandCoral border border-orange-100/50 transition-all cursor-pointer flex items-center gap-1"
                                    >
                                      <Contact className="w-3 h-3" />
                                      <span>ID Card</span>
                                    </button>
                                    <button
                                      onClick={() => handleStartEditStudent(std)}
                                      className="px-3 py-1.5 font-bold text-[10px] rounded-lg bg-[#EAE8FC] hover:bg-[#DEDAFB] text-[#7C3AED] transition-all flex items-center gap-1 cursor-pointer"
                                    >
                                      <Edit className="w-3 h-3" />
                                      <span>Edit</span>
                                    </button>
                                    <button
                                      onClick={() => handleDeleteStudent(std._id)}
                                      className="p-1.5 text-red-500 hover:text-red-705 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-lg transition-all cursor-pointer"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Sub-tab 2: Direct Student Registration Form */}
                {usersSubTab === 'direct' && (
                  <form onSubmit={handleRegisterStudent} className="p-5 space-y-6 text-xs border bg-slate-50/50 border-slate-100 rounded-3xl">
                    <div>
                      <h4 className="text-sm font-bold font-quicksand text-[#5B468C] mb-1">Direct Student Registration Entry</h4>
                      <p className="font-semibold text-slate-500">Manually register an existing student directly into the active database. This assigns a unique Student ID and provisions parent credentials immediately.</p>
                    </div>

                    {/* Student Section */}
                    <div className="space-y-3">
                      <h5 className="pb-1 font-bold border-b text-slate-800 font-quicksand">1. Student Profile</h5>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                        <div className="space-y-1">
                          <label className="font-bold text-slate-600">Student Full Name</label>
                          <input
                            type="text" required placeholder="Full Name"
                            value={regStdName} onChange={e => setRegStdName(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-slate-600">Date of Birth</label>
                          <input
                            type="date" required
                            value={regStdDob} onChange={e => setRegStdDob(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 outline-none text-slate-600 font-semibold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-slate-600">Gender</label>
                          <select
                            value={regStdGender} onChange={e => setRegStdGender(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 outline-none font-semibold text-slate-600"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-slate-600">Class Program</label>
                          <select
                            value={regStdClass} onChange={e => setRegStdClass(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 outline-none font-semibold text-slate-600"
                          >
                            <option value="Pre-Nursery">Pre-Nursery</option>
                            <option value="Nursery">Nursery</option>
                            <option value="Junior KG">Junior KG</option>
                            <option value="Senior KG">Senior KG</option>
                            <option value="1st">1st</option>
                            <option value="2nd">2nd</option>
                            <option value="3rd">3rd</option>
                            <option value="4th">4th</option>
                            <option value="5th">5th</option>
                            <option value="6th">6th</option>
                            <option value="7th">7th</option>
                            <option value="8th">8th</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Parent Section */}
                    <div className="space-y-3">
                      <h5 className="pb-1 font-bold border-b text-slate-800 font-quicksand">2. Parent / Guardian Credentials</h5>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="space-y-1">
                          <label className="font-bold text-slate-600">Parent Full Name</label>
                          <input
                            type="text" required placeholder="Parent Full Name"
                            value={regParentName} onChange={e => setRegParentName(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-slate-600">Email Address (Login Username)</label>
                          <input
                            type="email" required placeholder="parent@email.com"
                            value={regParentEmail} onChange={e => setRegParentEmail(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-slate-600">Contact Phone Number</label>
                          <input
                            type="text" required placeholder="e.g. +91 99887 76655"
                            value={regParentPhone} onChange={e => setRegParentPhone(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-slate-600">Home Address</label>
                          <input
                            type="text" required placeholder="Home Address"
                            value={regParentAddress} onChange={e => setRegParentAddress(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 outline-none"
                          />
                        </div>
                        <div className="space-y-1 sm:col-span-2">
                          <label className="font-bold text-slate-600">Parent Password (defaults to "parent123" if empty)</label>
                          <input
                            type="text" placeholder="Set login password for parent portal..."
                            value={regParentPassword} onChange={e => setRegParentPassword(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 text-xs font-bold text-white transition-all shadow cursor-pointer bg-slate-900 hover:bg-slate-800 font-quicksand rounded-xl"
                    >
                      REGISTER STUDENT RECORD
                    </button>
                  </form>
                )}

                {/* Sub-tab 3: Staff Teachers & Hiring */}
                {usersSubTab === 'teacher_form' && (
                  <div className="space-y-6 text-xs">
                    {/* Hire Teacher Form */}
                    <form onSubmit={handleCreateTeacher} className="p-5 space-y-4 border bg-slate-50/50 border-slate-100 rounded-3xl">
                      <h4 className="font-quicksand font-bold text-slate-800 text-sm flex items-center space-x-1.5">
                        <Plus className="w-4.5 h-4.5 text-brandCoral" />
                        <span>Hire & Register a New Teacher</span>
                      </h4>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                        <div className="space-y-1">
                          <label className="font-bold text-slate-600">Full Name</label>
                          <input
                            type="text" required placeholder="Full Name"
                            value={tName} onChange={e => setTName(e.target.value)}
                            className="w-full bg-white border rounded-xl p-2.5 outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-slate-600">Email Address</label>
                          <input
                            type="email" required placeholder="Email Address"
                            value={tEmail} onChange={e => setTEmail(e.target.value)}
                            className="w-full bg-white border rounded-xl p-2.5 outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-slate-600">Login Password</label>
                          <input
                            type="password" required placeholder="Password"
                            value={tPassword} onChange={e => setTPassword(e.target.value)}
                            className="w-full bg-white border rounded-xl p-2.5 outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-slate-600">Contact Number</label>
                          <input
                            type="text" required placeholder="Contact Number"
                            value={tPhone} onChange={e => setTPhone(e.target.value)}
                            className="w-full bg-white border rounded-xl p-2.5 outline-none"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="space-y-1">
                          <label className="font-bold text-slate-600">Qualifications (e.g. M.Ed.)</label>
                          <input
                            type="text" required placeholder="Qualifications (e.g. M.Ed.)"
                            value={tQual} onChange={e => setTQual(e.target.value)}
                            className="w-full bg-white border rounded-xl p-2.5 outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-slate-600">Assigned Class Room</label>
                          <select
                            value={tClass} onChange={e => setTClass(e.target.value)}
                            className="w-full bg-white border rounded-xl p-2.5 outline-none font-semibold text-slate-600"
                          >
                            <option value="Pre-Nursery">Pre-Nursery</option>
                            <option value="Nursery">Nursery</option>
                            <option value="Junior KG">Junior KG</option>
                            <option value="Senior KG">Senior KG</option>
                            <option value="1st">1st</option>
                            <option value="2nd">2nd</option>
                            <option value="3rd">3rd</option>
                            <option value="4th">4th</option>
                            <option value="5th">5th</option>
                            <option value="6th">6th</option>
                            <option value="7th">7th</option>
                            <option value="8th">8th</option>
                          </select>
                        </div>
                      </div>
                      <button type="submit" className="w-full bg-slate-900 hover:bg-slate-850 text-white font-quicksand font-bold text-xs py-2.5 rounded-xl transition-all shadow cursor-pointer">
                        HIRE STAFF MEMBER
                      </button>
                    </form>

                    {/* Teachers Roster List */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold font-quicksand text-slate-800">Active Teachers Roster</h4>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {teachers.map(teach => (
                          <div key={teach._id} className="flex flex-col justify-between p-4 space-y-2 text-xs bg-white border border-slate-100 rounded-2xl">
                            <div>
                              <span className="text-[9px] font-extrabold tracking-widest text-[#7C3AED] bg-[#EAE8FC] px-2.5 py-0.5 rounded-full uppercase">
                                {teach.qualifications || 'Staff Teacher'}
                              </span>
                              <h5 className="mt-2 text-sm font-bold font-quicksand text-slate-800">{teach.name || teach.userId?.name}</h5>
                              <div className="mt-1 space-y-0.5 text-slate-500 font-semibold">
                                <p>Email: <span className="font-mono text-slate-700">{teach.email || teach.userId?.email}</span></p>
                                <p>Phone: <span className="text-slate-700">{teach.phone || 'N/A'}</span></p>
                                <p>Assigned Class: <span className="font-bold text-brandCoral">{(teach.classesAssigned && teach.classesAssigned.join(', ')) || 'None'}</span></p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: Fees Manager */}
            {activeTab === 'fees' && (
              <div className="space-y-8">

                {/* Generate Fee Invoice Form */}
                <form onSubmit={handleCreateFee} className="p-5 space-y-4 border bg-slate-50/50 border-slate-100 rounded-3xl">
                  <h4 className="text-sm font-bold font-quicksand text-slate-800">Create Student Fee Invoice</h4>
                  <div className="grid grid-cols-1 gap-4 text-xs sm:grid-cols-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-600">1. Filter by Class</label>
                      <select
                        value={feeClassFilter}
                        onChange={e => {
                          setFeeClassFilter(e.target.value);
                          setFeeStdId(''); // Clear selection
                        }}
                        className="bg-white border border-slate-200 rounded-xl p-2.5 w-full outline-none font-semibold text-slate-600"
                      >
                        <option value="">-- All Classes --</option>
                        <option value="Pre-Nursery">Pre-Nursery</option>
                        <option value="Nursery">Nursery</option>
                        <option value="Junior KG">Junior KG</option>
                        <option value="Senior KG">Senior KG</option>
                        <option value="1st">1st</option>
                        <option value="2nd">2nd</option>
                        <option value="3rd">3rd</option>
                        <option value="4th">4th</option>
                        <option value="5th">5th</option>
                        <option value="6th">6th</option>
                        <option value="7th">7th</option>
                        <option value="8th">8th</option>
                      </select>
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="font-bold text-slate-600">2. Search & Select Student</label>
                      <input
                        type="text"
                        value={feeSearchQuery}
                        onChange={e => setFeeSearchQuery(e.target.value)}
                        placeholder="Type name to search..."
                        className="bg-white border border-slate-200 rounded-xl p-2.5 w-full outline-none text-xs"
                      />

                      <div className="mt-2 overflow-y-auto bg-white border divide-y shadow-inner max-h-32 border-orange-50 rounded-xl divide-slate-100">
                        {students.filter(s => {
                          const classMatch = feeClassFilter ? s.class === feeClassFilter : true;
                          const nameMatch = s.name.toLowerCase().includes(feeSearchQuery.toLowerCase());
                          return classMatch && nameMatch;
                        }).length === 0 ? (
                          <p className="p-3 text-xs text-center text-slate-400">No matching students found.</p>
                        ) : (
                          students.filter(s => {
                            const classMatch = feeClassFilter ? s.class === feeClassFilter : true;
                            const nameMatch = s.name.toLowerCase().includes(feeSearchQuery.toLowerCase());
                            return classMatch && nameMatch;
                          }).map(s => {
                            const isSelected = feeStdId === s._id;
                            return (
                              <button
                                key={s._id}
                                type="button"
                                onClick={() => {
                                  setFeeStdId(s._id);
                                  const classFees = {
                                    'Pre-Nursery': 1200,
                                    'Nursery': 1250,
                                    'Junior KG': 1500,
                                    'Senior KG': 1600,
                                    'Preschool': 1500,
                                    '1st': 1800,
                                    '2nd': 1900,
                                    '3rd': 2000,
                                    '4th': 2100,
                                    '5th': 2200,
                                    '6th': 2300,
                                    '7th': 2400,
                                    '8th': 2505
                                  };
                                  const defaultFee = classFees[s.class] || 1500;
                                  setFeeAmount(defaultFee.toString());
                                }}
                                className={`w-full text-left px-3 py-2 text-xs flex justify-between items-center transition-all ${isSelected ? 'bg-orange-50 text-brandCoral font-bold' : 'hover:bg-slate-50 text-slate-600'
                                  }`}
                              >
                                <span>{s.name} ({s.class})</span>
                                <span className="text-[10px] text-slate-400 font-mono">ID: {s._id}</span>
                              </button>
                            );
                          })
                        )}
                      </div>
                      {feeStdId && (
                        <div className="mt-2 text-xs font-bold text-brandMint-dark bg-brandMint/10 px-3 py-1.5 rounded-lg border border-brandMint/20 flex justify-between items-center">
                          <span>Selected Student: {students.find(s => s._id === feeStdId)?.name}</span>
                          <button type="button" onClick={() => setFeeStdId('')} className="text-red-500 hover:text-red-700">Clear</button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-600">Fee Amount (₹)</label>
                      <input
                        type="number"
                        value={feeAmount}
                        onChange={e => setFeeAmount(e.target.value)}
                        placeholder="Enter fee amount (₹)"
                        required
                        className="bg-white border border-slate-200 rounded-xl p-2.5 w-full outline-none font-semibold text-slate-700"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-600">Term Name</label>
                      <select
                        value={feeTerm} onChange={e => setFeeTerm(e.target.value)}
                        className="bg-white border border-slate-200 rounded-xl p-2.5 w-full outline-none font-semibold text-slate-600"
                      >
                        <option>Term 1 (April )</option>
                        <option>Term 2 (May )</option>
                        <option>Term 3 (June )</option>
                        <option>Term 4 (July )</option>
                        <option>Term 5 (August )</option>
                        <option>Term 6 (September )</option>
                        <option>Term 7 (October )</option>
                        <option>Term 8 (November )</option>
                        <option>Term 9 (December )</option>
                        <option>Term 10 (January )</option>
                        <option>Term 11 (February )</option>
                        <option>Term 12 (March )</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-600">Due Date</label>
                      <input
                        type="date" required
                        value={feeDueDate} onChange={e => setFeeDueDate(e.target.value)}
                        className="bg-white border border-slate-200 rounded-xl p-2.5 w-full outline-none text-slate-600 font-semibold"
                      />
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-slate-900 text-white font-quicksand font-bold text-xs py-2.5 rounded-xl transition-all shadow">
                    BILL STUDENT INVOICE
                  </button>
                </form>

                {/* Organized Invoices list */}
                <div className="space-y-4">
                  <div className="pt-6 border-t">
                    <h3 className="mb-4 text-base font-bold font-quicksand text-slate-800">Issued Invoices Ledger</h3>

                    {/* Stats Summary Cards */}
                    <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-3">
                      <div className="bg-[#FAF8F5] border border-orange-100 p-4 rounded-2xl">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Total Invoiced</span>
                        <span className="block mt-1 font-mono text-lg font-extrabold text-slate-800">
                          ₹{fees.reduce((sum, f) => sum + f.amount, 0).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="p-4 border bg-brandMint/5 border-brandMint/10 rounded-2xl">
                        <span className="text-[10px] uppercase font-bold text-brandMint-dark block tracking-wider">Total Collected (Paid)</span>
                        <span className="block mt-1 font-mono text-lg font-extrabold text-brandMint-dark">
                          ₹{fees.filter(f => f.status === 'paid').reduce((sum, f) => sum + f.amount, 0).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="p-4 border bg-rose-50 border-rose-100 rounded-2xl">
                        <span className="text-[10px] uppercase font-bold text-rose-500 block tracking-wider">Total Outstanding (Pending)</span>
                        <span className="block mt-1 font-mono text-lg font-extrabold text-rose-600">
                          ₹{fees.filter(f => f.status !== 'paid').reduce((sum, f) => sum + f.amount, 0).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* Filter Controls Row */}
                    <div className="grid grid-cols-1 gap-3 p-4 mb-4 text-xs border sm:grid-cols-3 bg-slate-50 border-slate-100 rounded-2xl">
                      <div className="space-y-1">
                        <label className="font-bold text-slate-500">Search Student Name</label>
                        <input
                          type="text"
                          value={listFeeSearchName}
                          onChange={e => setListFeeSearchName(e.target.value)}
                          placeholder="Search student..."
                          className="w-full p-2 bg-white border outline-none border-slate-200 rounded-xl"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-500">Filter by Class</label>
                        <select
                          value={listFeeClassFilter}
                          onChange={e => setListFeeClassFilter(e.target.value)}
                          className="w-full p-2 font-semibold bg-white border outline-none border-slate-200 rounded-xl text-slate-600"
                        >
                          <option value="">-- All Classes --</option>
                          <option value="Pre-Nursery">Pre-Nursery</option>
                          <option value="Nursery">Nursery</option>
                          <option value="Junior KG">Junior KG</option>
                          <option value="Senior KG">Senior KG</option>
                          <option value="1st">1st</option>
                          <option value="2nd">2nd</option>
                          <option value="3rd">3rd</option>
                          <option value="4th">4th</option>
                          <option value="5th">5th</option>
                          <option value="6th">6th</option>
                          <option value="7th">7th</option>
                          <option value="8th">8th</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-500">Filter by Status</label>
                        <select
                          value={listFeeStatusFilter}
                          onChange={e => setListFeeStatusFilter(e.target.value)}
                          className="w-full p-2 font-semibold bg-white border outline-none border-slate-200 rounded-xl text-slate-600"
                        >
                          <option value="all">-- All Statuses --</option>
                          <option value="paid">Paid</option>
                          <option value="pending">Pending</option>
                          <option value="overdue">Overdue</option>
                        </select>
                      </div>
                    </div>

                    {/* List Table */}
                    <div className="overflow-x-auto bg-white border shadow-sm border-slate-100 rounded-2xl">
                      <table className="w-full text-left border-collapse text-[11px]">
                        <thead>
                          <tr className="font-bold tracking-wider uppercase border-b bg-slate-50 border-slate-100 text-slate-500">
                            <th className="p-3">Student Name</th>
                            <th className="p-3">Class</th>
                            <th className="p-3">Term / Invoice</th>
                            <th className="p-3">Amount</th>
                            <th className="p-3">Due Date</th>
                            <th className="p-3">Status</th>
                            <th className="p-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {fees.filter(f => {
                            const studentInfo = getStudentInfo(f);
                            const nameMatch = studentInfo.name.toLowerCase().includes(listFeeSearchName.toLowerCase());
                            const classMatch = listFeeClassFilter ? studentInfo.class === listFeeClassFilter : true;
                            const statusMatch = listFeeStatusFilter === 'all' ? true : f.status === listFeeStatusFilter;
                            return nameMatch && classMatch && statusMatch;
                          }).length === 0 ? (
                            <tr>
                              <td colSpan="7" className="p-8 font-medium text-center text-slate-400">
                                No matching issued invoices found.
                              </td>
                            </tr>
                          ) : (
                            fees.filter(f => {
                              const studentInfo = getStudentInfo(f);
                              const nameMatch = studentInfo.name.toLowerCase().includes(listFeeSearchName.toLowerCase());
                              const classMatch = listFeeClassFilter ? studentInfo.class === listFeeClassFilter : true;
                              const statusMatch = listFeeStatusFilter === 'all' ? true : f.status === listFeeStatusFilter;
                              return nameMatch && classMatch && statusMatch;
                            }).map(f => {
                              const sInfo = getStudentInfo(f);
                              const isPaid = f.status === 'paid';
                              return (
                                <tr key={f._id} className="font-medium transition-all border-b border-slate-50 hover:bg-slate-50/50 text-slate-700">
                                  <td className="p-3">
                                    <span className="block text-xs font-bold text-slate-800">{sInfo.name}</span>
                                    <span className="text-[9px] text-slate-400 font-mono">ID: {sInfo.id}</span>
                                  </td>
                                  <td className="p-3 font-bold text-slate-500">{sInfo.class}</td>
                                  <td className="p-3 text-slate-800">{f.term}</td>
                                  <td className="p-3 font-mono font-bold">₹{f.amount.toLocaleString('en-IN')}</td>
                                  <td className="p-3 text-slate-500">{new Date(f.dueDate).toLocaleDateString()}</td>
                                  <td className="p-3">
                                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] uppercase font-bold border ${isPaid ? 'bg-brandMint/10 text-brandMint-dark border-brandMint/30' :
                                        f.status === 'overdue' ? 'bg-red-50 text-red-600 border border-red-100' :
                                          'bg-brandYellow/10 text-brandYellow-dark border border-brandYellow/30'
                                      }`}>
                                      {f.status}
                                    </span>
                                  </td>
                                  <td className="p-3 text-right">
                                    {isPaid ? (
                                      <button
                                        type="button"
                                        onClick={() => handleViewReceipt(f._id)}
                                        className="font-quicksand font-bold text-[9px] bg-slate-900 hover:bg-slate-800 text-white px-2.5 py-1.5 rounded-lg shadow-sm cursor-pointer transition-all active:scale-[0.98]"
                                      >
                                        Print Receipt
                                      </button>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() => handleCollectPayment(f._id)}
                                        className="font-quicksand font-bold text-[9px] bg-brandMint hover:bg-brandMint-dark text-white px-2.5 py-1.5 rounded-lg shadow-sm cursor-pointer transition-all active:scale-[0.98]"
                                      >
                                        Collect Cash
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 5: Announcements notice board */}
            {activeTab === 'announcements' && (
              <form onSubmit={handleCreateAnnouncement} className="p-5 space-y-4 border bg-slate-50/50 border-slate-100 rounded-3xl">
                <h4 className="text-sm font-bold font-quicksand text-slate-800">Publish Notice Board Circular</h4>

                <div className="space-y-1 text-xs">
                  <label className="font-bold text-slate-600">Notice Title</label>
                  <input
                    type="text" required placeholder="e.g. Independence Day Holiday Notification"
                    value={annTitle} onChange={e => setAnnTitle(e.target.value)}
                    className="w-full p-3 bg-white border outline-none rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-600">Category</label>
                    <select value={annCat} onChange={e => setAnnCat(e.target.value)} className="bg-white border rounded-xl p-2.5 w-full outline-none">
                      <option value="general">General</option>
                      <option value="circular">Official Circular</option>
                      <option value="event">PTM / Event Schedule</option>
                      <option value="emergency">Emergency Alert</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-600">Audience Group</label>
                    <select value={annAudience} onChange={e => setAnnAudience(e.target.value)} className="bg-white border rounded-xl p-2.5 w-full outline-none">
                      <option value="all">Everyone (All Visitors)</option>
                      <option value="parents">Parents Only</option>
                      <option value="teachers">Teachers Only</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <label className="font-bold text-slate-600">Bulletin Content</label>
                  <textarea
                    required rows={4} placeholder="Write announcement notices description..."
                    value={annContent} onChange={e => setAnnContent(e.target.value)}
                    className="w-full p-3 bg-white border outline-none resize-none rounded-xl"
                  />
                </div>

                <button type="submit" className="w-full bg-slate-900 text-white font-quicksand font-bold text-xs py-2.5 rounded-xl transition-all shadow">
                  PUBLISH BULLETIN NOTICE
                </button>
              </form>
            )}

            {/* TAB 6: Gallery Manager */}
            {activeTab === 'gallery' && (
              <div className="space-y-8">
                <form onSubmit={handleCreateGallery} className="p-5 space-y-4 border bg-slate-50/50 border-slate-100 rounded-3xl">
                  <h4 className="text-sm font-bold font-quicksand text-slate-800">Add Media Album to Gallery</h4>

                  <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-600">Media Title</label>
                      <input
                        type="text" required placeholder="e.g. Toddler Sandbox Activities"
                        value={galTitle} onChange={e => setGalTitle(e.target.value)}
                        className="w-full p-3 bg-white border outline-none rounded-xl"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-600">Category Tag</label>
                      <select value={galCat} onChange={e => setGalCat(e.target.value)} className="bg-white border rounded-xl p-2.5 w-full outline-none font-semibold text-slate-600">
                        <option value="classroom">Classroom</option>
                        <option value="events">Events</option>
                        <option value="sports">Sports</option>
                        <option value="celebrations">Celebrations</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <label className="font-bold text-slate-600">Media Image File (JPG/JPEG/PNG)</label>
                    <input
                      id="gallery-file-input"
                      type="file" required accept=".jpg,.jpeg,.png"
                      onChange={e => setGalFile(e.target.files[0])}
                      className="w-full p-3 bg-white border border-orange-100 outline-none focus:border-brandCoral rounded-xl"
                    />
                  </div>

                  <div className="space-y-1 text-xs">
                    <label className="font-bold text-slate-600">Description</label>
                    <input
                      type="text" placeholder="Short description of the photo event..."
                      value={galDesc} onChange={e => setGalDesc(e.target.value)}
                      className="w-full p-3 bg-white border outline-none rounded-xl"
                    />
                  </div>

                  <button type="submit" className="w-full bg-slate-900 text-white font-quicksand font-bold text-xs py-2.5 rounded-xl transition-all shadow">
                    ADD MEDIA FILE
                  </button>
                </form>

                {/* Gallery Items List */}
                <div className="space-y-4">
                  <h3 className="pb-2 text-base font-bold border-b font-quicksand text-slate-800">Existing Gallery Media</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {galItems.map(item => (
                      <div key={item._id} className="flex flex-col justify-between overflow-hidden text-xs bg-white border shadow-sm border-slate-100 rounded-xl">
                        <div>
                          <div className="relative h-32 overflow-hidden">
                            <img src={item.url} alt={item.title} className="object-cover w-full h-full" />
                            <span className="absolute top-2 right-2 bg-slate-900/80 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                              {item.category}
                            </span>
                          </div>
                          <div className="p-3 space-y-1">
                            <h4 className="text-sm font-bold leading-tight font-quicksand text-slate-800">{item.title}</h4>
                            <p className="text-slate-500 line-clamp-2">{item.description || 'No description'}</p>
                            <span className="text-[9px] text-slate-400 block mt-1">Date posted: {new Date(item.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex justify-end p-3 pt-0">
                          <button
                            onClick={() => handleDeleteGallery(item._id)}
                            className="bg-red-50 hover:bg-red-100 text-red-500 px-3 py-1.5 rounded-lg transition-all border border-red-100 flex items-center space-x-1 font-bold text-[10px]"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>DELETE</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 7: Queries Resolve */}
            {activeTab === 'queries' && (
              <div className="space-y-4 text-xs font-semibold text-slate-600">
                <h3 className="pb-3 text-lg font-bold border-b font-quicksand text-slate-800 border-orange-50">Visitor Query Tickets</h3>

                {queries.length === 0 ? (
                  <p className="py-10 text-xs text-center text-slate-500">No queries tickets generated yet.</p>
                ) : (
                  queries.map(q => (
                    <div key={q._id} className="p-4 space-y-3 border bg-slate-50 border-slate-100 rounded-xl">
                      <div className="flex items-start justify-between pb-2 border-b border-slate-200/50">
                        <div>
                          <h4 className="text-sm font-bold font-quicksand text-slate-800">{q.name}</h4>
                          <span className="font-medium text-slate-400">{q.email} | {q.phone}</span>
                        </div>
                        <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full border ${q.status === 'resolved' ? 'bg-brandMint/10 text-brandMint-dark border-brandMint/30' :
                            'bg-red-50 text-red-600 border border-red-100'
                          }`}>
                          {q.status}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-brandCoral block uppercase font-bold">{q.subject}</span>
                        <p className="mt-1 font-normal leading-relaxed text-slate-600">{q.message}</p>
                      </div>

                      {q.status !== 'resolved' && (
                        <div className="flex justify-end pt-1">
                          <button
                            onClick={() => handleResolveQuery(q._id)}
                            className="px-4 py-2 text-white transition-all shadow bg-brandMint hover:bg-brandMint-dark rounded-xl"
                          >
                            MARK RESOLVED
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

          </div>

        </div>

        {/* Admission Detail Modal */}
        {selectedAdmission && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white border-[6px] border-white rounded-[2.5rem] w-full max-w-xl p-6 md:p-8 shadow-2xl relative text-slate-800 max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setSelectedAdmission(null)}
                className="absolute flex items-center justify-center w-8 h-8 font-bold transition-colors rounded-full top-4 right-4 bg-slate-50 hover:bg-slate-100 text-slate-500"
              >
                ×
              </button>

              <div className="pb-3 space-y-1 text-center border-b-2 border-slate-100">
                <span className="text-[9px] font-extrabold tracking-widest text-[#7C3AED] bg-[#EAE8FC] px-2.5 py-0.5 rounded-full">APPLICATION REVIEW</span>
                <h4 className="font-quicksand font-bold text-[#5B468C] text-lg mt-2">Pranidha International School</h4>
                <p className="text-[10px] text-slate-400 font-semibold font-mono">App No: {selectedAdmission.applicationNumber}</p>
              </div>

              <div className="py-4 space-y-5 text-xs">
                {/* Section 1: Student Profile */}
                <div className="space-y-2.5">
                  <h5 className="pb-1 text-sm font-bold border-b font-quicksand text-slate-800">1. Student Profile Details</h5>
                  <div className="grid grid-cols-2 gap-3 font-semibold text-slate-500">
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase block">Student Name</span>
                      <span className="font-bold text-slate-800">{selectedAdmission.studentDetails?.name}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase block">Class Program</span>
                      <span className="font-bold text-slate-800">{selectedAdmission.studentDetails?.class}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase block">Gender</span>
                      <span className="font-bold text-slate-800">{selectedAdmission.studentDetails?.gender}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase block">Date of Birth</span>
                      <span className="font-bold text-slate-800">
                        {new Date(selectedAdmission.studentDetails?.dateOfBirth).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Section 2: Parent Profile */}
                <div className="space-y-2.5">
                  <h5 className="pb-1 text-sm font-bold border-b font-quicksand text-slate-800">2. Parent / Guardian Details</h5>
                  <div className="grid grid-cols-2 gap-3 font-semibold text-slate-500 text-slate-600">
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase block">Father's Name</span>
                      <span className="font-bold text-slate-800">{selectedAdmission.parentDetails?.fatherName || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase block">Mother's Name</span>
                      <span className="font-bold text-slate-800">{selectedAdmission.parentDetails?.motherName || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase block">Email Address</span>
                      <span className="font-mono font-bold text-slate-800">{selectedAdmission.parentDetails?.email}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase block">Phone Number</span>
                      <span className="font-bold text-slate-800">{selectedAdmission.parentDetails?.phone}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-[9px] text-slate-400 uppercase block">Home Address</span>
                      <span className="font-bold text-slate-800">{selectedAdmission.parentDetails?.address}</span>
                    </div>
                  </div>
                </div>

                {/* Section 3: Documents */}
                <div className="space-y-2.5">
                  <h5 className="pb-1 text-sm font-bold border-b font-quicksand text-slate-800">3. Attached Documents & Verification Proofs</h5>
                  <div className="grid grid-cols-2 gap-3 text-[10px]">
                    {Object.entries({
                      'Birth Certificate': selectedAdmission.documents?.birthCertificate,
                      'Student Photograph': selectedAdmission.documents?.photo,
                      'Previous Report Card / Marksheet': selectedAdmission.documents?.reportCard,
                      'Transfer Certificate (TC)': selectedAdmission.documents?.transferCertificate,
                      'Student Aadhaar Card': selectedAdmission.documents?.aadhaarCard,
                      'Father\'s Aadhaar Card': selectedAdmission.documents?.fatherAadhaarCard,
                      'Mother\'s Aadhaar Card': selectedAdmission.documents?.motherAadhaarCard,
                      [`Address Proof (${selectedAdmission.documents?.addressProofType || 'Proof'})`]: selectedAdmission.documents?.addressProof
                    }).map(([label, path]) => {
                      return (
                        <div key={label} className="flex flex-col justify-between p-2 space-y-1 border bg-slate-50 border-slate-100 rounded-xl">
                          <div>
                            <span className="text-[8px] text-slate-400 uppercase block font-bold">{label}</span>
                            <span className="font-semibold text-slate-700 truncate block text-[9px]" title={path ? path.split('/').pop() : 'Not Uploaded'}>
                              {path ? path.split('/').pop() : 'Not Uploaded'}
                            </span>
                          </div>
                          {path ? (
                            <div className="flex gap-2 pt-0.5">
                              <a
                                href={path}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[9px] font-bold text-[#5B468C] hover:underline"
                              >
                                Open File
                              </a>
                              <button
                                type="button"
                                onClick={() => {
                                  const w = window.open(path);
                                  if (w) {
                                    w.onload = () => {
                                      w.print();
                                    };
                                  }
                                }}
                                className="text-[9px] font-bold text-slate-500 hover:text-slate-700"
                              >
                                Print
                              </button>
                            </div>
                          ) : (
                            <span className="text-[9px] text-slate-400 italic">Not Uploaded</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Action Fields (Only for pending) */}
                {selectedAdmission.status === 'pending' ? (
                  <div className="bg-[#FAF9F5] border border-orange-100 p-4 rounded-3xl space-y-4">
                    <h5 className="text-xs font-bold font-quicksand text-slate-800">Approval Decisions & Provisioning</h5>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Reviewer Remarks</label>
                      <input
                        type="text"
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        placeholder="e.g. Documents verified. Approved for Nursery start."
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">
                        Provision Login Password (for parent to login)
                      </label>
                      <input
                        type="text"
                        value={parentPassword}
                        onChange={(e) => setParentPassword(e.target.value)}
                        placeholder="Enter parent login password (e.g. securePass123)"
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs outline-none"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 border p-4 rounded-3xl text-[10px] font-semibold text-slate-500 font-mono space-y-1">
                    <p>Status: <span className={`uppercase font-bold ${selectedAdmission.status === 'approved' ? 'text-emerald-600' : 'text-red-500'}`}>{selectedAdmission.status}</span></p>
                    <p>Remarks: <span className="font-sans italic text-slate-800">"{selectedAdmission.remarks || 'No remarks recorded.'}"</span></p>
                  </div>
                )}
              </div>

              {/* Modal Buttons */}
              <div className="flex gap-3 pt-2">
                {selectedAdmission.status === 'pending' ? (
                  <>
                    <button
                      onClick={() => {
                        if (!parentPassword.trim()) {
                          alert('Please fill out a password for the student/parent login account before approving.');
                          return;
                        }
                        triggerConfirm(
                          "Are you sure you want to submit?",
                          "This will approve the student and provision their parent portal account.",
                          "submit",
                          () => handleAdmissionDecision(selectedAdmission._id, 'approved', parentPassword)
                        );
                      }}
                      disabled={loading}
                      className="flex-1 py-3 px-4 rounded-2xl bg-brandMint hover:bg-brandMint-dark text-white font-quicksand font-bold text-xs shadow flex items-center justify-center space-x-1.5 cursor-pointer transition-all active:scale-[0.98]"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>APPROVE & PROVISION</span>
                    </button>
                    <button
                      onClick={() => {
                        triggerConfirm(
                          "Are you sure you want to delete?",
                          "This will reject the student application and close the file.",
                          "delete",
                          () => handleAdmissionDecision(selectedAdmission._id, 'rejected')
                        );
                      }}
                      disabled={loading}
                      className="py-3 px-5 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-quicksand font-bold text-xs shadow flex items-center justify-center space-x-1.5 cursor-pointer transition-all active:scale-[0.98]"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>REJECT</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setSelectedAdmission(null)}
                    className="w-full py-3 px-6 rounded-2xl bg-[#9F92EC] hover:bg-[#8C7EB5] text-white font-quicksand font-bold text-xs shadow transition-all active:scale-[0.98] cursor-pointer"
                  >
                    CLOSE WINDOW
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Student Profile Detail Modal */}
        {selectedStudentProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white border-[6px] border-white rounded-[2.5rem] w-full max-w-xl p-6 md:p-8 shadow-2xl relative text-slate-800 max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setSelectedStudentProfile(null)}
                className="absolute flex items-center justify-center w-8 h-8 text-xl font-bold transition-colors rounded-full top-4 right-4 bg-slate-50 hover:bg-slate-100 text-slate-500"
              >
                ×
              </button>

              <div className="pb-4 space-y-1 text-center border-b-2 border-slate-100">
                <span className="text-[10px] font-extrabold tracking-widest text-[#7C3AED] bg-[#EAE8FC] px-3 py-1 rounded-full">STUDENT CARD</span>
                <h4 className="font-quicksand font-bold text-[#5B468C] text-xl mt-3">{selectedStudentProfile.name}</h4>
                <p className="font-mono text-xs font-semibold text-slate-400">ID: {selectedStudentProfile.studentId || 'N/A'}</p>
              </div>

              <div className="py-6 space-y-5 text-xs font-semibold text-slate-600">
                {/* Basic Details */}
                <div className="space-y-3">
                  <h5 className="pb-1 text-sm font-bold border-b font-quicksand text-slate-800">1. Academic & Personal Details</h5>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block font-bold">Gender</span>
                      <span className="text-sm font-bold text-slate-850">{selectedStudentProfile.gender}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block font-bold">Class Program</span>
                      <span className="font-bold text-[#7C3AED] text-sm">{selectedStudentProfile.class}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block font-bold">Date of Birth</span>
                      <span className="text-sm font-bold text-slate-850">
                        {selectedStudentProfile.dateOfBirth ? new Date(selectedStudentProfile.dateOfBirth).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block font-bold">System Database ID</span>
                      <span className="font-mono text-slate-850">{selectedStudentProfile._id}</span>
                    </div>
                  </div>
                </div>

                {/* Parent Details */}
                <div className="space-y-3">
                  <h5 className="pb-1 text-sm font-bold border-b font-quicksand text-slate-800">2. Parent / Guardian Contacts</h5>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block font-bold">Parent Name</span>
                      <span className="text-sm font-bold text-slate-855">{selectedStudentProfile.parentId?.name || selectedStudentProfile.parentDetails?.fatherName || selectedStudentProfile.parentDetails?.motherName || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block font-bold">Phone Number</span>
                      <span className="text-sm font-bold text-slate-855">{selectedStudentProfile.parentId?.phone || selectedStudentProfile.parentDetails?.phone || 'N/A'}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-[10px] text-slate-400 uppercase block font-bold">Email Address</span>
                      <span className="font-mono text-sm font-bold text-slate-855">{selectedStudentProfile.parentId?.email || selectedStudentProfile.parentDetails?.email || 'N/A'}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-[10px] text-slate-400 uppercase block font-bold">Home Address</span>
                      <span className="text-sm font-bold text-slate-855">{selectedStudentProfile.parentId?.address || selectedStudentProfile.parentDetails?.address || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setSelectedStudentProfile(null)}
                  className="w-full py-3 px-6 rounded-2xl bg-[#9F92EC] hover:bg-[#8C7EB5] text-white font-quicksand font-bold text-xs shadow transition-all active:scale-[0.98] cursor-pointer"
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Student Modal */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <form onSubmit={handleEditStudent} className="bg-white border-[6px] border-white rounded-[2.5rem] w-full max-w-xl p-6 md:p-8 shadow-2xl relative text-slate-800 max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setEditingStudent(null)}
              className="absolute flex items-center justify-center w-8 h-8 text-xl font-bold transition-colors rounded-full top-4 right-4 bg-slate-50 hover:bg-slate-100 text-slate-500"
            >
              ×
            </button>

            <div className="pb-4 space-y-1 text-center border-b-2 border-slate-100">
              <span className="text-[10px] font-extrabold tracking-widest text-[#7C3AED] bg-[#EAE8FC] px-3 py-1 rounded-full">EDIT PROFILE</span>
              <h4 className="font-quicksand font-bold text-[#5B468C] text-xl mt-3">Edit Student Details</h4>
              <p className="font-mono text-xs font-semibold text-slate-400">ID: {editingStudent.studentId || 'N/A'}</p>
            </div>

            <div className="py-6 space-y-5 text-xs">
              {/* Section 1: Student Details */}
              <div className="space-y-3">
                <h5 className="pb-1 text-sm font-bold border-b font-quicksand text-slate-800">1. Student Details</h5>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-600">Student Name</label>
                    <input
                      type="text" required
                      value={editStdName} onChange={e => setEditStdName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-[#9F92EC]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-600">Date of Birth</label>
                    <input
                      type="date" required
                      value={editStdDob} onChange={e => setEditStdDob(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-[#9F92EC]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-600">Gender</label>
                    <select
                      value={editStdGender} onChange={e => setEditStdGender(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-[#9F92EC]"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-600">Class Program</label>
                    <select
                      value={editStdClass} onChange={e => setEditStdClass(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-[#9F92EC]"
                    >
                      <option value="Pre-Nursery">Pre-Nursery</option>
                      <option value="Nursery">Nursery</option>
                      <option value="Junior KG">Junior KG</option>
                      <option value="Senior KG">Senior KG</option>
                      <option value="1st">1st</option>
                      <option value="2nd">2nd</option>
                      <option value="3rd">3rd</option>
                      <option value="4th">4th</option>
                      <option value="5th">5th</option>
                      <option value="6th">6th</option>
                      <option value="7th">7th</option>
                      <option value="8th">8th</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Parent Details */}
              <div className="space-y-3">
                <h5 className="pb-1 text-sm font-bold border-b font-quicksand text-slate-800">2. Parent / Guardian Details</h5>

                <div className="space-y-3">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-600">Parent Full Name</label>
                      <input
                        type="text" required
                        value={editParentName} onChange={e => setEditParentName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-[#9F92EC]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-600">Contact Phone Number</label>
                      <input
                        type="text" required
                        value={editParentPhone} onChange={e => setEditParentPhone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-[#9F92EC]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-600">Home Address</label>
                    <input
                      type="text" required
                      value={editParentAddress} onChange={e => setEditParentAddress(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-[#9F92EC]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 py-3 px-4 rounded-2xl bg-brandMint hover:bg-brandMint-dark text-white font-quicksand font-bold text-xs shadow flex items-center justify-center space-x-1.5 cursor-pointer transition-all active:scale-[0.98]"
              >
                <CheckCircle className="w-4 h-4" />
                <span>SAVE CHANGES</span>
              </button>
              <button
                type="button"
                onClick={() => setEditingStudent(null)}
                className="py-3 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-quicksand font-bold text-xs shadow flex items-center justify-center space-x-1.5 cursor-pointer transition-all active:scale-[0.98]"
              >
                <span>CANCEL</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Printable Receipt Modal */}
      {activeReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm print:p-0 print:bg-white print:static print:inset-auto">
          <div className="bg-white rounded-3xl max-w-[380px] w-full p-6 shadow-2xl space-y-5 relative border-[3px] border-[#5B468C] overflow-hidden print:shadow-none print:p-4 print:border-none" id="printable-receipt">

            {/* Rotate PAID stamp watermark */}
            <div className="absolute top-[45%] left-[50%] -translate-x-1/2 -translate-y-1/2 -rotate-[15deg] text-emerald-500/10 font-mono font-black text-7xl tracking-widest uppercase select-none pointer-events-none z-0">
              PAID
            </div>

            {/* Top-Right Close Button (Hidden during print) */}
            <button
              type="button"
              onClick={() => setActiveReceipt(null)}
              className="absolute text-lg font-bold top-4 right-4 text-slate-400 hover:text-slate-600 print:hidden"
            >
              ×
            </button>

            {/* Receipt Header */}
            <div className="relative z-10 pb-6 text-center border-b border-solid border-slate-200 bg-[#F5F5FF] rounded-t-lg">
              <img src="/logo.png" alt="Pranidha Logo" className="mx-auto h-12 mb-2" />
              <h2 className="text-3xl font-serif font-bold tracking-tight text-[#5B468C]">PRANIDHA INTERNATIONAL SCHOOL</h2>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Official Fee Slip</p>
              <p className="text-[8px] text-slate-400 mt-1">123 Sunshine Street, Sector 5 | +91 98765 43210</p>
            </div>

            {/* Receipt Details Grid */}
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[10px] text-slate-600 relative z-10">
              <div>
                <span className="block font-medium text-slate-400">Receipt Number:</span>
                <span className="font-mono font-bold text-slate-800">{activeReceipt.receipt?.receiptNumber}</span>
              </div>
              <div className="text-right">
                <span className="block font-medium text-slate-400">Payment Date:</span>
                <span className="font-bold text-slate-800">{new Date(activeReceipt.receipt?.paymentDate || activeReceipt.receipt?.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="mt-1">
                <span className="block font-medium text-slate-400">Student Name:</span>
                <span className="font-bold text-slate-800 text-[11px]">{activeReceipt.student?.name}</span>
              </div>
              <div className="mt-1 text-right">
                <span className="block font-medium text-slate-400">Class Program:</span>
                <span className="font-bold text-slate-800">{activeReceipt.student?.class}</span>
              </div>
              <div className="mt-1">
                <span className="block font-medium text-slate-400">Transaction ID:</span>
                <span className="font-mono font-bold text-slate-800 text-[9px]">{activeReceipt.receipt?.transactionId}</span>
              </div>
              <div className="mt-1 text-right">
                <span className="block font-medium text-slate-400">Method:</span>
                <span className="font-bold text-slate-800">{activeReceipt.receipt?.paymentMethod}</span>
              </div>
            </div>

            {/* Particulars Table */}
            <div className="relative z-10 overflow-hidden border border-slate-200 rounded-xl">
              <table className="w-full text-left border-collapse text-[10px]">
                <thead>
                  <tr className="font-bold border-b bg-slate-50 text-slate-500 border-slate-200">
                    <th className="p-2.5">Fee Particulars</th>
                    <th className="p-2.5 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="font-medium text-slate-700">
                    <td className="p-2.5">{activeReceipt.fee?.term || 'Tuition Fee Invoice'}</td>
                    <td className="p-2.5 text-right font-bold">₹{activeReceipt.receipt?.amountPaid?.toLocaleString('en-IN')}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Total Paid block */}
            <div className="flex justify-between items-center bg-[#5B468C]/5 p-2.5 rounded-xl border border-[#5B468C]/15 relative z-10">
              <span className="text-[10px] font-bold text-slate-600">Total Billed & Paid:</span>
              <span className="text-xs font-extrabold text-[#5B468C] font-mono">₹{activeReceipt.receipt?.amountPaid?.toLocaleString('en-IN')}.00</span>
            </div>

            {/* Stamp and Seal Placeholder */}
            <div className="flex justify-between items-end pt-3 text-[9px] text-slate-400 font-semibold relative z-10">
              <div>
                <div className="flex items-center space-x-1 text-emerald-600 bg-emerald-50 border border-emerald-100 rounded px-1.5 py-0.5 text-[8px] font-mono inline-block">
                  <span>✓</span>
                  <span>ONLINE VERIFIED</span>
                </div>
                <p className="mt-1 font-bold text-slate-500 font-mono uppercase text-[8px]">Status: PAID</p>
              </div>
              <div className="text-center">
                <span className="font-serif italic font-bold text-slate-700 block text-[10px] border-b border-slate-200 pb-0.5">S. Cooper</span>
                <p className="font-bold text-[8px] text-slate-500 mt-1 uppercase tracking-wider">Admission Desk</p>
              </div>
            </div>

            {/* Actions (Hidden during print) */}
            <div className="relative z-10 flex gap-2 pt-2 border-t border-slate-100 print:hidden">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-2 bg-[#5B468C] hover:bg-[#4A3875] text-white font-quicksand font-bold text-xs rounded-xl shadow cursor-pointer transition-all active:scale-[0.98] flex items-center justify-center space-x-1"
              >
                <span>Print Slip</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveReceipt(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-quicksand font-bold text-xs rounded-xl cursor-pointer transition-all active:scale-[0.98]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student ID Card Modal */}
      {activeIdCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm print:p-0 print:bg-white print:static print:inset-auto">
          <div className="relative w-full max-w-sm p-6 space-y-5 overflow-hidden bg-white shadow-2xl rounded-3xl print:shadow-none print:p-0" id="id-card-modal-container">

            {/* Top-Right Close Button (Hidden during print) */}
            <button
              type="button"
              onClick={() => setActiveIdCard(null)}
              className="absolute z-20 text-lg font-bold top-4 right-4 text-slate-400 hover:text-slate-600 print:hidden"
            >
              ×
            </button>

            {/* Vertical ID Card Outer Layout */}
            <div className="w-[260px] h-[400px] mx-auto bg-white border-2 border-[#D4AF37] rounded-[1.5rem] relative shadow-lg overflow-hidden select-none" id="printable-id-card">

              {/* Header Slanted SVG Background */}
              <svg viewBox="0 0 260 90" className="absolute top-0 left-0 w-full h-[90px] z-0" xmlns="http://www.w3.org/2000/svg">
                <polygon points="0,0 260,0 260,65 130,85 0,65" fill="#0A1D37" />
                <polygon points="0,65 130,85 260,65 260,70 130,90 0,70" fill="#D4AF37" />
              </svg>

              {/* School Name Text */}
              <div className="absolute left-0 z-10 w-full text-center top-2">
                <h3 className="text-[20px] font-black text-white uppercase font-serif tracking-wide leading-tight">
                  Pranidha International School
                </h3>
              </div>

              {/* Student Photo */}
              <div className="absolute top-[116px] left-1/2 -translate-x-1/2 w-[90px] h-[105px] bg-[#EAEAEA] border-2 border-[#A3D2CA] rounded-xl overflow-hidden shadow-inner flex items-center justify-center z-10">
                {activeIdCard.photo ? (
                  <img src={activeIdCard.photo} alt={activeIdCard.name} className="object-cover w-full h-full" />
                ) : (
                  <div className="flex flex-col items-center text-slate-400">
                    <Users className="w-10 h-10 stroke-[1.5]" />
                    <span className="text-[7px] uppercase font-bold mt-1">Photo</span>
                  </div>
                )}
              </div>

              {/* Student Name */}
              <div className="absolute top-[230px] left-0 w-full text-center z-10 px-2">
                <h4 className="text-sm font-black text-[#A87C11] uppercase font-serif tracking-wide leading-none">{activeIdCard.name}</h4>
                <div className="w-24 h-0.5 bg-[#D4AF37] mx-auto mt-1"></div>
              </div>

              {/* Student Details Grid */}
              <div className="absolute top-[252px] left-[15px] right-[15px] text-[8.5px] text-[#0A1D37] font-extrabold z-10">
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="align-top">
                      <td className="w-[70px] py-1 text-left font-serif leading-none">Father Name</td>
                      <td className="w-[15px] py-1 text-center leading-none">-</td>
                      <td className="py-1 font-sans leading-none text-left">{activeIdCard.parentId?.name || activeIdCard.parentDetails?.fatherName || 'N/A'}</td>
                    </tr>
                    <tr className="align-top">
                      <td className="py-1 font-serif leading-none text-left">Date of Birth</td>
                      <td className="py-1 leading-none text-center">-</td>
                      <td className="py-1 font-sans leading-none text-left">
                        {activeIdCard.dateOfBirth ? new Date(activeIdCard.dateOfBirth).toLocaleDateString('en-GB').replace(/\//g, '.') : 'N/A'}
                      </td>
                    </tr>
                    <tr className="align-top">
                      <td className="py-1 font-serif leading-none text-left">Mobile No.</td>
                      <td className="py-1 leading-none text-center">-</td>
                      <td className="py-1 font-mono leading-none text-left">
                        {activeIdCard.parentId?.phone || activeIdCard.parentDetails?.phone || 'N/A'}
                      </td>
                    </tr>
                    <tr className="align-top">
                      <td className="py-1 font-serif leading-none text-left">Class</td>
                      <td className="py-1 leading-none text-center">-</td>
                      <td className="py-1 font-sans leading-none text-left">{activeIdCard.class}</td>
                    </tr>
                    <tr className="align-top">
                      <td className="py-1 font-serif leading-none text-left">Address</td>
                      <td className="py-1 leading-none text-center">-</td>
                      <td className="py-1 text-left font-sans leading-tight text-[7.5px] whitespace-pre-wrap">
                        {activeIdCard.parentId?.address || activeIdCard.parentDetails?.address || 'N/A'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Bottom Slanted SVG Background */}
              <svg viewBox="0 0 260 25" className="absolute bottom-0 left-0 w-full h-[25px] z-0" xmlns="http://www.w3.org/2000/svg">
                <polygon points="0,25 260,25 260,8 130,0 0,8" fill="#D4AF37" />
                <polygon points="0,25 260,25 260,13 130,5 0,13" fill="#0A1D37" />
              </svg>

              {/* Principal Signature */}
              <div className="absolute bottom-[4px] left-[15px] z-10 flex flex-col items-center">
                <svg viewBox="0 0 50 12" className="w-[50px] h-[12px] opacity-90" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5,9 C12,4 20,1 25,5 C30,9 35,9 40,4 M10,8 L30,3" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span className="text-[5px] text-[#0A1D37] font-black tracking-wider leading-none mt-0.5">Principal</span>
              </div>

            </div>

            {/* Print ID Card Actions (Hidden during print) */}
            <div className="flex justify-center max-w-xs gap-2 pt-2 mx-auto border-t border-slate-100 print:hidden">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-2 bg-[#5B468C] hover:bg-[#4A3875] text-white font-quicksand font-bold text-xs rounded-xl shadow cursor-pointer transition-all active:scale-[0.98] flex items-center justify-center space-x-1"
              >
                <span>Print ID Card</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveIdCard(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-quicksand font-bold text-xs rounded-xl cursor-pointer transition-all active:scale-[0.98]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Small Clay Confirmation Modal Overlay */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        type={confirmModal.type}
      />

    </div>
  );
}
