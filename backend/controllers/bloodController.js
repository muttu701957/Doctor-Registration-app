import bloodDonorModel from '../models/bloodDonorModel.js';
import bloodRequestModel from '../models/bloodRequestModel.js';
import bloodNotificationModel from '../models/bloodNotificationModel.js';
import bloodRequestResponseModel from '../models/bloodRequestResponseModel.js';
import donorAvailabilityLogModel from '../models/donorAvailabilityLogModel.js';
import { userModel } from '../models/userModel.js';
import doctorModel from '../models/doctorModel.js';
import { getCompatibleDonors } from '../utils/bloodCompatibility.js';
import {
  sendBloodRequestAlertEmail,
  sendBloodDonorRegistrationEmail,
  sendDonorAcceptedEmail,
} from '../mailtrap/emails.js';

// ─── Helpers ────────────────────────────────────────────────────────────────

const getIo = (req) => req.app.get('io');

const urgencyNotificationTitle = {
  normal:    '🩸 Blood Request Nearby',
  urgent:    '🚨 Urgent Blood Needed',
  emergency: '🆘 EMERGENCY Blood Alert',
};

// ─── DONOR REGISTRATION ─────────────────────────────────────────────────────

export const registerDonor = async (req, res) => {
  try {
    const {
      fullName, mobileNumber, bloodGroup,
      latitude, longitude, locationName,
      lastDonationDate, emergencyContact,
      acknowledgementAccepted,
      donorType,  // 'user' | 'doctor'
    } = req.body;

    // Identify caller — verifyToken sets req.userId, authDoctor sets req.body.docId
    const userId   = req.userId || null;
    const doctorId = req.body.docId || null;
    const actorId  = userId || doctorId;
    const type     = donorType || (userId ? 'user' : 'doctor');

    if (!fullName || !mobileNumber || !bloodGroup || latitude == null || longitude == null) {
      return res.status(400).json({ success: false, message: 'Required fields missing' });
    }
    if (!acknowledgementAccepted) {
      return res.status(400).json({ success: false, message: 'Acknowledgement must be accepted' });
    }

    // Validate coordinates
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return res.status(400).json({ success: false, message: 'Invalid coordinates' });
    }

    // Get email from user/doctor profile
    let email = req.body.email;
    if (!email) {
      if (userId) {
        const user = await userModel.findById(userId).select('email');
        email = user?.email;
      } else if (doctorId) {
        const doc = await doctorModel.findById(doctorId).select('email');
        email = doc?.email;
      }
    }
    if (!email) return res.status(400).json({ success: false, message: 'Email not found' });

    // Prevent duplicate registration
    const existing = await bloodDonorModel.findOne(
      type === 'user' ? { userId: actorId } : { doctorId: actorId }
    );
    if (existing) {
      return res.status(400).json({ success: false, message: 'Already registered as donor' });
    }

    const donor = new bloodDonorModel({
      donorType: type,
      userId:    type === 'user'   ? actorId : null,
      doctorId:  type === 'doctor' ? actorId : null,
      fullName, email, mobileNumber, bloodGroup,
      location: { type: 'Point', coordinates: [lng, lat] },
      locationName: locationName || '',
      availabilityStatus: true,
      lastDonationDate: lastDonationDate || null,
      emergencyContact: emergencyContact || null,
      acknowledgementAccepted: true,
      acknowledgementAcceptedAt: new Date(),
    });

    await donor.save();

    // Send registration confirmation email (async — don't block response)
    sendBloodDonorRegistrationEmail(email, fullName, bloodGroup).catch((err) => console.error('Donor registration email failed:', err.message));

    res.status(201).json({ success: true, message: 'Registered as blood donor', donor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET MY DONOR PROFILE ────────────────────────────────────────────────────

export const getMyDonorProfile = async (req, res) => {
  try {
    const userId   = req.userId || null;
    const doctorId = req.body?.docId || null;

    const query = userId ? { userId } : { doctorId };
    const donor = await bloodDonorModel.findOne(query);

    if (!donor) {
      return res.status(404).json({ success: false, message: 'Donor profile not found' });
    }
    res.status(200).json({ success: true, donor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── UPDATE DONOR PROFILE ────────────────────────────────────────────────────

export const updateDonorProfile = async (req, res) => {
  try {
    const userId   = req.userId || null;
    const doctorId = req.body?.docId || null;

    const {
      fullName, mobileNumber, bloodGroup,
      latitude, longitude, locationName,
      lastDonationDate, emergencyContact,
    } = req.body;

    const query = userId ? { userId } : { doctorId };
    const donor = await bloodDonorModel.findOne(query);
    if (!donor) return res.status(404).json({ success: false, message: 'Donor profile not found' });

    const updates = {};
    if (fullName)       updates.fullName = fullName;
    if (mobileNumber)   updates.mobileNumber = mobileNumber;
    if (bloodGroup)     updates.bloodGroup = bloodGroup;
    if (locationName)   updates.locationName = locationName;
    if (lastDonationDate) updates.lastDonationDate = new Date(lastDonationDate);
    if (emergencyContact !== undefined) updates.emergencyContact = emergencyContact;

    if (latitude != null && longitude != null) {
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        updates.location = { type: 'Point', coordinates: [lng, lat] };
      }
    }

    const updated = await bloodDonorModel.findByIdAndUpdate(donor._id, updates, { new: true });
    res.status(200).json({ success: true, message: 'Donor profile updated', donor: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── TOGGLE AVAILABILITY ─────────────────────────────────────────────────────

export const toggleAvailability = async (req, res) => {
  try {
    const userId   = req.userId || null;
    const doctorId = req.body?.docId || null;

    const query = userId ? { userId } : { doctorId };
    const donor = await bloodDonorModel.findOne(query);
    if (!donor) return res.status(404).json({ success: false, message: 'Donor profile not found' });

    const previous = donor.availabilityStatus;
    donor.availabilityStatus = !previous;
    await donor.save();

    // Log the toggle
    await donorAvailabilityLogModel.create({
      donorId: donor._id,
      previousStatus: previous,
      newStatus: donor.availabilityStatus,
      changedBy: 'self',
    });

    res.status(200).json({
      success: true,
      message: `Availability set to ${donor.availabilityStatus ? 'available' : 'unavailable'}`,
      availabilityStatus: donor.availabilityStatus,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── CREATE BLOOD REQUEST ────────────────────────────────────────────────────

export const createBloodRequest = async (req, res) => {
  try {
    const userId   = req.userId || null;
    const doctorId = req.body?.docId || null;
    const actorId  = userId || doctorId;
    const type     = userId ? 'user' : 'doctor';

    const {
      patientName, requiredBloodGroup, contactNumber,
      latitude, longitude, locationName,
      urgencyType, additionalNotes, requiredDate,
      requestorName,
    } = req.body;

    if (!patientName || !requiredBloodGroup || !contactNumber || latitude == null || longitude == null) {
      return res.status(400).json({ success: false, message: 'Required fields missing' });
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ success: false, message: 'Invalid coordinates' });
    }

    const urgency = urgencyType || 'normal';
    const radiusMeters = urgency === 'emergency' ? 50000 : urgency === 'urgent' ? 20000 : 10000;

    const bloodRequest = new bloodRequestModel({
      requestorType: type,
      requestorId: actorId,
      requestorName: requestorName || '',
      patientName, requiredBloodGroup, contactNumber,
      location: { type: 'Point', coordinates: [lng, lat] },
      locationName: locationName || '',
      urgencyType: urgency,
      additionalNotes: additionalNotes || '',
      requiredDate: requiredDate ? new Date(requiredDate) : null,
      status: 'active',
    });

    await bloodRequest.save();

    // Find compatible nearby donors
    const compatibleGroups = getCompatibleDonors(requiredBloodGroup);

    const selfExclude = userId
      ? { userId: { $ne: String(actorId) } }
      : { doctorId: { $ne: String(actorId) } };

    const nearbyDonors = await bloodDonorModel.aggregate([
      {
        $geoNear: {
          near: { type: 'Point', coordinates: [lng, lat] },
          distanceField: 'distance',
          maxDistance: radiusMeters,
          spherical: true,
          query: {
            bloodGroup: { $in: compatibleGroups },
            availabilityStatus: true,
            isBlocked: false,
            ...selfExclude,
          },
        },
      },
      { $sort: { distance: 1 } },
      { $limit: 100 },
    ]);

    const title = urgencyNotificationTitle[urgency];

    const notificationDocs = nearbyDonors.map((donor) => {
      const distKm = (donor.distance / 1000).toFixed(1);
      return {
        recipientType: donor.donorType,
        recipientId:   donor.donorType === 'user' ? donor.userId : donor.doctorId,
        requestId:     bloodRequest._id,
        type:          urgency === 'emergency' ? 'emergency_broadcast' : urgency === 'urgent' ? 'urgent_request' : 'new_request',
        title,
        message: `${requiredBloodGroup} blood needed ${distKm}km away near ${locationName || 'your area'}. Patient: ${patientName}. Contact: ${contactNumber}`,
        urgencyType: urgency,
        latitude:  lat,
        longitude: lng,
        isRead: false,
      };
    });

    if (notificationDocs.length > 0) {
      await bloodNotificationModel.insertMany(notificationDocs);

      const responseDocs = nearbyDonors.map((donor) => ({
        requestId:       bloodRequest._id,
        donorId:         donor._id,
        donorUserId:     donor.donorType === 'user' ? donor.userId : donor.doctorId,
        donorType:       donor.donorType,
        donorName:       donor.fullName,
        donorBloodGroup: donor.bloodGroup,
        mobileNumber:    donor.mobileNumber || '',
        distanceKm:      parseFloat((donor.distance / 1000).toFixed(1)),
        locationName:    donor.locationName || '',
        responseStatus:  'notified',
        notifiedAt:      new Date(),
      }));
      await bloodRequestResponseModel.insertMany(responseDocs);
    }

    await bloodRequestModel.findByIdAndUpdate(bloodRequest._id, {
      notifiedCount: nearbyDonors.length,
    });

    // Emit real-time socket notifications
    const io = getIo(req);
    if (io) {
      nearbyDonors.forEach((donor) => {
        const recipientId = donor.donorType === 'user' ? donor.userId : donor.doctorId;
        if (recipientId) {
          const distKm = (donor.distance / 1000).toFixed(1);
          io.to(`blood-${recipientId}`).emit('blood_notification', {
            type: urgency === 'emergency' ? 'emergency_broadcast' : urgency === 'urgent' ? 'urgent_request' : 'new_request',
            title,
            message: `${requiredBloodGroup} blood needed ${distKm}km away near ${locationName || 'your area'}. Patient: ${patientName}. Contact: ${contactNumber}`,
            urgencyType: urgency,
            requestId: bloodRequest._id,
          });
        }
      });
    }

    // Send emails async — never block the response
    console.log(`[Blood] ${nearbyDonors.length} donors found for ${requiredBloodGroup} request. Sending email alerts...`);
    nearbyDonors.forEach((donor) => {
      if (!donor.email) {
        console.warn(`[Blood] Donor ${donor.fullName} (${donor._id}) has no email — skipping`);
        return;
      }
      console.log(`[Blood] Sending alert to ${donor.email} (${donor.fullName}, ${(donor.distance / 1000).toFixed(1)}km)`);
      sendBloodRequestAlertEmail(
        donor.email,
        donor.fullName,
        requiredBloodGroup,
        patientName,
        contactNumber,
        locationName || 'Nearby',
        urgency,
        (donor.distance / 1000).toFixed(1),
        lat,
        lng
      ).catch((err) => console.error(`[Blood] Email FAILED for ${donor.email}:`, err.message));
    });

    // Return donors immediately for visibility-first UX
    const donorsForClient = nearbyDonors.map((d) => ({
      donorId:        d._id,
      donorName:      d.fullName,
      donorBloodGroup: d.bloodGroup,
      mobileNumber:   d.mobileNumber || '',
      distanceKm:     parseFloat((d.distance / 1000).toFixed(1)),
      locationName:   d.locationName || '',
      availabilityStatus: d.availabilityStatus,
      lastDonationDate:   d.lastDonationDate || null,
      coordinates:    d.location?.coordinates || [],
      responseStatus: 'notified',
    }));

    res.status(201).json({
      success: true,
      message: 'Blood request created',
      requestId: bloodRequest._id,
      notifiedCount: nearbyDonors.length,
      donors: donorsForClient,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── MY BLOOD REQUESTS ───────────────────────────────────────────────────────

export const getMyBloodRequests = async (req, res) => {
  try {
    const userId   = req.userId || null;
    const doctorId = req.query?.docId || req.body?.docId || null;
    const actorId  = userId || doctorId;

    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip  = (page - 1) * limit;

    const requests = await bloodRequestModel
      .find({ requestorId: actorId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await bloodRequestModel.countDocuments({ requestorId: actorId });

    res.status(200).json({ success: true, requests, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── CANCEL / CLOSE REQUEST ──────────────────────────────────────────────────

export const cancelBloodRequest = async (req, res) => {
  try {
    const { requestId } = req.body;
    const userId   = req.userId || null;
    const doctorId = req.body?.docId || null;
    const actorId  = userId || doctorId;

    const request = await bloodRequestModel.findById(requestId);
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });
    if (request.requestorId !== actorId) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    if (request.status !== 'active') {
      return res.status(400).json({ success: false, message: 'Only active requests can be cancelled' });
    }

    request.status      = 'cancelled';
    request.cancelledAt = new Date();
    await request.save();

    res.status(200).json({ success: true, message: 'Blood request cancelled' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const closeBloodRequest = async (req, res) => {
  try {
    const { requestId } = req.body;
    const userId   = req.userId || null;
    const doctorId = req.body?.docId || null;
    const actorId  = userId || doctorId;

    const request = await bloodRequestModel.findById(requestId);
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });
    if (request.requestorId !== actorId) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    request.status      = 'fulfilled';
    request.fulfilledAt = new Date();
    await request.save();

    res.status(200).json({ success: true, message: 'Blood request marked as fulfilled' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── SEARCH DONORS ───────────────────────────────────────────────────────────

export const searchDonors = async (req, res) => {
  try {
    const {
      bloodGroup,
      latitude, longitude,
      radius = 10,
      includeCompatible = true,
      page = 1, limit = 20,
    } = req.body;

    if (!bloodGroup || latitude == null || longitude == null) {
      return res.status(400).json({ success: false, message: 'bloodGroup, latitude, longitude are required' });
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ success: false, message: 'Invalid coordinates' });
    }

    const groups = includeCompatible ? getCompatibleDonors(bloodGroup) : [bloodGroup];
    const radiusMeters = parseFloat(radius) * 1000;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const donors = await bloodDonorModel.aggregate([
      {
        $geoNear: {
          near: { type: 'Point', coordinates: [lng, lat] },
          distanceField: 'distance',
          maxDistance: radiusMeters,
          spherical: true,
          query: {
            bloodGroup: { $in: groups },
            availabilityStatus: true,
            isBlocked: false,
          },
        },
      },
      { $sort: { distance: 1 } },
      { $skip: skip },
      { $limit: parseInt(limit) },
      {
        $project: {
          fullName: 1, bloodGroup: 1,
          mobileNumber: 1, locationName: 1,
          lastDonationDate: 1, availabilityStatus: 1,
          donorType: 1,
          coordinates: '$location.coordinates',
          distanceKm: { $round: [{ $divide: ['$distance', 1000] }, 1] },
          _id: 1,
        },
      },
    ]);

    res.status(200).json({ success: true, donors, count: donors.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── PUBLIC ACTIVE REQUESTS FEED ─────────────────────────────────────────────

export const getActiveRequests = async (req, res) => {
  try {
    const page       = parseInt(req.query.page)  || 1;
    const limit      = parseInt(req.query.limit) || 20;
    const skip       = (page - 1) * limit;
    const bloodGroup  = req.query.bloodGroup  || '';
    const urgencyType = req.query.urgencyType || '';

    const query = { status: 'active' };
    if (bloodGroup)  query.requiredBloodGroup = bloodGroup;
    if (urgencyType) query.urgencyType = urgencyType;

    // Sort: emergency first, then urgent, then normal, then newest
    const urgencyOrder = { emergency: 0, urgent: 1, normal: 2 };

    const requests = await bloodRequestModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Sort by urgency priority
    requests.sort((a, b) => (urgencyOrder[a.urgencyType] ?? 2) - (urgencyOrder[b.urgencyType] ?? 2));

    const total = await bloodRequestModel.countDocuments(query);

    res.status(200).json({ success: true, requests, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── NOTIFICATIONS ───────────────────────────────────────────────────────────

export const getMyNotifications = async (req, res) => {
  try {
    const userId   = req.userId || null;
    const doctorId = req.query?.docId || req.body?.docId || null;
    const recipientId = userId || doctorId;

    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip  = (page - 1) * limit;

    const notifications = await bloodNotificationModel
      .find({ recipientId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const unreadCount = await bloodNotificationModel.countDocuments({
      recipientId,
      isRead: false,
    });

    res.status(200).json({ success: true, notifications, unreadCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markNotificationsRead = async (req, res) => {
  try {
    const { notificationIds } = req.body;
    const userId   = req.userId || null;
    const doctorId = req.body?.docId || null;
    const recipientId = userId || doctorId;

    await bloodNotificationModel.updateMany(
      { _id: { $in: notificationIds }, recipientId },
      { $set: { isRead: true, readAt: new Date() } }
    );

    res.status(200).json({ success: true, message: 'Notifications marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markAllNotificationsRead = async (req, res) => {
  try {
    const userId   = req.userId || null;
    const doctorId = req.body?.docId || null;
    const recipientId = userId || doctorId;

    await bloodNotificationModel.updateMany(
      { recipientId, isRead: false },
      { $set: { isRead: true, readAt: new Date() } }
    );

    res.status(200).json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const userId   = req.userId || null;
    const doctorId = req.query?.docId || null;
    const recipientId = userId || doctorId;

    const count = await bloodNotificationModel.countDocuments({
      recipientId,
      isRead: false,
    });

    res.status(200).json({ success: true, unreadCount: count });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── DONOR RESPONSE (accept / decline) ───────────────────────────────────────

export const respondToRequest = async (req, res) => {
  try {
    const { requestId, responseStatus, notes } = req.body;
    const userId   = req.userId || null;
    const doctorId = req.body?.docId || null;
    const actorId  = userId || doctorId;

    if (!['accepted', 'declined'].includes(responseStatus)) {
      return res.status(400).json({ success: false, message: 'responseStatus must be accepted or declined' });
    }

    const donor = await bloodDonorModel.findOne(
      userId ? { userId: actorId } : { doctorId: actorId }
    );
    if (!donor) return res.status(404).json({ success: false, message: 'Donor profile not found' });

    await bloodRequestResponseModel.findOneAndUpdate(
      { requestId, donorId: donor._id },
      {
        $set: { responseStatus, respondedAt: new Date(), notes: notes || '' },
        $setOnInsert: {
          donorUserId:     actorId,
          donorType:       userId ? 'user' : 'doctor',
          donorName:       donor.fullName,
          donorBloodGroup: donor.bloodGroup,
          notifiedAt:      new Date(),
        },
      },
      { new: true, upsert: true }
    );

    if (responseStatus === 'accepted') {
      const request = await bloodRequestModel.findById(requestId);
      if (request) {
        const io = getIo(req);
        if (io) {
          io.to(`blood-${request.requestorId}`).emit('blood_notification', {
            type: 'donor_accepted',
            title: 'Donor Accepted',
            message: `${donor.fullName} (${donor.bloodGroup}) has agreed to donate.`,
            urgencyType: request.urgencyType,
            requestId,
          });
        }
        // Persist notification for requestor
        await bloodNotificationModel.create({
          recipientType: request.requestorType,
          recipientId:   request.requestorId,
          requestId:     request._id,
          type:          'donor_accepted',
          title:         'Donor Accepted',
          message:       `${donor.fullName} (${donor.bloodGroup}) has agreed to donate for ${request.patientName}.`,
          urgencyType:   request.urgencyType,
        });

        // Email the requestor
        try {
          let requestorEmail = null;
          let requestorName  = request.requestorName || 'there';
          if (request.requestorType === 'user') {
            const u = await userModel.findById(request.requestorId).select('email name');
            requestorEmail = u?.email;
            requestorName  = u?.name || requestorName;
          } else {
            const d = await doctorModel.findById(request.requestorId).select('email name');
            requestorEmail = d?.email;
            requestorName  = d?.name || requestorName;
          }
          if (requestorEmail) {
            console.log(`[Blood] Sending donor-accepted email to requestor: ${requestorEmail}`);
            sendDonorAcceptedEmail(
              requestorEmail, requestorName,
              donor.fullName, donor.bloodGroup,
              request.patientName, request.contactNumber
            ).catch((err) => console.error(`[Blood] Donor-accepted email FAILED for ${requestorEmail}:`, err.message));
          } else {
            console.warn('[Blood] Could not find requestor email — skipping acceptance email');
          }
        } catch (emailErr) {
          console.error('[Blood] Could not look up requestor email:', emailErr.message);
        }
      }
    }

    res.status(200).json({ success: true, message: `Response recorded: ${responseStatus}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET DONORS FOR A REQUEST (visibility-first) ─────────────────────────────

export const getRequestDonors = async (req, res) => {
  try {
    const { id } = req.params;
    const userId   = req.userId || null;
    const doctorId = req.query?.docId || req.body?.docId || null;
    const actorId  = userId || doctorId;

    const request = await bloodRequestModel.findById(id);
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });

    if (String(request.requestorId) !== String(actorId)) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    // Fetch response records and live-join with donor profile for current availability + phone
    const responseDocs = await bloodRequestResponseModel.find({ requestId: id }).lean();
    const donorIds = responseDocs.map((r) => r.donorId);

    const donorProfiles = await bloodDonorModel
      .find({ _id: { $in: donorIds } })
      .select('fullName bloodGroup mobileNumber locationName availabilityStatus lastDonationDate location')
      .lean();

    const profileMap = {};
    donorProfiles.forEach((d) => { profileMap[String(d._id)] = d; });

    const donors = responseDocs.map((r) => {
      const profile = profileMap[String(r.donorId)] || {};
      return {
        donorId:            r.donorId,
        donorName:          r.donorName,
        donorBloodGroup:    r.donorBloodGroup,
        mobileNumber:       profile.mobileNumber || r.mobileNumber || '',
        distanceKm:         r.distanceKm ?? null,
        locationName:       profile.locationName || r.locationName || '',
        availabilityStatus: profile.availabilityStatus ?? true,
        lastDonationDate:   profile.lastDonationDate || null,
        coordinates:        profile.location?.coordinates || [],
        responseStatus:     r.responseStatus,
        respondedAt:        r.respondedAt,
      };
    }).sort((a, b) => {
      // Available first, then nearest
      if (b.availabilityStatus !== a.availabilityStatus) return b.availabilityStatus - a.availabilityStatus;
      return (a.distanceKm ?? 999) - (b.distanceKm ?? 999);
    });

    res.status(200).json({ success: true, donors, request, total: donors.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET SINGLE REQUEST ───────────────────────────────────────────────────────

export const getBloodRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await bloodRequestModel.findById(id);
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });

    const responses = await bloodRequestResponseModel.find({ requestId: id });
    res.status(200).json({ success: true, request, responses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── DONOR HISTORY ───────────────────────────────────────────────────────────

export const getDonorHistory = async (req, res) => {
  try {
    const userId   = req.userId || null;
    const doctorId = req.query?.docId || req.body?.docId || null;
    const actorId  = userId || doctorId;

    const donor = await bloodDonorModel.findOne(
      userId ? { userId: actorId } : { doctorId: actorId }
    );
    if (!donor) return res.status(404).json({ success: false, message: 'Donor profile not found' });

    const responses = await bloodRequestResponseModel
      .find({ donorId: donor._id })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, history: responses, donor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── ADMIN ENDPOINTS ─────────────────────────────────────────────────────────

export const adminGetAllDonors = async (req, res) => {
  try {
    const page   = parseInt(req.query.page)   || 1;
    const limit  = parseInt(req.query.limit)  || 20;
    const skip   = (page - 1) * limit;
    const search = req.query.search || '';
    const bloodGroup = req.query.bloodGroup || '';

    const query = {};
    if (search) query.fullName = { $regex: search, $options: 'i' };
    if (bloodGroup) query.bloodGroup = bloodGroup;

    const donors = await bloodDonorModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await bloodDonorModel.countDocuments(query);

    res.status(200).json({ success: true, donors, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const adminBlockUnblockDonor = async (req, res) => {
  try {
    const { donorId, action } = req.body; // action: 'block' | 'unblock'
    const donor = await bloodDonorModel.findByIdAndUpdate(
      donorId,
      { isBlocked: action === 'block' },
      { new: true }
    );
    if (!donor) return res.status(404).json({ success: false, message: 'Donor not found' });

    res.status(200).json({
      success: true,
      message: `Donor ${action === 'block' ? 'blocked' : 'unblocked'} successfully`,
      donor,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const adminGetAllRequests = async (req, res) => {
  try {
    const page   = parseInt(req.query.page)  || 1;
    const limit  = parseInt(req.query.limit) || 20;
    const skip   = (page - 1) * limit;
    const status = req.query.status || '';
    const urgency = req.query.urgency || '';

    const query = {};
    if (status) query.status = status;
    if (urgency) query.urgencyType = urgency;

    const requests = await bloodRequestModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await bloodRequestModel.countDocuments(query);

    res.status(200).json({ success: true, requests, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const adminUpdateRequestStatus = async (req, res) => {
  try {
    const { requestId, status } = req.body;
    const allowed = ['active', 'fulfilled', 'cancelled', 'closed'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const request = await bloodRequestModel.findByIdAndUpdate(
      requestId,
      { status, [`${status}At`]: new Date() },
      { new: true }
    );
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });

    res.status(200).json({ success: true, message: 'Request status updated', request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const adminCreateEmergencyRequest = async (req, res) => {
  try {
    const {
      patientName, requiredBloodGroup, contactNumber,
      latitude, longitude, locationName, additionalNotes,
    } = req.body;

    if (!patientName || !requiredBloodGroup || !contactNumber || latitude == null || longitude == null) {
      return res.status(400).json({ success: false, message: 'Required fields missing' });
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    const bloodRequest = new bloodRequestModel({
      requestorType: 'admin',
      requestorId:   'admin',
      requestorName: 'Admin',
      patientName, requiredBloodGroup, contactNumber,
      location: { type: 'Point', coordinates: [lng, lat] },
      locationName: locationName || '',
      urgencyType: 'emergency',
      additionalNotes: additionalNotes || '',
      status: 'active',
    });
    await bloodRequest.save();

    // Broadcast to ALL available compatible donors
    const compatibleGroups = getCompatibleDonors(requiredBloodGroup);
    const donors = await bloodDonorModel.aggregate([
      {
        $geoNear: {
          near: { type: 'Point', coordinates: [lng, lat] },
          distanceField: 'distance',
          maxDistance: 50000,
          spherical: true,
          query: { bloodGroup: { $in: compatibleGroups }, availabilityStatus: true, isBlocked: false },
        },
      },
      { $sort: { distance: 1 } },
      { $limit: 200 },
    ]);

    const title   = '🆘 EMERGENCY Blood Alert';
    const message = `EMERGENCY: ${requiredBloodGroup} blood critically needed near ${locationName || 'your area'}. Patient: ${patientName}`;

    if (donors.length > 0) {
      await bloodNotificationModel.insertMany(
        donors.map((d) => ({
          recipientType: d.donorType,
          recipientId:   d.donorType === 'user' ? d.userId : d.doctorId,
          requestId:     bloodRequest._id,
          type:          'emergency_broadcast',
          title, message,
          urgencyType:   'emergency',
        }))
      );

      const io = getIo(req);
      if (io) {
        donors.forEach((d) => {
          const rid = d.donorType === 'user' ? d.userId : d.doctorId;
          if (rid) io.to(`blood-${rid}`).emit('blood_notification', { type: 'emergency_broadcast', title, message, urgencyType: 'emergency', requestId: bloodRequest._id });
        });
      }

      donors.forEach((d) => {
        sendBloodRequestAlertEmail(d.email, d.fullName, requiredBloodGroup, patientName, contactNumber, locationName || 'Nearby', 'emergency', (d.distance / 1000).toFixed(1)).catch(() => {});
      });
    }

    await bloodRequestModel.findByIdAndUpdate(bloodRequest._id, { notifiedCount: donors.length });

    res.status(201).json({ success: true, message: 'Emergency request broadcast', notifiedCount: donors.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const adminGetAnalytics = async (req, res) => {
  try {
    const [
      totalDonors,
      availableDonors,
      totalRequests,
      activeRequests,
      fulfilledRequests,
      emergencyRequests,
      donorsByBloodGroup,
      requestsByUrgency,
    ] = await Promise.all([
      bloodDonorModel.countDocuments({ isBlocked: false }),
      bloodDonorModel.countDocuments({ availabilityStatus: true, isBlocked: false }),
      bloodRequestModel.countDocuments(),
      bloodRequestModel.countDocuments({ status: 'active' }),
      bloodRequestModel.countDocuments({ status: 'fulfilled' }),
      bloodRequestModel.countDocuments({ urgencyType: 'emergency' }),
      bloodDonorModel.aggregate([
        { $match: { isBlocked: false } },
        { $group: { _id: '$bloodGroup', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      bloodRequestModel.aggregate([
        { $group: { _id: '$urgencyType', count: { $sum: 1 } } },
      ]),
    ]);

    res.status(200).json({
      success: true,
      analytics: {
        totalDonors, availableDonors, totalRequests,
        activeRequests, fulfilledRequests, emergencyRequests,
        donorsByBloodGroup, requestsByUrgency,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const adminGetNotificationLogs = async (req, res) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip  = (page - 1) * limit;

    const logs = await bloodNotificationModel
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await bloodNotificationModel.countDocuments();

    res.status(200).json({ success: true, logs, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const adminDeleteDonor = async (req, res) => {
  try {
    const { donorId } = req.body;
    await bloodDonorModel.findByIdAndDelete(donorId);
    res.status(200).json({ success: true, message: 'Donor removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const adminToggleDonorAvailability = async (req, res) => {
  try {
    const { donorId } = req.body;
    const donor = await bloodDonorModel.findById(donorId);
    if (!donor) return res.status(404).json({ success: false, message: 'Donor not found' });

    const previous = donor.availabilityStatus;
    donor.availabilityStatus = !previous;
    await donor.save();

    await donorAvailabilityLogModel.create({
      donorId: donor._id,
      previousStatus: previous,
      newStatus: donor.availabilityStatus,
      changedBy: 'admin',
    });

    res.status(200).json({ success: true, availabilityStatus: donor.availabilityStatus });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
