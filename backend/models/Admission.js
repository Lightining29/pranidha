import mongoose from 'mongoose';

const AdmissionSchema = new mongoose.Schema({
  applicationNumber: {
    type: String,
    required: true,
    unique: true
  },
  studentDetails: {
    name: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, required: true },
    class: { 
      type: String, 
      required: true,
      enum: ['Pre-Nursery', 'Nursery', 'Junior KG', 'Senior KG', 'Preschool', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th']
    }
  },
  parentDetails: {
    fatherName: { type: String, required: true },
    motherName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true }
  },
  documents: {
    birthCertificate: { type: String },
    photo: { type: String },
    parentIdProof: { type: String }
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'under_review'],
    default: 'pending'
  },
  remarks: {
    type: String,
    default: ''
  },
  submissionDate: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Admission', AdmissionSchema);
