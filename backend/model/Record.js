import mongoose from "mongoose";

export const RECORD_COLLECTIONS = [
  "exercises",
  "exercise_sessions",
  "pain_logs",
  "treatment_plans",
  "therapist_patient_assignments",
  "appointments",
  "therapist_messages",
  "audit_logs",
];

const recordSchema = new mongoose.Schema(
  {
    record_type: { type: String, required: true, enum: RECORD_COLLECTIONS },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    patient_id: { type: String, index: true },
    therapist_id: { type: String, index: true },
    created_at: { type: Date, default: Date.now },
  },
  { strict: false, versionKey: false }
);

recordSchema.index({ record_type: 1, patient_id: 1, created_at: -1 });
recordSchema.index({ record_type: 1, therapist_id: 1, created_at: -1 });

export default mongoose.model("Record", recordSchema);
