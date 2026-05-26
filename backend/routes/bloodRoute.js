import express from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import authDoctor from '../middlewares/authDoctor.js';
import authAdmin from '../middlewares/authAdmin.js';
import {
  registerDonor,
  getMyDonorProfile,
  updateDonorProfile,
  toggleAvailability,
  getDonorHistory,
  createBloodRequest,
  getMyBloodRequests,
  cancelBloodRequest,
  closeBloodRequest,
  getBloodRequestById,
  getRequestDonors,
  getActiveRequests,
  searchDonors,
  getMyNotifications,
  markNotificationsRead,
  markAllNotificationsRead,
  getUnreadCount,
  respondToRequest,
  adminGetAllDonors,
  adminBlockUnblockDonor,
  adminGetAllRequests,
  adminUpdateRequestStatus,
  adminCreateEmergencyRequest,
  adminGetAnalytics,
  adminGetNotificationLogs,
  adminDeleteDonor,
  adminToggleDonorAvailability,
} from '../controllers/bloodController.js';

const bloodRouter = express.Router();

// ── User Donor Routes ────────────────────────────────────────────────────────
bloodRouter.post('/donor/register',           verifyToken, registerDonor);
bloodRouter.get('/donor/me',                  verifyToken, getMyDonorProfile);
bloodRouter.put('/donor/update',              verifyToken, updateDonorProfile);
bloodRouter.put('/donor/toggle-availability', verifyToken, toggleAvailability);
bloodRouter.get('/donor/history',             verifyToken, getDonorHistory);

// ── User Blood Request Routes ────────────────────────────────────────────────
bloodRouter.post('/request/create',          verifyToken, createBloodRequest);
bloodRouter.get('/request/my-requests',      verifyToken, getMyBloodRequests);
bloodRouter.put('/request/cancel',           verifyToken, cancelBloodRequest);
bloodRouter.put('/request/close',            verifyToken, closeBloodRequest);
bloodRouter.get('/request/:id/donors',       verifyToken, getRequestDonors);
bloodRouter.get('/request/:id',              verifyToken, getBloodRequestById);

// ── Public Routes ────────────────────────────────────────────────────────────
bloodRouter.get('/requests/active',          getActiveRequests);

// ── User Search Route ────────────────────────────────────────────────────────
bloodRouter.post('/search/donors',           verifyToken, searchDonors);

// ── User Notification Routes ─────────────────────────────────────────────────
bloodRouter.get('/notifications',               verifyToken, getMyNotifications);
bloodRouter.put('/notifications/mark-read',     verifyToken, markNotificationsRead);
bloodRouter.put('/notifications/mark-all-read', verifyToken, markAllNotificationsRead);
bloodRouter.get('/notifications/unread-count',  verifyToken, getUnreadCount);

// ── User Response Route ──────────────────────────────────────────────────────
bloodRouter.post('/response',                verifyToken, respondToRequest);

// ── Doctor Donor Routes ──────────────────────────────────────────────────────
bloodRouter.post('/doctor/donor/register',           authDoctor, registerDonor);
bloodRouter.get('/doctor/donor/me',                  authDoctor, getMyDonorProfile);
bloodRouter.put('/doctor/donor/update',              authDoctor, updateDonorProfile);
bloodRouter.put('/doctor/donor/toggle-availability', authDoctor, toggleAvailability);
bloodRouter.get('/doctor/donor/history',             authDoctor, getDonorHistory);

// ── Doctor Blood Request Routes ──────────────────────────────────────────────
bloodRouter.post('/doctor/request/create',     authDoctor, createBloodRequest);
bloodRouter.get('/doctor/request/my-requests', authDoctor, getMyBloodRequests);
bloodRouter.put('/doctor/request/cancel',          authDoctor, cancelBloodRequest);
bloodRouter.put('/doctor/request/close',           authDoctor, closeBloodRequest);
bloodRouter.get('/doctor/request/:id/donors',      authDoctor, getRequestDonors);
bloodRouter.get('/doctor/request/:id',             authDoctor, getBloodRequestById);

// ── Doctor Search Route ──────────────────────────────────────────────────────
bloodRouter.post('/doctor/search/donors',      authDoctor, searchDonors);

// ── Doctor Notification Routes ───────────────────────────────────────────────
bloodRouter.get('/doctor/notifications',               authDoctor, getMyNotifications);
bloodRouter.put('/doctor/notifications/mark-read',     authDoctor, markNotificationsRead);
bloodRouter.put('/doctor/notifications/mark-all-read', authDoctor, markAllNotificationsRead);
bloodRouter.get('/doctor/notifications/unread-count',  authDoctor, getUnreadCount);

// ── Doctor Response Route ────────────────────────────────────────────────────
bloodRouter.post('/doctor/response',           authDoctor, respondToRequest);

// ── Admin Routes ─────────────────────────────────────────────────────────────
bloodRouter.get('/admin/donors',                    authAdmin, adminGetAllDonors);
bloodRouter.put('/admin/donors/block-unblock',      authAdmin, adminBlockUnblockDonor);
bloodRouter.put('/admin/donors/toggle-availability',authAdmin, adminToggleDonorAvailability);
bloodRouter.delete('/admin/donors',                 authAdmin, adminDeleteDonor);
bloodRouter.get('/admin/requests',                  authAdmin, adminGetAllRequests);
bloodRouter.put('/admin/requests/status',           authAdmin, adminUpdateRequestStatus);
bloodRouter.post('/admin/requests/emergency',       authAdmin, adminCreateEmergencyRequest);
bloodRouter.get('/admin/notifications',             authAdmin, adminGetNotificationLogs);
bloodRouter.get('/admin/analytics',                 authAdmin, adminGetAnalytics);

export default bloodRouter;
