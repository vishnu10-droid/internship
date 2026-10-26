import mongoose from "mongoose";
import Record, { RECORD_COLLECTIONS } from "../model/Record.js";
import User from "../model/User.js";

const patientCollections = new Set([
  "exercises",
  "exercise_sessions",
  "pain_logs",
  "treatment_plans",
  "therapist_patient_assignments",
  "appointments",
  "therapist_messages",
]);
const therapistCollections = new Set([
  "exercises",
  "exercise_sessions",
  "pain_logs",
  "treatment_plans",
  "therapist_patient_assignments",
  "appointments",
  "therapist_messages",
]);
const patientWritable = new Set(["exercise_sessions", "pain_logs", "appointments", "therapist_messages"]);
const therapistWritable = new Set([
  "exercises",
  "treatment_plans",
  "therapist_patient_assignments",
  "appointments",
  "therapist_messages",
]);
const reservedFields = new Set(["_id", "id", "__v", "collection", "record_type", "created_by"]);
const filterOperators = new Set(["eq", "gte", "lte"]);

const validateCollection = (collection) => {
  if (!RECORD_COLLECTIONS.includes(collection)) {
    const error = new Error("Unknown record collection");
    error.status = 404;
    throw error;
  }
};

const parseFilters = (raw) => {
  if (!raw) return [];
  let filters;
  try {
    filters = JSON.parse(raw);
  } catch {
    const error = new Error("Invalid filters");
    error.status = 400;
    throw error;
  }
  if (!Array.isArray(filters) || filters.length > 20) {
    const error = new Error("Invalid filters");
    error.status = 400;
    throw error;
  }
  return filters.map(({ field, operator = "eq", value }) => {
    if (
      typeof field !== "string" ||
      !/^[a-zA-Z][a-zA-Z0-9_]*$/.test(field) ||
      reservedFields.has(field) ||
      !filterOperators.has(operator) ||
      (value !== null &&
        !["string", "number", "boolean"].includes(typeof value)) ||
      (typeof value === "number" && !Number.isFinite(value))
    ) {
      const error = new Error("Invalid filter field or operator");
      error.status = 400;
      throw error;
    }
    const dateFields = new Set(["created_at", "updated_at", "started_at", "completed_at"]);
    if (
      dateFields.has(field) &&
      typeof value === "string" &&
      !Number.isNaN(Date.parse(value))
    ) {
      value = new Date(value);
    }
    return { field, operator, value };
  });
};

const buildQuery = async (req, collection) => {
  const query = { record_type: collection };
  if (req.user.role === "patient") {
    if (!patientCollections.has(collection)) {
      const error = new Error("You do not have access to this collection");
      error.status = 403;
      throw error;
    }
    if (collection === "exercises") {
      query.$or = [{ patient_id: req.user.id }, { patient_id: { $exists: false } }];
    } else if (collection === "therapist_patient_assignments") {
      query.patient_id = req.user.id;
    } else {
      query.patient_id = req.user.id;
    }
  } else if (req.user.role === "physiotherapist") {
    if (!therapistCollections.has(collection)) {
      const error = new Error("You do not have access to this collection");
      error.status = 403;
      throw error;
    }
    if (collection === "treatment_plans" || collection === "therapist_patient_assignments") {
      query.therapist_id = req.user.id;
    } else if (collection === "pain_logs" || collection === "exercise_sessions" || collection === "appointments") {
      const assignments = await Record.find({
        record_type: "therapist_patient_assignments",
        therapist_id: req.user.id,
      }).select("patient_id");
      query.patient_id = { $in: assignments.map((entry) => entry.patient_id) };
    } else if (collection === "therapist_messages") {
      query.therapist_id = req.user.id;
    }
  }

  const filters = parseFilters(req.query.filters);
  const extra = filters.map(({ field, operator, value }) => ({
    [field]: operator === "eq" ? value : { [operator === "gte" ? "$gte" : "$lte"]: value },
  }));
  if (extra.length) query.$and = extra;
  return query;
};

const serialize = (record) => {
  const result = record.toObject();
  result.id = result._id.toString();
  delete result._id;
  delete result.created_by;
  delete result.record_type;
  return result;
};

const addPatientDetails = async (items, include) => {
  if (!include?.split(",").includes("patients")) return items;
  const ids = [...new Set(items.map((item) => item.patient_id).filter(Boolean))];
  const users = await User.find({ _id: { $in: ids } }).select("full_name email role createdAt");
  const usersById = new Map(users.map((user) => [user._id.toString(), user]));

  return items.map((item) => {
    const patient = usersById.get(String(item.patient_id));
    return {
      ...item,
      patients: patient
        ? {
            full_name: patient.full_name,
            email: patient.email,
            role: patient.role,
            created_at: patient.createdAt,
          }
        : null,
    };
  });
};

