import express from 'express'
import { doctorList, loginDoctor, appointmentsDoctor, appointmentCompleted, appointmentCancel, doctorDashboard, doctorProfile, updateDoctorProfile, updateDoctorPhoto } from '../controllers/doctorController.js'
import authDoctor from '../middlewares/authDoctor.js'
import upload from '../middlewares/multer.js'
const doctorRouter = express.Router()

doctorRouter.get('/list', doctorList)

doctorRouter.post('/login', loginDoctor)

doctorRouter.get('/appointments', authDoctor ,appointmentsDoctor);

doctorRouter.post('/appointment-completed', authDoctor, appointmentCompleted);

doctorRouter.post('/appointment-cancel', authDoctor, appointmentCancel);

doctorRouter.get('/dashboard', authDoctor, doctorDashboard);

doctorRouter.get('/profile', authDoctor, doctorProfile);

doctorRouter.post('/update-profile', authDoctor, updateDoctorProfile);
doctorRouter.post('/update-photo', authDoctor, upload.single('image'), updateDoctorPhoto);



export default doctorRouter