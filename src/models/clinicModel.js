const mongoose = require('mongoose');
const SubscriptionPlan = require('./subscriptionModel'); 
 
const clinicSchema = new mongoose.Schema({
  clinicName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  country: { type: String, required: true },
  city: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  databaseName: { type: String, required: true, unique: true },
  specialization: { type: String, required: true },
  description: { type: String },
  clinicImage: { type: String }, 
  clinicBackendId: { type: String },
  status: { 
    type: String, 
    enum: ['active', 'inactive'],
    default: 'active'
  },
  subscriptionType: {
    type: String,
    enum: ['trial', 'subscription'],
    default: 'trial'
  },
  subscriptionPlan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubscriptionPlan',
    required: true
  },
  trialEndDate: { type: Date },
  subscriptionEndDate: { type: Date },
  registrationDate: { type: Date, default: Date.now },

}, { timestamps: true });

clinicSchema.pre('save', async function(next) {
  if (this.isNew) {
    this.trialEndDate = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000); // 15 days from now
    if (!this.subscriptionPlan) {
      const trialPlan = await SubscriptionPlan.findOne({ name: 'Trial Plan' });
      this.subscriptionPlan = trialPlan ? trialPlan._id : null;
    }
  }
  next();
});

clinicSchema.methods.createDatabase = async function(databaseService) {
  try {
    const { dbName, clinicDb } = await databaseService.createClinicDatabase(this.clinicName);
    this.databaseName = dbName;
    this.clinicBackendId = clinicDb.id;
    
    const AppointmentModel = databaseService.createAppointmentModel(clinicDb);
  } catch (error) {
    console.error('Error in createDatabase method:', error);
    throw error;
  }
};

module.exports = mongoose.model('Clinic', clinicSchema);