const canWrite = (user, collection) =>
  user.role === "admin" ||
  (user.role === "patient" && patientWritable.has(collection)) ||
  (user.role === "physiotherapist" && therapistWritable.has(collection));

const canUpdate = (user, collection) =>
  canWrite(user, collection) ||
  (user.role === "patient" && collection === "exercises");

const validateRecordFields = (value) => {
  if (!value || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value)) {
    if (key.startsWith("$") || key.includes(".") || key === "__proto__") {
      const error = new Error("Record contains an invalid field");
      error.status = 400;
      throw error;
    }
    validateRecordFields(child);
  }
};

export const listRecords = async (req, res, next) => {
  try {
    const { collection } = req.params;
    validateCollection(collection);
    const query = await buildQuery(req, collection);
    const sortField = typeof req.query.sort === "string" ? req.query.sort : "created_at";
    if (!/^[a-zA-Z][\w]*$/.test(sortField) || reservedFields.has(sortField)) {
      return res.status(400).json({ success: false, message: "Invalid sort field" });
    }

    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 100, 1), 500);
    const direction = req.query.direction === "asc" ? 1 : -1;
    const records = await Record.find(query).sort({ [sortField]: direction }).limit(limit);
    const items = await addPatientDetails(records.map(serialize), req.query.include);
    res.json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
};

export const createRecord = async (req, res, next) => {
  try {
    const { collection } = req.params;
    validateCollection(collection);
    if (!canWrite(req.user, collection)) {
      return res.status(403).json({ success: false, message: "You cannot create this record" });
    }
    if (!req.body || Array.isArray(req.body) || typeof req.body !== "object") {
      return res.status(400).json({ success: false, message: "A record object is required" });
    }

    const body = { ...req.body };
    for (const field of reservedFields) delete body[field];
    validateRecordFields(body);
    if (req.user.role === "patient") body.patient_id = req.user.id;
    if (req.user.role === "physiotherapist") body.therapist_id = req.user.id;

    if (collection === "pain_logs" && (!Number.isFinite(Number(body.pain)) || Number(body.pain) < 0 || Number(body.pain) > 10)) {
      return res.status(400).json({ success: false, message: "Pain must be a number from 0 to 10" });
    }
    if (collection === "therapist_patient_assignments") {
      const patient = await User.findOne({ _id: body.patient_id, role: "patient" });
      if (!patient) {
        return res.status(400).json({ success: false, message: "A valid patient account is required" });
      }
    }
    const record = await Record.create({
      ...body,
      record_type: collection,
      created_by: req.user._id,
    });
    res.status(201).json({ success: true, data: serialize(record) });
  } catch (error) {
    next(error);
  }
};

export const updateRecord = async (req, res, next) => {
  try {
    const { collection, id } = req.params;
    validateCollection(collection);
    if (!canUpdate(req.user, collection)) {
      return res.status(403).json({ success: false, message: "You cannot update this record" });
    }
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid record id" });
    }

    const query = await buildQuery(req, collection);
    if (req.user.role === "patient" && collection === "exercises") {
      delete query.$or;
      query.patient_id = req.user.id;
    }
    query._id = id;
    const changes = { ...req.body };
    for (const field of reservedFields) delete changes[field];
    delete changes.patient_id;
    delete changes.therapist_id;
    validateRecordFields(changes);
    if (
      req.user.role === "patient" &&
      collection === "exercises" &&
      (Object.keys(changes).some((field) => field !== "completed") ||
        typeof changes.completed !== "boolean")
    ) {
      return res.status(403).json({ success: false, message: "Patients can only update exercise completion" });
    }
    const record = await Record.findOneAndUpdate(query, { $set: changes }, { new: true, runValidators: true });
    if (!record) return res.status(404).json({ success: false, message: "Record not found" });
    res.json({ success: true, data: serialize(record) });
  } catch (error) {
    next(error);
  }
};

export const deleteRecord = async (req, res, next) => {
  try {
    const { collection, id } = req.params;
    validateCollection(collection);
    if (!canWrite(req.user, collection)) {
      return res.status(403).json({ success: false, message: "You cannot delete this record" });
    }
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid record id" });
    }
    const query = await buildQuery(req, collection);
    query._id = id;
    const result = await Record.deleteOne(query);
    if (!result.deletedCount) return res.status(404).json({ success: false, message: "Record not found" });
    res.json({ success: true, data: { id } });
  } catch (error) {
    next(error);
  }
};
